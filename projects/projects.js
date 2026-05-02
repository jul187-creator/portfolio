import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
import { fetchJSON, renderProjects } from '../global.js';

const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');

let selectedYear = null;
let query = '';

renderProjects(projects, projectsContainer, 'h2');
renderPieChart(projects);

const title = document.querySelector('.projects-title');

if (title) {
    title.textContent = `${projects.length} Projects`;
}


function getFilteredProjects() {
    return projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        let matchesSearch = values.includes(query.toLowerCase());
        let matchesYear = selectedYear === null || project.year === selectedYear;

        return matchesSearch && matchesYear;
    });
}

function renderPieChart(projectsGiven) {
    let svg = d3.select('#projects-pie-plot');
    svg.selectAll('path').remove();

    let legend = d3.select('.legend');
    legend.selectAll('li').remove();

    let rolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year
    );

    let data = rolledData.map(([year, count]) => {
        return {
            value: count,
            label: year
        };
    });

    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    let sliceGenerator = d3.pie().value((d) => d.value);
    let arcData = sliceGenerator(data);
    let arcs = arcData.map((d) => arcGenerator(d));

    let colors = d3.scaleOrdinal(d3.schemeTableau10);

    arcs.forEach((arc, i) => {
        svg
            .append('path')
            .attr('d', arc)
            .attr('fill', colors(i))
            .attr('class', selectedYear === data[i].label ? 'selected' : '')
            .on('click', () => {
                selectedYear = selectedYear === data[i].label ? null : data[i].label;

                let filteredProjects = getFilteredProjects();

                projectsContainer.innerHTML = '';
                renderProjects(filteredProjects, projectsContainer, 'h2');

                let searchFilteredProjects = projects.filter((project) => {
                    let values = Object.values(project).join('\n').toLowerCase();
                    return values.includes(query.toLowerCase());
                });

                renderPieChart(searchFilteredProjects);
            });
    });

    data.forEach((d, i) => {
        legend
            .append('li')
            .attr('style', `--color:${colors(i)}`)
            .attr('class', selectedYear === d.label ? 'selected' : '')
            .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
    });
}

let searchInput = document.querySelector('.searchBar');

searchInput.addEventListener('input', (event) => {
    query = event.target.value;

    let filteredProjects = getFilteredProjects();

    projectsContainer.innerHTML = '';
    renderProjects(filteredProjects, projectsContainer, 'h2');

    let searchFilteredProjects = projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query.toLowerCase());
    });
    
    renderPieChart(filteredProjects);
});