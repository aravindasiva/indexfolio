# Contributing to Indexfolio

Thanks for your interest in contributing. This project is maintained by one person. Contributions are welcome and reviewed when time allows, usually within a week.

## Before you start

- Check existing issues before opening a new one
- For large features, open an issue first to discuss before writing code
- Small fixes (typos, bugs, docs) - just open a PR directly
- All PRs must target the `dev` branch, never `main`

## How to contribute

1. Fork the repo
2. Create a branch from `dev`

```bash
git checkout dev
git pull origin dev
git checkout -b your-branch-name
```

3. Make your changes
4. Run all checks locally

```bash
pnpm lint
pnpm typecheck
pnpm test
```

5. Commit using conventional commits

```
feat: add X
fix: correct Y
docs: update Z
chore: update deps
data: add holdings scraper for X
```

6. Push and open a PR targeting `dev`

## PR requirements

- Target branch must be `dev` - PRs targeting `main` will be closed
- All CI checks must pass before review
- One approval required from maintainer
- Clear description of what changed and why
- Screenshots required for any UI changes

## Adding a country tax module

This is the highest value contribution you can make. Each country is an isolated module in `packages/tax-engine/`. You only need to add one file and its tests. See the country tax module issue template for the full spec.

Only contribute a country module if you are a tax resident of that country or have verified the rules against official government sources. Include your sources in the PR.

## What will not be merged

- PRs targeting `main` directly
- Features that add significant ongoing maintenance burden without prior discussion
- UI changes without screenshots
- Any change that removes or weakens the financial advice disclaimer
- Dependencies that duplicate existing ones
- Breaking changes without prior issue discussion

## Response time

Solo-maintained project. PRs reviewed when possible, usually within a week. No guaranteed timeline.

## Questions

Open an issue with the label `question` or start a thread in GitHub Discussions.
