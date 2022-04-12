const express = require('express');
const inquirer = require('inquirer');
const cTable = require("console.table");
// Import and require mysql2
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // TODO: Add MySQL password here
    password: 'admin',
    database: 'employees_db'
  },
  console.log(`Database Connected! 🚀`)
);

// inquirer.prompt
function startApp() {
  inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'What would you like to do?',
      choices: [
        'View All Employees',
        'View All Roles',
        'View All Departments',
        'Update Employee Role',
        'Add Employee',
        'Add Role',
        'Add Department',
        'Remove Employee',
        'Remove Role',
        'Remove Department',
        'Exit'
        ]
    }
  ])
  .then((answers) => {
      selectedOption(answers.choice);
  })
  .catch((err) => {
    console.log(err);
  })
}

function selectedOption(chosen) {
  switch (chosen) {
      case "View All Departments":
          viewAllDepartments();
          break;
      case "View All Roles":
          viewAllRoles();
          break;
      case "View All Employees":
          viewAllEmployees();
          break;
      case "Add Department":
          addDepartment();
          break;
      case "Add Role":
          addRole();
          break;
      case "Add Employee":
          addEmployee();
          break;
      case "Update Employee Role":
          updateEmployee();
          break;
      case "Remove Department":
          removeDepartment();
          break;
      case "Remove Role":
          removeRole();
          break;
      case "Remove Employee":
          removeEmployee();
          break;
      case "Exit":
          console.log("Exited employee tracker.");
          break;
  }
}

// ------------------ VIEW ------------------ //

function viewAllDepartments() {
  db.query("SELECT * FROM department", function (err, res) {
      console.table(res);
      startApp();
  });
}

function viewAllRoles() {
  db.query("SELECT * FROM role", function (err, res) {
      console.table(res);
      startApp();
  });
}

function viewAllEmployees() {
  db.query("SELECT * FROM employee", function (err, res) {
    console.table(res);
      startApp();
  });
}

// ------------------ ADD ------------------ //

function addEmployee() {
  inquirer.prompt([
      {
        name: "firstName",
        type: "input",
        message: "What's the employee's first name?",
      },
      {
        name: "lastName",
        type: "input",
        message: "What's the employee's last name?",
      },
    ])
    .then((answers) => {
      db.query("SELECT * FROM role", function (err, res) {
        const roles = res.map(({ id, title }) => ({
          name: title,
          value: id,
        }));
        inquirer.prompt({
            type: "list",
            name: "id",
            message: "What is the employee's role?",
            choices: roles,
          })
          .then((role) => {
            db.query(
              "SELECT * FROM employee where manager_id is null",
              function (err, res) {
                const managers = res.map(({ id, last_name }) => ({
                  name: last_name,
                  value: id,
                }));
                inquirer.prompt({
                    type: "list",
                    name: "id",
                    message: "What is the manager's name?",
                    choices: managers,
                  })
                  .then((manager) => {
                    db.query(
                      "INSERT INTO employee(first_name, last_name, role_id, manager_id) values(?,?,?,?)",
                      [answers.firstName, answers.lastName, role.id, manager.id]
                    );
                    startApp();
                  });
              }
            );
          });
      });
    });
}

function addRole() {
  inquirer.prompt([
      {
        name: "title",
        type: "input",
        message: "What is the role's title?",
      },
      {
        name: "salary",
        type: "input",
        message: "What is this role's salary?",
      },
    ])
    .then((answers) => {
      db.query("SELECT * FROM role", function (err, res) {
        const departments = res.map(({ id, department_id }) => ({
          name: department_id,
          value: id,
        }));
        inquirer.prompt({
            type: "list",
            name: "id",
            message: "What is the department id for this role?",
            choices: departments,
          })
          .then((department) => {
            db.query(
              "INSERT INTO role(title, salary, department_id) values(?,?,?)",
              [answers.title, parseInt(answers.salary), department.id]
            );
            startApp();
          });
      });
    });
}

function addDepartment() {
  inquirer.prompt([
      {
        name: "name",
        type: "input",
        message: "What department would you like to add?",
      },
    ])
    .then((answers) => {
      db.query("INSERT INTO department(name) values(?)", [answers.name]);

      startApp();
    });
}

// ------------------ REMOVE ------------------ //

function removeEmployee() {
  db.query("SELECT * FROM employee", function (err, res) {
    console.table(res);
    const employee = res.map(({ id }) => ({
      name: id,
    }));
    inquirer.prompt({
        name: "id",
        type: "list",
        message: "Which employee would you like to delete?",
        choices: employee,
      })
      .then((employee) => {
        db.query("DELETE from employee WHERE id = ?", [employee.id]);
        startApp();
      });
  });
}

function removeRole() {
  db.query("SELECT * FROM role", function (err, res) {
    console.table(res);
    const role = res.map(({ id }) => ({
      name: id,
    }));
    inquirer.prompt({
        name: "id",
        type: "list",
        message: "Which role would you like to delete?",
        choices: role,
      })
      .then((role) => {
        db.query("DELETE from role WHERE id = ?", [role.id]);
        startApp();
      });
  });
}

function removeDepartment() {
  db.query("SELECT * FROM department", function (err, res) {
    console.table(res);
    const department = res.map(({ id }) => ({
      name: id,
    }));
    inquirer.prompt({
        name: "id",
        type: "list",
        message: "Which department would you like to delete?",
        choices: department,
      })
      .then((department) => {
        db.query("DELETE from department WHERE id = ?", [department.id]);
        startApp();
      });
  });
}

// ------------------ UPDATE ------------------ //

function updateEmployee() {
  db.query("SELECT * FROM employee", function (err, res) {
    console.table(res);
    const employee = res.map(({ id }) => ({
      name: id,
    }));
    inquirer.prompt({
        name: "id",
        type: "list",
        message: "Which employee would you like to update?",
        choices: employee,
      })
      .then((employee) => {
        db.query("SELECT * FROM role", function (err, res) {
          const role = res.map(({ id, role_id }) => ({
            name: role_id,
            value: id,
          }));
          inquirer.prompt({
              name: "id",
              type: "list",
              message: "Please enter the employye's new role id.",
              choices: role,
            })
            .then((role) => {
              db.query("UPDATE employee SET role_id = ? WHERE id = ?", [
                role.id,
                employee.id,
              ]);
              db.query("SELECT * FROM employee", (err, res) => {
                console.table(res);
                startApp();
              });
            });
        });
      });
  });
}

startApp();