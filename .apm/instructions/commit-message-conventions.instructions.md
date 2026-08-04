---
description: Enforces Conventional Commits with consistent types, inferred scopes, and concise English subjects. Use when generating or reviewing Git commit messages.
---

# Commit message conventions

When generating Git commit messages, use Conventional Commits.

Format:

<type>(<scope>): <description>

Allowed types:

- feat
- fix
- refactor
- test
- docs
- chore
- build
- ci
- perf
- style

Rules:

- Write all commit messages in English.
- Infer scope from changed files.
- Keep subject under 72 characters.
- Use the concise imperative mood.
- Do not use vague messages like "update files" or "misc changes".
