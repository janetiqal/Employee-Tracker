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
//DONE
function viewEmployeeTable() {
    //need id, first& last name, title, department, salary,manager
    //three tables: role and employee and department tables
    var query = "SELECT employee.id,employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS Title, role.salary AS Salary, name AS Department, CONCAT(manager.first_name, ' ', manager.last_name)AS Manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON department.id = role.department_id LEFT JOIN employee manager ON manager.id = employee.manager_id ORDER BY department.name"
    dbConnect.query(query, function (err, results) {
        if (err) {
            console.log('Error with Employee Table', err)
        }
        console.table(results);
    })

};

//Table View of Departments: Includes job title, role id, department the role belongs to, and corresponding salary
//DONE
function viewEmployeeRoles() {
    var query = 'SELECT role.id ,role.title AS Title , role.salary AS Salary, department.name AS Department FROM role LEFT JOIN department ON role.department_id = department.id'
    dbConnect.query(query, function (err, results) {
        if (err) {
            console.log("Error with viewing Employee Roles", err)
        }
        console.table(results);

    })
    //   init();
};
//Table View of Departments: Includes id and name of departments
//DONE
function viewAllDepartments() {
    var query = 'SELECT department.id ,department.name AS Department FROM department';
    dbConnect.query(query, function (err, results) {
        if (err) {
            console.log("Error with viewing Departments", err)
        }
        console.table(results);
    })
    // init();
};

//Add Employee
//INPUT INFO INTO DB 
function addEmployee() {
    //put the Db query here to give the function some time to render the results from the query
    // var query= `Select role.title FROM role; Select CONCAT(employee.first_name," ",employee.last_name) AS Manager FROM employee WHERE employee.manager_id IS null`;
    dbConnect.query('Select role.title FROM role', (err, res) => {
        if (err) throw err;
        console.log(res)
        var roleTitle = res.map(role => role.title)
        // var manager = res[1].map(managerName => managerName.manager)

        dbConnect.query("Select CONCAT(employee.first_name, ' ' ,employee.last_name) AS Manager FROM employee WHERE employee.manager_id IS null" , (err, res) => {
            if (err) throw err;
            console.log(res)
        var manager = res.map(managerName => managerName.Manager)
        console.log(manager)
        inquirer.prompt([
                {
                    type: "input",
                    message: "What is the employee's first name?",
                    name: "firstName"
                },
                {
                    type: "input",
                    message: "What is the employee's last name?",
                    name: "lastName"
                },
                {
                    type: "list",
                    message: "What is the employee's role?",
                    name: "role",
                    choices: roleTitle
                },
                {
                    type: "list",
                    message: "Who is the employee's manager?",
                    name: "manager",
                    choices: manager
                }
            ])
                .then((response) => {
                    console.log(response.firstName, response.lastName, response.role, response.manager)
                    // var query= `INSERT ${response.name}`
                    // dbConnect.query(query, (req, res)=>{
                    //     console.log(res)
                        //"User has been added to the database"
                        // return 
                    // })
                })
        });
    });
};
//add role
function addRole() {
    dbConnect.query('SELECT department.name FROM department',(err, res)=>{
        if(err) throw err;
        // console.log(res)
        var departments =res.map(department => department.name);
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
            choices: departments
        }
    ])
    .then((response)=>{
        console.log(response)
    })
 });
}

function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the new department?",
            name: "newDepartment"
        }])
        .then((response) => {
        //INSERT NEW DEPT TO DB
            // add response.newDepartment to database
        })

}
//UPDATE THE TABLE W INFO
function updateEmployeeRole() {
    dbConnect.query("SELECT CONCAT(employee.first_name,' ',employee.last_name) AS Name FROM employee", (err, res)=>{
        if (err) throw err;
       var employeeList = res.map(employees=> employees.Name)
       console.log(employeeList)
  
    inquirer.prompt([
        {
            type: "list",
            message: "Which employees role do you want to update?",
            name: "roleUpdate",
            choices: employeeList
        },
        {
            type: "list",
            message: "Which role do you want to assign to this selected employee?",
            name: "newSalary"
        }
        //updated employees role
    ]).then((response)=>{
        console.log(response.roleUpdate, response.newSalary)
    })
});
}
init();
