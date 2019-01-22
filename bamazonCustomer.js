const mysql = require("mysql");
const inquirer = require("inquirer");
const colors = require("colors");
var Table = require("terminal-table");
var table = new Table({ borderStyle: 3 });

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
    table.push(["Product".blue, "Department".blue, "Price".blue, "Stock".blue]);
    for (i = 0; i < res.length; i++) {
      var product = [];
      product.push(
        res[i].product_name,
        res[i].department_name,
        "$" + res[i].price,
        res[i].stock_quantity
      );
      table.push(product);
    }
    console.log("" + table);
  });
}

function buy() {
  inquirer.prompt([
    {
      type: "input",
      name: "choice",
      message: "Which item would you like to buy?"
    }
  ]);
}
