//Status' when the application has loaded the webpage
if (document.readyState == 'loading') { //When doc is done loading, call ready()
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

//Called when the doc is fully loaded... Links buttons to actions
function ready() { 
    var moveOrderToOrderButtons = document.getElementsByClassName('supplier-order-order-button')
    for (var i = 0; i < moveOrderToOrderButtons.length; i++) { //Link buttons that remove items from cart to actions
        var button = moveOrderToOrderButtons[i]
        button.addEventListener('click', moveOrderToOrder)
    }

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

async function moveOrderToOrder(event){
    var buttonClicked = event.target;

    let order_id = buttonClicked.parentElement.parentElement.getElementsByClassName("order-id")[0].dataset.orderId;
    let products = [];

    //Grabs to 'Ordered' status for the order
    let oldStatus = buttonClicked.parentElement.parentElement.getElementsByClassName('order-status-value')[0].innerText;
    buttonClicked.parentElement.parentElement.getElementsByClassName('order-status-value')[0].innerText = "Ordered";
    

    for(let row of buttonClicked.parentElement.parentElement.getElementsByClassName("purchased-product")){
        let product_name = row.getElementsByClassName("order-item-title")[0].innerText;
        let quantity = row.getElementsByClassName("order-quantity")[0].innerText;

        let tmp = {}
        tmp["productName"] = product_name;
        tmp["productQuantity"] = quantity;

        products.push(tmp)
    }

    let response = await fetch("/order_order", { 
        method: "POST", //Not writing anything, but has to be POST so an object can be sent
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            order_id : order_id,
            products : products,
            oldOrderStatus: oldStatus
        })
    })

    let json = await response.json(); //wait for the response. true or false.
}

async function moveOrderToReady(event){
    var buttonClicked = event.target;

    let order_id = buttonClicked.parentElement.parentElement.getElementsByClassName("order-id")[0].dataset.orderId;
    let products = [];

    //Grabs to 'Ordered' status for the order
    let oldStatus = buttonClicked.parentElement.parentElement.getElementsByClassName('order-status-value')[0].innerText;
    buttonClicked.parentElement.parentElement.getElementsByClassName('order-status-value')[0].innerText = "Ready";
    
    for(let row of buttonClicked.parentElement.parentElement.getElementsByClassName("purchased-product")){
        let product_name = row.getElementsByClassName("order-item-title")[0].innerText;
        let quantity = row.getElementsByClassName("order-quantity")[0].innerText;

        let tmp = {}
        tmp["productName"] = product_name;
        tmp["productQuantity"] = quantity;

        products.push(tmp)
    }

    let response = await fetch("/ready_order", { 
        method: "POST", //Not writing anything, but has to be POST so an object can be sent
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            order_id : order_id,
            products : products,
            oldOrderStatus: oldStatus
        })
    })

    let json = await response.json(); //wait for the response. true or false.
}


async function moveOrderToShip(event){
    var buttonClicked = event.target;

    let order_id = buttonClicked.parentElement.parentElement.getElementsByClassName("order-id")[0].dataset.orderId;
    let products = [];

    //Grabs to 'Ordered' status for the order
    let oldStatus = buttonClicked.parentElement.parentElement.getElementsByClassName('order-status-value')[0].innerText;
    buttonClicked.parentElement.parentElement.getElementsByClassName('order-status-value')[0].innerText = "Shipped";
    
    for(let row of buttonClicked.parentElement.parentElement.getElementsByClassName("purchased-product")){
        let product_name = row.getElementsByClassName("order-item-title")[0].innerText;
        let quantity = row.getElementsByClassName("order-quantity")[0].innerText;

        let tmp = {}
        tmp["productName"] = product_name;
        tmp["productQuantity"] = quantity;

        products.push(tmp)
    }

    let response = await fetch("/ship_order", { 
        method: "POST", //Not writing anything, but has to be POST so an object can be sent
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            order_id : order_id,
            products : products,
            oldOrderStatus: oldStatus
        })
    })

    let json = await response.json(); //wait for the response. true or false.
}

