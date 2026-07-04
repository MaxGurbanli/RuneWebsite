# AGENTS.md (Rune Website)

This repository is a simple static multipage website for Rune.

Key constraints for agents:
- Do not add frameworks or new tooling (no React/Next/Vite, no Tailwind, etc.) unless explicitly requested.
- Keep changes minimal and consistent with existing patterns.

## Repo Overview

Tech:
- HTML files per route (directory-based).
- One global stylesheet: `css/style.css`.
- One global script: `js/main.js` (loaded on every page; vanilla JS, no jQuery).
- CDN fonts (Google Fonts: Cinzel / Alegreya Sans / JetBrains Mono) and AdSense are referenced directly from HTML.

Design system ("runic adventure dark", 2026 redesign):
- Colors/fonts/layout tokens are CSS variables in `:root` (`css/style.css`): warm near-black `--bg`, ember gold `--ember` accents, rune-glow cyan `--glow`, `--font-display`/`--font-body`/`--font-mono`.
- Display font is Cinzel (headings, nav labels, buttons); body is Alegreya Sans; `<cmd>`/`<code>` use JetBrains Mono.
- Elder Futhark glyphs (ᚱ ᚠ ᛒ...) are used decoratively (nav logo, feature-card `data-rune` attributes, dividers).
- Nav + footer markup is duplicated on every page (no templating) - a change to either must be applied to all pages with the correct relative path prefixes.
- The canonical Discord invite for the website is `https://discord.gg/HWRM24fBBK` (Rune HQ). Do not use other invites found elsewhere; those belong to unrelated servers.
- `commands/index.html` items are `<details class="cmd-item">` elements with `data-search` attributes; filtering/search/deep-link logic lives in `js/main.js` (`initCommandsPage`).
- Blog post version headings get anchor ids (e.g. `#v3.4.8`) injected by `js/main.js` at load - don't hand-write them.
- `404.html` at the repo root is the GitHub Pages 404.

Publishing patch notes:
- Use the `/publish-update` skill (`.claude/skills/publish-update/SKILL.md`). It converts Discord-markdown patch notes to the site's HTML conventions, inserts them into `blogs/update-3.x/index.html`, bumps the date there and on the v3.x card in `blogs/index.html`, then commits and pushes.

Tooling status (be explicit):
- No build step (no `package.json`, no bundler).
- No configured linter/formatter.
- No automated test suite.
- `composer.json` exists but is empty (`composer.json`).

No additional agent rule files were found:
- No `.cursorrules` / `.cursor/rules/`.
- No `.github/copilot-instructions.md`.

## Commands (Build/Lint/Test)

There is currently:
- No `build` command.
- No `lint` command.
- No `test` command.
- No way to run a single automated test (no test runner exists).

### Safe Local Preview Commands (Recommended)

Option A: PHP built-in server (closest to current hosting hints)
```bash
php -S localhost:8080
```

Option B: Simple static server
```bash
python -m http.server 8080
```

What to open:
- Home: `http://localhost:8080/`
- Commands: `http://localhost:8080/commands/`
- Blogs: `http://localhost:8080/blogs/`
- Privacy: `http://localhost:8080/tnc-privacy/`

### "Single Test" Equivalent (Manual)

Because there are no automated tests, treat a single-page smoke check as the unit of verification:
- Load exactly one target page.
- Confirm no console errors.
- Click its primary interactions.
- Verify responsive layout at ~1200px, ~965px, and ~600px widths.

## Architecture & Routing

Entry points:
- `index.html` (also served via `index.php` on some hosts).
- `commands/index.html`
- `blogs/index.html` and blog post pages under `blogs/update-*/index.html`
- `tnc-privacy/index.html`

Shared assets:
- Styles: `css/style.css`
- Scripts: `js/main.js`

### Extensionless Routing Caveat (Apache Only)

This repo includes Apache rewrite rules:
- `/.htaccess` rewrites `/path` to `/path.html` for extensionless URLs.

Important implications:
- The extensionless rewrite typically works only when served by Apache with mod_rewrite enabled.
- `php -S` and `python -m http.server` do NOT apply `.htaccess` rules.
- Directory routes like `/commands/` work because they map to `commands/index.html`.
- If you introduce new pages, prefer folder + `index.html` (e.g. `new-page/index.html`) for portability.

Hosting hints (do not change unless asked):
- `Procfile` indicates Heroku PHP + Apache.
- `CNAME` indicates a custom domain for static hosting.

## Code Style Guidelines

### HTML
- Keep pages self-contained and predictable: include `css/style.css` and `js/main.js` using correct relative paths.
- Prefer semantic elements (`nav`, `main`, `footer`) and consistent class names.
- Avoid inline JS (`onclick`, `onkeyup`) for new code; prefer `addEventListener` in `js/main.js`.
- For external links using `target="_blank"`, add `rel="noopener noreferrer"`.
- Keep meta tags consistent across pages (title, viewport, og tags) when editing.

### CSS (`css/style.css`)
- Reuse existing CSS variables (`:root`) and classes; avoid duplicating styles.
- Naming: kebab-case for classes (`feature-card`, `blogsgrid`, etc.).
- Prefer responsive fixes via existing breakpoints; do not introduce large new breakpoint systems.
- Keep changes scoped: update a component class rather than broad global selectors.

### JavaScript (`js/main.js`)
- Use `const`/`let` (avoid implicit globals).
- Naming: lowerCamelCase for functions/variables; UPPER_SNAKE_CASE only for constants.
- Defensive DOM access: `js/main.js` is shared across pages, so always null-check elements before using them.
  - Example pattern: `const el = document.querySelector(...); if (!el) return;`
- Prefer event listeners over inline handlers.
- Keep functions pure where possible; avoid cross-page side effects.

### Imports/Dependencies
- There is no module system here.
- Do not add new dependencies or bundling. jQuery was removed in the 2026 redesign - do not reintroduce it.
- If you must add a third-party script (only if requested), load via `<script>` and document it clearly.

## Error Handling & Resilience

Principles:
- Never assume elements exist on every page.
- Avoid breaking other pages by adding unguarded top-level code in `js/main.js`.
- Fail safely: if a feature cannot initialize, it should not prevent the rest of the page from working.

Form/network behavior:
- If adding any network calls, handle failure paths (timeouts, non-2xx responses) and provide user feedback.
- Avoid `alert()` for new UX unless explicitly requested.

## Testing / Verification Guidance (Manual)

Baseline smoke test (run for any change):
- Load the affected page(s) in a local server.
- Confirm console has no errors/warnings from your changes.
- Click through key links and interactive elements.
- Check mobile layout (~600px) and mid-size (~965px).
- Verify styles do not introduce horizontal scrolling.

Regression spots:
- Navbar hover expansion (desktop) and bottom nav (mobile).
- Commands page filtering/search.
- Blog index grid layout and blog post readability.

## Security Guidance

Hard rules:
- Do not commit secrets or credentials (API keys, tokens, webhooks).
- Do not add new third-party scripts without explicit user request.

Links and embedding:
- Use `rel="noopener noreferrer"` with `target="_blank"`.
- Avoid adding inline scripts/handlers that would block adopting CSP later.

Data submission:
- Any form submission endpoint should be server-side. Do not send privileged endpoints directly from client JS.
- If a client-side endpoint is unavoidable, ensure it is rate-limited and abuse-resistant (captcha, throttling).
