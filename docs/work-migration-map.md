# Work migration map

Full inventory of every real Work item across the old `case-studies` and `gallery-items` collections, and where each one lands in the unified `work` collection. Built per PRD section 12.1 before any migration code was written, so nothing gets silently dropped.

Route decision (PRD 12.4, evidence-led): the 9 former `case-studies` already have live, indexed routes at `/work/{old-id}/` (numeric-prefixed). Those IDs are kept unchanged, zero redirect needed, zero indexing churn. The 9 former `gallery-items` never had individual routes at all, they rendered as non-clickable cards, so there's no existing indexed URL to protect and they get clean slugs with no numeric prefix.

| Old collection | Old ID | Title | Target slug | Target route | Featured | Status | Media | Redirect needed | Result |
|---|---|---|---|---|---|---|---|---|---|
| case-studies | 01-soracha | Soracha | `01-soracha` | `/work/01-soracha/` | yes | delivered | 35 images | no | migrated |
| case-studies | 02-bauntung-digital | Bauntung Digital | `02-bauntung-digital` | `/work/02-bauntung-digital/` | no | delivered | none | no | migrated |
| case-studies | 03-kkbc | KKBC | `03-kkbc` | `/work/03-kkbc/` | yes | delivered | none | no | migrated |
| case-studies | 04-dream-box | Dream Box | `04-dream-box` | `/work/04-dream-box/` | no | delivered | none | no | migrated |
| case-studies | 05-blue-tick-ice | Blue Tick Ice | `05-blue-tick-ice` | `/work/05-blue-tick-ice/` | yes | ongoing | none | no | migrated |
| case-studies | 06-pt-transkon-jaya | PT Transkon Jaya | `06-pt-transkon-jaya` | `/work/06-pt-transkon-jaya/` | yes | delivered | none | no | migrated |
| case-studies | 07-putra-perkasa-abadi | Putra Perkasa Abadi | `07-putra-perkasa-abadi` | `/work/07-putra-perkasa-abadi/` | no | delivered | none | no | migrated |
| case-studies | 08-sinar-mas-land | Sinar Mas Land | `08-sinar-mas-land` | `/work/08-sinar-mas-land/` | yes | delivered | none | no | migrated |
| case-studies | 09-digimune-indonesia | Digimune Indonesia | `09-digimune-indonesia` | `/work/09-digimune-indonesia/` | yes | ongoing | 46 images (4 archive blocks) | no | migrated |
| gallery-items | karsa-tani-perkasa | Karsa Tani Perkasa | `karsa-tani-perkasa` | `/work/karsa-tani-perkasa/` | no | delivered | 27 images | no (new route, never indexed) | migrated |
| gallery-items | arkasa-compliance | Arkasa Compliance | `arkasa-compliance` | `/work/arkasa-compliance/` | no | delivered | 9 images | no (new route, never indexed) | migrated |
| gallery-items | xiaomi | Xiaomi | `xiaomi` | `/work/xiaomi/` | no | delivered | none | no (new route, never indexed) | migrated |
| gallery-items | revou-dm-specialist | RevoU, Digital Marketing Specialist | `revou-dm-specialist` | `/work/revou-dm-specialist/` | no | delivered | none | no (new route, never indexed) | migrated |
| gallery-items | revou-project-officer | RevoU, Project Officer | `revou-project-officer` | `/work/revou-project-officer/` | no | delivered | none | no (new route, never indexed) | migrated |
| gallery-items | pt-global-express-sejahtera | PT Global Express Sejahtera | `pt-global-express-sejahtera` | `/work/pt-global-express-sejahtera/` | no | delivered | none | no (new route, never indexed) | migrated |
| gallery-items | sport-center-balikpapan-baru | Sport Center Balikpapan Baru | `sport-center-balikpapan-baru` | `/work/sport-center-balikpapan-baru/` | no | delivered | 4 images | no (new route, never indexed) | migrated |
| gallery-items | dedekece | Dedekece | `dedekece` | `/work/dedekece/` | no | delivered | none | no (new route, never indexed) | migrated |
| gallery-items | ditlantas-polda-kaltim | Ditlantas Polda Kalimantan Timur | `ditlantas-polda-kaltim` | `/work/ditlantas-polda-kaltim/` | no | delivered | none | no (new route, never indexed) | migrated |

18 of 18 accounted for. Zero silent loss.

## Status call on Ditlantas Polda Kalimantan Timur

The only genuinely ambiguous status call in this set. The source description reads "Real engagement, case study pending. Scope and outcomes not yet documented here" — no language suggesting active/in-progress work, and the same "pending" phrasing appears elsewhere in this dataset (e.g. Digimune Indonesia's IndoTek/Andiamo mentions) meaning "documentation not yet written," not "engagement still running." Marked `delivered` on that basis, per PRD 13.2's instruction not to call thin documentation "ongoing work" by default.

## Ordering

Unified `order` field assigns 1-9 to the former case-studies in their existing order, then 10-18 to the former gallery-items in their existing relative order (karsa-tani-perkasa=10 through ditlantas-polda-kaltim=18). No attempt made to re-rank by "importance", `featured` is the correct mechanism for prominence per PRD 11.3, not `order`.

## Fields not carried forward

The old case-studies schema's `decision`/`moved`/`lesson` fields map to the new schema's `workDone`/`outcomes`/`lessons` respectively (see docs/schema-map.md for the exact mapping). No content was dropped in this rename, only restructured, decision/moved were freeform prose and become structured `workDone` (array) and `outcomes` (array of {value,label}) where the prose contains an extractable metric, with the full original sentence kept as `evidenceNote` so nothing is compressed into a claim the source text didn't make.
