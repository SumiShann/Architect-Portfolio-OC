const portfolio = document.getElementById('portfolio');
const gallery = document.querySelector('.gallery');
let category = new Set();
const categoryFilter = portfolio.insertBefore(document.createElement('div'), gallery);
categoryFilter.classList.add('selector');
const defaultFilter = categoryFilter.appendChild(document.createElement('button'));
defaultFilter.innerText = "Tous";
defaultFilter.classList.add('filter-selected');
let works;
let categories;
const button = document.querySelectorAll("#portfolio .selector");
let filter = document.getElementsByClassName('filter');
let workCategory;

function createWorkElt(element){
    let work = document.createElement("figure");
    let image = document.createElement('img');
    let caption = document.createElement('figcaption');
    gallery.appendChild(work);
    work.appendChild(image);
    work.appendChild(caption);
    caption.innerText = element.title;
    image.setAttribute('crossorigin', "anonymous");
    image.setAttribute('src', element.imageUrl);
}

async function getWork(){
    try{
        const response = await fetch("http://localhost:5678/api/works");
        if (response.ok){
            works = await response.json();
            works.forEach(element => createWorkElt(element));
        }
    } catch (error){
        console.log(error);
    }
}

function Onload(){
    if (defaultFilter.classList.contains('filter-selected')){
        getWork();
    }
}

Onload();

function createCategory(element){
    if (!category.has(element.name)){
        category.add(element.name);
        let filter = document.createElement("button");
        categoryFilter.appendChild(filter);
        filter.innerText = element.name;
        filter.classList.add('filter');
    }
}

async function getCategories(){
   try{
       const response = await fetch("http://localhost:5678/api/categories");
        if (response.ok){
            categories = await response.json();
            categories.forEach(element => createCategory(element)); 
        }
    } catch(e){
        console.log(e);
    }
}

getCategories();

function filterSelected(e){
    if (e.target === defaultFilter && !e.target.classList.contains('filter-selected')){
        defaultFilter.classList.add('filter-selected');
        Array.from(filter).forEach(element => {element.classList.remove('filter-selected')});
    } else if (e.target !== defaultFilter && defaultFilter.classList.contains('filter-selected')){
        defaultFilter.classList.remove('filter-selected');
        e.target.classList.toggle('filter-selected');
    } else {
        e.target.classList.toggle('filter-selected');
    }
}

button.forEach(item => {
    item.addEventListener('click', function(e){
        e.stopPropagation();
        filterSelected(e);
        let results = works.filter(element => element.category.name === e.target.innerText);
        for (const element of results) {
            if (e.target.classList.contains('filter-selected')){
                element.style.display = 'initial';
            } else if (!e.target.classList.contains('filter-selected')){
                element.style.display = 'none';
            }
        }
    })
})