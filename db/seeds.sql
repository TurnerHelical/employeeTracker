INSERT INTO departments (department_name)
VALUES ('HR'),('Management'),('Finance'),('Customer Service');

INSERT INTO roles (title, salary, department_id )
VALUES  ('HR Manager', 100000.00, 2),
        ('CEO', 250000.00, 2),
        ('CFO', 150000.00, 2),
        ('Employee Rep', 75000.00, 1),
        ('Accountant', 85000.00, 3),
        ('Representative', 45000.00, 4);
