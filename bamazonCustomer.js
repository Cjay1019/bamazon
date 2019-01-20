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
  printInventory();
});

function printInventory() {}

// table.push(["First".blue, "Second"], ["Foo", "Bar"]);

// console.log("" + table);
