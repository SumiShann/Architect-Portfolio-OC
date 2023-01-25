const portfolio = document.getElementById('portfolio');
const gallery = document.querySelector('.gallery');

let work;
let image;
let caption;
let works;
let figures = [];
const categorySet = new Set();
let categories;

const selector = portfolio.insertBefore(document.createElement('div'), gallery);
selector.classList.add('selector');

const defaultFilter = selector.appendChild(document.createElement('button'));
defaultFilter.innerText = "Tous";
defaultFilter.classList.add('filter-selected');
const buttons = document.querySelectorAll("#portfolio .selector");
const filters = document.getElementsByClassName('filter');

//Variable pour stocker le code HTML nécessaire pour créer un lien "modifier" menant à une modale
const modify = '<a class="js-modal modify"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M373.1 24.97C401.2-3.147 446.8-3.147 474.9 24.97L487 37.09C515.1 65.21 515.1 110.8 487 138.9L289.8 336.2C281.1 344.8 270.4 351.1 258.6 354.5L158.6 383.1C150.2 385.5 141.2 383.1 135 376.1C128.9 370.8 126.5 361.8 128.9 353.4L157.5 253.4C160.9 241.6 167.2 230.9 175.8 222.2L373.1 24.97zM440.1 58.91C431.6 49.54 416.4 49.54 407 58.91L377.9 88L424 134.1L453.1 104.1C462.5 95.6 462.5 80.4 453.1 71.03L440.1 58.91zM203.7 266.6L186.9 325.1L245.4 308.3C249.4 307.2 252.9 305.1 255.8 302.2L390.1 168L344 121.9L209.8 256.2C206.9 259.1 204.8 262.6 203.7 266.6zM200 64C213.3 64 224 74.75 224 88C224 101.3 213.3 112 200 112H88C65.91 112 48 129.9 48 152V424C48 446.1 65.91 464 88 464H360C382.1 464 400 446.1 400 424V312C400 298.7 410.7 288 424 288C437.3 288 448 298.7 448 312V424C448 472.6 408.6 512 360 512H88C39.4 512 0 472.6 0 424V152C0 103.4 39.4 64 88 64H200z" fill="black"/></svg> modifier</a>';

//Variable pour le svg poubelle
const trash ='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" fill="white"/></svg>';

//Variable pour le svg flèche de retour
const arrowLeft = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M109.3 288L480 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-370.7 0 73.4-73.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-128 128c-12.5 12.5-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288z" fill="black"/></svg>';

let modalWrap;
let modal;
let modal2;
let closeButton;

//Variables des liens ouvrant d'autres modales dans modalGallery
let addPhoto;
let deleteGallery;

//Variables des éléments dans deleteModal
let deleteButton;
let workID;

//Variables des éléments dans addModal
let returnArrow;
let addForm;
let projPrev;
let inputPhoto;
let inputTitle;
let selectCategory;
let invalidMessage;
let validate;

//Variable pour stocker le token d'authentification
let token;

//Fonction pour authentifier l'utilisateur/rice en tant qu'admin de la page
function checkAuth(){
    token = localStorage.getItem('token');
    console.log(token);
}

//Fonction pour créer les éléments figures qui contiennent les projets
function createFigure(){
    work = document.createElement("figure");
    image = document.createElement('img');
    caption = document.createElement('figcaption');
    work.appendChild(image);
    work.appendChild(caption);
    image.setAttribute('crossorigin', "anonymous");
}

//Fonction pour créer un élément projet dans la galerie
function createWorkElt(element){
    createFigure();
    gallery.appendChild(work);
    caption.innerText = element.title;
    work.dataset.category = element.category.id;
    work.dataset.id = element.id;
    image.setAttribute('src', element.imageUrl);
}

//Fonction pour créer les photos apparaissant dans la modale d'édition de la galerie
function createModalPhoto(element){
    createFigure();
    document.querySelector('#portfolio .modal-wrapper #edit-gallery').appendChild(work);
    caption.innerText = 'éditer';
    work.dataset.id = element.id;
    image.setAttribute('src', element.imageUrl);
    let a = document.createElement('a');
    work.appendChild(a);
    a.innerHTML = trash;
    a.setAttribute('href', '#modal-delete');
    a.classList.add('js-modal2', 'trashcan');
    a.dataset.id = work.dataset.id;
}

//Fonction pour récupérer tous les projets de l'API
async function getWork(){
    try{
        const response = await fetch("http://localhost:5678/api/works");
        if (response.ok){
            works = await response.json();
            works.forEach(element => createWorkElt(element));
            figures = document.querySelectorAll('#portfolio figure');
            if (token != null){
                works.forEach(element => createModalPhoto(element));
            }
        }
    } catch (error){
        console.log(error);
    }
}

//Fonction pour mettre tous les attributs/classes nécessaires à une modale
function modalAttributes(modalName){
    modalName.classList.add('modal');
    modalName.setAttribute('aria-hidden', 'true');
    modalName.setAttribute('role', 'dialog');
    modalName.style.display = 'none';
}

//Fonction pour créer les éléments communs et ajouter toutes les classes d'un modal-wrapper
function createModalWrapper(modalName){
    modalWrap = modalName.appendChild(document.createElement('div'));
    modalWrap.classList.add('modal-wrapper');
    modalWrap.classList.add('stop-prop');
    closeButton = modalWrap.appendChild(document.createElement('button'));
    modalWrap.appendChild(document.createElement('section'));
    closeButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z" fill="black"/></svg>';
    closeButton.classList.add('js-modal-close');
}

//Fonction pour créer une modale demandant confirmation pour la suppression d'un projet de la galerie
function createDeleteModal(){
    let modalDelete = document.querySelector('#portfolio #modal-gallery section').appendChild(document.createElement('aside'));
    modalDelete.setAttribute('id', 'modal-delete');
    modalAttributes(modalDelete);
    createModalWrapper(modalDelete);
    const p = document.querySelector('#modal-delete section').appendChild(document.createElement('p'));
    p.innerHTML = "Êtes-vous sûre de vouloir supprimer ce projet de votre galerie ? Cette action ne sera pas réversible.";
    deleteButton = document.querySelector('#modal-delete section').appendChild(document.createElement('button'));
    deleteButton.setAttribute('id', 'button-delete');
    deleteButton.innerText = "Je suis sûre";
}

//Fonction pour supprimer un projet de la galerie en faisant appel à l'API
async function deleteWork(e){
    try{
        const res = await fetch('http://localhost:5678/api/works/' + workID, {
            method: "delete",
            headers: {
                'Accept': '*/*',
                'Authorization': 'Bearer ' + token
            },
        })
        if (res.ok){
            console.log(res);
            document.querySelectorAll('figure[data-id="'+ workID +'"]').forEach(element => element.remove());
            closeModal2(e);
        } else if (res.status === 401){
            alert("Votre session a expiré");
        }
    } catch (err){
        console.log(err);
    }
}

//Fonction pour loader preview du projet
const loadPreview = function (e){
    projPrev = document.querySelector('#add-form img');
    if (e.target.files[0].size > 4 * 1048576){
        e.target.setCustomValidity("Le fichier ne doit pas faire plus de 4 mo");
        alert("Le fichier ne doit pas faire plus de 4 mo.");
        return;
    } else {
        projPrev.src = URL.createObjectURL(e.target.files[0]);
        e.target.setCustomValidity("");
    }
}

//Fonction pour désélectionner le fichier de l'image du formulaire d'ajout
function revokePreview(){
    URL.revokeObjectURL(projPrev.src);
    projPrev.removeAttribute('src');
}

//Fonction pour créer des options de catégorie dans le formulaire d'ajout de projet. Se déclenche dans getCategory()
function createOption(element){
    let option = document.createElement('option');
    selectCategory.add(option);
    option.setAttribute('value', element.id);
    option.innerText = element.name;
}

//Fonction pour invalider les titres commençant par un espace
function trimText(){
    if(/^\s/.test(inputTitle.value)){
        inputTitle.value = '';
    } else {
        inputTitle.value.trim();
    }
}

//Fonction pour vérifier la validité des champs du formulaire
function enableSubmit(){
    if (inputPhoto.checkValidity() && inputTitle.checkValidity() && selectCategory.checkValidity()){
        console.log('enabling works');
        validate.removeAttribute('disabled');
        invalidMessage.innerText = "";
    } else {
        console.log('doesnt work');
        if (!validate.hasAttribute('disabled')){
            validate.setAttribute('disabled', 'true');
            invalidMessage.innerText = "Veuillez remplir tous les champs du formulaire";
        }
    }
}

//Fonction pur ajouter dynamiquement le nouveau projet
async function getLastWork(){
    try{
        const response = await fetch("http://localhost:5678/api/works/");
        if (response.ok){
            works = await response.json();
            console.log(works[works.length - 1]);
            createWorkElt(works[works.length - 1]);
            figures = document.querySelectorAll('#portfolio figure');
            createModalPhoto(works[works.length - 1]);
        }
    } catch (error){
        console.log(error);
    }
}

//Fonction pour faire une requête d'ajout de projet dans la galerie
async function sendPostResquest(){
    try {
        const res = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            body: new FormData(addForm)
        });
        if (res.status === 201){
            console.log(res);
            getLastWork();
            alert("Formulaire envoyé");
            closeModal2();
        } else if (res.status === 401){
            alert("Votre session a expiré");
        } else if (res.status === 500){
            alert("Une erreur inattendue est survenue. Veuillez réessayer plus tard.");
        }
    } catch (err){
        console.log(err);
    }
}

//Fonction pour les actions après la soumission du formulaire
const sendAddForm = function(e){
    console.log('sending works');
    e.preventDefault();
    sendPostResquest();
}

//Fonction pour créer une modale pour ajouter un projet
function createAddModal(){
    let addModal = document.querySelector('main').appendChild(document.createElement('aside'));
    addModal.setAttribute('id', 'modal-add');
    modalAttributes(addModal);
    createModalWrapper(addModal);
    let modalAddTop = addModal.querySelector('.modal-wrapper').insertBefore(document.createElement('div'), addModal.querySelector('section'));
    returnArrow = modalAddTop.appendChild(document.createElement('a'));
    modalAddTop.appendChild(closeButton);
    returnArrow.innerHTML = arrowLeft;
    returnArrow.setAttribute('href', '#modal-gallery');
    returnArrow.setAttribute('id', 'return-arrow');
    addModal.querySelector('section').innerHTML = '<h3>Ajout photo</h3><form enctype="multipart/form-data" name="add-form" id="add-form"><div class="container-photo"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M152 120c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48S178.5 120 152 120zM447.1 32h-384C28.65 32-.0091 60.65-.0091 96v320c0 35.35 28.65 64 63.1 64h384c35.35 0 64-28.65 64-64V96C511.1 60.65 483.3 32 447.1 32zM463.1 409.3l-136.8-185.9C323.8 218.8 318.1 216 312 216c-6.113 0-11.82 2.768-15.21 7.379l-106.6 144.1l-37.09-46.1c-3.441-4.279-8.934-6.809-14.77-6.809c-5.842 0-11.33 2.529-14.78 6.809l-75.52 93.81c0-.0293 0 .0293 0 0L47.99 96c0-8.822 7.178-16 16-16h384c8.822 0 16 7.178 16 16V409.3z" fill="#B9C5CC"/></svg><img id="proj-prev"/><input type="file" name="image" id="image" accept=".jpg, .png" required><label for="image">+ Ajouter photo</label><p>jpg, png : 4mo max</p></div><label for="title">Titre</label><input type="text" name="title" id="title" required><label for="category">Catégorie</label><select name="category" id="category" required><option selected></option></select><p class="invalid-message"></p><div class="line-break"></div><input type="submit" value="Valider" id="validate" disabled="true"></form>'
    addForm = document.forms.namedItem('add-form');
    inputPhoto = document.querySelector('#modal-add input[type="file"]');
    inputTitle = document.querySelector('#modal-add input[type="text"]');
    selectCategory = document.querySelector('#modal-add select');
    invalidMessage = document.querySelector('#modal-add .invalid-message');
    validate = document.querySelector('#modal-add input[type="submit"]');
}

//Fonction pour créer le contenu de la modale Galerie Photo
function galleryModalContent(){
    let h3 = document.querySelector('#modal-gallery section').appendChild(document.createElement('h3'));
    h3.innerText = "Galerie photo";
    let div = h3.insertAdjacentElement('afterend', document.createElement('div'));
    div.setAttribute('id', 'edit-gallery');
    let gallerySection = document.querySelector('#portfolio .modal-wrapper section');
    let lineBreak = gallerySection.appendChild(document.createElement('div'));
    lineBreak.classList.add('line-break');
    addPhoto = gallerySection.appendChild(document.createElement('a'));
    deleteGallery = gallerySection.appendChild(document.createElement('p'));
    addPhoto.innerText = "Ajouter une photo";
    deleteGallery.innerText = "Supprimer la galerie";
    addPhoto.classList.add('add-photo', 'js-modal2');
    addPhoto.setAttribute('href', '#modal-add');
    createDeleteModal();
    createAddModal();
}

//Fonction pour créer la modale Galerie Photo et son lien "modifier" au bon endroit
function galleryModal(){
    document.querySelector('#portfolio h2').insertAdjacentHTML('beforeend', modify);
    document.querySelector('#portfolio .js-modal').setAttribute('href', '#modal-gallery');
    let modalGallery = document.createElement('aside');
    modalGallery.setAttribute('id', 'modal-gallery');
    modalAttributes(modalGallery);
    createModalWrapper(modalGallery);
    document.querySelector('#portfolio h2').insertAdjacentElement('afterend', modalGallery);
    galleryModalContent();
}

//Fonction pour stopper la propagation du clic sur le bouton dans la modale
const stopPropagation = function (e){
    e.stopPropagation();
}

//Fonction pour fermer 2ème modale quand on clique dessus ou sur le bouton "croix"
const closeModal2 = function (e){
    if (e) {
        e.stopPropagation();
        e.preventDefault();
    }
    modal2.style.display = 'none';
    modal2.removeAttribute('aria-modal');
    modal2.setAttribute('aria-hidden', 'true');
    modal2.removeEventListener('click', closeModal2);
    modal2.querySelector('.js-modal-close').removeEventListener('click', closeModal2);
    modal2.querySelector('.stop-prop').removeEventListener('click', stopPropagation);
    if (modal2.id === 'modal-delete'){
        deleteButton.removeEventListener('click', deleteWork);
    } else if (modal2.id === 'modal-add'){
        returnArrow.removeEventListener('click', openModal);
        addForm.removeEventListener('input', enableSubmit);
        validate.removeEventListener('submit', sendAddForm);
        inputPhoto.removeEventListener('change', loadPreview);
        inputTitle.removeEventListener('input', trimText);
        revokePreview();
        addForm.reset();
    }
    modal2 = null;
}

//Fonction pour ouvrir 2ème modale (nested modal -> deleteModal, addModal)
const openModal2 = function (e){
    e.stopPropagation();
    e.preventDefault();
    modal2 = document.querySelector(e.target.getAttribute('href'));
    modal2.style.display = null;
    modal2.removeAttribute('aria-hidden');
    modal2.setAttribute('aria-modal', 'true');
    modal2.addEventListener('click', closeModal2);
    modal2.querySelector('.js-modal-close').addEventListener('click', closeModal2);
    modal2.querySelector('.stop-prop').addEventListener('click', stopPropagation);
    if (modal2.id === 'modal-delete'){
        workID = e.target.dataset.id;
        console.log(workID);
        deleteButton.addEventListener('click', deleteWork);
    } else if (modal2.id === 'modal-add'){
        closeModal(e);
        returnArrow.addEventListener('click', openModal);
        inputPhoto.addEventListener('change', loadPreview);
        inputTitle.addEventListener('input', trimText);
        addForm.addEventListener('input', enableSubmit);
        addForm.addEventListener('submit', sendAddForm);
    }
}

//Fonction pour fermer la modale quand on clique dessus ou sur le bouton "croix"
const closeModal = function (e){
    e.stopPropagation();
    e.preventDefault();
    modal.style.display = 'none';
    modal.removeAttribute('aria-modal');
    modal.setAttribute('aria-hidden', 'true');
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
    modal.querySelector('.stop-prop').removeEventListener('click', stopPropagation);
    if (modal.id === 'modal-gallery'){
        modal.querySelectorAll('.js-modal2').forEach(a => {
            a.removeEventListener('click', openModal2);
        })
    }
    modal = null;
}

//Fonction pour ouvrir la modale
const openModal = function (e){
    e.stopPropagation();
    e.preventDefault();
    modal = document.querySelector(e.target.getAttribute('href'));
    modal.style.display = null;
    modal.removeAttribute('aria-hidden');
    modal.setAttribute('aria-modal', 'true');
    modal.addEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.stop-prop').addEventListener('click', stopPropagation);
    if (modal.id === 'modal-gallery'){
        modal.querySelectorAll('.js-modal2').forEach(a => {
            a.addEventListener('click', openModal2);
        })
    }
    if (e.target === returnArrow){
        closeModal2(e);
    }
}

//Fonction pour écouter le clic sur le lien de la modale
function modalEventListener(){
    document.querySelectorAll('.js-modal').forEach(a => {
        a.addEventListener('click', openModal)
    })
}

//Fonction pour écouter la touche "escape" et fermer la modale
window.addEventListener('keydown', function (e){
    if (e.key === 'Escape' || e.key === 'Esc'){
        closeModal(e);
    }
})

//Fonction pour créer barre d'édition
function edition(){
    const div = document.body.insertBefore(document.createElement('div'), document.querySelector('header'));
    div.setAttribute('id', 'edition');
    const toolIcon = div.appendChild(document.createElement('span'));
    toolIcon.outerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M373.1 24.97C401.2-3.147 446.8-3.147 474.9 24.97L487 37.09C515.1 65.21 515.1 110.8 487 138.9L289.8 336.2C281.1 344.8 270.4 351.1 258.6 354.5L158.6 383.1C150.2 385.5 141.2 383.1 135 376.1C128.9 370.8 126.5 361.8 128.9 353.4L157.5 253.4C160.9 241.6 167.2 230.9 175.8 222.2L373.1 24.97zM440.1 58.91C431.6 49.54 416.4 49.54 407 58.91L377.9 88L424 134.1L453.1 104.1C462.5 95.6 462.5 80.4 453.1 71.03L440.1 58.91zM203.7 266.6L186.9 325.1L245.4 308.3C249.4 307.2 252.9 305.1 255.8 302.2L390.1 168L344 121.9L209.8 256.2C206.9 259.1 204.8 262.6 203.7 266.6zM200 64C213.3 64 224 74.75 224 88C224 101.3 213.3 112 200 112H88C65.91 112 48 129.9 48 152V424C48 446.1 65.91 464 88 464H360C382.1 464 400 446.1 400 424V312C400 298.7 410.7 288 424 288C437.3 288 448 298.7 448 312V424C448 472.6 408.6 512 360 512H88C39.4 512 0 472.6 0 424V152C0 103.4 39.4 64 88 64H200z" fill="white"/></svg>';
    const p = div.appendChild(document.createElement('p'));
    p.innerText = "Mode édition";
    const button = div.appendChild(document.createElement('button'));
    button.classList.add('publish');
    button.innerText = "publier les changements";
}

//Fonction pour ajouter les catégories au Set et créer des filtres pour chacune.
function createCategory(element){
    if (!categorySet.has(element)){
        categorySet.add(element);
        let newFilter = document.createElement("button");
        selector.appendChild(newFilter);
        newFilter.dataset.category = element.id;
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
            if (token != null){
            categorySet.forEach(element => createOption(element));
            }
        }
    } catch(e){
        console.log(e);
    }
}

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
            if (e.target.classList.contains('filter-selected') && element.dataset.category === e.target.dataset.category){
                element.style.display = 'initial';
            }
        })
    } else {
        e.target.classList.toggle('filter-selected');
        [...figures].forEach(element => {
            if (e.target.classList.contains('filter-selected') && element.dataset.category === e.target.dataset.category){
                element.style.display = 'initial';
            } else if (!e.target.classList.contains('filter-selected') && element.dataset.category === e.target.dataset.category){
                element.style.display = 'none';
            }
        })
    }
}

function backToDefaultFilter(){
    if (!buttons[0].classList.contains('filter-selected') && !buttons[1].classList.contains('filter-selected') && !buttons[2].classList.contains('filter-selected') && !buttons[3].classList.contains('filter-selected')){
        showAll();
    }
}

//EventListener pour écouter le clic de la souris sur les filtres
buttons.forEach(item => {
    item.addEventListener('click', function(e){
        e.stopPropagation();
        filterSelected(e);
        backToDefaultFilter();
    })
})

//Fonction pour déconnecter l'admin
function logOut(){
    let logout = document.querySelector('a');
    logout.innerText = "logout";
    logout.addEventListener('click', function(e){
        e.preventDefault();
        localStorage.clear();
        window.location.reload();
    })
}

//Fonction pour créer outils d'édition si admin est connectée
function adminMode(){
    logOut();
    edition();
    galleryModal();
    modalEventListener();
}

//Fonction pour déclencher l'authentification et la récupération de projets au chargement de la page
function Onload(){
    checkAuth();
    getWork();
    getCategories();
    if (token != null){
        adminMode();
    }
}

Onload();