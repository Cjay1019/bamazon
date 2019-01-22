const mysql = require("mysql");
const inquirer = require("inquirer");
const colors = require("colors");
const Rx = require("rx");
const Table = require("terminal-table");

const prompts = new Rx.Subject();
const table = new Table({ borderStyle: 3 });

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
        id = response.choice;
        if (res[id].stock_quantity === 0) {
          console.log("This item is out of stock!");
          wouldYou();
        }
      });
    })
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
        message: "What would you like to do?",
        choices: ["Buy a different item", "Exit"]
      }
    ])
    .then(function(response) {
      if (response.choice === "Buy a different item") {
        printInventory();
      } else {
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
        message: "There isn't enough of that item in stock.",
        choices: ["Enter a new amount", "Choose a different item", "Exit"]
      }
    ])
    .then(function(response) {
      switch (response.choice) {
        case "Enter a new amount":
      }
    });
}
