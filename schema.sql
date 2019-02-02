DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products
(
  item_id INT NOT NULL
  AUTO_INCREMENT,
  product_name VARCHAR
  (100) NULL,
  department_name VARCHAR
  (100) NULL,
  price DECIMAL
  (7,2) NULL,
  stock_quantity INT
  (10) NULL,
  product_sales DECIMAL
  (10,2) NULL,
  PRIMARY KEY
  (item_id)
);

  CREATE TABLE departments
  (
    department_id INT NOT NULL
    AUTO_INCREMENT,
  department_name VARCHAR
    (100) NULL,
  over_head_costs DECIMAL
    (10,2) NULL,
    PRIMARY KEY
    (department_id)
);