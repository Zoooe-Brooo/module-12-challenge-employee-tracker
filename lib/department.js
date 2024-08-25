const inquirer = require('inquirer');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  database: 'employee_db',
  password: 'Password25355',
});

pool.connect();

class Department {
  viewAllDepartments(){
    const query = `SELECT * FROM department;`;
    pool.query(query, function(err, {rows}){
      if (err) throw err;
      console.table(rows);
    });
  };

  addDepartment(){
    inquirer
    .prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of department?',
      }
    ])
    .then(answer => {
      const query = 
      `INSERT INTO department (name) 
       VALUES ('${answer.name}');`;
      pool.query(query);
      console.log(`Added ${answer.name} to the database`);
    });  
  }
}
  
module.exports = Department;