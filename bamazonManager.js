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

// Function to display the information in the products table
function displayProductTable() {
    // Create array to hold data
    var data = [];

    // Header row
    data.push(["--- Item Id ---", "--- Product Name ---", "--- Price ---", "--- Stock ---"]);

    // Fill the data array from the database
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM PRODUCTS", function (err, res) {
        if (err) {
            throw err;
        }

        // Loop through the results and append to the data array
        for (var i = 0; i < res.length; i++) {
            data.push([res[i].item_id, res[i].product_name, res[i].price.toFixed(2), res[i].stock_quantity]);
        }

        // Output the data in a nicely formatted layout
        var output = formattable.table(data);
        console.log("\n"+output+"\n");
        userPrompt();
    })
}

function lowInventory() {
    // Create array to hold data
    var data = [];

    // Fill the data array from the database
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM PRODUCTS WHERE stock_quantity<5", function (err, res) {
        if (err) {
            throw err;
        }

        // Check if we have low inventory
        if (res.length > 0) {
            // Header row
            data.push(["--- Item Id ---", "--- Product Name ---", "--- Price ---", "--- Stock ---"]);

            // Loop through the results and append to the data array
            for (var i = 0; i < res.length; i++) {
                data.push([res[i].item_id, res[i].product_name, res[i].price.toFixed(2), res[i].stock_quantity]);
            }

            // Output the data in a nicely formatted layout
            var output = formattable.table(data);
            console.log("\n"+output+"\n");

        } else {
            console.log("\nNo low inventory!\n");
        }

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
            case "View Low Inventory":
                lowInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Exit":
                exitProgram();
                break;
            default:
                console.log("\nInvalid Selection\n");
                userPrompt();
        }
    })
}

// Add inventory to the store
function addInventory() {
    // Populate data array
    var data = [];
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM PRODUCTS", function (err, res) {
        if (err) {
            throw err;
        }

        // Loop through the results and append to the data array
        for (var i = 0; i < res.length; i++) {
            data.push([res[i].item_id, res[i].product_name, res[i].price.toFixed(2), res[i].stock_quantity]);
        }
    })

    inquirer.prompt({
        type: "input",
        name: "userChoice",
        message: "Please enter the item number you would like to add inventory to:"
    }).then(function (user) {
        var itemId = parseInt(user.userChoice);

        // If user didn't enter a number, display alert and call the function again.
        if (isNaN(itemId)) {
            console.log("\nYou need to enter a number.\n");
            addInventory();
        } else {
            // If the item number doesn't exist, display alert.
            var isFound = false;
            for (var i = 1; i < data.length; i++) {
                if (itemId == data[i][0]) {
                    isFound = true;
                    stockQuantity = parseInt(data[i][3]);
                    break;
                }
            }

            // Item not found, have the manager enter the item id again
            if (!isFound) {
                console.log("\nThe item id you entered does not exist. Please enter an existing item id.\n");
                addInventory();
            } else {

                // User entered a valid item, proceed to quantity.
                updateStock(itemId, stockQuantity);
            }
        }
    })
}

// Prompt the user to enter a quantity
function updateStock(itemId, stockQuantity) {
    inquirer.prompt({
        type: "input",
        name: "userChoice",
        message: "Please enter the quantity you would add to the inventory:"
    }).then(function (user) {
        var userQuantity = parseInt(user.userChoice);

        // If user entered something other than a number, call the function again.
        if (isNaN(userQuantity)) {
            console.log("\nYou need to enter a number.\n");
            updateStock(itemId, stockQuantity);
        } else {
            // Verify the user entered a valid quantity greater than 0
            if (userQuantity <= 0) {
                console.log("\nPlease enter a quantity greater than 0.\n");
                updateStock(itemId, stockQuantity);
            } else {
                // Valid quantity entered, increase stock.
                var updateQuery = connection.query("UPDATE PRODUCTS SET ? WHERE ?",
                    [
                        { stock_quantity: stockQuantity + userQuantity },
                        { item_id: itemId }
                    ],
                    function (error, result) {
                        if (error) {
                            throw error;
                        } else {
                            console.log("\nSuccessfully updated stock!\n");
                            userPrompt();
                        }
                    });
            }
        }
    })
}

// Exit the program
function exitProgram() {
    console.log("\nThank you for using the manager application! Exiting now...\n")
    connection.end();
}

// Display user prompt
userPrompt();
