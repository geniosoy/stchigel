// Source - https://stackoverflow.com/a/54849460
// Posted by Rathnakara S
// Retrieved 2026-04-21, License - CC BY-SA 4.0
// "Diseñador"

const words = ["Stchigel", "Programador", "Desarrollador", "Tecnico", "Administrador"];
let i = 0;
let timer;

function typingEffect() {
    let word = words[i].split("");
    var loopTyping = function() {
        if (word.length > 0) {
            document.getElementById('word').innerHTML += word.shift();
        } else {
            deletingEffect();
            return false;
        };
        timer = setTimeout(loopTyping, 500);
    };
    loopTyping();
};

function deletingEffect() {
    let word = words[i].split("");
    var loopDeleting = function() {
        if (word.length > 0) {
            word.pop();
            document.getElementById('word').innerHTML = word.join("");
        } else {
            if (words.length > (i + 1)) {
                i++;
            } else {
                i = 0;
            };
            typingEffect();
            return false;
        };
        timer = setTimeout(loopDeleting, 200);
    };
    loopDeleting();
};

typingEffect();

// -- Scroll-driven roller ------------------------------------------

const sidebar  = document.querySelector('.sidebar');
const navItems = Array.from(document.querySelectorAll('.nav-item[data-panel]'));
const panels   = document.querySelectorAll('.panel');

let activePanelId = null;
let activeIndex   = -1;

function updateRoller() {
    const sH = sidebar.clientHeight;
    const centerY = sH / 2;

    let closestItem  = null;
    let closestDist  = Infinity;
    let closestIndex = 0;

    navItems.forEach((item, idx) => {
        const rect  = item.getBoundingClientRect();
        const sRect = sidebar.getBoundingClientRect();
        const itemCenter = rect.top - sRect.top + rect.height / 2;
        const dist = Math.abs(itemCenter - centerY);

        // opacity: 1 at center, ~0.12 at edges
        const t = Math.min(dist / (sH * 0.38), 1);
        const opacity = 1 - t * 0.88;
        // centered item is 20% larger; edges return to base size
        const scale = 1 + (1 - t) * 0.20;

        item.style.opacity = opacity;
        item.style.transform = `scale(${scale})`;

        if (dist < closestDist) {
            closestDist  = dist;
            closestItem  = item;
            closestIndex = idx;
        }
    });

    if (!closestItem) return;

    const panelId = closestItem.dataset.panel;
    if (panelId === activePanelId) return;

    const dir = closestIndex > activeIndex ? 1 : -1;
    showPanel(panelId, dir);

    activePanelId = panelId;
    activeIndex   = closestIndex;
}

function showPanel(panelId, dir) {
    const easing = 'cubic-bezier(0.4, 0, 0.2, 1)';
    const outY = dir === 1 ? '-28px' : '28px';
    const inY  = dir === 1 ? '28px'  : '-28px';

    panels.forEach(p => {
        if (!p.classList.contains('active')) return;
        p.classList.remove('active');
        p.animate(
            [{ opacity: 1, transform: 'translateY(0)' },
             { opacity: 0, transform: `translateY(${outY})` }],
            { duration: 280, easing: 'ease', fill: 'none' }
        );
    });

    const target = document.getElementById(panelId);
    if (!target) return;

    target.classList.add('active');
    target.animate(
        [{ opacity: 0, transform: `translateY(${inY})` },
         { opacity: 1, transform: 'translateY(0)' }],
        { duration: 380, easing, fill: 'none' }
    );
}

function initScroll() {
    const first = navItems[0];
    if (!first) return;
    const sH = sidebar.clientHeight;
    const itemCenter = first.offsetTop + first.offsetHeight / 2;
    sidebar.scrollTop = itemCenter - sH / 2;
    updateRoller();
}

function scrollToItem(idx) {
    const item = navItems[idx];
    if (!item) return;
    const sH = sidebar.clientHeight;
    sidebar.scrollTo({ top: item.offsetTop + item.offsetHeight / 2 - sH / 2, behavior: 'smooth' });
}

// Intercept wheel so each tick moves exactly one item
let wheelLocked = false;
sidebar.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (wheelLocked) return;
    wheelLocked = true;
    const dir = e.deltaY > 0 ? 1 : -1;
    const current = activeIndex < 0 ? 0 : activeIndex;
    scrollToItem(Math.max(0, Math.min(navItems.length - 1, current + dir)));
    setTimeout(() => { wheelLocked = false; }, 420);
}, { passive: false });

sidebar.addEventListener('scroll', () => {
    requestAnimationFrame(updateRoller);
});

navItems.forEach(item => {
    item.addEventListener('click', () => scrollToItem(navItems.indexOf(item)));
});

// Touch swipe — one swipe moves one item (mirrors wheel behaviour)
let touchStartY = 0;
let touchLocked = false;
sidebar.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
}, { passive: true });
sidebar.addEventListener('touchend', (e) => {
    if (touchLocked) return;
    const dy = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(dy) < 20) return; // ignore taps
    touchLocked = true;
    const dir = dy > 0 ? 1 : -1;
    const current = activeIndex < 0 ? 0 : activeIndex;
    scrollToItem(Math.max(0, Math.min(navItems.length - 1, current + dir)));
    setTimeout(() => { touchLocked = false; }, 420);
}, { passive: true });

window.addEventListener('load', initScroll);
