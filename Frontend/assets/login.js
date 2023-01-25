const buttonLogIn = document.querySelector('#login input[type="submit"]');
const email = document.getElementById('email');
const password = document.getElementById('password');
const error = document.getElementById('error');
let userData;
let token;

//Fonction pour envoyer les identifiants à l'API et recevoir le token en retour
async function getUserData(){
    let user = {
        email: "" + email.value,
        password: "" + password.value
    };
    try{
        const res = await fetch('http://localhost:5678/api/users/login', {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        if (res.status === 401){
            error.textContent = "Identifiants invalides";
        } else if (res.ok){
            error.textContent = "";
            userData = await res.json();
            token = userData["token"];
            console.log(token);
            localStorage.setItem('token', token);
            loggingIn();
        }
    } catch (err){
        console.log(err);
    }
}

//Fonction pour redririger l'admin sur la page d'accueil
async function loggingIn(){
    try{
        await getUserData();
        if (token != null){
            window.location.href = "./index.html";
        }
    } catch (err){
        console.log(err);
        error.textContent = "Une erreur est survenue";
    }
}

//Event Listener sur le bouton d'envoi du formulaire
buttonLogIn.addEventListener('click', function(e){
    e.preventDefault();
    getUserData();
});