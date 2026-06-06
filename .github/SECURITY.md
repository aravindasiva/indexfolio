# Security Policy

## Supported Versions

Only the latest release is actively maintained.

| Version | Supported |
| ------- | --------- |
| Latest  | Yes       |
| Older   | No        |

## Reporting a Vulnerability

Do not open a public GitHub issue for security vulnerabilities.

Use GitHub's private vulnerability reporting instead:
**https://github.com/aravindasiva/indexfolio/security/advisories/new**

Include:

- What you found and where
- Steps to reproduce
- Potential impact

You will get a response within 72 hours.

## Scope

This project handles no personal data, no user accounts, and no financial transactions. The most likely vulnerability class is **data accuracy** (wrong tax rates or ETF data), not data exfiltration.

If you find a financial calculation error, open a normal issue - that is a bug, not a security vulnerability.

Rate limiting and CORS are in place on the API. If you find a bypass, that is in scope for private reporting.
