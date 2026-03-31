'use strict';


const CONFIG = {
    github:      'ShiiiivanshSingh',
    lfmUser:     'sh1vanshs2ngh',
    lfmKey:      '0827762c08a7c993f5249162a5805cf1',
    letterboxd:  'ShivanshSingh',
    lbProxy:     'https://letterbocd-proxy.shivanshpratapsingh0807.workers.dev',
    birthDate:   '2005-07-08',
    graphColors: { light: 'D6536D', dark: '75a5fe' },

    topFilms: [
        { title: "my night at maud's",               year: '1969'},
        { title: 'petite maman',                     year: '2021'},
        { title: 'the apartment',                    year: '1960'},
        { title: 'adventures in babysitting',        year: '1987'},
        { title: 'sleepless in seattle',             year: '1993'},
        { title: 'a girl walks home alone at night', year: '2014'},
    ],

    secretCommands: {
        chungus:   'rickroll',
        shivansh:  'love',
        cutie:     'cutie',
        dl91:      'playlist',
        matrix:    'matrix',
        nostalgia: 'lofi',
        konami:    'konami',
        debug:     'debug',
        void:      'void',
        hint:      'hint',
        songs:     'songs',
        stats:     'stats',
        films:     'films',
        whoami:    'whoami',
        404:       '404',
        sleep:     'sleep',
        glitch:    'glitch',
        invert:    'invert',
        rage:      'rage',
        sudo:      'sudo',
    },

    movieCacheTTL: 6 * 60 * 60 * 1000,
};

const MOVIE_CACHE_KEY = 'lb_last_watched';

function el(id) { return document.getElementById(id); }

function lfmFetch(params) {
    const base = `https://ws.audioscrobbler.com/2.0/?user=${CONFIG.lfmUser}&api_key=${CONFIG.lfmKey}&format=json`;
    return fetch(`${base}&${params}`).then(r => { if (!r.ok) throw new Error(String(r.status)); return r.json(); });
}


// ─── small helpers ────────────────────────────────────────────

function spawnHearts(count = 4, sizeMult = 1) {
    if (document.querySelectorAll('.heart').length >= 12) return;
    for (let i = 0; i < count; i++) {
        const h = document.createElement('i');
        h.className = 'fa-solid fa-heart heart';
        h.style.cssText = [
            `left:${5 + Math.random() * 90}vw`,
            `bottom:3rem`,
            `animation-delay:${Math.random() * 0.6 * sizeMult}s`,
            `font-size:${sizeMult + Math.random() * 1.5 * sizeMult}rem`,
            `will-change:transform,opacity`,
        ].join(';');
        document.body.appendChild(h);
        h.addEventListener('animationend', () => h.remove());
    }
}

function openOverlay(id, autoCloseMs = 0) {
    const node = el(id);
    if (!node) return;
    node.classList.add('open');
    if (autoCloseMs > 0) setTimeout(() => node.classList.remove('open'), autoCloseMs);
}

function openPasswordModal() {
    const modal = el('pw-modal');
    const input = el('pw-input');
    if (!modal || !input) return;
    modal.classList.add('open');
    setTimeout(() => input.focus(), 50);
}

function runTerminal(lines, delayMs = 220) {
    const term = el('debug-terminal');
    const out  = el('debug-output');
    if (!term || !out) return () => {};
    term.classList.add('open');
    out.innerHTML = '';
    let i = 0;
    const timer = setInterval(() => {
        if (i >= lines.length) { clearInterval(timer); return; }
        out.innerHTML += lines[i++] + '<br>';
    }, delayMs);

    return () => {
        clearInterval(timer);
        term.classList.remove('open');
        out.innerHTML = '';
    };
}


// ─── theme toggle ─────────────────────────────────────────────

function initTheme() {
    const btn   = el('theme-btn');
    const icon  = el('theme-icon');
    const bunny = el('bunny-btn');
    const egg   = el('easter-egg');
    if (!btn || !icon || !bunny || !egg) return;
    let clicks = 0;

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        icon.innerHTML = theme === 'dark'
            ? '<i class="fas fa-moon"></i>'
            : '<i class="fas fa-sun"></i>';
        const graph = el('gh-graph');
        if (graph) graph.src = `https://ghchart.rshah.org/${CONFIG.graphColors[theme]}/${CONFIG.github}`;
    }

    applyTheme(localStorage.getItem('theme') || 'dark');

    btn.addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', next);
        applyTheme(next);
        if (++clicks >= 10) {
            clicks = 0;
            bunny.classList.add('visible');
        }
    });

    bunny.addEventListener('click', () => {
        bunny.classList.remove('visible');
        egg.classList.add('open');
        document.body.style.overflow = 'hidden';
    });
}


// ─── nav stuff ────────────────────────────────────────────────

function initNavigation() {
    const bar      = el('scroll-bar');
    const hdr      = document.querySelector('.hdr');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    const sections = [...navLinks]
        .map(a => document.querySelector(a.getAttribute('href')))
        .filter(Boolean);

    if (bar && hdr) {
        window.addEventListener('scroll', () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
            hdr.classList.toggle('scrolled', window.scrollY > 10);

            let current = '';
            sections.forEach(sec => {
                if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
            });
            navLinks.forEach(a => {
                a.classList.toggle('active', a.getAttribute('href') === '#' + current);
            });
        }, { passive: true });
    }

    const hamburger = el('hamburger');
    const mobileNav = el('mobile-nav');

    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            const isOpen = mobileNav.classList.toggle('open');
            hamburger.classList.toggle('open', isOpen);
            hamburger.setAttribute('aria-expanded', String(isOpen));
            mobileNav.setAttribute('aria-hidden', String(!isOpen));
        });

        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('open');
                hamburger.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
                mobileNav.setAttribute('aria-hidden', 'true');
            });
        });
    }
}


// ─── custom cursor ────────────────────────────────────────────

function initCursor() {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const dot  = el('cur-dot');
    const ring = el('cur-ring');
    if (!dot || !ring) return;

    let rx = -20, ry = -20, mx = -20, my = -20;

    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        dot.style.left = mx + 'px';
        dot.style.top  = my + 'px';
    });

    (function loop() {
        rx += (mx - rx) * 0.14;
        ry += (my - ry) * 0.14;
        ring.style.left = rx + 'px';
        ring.style.top  = ry + 'px';
        requestAnimationFrame(loop);
    })();

    document.querySelectorAll('a, button').forEach(node => {
        node.addEventListener('mouseenter', () => ring.classList.add('big'));
        node.addEventListener('mouseleave', () => ring.classList.remove('big'));
    });
}


// ─── live data ────────────────────────────────────────────────

function initLiveData() {

    const ageEl = el('age');
    let ageTicker = null;
    if (ageEl) {
        const birth = new Date(CONFIG.birthDate);
        const tick  = () => {
            ageEl.textContent = ((Date.now() - birth) / (1000 * 60 * 60 * 24 * 365.2425)).toFixed(9);
        };
        tick();
        ageTicker = setInterval(tick, 50);
    }

    const lbTitle = el('lb-title');
    const lbUrl   = `https://letterboxd.com/${CONFIG.letterboxd}/rss/`;

    function showMovieLoading() {
        if (!lbTitle) return;
        lbTitle.innerHTML = '<span class="lb-loading">fetching<span class="lb-dots"><span>.</span><span>.</span><span>.</span></span></span>';
        if (!el('lb-loading-style')) {
            const s = document.createElement('style');
            s.id = 'lb-loading-style';
            s.textContent = `
                .lb-loading { opacity: .5; font-style: italic; }
                .lb-dots span { animation: lbdot 1.2s infinite; opacity: 0; }
                .lb-dots span:nth-child(2) { animation-delay: .2s; }
                .lb-dots span:nth-child(3) { animation-delay: .4s; }
                @keyframes lbdot {
                    0%, 80%, 100% { opacity: 0; }
                    40%           { opacity: 1; }
                }
            `;
            document.head.appendChild(s);
        }
    }

    function fetchWithTimeout(url, ms = 7000, as = 'text') {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), ms);
        return fetch(url, { signal: ctrl.signal })
            .then(r => {
                if (!r.ok) throw new Error(String(r.status));
                return as === 'json' ? r.json() : r.text();
            })
            .finally(() => clearTimeout(t));
    }

    function parseLbXml(text) {
        if (!text || typeof text !== 'string' || text.trim().length === 0) return null;
        let xml;
        try {
            xml = new DOMParser().parseFromString(text, 'text/xml');
        } catch (_) {
            return null;
        }
        if (xml.querySelector('parsererror')) return null;

        for (const item of xml.querySelectorAll('item')) {
            const raw = item.querySelector('title')?.textContent || '';
            if (!raw) continue;

            let t = raw.trim();
            t = t.split(' - ')[0].trim();
            t = t.replace(/\s+[★].*$/u, '').trim();
            t = t.replace(/\s*\(\d{4}\)\s*$/u, '').trim();
            t = t.replace(/,\s*\d{4}\s*$/u, '').trim();

            if (t) return t;
        }
        return null;
    }

    function setMovieTitle(title) {
        if (lbTitle && title && typeof title === 'string') lbTitle.textContent = title;
    }

    function saveMovieCache(title) {
        try {
            localStorage.setItem(MOVIE_CACHE_KEY, JSON.stringify({ title, ts: Date.now() }));
        } catch (_) {}
    }

    function loadMovieCache() {
        try {
            const raw = localStorage.getItem(MOVIE_CACHE_KEY);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (!parsed || typeof parsed.title !== 'string') return null;
            if (Date.now() - parsed.ts > CONFIG.movieCacheTTL) return null;
            return parsed.title;
        } catch (_) {
            return null;
        }
    }

    const cached = loadMovieCache();
    if (cached) {
        setMovieTitle(cached);
    } else {
        showMovieLoading();
    }

    (async () => {
        const attempts = [
            ...(CONFIG.lbProxy ? [{ url: CONFIG.lbProxy, as: 'text' }] : []),
            { url: `https://api.allorigins.win/raw?url=${encodeURIComponent(lbUrl)}`, as: 'text' },
            { url: `https://api.allorigins.win/get?url=${encodeURIComponent(lbUrl)}`, as: 'json' },
        ];

        for (const a of attempts) {
            try {
                const data = await fetchWithTimeout(a.url, 7000, a.as);
                const xmlText = a.as === 'json'
                    ? (data && typeof data.contents === 'string' ? data.contents : '')
                    : (typeof data === 'string' ? data : '');
                const t = parseLbXml(xmlText);
                if (t) { setMovieTitle(t); saveMovieCache(t); return; }
            } catch (_) {}
        }

        if (!cached && lbTitle) lbTitle.textContent = 'unavailable';
    })();

    const lfmTitleEl  = el('lfm-title');
    const lfmArtistEl = el('lfm-artist');
    const lfmLabelEl  = el('lfm-label');

    lfmFetch('method=user.getrecenttracks&limit=1')
        .then(d => {
            const track = d?.recenttracks?.track?.[0];
            if (!track) return;
            const isNow = track['@attr']?.nowplaying === 'true';
            if (lfmTitleEl)  lfmTitleEl.textContent  = track.name;
            if (lfmArtistEl) lfmArtistEl.textContent = '— ' + track.artist['#text'];
            if (isNow) {
                if (lfmLabelEl) lfmLabelEl.textContent = 'now listening';
                const dot = lfmTitleEl?.closest('.status-line')?.querySelector('.sdot');
                if (dot) dot.style.animation = 'pulse 1s ease-in-out infinite';
            } else {
                if (lfmLabelEl) lfmLabelEl.textContent = 'last played';
            }
        })
        .catch(() => {});

    const lfmShelf = el('lfm-shelf');
    lfmFetch('method=user.getrecenttracks&limit=6')
        .then(d => {
            const tracks = d?.recenttracks?.track;
            if (!tracks?.length) throw new Error('empty');
            if (lfmShelf) {
                lfmShelf.innerHTML = tracks.slice(0, 6).map(t => {
                    const isNow = t['@attr']?.nowplaying === 'true';
                    return `<li>
                        <span class="shelf-track">${t.name}${isNow ? '<span class="shelf-now">▶ now</span>' : ''}</span>
                        <span class="shelf-sub">${t.artist['#text']}</span>
                    </li>`;
                }).join('');
            }
        })
        .catch(() => {
            if (lfmShelf) lfmShelf.innerHTML = '<li style="opacity:.35">unavailable</li>';
        });

    const lbShelf = el('lb-shelf');
    if (lbShelf) {
        lbShelf.innerHTML = CONFIG.topFilms.map(f =>
            `<li><span class="shelf-film">${f.title}</span><span class="shelf-sub">${f.year}</span></li>`
        ).join('');
    }

    return () => { if (ageTicker !== null) clearInterval(ageTicker); };
}


// ─── easter eggs + secret password commands ───────────────────

function initEasterEggs() {

    function cmdLove() {
        const lp = el('love-popup');
        if (!lp) return;
        lp.classList.add('open');
        spawnHearts(10, 1);
        setTimeout(() => lp.classList.remove('open'), 2500);
    }

    function cmdMatrix() {
        const overlay = el('matrix-overlay');
        const canvas  = el('matrix-canvas');
        if (!overlay || !canvas) return;
        overlay.classList.add('open');
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;

        const ctx   = canvas.getContext('2d');
        const cols  = Math.floor(canvas.width / 14);
        const drops = Array(cols).fill(1);
        const chars = 'アイウエオカキクケコサシスセソタチツテトABCDEF0123456789';

        const timer = setInterval(() => {
            ctx.fillStyle = 'rgba(0,0,0,.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#0f0';
            ctx.font = '14px monospace';
            drops.forEach((y, i) => {
                ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 14, y * 14);
                if (y * 14 > canvas.height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            });
        }, 40);

        overlay.onclick = () => {
            clearInterval(timer);
            overlay.classList.remove('open');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            overlay.onclick = null;
        };
    }

    function cmdKonami() {
        const colors = ['#D6536D', '#75a5fe', '#1DB954', '#ffd700', '#ff6b6b', '#a29bfe'];
        for (let i = 0; i < 120; i++) {
            const c = document.createElement('div');
            c.className = 'confetti-piece';
            c.style.cssText = [
                `left:${Math.random() * 100}vw`,
                `background:${colors[Math.floor(Math.random() * colors.length)]}`,
                `border-radius:${Math.random() > 0.5 ? '50%' : '0'}`,
                `animation-duration:${1.5 + Math.random() * 2}s`,
                `animation-delay:${Math.random() * 0.8}s`,
                `width:${6 + Math.random() * 6}px`,
                `height:${6 + Math.random() * 6}px`,
            ].join(';');
            document.body.appendChild(c);
            c.addEventListener('animationend', () => c.remove());
        }
    }

    function cmdDebug() {
        const teardown = runTerminal([
            '> initializing session...',
            `> user agent: ${navigator.userAgent.slice(0, 60)}...`,
            `> screen: ${screen.width}x${screen.height}`,
            `> timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
            `> language: ${navigator.language}`,
            `> platform: ${navigator.platform}`,
            '> scanning files... [████████░░] 80%',
            '> scanning files... [██████████] 100%',
            '> WARNING: suspicious taste in music detected',
            '> WARNING: too many GitHub repos',
            '> running diagnostics on portfolio visitor...',
            '> result: probably a cool person',
            '> session logged. have a good day.',
            '> _',
        ], 220);
        const exitBtn = el('debug-exit');
        if (exitBtn) exitBtn.onclick = teardown;
    }

    function cmdSudo() {
        const teardown = runTerminal([
            '$ sudo rm -rf /',
            '> checking permissions...',
            '> [sudo] password for visitor: ',
            '> Sorry, try again.',
            '> [sudo] password for visitor: ',
            '> Sorry, try again.',
            '> [sudo] password for visitor: ',
            '> sudo: 3 incorrect password attempts',
            '> nice try. permission denied.',
            '> _',
        ], 280);
        const exitBtn = el('debug-exit');
        if (exitBtn) exitBtn.onclick = teardown;
    }

    function cmdHint() {
        const modal   = el('hint-confirm');
        const yesBtn  = el('hint-yes');
        const noBtn   = el('hint-no');
        if (!modal || !yesBtn || !noBtn) return;
        modal.classList.add('open');
        yesBtn.onclick = () => {
            modal.classList.remove('open');
            setTimeout(() => openOverlay('commands-list'), 50);
        };
        noBtn.onclick = () => modal.classList.remove('open');
    }

    function cmdSongs() {
        openOverlay('overlay-songs');
        const songsList = el('songs-list');
        lfmFetch('method=user.getrecenttracks&limit=10')
            .then(d => {
                const tracks = d?.recenttracks?.track;
                if (!tracks?.length) throw new Error('empty');
                if (songsList) {
                    songsList.innerHTML = tracks.slice(0, 10).map((t, i) => {
                        const isNow = t['@attr']?.nowplaying === 'true';
                        return `<div class="info-row">
                            <span class="info-key">${isNow ? '▶' : (i + 1 + '.')} ${t.name}</span>
                            <span class="info-val">${t.artist['#text']}</span>
                        </div>`;
                    }).join('');
                }
            })
            .catch(() => {
                if (songsList) songsList.innerHTML =
                    '<div class="info-row"><span class="info-key">unavailable</span></div>';
            });
    }

    function cmdStats() {
        openOverlay('overlay-stats');
        const statsList = el('stats-list');
        lfmFetch('method=user.getinfo')
            .then(d => {
                const u = d?.user;
                if (!u) throw new Error('no user');
                return lfmFetch('method=user.gettopartists&limit=3&period=overall')
                    .then(d2 => {
                        const top = d2?.topartists?.artist?.map(a => a.name).join(', ') || '—';
                        if (statsList) {
                            statsList.innerHTML = `
                                <div class="info-row"><span class="info-key">scrobbles</span><span class="info-val">${parseInt(u.playcount).toLocaleString()}</span></div>
                                <div class="info-row"><span class="info-key">artists</span><span class="info-val">${parseInt(u.artist_count || 0).toLocaleString()}</span></div>
                                <div class="info-row"><span class="info-key">tracks</span><span class="info-val">${parseInt(u.track_count || 0).toLocaleString()}</span></div>
                                <div class="info-row"><span class="info-key">top artists</span><span class="info-val">${top}</span></div>
                                <div class="info-row"><span class="info-key">member since</span><span class="info-val">${new Date(u.registered['#text'] * 1000).getFullYear()}</span></div>`;
                        }
                    });
            })
            .catch(() => {
                if (statsList) statsList.innerHTML =
                    '<div class="info-row"><span class="info-key">unavailable</span></div>';
            });
    }

    function cmdFilms() {
        openOverlay('overlay-films');
        const filmsList = el('films-list');
        if (filmsList) {
            filmsList.innerHTML = CONFIG.topFilms.map((f, i) =>
                `<div class="info-row"><span class="info-key">${i + 1}. ${f.title}</span><span class="info-val">${f.year}</span></div>`
            ).join('');
        }
    }

    function cmdWhoami() {
        openOverlay('overlay-whoami');
        const whoamiList = el('whoami-list');
        if (!whoamiList) return;
        const birth = new Date(CONFIG.birthDate);
        const age   = ((Date.now() - birth) / (1000 * 60 * 60 * 24 * 365.2425)).toFixed(2);
        whoamiList.innerHTML = `
            <div class="info-row"><span class="info-key">name</span><span class="info-val">Shivansh Pratap Singh</span></div>
            <div class="info-row"><span class="info-key">age</span><span class="info-val">${age} years</span></div>
            <div class="info-row"><span class="info-key">status</span><span class="info-val">3rd year CS student</span></div>
            <div class="info-row"><span class="info-key">focus</span><span class="info-val">backend + DSA + open source</span></div>
            <div class="info-row"><span class="info-key">github</span><span class="info-val">${CONFIG.github}</span></div>
            <div class="info-row"><span class="info-key">last.fm</span><span class="info-val">${CONFIG.lfmUser}</span></div>
            <div class="info-row"><span class="info-key">letterboxd</span><span class="info-val">${CONFIG.letterboxd}</span></div>
            <div class="info-row"><span class="info-key">vibe</span><span class="info-val">terminal aesthetic, lo-fi, film noir</span></div>`;
    }

    const HANDLERS = {
        rickroll: () => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank'),
        love:     cmdLove,
        cutie:    () => window.open('https://www.youtube.com/watch?v=2AbqqxbKS3o', '_blank'),
        playlist: () => window.open('https://open.spotify.com/playlist/4pt9orlLW8djFkW1OIuEwa?si=f344fa9d812c4a35', '_blank'),
        matrix:   cmdMatrix,
        lofi:     () => window.open('https://www.youtube.com/watch?v=jfKfPfyJRdk', '_blank'),
        konami:   cmdKonami,
        debug:    cmdDebug,
        void:     () => openOverlay('void-overlay', 3000),
        hint:     cmdHint,
        songs:    cmdSongs,
        stats:    cmdStats,
        films:    cmdFilms,
        whoami:   cmdWhoami,
        404:      () => openOverlay('overlay-404', 3000),
        sleep:    () => openOverlay('sleep-overlay', 3000),
        glitch:   () => { document.body.classList.add('glitching'); setTimeout(() => document.body.classList.remove('glitching'), 700); },
        invert:   () => { document.documentElement.style.filter = 'invert(1) hue-rotate(180deg)'; setTimeout(() => document.documentElement.style.filter = '', 3000); },
        rage:     () => { document.body.classList.add('raging'); setTimeout(() => document.body.classList.remove('raging'), 1000); },
        sudo:     cmdSudo,
    };

    const pwModal = el('pw-modal');
    const pwInput = el('pw-input');
    if (!pwModal || !pwInput) return;

    function tryPassword() {
        const word   = pwInput.value.trim().toLowerCase();
        const action = CONFIG.secretCommands[word];
        const fn     = action && HANDLERS[action];
        if (fn) {
            pwModal.classList.remove('open');
            pwInput.value = '';
            fn();
        } else {
            pwInput.classList.remove('wrong');
            try { void pwInput.offsetWidth; } catch (_) {}
            pwInput.classList.add('wrong');
            pwInput.value = '';
            setTimeout(() => pwInput.classList.remove('wrong'), 400);
        }
    }

    const pwSubmit = el('pw-submit');
    const pwCancel = el('pw-cancel');
    const cmdClose = el('commands-close');

    if (pwSubmit) pwSubmit.addEventListener('click', tryPassword);
    pwInput.addEventListener('keydown', e => { if (e.key === 'Enter') tryPassword(); });
    if (pwCancel) pwCancel.addEventListener('click', () => {
        pwModal.classList.remove('open');
        pwInput.value = '';
    });
    if (cmdClose) cmdClose.addEventListener('click', () => {
        const cmdList = el('commands-list');
        if (cmdList) cmdList.classList.remove('open');
    });

    const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let konamiIdx = 0;
    document.addEventListener('keydown', e => {
        konamiIdx = (e.key === KONAMI[konamiIdx]) ? konamiIdx + 1 : (e.key === KONAMI[0] ? 1 : 0);
        if (konamiIdx === KONAMI.length) { konamiIdx = 0; cmdKonami(); }
    });

    const egg     = el('easter-egg');
    const eggClose = el('egg-close');
    if (egg && eggClose) {
        eggClose.addEventListener('click', () => {
            egg.classList.remove('open');
            document.body.style.overflow = '';
        });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && egg.classList.contains('open')) {
                egg.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    }
}


// ─── footer ───────────────────────────────────────────────────

function initFooter() {
    const heartBtn      = el('heart-btn');
    const spotifyReveal = el('spotify-reveal');
    if (!heartBtn) return;
    let heartCount = 0;

    heartBtn.addEventListener('click', () => {
        heartCount++;
        heartBtn.classList.remove('beat');
        try { void heartBtn.offsetWidth; } catch (_) {}
        heartBtn.classList.add('beat');
        spawnHearts(4, 1);
        if (heartCount === 1 && spotifyReveal) spotifyReveal.style.display = 'flex';
        if (heartCount % 10 === 0) {
            heartCount = 0;
            openPasswordModal();
        }
    });

    const hdrTitle = document.querySelector('.hdr-title');
    if (hdrTitle) {
        let titleCount = 0;
        hdrTitle.style.cursor = 'pointer';
        hdrTitle.addEventListener('click', () => {
            if (++titleCount >= 10) {
                titleCount = 0;
                openPasswordModal();
            }
        });
    }
}


// ─── boot ─────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.classList.add('ready');
    initTheme();
    initNavigation();
    initCursor();
    initLiveData();
    initEasterEggs();
    initFooter();

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () =>
            navigator.serviceWorker.register('service-worker.js').catch(() => {})
        );
    }
});
