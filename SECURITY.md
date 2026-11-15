# Security Policy

## Supported versions

Security fixes are applied to the `main` branch, which is the version deployed at https://quran.zekr.by.zooka-ai.com.

## Reporting a vulnerability

1. **Do not** open a public GitHub issue.
2. Use GitHub's private reporting: **Security → Report a vulnerability** on this repository, or email security@zooka-ai.com.
3. Include what you found, how to reproduce it, and what data or users it affects.
4. You should receive an acknowledgment within 48 hours.

## Scope

In scope: this codebase and the deployed app, including anything that exposes user data (bookmarks, memorisation progress, assistant conversations) or lets someone act as another user or as an admin.

Out of scope: third-party services the app calls (audio CDNs, prayer-time API, the hosting platform). Report those to their owners.

## Data handled

The app stores reading data, bookmarks and progress in the browser. Assistant messages are sent to a hosted language model through the platform integration. No API keys or credentials are kept in this repository.
