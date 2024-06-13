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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  