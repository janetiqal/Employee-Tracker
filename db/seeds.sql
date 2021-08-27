INSERT INTO department (name)
VALUES ("Sales"),
("Engineering"),
("Legal"),
("Finance"),
("IT Support");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 90000, 1),
("Sales Person", 75000, 1),

("Lead Engineer", 110000, 2),
("Software Engineer", 100000, 2),
("Junior Engineer", 70000, 2),

("Lawyer", 95000, 3),
("Legal Team Lead", 120000, 3),

("Account Management", 120000, 4),
("Accountant", 80000, 4),

("IT Lead", 80000, 5),
("IT Specialist", 75000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Elton", "John", 1, NULL),
("Celine", "Dion", 2, NULL),
("Kanye", "West", 3, NULL),
("Alabama", "Shakes",4, NULL),
("Taylor", "Swift", 5, NULL),
("Leon", "Bridges", 6, NULL),
("Noah","Cyrus", 7, NULL),
("Carole", "King", 8, NULL),
("Nina", "Simone",9, NULL),
("Dua", "Lipa", 10, NULL),
("Frank", "Ocean",11, NULL);

--MANAGERS NOT WORKING OUT THEY WAY I NEED IT TO

--Choosing Managers based on employee id rather then hard coding, in case the employee gets fired/removed from DATABASE
-- -- -- want every dept to have a manager
-- UPDATE employee SET manager_id = 1 WHERE id = 1; ELTON manages dion
-- UPDATE employee SET manager_id = 2 WHERE id = 3; WEST manages shakes, swift
-- UPDATE employee SET manager_id = 3 WHERE id = 7; CYRUS manages bridges
-- UPDATE employee SET manager_id = 4 WHERE id = 8; KING manages simone
-- UPDATE employee SET manager_id = 5 WHERE id = 8; LIPA manages ocean











