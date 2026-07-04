/* ==========================================================================
   RUNE - runebot.me
   One shared script for every page. Everything is null-checked because
   not every page has every element.
   ========================================================================== */

'use strict';

const RUNE_GLYPHS = 'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛈᛇᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ';
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* --------------------------------------------------------------------------
   Toast
   -------------------------------------------------------------------------- */

let toastTimer = null;

function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

/* --------------------------------------------------------------------------
   Bug report (the old form is gone - the Discord server is the bug tracker)
   -------------------------------------------------------------------------- */

function reportBug() {
  window.location.href = 'https://discord.gg/HWRM24fBBK';
}

/* --------------------------------------------------------------------------
   Hero title - scrambles through runes before settling on RUNE
   -------------------------------------------------------------------------- */

function initHeroScramble() {
  const title = document.querySelector('.hero h1[data-value]');
  if (!title) return;

  let interval = null;

  const scramble = () => {
    if (REDUCED_MOTION) return;
    const target = title.dataset.value;
    let iteration = 0;
    clearInterval(interval);
    interval = setInterval(() => {
      title.innerText = target
        .split('')
        .map((letter, index) => {
          if (index < iteration) return target[index];
          return RUNE_GLYPHS[Math.floor(Math.random() * RUNE_GLYPHS.length)];
        })
        .join('');
      if (iteration >= target.length) clearInterval(interval);
      iteration += 1 / 3;
    }, 45);
  };

  title.addEventListener('mouseover', scramble);
  title.addEventListener('click', scramble);
  scramble();
}

/* --------------------------------------------------------------------------
   Commands page - filtering, search, deep links, copy buttons
   -------------------------------------------------------------------------- */

function initCommandsPage() {
  const list = document.querySelector('.cmd-list');
  if (!list) return;

  const searchInput = document.getElementById('cmd-search');
  const resultCount = document.querySelector('.cmd-result-count');
  const emptyState = document.querySelector('.cmd-empty');
  const filters = Array.from(document.querySelectorAll('.cmd-filter'));
  const categories = Array.from(list.querySelectorAll('.cmd-category'));
  const items = Array.from(list.querySelectorAll('.cmd-item'));

  let activeCategory = 'all';
  let query = '';

  // fill in the per-category counts on the filter pills
  filters.forEach((btn) => {
    const cat = btn.dataset.category;
    const count =
      cat === 'all'
        ? items.length
        : list.querySelectorAll(`.cmd-category[data-category="${cat}"] .cmd-item`).length;
    const countEl = btn.querySelector('.count');
    if (countEl) countEl.textContent = count;
  });

  const apply = () => {
    let visible = 0;
    categories.forEach((section) => {
      const inCategory = activeCategory === 'all' || section.dataset.category === activeCategory;
      let sectionVisible = 0;
      section.querySelectorAll('.cmd-item').forEach((item) => {
        const matches =
          inCategory && (query === '' || (item.dataset.search || '').includes(query));
        item.hidden = !matches;
        if (matches) sectionVisible++;
      });
      section.hidden = sectionVisible === 0;
      visible += sectionVisible;
    });
    if (resultCount) {
      resultCount.textContent = query || activeCategory !== 'all' ? `${visible} found` : '';
    }
    if (emptyState) emptyState.style.display = visible === 0 ? 'block' : 'none';
    // keep the search shareable
    const url = new URL(window.location);
    if (query) url.searchParams.set('q', query);
    else url.searchParams.delete('q');
    history.replaceState(null, '', url);
  };

  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      filters.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.category;
      apply();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      query = searchInput.value.trim().toLowerCase();
      apply();
    });

    // press / anywhere to search, Escape to clear
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== searchInput) {
        const tag = document.activeElement ? document.activeElement.tagName : '';
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
        e.preventDefault();
        searchInput.focus();
      } else if (e.key === 'Escape' && document.activeElement === searchInput) {
        searchInput.value = '';
        query = '';
        apply();
        searchInput.blur();
      }
    });

    // restore a shared ?q= search
    const params = new URLSearchParams(window.location.search);
    const shared = params.get('q');
    if (shared) {
      searchInput.value = shared;
      query = shared.trim().toLowerCase();
      apply();
    }
  }

  // copy buttons
  list.addEventListener('click', (e) => {
    const copyCmd = e.target.closest('.copy-cmd');
    const copyLink = e.target.closest('.copy-link');
    if (!copyCmd && !copyLink) return;
    const button = copyCmd || copyLink;
    let text;
    if (copyCmd) {
      text = copyCmd.dataset.copy;
    } else {
      const item = copyLink.closest('.cmd-item');
      if (!item) return;
      text = `${window.location.origin}${window.location.pathname}#${item.id}`;
    }
    navigator.clipboard
      .writeText(text)
      .then(() => {
        const original = button.textContent;
        button.textContent = 'Copied!';
        button.classList.add('copied');
        setTimeout(() => {
          button.textContent = original;
          button.classList.remove('copied');
        }, 1500);
      })
      .catch(() => showToast('Could not copy - your browser said no.'));
  });

  // deep links: /commands/#fish opens and highlights the command
  const openFromHash = () => {
    const id = decodeURIComponent(window.location.hash.replace('#', ''));
    if (!id) return;
    const item = document.getElementById(id);
    if (!item || !item.classList.contains('cmd-item')) return;
    item.open = true;
    item.classList.remove('linked');
    // retrigger the flash animation
    void item.offsetWidth;
    item.classList.add('linked');
    item.scrollIntoView({ behavior: REDUCED_MOTION ? 'auto' : 'smooth', block: 'center' });
  };

  window.addEventListener('hashchange', openFromHash);
  openFromHash();
}

/* --------------------------------------------------------------------------
   Blog posts - version anchors, jump-to-version, back to top
   -------------------------------------------------------------------------- */

function initBlogPost() {
  const body = document.querySelector('.blogbody');
  if (!body) return;

  const headings = Array.from(body.querySelectorAll('h2'));
  if (headings.length === 0) return;

  // give every version heading a stable anchor, e.g. "Update v3.4.8" -> #v3.4.8
  headings.forEach((h2) => {
    if (!h2.id) {
      const versionMatch = h2.textContent.match(/v\d[\d.x]*/i);
      h2.id = versionMatch
        ? versionMatch[0].toLowerCase()
        : h2.textContent
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    const anchor = document.createElement('a');
    anchor.className = 'heading-anchor';
    anchor.href = `#${h2.id}`;
    anchor.textContent = '#';
    anchor.setAttribute('aria-label', `Link to ${h2.textContent.trim()}`);
    anchor.addEventListener('click', () => {
      navigator.clipboard
        .writeText(`${window.location.origin}${window.location.pathname}#${h2.id}`)
        .then(() => showToast('Link copied.'))
        .catch(() => {});
    });
    h2.appendChild(anchor);
  });

  // jump-to-version dropdown, only worth it on long threads
  const subtitle = document.querySelector('.gray-subtitle');
  if (headings.length > 3 && subtitle) {
    const nav = document.createElement('div');
    nav.className = 'post-nav';
    const label = document.createElement('label');
    label.setAttribute('for', 'version-jump');
    label.textContent = 'Jump to:';
    const select = document.createElement('select');
    select.id = 'version-jump';
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Pick a version...';
    select.appendChild(placeholder);
    headings.forEach((h2) => {
      const option = document.createElement('option');
      option.value = h2.id;
      option.textContent = h2.childNodes[0].textContent.trim();
      select.appendChild(option);
    });
    select.addEventListener('change', () => {
      if (!select.value) return;
      const target = document.getElementById(select.value);
      if (target) {
        history.replaceState(null, '', `#${select.value}`);
        target.scrollIntoView({ behavior: REDUCED_MOTION ? 'auto' : 'smooth' });
      }
    });
    nav.appendChild(label);
    nav.appendChild(select);
    subtitle.insertAdjacentElement('afterend', nav);
  }

  // back to top
  const backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.textContent = '↑';
  backToTop.setAttribute('aria-label', 'Back to top');
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: REDUCED_MOTION ? 'auto' : 'smooth' });
  });
  document.body.appendChild(backToTop);
  window.addEventListener(
    'scroll',
    () => backToTop.classList.toggle('visible', window.scrollY > 600),
    { passive: true }
  );
}

/* --------------------------------------------------------------------------
   Easter eggs
   -------------------------------------------------------------------------- */

// coin rain - triggered by the Konami code (and one other place...)
function coinRain(amount) {
  if (REDUCED_MOTION) return;
  const container = document.createElement('div');
  container.className = 'coin-rain';
  container.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < amount; i++) {
    const coin = document.createElement('span');
    coin.className = 'coin';
    coin.textContent = 'ᚱ';
    coin.style.left = `${Math.random() * 100}%`;
    coin.style.animationDuration = `${1.6 + Math.random() * 1.8}s`;
    coin.style.animationDelay = `${Math.random() * 1.5}s`;
    container.appendChild(coin);
  }
  document.body.appendChild(container);
  setTimeout(() => container.remove(), 5500);
}

function initKonami() {
  const sequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a',
  ];
  let progress = 0;
  document.addEventListener('keydown', (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === sequence[progress]) {
      progress++;
      if (progress === sequence.length) {
        progress = 0;
        coinRain(70);
        showToast('+999 Rune Coins! (they are not real, stop asking)');
      }
    } else {
      progress = key === sequence[0] ? 1 : 0;
    }
  });
}

// the hidden dig spot on the homepage
function initDigSpot() {
  const spot = document.getElementById('dig-spot');
  if (!spot) return;
  let digs = 0;
  const messages = [
    'You start digging...',
    'Still digging...',
    'You hit something hard!',
    'Almost there...',
  ];
  spot.addEventListener('click', () => {
    digs++;
    if (digs < 5) {
      showToast(messages[digs - 1]);
    } else if (digs === 5) {
      coinRain(12);
      showToast('You dug up 1 Rune Coin. Try /dig in Discord for the real thing.');
    } else {
      showToast('The hole is empty. It was barely worth it the first time.');
    }
  });
}

// tab title when you wander off
function initTitleSwap() {
  const original = document.title;
  document.addEventListener('visibilitychange', () => {
    document.title = document.hidden ? 'ᚱ Rune misses you.' : original;
  });
}

// for the people who open the console
function consoleBanner() {
  const styleGlyph = 'font-size: 2.2rem; color: #e8a33d;';
  const styleText = 'color: #9a9184; font-size: 0.9rem;';
  console.log('%cᚱᚢᚾᛖ', styleGlyph);
  console.log(
    '%cPoking around? Fair enough.\nI build Discord bots - Rune is my main project, and I take commissions.\n@maxikinz on Discord, or drop by https://discord.gg/HWRM24fBBK',
    styleText
  );
  console.log('%cP.S. try the Konami code.', styleText);
}

/* --------------------------------------------------------------------------
   Boot
   -------------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  initHeroScramble();
  initCommandsPage();
  initBlogPost();
  initKonami();
  initDigSpot();
  initTitleSwap();
  consoleBanner();
});
