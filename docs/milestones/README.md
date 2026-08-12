# Milestone Tracker

Current working branch: `clean-milestone-4-sync`.

`main` is stale/unrelated and must not be used for active work.

## Current position

- M0–M20: complete
- M20.1 import security hardening: complete
- M21 Private Beta Testing: **engineering complete / live closeout NO-GO**
- M22 Beta Findings & Launch Decision: **not started**

Founder UAT previously passed the full Import → Save → Plan → Shop → Cook loop. M21 is now proving the same experience with two independent users/Restaurants and preparing the product for a controlled private beta.

| Milestone | Scope | Status | Record |
| --- | --- | --- | --- |
| 0 | Project Setup | Complete | [Milestone 0](MILESTONE_0.md) |
| 1 | Auth + Restaurants | Complete | [Milestone 1](MILESTONE_1.md) |
| 2 | Cookbook + Recipes | Complete | [Milestone 2](MILESTONE_2.md) |
| 3 | Imports | Complete | [Milestone 3](MILESTONE_3.md) |
| 4 | Recipe Books + Search | Complete | [Milestone 4](MILESTONE_4.md) |
| 5 | Menu | Complete | [Milestone 5](MILESTONE_5.md) |
| 6 | Shopping | Complete | [Milestone 6](MILESTONE_6.md) |
| 7 | Cook Mode | Complete | [Milestone 7](MILESTONE_7.md) |
| 8 | Basic Big Al | Complete | [Milestone 8](MILESTONE_8.md) |
| 11 | URL import hardening | Complete | [Milestone 11](MILESTONE_11.md) |
| 12 | Attribution protection | Complete | [Milestone 12](MILESTONE_12.md) |
| 13 | Restaurant preferences foundation | Complete | [Milestone 13](MILESTONE_13.md) |
| 14 | MVP closeout QA | Complete | [Milestone 14](MILESTONE_14.md) |
| 15 | Founder UAT Closeout | Complete | [Milestone 15](MILESTONE_15.md) |
| 16 | Core Reliability & Error Handling | Complete | [Milestone 16](MILESTONE_16.md) |
| 17 | Import Quality & Attribution Hardening | Complete | [Milestone 17](MILESTONE_17.md) |
| 18 | Shopping List Reliability | Complete | [Milestone 18](MILESTONE_18.md) |
| 19 | Cook Mode Beta Polish | Complete | [Milestone 19](MILESTONE_19.md) |
| 20 | Beta Readiness Review | Complete / GO | [Milestone 20](MILESTONE_20.md) |
| 20.1 | Import Fetch Security Hardening | Complete | M20/M20.1 commit history |
| 21 | Private Beta Testing | Engineering complete / live closeout NO-GO | [Milestone 21](MILESTONE_21.md) |
| 22 | Beta Findings & Launch Decision | Not started | [Milestone 22](MILESTONE_22.md) |

## M21 live gate

Private beta may begin only after:

1. Supabase project `cqcjacirzibfjecrruie` is ACTIVE.
2. `20260812202748_m21_beta_feedback.sql` is verified/applied live.
3. Feedback table/RLS/grants/RPC are verified.
4. Two-user Restaurant isolation passes.
5. Supported public import passes.
6. Rejected localhost import safely falls back to manual review.
7. Both users independently complete Import → Save → Plan → Shop → Cook → Feedback.

## Phase rule

The current phase validates and hardens the product already built. Do not add new product areas to manufacture progress.

Do not build social mechanics, grocery comparison, full pantry inventory, calorie tracking, generic chatbot behaviour or wider-launch features during M21.
