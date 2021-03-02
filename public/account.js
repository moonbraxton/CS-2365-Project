//Status' when the application has loaded the webpage
if (document.readyState == 'loading') { //When doc is done loading, call ready()
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

//Called when the doc is fully loaded... Links buttons to actions
function ready() { 
    /*
    .account-email-input,
    .account-password-input,
    .account-card-number-input,
    .account-expiration-date-input,
    .account-card-cvv-input
    */

    if(document.getElementsByClassName("account-email-input")[0].innerText === "")//if there is no customer logged in
        setTimeout(function(){document.location.href = "/"},500);
}

