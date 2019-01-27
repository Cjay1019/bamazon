const mysql = require("mysql");
const inquirer = require("inquirer");
const colors = require("colors");
const Table = require("terminal-table");

var id;
var name;

var connection = mysql.createConnection({
  port: 3306,
  user: "root",
  password: "root",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Welcome Bamazon team member!!\n");
  mainMenu();
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
    mainMenu();
  });
}

function lowInventory() {
  connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(
    err,
    res
  ) {
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
    mainMenu();
  });
}

function mainMenu() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: [
          "View products for sale",
          "View low inventory products",
          "Add to inventory",
          "Add new product",
          "Exit"
        ]
      }
    ])
    .then(function(response) {
      switch (response.choice) {
        case "View products for sale":
          printInventory();
          break;
        case "View low inventory products":
          lowInventory();
          break;
        case "Add to inventory":
          addInventory();
          break;
        case "Add new product":
          newInventory();
          break;
        case "Exit":
          connection.end();
          return;
      }
    });
}

function addInventory() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "product",
        message: "Enter the ID of the product you are updating"
      }
    ])
    .then(function(response) {
      id = response.product;
      howManyAdd();
    });
}

function howManyAdd() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "amount",
        message: "How many are you adding?"
      }
    ])
    .then(function(response) {
      connection.query("SELECT * FROM products", function(err, res) {
        var newAmount = res[id - 1].stock_quantity + response.amount;
        connection.query(
          "UPDATE products SET ? WHERE ?",
          [
            {
              stock_quantity: newAmount
            },
            {
              item_id: id
            }
          ],
          function(error) {
            if (error) throw err;
            console.log("This item's stock has been successfully updated!");
            mainMenu();
          }
        );
      });
    });
}

function newInventory() {
  connection.query("SELECT department_name FROM products", function(err, res) {
    var departments = [];
    for (i = 0; i < res.length; i++) {
      departments.push(res[i].department_name);
    }
    inquirer
      .prompt([
        {
          type: "input",
          name: "name",
          message: "Enter the name of the product you are adding"
        },
        {
          type: "list",
          name: "department",
          message: "Enter the department of the product you are adding",
          choices: departments
        },
        {
          type: "input",
          name: "price",
          message: "Enter the price of the product you are adding"
        },
        {
          type: "input",
          name: "stock",
          message: "Enter how many are being added to inventory"
        }
      ])
      .then(function(response) {
        connection.query(
          `INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('${
            response.name
          }', '${response.name}', ${response.price}, ${response.stock})`,
          function(error) {
            if (error) throw err;
            mainMenu();
          }
        );
      });
  });
}
