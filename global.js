console.log("IT'S ALIVE!");

function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}

let pages = [
    { url: "", title: "Home" },
    { url: "projects/", title: "Projects" },
    { url: "resume/", title: "CV" },
    { url: "contact/", title: "Contact" },
    { url: "https://github.com/jul187-creator/portfolio", title: "GitHub" }
];

const BASE_PATH =
    location.hostname === "localhost" || location.hostname === "127.0.0.1"
        ? "/"
        : "/portfolio/";

let nav = document.createElement("nav");
document.body.prepend(nav);

for (let p of pages) {
    let url = p.url;
    let title = p.title;

    if (!url.startsWith("http")) {
        url = BASE_PATH + url;
    }

    let a = document.createElement("a");
    a.href = url;
    a.textContent = title;

    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add("current");
    }

    if (a.host !== location.host) {
        a.target = "_blank";
    }

    nav.append(a);
}

document.body.insertAdjacentHTML(
    "afterbegin",
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

let select = document.querySelector(".color-scheme select");

select.addEventListener("input", function (event) {
    let colorScheme = event.target.value;
    document.documentElement.style.setProperty("color-scheme", colorScheme);
    localStorage.colorScheme = colorScheme;
});

if ("colorScheme" in localStorage) {
    document.documentElement.style.setProperty("color-scheme", localStorage.colorScheme);
    select.value = localStorage.colorScheme;
}

let form = document.querySelector("form");

form?.addEventListener("submit", function (event) {
    event.preventDefault();

    let data = new FormData(form);
    let url = form.action + "?";
    let params = [];

    for (let [name, value] of data) {
        params.push(`${name}=${encodeURIComponent(value)}`);
    }

    url += params.join("&");
    location.href = url;
});

export async function fetchJSON(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    }   catch (error) {
        console.error('Error fetching or parsing JSON data:', error);
    }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
    if (!containerElement) {
        return;
    }

    containerElement.innerHTML = '';

    for (let project of projects) {
        const article = document.createElement('article');

        article.innerHTML = `
            <${headingLevel}>${project.title}</${headingLevel}>
            <img src="${project.image}" alt="${project.title}">
            <p>${project.description}</p>
    `;

        containerElement.appendChild(article);
    }
}