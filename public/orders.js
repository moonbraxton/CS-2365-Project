//Status' when the application has loaded the webpage
if (document.readyState == 'loading') { //When doc is done loading, call ready()
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

//Called when the doc is fully loaded... Links buttons to actions
function ready() { 
    var moveOrderToReadyButtons = document.getElementsByClassName('supplier-ready-order-button')
    for (var i = 0; i < moveOrderToReadyButtons.length; i++) { //Link buttons that remove items from cart to actions
        var button = moveOrderToReadyButtons[i]
        button.addEventListener('click', moveOrderToReady)
    }

    var moveOrderToShipButtons = document.getElementsByClassName('supplier-ship-order-button')
    for (var i = 0; i < moveOrderToShipButtons.length; i++) { //Link buttons that remove items from cart to actions
        var button = moveOrderToShipButtons[i]
        button.addEventListener('click', moveOrderToShip)
    }

}

function moveOrderToReady(event){
    var buttonClicked = event.target

    //Grabs to 'Ordered' status for the order
    buttonClicked.parentElement.parentElement.getElementsByClassName('order-status-value')[0].innerText = "Ready";

    //TODO: Send POST to server to notify to move order to READY. Update order status AND move amount purchased from 'Available' to 'Reserved'
}


function moveOrderToShip(event){
    var buttonClicked = event.target

    //Grabs to 'Ordered' status for the order
    buttonClicked.parentElement.parentElement.getElementsByClassName('order-status-value')[0].innerText = "Shipped";

    //TODO: Send POST to server to notify to move order to SHIPPED. Update order status AND move amount purchased from 'Reserved' to 'Shipped' (delete)
}

