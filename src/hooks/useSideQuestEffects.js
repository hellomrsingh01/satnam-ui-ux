import { useEffect } from 'react';

// Direct port of the original site's vanilla-JS interactions (app.js).
// It runs once after the whole page has mounted and wires everything up
// by querying the DOM directly, exactly like the original <script defer>
// tag did. Every effect has a reduced-motion path, same as the source.
export default function useSideQuestEffects() {
  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => [...r.querySelectorAll(s)];

    const cleanups = [];
    const onCleanup = (fn) => cleanups.push(fn);

    // Paper shimmer while an image downloads, then a short fade-in. Stickers
    // that already animate (portraits) and transparent art keep their own look.
    $$('img:not(.badge img):not(.contact-me img)').forEach((img) => {
      if (img.complete || getComputedStyle(img).animationName !== 'none') return;
      img.classList.add('ld');
      const done = () => { img.classList.remove('ld'); img.classList.add('lded'); };
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', () => img.classList.remove('ld'), { once: true });
    });

    // Headline: split into characters so they bounce in one by one.
    const h = $('[data-split]');
    if (h && !reduce) {
      let i = 0;
      const walk = (node) => {
        [...node.childNodes].forEach((n) => {
          if (n.nodeType === 3) {
            const frag = document.createDocumentFragment();
            n.textContent.split(/(\s+)/).forEach((part) => {
              if (!part) return;
              if (/^\s+$/.test(part)) { frag.append(part); return; }
              const word = document.createElement('span');
              word.style.display = 'inline-block';
              word.style.whiteSpace = 'nowrap';
              [...part].forEach((c) => {
                const s = document.createElement('span');
                s.className = 'ch';
                s.style.setProperty('--i', i++);
                s.textContent = c;
                word.append(s);
              });
              frag.append(word);
            });
            n.replaceWith(frag);
          } else if (n.nodeType === 1) walk(n);
        });
      };
      walk(h);
      h.querySelectorAll('.ch').forEach((c) => c.setAttribute('aria-hidden', 'true'));
    }
    const raf = requestAnimationFrame(() => document.body.classList.add('loaded'));
    onCleanup(() => cancelAnimationFrame(raf));

    // Hello in the languages I work in.
    const hello = $('[data-hello]');
    if (hello) {
      const words = $$('span', hello);
      const fit = (w) => hello.style.setProperty('--w', `${w.scrollWidth + 4}px`);
      fit(words[0]);
      document.fonts?.ready.then(() => fit($('span.on', hello)));
      let k = 0;
      if (!reduce) {
        const helloTimer = setInterval(() => {
          const cur = words[k];
          k = (k + 1) % words.length;
          const next = words[k];
          fit(next);
          cur.classList.remove('on');
          cur.classList.add('out');
          next.classList.remove('out');
          next.classList.add('on');
          setTimeout(() => {
            // Snap back below the window without animating through it.
            cur.classList.add('reset');
            cur.classList.remove('out');
            void cur.offsetWidth;
            cur.classList.remove('reset');
          }, 650);
        }, 2200);
        onCleanup(() => clearInterval(helloTimer));
      }
    }

    // "What I bring" icons: play once each card is on screen, replay on hover.
    if (!reduce) $$('.biz').forEach((icon) => {
      const play = () => { icon.classList.remove('play'); void icon.getBoundingClientRect(); icon.classList.add('play'); };
      const o = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { setTimeout(play, 900); o.disconnect(); }
      }, { threshold: 0.6 });
      o.observe(icon);
      icon.closest('li')?.addEventListener('pointerenter', play);
    });

    // Pop-in reveals.
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    onCleanup(() => io.disconnect());

    // Gallery masonry. Safari mis-paints animated tiles inside CSS columns (cards
    // split, blank copies land on other sections), so deal the tiles into real
    // column divs instead: shortest column first, from each tile's known ratio.
    const gal = $('.gallery');
    if (gal) {
      const tiles = $$('.tile', gal);
      const ratio = (t) => { const m = $('img, video', t); return m.getAttribute('height') / m.getAttribute('width'); };
      let cols = 0;
      const lay = () => {
        const n = matchMedia('(max-width: 1080px)').matches ? 2 : 3;
        if (n === cols) return;
        cols = n;
        const els = Array.from({ length: n }, () => Object.assign(document.createElement('div'), { className: 'gcol' }));
        const hs = new Array(n).fill(0);
        tiles.forEach((t) => { const k = hs.indexOf(Math.min(...hs)); els[k].appendChild(t); hs[k] += ratio(t) + 0.1; });
        gal.replaceChildren(...els);
        gal.classList.add('dealt');
      };
      lay();
      addEventListener('resize', lay);
      onCleanup(() => removeEventListener('resize', lay));
    }
    $$('.pop, [data-chat]:not(.live)').forEach((el) => io.observe(el));

    // Testimonials: a live chat that loops forever, in a shuffled order.
    const chat = $('[data-chat]');
    if (chat && !reduce) {
      const pool = $$('.msg', chat).filter((m) => $('.bubble', m)).map((m) => ({
        img: $('img', m).getAttribute('src'),
        c: $('.bubble', m).style.getPropertyValue('--c') || '#fff',
        html: $('.bubble', m).innerHTML,
      }));
      // Screen readers get the full list once, not a feed that keeps changing.
      const sr = document.createElement('ul');
      sr.className = 'sr-only';
      $$('.bubble', chat).forEach((b) => { const li = document.createElement('li'); li.textContent = b.textContent; sr.appendChild(li); });
      chat.after(sr);
      chat.setAttribute('aria-hidden', 'true');
      chat.innerHTML = '';
      chat.classList.add('live');

      const MAX = 3;
      let bag = [], lastShown = -1, side = 0, timer = 0, visible = false, paused = false;
      const next = () => {
        if (!bag.length) {
          bag = pool.map((_, k) => k).sort(() => Math.random() - 0.5);
          if (bag[bag.length - 1] === lastShown) bag.unshift(bag.pop()); // never repeat back to back
        }
        lastShown = bag.pop();
        return pool[lastShown];
      };
      // Slide existing messages up smoothly when a new one lands (FLIP).
      const flip = (mutate) => {
        const els = $$('.msg', chat);
        const before = new Map(els.map((el) => [el, el.getBoundingClientRect().top]));
        mutate();
        els.forEach((el) => {
          if (!el.isConnected) return;
          const dy = before.get(el) - el.getBoundingClientRect().top;
          if (dy) el.animate([{ transform: `translateY(${dy}px)` }, { transform: 'none' }], { duration: 520, easing: 'cubic-bezier(.34,1.36,.64,1)' });
        });
      };
      const add = (instant) => {
        const t = next();
        const el = document.createElement('div');
        el.className = 'msg' + (side++ % 2 ? ' r' : '');
        el.innerHTML = `<img src="${t.img}" alt=""><span class="typing"><i></i><i></i><i></i></span>`;
        const land = () => {
          flip(() => { $('.typing', el).outerHTML = `<div class="bubble" style="--c:${t.c}">${t.html}</div>`; });
          el.animate([{ opacity: 0.6, transform: 'scale(0.92)' }, { opacity: 1, transform: 'none' }], { duration: 480, easing: 'cubic-bezier(.34,1.56,.64,1)' });
        };
        flip(() => chat.appendChild(el));
        el.animate([{ opacity: 0, transform: 'translateY(16px) scale(0.9)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.34,1.56,.64,1)' });
        // Drop the oldest once the window is full.
        const msgs = $$('.msg', chat);
        if (msgs.length > MAX) {
          const old = msgs[0];
          old.animate([{ opacity: 1 }, { opacity: 0, transform: 'translateY(-12px)' }], { duration: 380, easing: 'ease-in', fill: 'forwards' }).onfinish = () => flip(() => old.remove());
        }
        if (instant) land(); else setTimeout(land, 1300);
      };
      const tick = () => {
        clearTimeout(timer);
        if (!visible || paused || document.hidden) return;
        add(false);
        timer = setTimeout(tick, 4200);
      };
      add(true); add(true);
      const chatIo = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) timer = setTimeout(tick, 1600); else clearTimeout(timer); }, { threshold: 0.3 });
      chatIo.observe(chat);
      const hold = (on) => { paused = on; if (!on && visible) { clearTimeout(timer); timer = setTimeout(tick, 1500); } else clearTimeout(timer); };
      const onEnter = () => hold(true);
      const onLeave = () => hold(false);
      chat.addEventListener('pointerenter', onEnter);
      chat.addEventListener('pointerleave', onLeave);
      const onVis = () => { if (!document.hidden && visible && !paused) { clearTimeout(timer); timer = setTimeout(tick, 1500); } };
      document.addEventListener('visibilitychange', onVis);
      onCleanup(() => {
        clearTimeout(timer);
        chatIo.disconnect();
        chat.removeEventListener('pointerenter', onEnter);
        chat.removeEventListener('pointerleave', onLeave);
        document.removeEventListener('visibilitychange', onVis);
      });
    }

    // Clocks.
    const renderClock = () => {
      const t = new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
      const hr = +t.slice(0, 2);
      document.documentElement.classList.toggle('ist-night', !(hr >= 6 && hr < 18));
      $$('[data-clock]').forEach((el) => (el.textContent = `${t} in Chandigarh`));
      $$('[data-clock-foot]').forEach((el) => (el.textContent = `It’s ${t} in Chandigarh`));
    };
    renderClock();
    const clockTimer = setInterval(renderClock, 30000);
    onCleanup(() => clearInterval(clockTimer));

    // Stickers: peel and move them anywhere in the hero.
    const hero = $('[data-hero]');
    if (fine && hero) {
      let z = 10;
      $$('[data-sticker]').forEach((st) => {
        let sx, sy, ox, oy, id = null;
        st.addEventListener('pointerdown', (e) => {
          id = e.pointerId;
          st.setPointerCapture(id);
          st.classList.add('drag');
          st.style.zIndex = ++z;
          sx = e.clientX; sy = e.clientY;
          ox = st.offsetLeft; oy = st.offsetTop;
        });
        st.addEventListener('pointermove', (e) => {
          if (id !== e.pointerId) return;
          const maxX = hero.clientWidth - st.offsetWidth;
          const maxY = hero.clientHeight - st.offsetHeight;
          st.style.left = `${Math.max(0, Math.min(maxX, ox + e.clientX - sx))}px`;
          st.style.top = `${Math.max(0, Math.min(maxY, oy + e.clientY - sy))}px`;
        });
        const end = (e) => {
          if (id !== e.pointerId) return;
          id = null;
          st.classList.remove('drag');
          st.style.setProperty('--rot', `${(Math.random() * 16 - 8).toFixed(1)}deg`);
        };
        st.addEventListener('pointerup', end);
        st.addEventListener('pointercancel', end);
      });
    }

    // Cards: flip on click. Keyboard flips move focus to the visible side;
    // mouse flips don't, or Chrome paints the focus ring after every click.
    $$('.deck .card').forEach((card) => {
      const front = $$('.face-f .flip', card)[0];
      const back = $$('.face-b .flip', card)[0];
      const story = $('a[href$=".html"]', card)?.getAttribute('href') || '';
      const set = (on, byKey) => {
        if (on && !card.classList.contains('flipped')) window.track?.('home:deck_card_flipped', { case_study: window.caseStudyFor?.(story) });
        card.classList.toggle('flipped', on);
        front.setAttribute('aria-pressed', String(on));
        $('.face-f', card).setAttribute('aria-hidden', String(on));
        $('.face-b', card).setAttribute('aria-hidden', String(!on));
        $$('.face-b a, .face-b button', card).forEach((el) => (el.tabIndex = on ? 0 : -1));
        $$('.face-f button', card).forEach((el) => (el.tabIndex = on ? -1 : 0));
        const hidden = $(on ? '.face-f' : '.face-b', card);
        if (byKey) (on ? $('.face-b a', card) : front).focus({ preventScroll: true });
        else if (hidden.contains(document.activeElement)) document.activeElement.blur();
      };
      $('.face-b', card).setAttribute('aria-hidden', 'true');
      $$('.face-b a, .face-b button', card).forEach((el) => (el.tabIndex = -1));
      // detail is 0 when Enter or Space fired the click.
      front.addEventListener('click', (e) => set(true, e.detail === 0));
      back.addEventListener('click', (e) => set(false, e.detail === 0));
      // Click anywhere on the card to flip; links and buttons keep their own job.
      card.addEventListener('click', (e) => {
        if (e.target.closest('a, button')) return;
        if (getSelection()?.toString()) return;
        set(!card.classList.contains('flipped'), false);
      });
      // Desktop: tilt toward the cursor for a bit of life.
      if (fine && !reduce) {
        const inner = $('.card-inner', card);
        card.addEventListener('pointermove', (e) => {
          if (card.classList.contains('flipped')) return;
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          inner.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
        });
        card.addEventListener('pointerleave', () => (inner.style.transform = ''));
        card.addEventListener('click', () => (inner.style.transform = ''));
      }
    });

    // Operating manual tabs (with arrow-key support).
    const tablist = $('[data-tabs]');
    if (tablist) {
      const tabs = $$('[role="tab"]', tablist);
      const select = (t) => {
        tabs.forEach((x) => {
          const on = x === t;
          x.setAttribute('aria-selected', String(on));
          x.tabIndex = on ? 0 : -1;
          document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
        });
        // On phones the tabs are a swipeable row: bring the chosen one into view.
        if (tablist.scrollWidth > tablist.clientWidth) {
          tablist.scrollTo({ left: t.offsetLeft - tablist.offsetLeft - parseFloat(getComputedStyle(tablist).paddingLeft), behavior: reduce ? 'auto' : 'smooth' });
        }
      };
      const edge = () => tablist.classList.toggle('at-end', tablist.scrollLeft + tablist.clientWidth >= tablist.scrollWidth - 4);
      tablist.addEventListener('scroll', edge, { passive: true });
      addEventListener('resize', edge);
      edge();
      // Auto-advance: each habit stays up about as long as it takes to read it,
      // only while the manual is on screen, and stops for good once the visitor picks a tab.
      const section = tablist.closest('section');
      const pauseBtn = $('[data-tabs-pause]');
      let timer = 0, started = 0, left = 0, onScreen = false, hovering = false, userPaused = false, done = reduce;
      const dwell = (t) => {
        const words = document.getElementById(t.getAttribute('aria-controls')).textContent.trim().split(/\s+/).length;
        return Math.min(16000, Math.max(8000, 1500 + words * 300)); // ~200 words a minute
      };
      const current = () => tabs.find((x) => x.getAttribute('aria-selected') === 'true');
      const running = () => !done && onScreen && !hovering && !userPaused && !document.hidden;
      const arm = (ms) => {
        clearTimeout(timer);
        left = ms; started = performance.now();
        tablist.style.setProperty('--dwell', `${ms}ms`);
        timer = setTimeout(() => {
          const i = tabs.indexOf(current());
          select(tabs[(i + 1) % tabs.length]);
          restart();
        }, ms);
      };
      const restart = () => {
        tablist.classList.remove('auto'); void tablist.offsetWidth; // replay the fill bar
        if (done) return;
        tablist.classList.add('auto');
        left = dwell(current());
        tablist.style.setProperty('--dwell', `${left}ms`);
        sync();
      };
      const sync = () => {
        tablist.classList.toggle('paused', !running());
        if (running()) arm(left);
        else if (timer) { clearTimeout(timer); timer = 0; left = Math.max(0, left - (performance.now() - started)); }
      };
      const stop = () => {
        done = true; clearTimeout(timer);
        tablist.classList.remove('auto', 'paused');
        if (pauseBtn) pauseBtn.hidden = true;
      };
      let tabsIo;
      if (!done && section) {
        tabsIo = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; sync(); }, { threshold: 0.5 });
        tabsIo.observe(section);
        section.addEventListener('pointerenter', () => { hovering = true; sync(); });
        section.addEventListener('pointerleave', () => { hovering = false; sync(); });
        section.addEventListener('focusin', (e) => { if (e.target !== pauseBtn) { hovering = true; sync(); } });
        section.addEventListener('focusout', () => { hovering = false; sync(); });
        document.addEventListener('visibilitychange', () => sync());
        pauseBtn?.addEventListener('click', () => {
          userPaused = !userPaused;
          pauseBtn.textContent = userPaused ? 'Play' : 'Pause';
          sync();
        });
        restart();
      } else if (pauseBtn) pauseBtn.hidden = true;

      tabs.forEach((t, i) => {
        t.addEventListener('click', () => { stop(); select(t); window.track?.('home:manual_tab_selected', { tab_name: t.textContent.trim() }); });
        t.addEventListener('keydown', (e) => {
          const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
          if (!d) return;
          stop();
          const n = tabs[(i + d + tabs.length) % tabs.length];
          select(n);
          n.focus();
        });
      });
      onCleanup(() => { clearTimeout(timer); tabsIo?.disconnect(); removeEventListener('resize', edge); });
    }

    // Level map: a path through the nodes that fills as you scroll.
    const map = $('[data-map]');
    if (map) {
      const base = $('[data-path-base]', map);
      const done = $('[data-path-done]', map);
      const levels = $$('[data-level]', map);
      let len = 0;
      const build = () => {
        const mr = map.getBoundingClientRect();
        const pts = levels.map((l) => {
          const r = $('.node', l).getBoundingClientRect();
          return [r.left - mr.left + r.width / 2, r.top - mr.top + r.height / 2];
        });
        let d = `M ${pts[0][0]} ${pts[0][1]}`;
        for (let i = 1; i < pts.length; i++) {
          const [x0, y0] = pts[i - 1];
          const [x1, y1] = pts[i];
          const my = (y0 + y1) / 2;
          d += ` C ${x0} ${my}, ${x1} ${my}, ${x1} ${y1}`;
        }
        base.setAttribute('d', d);
        done.setAttribute('d', d);
        len = done.getTotalLength();
        done.style.strokeDasharray = `${len}`;
        progress();
      };
      const progress = () => {
        const r = map.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (innerHeight * 0.6 - r.top) / r.height));
        done.style.strokeDashoffset = `${len * (1 - (reduce ? 1 : p))}`;
        levels.forEach((l) => {
          const nr = $('.node', l).getBoundingClientRect();
          l.classList.toggle('reached', reduce || nr.top < innerHeight * 0.6);
        });
      };
      addEventListener('resize', build);
      addEventListener('scroll', progress, { passive: true });
      addEventListener('load', build);
      build();
      onCleanup(() => { removeEventListener('resize', build); removeEventListener('scroll', progress); removeEventListener('load', build); });
    }

    // Videos play while visible.
    let vio;
    if (!reduce) {
      vio = new IntersectionObserver((entries) => {
        entries.forEach((e) => (e.isIntersecting ? e.target.play().catch(() => {}) : e.target.pause()));
      }, { threshold: 0.4 });
      $$('[data-play]').forEach((v) => vio.observe(v));
      onCleanup(() => vio.disconnect());
    }

    // 60-second version.
    const dlg = $('[data-tldr]');
    const tldrOpenHandlers = $$('[data-tldr-open]').map((b) => {
      const handler = () => { dlg.showModal(); window.track?.('home:quick_summary_opened'); };
      b.addEventListener('click', handler);
      return [b, handler];
    });
    const tldrCloseHandlers = $$('[data-tldr-close]').map((b) => {
      const handler = () => dlg.close();
      b.addEventListener('click', handler);
      return [b, handler];
    });
    const onTldrBackdrop = (e) => { if (e.target === dlg) dlg.close(); };
    dlg?.addEventListener('click', onTldrBackdrop); // not on the 404 page
    onCleanup(() => {
      tldrOpenHandlers.forEach(([b, handler]) => b.removeEventListener('click', handler));
      tldrCloseHandlers.forEach(([b, handler]) => b.removeEventListener('click', handler));
      dlg?.removeEventListener('click', onTldrBackdrop);
    });

    // Mixtape: every case study as a ~40s video, for people who'd rather watch first. Each video ends on
    // "Read the full story" and "Next tape". Tapes and their files are data attributes in index.html.
    const mix = $('[data-mix]'), mixOpen = $('[data-mix-open]');
    if (mix && mixOpen) {
      const video = $('video', mix), end = $('[data-mix-end]', mix), tapes = $$('[data-tape]', mix);
      let cur = 0, seen = new Set();
      const load = (i) => {
        cur = (i + tapes.length) % tapes.length; seen = new Set();
        const t = tapes[cur].dataset;
        $('[data-mix-title]', mix).textContent = t.title;
        $('[data-mix-sub]', mix).textContent = `${t.name} · ${t.len}`;
        $('[data-mix-read]', mix).href = t.href;
        tapes.forEach((b, k) => b.toggleAttribute('aria-current', k === cur));
        end.classList.remove('on');
        video.poster = t.poster; video.src = t.video; video.play().catch(() => {});
        window.track?.('home:mixtape_tape_played', { case_study: window.caseStudyFor?.(t.href) });
      };
      const onMixOpen = () => { mix.showModal(); load(cur); window.track?.('home:mixtape_opened'); };
      mixOpen.addEventListener('click', onMixOpen);
      tapes.forEach((b, k) => b.addEventListener('click', () => load(k)));
      $('[data-mix-next]', mix).addEventListener('click', () => load(cur + 1));
      $('[data-mix-read]', mix).addEventListener('click', () => window.track?.('home:mixtape_story_clicked', { case_study: window.caseStudyFor?.(tapes[cur].dataset.href) }));
      $('[data-mix-close]', mix).addEventListener('click', () => mix.close());
      const onMixBackdrop = (e) => { if (e.target === mix) mix.close(); };
      mix.addEventListener('click', onMixBackdrop);
      const onMixClose = () => { video.pause(); mixOpen.focus(); };
      mix.addEventListener('close', onMixClose);
      const onEnded = () => { end.classList.add('on'); $('[data-mix-read]', mix).focus(); };
      video.addEventListener('ended', onEnded);
      const onTimeUpdate = () => { // analytics: quarters watched, once per tape
        const q = Math.floor((video.currentTime / video.duration) * 4) * 25;
        if (q && !seen.has(q)) { seen.add(q); window.track?.('home:mixtape_tape_watched', { case_study: window.caseStudyFor?.(tapes[cur].dataset.href), percent_watched: q }); }
      };
      video.addEventListener('timeupdate', onTimeUpdate);
      onCleanup(() => {
        mixOpen.removeEventListener('click', onMixOpen);
        mix.removeEventListener('click', onMixBackdrop);
        mix.removeEventListener('close', onMixClose);
        video.removeEventListener('ended', onEnded);
        video.removeEventListener('timeupdate', onTimeUpdate);
      });
    }

    // Copy email.
    $$('[data-copy]').forEach((btn) => {
      const label = btn.textContent;
      btn.addEventListener('click', async () => {
        window.track?.('contact:email_copied');
        try { await navigator.clipboard.writeText(btn.dataset.copy); } catch { return; }
        btn.textContent = 'Copied! ✓';
        setTimeout(() => (btn.textContent = label), 1800);
      });
    });

    // mailto does nothing where no mail app is set up, so an "Email Satnam"
    // button also copies the address and says so for a moment.
    $$('a.btn[href^="mailto:"]').forEach((a) => {
      if (a.textContent.includes('@')) return; // the address is already on screen
      const label = a.textContent;
      a.addEventListener('click', async () => {
        window.track?.('contact:email_clicked');
        try { await navigator.clipboard.writeText(a.href.slice(7)); } catch { return; }
        a.textContent = 'Email copied';
        setTimeout(() => (a.textContent = label), 1800);
      });
    });

    // ─── Ship it! A live peek of the full-screen game (play.html) ───────────
    // The card plays the level on autopilot; clicking it opens the real game.
    // Tell the peek when it leaves the screen, so it stops animating and saves battery.
    // (The peek now embeds the live site's own play.html cross-origin, so the
    // postMessage below is a no-op in this app, same as it would be with analytics off.)
    const peekFrame = $('.stage iframe');
    let peekIo;
    if (peekFrame && 'IntersectionObserver' in window) {
      const say = (msg) => { try { peekFrame.contentWindow.postMessage({ peek: msg }, location.origin); } catch { /* cross-origin, expected */ } };
      let seen = false;
      peekIo = new IntersectionObserver(([e]) => { seen = e.isIntersecting; say(seen ? 'play' : 'pause'); });
      peekIo.observe(peekFrame);
      peekFrame.addEventListener('load', () => say(seen ? 'play' : 'pause'));
    }
    onCleanup(() => peekIo?.disconnect());

    const best = $('[data-best]');
    if (best) {
      let t = 0;
      try { t = +localStorage.getItem('sq-platform-best') || 0; } catch { /* ignore */ }
      if (t) { best.textContent = `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`; best.closest('.score').hidden = false; }
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);
}
