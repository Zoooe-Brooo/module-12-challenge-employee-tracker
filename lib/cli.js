const inquirer = require('inquirer');

const Enployee = require('./employee');
const Role = require('./role');
const Department = require('./department');

const employee = new Enployee();
const role = new Role();
const department = new Department();

const question = [
  {
    type: 'list',
    name: 'choices',
    message: 'What would you like to do?',
    choices: [ 
      'View All Departments',
      'View All Roles', 
      'View All Employees', 
      'Add Department',
      'Add Role', 
      'Add Employee', 
      'Update Employee Role',
      'Quit'
    ],
  },
];

class CLI {
  run() {
    inquirer
    .prompt(question)
    .then(answer => {
      switch (answer.choices) {
        case 'View All Departments':
          department.viewAllDepartments();
          break;
        case 'View All Roles':
          role.viewAllRoles();
          break;
        case 'View All Employees':
          employee.viewAllEmployees();
          break;
        case 'Add Department':
          department.addDepartment();
          break;
        case 'Add Role':
          role.addRole();
          break;
        case 'Add Employee':
          employee.addEmployee();
          break;
        case 'Update Employee Role':
          employee.updateEmployeeRole();
          break;
        case 'Quit':
          process.exit();
      }
    })
  };
}

module.exports = CLI;