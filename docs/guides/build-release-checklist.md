# 📘 SuiteTools Build & Release Checklist

Last updated: September 22, 2025

---

## 🎯 Purpose

This checklist is a **quick reference** for contributors and maintainers.
It summarizes the most common **deploy commands** (for day‑to‑day development) and **release steps** (for suite‑wide versioning).

For full context, see:

- [📚 Customizing Guide](./customizing.md) — contributor‑level development and deployment
- [🛠️ Build & Release Guide](./build-release-guide.md) — maintainer‑level build and release process

---

## 🚀 Deploy Commands (Users and Contributors)

### Backend

Run from the root of the monorepo:

```bash
yarn workspace backend run deploy
```

- ✅ Ensure your NetSuite auth and SDF configuration are up to date before deploying.

### Frontend

Build and deploy from the root of the monorepo:

```bash
yarn workspace frontend run build-and-deploy
```

- ✅ Ensure your NetSuite auth and SDF configuration are up to date before deploying.
- ✅ Always run a build before deploying frontend changes.
- ❌ Don’t forget to clear your browser cache — stale assets may mask your changes.

## 📦 Release Steps (Maintainers)

1. **Version bump** — update suite‑wide version according to [SemVer](https://semver.org/).
2. **Changelog** — update `CHANGELOG.md` with features, fixes, and migration notes.
3. **Breaking changes** — document impact + migration path clearly.
4. **Tag & push** — create a Git tag for the release version.
5. **Publish** — run release script (CI/CD pipeline or `yarn release`).
6. **Notify** — share release notes with consumers.

---

## ⚠️ Common Pitfalls

- ❌ Skipping `CHANGELOG.md` → ✅ Always document changes
- ❌ Publishing without typecheck/tests → ✅ Run full validation before tagging
- ❌ Cross‑workspace imports → ✅ Use `shared/` outputs only
- ❌ Missing migration notes → ✅ Every breaking change must include guidance

---

## 🔗 Related Docs

- [📚 Customizing Guide](./customizing.md)
- [🛠️ Build & Release Guide](./build-release-guide.md)
