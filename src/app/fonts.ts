import localFont from "next/font/local";

export const plusJakartaSans = localFont({
  src: "./fonts/plus-jakarta-sans-latin.woff2",
  variable: "--font-plus-jakarta-sans",
  display: "swap",
  weight: "700 800",
});

export const workSans = localFont({
  src: "./fonts/work-sans-latin.woff2",
  variable: "--font-work-sans",
  display: "swap",
  weight: "400 600",
});

export const bricolageGrotesque = localFont({
  src: "./fonts/bricolage-grotesque-latin.woff2",
  variable: "--font-bricolage-grotesque",
  display: "swap",
  weight: "500",
});

export const materialSymbolsOutlined = localFont({
  src: "./fonts/material-symbols-outlined.woff2",
  variable: "--font-material-symbols-outlined",
  display: "block",
  weight: "100 700",
});
