const STAGE_SELECTOR = '[data-lesson-rail]';

function initRail() {
  const rail = document.querySelector(STAGE_SELECTOR);
  if (!rail || rail.dataset.railReady === 'true') return;
  rail.dataset.railReady = 'true';

  const steps = [...rail.querySelectorAll('[data-rail-step]')];
  const targets = steps.map((step) => document.getElementById(step.dataset.stage));
  const fill = rail.querySelector('[data-rail-fill]');
  let current = -1;

  const update = () => {
    const threshold = Math.max(
      rail.getBoundingClientRect().bottom + 16,
      window.innerHeight * 0.3
    );
    let index = 0;

    targets.forEach((target, targetIndex) => {
      if (target && target.getBoundingClientRect().top <= threshold) index = targetIndex;
    });

    const atBottom =
      window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
    if (atBottom) index = steps.length - 1;

    if (index === current) return;
    current = index;

    steps.forEach((step, stepIndex) => {
      step.classList.toggle('is-active', stepIndex === index);
      step.classList.toggle('is-done', stepIndex < index);
      const link = step.querySelector('.lesson-rail-link');
      if (!link) return;
      if (stepIndex === index) link.setAttribute('aria-current', 'step');
      else link.removeAttribute('aria-current');
    });

    if (fill) {
      const ratio = steps.length > 1 ? index / (steps.length - 1) : 0;
      fill.style.width = `${ratio * 75}%`;
    }
  };

  let ticking = false;
  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      update();
    });
  };

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  rail.addEventListener('click', (event) => {
    const link = event.target instanceof Element ? event.target.closest('.lesson-rail-link') : null;
    if (link) requestUpdate();
  });

  update();
}

function initCodeOverflow() {
  document.querySelectorAll('.expressive-code').forEach((frame) => {
    const pre = frame.querySelector('pre');
    if (!pre || pre.dataset.overflowReady === 'true') return;
    pre.dataset.overflowReady = 'true';

    const sync = () => {
      const scrollable = pre.scrollWidth > pre.clientWidth + 2;
      frame.classList.toggle('is-scrollable', scrollable);
      frame.classList.toggle(
        'is-scroll-end',
        scrollable && pre.scrollLeft + pre.clientWidth >= pre.scrollWidth - 4
      );
    };

    pre.addEventListener('scroll', sync, { passive: true });

    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(sync);
      observer.observe(pre);
    }

    sync();
  });
}

function init() {
  initRail();
  initCodeOverflow();
}

init();
document.addEventListener('DOMContentLoaded', init);
document.addEventListener('astro:page-load', init);
window.addEventListener('load', initCodeOverflow);
