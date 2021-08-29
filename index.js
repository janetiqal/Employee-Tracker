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
                case "Add Role":
                    addRole();
                    break;
                case "Add Department":
                    addDepartment();
                    break;
            }
        })
};
//Table View of Employees: Includes id, first & last name, title, department, salary, and manager.
function viewEmployeeTable() {
    //need id, first& last name, title, department, salary,manager
    //three tables: role and employee and department tables
    var query =  "SELECT employee.id,employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS Title, role.salary AS Salary, name AS Department, CONCAT(manager.first_name, ' ', manager.last_name)AS Manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON department.id = role.department_id LEFT JOIN employee manager ON manager.id = employee.manager_id ORDER BY department.name"
    dbConnect.query(query, function (err, results) {
        if(err){
            console.log('Error with Employee Table', err)
        }
        console.table(results);
    })

};

//Table View of Departments: Includes job title, role id, department the role belongs to, and corresponding salary
function viewEmployeeRoles() {
    var query = 'SELECT role.id ,role.title AS Title , role.salary AS Salary, department.name AS Department FROM role LEFT JOIN department ON role.department_id = department.id'
    dbConnect.query(query, function (err, results) {
        if(err){
            console.log("Error with viewing Employee Roles", err)
        }
        console.table(results);
      
    })
    //   init();
};
//Table View of Departments: Includes id and name of departments
function viewAllDepartments() {
    var query = 'SELECT department.id ,department.name AS Department FROM department';
    dbConnect.query(query, function (err, results) {
        if(err){
            console.log("Error with viewing Departments", err)
        }
        console.table(results);
    })
    // init();
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
        {
            type: "list",
            message:"What is the employee's role?",
            name: "role",
            choices: function(){
                var map =[]
                
                dbConnect.query('Select role.title FROM role', (err,res)=>{
                    if (err) throw err;
                    // console.log(res)
                   var roleTtile = res.map(role=> role.title)
                   console.log(roleTtile) 

                    // roles.push(map)
                    // console.log("roles",roles)
                    // console.log("results",res)
                    // console.log("roles",roles)


                    //trying to push the roletitle array into the array defined at the function scope so i can return it
                    return map.push(roleTtile);
                })
             //this becomes out of scope
             return map;
            }
        },
        {
            type: "list",
            message:"Who is the employee's manager?",
            name: "role",
            choices:["check"]
        }
    ])
    .then((response)=>{
        console.log(response.firstName, response.lastName, response.role)
        // var query= `INSERT ${response.name}`
        // dbConnect.query(query, (req, res)=>{
        //     console.log(res)
        // })
    })
}

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

function updateEmployeeRole (){
    inquirer.prompt([
        {
            type: "list",
            message: "Which employees role do you want to update?",
            name: "roleUpdate",
            choices: []
        },
        {
            type: "list",
            message: "Which role do you want to assign to this selected employee?",
            name: "newSalary"
        }
        //updated employees role
    ])
}
init();
