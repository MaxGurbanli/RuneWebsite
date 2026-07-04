---
name: publish-update
description: Publish Rune patch notes to the website in one action. Takes Discord-markdown patch notes (pasted as arguments or in the next message), converts them to the site's HTML conventions, inserts them into the v3.x update thread, bumps the date in both places, then commits and pushes so GitHub Pages deploys runebot.me.
---

# Publish a Rune update to runebot.me

Turn the Discord-markdown patch notes Max posts in his server into a published
blog entry. The whole flow is: convert → insert → bump dates → show diff → commit → push.

## 1. Get the patch notes

Use the skill arguments as the patch notes. If no arguments were given, ask Max
to paste the Discord message (markdown) and wait.

**Never rewrite, reword, or "improve" the notes.** Max's wording goes on the
site exactly as written, typos and all. Only the formatting changes.

## 2. Convert markdown → site HTML

Conventions (see existing entries in `blogs/update-3.x/index.html` for live examples):

| Discord markdown | Site HTML |
|---|---|
| `## Update v3.4.8` / `### Update v3.4.4` / `### Bug Fix v3.4.5` | `<h2>Update v3.4.8</h2>` — heading level in the source doesn't matter, every version title becomes an `<h2>` |
| `### Economy` (a subsection within a version) | `<h3>Economy</h3>` |
| `- bullet` | `<ul><li>bullet</li></ul>` |
| `` `/command` `` | `<cmd>/command</cmd>` |
| `` `literal` `` (not a command, e.g. a symbol or value) | `<code>literal</code>` |
| `:runecoin:` | leave as literal text `:runecoin:` |
| `**bold**` / `*italic*` | `<b>` / `<i>` |

Rules:
- If a version has no subsection headers, add one `<h3>` that fits the site's
  existing vocabulary: `New` / `New content` / `Improvements` / `Changes` /
  `Fixes` / `Removal` / `Other`. A "Bug Fix vX.Y.Z" gets `Fixes`; a removal
  gets `Removal`; otherwise pick the closest fit.
- A trailing list of commands after a sentence (like "now take effect
  instantly:") stays inside that same `<li>`, each command in its own
  `<cmd>` tag, comma-separated.
- Don't add ids or anchor links to the headings — `js/main.js` generates
  version anchors (e.g. `#v3.4.8`) automatically at page load.

Example conversion:

```markdown
### Update v3.4.7
- `/inventory` has received a redesign to improve how your ores, fish, wood, and items are displayed
```

```html
<h2>Update v3.4.7</h2>

<h3>Improvements</h3>
<ul>
  <li>
    <cmd>/inventory</cmd> has received a redesign to improve how your ores, fish, wood, and items are displayed
  </li>
</ul>
```

## 3. Insert into the thread

In `blogs/update-3.x/index.html`, insert the new `<h2>` block(s) inside
`<div class='blogbody'>`, **directly after the intro paragraph** ("This is an
update thread for change notes...") and **before the currently newest `<h2>`**.
Versions run newest-first, so if multiple versions are being published at once,
keep them in descending order.

(If the notes are for a future v4.x, stop and ask Max whether to start a new
`blogs/update-4.x/` thread instead.)

## 4. Bump the date in BOTH places

Using today's date, formatted like `July 4, 2026`:

1. `blogs/update-3.x/index.html` — `<div class='gray-subtitle'>Last updated {date}.</div>`
2. `blogs/index.html` — the v3.x card's `<div class='blogdate'>Last Post {date}</div>`

## 5. Review, commit, push

1. Show Max the diff (or a short summary of what was inserted) before pushing.
2. Commit with a message matching the repo's history, e.g. `document v3.4.9`
   (or `document v3.4.9-3.4.11` for a batch).
3. Push to `main`. GitHub Pages picks it up automatically and deploys to
   runebot.me — no further action needed.
