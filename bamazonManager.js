// Require mysql
var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
})
connection.connect(function (err) {
    if (err) {
        throw err;
    }
    console.log("Connection id: " + connection.threadId);
})

// Require inquirer
var inquirer = require("inquirer");

// Require table for displaying table data in a nice layout
var formattable = require("table");

// User choice for item id
var intChoice = 0;

// Function to display the information in the products table
function displayProductTable() {
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM PRODUCTS", function (err, res) {
        if (err) {
            throw err;
        }

        // Variable to store the data
        var data = [];

        // Create header row
        data.push(["--- Item Id ---", "--- Product Name ---", "--- Price ---", "--- Stock ---"]);

        // Loop through the results and append to the data array
        for (var i = 0; i < res.length; i++) {
            data.push([res[i].item_id, res[i].product_name, res[i].price.toFixed(2), res[i].stock_quantity]);
        }

        // Output the data in a nicely formatted layout
        var output = formattable.table(data);
        console.log(output);
        userPrompt();
    })
}

// Prompt the user to enter an item id
function userPrompt() {
    inquirer.prompt({
        type: "list",
        name: "userChoice",
        message: "What would you like to do?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
    }).then(function (user) {
        choice = user.userChoice;

        // What did the manager select?
        switch (choice) {
            case "View Products for Sale":
                displayProductTable();
                break;
            case "Exit":
                exitProgram();
                break;
            default:
                console.log("Invalid Selection");
                userPrompt();
        }
    })
}

// Prompt the user to enter a quantity
function productQuantity(price, quantity) {
    inquirer.prompt({
        type: "input",
        name: "userChoice",
        message: "Please enter the quantity you would like to purchase:"
    }).then(function (user) {
        var userQuantity = parseInt(user.userChoice);

        // If user entered something other than a number, call the function again.
        if (isNaN(userQuantity)) {
            console.log("You need to enter a number.");
            productQuantity(price, quantity);
        } else {
            // Verify the user entered a valid quantity greater than 0
            if (userQuantity <= 0) {
                console.log("Please enter a quantity greater than 0.");
                productQuantity();
            } else {
                // Cannot buy if there is not enough stock on hand.
                if (userQuantity > quantity) {
                    console.log("You want to buy " + userQuantity + " but we only have " + quantity + " in stock. Sorry!");
                    productQuantity(price, quantity);
                } else {
                    // Valid quantity requested, purchase the product.
                    purchaseProduct(price, quantity, userQuantity);
                }
            }
        }
    })
}

// Complete the purchase order
function purchaseProduct(itemPrice, itemQuantity, purchaseQuantity) {
    console.log("Update item id " + intChoice + " price " + itemPrice + " quantity " + itemQuantity);
    console.log("Completing your purchase...");
    var updateQuery = connection.query("UPDATE PRODUCTS SET ? WHERE ?",
        [
            { stock_quantity: itemQuantity - purchaseQuantity },
            { item_id: intChoice }
        ],
        function (error, result) {
            if (error) {
                throw error;
            } else {
                showPurchaseResults(itemPrice, purchaseQuantity);
            }
        });
}

// Show the totals to the user
function showPurchaseResults(price, quantity) {
    // Total cost for the purchase
    var totalCost = (price * quantity).toFixed(2);
    console.log("You credit card has been charged $" + totalCost);
    console.log("Thank you for using Bamazon, where the prices are always lower than Amazon!\nHope to see you again soon!");

    // Exit the program
    exitProgram();
}

// Exit the program
function exitProgram() {
    console.log("Thank you! Exiting now...")
    connection.end();
}

// Display product information to the user
userPrompt();
