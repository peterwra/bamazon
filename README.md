# Bamazon

## Overview

In this program we are emulating a store front where the customer can purchase various items stored in a MySQL database. In addition, there is a manager component that allows the individual to view and add stock. New items can also be added.

#### Bamazon Customer

**Purpose:**

Allows the user to purchase items stored in the MySQL table. It calculates the total cost of the order based on the quantity purchased from the store. The inventory will then be depleted.

**Usage:**

'node bamazonCustomer'

The program will connect to the 'products' table and display the products available to the user for purchase. If there is no quantity in stock, do not display the item and do not allow them to purchase it. Once the order is complete, display the total order amount and update the database to the new quantity.

#### Bamazon Manager

**Purpose:**

The manager can view inventory and add quantity to existing items in the 'products' table. In addtion, new items can be added which will then be stored in the MySQL database for future purchase.

**Usage:**

'node bamazonManager'

There are several options for the manager:
1. View Products for Sale: Display the existing items in the table, including those with no stock.
2. View Low Inventory: Show items that have a stock quantity of less than 5.
3. Add to Inventory: Add stock to an item in the 'products' table.
4. Add New Product: Gives the manager a menu to allow them to add a new product to the storefront.
5. Exit: Stop the program.

#### Video Demonstration

For a video demonstration, click [here](https://drive.google.com/open?id=11wsZtLIdN3gGnuqWF9vgREB_k-DMu7Zv).