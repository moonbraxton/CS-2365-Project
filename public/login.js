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

//Returns true if a valid account login. False if not
async function checkCustomerLogin(email, password){
    /* send a POST call to the server... in server.js the server will parse all valid accounts, compare 
          what was entered to all acounts, and return true or false for this method to return */
    let response = await fetch("/check_account", { 
        method: "POST", //Not writing anything, but has to be POST so an object can be sent
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })

    let json = await response.json(); //wait for the response
    return json; //true or false
}

//Returns true if the email passed is free
async function checkEmailUsed(email){
    /* send a POST call to the server... in server.js the server will parse all valid accounts, compare 
          what was entered to all acounts, and return true or false for this method to return */
    let response = await fetch("/check_email", { 
        method: "POST", //Not writing anything, but has to be POST so an object can be sent
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email
        })
    })

    let json = await response.json(); //wait for the response
    return !json; //true or false
}
//Called when the user submits a login request
loginForm.addEventListener('submit', function(e) {
    //grab the values in the fields
    var email = document.querySelectorAll("form.login .field input")[0].value
    var password = document.querySelectorAll("form.login .field input")[1].value

    console.log("Logging in...",{
        "email" : email,
        "password" : password
    });

    //make sure that the account entered is a valid account
    checkCustomerLogin(email, password).then(validAccount => {
        if(email !== "" && password !== ""){
            if(validAccount !== "invalid"){
                alert("Login Successful. You are a " + validAccount.type + "!") //holds until the user clicks OK
                
                if(validAccount.type === "customer")
                    setTimeout(function(){document.location.href = "/store"},500);
                else if(validAccount.type === "supplier")
                    setTimeout(function(){document.location.href = "/orders"},500);
                else    
                    console.error("No type specified for valid account login");
            }
            else{
                alert("Invalid login. Please try again.")
                }
        }
    })
});

//Send a POST call to the server to create an account. Upon succesful creation, redirect to the store page
async function createAccount(email, password, cardNumber, cardExpiration, cardCVV){
    let response = await fetch("/create_account", { 
        method: "POST", //Not writing anything, but has to be POST so an object can be sent
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "email" : email,
            "password" : password,
            "cardNumber" : cardNumber,
            "cardExpiration" : cardExpiration,
            "cardCVV" : cardCVV,
            "type" : "customer"
        })
    })

    let json = await response.json(); //wait for the response. true or false.

    if(json){
        alert("Signup Successful"); //Holds until the user clicks OK
        console.log("Redirecting...");
        setTimeout(function(){document.location.href = "/store"},500); //Load the store view
    } else {
        alert("Signup Unsuccessful. Please try again!");
    }

    return json;
}

//Called when the user submits a signup request
signupForm.addEventListener('submit', async function(e) {
    var emailFree = true;

    var email = document.querySelectorAll("form.signup .field input")[0].value
    var password = document.querySelectorAll("form.signup .field input")[4].value
    var confirmPassword = document.querySelectorAll("form.signup .field input")[5].value
    var cardNumber = document.querySelectorAll("form.signup .field input")[1].value
    var cardExpiration = document.querySelectorAll("form.signup .field input")[2].value
    var cardCVV = document.querySelectorAll("form.signup .field input")[3].value

    checkEmailUsed(email).then(emailFree => {
        if(!emailFree){ //if the email is currently in use, do not proceed
            alert('This email is currently in use. Please use another!');
        } 
        else if(password !== confirmPassword){ //if the passwords do not match, do not proceed
            alert("Please enter matching passwords")
        } 
        else{ //if all is well, create an account
            
            console.log("Signing up...", {
                "email" : email,
                "password" : password,
                "cardNumber" : cardNumber,
                "cardExpiration" : cardExpiration,
                "cardCVV" : cardCVV
            });
            
            //create the account
            createAccount(email, password, cardNumber, cardExpiration, cardCVV);
        }
    })
});
