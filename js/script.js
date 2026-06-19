console.log("JavaScript is successfully connected!");

// ── Active nav link ──
document.querySelectorAll('.page-link').forEach(link => {
  if (link.href === window.location.href) {
    link.classList.add('active');
  }
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

// ── Recipe cards ──
function renderRecipes() {
  const grid = document.getElementById('recipe-grid');
  if (!grid) return;

  const allTags = [...new Set(recipes.flatMap(r => r.tags || []))];
  if (allTags.length > 0) {
    const filterBar = document.createElement('div');
    filterBar.className = 'filter-bar';

    const allBtn = document.createElement('button');
    allBtn.className = 'filter-btn active';
    allBtn.textContent = 'All';
    allBtn.onclick = () => filterRecipes('all', filterBar);
    filterBar.appendChild(allBtn);

    allTags.forEach(tag => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn';
      btn.textContent = tag;
      btn.onclick = () => filterRecipes(tag, filterBar);
      filterBar.appendChild(btn);
    });

    grid.before(filterBar);
  }

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

function filterRecipes(tag, filterBar) {
  filterBar.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent === (tag === 'all' ? 'All' : tag));
  });
  document.querySelectorAll('.card').forEach(card => {
    const match = tag === 'all' || card.dataset.tags.split(',').includes(tag);
    card.style.display = match ? '' : 'none';
  });
}

renderRecipes();

// ── Contact form ──
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx0X6Li4_9xY1gkzYkSSQMRcPklusdH1ZgtFBzUjGzsJpnSxmZ6aQMxls_3MoXtbQ65Vw/exec';
const form = document.querySelector('form');

if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
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
        document.getElementById('form-message').textContent = 'Message sent!';
        form.reset();
      })
      .catch(() => {
        document.getElementById('form-message').textContent = 'Something went wrong. Please try again.';
      });
  });
}
