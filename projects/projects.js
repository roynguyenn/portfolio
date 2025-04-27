// projects.js
import { fetchJSON, renderProjects } from '../global.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 projects.js running');

  // 1) Load your projects data
  const projects = await fetchJSON('lib/projects.json');
  console.log('📦 fetched projects:', projects);

  // 2) Update the heading count
  const titleEl = document.querySelector('.projects-title');
  if (titleEl) {
    titleEl.textContent = `Projects (${projects.length})`;
    console.log('✏️ updated title:', titleEl.textContent);
  } else {
    console.error('❌ .projects-title not found');
  }

  // 3) Render them with <h4> (or whatever you like)
  const container = document.querySelector('.projects');
  renderProjects(projects, container, 'h2');
  console.log('✅ renderProjects done');
});
