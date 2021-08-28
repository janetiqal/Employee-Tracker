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
                    viewEmployeeRoles();
                    break;
                case "View all Departments":
                    viewAllDepartments();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Update Employees Role":
                    updateEmployeeRole();
                    break;
                case "View All Roles":
                    viewAllRoles();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "Add Department":
                    addDepartment();
                    break;
            }
        })
};
//Table View of Employees: Includes id, first& last name, title, department, salary,manager
function viewEmployeeTable() {
    //need id, first& last name, title, department, salary,manager
    var query = 'SELECT * FROM employee'
    //query needs work
    // 'SELECT employee.id ,employee.first_name, employee.last_name, role.title, name AS department, role.salary FROM employee LEFT JOIN role ON employee.role_id = role.department_id'
    dbConnect.query(query, function (err, results) {
        console.log(results)
        console.table(results);

    })
};

//Table View of Departments: Includes job title, role id, department the role belongs to, and corresponding salary
function viewEmployeeRoles() {
    var query = ''
    dbConnect.query(query, function (err, results) {
        console.table(results);
    })
};
//Table View of Departments: Includes id and name of departments
function viewAllDepartments() {
    var query = 'SELECT * FROM department';
    dbConnect.query(query, function (err, results) {
        console.table(results);
    })
};

//Add Employee
function addEmployee() {
    inquirer.prompt([
        {
            type: "input",
            message:"What is the employee's first name?",
            name: "firstName"
        },
        {
            type: "input",
            message:"What is the employee's last name?",
            name: "lastName"
        },
        //finsih these questions 
    ])
}

//id, title, department and salary
function viewAllRoles() { }
//add role
function addRole() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the role?",
            name: "newRole"
        },
        {
            type: "input",
            message: "What is the salary of the role?",
            name: "newSalary"
        },
        {
            type: "list",
            message: "What department does this role belong to?",
            name: "designatedDepartment",
            //when the user creates a new department it needs to be added to this choices array
            choices: ["IT Support", "Finance", "Legal","Engineering", "Sales"]
        }
    ])
}

function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the new department?",
            name: "newDepartment"
        }])
        .then((response) => {
            // add response.newDepartment to database
        })

}
init();
