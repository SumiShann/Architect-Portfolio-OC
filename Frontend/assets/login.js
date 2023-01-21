let buttonLogIn = document.querySelector('#login input[type="submit"]');
let email = document.getElementById('email');
let password = document.getElementById('password');
let error = document.getElementById('error');
let userData;
let token;

async function getUserData(){
    let user = {
        email: "sophie.bluel@test.tld",
        password: "S0phie"
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
        if (res.ok){
            userData = await res.json();
            token = userData["token"];
            console.log(token);
            localStorage.setItem('token', token);
        }
    } catch (err){
        console.log(err);
    }
}

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

buttonLogIn.addEventListener('click', function(e){
    e.preventDefault();
    if (email.value === 'sophie.bluel@test.tld' && password.value === 'S0phie'){
        getUserData();
        error.textContent = "";
        loggingIn();
    } else {
        error.textContent = "Identifiants invalides";
    }
})
