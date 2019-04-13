// Require mysql
var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
})
connection.connect(function(err) {
    if (err) {
        throw err;
    }
    console.log("Connection id: " + connection.threadId);
    displayProductTable();
})

// Require inquirer
var inquirer = require("inquirer");

// Require table for displaying table data in a nice layout
var formattable = require("table");

// Function to display the information in the products table
function displayProductTable() {
    connection.query("SELECT * FROM PRODUCTS", function(err, res) {
        if (err) {
            throw err;
        }
        var data = [];

        // Create header row
        data.push(["--- Item Id ---", "--- Product Name ---", "--- Price ---", "--- Stock ---"]);

        // Loop through the results and append to the data array
        for (var i = 0; i < res.length; i++){
            data.push([res[i].item_id, res[i].product_name, res[i].price.toFixed(2), res[i].stock_quantity]);
        }

        // Output the data in a nicely formatted layout
        var output = formattable.table(data);
        console.log(output);
        exitProgram();
    })
}

// Exit the program
function exitProgram() {
    connection.end();
}