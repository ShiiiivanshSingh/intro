'use strict';


const CONFIG = {
    github:      'ShiiiivanshSingh',
    lfmUser:     'sh1vanshs2ngh',
    lfmKey:      '0827762c08a7c993f5249162a5805cf1',
    letterboxd:  'ShivanshSingh',
    lbProxy:     'https://letterbocd-proxy.shivanshpratapsingh0807.workers.dev',
    birthDate:   '2005-07-08',
    graphColors: { light: 'D6536D', dark: '75a5fe' },


    
    // watchlist 
    topFilms: [
        { title: "my night at maud's",               year: '1969'},
        { title: 'petite maman',                     year: '2021'},
        { title: 'the apartment',                    year: '1960'},
        { title: 'adventures in babysitting',        year: '1987'},
        { title: 'sleepless in seattle',             year: '1993'},
        { title: 'a girl walks home alone at night', year: '2014'},
    ],

    // what each typed word actually does
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

    // how long to cache the last-watched movie (6 hours in ms)
    movieCacheTTL: 6 * 60 * 60 * 1000,
};

// key we use in localStorage for the cached movie
const MOVIE_CACHE_KEY = 'lb_last_watched';


// ─── small helpers ────────────────────────────────────────────

// spawn floating hearts — bails early if too many are already on screen
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

// open any overlay by id, optionally close it after X ms
function openOverlay(id, autoCloseMs = 0) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('open');
    if (autoCloseMs > 0) setTimeout(() => el.classList.remove('open'), autoCloseMs);
}

// show the password box and focus the input
function openPasswordModal() {
    document.getElementById('pw-modal').classList.add('open');
    setTimeout(() => document.getElementById('pw-input').focus(), 50);
}

// fake terminal effect — returns a function call to clean up
function runTerminal(lines, delayMs = 220) {
    const term = document.getElementById('debug-terminal');
    const out  = document.getElementById('debug-output');
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
    const btn   = document.getElementById('theme-btn');
    const icon  = document.getElementById('theme-icon');
    const bunny = document.getElementById('bunny-btn');
    const egg   = document.getElementById('easter-egg');
    let clicks  = 0;

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        // swap icon
        icon.innerHTML = theme === 'dark'
            ? '<i class="fas fa-moon"></i>'
            : '<i class="fas fa-sun"></i>';
        // swap graph colour too
        const graph = document.getElementById('gh-graph');
        if (graph) graph.src = `https://ghchart.rshah.org/${CONFIG.graphColors[theme]}/${CONFIG.github}`;
    }

    // restore last preference, default to dark
    applyTheme(localStorage.getItem('theme') || 'dark');

    btn.addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', next);
        applyTheme(next);
        // secret: 10 clicks reveals the bunny
        if (++clicks >= 10) {
            clicks = 0;
            bunny.classList.add('visible');
        }
    });

    // bunny click → easter egg
    bunny.addEventListener('click', () => {
        bunny.classList.remove('visible');
        egg.classList.add('open');
        document.body.style.overflow = 'hidden';
    });
}


// ─── nav stuff ────────────────────────────────────────────────

function initNavigation() {
    const bar      = document.getElementById('scroll-bar');
    const hdr      = document.querySelector('.hdr');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    const sections = [...navLinks]
        .map(a => document.querySelector(a.getAttribute('href')))
        .filter(Boolean);

    window.addEventListener('scroll', () => {
        // scroll progress bar
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';

        // shadow on header when scrolled
        hdr.classList.toggle('scrolled', window.scrollY > 10);

        // highlight whichever section is in view
        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
        });
        navLinks.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + current);
        });
    }, { passive: true });

    // mobile hamburger
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');

    hamburger.addEventListener('click', () => {
        const isOpen = mobileNav.classList.toggle('open');
        hamburger.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
        mobileNav.setAttribute('aria-hidden', String(!isOpen));
    });

    // close drawer when a link is tapped
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('open');
            hamburger.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
            mobileNav.setAttribute('aria-hidden', 'true');
        });
    });
}


// ─── custom cursor ────────────────────────────────────────────

function initCursor() {
    // only bother on actual pointer devices
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const dot  = document.getElementById('cur-dot');
    const ring = document.getElementById('cur-ring');
    let rx = -20, ry = -20, mx = -20, my = -20;

    // dot snaps immediately
    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        dot.style.left = mx + 'px';
        dot.style.top  = my + 'px';
    });

    // ring lags a little behind via lerp
    (function loop() {
        rx += (mx - rx) * 0.14;
        ry += (my - ry) * 0.14;
        ring.style.left = rx + 'px';
        ring.style.top  = ry + 'px';
        requestAnimationFrame(loop);
    })();

    // ring grows over clickable things
    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('big'));
        el.addEventListener('mouseleave', () => ring.classList.remove('big'));
    });
}


// ─── live data (letterboxd, last.fm, age counter) ─────────────

function initLiveData() {

    // age — ticks every 50ms so you can watch the decimals go lol
    const ageEl = document.getElementById('age');
    if (ageEl) {
        const birth = new Date(CONFIG.birthDate);
        const tick  = () => {
            ageEl.textContent = ((Date.now() - birth) / (1000 * 60 * 60 * 24 * 365.2425)).toFixed(9);
        };
        tick();
        setInterval(tick, 50);
    }

    // letterboxd last-watched film
    const lbTitle = document.getElementById('lb-title');
    const lbUrl   = `https://letterboxd.com/${CONFIG.letterboxd}/rss/`;

    // ── loading animation ──────────────────────────────────────
    // show a pulsing ellipsis while we wait for the fetch
    function showMovieLoading() {
        if (!lbTitle) return;
        lbTitle.innerHTML = '<span class="lb-loading">fetching<span class="lb-dots"><span>.</span><span>.</span><span>.</span></span></span>';

        // inject the keyframe styles once
        if (!document.getElementById('lb-loading-style')) {
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
    // ──────────────────────────────────────────────────────────

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
        const xml = new DOMParser().parseFromString(text, 'text/xml');
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
        if (lbTitle && title) lbTitle.textContent = title;
    }

    function saveMovieCache(title) {
        try {
            localStorage.setItem(MOVIE_CACHE_KEY, JSON.stringify({
                title,
                ts: Date.now(),
            }));
        } catch (_) {}
    }

    function loadMovieCache() {
        try {
            const raw = localStorage.getItem(MOVIE_CACHE_KEY);
            if (!raw) return null;
            const { title, ts } = JSON.parse(raw);
            if (Date.now() - ts > CONFIG.movieCacheTTL) return null;
            return title;
        } catch (_) {
            return null;
        }
    }

    // show cached value instantly if we have one, otherwise show loading
    const cached = loadMovieCache();
    if (cached) {
        setMovieTitle(cached);
    } else {
        showMovieLoading();
    }

    // fetch fresh data in the background
    (async () => {
        const attempts = [
            // your cloudflare worker — no ?url= needed, it hardcodes the RSS URL
            ...(CONFIG.lbProxy ? [{ url: CONFIG.lbProxy, as: 'text' }] : []),
            // public proxy fallbacks
            { url: `https://api.allorigins.win/raw?url=${encodeURIComponent(lbUrl)}`, as: 'text' },
            { url: `https://api.allorigins.win/get?url=${encodeURIComponent(lbUrl)}`, as: 'json' },
        ];

        for (const a of attempts) {
            try {
                const data = await fetchWithTimeout(a.url, 7000, a.as);
                const xmlText = a.as === 'json' ? (data?.contents || '') : String(data || '');
                const t = xmlText ? parseLbXml(xmlText) : null;
                if (t) { setMovieTitle(t); saveMovieCache(t); return; }
            } catch (_) {}
        }

        // all attempts failed
        if (!cached) {
            if (lbTitle) lbTitle.textContent = 'unavailable';
        }
    })();

    // last.fm status line — "now listening" or "last played"
    const lfmTitle  = document.getElementById('lfm-title');
    const lfmArtist = document.getElementById('lfm-artist');
    const lfmLabel  = document.getElementById('lfm-label');

    fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${CONFIG.lfmUser}&api_key=${CONFIG.lfmKey}&format=json&limit=1`)
        .then(r => r.json())
        .then(d => {
            const track = d?.recenttracks?.track?.[0];
            if (!track) return;
            const isNow = track['@attr']?.nowplaying === 'true';
            lfmTitle.textContent  = track.name;
            lfmArtist.textContent = '— ' + track.artist['#text'];
            if (isNow) {
                if (lfmLabel) lfmLabel.textContent = 'now listening';
                const dot = lfmTitle.closest('.status-line')?.querySelector('.sdot');
                if (dot) dot.style.animation = 'pulse 1s ease-in-out infinite';
            } else {
                if (lfmLabel) lfmLabel.textContent = 'last played';
            }
        })
        .catch(() => {});

    // last.fm shelf — 6 most recent tracks
    fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${CONFIG.lfmUser}&api_key=${CONFIG.lfmKey}&format=json&limit=6`)
        .then(r => r.json())
        .then(d => {
            const tracks = d?.recenttracks?.track;
            if (!tracks?.length) throw new Error('empty');
            document.getElementById('lfm-shelf').innerHTML = tracks.slice(0, 6).map(t => {
                const isNow = t['@attr']?.nowplaying === 'true';
                return `<li>
                    <span class="shelf-track">${t.name}${isNow ? '<span class="shelf-now">▶ now</span>' : ''}</span>
                    <span class="shelf-sub">${t.artist['#text']}</span>
                </li>`;
            }).join('');
        })
        .catch(() => {
            document.getElementById('lfm-shelf').innerHTML = '<li style="opacity:.35">unavailable</li>';
        });

    // films shelf — static config data
    document.getElementById('lb-shelf').innerHTML = CONFIG.topFilms.map(f =>
        `<li><span class="shelf-film">${f.title}</span><span class="shelf-sub">${f.year}</span></li>`
    ).join('');
}


// ─── easter eggs + secret password commands ───────────────────

function initEasterEggs() {

    // individual command handlers

    function cmdLove() {
        const lp = document.getElementById('love-popup');
        lp.classList.add('open');
        spawnHearts(10, 1);
        setTimeout(() => lp.classList.remove('open'), 2500);
    }

    function cmdMatrix() {
        const overlay = document.getElementById('matrix-overlay');
        const canvas  = document.getElementById('matrix-canvas');
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
        document.getElementById('debug-exit').onclick = teardown;
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
        document.getElementById('debug-exit').onclick = teardown;
    }

    function cmdHint() {
        const modal = document.getElementById('hint-confirm');
        modal.classList.add('open');
        document.getElementById('hint-yes').onclick = () => {
            modal.classList.remove('open');
            setTimeout(() => openOverlay('commands-list'), 50);
        };
        document.getElementById('hint-no').onclick = () => modal.classList.remove('open');
    }

    function cmdSongs() {
        openOverlay('overlay-songs');
        fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${CONFIG.lfmUser}&api_key=${CONFIG.lfmKey}&format=json&limit=10`)
            .then(r => r.json())
            .then(d => {
                const tracks = d?.recenttracks?.track;
                if (!tracks?.length) throw new Error('empty');
                document.getElementById('songs-list').innerHTML = tracks.slice(0, 10).map((t, i) => {
                    const isNow = t['@attr']?.nowplaying === 'true';
                    return `<div class="info-row">
                        <span class="info-key">${isNow ? '▶' : (i + 1 + '.')} ${t.name}</span>
                        <span class="info-val">${t.artist['#text']}</span>
                    </div>`;
                }).join('');
            })
            .catch(() => {
                document.getElementById('songs-list').innerHTML =
                    '<div class="info-row"><span class="info-key">unavailable</span></div>';
            });
    }

    function cmdStats() {
        openOverlay('overlay-stats');
        const base = `https://ws.audioscrobbler.com/2.0/?user=${CONFIG.lfmUser}&api_key=${CONFIG.lfmKey}&format=json`;
        fetch(`${base}&method=user.getinfo`)
            .then(r => r.json())
            .then(d => {
                const u = d?.user;
                if (!u) throw new Error('no user');
                return fetch(`${base}&method=user.gettopartists&limit=3&period=overall`)
                    .then(r2 => r2.json())
                    .then(d2 => {
                        const top = d2?.topartists?.artist?.map(a => a.name).join(', ') || '—';
                        document.getElementById('stats-list').innerHTML = `
                            <div class="info-row"><span class="info-key">scrobbles</span><span class="info-val">${parseInt(u.playcount).toLocaleString()}</span></div>
                            <div class="info-row"><span class="info-key">artists</span><span class="info-val">${parseInt(u.artist_count || 0).toLocaleString()}</span></div>
                            <div class="info-row"><span class="info-key">tracks</span><span class="info-val">${parseInt(u.track_count || 0).toLocaleString()}</span></div>
                            <div class="info-row"><span class="info-key">top artists</span><span class="info-val">${top}</span></div>
                            <div class="info-row"><span class="info-key">member since</span><span class="info-val">${new Date(u.registered['#text'] * 1000).getFullYear()}</span></div>`;
                    });
            })
            .catch(() => {
                document.getElementById('stats-list').innerHTML =
                    '<div class="info-row"><span class="info-key">unavailable</span></div>';
            });
    }

    function cmdFilms() {
        openOverlay('overlay-films');
        document.getElementById('films-list').innerHTML = CONFIG.topFilms.map((f, i) =>
`<div class="info-row"><span class="info-key">${i + 1}. ${f.title}</span><span class="info-val">${f.year}</span></div>`
                                                                             ).join('');
    }

    function cmdWhoami() {
        openOverlay('overlay-whoami');
        const birth = new Date(CONFIG.birthDate);
        const age   = ((Date.now() - birth) / (1000 * 60 * 60 * 24 * 365.2425)).toFixed(2);
        document.getElementById('whoami-list').innerHTML = `
            <div class="info-row"><span class="info-key">name</span><span class="info-val">Shivansh Pratap Singh</span></div>
            <div class="info-row"><span class="info-key">age</span><span class="info-val">${age} years</span></div>
            <div class="info-row"><span class="info-key">status</span><span class="info-val">3rd year CS student</span></div>
            <div class="info-row"><span class="info-key">focus</span><span class="info-val">backend + DSA + open source</span></div>
            <div class="info-row"><span class="info-key">github</span><span class="info-val">${CONFIG.github}</span></div>
            <div class="info-row"><span class="info-key">last.fm</span><span class="info-val">${CONFIG.lfmUser}</span></div>
            <div class="info-row"><span class="info-key">letterboxd</span><span class="info-val">${CONFIG.letterboxd}</span></div>
            <div class="info-row"><span class="info-key">vibe</span><span class="info-val">terminal aesthetic, lo-fi, film noir</span></div>`;
    }

    // map action names to functions
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

    // password modal logic
    const pwModal = document.getElementById('pw-modal');
    const pwInput = document.getElementById('pw-input');

    function tryPassword() {
        const word   = pwInput.value.trim().toLowerCase();
        const action = CONFIG.secretCommands[word];
        const fn     = action && HANDLERS[action];
        if (fn) {
            pwModal.classList.remove('open');
            pwInput.value = '';
            fn();
        } else {
            // wrong password — shake the input
            pwInput.classList.remove('wrong');
            void pwInput.offsetWidth; // force reflow so animation replays
            pwInput.classList.add('wrong');
            pwInput.value = '';
            setTimeout(() => pwInput.classList.remove('wrong'), 400);
        }
    }

    document.getElementById('pw-submit').addEventListener('click', tryPassword);
    pwInput.addEventListener('keydown', e => { if (e.key === 'Enter') tryPassword(); });
    document.getElementById('pw-cancel').addEventListener('click', () => {
        pwModal.classList.remove('open');
        pwInput.value = '';
    });
    document.getElementById('commands-close').addEventListener('click', () => {
        document.getElementById('commands-list').classList.remove('open');
    });

    // konami code — ↑↑↓↓←→←→BA
    const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let konamiIdx = 0;
    document.addEventListener('keydown', e => {
        konamiIdx = (e.key === KONAMI[konamiIdx]) ? konamiIdx + 1 : (e.key === KONAMI[0] ? 1 : 0);
        if (konamiIdx === KONAMI.length) { konamiIdx = 0; cmdKonami(); }
    });

    // escape closes the easter egg overlay
    const egg = document.getElementById('easter-egg');
    document.getElementById('egg-close').addEventListener('click', () => {
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


// ─── footer heart + hidden title clicks ───────────────────────

function initFooter() {
    const heartBtn      = document.getElementById('heart-btn');
    const spotifyReveal = document.getElementById('spotify-reveal');
    let heartCount = 0;

    heartBtn.addEventListener('click', () => {
        heartCount++;

        // bounce animation
        heartBtn.classList.remove('beat');
        void heartBtn.offsetWidth;
        heartBtn.classList.add('beat');

        spawnHearts(4, 1);

        // spotify link appears on first click
        if (heartCount === 1) spotifyReveal.style.display = 'flex';

        // every 10 clicks → secret modal
        if (heartCount % 10 === 0) {
            heartCount = 0;
            openPasswordModal();
        }
    });

    // clicking the header title 10 times also opens the modal
    const hdrTitle = document.querySelector('.hdr-title');
    let titleCount = 0;
    hdrTitle.style.cursor = 'pointer';
    hdrTitle.addEventListener('click', () => {
        if (++titleCount >= 10) {
            titleCount = 0;
            openPasswordModal();
        }
    });
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

    // service worker — silently does nothing if the file isn't there
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () =>
            navigator.serviceWorker.register('service-worker.js').catch(() => {})
        );
    }
});
