const inquirer = require("inquirer");
const consoleTable = require("console.table");
const mysql = require("mysql2");
require("dotenv").config();
const dbConnect = require("./config/connection")

function init() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "optionsStart",
            choices: ["View all Employees", "Add Employee", "Update Employees Role", "View All Roles", "Add Role", "View all Departments", "Add Department"]
        }])
        .then((response) => {
            switch (response.optionsStart) {
                case "View all Employees":
                    viewEmployeeTable();
                    break;
                case "View All Roles":
                    viewEmployeerRoles();
                    break;
                case "View all Departments":
                    viewAllDepartments();
                    break;
                //continue w other options
            }
        })
};
//Table View of Employees: Includes id, first& last name, title, department, salary,manager
function viewEmployeeTable() {
    //need id, first& last name, title, department, salary,manager
    var query =  
    //query needs work
    // 'SELECT employee.id ,employee.first_name, employee.last_name, role.title, name AS department, role.salary FROM employee LEFT JOIN role ON employee.role_id = role.department_id'
    dbConnect.query(query, function (err, results) {
        console.log(results)
        console.table(results);
    
    })
};

//Table View of Departments: Includes job title, role id, department the role belongs to, and corresponding salary
function viewEmployeerRoles() {
    var query = ''
    dbConnect.query(query, function (err, results) {
        console.table(results);
    })
};
//Table View of Departments: Includes id and name of departments
function viewAllDepartments() {
    var query ='SELECT * FROM department';
    dbConnect.query(query, function (err, results) {
        console.table(results);
    })
};

init();
