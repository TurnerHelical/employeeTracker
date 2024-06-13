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
                'INSERT INTO departments (department_name) VALUES ($1)',
                [answer.departmentName],
                (err, res) => {
                    if (err) throw err;
                    console.log(`Added ${answer.departmentName} to the database.`);
                    promptUser();
                }
            );
        });
}
function addRole() {
    const departmentQuery = 'SELECT * FROM departments';
    client.query(departmentQuery, (err, res) => {
        if (err) throw err;
        const departments = res.rows.map((department) => ({
            name: department.department_name,
            value: department.id,
        }));

        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: 'Enter the title of the role:',
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'Enter the salary for the role:',
                },
                {
                    type: 'list',
                    name: 'department',
                    message: 'Select the department for the role:',
                    choices: departments,
                },
            ])
            .then((answers) => {
                const { title, salary, department } = answers;
                const query = 'INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)';
                client.query(query, [title, salary, department], (err, res) => {
                    if (err) throw err;
                    console.log(`Added ${title} role to the database.`);
                    promptUser();
                });
            });
    });
}

function addEmployee() {
    const roleQuery = 'SELECT * FROM roles';
    const employeeQuery = 'SELECT * FROM employees';

    client.query(roleQuery, (err, res) => {
        if (err) throw err;
        const roles = res.rows.map((role) => ({
            name: role.title,
            value: role.id,
        }));

        client.query(employeeQuery, (err, res) => {
            if (err) throw err;
            const employees = res.rows.map((employee) => ({
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
            }));
            employees.unshift({ name: 'None', value: null });

            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'firstName',
                        message: "Enter the employee's first name:",
                    },
                    {
                        type: 'input',
                        name: 'lastName',
                        message: "Enter the employee's last name:",
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: "Select the employee's role:",
                        choices: roles,
                    },
                    {
                        type: 'list',
                        name: 'manager',
                        message: "Select the employee's manager:",
                        choices: employees,
                    },
                ])
                .then((answers) => {
                    const { firstName, lastName, role, manager } = answers;
                    const query = 'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)';
                    client.query(query, [firstName, lastName, role, manager], (err, res) => {
                        if (err) throw err;
                        console.log(`Added ${firstName} ${lastName} to the database.`);
                        promptUser();
                    });
                });
        });
    });
}

function updateEmployeeRole() {
    const employeeQuery = 'SELECT * FROM employees';
    const roleQuery = 'SELECT * FROM roles';

    client.query(employeeQuery, (err, res) => {
        if (err) throw err;
        const employees = res.rows.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
        }));

        client.query(roleQuery, (err, res) => {
            if (err) throw err;
            const roles = res.rows.map((role) => ({
                name: role.title,
                value: role.id,
            }));

            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'employee',
                        message: 'Select the employee to update:',
                        choices: employees,
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: "Select the employee's new role:",
                        choices: roles,
                    },
                ])
                .then((answers) => {
                    const { employee, role } = answers;
                    const query = 'UPDATE employees SET role_id = $1 WHERE id = $2';
                    client.query(query, [role, employee], (err, res) => {
                        if (err) throw err;
                        console.log('Employee role updated successfully.');
                        promptUser();
                    });
                });
        });
    });
}

function promptUser() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'What would you like to do?',
                choices: [
                    'View all departments',
                    'View all roles',
                    'View all employees',
                    'Add a department',
                    'Add a role',
                    'Add an employee',
                    'Update an employee role',
                    'Exit',
                ],
            },
        ])
        .then((answer) => {
            switch (answer.choice) {
                case 'View all departments':
                    viewAllDepartments();
                    break;
                case 'View all roles':
                    viewAllRoles();
                    break;
                case 'View all employees':
                    viewAllEmployees();
                    break;
                case 'Add a department':
                    addDepartment();
                    break;
                case 'Add a role':
                    addRole();
                    break;
                case 'Add an employee':
                    addEmployee();
                    break;
                case 'Update an employee role':
                    updateEmployeeRole();
                    break;
                case 'Exit':
                    client.end();
                    break;
                default:
                    break;
            }
        });
}

promptUser();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
