-- Drop database before creating it
DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

-- Need to create the table 'products' in the newly created database
USE bamazon;

-- Create the new products table in the bamazon database
CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY (item_id)
);

-- Data for demonstration purposes
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Blue Pants", "Clothes", 19.99, 1000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Blue Shirts", "Clothes", 14.99, 500);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("XBox One", "Electronics", 399.99, 45);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Playstation 4", "Electronics", 399.99, 55);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("TV", "Electronics", 299.99, 30);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Apples", "Food", 0.75, 10000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Bananas", "Food", 0.50, 498);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Airplane", "Vehicles", 100000.00, 1);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Moped", "Vehicles", 499.99, 8);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Scooter", "Vehicles", 70.00, 129);

-- Verify all data is in our new table
SELECT * FROM products;
