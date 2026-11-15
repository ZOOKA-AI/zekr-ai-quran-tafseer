# Contributing to Zekr AI

Zekr AI is a free, open-source Quran and tafseer companion for Arabic speakers. Contributions are welcome from developers, Arabic-language reviewers, and people with training in Quranic sciences.

## Ways to help

- **Code:** bug fixes, accessibility, RTL layout, offline support, performance on low-end phones.
- **Content review:** report a wrong verse reference, a tafseer attribution error, or an assistant answer that is inaccurate. Include the question asked and the answer given.
- **Roadmap work:** the open items in the README roadmap (small open model, offline PWA, self-hosting) are the highest priority.

## Development workflow

1. Fork the repository and create a branch: `git checkout -b fix/short-description`
2. Install and run: `npm install`, then `npm run dev` (see the README for environment variables)
3. Run `npm run lint` before committing
4. Open a pull request that says what changed and how you tested it

## Ground rules

- **Religious content needs a source.** Any tafseer text, hadith, or ruling added to the app or to a prompt must name the work it comes from. Unsourced religious content will not be merged.
- **No tracking.** Do not add analytics, advertising SDKs, or third-party scripts that collect user data.
- **No secrets.** Never commit API keys, tokens, or `.env` files.
- **Keep it small.** Prefer changes that reduce dependencies and network calls over ones that add them.
- Be respectful. Disagreements about code or content are settled with sources and evidence.

## Decisions

The maintainer (see `CODEOWNERS`) reviews and merges pull requests. Changes to how the assistant answers religious questions are discussed in a public issue before they are merged.

## License

By contributing, you agree that your contribution is licensed under the MIT License.
