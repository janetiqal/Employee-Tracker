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

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Elton", "John", 1),
("Celine", "Dion", 2),
("Kanye", "West", 3),
("Alabama", "Shakes",4),
("Taylor", "Swift", 5),
("Leon", "Bridges", 6),
("Noah","Cyrus", 7),
("Carole", "King", 8),
("Nina", "Simone",9),
("Dua", "Lipa", 10),
("Frank", "Ocean",11);

--Choosing Managers based on employee id rather then hard coding, in case the employee gets fired/removed from DATABASE
-- want every dept to have a manager
UPDATE employee SET manager_id = 1 WHERE id = 2; 

UPDATE employee SET manager_id = 3 WHERE id = 4; 
UPDATE employee SET manager_id = 3 WHERE id = 5; 
UPDATE employee SET manager_id = 7 WHERE id = 6; 
UPDATE employee SET manager_id = 8 WHERE id = 9; 
UPDATE employee SET manager_id = 10 WHERE id = 11; 












