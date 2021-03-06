const inquirer = require("inquirer");
const consoleTable = require("console.table");
const mysql = require("mysql2");
require("dotenv").config();
const dbConnect = require("./config/connection")
const chalkAnimation = require('chalk-animation');
const rainbow = chalkAnimation.rainbow
const pulse = chalkAnimation.pulse
const figlet = require('figlet');
const { parse } = require("dotenv");

//Banner 
figlet.text("Employee Tracker", {
    horizontalLayout: "Standard",
    width: 80,
    whitespaceBreak: true,
}, (err, res) => {
    if (err) throw err;
    console.log(res)
    init();
})



function init() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "optionsStart",
            choices: ["View all Employees", "Add Employee", "Update Employees Role", "View All Roles", "Add Role", "View all Departments", "View Budgets by Departments", "Add Department", "View Employees By Manager", "View Employees by Department", "Exit Program"]
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
                case "View Budgets by Departments":
                    viewDepartmentBudgets();
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
                case "View Employees By Manager":
                    viewEmployeesByManager();
                    break;
                case "View Employees by Department":
                    viewEmployeesByDepartment();
                    break;
                case "Exit Program":
                    endprogram();
                    break;
                default: console.log(`End of ${response.optionsStart}`)

            }
        })
};
//Table View of Employees: Includes id, first & last name, title, department, salary, and manager.

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
function addEmployee() {
    //put the Db query here to give the function some time to render the results from the query
    dbConnect.query('Select role.id, role.title FROM role', (err, res) => {
        if (err) throw err;
        // console.log(res)
        //data normalization: displays role names but returns the value of role id so easier sql statement to update data
        var roleTitle = res.map(role => {
            return { name: role.title, value: role.id }
        })
        dbConnect.query("Select employee.id,CONCAT(employee.first_name, ' ' ,employee.last_name) AS Manager FROM employee WHERE employee.manager_id IS NULL ", (err, res) => {
            if (err) throw err;
            var manager = res.map(managerName => {
                return { name: managerName.Manager, value: managerName.id }
            })
            //gives the user an option to not assign a manager
            manager.push({ name: "No Manager", value: null })
            inquirer.prompt([
                {
                    type: "input",
                    message: "What is the employee's first name?",
                    name: "firstName",
                    validate: string => string.length > 0 ? true : "You must include a first name."
                },
                {
                    type: "input",
                    message: "What is the employee's last name?",
                    name: "lastName",
                    validate: string => string.length > 0 ? true : "You must include a last name."
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
                    //capitalizing first and last names from user response
                    var firstNameCap = capitalLetter(response.firstName)
                    var lastNameCap = capitalLetter(response.lastName)
                    dbConnect.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ? ,?)',
                        [firstNameCap, lastNameCap, response.role, response.manager], (err, res) => {
                            var fullName = firstNameCap.concat(" ").concat(lastNameCap)
                            if (err) {
                                console.log(`Error adding ${fullName} to database`)
                            } else {
                                console.log(`Employee ${fullName} Added`)
                                init();
                            }
                        })
                })
        });
    });
};
//Adds a New Role to the Role Table in the DB 
function addRole() {
    dbConnect.query('SELECT department.id, department.name FROM department', (err, res) => {
        if (err) throw err;
        //data normalization: displays employee names but returns employee ID so easier sql statement to update data
        var departments = res.map(department => {
            return { name: department.name, value: department.id }
        });
        inquirer.prompt([
            {
                type: "input",
                message: "What is the name of the role?",
                name: "newRole",
                validate: string => string.length > 0 ? true : "You must include a new Role."
            },
            {
                type: "input",
                message: "What is the salary of this new role",
                name: "newSalary",
                //needs a promise per inquirer docs & this resource https://github.com/SBoudrias/Inquirer.js/issues/538
                validate: async (string) => {
                    return new Promise((resolve, reject) => {
                        if (Number.isNaN(parseInt(string))) {
                          reject('Please enter a valid number in this field.');
                        }
                        resolve(true);
                      })
                }
                // validate: async (inputNumber) => {
                //     return /^[\d\.]+$/.test(inputNumber); this worked
                // }
                //this didnt work
                // validate: input => typeof parseInt(input) === 'number' ? true:  'Please enter a valid number.'
            },
            {
                type: "list",
                message: "What department does this role belong to?",
                name: "designatedDepartment",
                choices: departments
            }
        ])
            .then((response) => {
                dbConnect.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [capitalLetter(response.newRole), response.newSalary, response.designatedDepartment], (err, res) => {
                        if (err) {
                            console.log("Error adding ROLE to database", err)
                        } else {
                            rainbow(`New Role: ${response.newRole} added to the database.`)
                            init();
                        }
                    })

            })
    });
}
//Adds A Department to the DB
function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the new department?",
            name: "newDepartment",
            validate: string => string.length > 0 ? true : "You must include a department in this field"
        }])
        .then((response) => {
            dbConnect.query('INSERT INTO department (name) VALUES (?)', capitalLetter(response.newDepartment), (err, res) => {
                if (err) {
                    console.log("Error with adding new Department", err)
                    init();
                } else {
                    rainbow("New Department Added")
                    init();
                }
            })
        })
}
//Updates an Employee's role. 
function updateEmployeeRole() {
    dbConnect.query("SELECT employee.id, CONCAT(employee.first_name,' ',employee.last_name) AS Name FROM employee", (err, res) => {
        if (err) throw err;
        var employeeList = res.map(employees => {
            //data normalization: displays employee names but returns employee ID so easier sql statement to update data
            return { name: employees.Name, value: employees.id }
        })
        // console.log(employeeList)

        dbConnect.query("SELECT role.id, role.title FROM role", (err, res) => {
            if (err) throw err;
            var roles = res.map(newRole => {
                //data normalization: displays role titles but returns role ID so easier sql statement to update data
                return { name: newRole.title, value: newRole.id }
            })
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
                dbConnect.query('UPDATE employee SET employee.role_id=(?) WHERE employee.id= (?)', [response.newRole, response.roleUpdate], (err, res) => {
                    if (err) {
                        console.log("Error updating role.", err)
                    } else {
                        rainbow("The employee's role has been updated.")
                        init();
                    }
                })
            })
        });
    });
}
//Users able to view Employees based on Manager
function viewEmployeesByManager() {
    dbConnect.query('SELECT id, CONCAT(employee.first_name," ", employee.last_name) AS Manager FROM employee WHERE manager_id IS NULL', (err, res) => {
        if (err) throw err
        var manager = res.map(manager => {
            return { name: manager.Manager, value: manager.id }
        })
        inquirer.prompt([
            {
                type: "list",
                name: "managerList",
                message: "Choose the Manager to see the employees they manage.",
                choices: manager
            }
        ])
            .then((response) => {
                dbConnect.query('SELECT CONCAT(employee.first_name," ", employee.last_name) AS Employees FROM employee WHERE manager_id = (?)', response.managerList, (err, results) => {
                    if (err) {
                        console.log(`Error viewing Employees by Manager`, err)
                        init()
                    } if (results.length == 0) {
                        pulse(`This Manager currently does not manage any employees.`)
                        init();
                    }
                    else {
                        console.table(results)
                        init();
                    }
                })
            })
    })
}

//Users able to view Employees by Department
function viewEmployeesByDepartment() {
    dbConnect.query('SELECT id, name FROM department', (err, res) => {
        if (err) throw err
        var departments = res.map(department => {
            return { name: department.name, value: department.id }
        })
        inquirer.prompt([
            {
                type: "list",
                name: "departmentlist",
                message: "Choose the Department to see the employees with in it.",
                choices: departments
            }
        ])
            .then((response) => {
                dbConnect.query('SELECT CONCAT(employee.first_name," ", employee.last_name) AS Employees FROM employee RIGHT JOIN role ON role.id=employee.role_id RIGHT JOIN department ON role.department_id =department.id WHERE role.department_id =(?)', response.departmentlist, (err, results) => {
                    if (err) {
                        console.log(`Error viewing Employees by Department`, err)
                        init()
                    } if (results.length == 0) {
                        pulse(`This Department currently has no employees.`)
                        init();
                    }
                    else {
                        console.table(results)
                        init();
                    }
                })
            })
    })
}
//View Budgets by Department
function viewDepartmentBudgets() {
    dbConnect.query('SELECT id, name FROM department', (err, res) => {
        if (err) throw err;
        var departments = res.map(department => {
            return { name: department.name, value: department.id }
        })

        inquirer.prompt([
            {
                type: "list",
                name: "departmentbudget",
                message: "Choose the Department for which you would like to see the annual budget.",
                choices: departments
            }
        ]).then((response) => {
            dbConnect.query('Select name as Department, SUM(role.salary) as Budget FROM department LEFT JOIN role ON department.id = role.department_id WHERE department.id =(?)', response.departmentbudget, (err, results) => {
                if (err) {
                    console.log(`Error viewing Employees by Department`, err)
                    init()
                } else {
                    console.table(results)
                    init();
                }
            })
        })
    })
}


//End the CLI 
function endprogram() {
    rainbow("Thanks!")
    dbConnect.end();
}
// init();

//capitalizes the first letter of every word inputted 
function capitalLetter(input) {
    const words = input.split(" ")
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].substr(1)
    }
    return words.join(" ")
}