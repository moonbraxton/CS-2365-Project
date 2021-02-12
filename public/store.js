//Status' when the application has loaded the webpage
if (document.readyState == 'loading') { //When doc is done loading, call ready()
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

//Called when the doc is fully loaded... Links buttons to actions
function ready() { 
    var removeCartItemButtons = document.getElementsByClassName('btn-remove-item')
    for (var i = 0; i < removeCartItemButtons.length; i++) { //Link buttons that remove items from cart to actions
        var button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem)
    }

    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (var i = 0; i < quantityInputs.length; i++) { //Link all buttons that change the quantity to purchase from cart to actions
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }

    var addToCartButtons = document.getElementsByClassName('shop-item-button')
    for (var i = 0; i < addToCartButtons.length; i++) { //Link all add to cart buttons to actions
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }

    //Link the purchase button to actions
    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
}

//Called when the purchase button is called
function purchaseClicked() {
    var items = [] //List of items being purchased
    var priceElement = document.getElementsByClassName('cart-total-price')[0] //Holds the Total Price
    var price = parseFloat(priceElement.innerText.replace('$', '')) * 100 //Actual total pirce (resolution: 1c)
     

    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    for (var i = 0; i < cartRows.length; i++) { //Gets the information for all items currently in the cart
        var cartRow = cartRows[i]
        var id = cartRow.dataset.itemId
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var quantityPurchased = quantityElement.value
        var quantityInStock = cartRow.dataset.itemQuantity
        items.push({
            id: id,
            quantityPurchased: quantityPurchased,
            quantityInStock: quantityInStock
        })
    }

    console.log("Items Purchased: ", items);

    if(confirm('Are you sure you would like to purchase?')){ //Removes the current cart if the customer confirms they want to purchase
        var cartItems = document.getElementsByClassName('cart-items')[0] //Holds all the items that are in the cart
        while (cartItems.hasChildNodes()) { //Iter through the items in the cart and remove the first one (items will shift when first is removed)
            var currentlyInStock = cartItems.firstChild;
            cartItems.removeChild(cartItems.firstChild)

        }
        updateCartTotal() //Since cart is empty, cart total will be updated to $0

        //TODO:: Subtract the quantity bought from the quantity in stock... 
    }
    

    
}

//Called when the remove from cart button is called
function removeCartItem(event) {
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove() //Remove the entire cartRow from cartItems
    updateCartTotal() 
}

//Called when the quanitity in cart is changed 
function quantityChanged(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) { //Make sure the quantity to buy is valid. if invalid set to 1
        input.value = 1
    }
    updateCartTotal() 
}

//Called when an add to cart button is clicked
function addToCartClicked(event) {
    var button = event.target
    var shopItem = button.parentElement.parentElement
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src
    var id = shopItem.dataset.itemId
    var quantity = shopItem.dataset.itemQuantity
    addItemToCart(title, price, imageSrc, id, quantity)
    updateCartTotal()
}

//Called when an add to cart button is clicked
function addItemToCart(title, price, imageSrc, id, quantity) {
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')

    cartRow.dataset.itemId = id //Save the ID and Quantity in stock (itemQuantity) for future refrence
    cartRow.dataset.itemQuantity = quantity

    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    var cartItemQuantity = cartItems.getElementsByClassName('cart-quantity-input')
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            cartItemQuantity[i].value = parseInt(cartItemQuantity[i].value) + 1
            return
        }
    }

    var cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-remove-item" type="button">REMOVE</button>
        </div>`

    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-remove-item')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
}

//Updates the car total based on what is in the cart at time of method call
function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    var total = 0
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var price = parseFloat(priceElement.innerText.replace('$', ''))
        var quantity = quantityElement.value
        total = total + (price * quantity)
    }
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total
}