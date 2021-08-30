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
                default: console.log("Nothing Else")
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
        init();
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
        init();
    })

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
        init();
    })
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

        dbConnect.query("Select CONCAT(employee.first_name, ' ' ,employee.last_name) AS Manager FROM employee WHERE employee.manager_id IS null", (err, res) => {
            if (err) throw err;
            console.log("manager",res)
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
                    // console.log(response.firstName, response.lastName, response.role, response.manager)
                    dbConnect.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?), (?), (SELECT id FROM role WHERE title = (?)), (SELECT id FROM (SELECT id FROM employee WHERE first_name = (?) AND last_name = (?))) AS mangerID))'),
                        [response.firstName, response.lastName, response.role, response.manager], (err, res) => {
                            if (err) {
                                console.log("Error adding EMPLOYEE to database")
                            } else {
                                console.log("Employee Added")
                                init();
                            }
                        }
                })
        });
    });
};
//add role
function addRole() {
    dbConnect.query('SELECT department.name FROM department', (err, res) => {
        if (err) throw err;
        // console.log(res)
        var departments = res.map(department => department.name);
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
            //QUERY IS NOT WORKING
            // TROUBLE connecting the dept id in department table to the department_id in role table
            .then((response) => {
                console.log(response.newRole, response.newSalary, response.designatedDepartment)
                dbConnect.query('INSERT INTO role (title, salary, department_id) VALUES ?,?, (SELECT id FROM department RIGHT JOIN role ON role.department_id = department.id)', [response.newRole, response.newSalary, response.designatedDepartment], (err, res) => {
                    if (err) {
                        console.log("Error adding ROLE to database", err)
                    } else {
                        console.log("New Role Added")
                        init();
                    }
                })

            })
    });
}
//Adds A Department to the DB
//DONE
function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the new department?",
            name: "newDepartment"
        }])
        .then((response) => {
            console.log("New Dept", response.newDepartment)
            dbConnect.query('INSERT INTO department (name) VALUES (?)', response.newDepartment, (err, res) => {
                if (err) {
                    console.log("Error with adding new Department", err)
                } else {
                    console.log("New Department Added")
                }
            })
        })
}
//Updates an Employee's role. DONE
function updateEmployeeRole() {
    dbConnect.query("SELECT employee.id, CONCAT(employee.first_name,' ',employee.last_name) AS Name FROM employee", (err, res) => {
        if (err) throw err;
        var employeeList = res.map(employees =>{
         //data normalization: displays employee names but returns employee ID so easier sql statement to update data
         return {name: employees.Name, value:employees.id}
        })
        console.log(employeeList)

        dbConnect.query("SELECT role.id, role.title FROM role", (err, res) => {
            if (err) throw err;
            console.log(res)
            var roles = res.map(newRole => {
                //data normalization: displays role titles but returns role ID so easier sql statement to update data
                return {name: newRole.title, value: newRole.id }
            })
            console.log("roles",roles)

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
                name: "newRole",
                choices: roles
            }
        ]).then((response) => {
            console.log(response.roleUpdate, response.newRole)
            dbConnect.query('UPDATE employee SET employee.role_id=(?) WHERE employee.id= (?)', [response.newRole, response.roleUpdate], (err,res)=>{
                if (err){
                    console.log("Error updating role.", err)
                }else{
                    console.log("The employee's role has been updated.")
                    init();
                }
            })
        })
    });
});
}
init();
