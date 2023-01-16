const portfolio = document.getElementById('portfolio');
const gallery = document.querySelector('.gallery');

let category = new Set();
let works;
let categories;

const categoryFilter = portfolio.insertBefore(document.createElement('div'), gallery);
categoryFilter.classList.add('selector');

const defaultFilter = categoryFilter.appendChild(document.createElement('button'));
defaultFilter.innerText = "Tous";
defaultFilter.classList.add('filter-selected');
const button = document.querySelectorAll("#portfolio .selector");
let filters = document.getElementsByClassName('filter');
let figures = [];

//Fonction pour créer un élément projet
function createWorkElt(element){
    const work = document.createElement("figure");
    let image = document.createElement('img');
    let caption = document.createElement('figcaption');
    gallery.appendChild(work);
    work.appendChild(image);
    work.appendChild(caption);
    caption.innerText = element.title;
    image.setAttribute('crossorigin', "anonymous");
    image.setAttribute('src', element.imageUrl);
    work.dataset.category = element.category.name;
}

//Fonction pour récupérer tous les projets de l'API
async function getWork(){
    try{
        const response = await fetch("http://localhost:5678/api/works");
        if (response.ok){
            works = await response.json();
            works.forEach(element => createWorkElt(element));
            figures = document.querySelectorAll('#portfolio figure');
        }
    } catch (error){
        console.log(error);
    }
}

//Variable pour stocker le token d'authentification
let token;

//Fonction pour créer outil d'édition si admin est connectée
function editionMode(){
    document.querySelector('a').innerText = "logout";
    const div = document.body.insertBefore(document.createElement('div'), document.querySelector('header'));
    div.setAttribute('id', 'edition');
    const p = div.appendChild(document.createElement('p'));
    p.innerText = "Mode édition";
    const button = div.appendChild(document.createElement('button'));
    button.classList.add('publish');
    button.innerText = "publier les changements";
}

//Fonction pour authentifier l'utilisateur/rice en tant qu'admin de la page
function checkAuth(){
    token = localStorage.getItem('token');
    console.log(token);
    if (token != null){
        editionMode();
    }
}

//Fonction pour déclencher l'authentification et la récupération de projets au chargement de la page
function Onload(){
    checkAuth();
    getWork();
}

Onload();

//Fonction pour ajouter les catégories au Set et créer des filtres pour chacune.
function createCategory(element){
    if (!category.has(element)){
        category.add(element);
        let newFilter = document.createElement("button");
        categoryFilter.appendChild(newFilter);
        newFilter.innerText = element.name;
        newFilter.classList.add('filter');
    }
}

//Fonction pour récupérer les catégories de l'API
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

//Fonction pour montrer tous les projets quand le filtre "Tous" est activé
function showAll(){
    defaultFilter.classList.add('filter-selected');
    [...figures].forEach(element => {element.style.display = 'initial'});
}

//Fonction pour changer le style des filtres et montrer les projets correspondants selon le filtre activé
function filterSelected(e){
    if (e.target === defaultFilter && !e.target.classList.contains('filter-selected')){
        Array.from(filters).forEach(element => {element.classList.remove('filter-selected')});
        showAll();
    } else if (e.target !== defaultFilter && defaultFilter.classList.contains('filter-selected')){
        defaultFilter.classList.remove('filter-selected');
        e.target.classList.toggle('filter-selected');
        [...figures].forEach(element => {element.style.display = 'none'});
        [...figures].forEach(element => {
            if (e.target.classList.contains('filter-selected') && element.dataset.category === e.target.innerText){
                element.style.display = 'initial';
            }
        })
    } else {
        e.target.classList.toggle('filter-selected');
        [...figures].forEach(element => {
            if (e.target.classList.contains('filter-selected') && element.dataset.category === e.target.innerText){
                element.style.display = 'initial';
            } else if (!e.target.classList.contains('filter-selected') && element.dataset.category === e.target.innerText){
                element.style.display = 'none';
            }
        })
    }
}

//EventListener pour écouter le clic de la souris sur les filtres
button.forEach(item => {
    item.addEventListener('click', function(e){
        e.stopPropagation();
        console.log(e.target);
        filterSelected(e);
        if ([...button].forEach(element => {!element.classList.contains('filter-selected')})){//Si aucun filtre est actif, rendre "Tous" actif (ne marche pas)
            showAll();
        }
    })
})