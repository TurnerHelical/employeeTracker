const inquirer = require('inquirer');
const { Client } = require('pg');

const PORT = process.env.PORT || 3001;

const client = new Client({
  user: 'root',
  host: 'localhost',
  database: 'employee_tracker',
  password: 'root',
});

client.connect();

function viewAllDepartments() {
    // Query the database to retrieve all departments
    client.query('SELECT * FROM departments', (err, res) => {
      if (err) throw err;
      console.table(res.rows);
      promptUser();
    });
  }
  
  function viewAllRoles() {
    // Query the database to retrieve all roles with department information
    client.query(
      'SELECT roles.id, roles.title, roles.salary, departments.name AS department FROM roles JOIN departments ON roles.department_id = departments.id',
      (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        promptUser();
      }
    );
  }
  
  function viewAllEmployees() {
    // Query the database to retrieve all employees with role and manager information
    client.query(
      'SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, CONCAT(managers.first_name, " ", managers.last_name) AS manager FROM employees JOIN roles ON employees.role_id = roles.id JOIN departments ON roles.department_id = departments.id LEFT JOIN employees managers ON employees.manager_id = managers.id',
      (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        promptUser();
      }
    );
  }
  
  function addDepartment() {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'departmentName',
          message: 'Enter the name of the department:',
        },
      ])
      .then((answer) => {
        client.query(
          'INSERT INTO departments (name) VALUES ($1)',
          [answer.departmentName],
          (err, res) => {
            if (err) throw err;
            console.log(`Added ${answer.departmentName} to the database.`);
            promptUser();
          }
        );
      });
  }

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  