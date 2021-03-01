if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load()
}

const express = require('express')
const app = express()
const fs = require('fs')

let customerID; //ID of the customer currently logged in

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.static('public'))

app.get('/store', function(req, res) {
  fs.readFile('./public/config_files/items.json', function(error, data) {
    if (error) {
      res.status(500).end()
    } else {
      res.render('store.ejs', {
        items: JSON.parse(data)
      })
    }
  })
})

app.post("/check_account", (request, response) => {
  console.log("Client requesting customer accounts.", request.body);

  let usersjson = fs.readFileSync("./public/config_files/accounts.json","utf-8"); //refrence to the file
  let accounts = JSON.parse(usersjson); //JSON object of all current accoutns

  let valid = false;
  accounts.forEach(function(obj){
    if(request.body.email === obj.email && request.body.password === obj.password){
      valid = true;
      customerID = obj.id;
    }
  })

  if(valid){
    console.log("Account Matched! Logging in...");
    response.json(true);
    response.end();
  } else {
    response.json(false);
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
  orders.push({
    customer_id: customerID,
    items: request.body.items,
    orderTotal: request.body.orderTotal,
    orderStatus: "ordered",
    purchaseAuthorizationNumber: request.body.confirmationNumber
  })

  //update order with items purchased, date, confirmation number, etc...
  ordersjson = JSON.stringify(orders, null, 2); //transform back into JSON string
  fs.writeFileSync("./public/config_files/orders.json", ordersjson, "utf-8"); //save the json file

  response.json(true);
})
app.listen(3000)