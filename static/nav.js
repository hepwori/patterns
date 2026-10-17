// Progressive enhancement only: the site is fully static HTML and works without this.
// Mobile menu toggle, sidebar search filter, and remembering the sidebar scroll position.
(function () {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  const nav = document.getElementById('sidebar-nav');

  document.getElementById('menu-toggle').addEventListener('click', () => {
    sidebar.classList.toggle('open');
    backdrop.classList.toggle('open');
  });
  backdrop.addEventListener('click', () => {
    sidebar.classList.remove('open');
    backdrop.classList.remove('open');
  });

  document.getElementById('nav-search').addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    document.querySelectorAll('.nav-category').forEach((section) => {
      let anyVisible = false;
      section.querySelectorAll('li').forEach((li) => {
        const a = li.querySelector('a');
        const matches =
          !q || a.textContent.toLowerCase().includes(q) || (a.dataset.summary || '').toLowerCase().includes(q);
        li.classList.toggle('nav-link-hidden', !matches);
        if (matches) anyVisible = true;
      });
      section.classList.toggle('nav-category-hidden', !anyVisible);
    });
  });

  // Full page loads reset the sidebar scroll; put it back.
  try {
    const saved = sessionStorage.getItem('navScroll');
    if (saved) nav.scrollTop = +saved;
    window.addEventListener('pagehide', () => sessionStorage.setItem('navScroll', nav.scrollTop));
  } catch (e) {}
})();
