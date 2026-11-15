# Zekr AI — Quran & Tafseer companion for Arabic speakers

**ذِكر** — رفيق قرآني مجاني ومفتوح المصدر للناطقين بالعربية: قراءة، تفسير، تلاوات، أذكار، مواقيت صلاة، وخطط حفظ، مع مساعد ذكي يجيب بالعربية.

- **Live app:** https://quran.zekr.by.zooka-ai.com
- **License:** [MIT](LICENSE)
- **Status:** deployed and in use; AI layer being migrated to small open models (see [Roadmap](#roadmap))

---

## Why this exists

Arabic-speaking Muslims who want to read, understand and memorise the Quran are served mostly by apps that are either ad-funded, closed, or built around general-purpose chatbots that answer religious questions with no grounding in recognised tafseer. Zekr is a free, ad-free alternative built for one community and one job: helping an Arabic reader get from a verse to a trustworthy explanation of it.

## What it does today

| Area | Features |
| --- | --- |
| Quran | Surah and verse reading, search, bookmarks, related verses, reasons of revelation |
| Tafseer | Per-verse tafseer and side-by-side comparison of tafseer sources |
| Audio | Recitations from multiple reciters, verse-by-verse sync, Quran radio streams |
| Daily practice | Adhkar, duaa, prayer times, qibla compass, reminders |
| Learning | Memorisation plans and progress, achievements, a kids section, seerah and stories of the prophets |
| Assistant | Arabic text and voice assistant for questions about verses and their meaning |

Reading data, bookmarks, memorisation progress and reading history are cached in the browser (`localStorage`) so they stay available when the connection drops.

## How the AI works — stated plainly

- **Today:** assistant features call a hosted LLM through the Base44 platform integration (`InvokeLLM`). The model is chosen by that platform and is not run by this project. Prompts instruct it to rely on recognised tafseer (al-Sa'di, Ibn Kathir, al-Tabari) and to refer users to a qualified scholar for rulings.
- **What is sent:** the user's message, the last few turns of the conversation, and the current app context (for example, which surah is open).
- **What is not in this repo:** no API keys or model credentials. Configuration is supplied through environment variables.

- **Tafsir retrieval (shipped, no model):** "تفسير الآية من مصدره" on the Tafsir page retrieves the passage for a verse from a named tafsir (Ibn Kathir, al-Sa'di or al-Tabari) and shows it with its source and author. Al-Fatiha ships inside the app (`public/tafsir-seed/`), so it works with no network at all; other surahs are fetched once from a pinned dataset commit and kept in the browser's Cache Storage for offline reading afterwards. No model is involved on this path and nothing is sent to a server.
- **Small model on the device: not shipped.** An earlier attempt ran Qwen2.5-1.5B-Instruct in the browser through [WebLLM](https://github.com/mlc-ai/web-llm) to simplify the passage and answer from it only. It stayed experimental and is **disabled by default**: the code is still in the repository behind `VITE_ENABLE_LOCAL_SIMPLIFY=true`, but the measured acceptance gate failed: of ten Arabic questions on ten different verses, seven returned the refusal line, two produced unusable answers and one misattributed the commentator's words. Until retrieval is improved and the model re-measured, the app shows the quoted tafsir and no generate button. Details and the measured numbers: [docs/LOCAL_TAFSIR.md](docs/LOCAL_TAFSIR.md).

The hosted model is the part of the project we most want to remove. See the roadmap.

## Design principles

| Principle | Where we are | Where we are going |
| --- | --- | --- |
| **Small** | Assistant runs on a hosted general-purpose LLM | An open-weights model of 10B parameters or fewer with tafseer retrieval, running on-device where possible |
| **Intentional** | Reading works without an account; reading data is cached in the browser; assistant messages leave the device | Local-only history by default, an assistant off-switch, full offline use |
| **Tailored** | Arabic-first, right-to-left interface built around reading, tafseer, recitation and memorisation | Answers that cite a named tafseer, reviewed by qualified scholars |

## Roadmap

1. **Small, open model.** Replace the hosted LLM with an open-weights model of 10B parameters or fewer, grounded in a local tafseer corpus through retrieval, so answers cite their source instead of generating from memory.
2. **On-device and offline.** Ship the app as an installable PWA with a service worker, a bundled Quran and tafseer dataset, and in-browser inference for the assistant where the device allows it.
3. **User control.** No account needed to read; a clear switch to turn the assistant off; local-only history by default with one-tap delete.
4. **Platform independence.** Remove the dependency on Base44 so anyone can self-host the full stack.
5. **Scholarly review.** A published evaluation set of Arabic questions, reviewed by qualified scholars, to measure answer accuracy before each release.

## Run it locally

Requirements: Node.js 20+ and npm.

```bash
git clone https://github.com/ZOOKA-AI/zekr-ai-quran-tafseer.git
cd zekr-ai-quran-tafseer
npm install
```

Create a `.env.local` file (it is git-ignored):

```bash
VITE_BASE44_APP_ID=your_app_id
VITE_BASE44_BACKEND_URL=your_backend_url
```

Then:

```bash
npm run dev       # start the dev server
npm run build     # production build into ./dist
npm run lint      # ESLint
```

Reading, audio and prayer-time features use public endpoints and work without a Base44 backend. The assistant, accounts and saved data need the two variables above.

## Project layout

```
src/pages/         one file per screen (Quran, Tafsir, Tilawa, Adhkar, PrayerTimes, ...)
src/components/    quran/, assistant/, tilawa/, offline/, ui/ ...
src/api/           Base44 client, entities and integrations
base44/entities/   data model (Verse, Bookmark, MemorizationPlan, ...)
base44/agents/     assistant definition and its data permissions
```

## Data sources and credits

- Tafseer text: [spa5k/tafsir_api](https://github.com/spa5k/tafsir_api) (static JSON, texts from qul.tarteel.ai)
- Recitation audio: [EveryAyah](https://everyayah.com), [Islamic Network CDN](https://islamic.network), mp3quran.net
- Prayer times: [Aladhan API](https://aladhan.com/prayer-times-api)
- Reverse geocoding: [OpenStreetMap Nominatim](https://nominatim.org)
- UI: React, Vite, Tailwind CSS, Radix UI

## Contributing and security

See [CONTRIBUTING.md](CONTRIBUTING.md). Religious content must cite its source, and the project accepts no tracking or advertising code. Report vulnerabilities privately as described in [SECURITY.md](SECURITY.md) — please do not open a public issue.

## License

MIT © ZOOKA-AI. The Quran text and recitations belong to their respective publishers and reciters.
