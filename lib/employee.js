const inquirer = require('inquirer');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  database: 'employee_db',
  password: 'Password25355',
});

pool.connect();

class Employee {
  viewAllEmployees() {
    const query =
    `SELECT employee.id, 
     employee.first_name, 
     employee.last_name, 
     role.title AS title, 
     department.name AS department, 
     role.salary, 
     CONCAT(manager.first_name, ' ', manager.last_name) AS manager
     FROM employee 
     JOIN role ON employee.role_id = role.id 
     JOIN department ON role.department_id = department.id
     LEFT JOIN employee AS manager ON employee.manager_id = manager.id;`;
    pool.query(query, function(err, {rows}){
      if (err) throw err;
      console.table(rows);
    });
  }

  addEmployee() {
    const query = 
    `SELECT role.id, 
     role.title, 
     CONCAT(manager.first_name, ' ', manager.last_name) AS manager,
     manager.id AS manager_id
     FROM role
     LEFT JOIN employee AS manager ON role.id = manager.role_id;`;

    pool.query(query, function(err, { rows }) {
      if (err) throw err;

      const roleChoices = rows.map(row => ({
        name: row.title,
        value: row.id
      }));

      const managerChoices = rows.map(row => ({
        name: row.manager,
        value: row.manager_id
      }));

      const question = [
        {
          type: 'input',
          name: 'firstName',
          message: 'What is the first name of employee?',
        },
        {
          type: 'input',
          name: 'lastName',
          message: 'What is the last name of employee?',
        },
        {
          type: 'list',
          name: 'role',
          message: 'What is the role of employee?',
          choices: roleChoices
        },
        {
          type: 'list',
          name: 'manager',
          message: 'Who is the manager of employee?',
          choices: managerChoices
        }
      ];

      inquirer
      .prompt(question)
      .then(answer => {
        const role_id = answer.role;
        const manager_id = answer.manager;
        const insertQuery = 
        `INSERT INTO employee (first_name, last_name, role_id, manager_id) 
         VALUES ('${answer.firstName}', '${answer.lastName}', '${role_id}', '${manager_id}');`;
        pool.query(insertQuery);
          console.log(`Added ${answer.firstName} ${answer.lastName} to the database`);
      });
    });
  }

  updateEmployeeRole() {
    const query = 
    `SELECT role.id, 
     role.title, 
     CONCAT(employee.first_name, ' ', employee.last_name) AS name
     FROM role
     JOIN employee ON role.id = employee.role_id;`;

    pool.query(query, function(err, { rows }) {
      if (err) throw err;
      
      const employeeChoices = rows.map(row => ({
        name: row.name,
      }));

      const roleChoices = rows.map(row => ({
        name: row.title,
        value: row.id
      }));

      const question = [
        {
          type: 'list',
          name: 'name',
          message: 'Which employee would you like to update?',
          choices: employeeChoices
        },
        {
          type: 'list',
          name: 'role',
          message: 'What is the new role of employee?',
          choices: roleChoices
        }
      ];

      inquirer
      .prompt(question)
      .then(answer => {
        const name = answer.name;
        const role = answer.role;
        const [firstName, lastName] = name.toString().split(' ');

        const insertQuery = 
        `UPDATE employee
         SET role_id = $1
         WHERE first_name = $2 AND last_name = $3;`;

        pool.query(insertQuery, [role, firstName, lastName], (err) => {
          if (err) {
            console.error("Error updating employee role:", err);
            return;
          }

          console.log(`Updated the role for ${name}.`);
        });
      });
    });
  }
}

module.exports = Employee;
