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
  
  const BASE_PATH = (location.hostname === 'localhost' ||
    location.hostname === '127.0.0.1')
? '/'
: '/portfolio/';

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
