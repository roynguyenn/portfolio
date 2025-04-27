console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// ——— Step 3: Build the NAV entirely in JS ———
const pages = [
    { url: 'index.html',           title: 'Home'     },
    { url: 'projects/index.html',  title: 'Projects' },
    { url: 'contact/index.html',   title: 'Contact'  },
    { url: 'resume/index.html',    title: 'Resume'   },
    { url: 'https://github.com/roynguyenn', title: 'My GitHub' },
  ];
  
  const isLocal = ['localhost','127.0.0.1']
  .includes(location.hostname);

// Split off the first path segment as the repo name when not local
const segments = location.pathname.split('/').filter(Boolean);
// e.g. "/portfolio/index.html" → ["portfolio","index.html"]
const repoName = isLocal ? '' : segments[0] || '';

// Build BASE_PATH accordingly
const BASE_PATH = isLocal
  ? '/'
  : `/${repoName}/`;

const nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
  let href = p.url.startsWith('http')
    ? p.url
    : BASE_PATH + p.url;

  const a = document.createElement('a');
  a.href = href;
  a.textContent = p.title;

  // highlight current page
  const currentPath = location.pathname === '/'
    ? '/index.html'
    : location.pathname;

  if (a.host === location.host && a.pathname === currentPath) {
    a.classList.add('current');
  }

  // open externals in new tab
  if (a.host !== location.host) {
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  }

  nav.append(a);
}

// ——— Step 4.2: Inject the theme dropdown ———
document.body.insertAdjacentHTML(
  'afterbegin',
  `
    <label class="color-scheme">
      Theme:
      <select>
        <option value="light dark">Automatic</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
  `
);

// ——— Steps 4.4 & 4.5: Wire up the <select> with persistence ———
const select = document.querySelector('.color-scheme select');

// load saved preference (if any)
const savedScheme = localStorage.getItem('colorScheme');
if (savedScheme) {
  document.documentElement.style.setProperty('color-scheme', savedScheme);
  select.value = savedScheme;
}

select.addEventListener('input', (e) => {
  const scheme = e.target.value;
  document.documentElement.style.setProperty('color-scheme', scheme);
  // ← don’t forget this line to persist the choice!
  localStorage.setItem('colorScheme', scheme);
  console.log('color scheme changed to', scheme);
});

// Step 5: Better contact form
const form = document.querySelector('form');
form?.addEventListener('submit', event => {
  event.preventDefault();

  // Build our mailto: URL
  const data    = new FormData(form);
  const action  = form.action;      // e.g. "mailto:you@example.com"
  const params  = [];

  for (let [name, value] of data) {
    // Skip any empty fields (optional)
    if (!value) continue;
    // name and value both encoded
    params.push(
      encodeURIComponent(name) +
      '=' +
      encodeURIComponent(value)
    );
  }

  const mailtoURL = action + '?' + params.join('&');

  // Go there!
  location.href = mailtoURL;
});

export async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    console.log('🛰️ [fetchJSON] response object:', response);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return [];
  }
}


export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  containerElement.innerHTML = '';
  projects.forEach(({ title, image, description }) => {
    const article = document.createElement('article');
    article.innerHTML = `
      <${headingLevel}>${title}</${headingLevel}>
      <img src="${image}" alt="${title}" />
      <p>${description}</p>
    `;
    containerElement.appendChild(article);
  });
}

export async function fetchGitHubData(username) {
  // return statement here
  return fetchJSON(`https://api.github.com/users/${username}`);
}

