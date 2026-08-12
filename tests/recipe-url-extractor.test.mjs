import assert from "node:assert/strict";
import test from "node:test";

import {
  createPinnedRequestOptions,
  extractRecipeFromUrl,
  fetchSafeHtml,
  validateRecipeUrl,
} from "../src/lib/imports/recipe-url-extractor.ts";

const publicIpv4 = { address: "93.184.216.34", family: 4 };
const publicIpv6 = { address: "2606:4700:4700::1111", family: 6 };

function body(...chunks) {
  return (async function* () {
    for (const chunk of chunks) {
      yield typeof chunk === "string" ? new TextEncoder().encode(chunk) : chunk;
    }
  })();
}

function response(statusCode, headers = {}, chunks = ["<html><title>Recipe</title></html>"]) {
  return { body: body(...chunks), cancel() {}, headers, statusCode };
}

function dependencies({
  addresses = [publicIpv4],
  request = async () => response(200, { "content-type": "text/html; charset=utf-8" }),
  timeoutMs,
} = {}) {
  return {
    lookup: async () => addresses,
    request,
    timeoutMs,
  };
}

test("accepts normal public HTTP and HTTPS destinations", async () => {
  for (const value of ["http://recipes.example/dinner", "https://recipes.example/dinner"]) {
    const result = await fetchSafeHtml(new URL(value), dependencies());
    assert.equal(result.status, 200);
    assert.match(result.html, /Recipe/);
  }

  const ipv6Result = await fetchSafeHtml(
    new URL("https://recipes.example/dinner"),
    dependencies({ addresses: [publicIpv6] }),
  );
  assert.equal(ipv6Result.status, 200);
});

test("rejects unsupported URL protocols", async () => {
  for (const value of [
    "file:///etc/passwd",
    "ftp://recipes.example/dinner",
    "data:text/html,<h1>Recipe</h1>",
    "javascript:alert(1)",
  ]) {
    assert.equal(validateRecipeUrl(value), null);
  }

  await assert.rejects(
    fetchSafeHtml(new URL("ftp://recipes.example/dinner"), dependencies()),
  );
});

test("rejects localhost", async () => {
  await assert.rejects(fetchSafeHtml(new URL("http://localhost/recipe"), dependencies()));
});

test("rejects IPv4 loopback", async () => {
  await assert.rejects(fetchSafeHtml(new URL("http://127.0.0.1/recipe"), dependencies()));
});

test("rejects private IPv4 destinations", async () => {
  for (const address of ["10.0.0.1", "172.16.1.1", "192.168.1.1"]) {
    await assert.rejects(fetchSafeHtml(new URL(`http://${address}/recipe`), dependencies()));
  }
});

test("rejects a public-looking hostname when DNS returns a private address", async () => {
  let requested = false;
  await assert.rejects(
    fetchSafeHtml(
      new URL("https://recipes.example/recipe"),
      dependencies({
        addresses: [{ address: "10.0.0.8", family: 4 }],
        request: async () => {
          requested = true;
          return response(200, { "content-type": "text/html" });
        },
      }),
    ),
  );
  assert.equal(requested, false);
});

test("rejects link-local and cloud metadata destinations", async () => {
  for (const address of ["169.254.1.1", "169.254.169.254"]) {
    await assert.rejects(fetchSafeHtml(new URL(`http://${address}/recipe`), dependencies()));
  }
});

test("rejects IPv6 loopback and private destinations", async () => {
  for (const address of ["::1", "fc00::1", "fd12:3456::1", "fe80::1"]) {
    await assert.rejects(fetchSafeHtml(new URL(`http://[${address}]/recipe`), dependencies()));
  }
});

test("rejects IPv6 6to4 destinations that embed loopback or private IPv4", async () => {
  for (const address of ["2002:7f00:1::", "2002:0a00:1::"]) {
    await assert.rejects(fetchSafeHtml(new URL(`http://[${address}]/recipe`), dependencies()));
  }
});

test("rejects the extended IPv6 documentation range", async () => {
  await assert.rejects(fetchSafeHtml(new URL("http://[3fff::1]/recipe"), dependencies()));
});

test("rejects mixed public and private DNS answers", async () => {
  let requested = false;
  await assert.rejects(
    fetchSafeHtml(
      new URL("https://recipes.example/recipe"),
      dependencies({
        addresses: [publicIpv4, { address: "10.0.0.8", family: 4 }],
        request: async () => {
          requested = true;
          return response(200, { "content-type": "text/html" });
        },
      }),
    ),
  );
  assert.equal(requested, false);
});

test("supplies the validated address to the transport", async () => {
  let suppliedAddress;
  await fetchSafeHtml(
    new URL("https://recipes.example/recipe"),
    dependencies({
      request: async (_url, address) => {
        suppliedAddress = address;
        return response(200, { "content-type": "text/html" });
      },
    }),
  );
  assert.deepEqual(suppliedAddress, publicIpv4);
});

test("pinned request options disable shared-agent reuse and return only the validated address", async () => {
  const controller = new AbortController();
  const options = createPinnedRequestOptions(publicIpv4, controller.signal);
  assert.equal(options.agent, false);

  const resolved = await new Promise((resolve, reject) => {
    options.lookup("recipes.example", { all: true }, (error, addresses) => {
      if (error) reject(error);
      else resolve(addresses);
    });
  });
  assert.deepEqual(resolved, [publicIpv4]);
});

test("rejects URL credentials", async () => {
  await assert.rejects(
    fetchSafeHtml(new URL("https://user:secret@recipes.example/recipe"), dependencies()),
  );
});

test("accepts a safe public redirect after revalidation", async () => {
  const seen = [];
  const result = await fetchSafeHtml(
    new URL("https://recipes.example/start"),
    dependencies({
      request: async (url) => {
        seen.push(url.toString());
        return seen.length === 1
          ? response(302, { location: "https://cdn.example/recipe" }, [])
          : response(200, { "content-type": "text/html" });
      },
    }),
  );

  assert.equal(result.url.toString(), "https://cdn.example/recipe");
  assert.deepEqual(seen, ["https://recipes.example/start", "https://cdn.example/recipe"]);
});

test("accepts and revalidates a relative redirect", async () => {
  const seen = [];
  const result = await fetchSafeHtml(
    new URL("https://recipes.example/start"),
    dependencies({
      request: async (url) => {
        seen.push(url.toString());
        return seen.length === 1
          ? response(302, { location: "/recipes/dinner" }, [])
          : response(200, { "content-type": "text/html" });
      },
    }),
  );

  assert.equal(result.url.toString(), "https://recipes.example/recipes/dinner");
  assert.deepEqual(seen, [
    "https://recipes.example/start",
    "https://recipes.example/recipes/dinner",
  ]);
});

test("rejects credentials introduced by a redirect", async () => {
  let requestCount = 0;
  await assert.rejects(
    fetchSafeHtml(
      new URL("https://recipes.example/start"),
      dependencies({
        request: async () => {
          requestCount += 1;
          return response(302, { location: "https://user:secret@cdn.example/recipe" }, []);
        },
      }),
    ),
  );
  assert.equal(requestCount, 1);
});

test("rejects a redirect to an unsafe destination before requesting it", async () => {
  let requestCount = 0;
  await assert.rejects(
    fetchSafeHtml(
      new URL("https://recipes.example/start"),
      dependencies({
        request: async () => {
          requestCount += 1;
          return response(302, { location: "http://169.254.169.254/latest/meta-data" }, []);
        },
      }),
    ),
  );
  assert.equal(requestCount, 1);
});

test("rejects an excessive redirect chain", async () => {
  let requestCount = 0;
  await assert.rejects(
    fetchSafeHtml(
      new URL("https://recipes.example/0"),
      dependencies({
        request: async (url) => {
          requestCount += 1;
          const step = Number(url.pathname.slice(1));
          return response(302, { location: `https://recipes.example/${step + 1}` }, []);
        },
      }),
    ),
  );
  assert.equal(requestCount, 4);
});

test("rejects non-HTML responses", async () => {
  await assert.rejects(
    fetchSafeHtml(
      new URL("https://recipes.example/file.pdf"),
      dependencies({
        request: async () => response(200, { "content-type": "application/pdf" }, ["pdf"]),
      }),
    ),
  );
});

test("rejects an oversized streamed response even without Content-Length", async () => {
  const oversized = new Uint8Array(2 * 1024 * 1024 + 1);
  let canceled = false;
  await assert.rejects(
    fetchSafeHtml(
      new URL("https://recipes.example/huge"),
      dependencies({
        request: async () => ({
          ...response(200, { "content-type": "text/html" }, [oversized]),
          cancel() {
            canceled = true;
          },
        }),
      }),
    ),
  );
  assert.equal(canceled, true);
});

test("rejects an oversized declared Content-Length before reading the body", async () => {
  let canceled = false;
  let bodyRead = false;
  await assert.rejects(
    fetchSafeHtml(
      new URL("https://recipes.example/huge"),
      dependencies({
        request: async () => ({
          body: (async function* () {
            bodyRead = true;
            yield new Uint8Array();
          })(),
          cancel() {
            canceled = true;
          },
          headers: {
            "content-length": String(2 * 1024 * 1024 + 1),
            "content-type": "text/html",
          },
          statusCode: 200,
        }),
      }),
    ),
  );
  assert.equal(canceled, true);
  assert.equal(bodyRead, false);
});

test("rejected automatic fetching returns the existing manual-review fallback", async () => {
  const sourceUrl = "http://127.0.0.1/private-recipe";
  const result = await extractRecipeFromUrl(new URL(sourceUrl), dependencies());

  assert.equal(result.status, "failed");
  assert.equal(result.recipe.sourceUrl, sourceUrl);
  assert.match(result.message, /link is saved/i);
});

test("streaming timeout returns the existing manual-review fallback", async () => {
  const result = await extractRecipeFromUrl(
    new URL("https://recipes.example/slow"),
    dependencies({
      request: async (_url, _address, signal) => ({
        ...response(200, { "content-type": "text/html" }, []),
        body: (async function* () {
          await new Promise((resolve, reject) => {
            signal.addEventListener("abort", () => reject(signal.reason), { once: true });
          });
          yield new Uint8Array();
        })(),
      }),
      timeoutMs: 5,
    }),
  );

  assert.equal(result.status, "failed");
  assert.match(result.message, /link is saved/i);
});
