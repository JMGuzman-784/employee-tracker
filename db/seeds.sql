INSERT INTO department (name)
VALUES
("Managment"),
("Sales"),
("Accounting"),
("Human Resources"),
("Customer Service"),
("Administration");

SELECT * FROM employees_db.department;

INSERT INTO role (title, salary, department_id)
VALUES
("Branch Manager", 110000, 1),
("Co-Manager", 100000, 1),
("Salesperson", 80000, 2),
("Head of Accounting", 120000, 3),
("Accountant", 100000, 3),
("Human Resources Representative", 90000, 4),
("Customer Service Specialist", 80000, 5),
("Receptionist", 70000, 6);

SELECT * FROM employees_db.role;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
("Michael", "Scott", 1, NULL),
("Jim", "Halpert", 2, NULL),
("Angela", "Martin",  4, NULL),
("Toby", "Flenderson", 6, NULL),
("Pam", "Beesly", 1, 3),
("Kelly", "Kapoor", 2, 7),
("Erin", "Hannon", 1, 8),
("Stanley", "Hudson", 1, 3);

SELECT * FROM employees_db.employee;