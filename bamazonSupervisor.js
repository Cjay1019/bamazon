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
  console.log("Welcome Bamazon administrator!\n");
  mainMenu();
});

function mainMenu() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: [
          "View product sales by department",
          "Create new department",
          "Exit"
        ]
      }
    ])
    .then(function(response) {
      switch (response.choice) {
        case "View product sales by department":
          printDepartments();
          break;
        case "Create new department":
          createDepartment();
          break;
        case "Exit":
          connection.end();
          return;
      }
    });
}

function printDepartments() {
  var query =
    "SELECT departments.department_name, ifnull(SUM(product_sales), 0.00) AS total, over_head_costs FROM departments ";
  query +=
    "LEFT JOIN products ON departments.department_name=products.department_name GROUP BY departments.department_id";
  connection.query(query, function(err, res) {
    if (err) throw err;
    var table = new Table({ borderStyle: 3 });
    table.push([
      "Department".blue,
      "Overhead".blue,
      "Sales".blue,
      "Profit".blue
    ]);
    for (i = 0; i < res.length; i++) {
      var product = [];
      product.push(
        res[i].department_name,
        "$" + res[i].over_head_costs,
        "$" + res[i].total,
        "$" + (res[i].total - res[i].over_head_costs).toFixed(2)
      );
      table.push(product);
    }
    console.log("" + table);
    mainMenu();
  });
}

function createDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "department",
        message: "Enter the name of the department you are adding"
      }
    ])
    .then(function(response) {
      connection.query(
        `INSERT INTO departments (department_name, over_head_costs) VALUES ('${
          response.department
        }', 0)`,
        function(error) {
          if (error) throw err;
          console.log("New department has been successfully created!\n");
          mainMenu();
        }
      );
    });
}
