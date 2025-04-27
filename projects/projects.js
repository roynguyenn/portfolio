// projects.js
import { fetchJSON, renderProjects } from '../global.js';

document.addEventListener('DOMContentLoaded', async () => {
  // 1) fetch the real JSON
  const projects = await fetchJSON('../lib/projects.json');
  console.log('📦 Projects fetched:', projects.length);

  // 2) update the heading count
  const titleEl = document.querySelector('.projects-title');
  if (titleEl) {
    titleEl.textContent = `Projects (${projects.length})`;
  }

  // 3) render into the container
  const container = document.querySelector('.projects');
  renderProjects(projects, container, 'h2');
});
