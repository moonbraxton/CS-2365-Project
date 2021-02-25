const loginText = document.querySelector(".title-text .login") //Grabs the "Login Form" text
const signupText = document.querySelector(".title-text .signup") //Grabs the "Signup Form" text

const loginBtn = document.querySelector("label.login") //Grabs the "Login" button
const signupBtn = document.querySelector("label.signup") //Grabs the "Signup" button
const signupLink = document.querySelector("form .signup-link a") //Grabs the "Signup Now" link

const loginForm = document.querySelector("form.login") //Grabs all of the login form
const signupForm = document.querySelector("form.signup") //Grabs all of the signup form

//Switch to "Signup Form"
signupBtn.onclick = (()=>{ //When the user clicks the "Signup" button in the slider
    loginForm.style.marginLeft = "-50%"
    loginText.style.marginLeft = "-50%"
});

//Switch to "Login Form"
loginBtn.onclick = (()=>{ //When the user clicks the "Login" button in the slider
    loginForm.style.marginLeft = "0%"
    loginText.style.marginLeft = "0%"
});

//Switch to "Signup Form"
signupLink.onclick = (()=>{  //When the user clicks the "Signup now" link in the at the bottom
    signupBtn.click();
    return false;
});

//Called when the user submits a login request
loginForm.addEventListener('submit', function(e) {
    var email = document.querySelectorAll("form.login .field input")[0].value
    var password = document.querySelectorAll("form.login .field input")[1].value

    console.log("Logging in...",{
        "email" : email,
        "password" : password
    });

    //TODO: Parse customer info from file, and only procced if valid login
    if(email !== "" && password !== ""){
        alert("Login Successful") //Holds until the user clicks OK
        setTimeout(function(){document.location.href = "/store"},500);}
        
});
    
//Called when the uder submits a signup request
signupForm.addEventListener('submit', function(e) {
    var alreadyRegistered = false;

    var email = document.querySelectorAll("form.signup .field input")[0].value
    var password = document.querySelectorAll("form.signup .field input")[4].value
    var confirmPassword = document.querySelectorAll("form.signup .field input")[5].value
    var cardNumber = document.querySelectorAll("form.signup .field input")[1].value
    var cardExpiration = document.querySelectorAll("form.signup .field input")[2].value
    var cardCVV = document.querySelectorAll("form.signup .field input")[3].value

    //TODO: Parse customer info from file, and check to see if the user email already exists

    if(password !== confirmPassword){ //If the passwords do not match, do not proceed
        alert("Please enter matching passwords")
    } 
    else if(alreadyRegistered){
        
    } 
    else{
        //TODO: Save new customer information to file
        console.log("Signing up...", {
            "email" : email,
            "password" : password,
            "cardNumber" : cardNumber,
            "cardExpiration" : cardExpiration,
            "cardCVV" : cardCVV
        });


        alert("Signup Successful") //Holds until the user clicks OK
        console.log("Redirecting...")
        setTimeout(function(){document.location.href = "/store"},500) //Load the store view
    }
    
});
