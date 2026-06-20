console.log("JavaScript is successfully connected!");

// ── Active nav link ──
document.querySelectorAll('.page-link').forEach(link => {
  if (link.href === window.location.href) {
    link.classList.add('active');
  }
});

// ── Language toggle ──
function applyLanguage(lang) {
  const strings = (typeof i18n !== 'undefined') ? i18n[lang] : null;
  if (!strings) return;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (strings[key] !== undefined) el.innerHTML = strings[key];
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (strings[key] !== undefined) el.placeholder = strings[key];
  });

  document.documentElement.lang = lang;
  localStorage.setItem('lang', lang);
}

const headerNav = document.querySelector('header nav');
if (headerNav) {
  const langBtn = document.createElement('button');
  langBtn.id = 'lang-toggle';
  langBtn.className = 'page-link';

  function updateLangBtn(lang) {
    langBtn.textContent = lang === 'en' ? 'ES' : 'EN';
    langBtn.setAttribute('aria-label', lang === 'en' ? 'Switch to Spanish' : 'Switch to English');
  }

  const initLang = localStorage.getItem('lang') || 'en';
  updateLangBtn(initLang);

  langBtn.addEventListener('click', () => {
    const current = localStorage.getItem('lang') || 'en';
    const next = current === 'en' ? 'es' : 'en';
    applyLanguage(next);
    updateLangBtn(next);
  });

  headerNav.appendChild(langBtn);
  applyLanguage(initLang);

  // ── Dark mode toggle ──
  const themeBtn = document.createElement('button');
  themeBtn.id = 'theme-toggle';
  themeBtn.className = 'page-link';

  function updateThemeBtn(theme) {
    themeBtn.textContent = theme === 'dark' ? '☀' : '☾';
    themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }

  const initTheme = localStorage.getItem('theme') || 'light';
  updateThemeBtn(initTheme);

  themeBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next === 'dark' ? 'dark' : '');
    localStorage.setItem('theme', next);
    updateThemeBtn(next);
  });

  headerNav.appendChild(themeBtn);
}

// ── Copyright year + colophon link ──
const footer = document.querySelector('footer');
if (footer) {
  const thisSiteLink = footer.querySelector('.footer-nav a:not([target="_blank"])');
  if (thisSiteLink) thisSiteLink.remove();

  const bottomRow = document.createElement('div');
  bottomRow.className = 'footer-bottom';

  const copyright = document.createElement('p');
  copyright.className = 'copyright';
  copyright.textContent = `© ${new Date().getFullYear()} Landry Underhill`;
  bottomRow.appendChild(copyright);

  if (thisSiteLink) {
    thisSiteLink.className = 'footer-colophon-link';
    bottomRow.appendChild(thisSiteLink);
  }

  footer.appendChild(bottomRow);
}

// ── Scroll to top ──
const scrollBtn = document.createElement('button');
scrollBtn.id = 'scroll-top';
scrollBtn.innerHTML = '↑';
scrollBtn.title = 'Back to top';
scrollBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
document.body.appendChild(scrollBtn);

window.addEventListener('scroll', () => {
  scrollBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
});

// ── Slideshow ──
let slideIndex = 0;
let dots = [];

function initSlideshow() {
  const container = document.querySelector('.slideshow-container');
  const slides = document.getElementsByClassName("slides");
  if (!container || slides.length === 0) { return; }

  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'dots-container';
  for (let i = 0; i < slides.length; i++) {
    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.onclick = () => goToSlide(i + 1);
    dotsContainer.appendChild(dot);
    dots.push(dot);
  }
  container.appendChild(dotsContainer);

  showSlides();
}

function updateDots() {
  dots.forEach((dot, i) => dot.classList.toggle('active', i === slideIndex - 1));
}

function showSlides() {
  const slides = document.getElementsByClassName("slides");
  if (slides.length === 0) { return; }
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) { slideIndex = 1; }
  slides[slideIndex - 1].style.display = "block";
  updateDots();
  setTimeout(showSlides, 10000);
}

function changeSlide(direction) {
  const slides = document.getElementsByClassName("slides");
  if (slides.length === 0) { return; }
  slides[slideIndex - 1].style.display = "none";
  slideIndex += direction;
  if (slideIndex > slides.length) { slideIndex = 1; }
  if (slideIndex < 1) { slideIndex = slides.length; }
  slides[slideIndex - 1].style.display = "block";
  updateDots();
}

function goToSlide(n) {
  const slides = document.getElementsByClassName("slides");
  if (slides.length === 0) { return; }
  slides[slideIndex - 1].style.display = "none";
  slideIndex = n;
  slides[slideIndex - 1].style.display = "block";
  updateDots();
}

initSlideshow();

// Keyboard arrow nav for slideshow
document.addEventListener('keydown', e => {
  if (!document.querySelector('.slideshow-container')) return;
  if (e.key === 'ArrowLeft') changeSlide(-1);
  if (e.key === 'ArrowRight') changeSlide(1);
});

// ── Scroll reveal ──
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('main h2, main h3, .card, .slideshow-container, .background-content, .service-content, .interests-content').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

initScrollReveal();

// ── Empty state ──
function renderEmptyState(grid, i18nKey) {
  const empty = document.createElement('p');
  empty.className = 'empty-state';
  empty.dataset.i18n = i18nKey;
  const lang = localStorage.getItem('lang') || 'en';
  empty.innerHTML = (typeof i18n !== 'undefined' && i18n[lang] && i18n[lang][i18nKey]) || i18nKey;
  grid.appendChild(empty);
}

// ── Generic card filter ──
function filterCards(tag, filterBar, gridSelector) {
  filterBar.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent === (tag === 'all' ? 'All' : tag));
  });
  document.querySelectorAll(`${gridSelector} .card`).forEach(card => {
    const match = tag === 'all' || card.dataset.tags.split(',').includes(tag);
    card.style.display = match ? '' : 'none';
  });
}

function buildFilterBar(tags, grid, gridSelector) {
  if (tags.length === 0) return;
  const filterBar = document.createElement('div');
  filterBar.className = 'filter-bar';

  const allBtn = document.createElement('button');
  allBtn.className = 'filter-btn active';
  allBtn.textContent = 'All';
  allBtn.onclick = () => filterCards('all', filterBar, gridSelector);
  filterBar.appendChild(allBtn);

  tags.forEach(tag => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.textContent = tag;
    btn.onclick = () => filterCards(tag, filterBar, gridSelector);
    filterBar.appendChild(btn);
  });

  grid.before(filterBar);
}

// ── Recipe cards ──
function renderRecipes() {
  const grid = document.getElementById('recipe-grid');
  if (!grid || typeof recipes === 'undefined') return;

  if (recipes.length === 0) {
    renderEmptyState(grid, 'recipes-empty');
    return;
  }

  const allTags = [...new Set(recipes.flatMap(r => r.tags || []))];
  buildFilterBar(allTags, grid, '#recipe-grid');

  recipes.forEach(recipe => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.tags = (recipe.tags || []).join(',');

    const timeHTML = (recipe.prepTime || recipe.cookTime) ? `
      <div class="card-times">
        ${recipe.prepTime ? `<span>Prep: ${recipe.prepTime}</span>` : ''}
        ${recipe.cookTime ? `<span>Cook: ${recipe.cookTime}</span>` : ''}
      </div>` : '';

    const ingredientsHTML = recipe.ingredients && recipe.ingredients.length ? `
      <ul class="card-ingredients">
        ${recipe.ingredients.map(i => `<li>${i}</li>`).join('')}
      </ul>` : '';

    const tagsHTML = recipe.tags && recipe.tags.length ? `
      <div class="card-tags">
        ${recipe.tags.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>` : '';

    const sourcesHTML = recipe.sources && recipe.sources.length ? `
      <div class="card-sources">
        ${recipe.sources.map(s => `<a href="${s.url}" target="_blank" rel="noreferrer" class="card-link">Based on ${s.label}</a>`).join('')}
      </div>` : '';

    card.innerHTML = `
      ${recipe.image ? `<img src="${recipe.image}" alt="${recipe.name}">` : ''}
      <div class="card-body">
        <h3>${recipe.name}</h3>
        ${timeHTML}
        <p>${recipe.description}</p>
        ${ingredientsHTML}
        ${tagsHTML}
        ${sourcesHTML}
      </div>
    `;
    grid.appendChild(card);
  });
}

// ── Project cards ──
function renderProjects() {
  const grid = document.getElementById('project-grid');
  if (!grid || typeof projects === 'undefined') return;

  if (projects.length === 0) {
    renderEmptyState(grid, 'projects-empty');
    return;
  }

  const allTags = [...new Set(projects.flatMap(p => p.tags || []))];
  buildFilterBar(allTags, grid, '#project-grid');

  projects.forEach(project => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.tags = (project.tags || []).join(',');

    const techHTML = project.tech && project.tech.length ? `
      <div class="card-tags">
        ${project.tech.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>` : '';

    const githubHTML = project.github ? `
      <div class="card-sources">
        <a href="${project.github}" target="_blank" rel="noreferrer" class="card-link">View on GitHub</a>
      </div>` : '';

    card.innerHTML = `
      ${project.image ? `<img src="${project.image}" alt="${project.name}">` : ''}
      <div class="card-body">
        <h3>${project.name}</h3>
        <p>${project.description}</p>
        ${techHTML}
        ${githubHTML}
      </div>
    `;
    grid.appendChild(card);
  });
}

// ── Blog post cards ──
function renderPosts() {
  const grid = document.getElementById('blog-grid');
  if (!grid || typeof posts === 'undefined') return;

  if (posts.length === 0) {
    renderEmptyState(grid, 'posts-empty');
    return;
  }

  const allTags = [...new Set(posts.flatMap(p => p.tags || []))];
  buildFilterBar(allTags, grid, '#blog-grid');

  posts.forEach(post => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.tags = (post.tags || []).join(',');

    const tagsHTML = post.tags && post.tags.length ? `
      <div class="card-tags">
        ${post.tags.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>` : '';

    card.innerHTML = `
      <div class="card-body">
        <p class="post-date">${post.date}</p>
        <h3>${post.title}</h3>
        <p>${post.summary}</p>
        ${tagsHTML}
        ${post.link ? `<div class="card-sources"><a href="${post.link}" class="card-link">Read More →</a></div>` : ''}
      </div>
    `;
    grid.appendChild(card);
  });
}

renderRecipes();
renderProjects();
renderPosts();

// ── Contact form ──
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx0X6Li4_9xY1gkzYkSSQMRcPklusdH1ZgtFBzUjGzsJpnSxmZ6aQMxls_3MoXtbQ65Vw/exec';
const form = document.querySelector('#contact-form');

if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const msg = document.getElementById('form-message');
    const lang = localStorage.getItem('lang') || 'en';
    const strings = (typeof i18n !== 'undefined' && i18n[lang]) || {};
    btn.textContent = strings['form-sending'] || 'Sending...';
    btn.disabled = true;
    if (msg) { msg.textContent = ''; msg.className = ''; }

    const data = {
      name: form.name.value,
      email: form.email.value,
      subject: form.subject.value,
      message: form.message.value
    };
    fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(data),
      mode: 'no-cors'
    })
      .then(() => {
        if (msg) { msg.textContent = strings['form-success'] || 'Message sent!'; msg.className = 'success'; }
        form.reset();
        btn.textContent = strings['form-submit'] || 'Send';
        btn.disabled = false;
      })
      .catch(() => {
        if (msg) { msg.textContent = strings['form-error'] || 'Something went wrong. Please try again.'; msg.className = 'error'; }
        btn.textContent = strings['form-submit'] || 'Send';
        btn.disabled = false;
      });
  });
}
