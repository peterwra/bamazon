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

// Global variable to store the data
var data = [];

// User choice for item id
var intChoice = 0;

// Function to display the information in the products table
function displayProductTable() {
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM PRODUCTS", function (err, res) {
        if (err) {
            throw err;
        }

        // Empty the array
        data.length = 0;

        // Create header row
        data.push(["--- Item Id ---", "--- Product Name ---", "--- Price ---", "--- Stock ---"]);

        // Loop through the results and append to the data array
        for (var i = 0; i < res.length; i++) {
            // Only display products that can be purchased
            if (parseInt(res[i].stock_quantity) > 0){
                data.push([res[i].item_id, res[i].product_name, res[i].price.toFixed(2), res[i].stock_quantity]);
            }
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
        type: "input",
        name: "userChoice",
        message: "Please enter an item id to purchase:"
    }).then(function (user) {
        intChoice = parseInt(user.userChoice);

        // User didn't enter a number.
        if (isNaN(intChoice)) {
            console.log("You need to enter a number.");
            displayProductTable();
        } else {
            var isFound = false;
            var itemPrice = 0.00;
            var stockQuantity = 0;

            // Loop through the data array and get the item user wants to purchase.
            for (var i = 1; i < data.length; i++) {
                if (intChoice == data[i][0]) {
                    isFound = true;
                    itemPrice = parseFloat(data[i][2]).toFixed(2);
                    stockQuantity = parseInt(data[i][3]);
                    break;
                }
            }

            // User entered an item id not in the database.
            if (!isFound) {
                console.log("The item id you entered does not exist or there is no stock. Please enter an existing item id.");
                displayProductTable();
            } else {

                // User entered a valid item, proceed to quantity.
                productQuantity(itemPrice, stockQuantity);
            }
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
                productQuantity(price, quantity);
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
    connection.end();
}

// Display product information to the user
displayProductTable();
