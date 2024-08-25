const inquirer = require('inquirer');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  database: 'employee_db',
  password: 'Password25355',
});

pool.connect();

class Role {
  viewAllRoles() {
    const query = 
    `SELECT role.id, 
     role.title, 
     department.name AS department, 
     role.salary
     FROM role JOIN department ON role.department_id = department.id;`;
    pool.query(query, function(err, {rows}){
      if (err) throw err;
      console.table(rows);
    });
  }

  addRole() {
    const query = `SELECT id, name FROM department;`;

    pool.query(query, function(err, { rows }) {
      if (err) throw err;

      const departmentChoices = rows.map(row => ({
        name: row.name,
        value: row.id
      }
      ));

      const question = [
        {
          type: 'input',
          name: 'name',
          message: 'What is the name of the role?',
        },
        {
          type: 'input',
          name: 'salary',
          message: 'What is the salary of the role?'
        },
        {
          type: 'list',
          name: 'department',
          message: 'Which department does the role belong to?',
          choices: departmentChoices
        }
      ];
            
      inquirer
      .prompt(question)
      .then(answer => {
        const { name, salary } = answer;
        const department_id = answer.department;
        const insertQuery = 
        `INSERT INTO role (title, salary, department_id) 
         VALUES ('${name}', '${salary}', '${department_id}');`;
        pool.query(insertQuery, function(err) {
          if (err) throw err;
          console.log(`Added ${name} to the database`);
        });
      });
    });
  };  
}

module.exports = Role;
