INSERT INTO departments (department_name)
VALUES ('Sales'),
       ('Engineering'),
       ('Finance'),
       ('Marketing');

-- Role seeds
INSERT INTO roles (title, salary, department_id)
VALUES ('Sales Lead', 100000, 1),
       ('Salesperson', 80000, 1),
       ('Lead Engineer', 150000, 2),
       ('Software Engineer', 120000, 2),
       ('Accountant', 125000, 3),
       ('Marketing Manager', 110000, 4),
       ('Marketing Coordinator', 90000, 4);

-- Employee seeds
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, NULL),
       ('Jane', 'Smith', 2, 1),
       ('Bob', 'Johnson', 3, NULL),
       ('Alice', 'Williams', 4, 3),
       ('Tom', 'Brown', 5, NULL),
       ('Sara', 'Davis', 6, NULL),
       ('Mike', 'Wilson', 7, 6);