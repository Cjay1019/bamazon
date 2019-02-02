const mysql = require("mysql");
const inquirer = require("inquirer");
const colors = require("colors");
const Table = require("terminal-table");

var id;

var connection = mysql.createConnection({
  port: 3306,
  user: "root",
  password: "root",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Welcome to Bamazon!\n");
  printInventory();
});

function printInventory() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    var table = new Table({ borderStyle: 3 });
    table.push([
      "ID".blue,
      "Product".blue,
      "Department".blue,
      "Price".blue,
      "Stock".blue
    ]);
    for (i = 0; i < res.length; i++) {
      var product = [];
      product.push(
        res[i].item_id,
        res[i].product_name,
        res[i].department_name,
        "$" + res[i].price,
        res[i].stock_quantity
      );
      table.push(product);
    }
    console.log("" + table);
    buy();
  });
}

function buy() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "choice",
        message: "Enter the number of the item you would like to buy."
      }
    ])
    .then(function(response) {
      connection.query("SELECT * FROM products", function(err, res) {
        id = response.choice - 1;
        if (res[id].stock_quantity === 0) {
          console.log("This item is out of stock!".red);
          wouldYou();
        } else {
          howMany();
        }
      });
    });
}

function wouldYou() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "What would you like to do now?",
        choices: ["Buy a different item", "Exit"]
      }
    ])
    .then(function(response) {
      if (response.choice === "Buy a different item") {
        printInventory();
      } else {
        connection.end();
        return;
      }
    });
}

function tooMany() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "There isn't enough of that item in stock.".red,
        choices: ["Enter a new amount", "Choose a different item", "Exit"]
      }
    ])
    .then(function(response) {
      switch (response.choice) {
        case "Enter a new amount":
          howMany();
          break;
        case "Choose a different item":
          printInventory();
          break;
        case "Exit":
          connection.end();
          return;
      }
    });
}

function howMany() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "number",
        message: "Enter the amount that you would like to purchase."
      }
    ])
    .then(function(response) {
      connection.query("SELECT * FROM products", function(err, res) {
        if (response.number > res[id].stock_quantity) {
          tooMany();
        } else {
          var sales = res[id].price * parseFloat(response.number);
          var profit = res[id].product_sales + sales;
          console.log(
            `Success! You have purchased ${response.number} ${
              res[id].product_name
            }(s) for ` + colors.red("$" + sales.toFixed(2))
          );
          var newAmount = res[id].stock_quantity - response.number;
          connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: newAmount,
                product_sales: profit
              },
              {
                item_id: id + 1
              }
            ],
            function(error) {
              if (error) throw err;
              wouldYou();
            }
          );
        }
      });
    });
}
