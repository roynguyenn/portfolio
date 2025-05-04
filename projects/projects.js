// projects.js
import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
let projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');
let selectedYear = null;     // null = no wedge selected

const titleEl = document.querySelector('.projects-title');
if (titleEl) titleEl.textContent = `Projects (${projects.length})`;
let filteredProjects = projects;
let currentArcs     = [];  

let rolledData = d3.rollups(
  projects,
  (v) => v.length,
  (d) => d.year,
);

let data = rolledData.map(([year, count]) => {
  return { value: count, label: year };
});

let colors = d3.scaleOrdinal(d3.schemeTableau10);

// 1) generate the arc data objects
const sliceGenerator = d3.pie().value(d => d.value);
const arcs = sliceGenerator(data);   // [{startAngle, endAngle, data, …}, …]

// 2) draw them in one data-join
const svg = d3.select('#projects-pie-plot');  // be explicit about your SVG
const arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let pieData = [];        // global


let legend = d3.select('.legend');
data.forEach((d, idx) => {
  legend
    .append('li')
    .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
    .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
});


// assume these live at the top of your module, so they’re reused:


function renderPieChart(projectsGiven) {
  
  /* 1️⃣  aggregate → counts per year */
  const rolled = d3.rollups(
    projectsGiven,
    v => v.length,     // count projects
    d => d.year        // group key
  );

  /* 2️⃣  map to {label,value} for d3.pie() */
  pieData = d3.rollups(projectsGiven, v=>v.length, d=>d.year)
  .map(([y,c]) => ({label:y, value:c}));

  /* 3️⃣  clear previous wedges & legend rows */
  svg.selectAll('path').remove();
  legend.selectAll('li').remove();

  /* 4️⃣  build arcs */
  currentArcs   = d3.pie().value(d => d.value).sort(null)(pieData);
  const arcGen = d3.arc().innerRadius(0).outerRadius(50);

  
  /* 5️⃣  draw wedges + click handler */
  svg.selectAll('path')
   .data(currentArcs)
   .enter().append('path')
     .attr('d', arcGen)
     .attr('fill', (_, i) => colors(i))
     .style('cursor', 'pointer')
     .on('click', (_, arc) => {          // arc is the datum itself
       /* 1️⃣  toggle by YEAR, not by index */
       const yr = arc.data.label;
       selectedYear = (selectedYear === yr) ? null : yr;
      
       /* 2️⃣  highlight */
       svg.selectAll('path')
          .classed('selected', d => d.data.label === selectedYear);
       legend.selectAll('li')
          .classed('selected', d => d.label     === selectedYear);

       /* 3️⃣  filter projects list */
       const subset = projects.filter(p =>
         (selectedYear === null || String(p.year) === String(selectedYear))
         && Object.values(p).join(' ').toLowerCase().includes(query)
       );
       renderProjects(subset, projectsContainer, 'h2');
     });


  /* 6️⃣  draw legend rows */
  legend.selectAll('li')
        .data(pieData)
        .enter()
        .append('li')
          .style('--color', (_, i) => colors(i))
          .html(d =>
            `<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
          .on('click', (_, i) => {
            /* let legend clicks do the same toggle */
            selectedIndex = (selectedIndex === i) ? -1 : i;

            svg.selectAll('path')
               .attr('class', (_, idx) =>
                 idx === selectedIndex ? 'selected' : null);

            legend.selectAll('li')
               .attr('class', (_, idx) =>
                 idx === selectedIndex ? 'selected' : null);
          });
}

renderProjects(projects, projectsContainer, 'h2');
renderPieChart(projects);





let query = '';
let searchInput = document.querySelector('.searchBar');

searchInput.addEventListener('input', (event) => {
  // update query value
  let projectsContainer = document.querySelector('.projects');
  query = event.target.value;
  // filter projects
  filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });
  // render filtered projects

  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);

});


// Declare the selectedIndex at the top of your pie chart creation function
let selectedIndex = -1;

/* -----------------------------------------------------------
   draw wedges + attach click handler
----------------------------------------------------------- */
svg.selectAll('path').remove();                // clear previous wedges

// Store the arcs data and make sure we use the correct variable name
// (Make sure 'arcs' is correctly defined earlier in your code)
currentArcs.forEach((arc, i) => {
  svg.append('path')
     .attr('d', arcGenerator(arc))             // arcGen is your d3.arc()
     .attr('fill', colors(i))
     .on('click', () => {       
      
       /* toggle — deselect if clicking the same slice */
       selectedIndex = (selectedIndex === i) ? -1 : i;
       console.log('selectedindex:', selectedIndex);

       if (selectedIndex === -1) {
        /* nothing selected → show everything */
        renderProjects(projects, projectsContainer, 'h2');
      } else {
        
        /* 1️⃣  year on the selected wedge
               (pieData is the array you passed to d3.pie()) */
        const year = pieData[selectedIndex].label;    
        const filtered = filteredProjects.filter(
          p => String(p.year) === String(year)          // coerce to avoid 2024 vs "2024"
        );
      
        /* 3️⃣  re‑render the card list                     */
        renderProjects(filtered, projectsContainer, 'h2');
      }
       /* highlight the right slice */
       svg.selectAll('path')
        .attr('class', (_, idx) => (
        idx === selectedIndex ? 'selected' : null   // ← highlight just this wedge
        ));


       /* highlight the matching legend <li> */
       legend.selectAll('li')
             .classed('selected', (_, idx) => idx === selectedIndex);
     });
});

/* -------- draw / redraw legend  -------- */

// Use the same data that was used to create the arcs
// Instead of pieData, use arcs and access the data property if needed
legend
  .selectAll('li')
  .attr('class', (_, idx) => (
    idx === selectedIndex ? 'selected' : null   // highlight this legend row
  ));




console.log('piedata :', pieData);

  