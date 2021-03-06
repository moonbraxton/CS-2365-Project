if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load()
}

const express = require('express')
const app = express()
const fs = require('fs')

let currentCustomer = {
  email: '',
  password: '',
  cardNumber: '',
  cardExpiration: '',
  cardCVV: '',
  id: -1
}; //The customer currently logged in

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.static('public'))

app.engine('ejs', require('ejs').__express);

app.get('/store', function(req, res) {
  fs.readFile('./public/config_files/items.json', function(error, data) {
    if (error) {
      res.status(500).end()
    } else {
      res.render('store.ejs', {
        items: JSON.parse(data),
        membershipFee: firstPurchase()
      })
    }
  })
})

app.get('/orders', function(req, res) {
  fs.readFile('./public/config_files/orders.json', function(error, data) {
    if (error) {
      res.status(500).end()
    } else {
      res.render('orders.ejs', {
        items: JSON.parse(data)
      })
    }
  })
})

app.get('/stock', function(req, res) {
  fs.readFile('./public/config_files/items.json', function(error, data) {
    if (error) {
      res.status(500).end()
    } else {
      res.render('stock.ejs', {
        items: JSON.parse(data)
      })
    }
  })
})

app.get('/account', function(req, res) {
  fs.readFile('./public/config_files/orders.json', function(error, data) {
    if (error) {
      res.status(500).end()
    } else {
      res.render('account.ejs', {
        items: JSON.parse(data),
        customer: currentCustomer
      })
    }
  })
})

//Returns true if the customer has not made a purchade this year
function firstPurchase(){
  let ordersjson = fs.readFileSync("./public/config_files/orders.json","utf-8"); //refrence to the file
  let orders = JSON.parse(ordersjson); //JSON object holding all current items
  let output = true;

  orders.forEach(function(obj){
    if(obj.customer_id === currentCustomer.id){
      output = false;
    }
  })
  
  return output;
}

app.post("/check_account", (request, response) => {
  console.log("Client requesting customer accounts.", request.body);

  let usersjson = fs.readFileSync("./public/config_files/accounts.json","utf-8"); //refrence to the file
  let accounts = JSON.parse(usersjson); //JSON object of all current accoutns
  let type = "";

  let valid = false;
  accounts.forEach(function(obj){
    if(request.body.email === obj.email && request.body.password === obj.password){
      valid = true;
      currentCustomer = obj;
      type = obj.type;
    }
  })

  if(valid){
    console.log("Account Matched! Logging in...");
    response.json({type : type});
    response.end();
  } else {
    response.json({type : "invalid"});
    response.end();
  }
})

app.post("/check_email", (request, response) => {
  console.log("Client requesting email check.", request.body);

  fs.readFile('./public/config_files/accounts.json', function(error, data){
    if (error) {
      response.status(500).end();
    } else {
      let accounts = JSON.parse(data);
      let used = false;
      accounts.forEach(function(obj){
        if(request.body.email === obj.email){
          used = true;
        }
      })

      if(used){
        console.log("Email currently in use!");
        response.json(true);
        response.end();
      } else {
        response.json(false);
        response.end();
      }
    }
  })
})

app.post("/create_account", (request, response) => {
  let usersjson = fs.readFileSync("./public/config_files/accounts.json","utf-8"); //refrence to the file
  let users = JSON.parse(usersjson); //JSON object of all current accoutns
  let nextID = users.length; //get the next available customer id
 
  request.body.id = nextID;
  console.log("Creating customer account...\n\t", request.body); //request.body is the object to add to the file

  users.push(request.body);
  console.log("Users: ", users);

  usersjson = JSON.stringify(users, null, 2); //transform back into JSON string
  fs.writeFileSync("./public/config_files/accounts.json", usersjson, "utf-8"); //save the json file

  response.json(true);
})

app.post("/make_order", (request, response) => {
  let ordersjson = fs.readFileSync("./public/config_files/orders.json","utf-8"); //refrence to the file
  let orders = JSON.parse(ordersjson); //JSON object holding all current items

  //request.body.items = items purchased
  //request.body.confirmationNummber = confirmation number from the bank
  let today = new Date().toLocaleDateString()

  orders.push({
    order_id: orders.length,
    customer_id: currentCustomer.id,
    items: request.body.items,
    orderTotal: request.body.orderTotal,
    orderStatus: "Ordered",
    purchaseAuthorizationNumber: request.body.confirmationNumber,
    orderDate: today
  })

  //update order with items purchased, date, confirmation number, etc...
  ordersjson = JSON.stringify(orders, null, 2); //transform back into JSON string
  fs.writeFileSync("./public/config_files/orders.json", ordersjson, "utf-8"); //save the json file

  response.json(true);
})

app.post("/order_order", (request, response) => {
  let ordersjson = fs.readFileSync("./public/config_files/orders.json","utf-8"); //refrence to the file
  let orders = JSON.parse(ordersjson); //JSON object holding all current items

  for(let order of orders){
    if("" + order.order_id === "" + request.body.order_id){
      order.orderStatus = "Ordered";
    }
  }

  //update order with items purchased, date, confirmation number, etc...
  ordersjson = JSON.stringify(orders, null, 2); //transform back into JSON string
  fs.writeFileSync("./public/config_files/orders.json", ordersjson, "utf-8"); //save the json file

  let itemsjson = fs.readFileSync("./public/config_files/items.json","utf-8"); //refrence to the file
  let items = JSON.parse(itemsjson); //JSON object holding all current items

  for(let itemPurchased of request.body.products){
    for(let itemStock of items.music){
      if( itemPurchased.productName === itemStock.name){
        if(request.body.oldOrderStatus === "Shipped"){
          itemStock.available += parseInt(itemPurchased.productQuantity);

        } else if(request.body.oldOrderStatus === "Ready"){
          itemStock.reserved -= parseInt(itemPurchased.productQuantity);
          itemStock.available += parseInt(itemPurchased.productQuantity);

        } else {
        }

        continue;
      }
    }

    for(let itemStock of items.merch){
      if( itemPurchased.productName === itemStock.name){
        if(request.body.oldOrderStatus === "Shipped"){
          itemStock.available += parseInt(itemPurchased.productQuantity);

        } else if(request.body.oldOrderStatus === "Ready"){
          itemStock.reserved -= parseInt(itemPurchased.productQuantity);
          itemStock.available += parseInt(itemPurchased.productQuantity);

        } else {
        }
        
        continue;
      }
    }
  }

  //update order with items purchased, date, confirmation number, etc...
  itemsjson = JSON.stringify(items, null, 2); //transform back into JSON string
  fs.writeFileSync("./public/config_files/items.json", itemsjson, "utf-8"); //save the json file

  response.json(true);
})

app.post("/ready_order", (request, response) => {
  let ordersjson = fs.readFileSync("./public/config_files/orders.json","utf-8"); //refrence to the file
  let orders = JSON.parse(ordersjson); //JSON object holding all current items

  for(let order of orders){
    if("" + order.order_id === "" + request.body.order_id){
      order.orderStatus = "Ready";
    }
  }

  //update order with items purchased, date, confirmation number, etc...
  ordersjson = JSON.stringify(orders, null, 2); //transform back into JSON string
  fs.writeFileSync("./public/config_files/orders.json", ordersjson, "utf-8"); //save the json file

  let itemsjson = fs.readFileSync("./public/config_files/items.json","utf-8"); //refrence to the file
  let items = JSON.parse(itemsjson); //JSON object holding all current items

  for(let itemPurchased of request.body.products){
    for(let itemStock of items.music){
      if( itemPurchased.productName === itemStock.name){
        if(request.body.oldOrderStatus === "Ordered"){
          itemStock.available -= parseInt(itemPurchased.productQuantity);
          itemStock.reserved += parseInt(itemPurchased.productQuantity);
        } else if(request.body.oldOrderStatus === "Shipped"){
          itemStock.reserved += parseInt(itemPurchased.productQuantity);
        } else {
        }
        
        continue;
      }
    }

    for(let itemStock of items.merch){
      if( itemPurchased.productName === itemStock.name){
        if( itemPurchased.productName === itemStock.name){
          if(request.body.oldOrderStatus === "Ordered"){
            itemStock.available -= parseInt(itemPurchased.productQuantity);
            itemStock.reserved += parseInt(itemPurchased.productQuantity);
          } else if(request.body.oldOrderStatus === "Shipped"){
            itemStock.reserved += parseInt(itemPurchased.productQuantity);
          } else {
          }
          
          continue;
        }
      }
    }
  }

  //update order with items purchased, date, confirmation number, etc...
  itemsjson = JSON.stringify(items, null, 2); //transform back into JSON string
  fs.writeFileSync("./public/config_files/items.json", itemsjson, "utf-8"); //save the json file

  response.json(true);
})


app.post("/ship_order", (request, response) => {
  let ordersjson = fs.readFileSync("./public/config_files/orders.json","utf-8"); //refrence to the file
  let orders = JSON.parse(ordersjson); //JSON object holding all current items

  for(let order of orders){
    if("" + order.order_id === "" + request.body.order_id){
      order.orderStatus = "Shipped";
    }
  }

  //update order with items purchased, date, confirmation number, etc...
  ordersjson = JSON.stringify(orders, null, 2); //transform back into JSON string
  fs.writeFileSync("./public/config_files/orders.json", ordersjson, "utf-8"); //save the json file

  let itemsjson = fs.readFileSync("./public/config_files/items.json","utf-8"); //refrence to the file
  let items = JSON.parse(itemsjson); //JSON object holding all current items

  for(let itemPurchased of request.body.products){
    for(let itemStock of items.music){
      if( itemPurchased.productName === itemStock.name){
        if( itemPurchased.productName === itemStock.name){
          if(request.body.oldOrderStatus === "Ordered"){
            itemStock.available -= parseInt(itemPurchased.productQuantity);
          } else if(request.body.oldOrderStatus === "Ready"){
            itemStock.reserved -= parseInt(itemPurchased.productQuantity);
          } else {
          }
          
          continue;
        }
      }
    }

    for(let itemStock of items.merch){
      if( itemPurchased.productName === itemStock.name){
        if( itemPurchased.productName === itemStock.name){
          if(request.body.oldOrderStatus === "Ordered"){
            itemStock.available -= parseInt(itemPurchased.productQuantity);
          } else if(request.body.oldOrderStatus === "Ready"){
            itemStock.reserved -= parseInt(itemPurchased.productQuantity);
          } else {
          }
          
          continue;
        }
      }
    }
  }

  //update order with items purchased, date, confirmation number, etc...
  itemsjson = JSON.stringify(items, null, 2); //transform back into JSON string
  fs.writeFileSync("./public/config_files/items.json", itemsjson, "utf-8"); //save the json file

  response.json(true);
})

app.listen(3000)