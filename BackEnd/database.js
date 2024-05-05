const { Pool, Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  password: 'admin',
  port: 5432
});

(async () => {
  try {
    await client.connect();

    // Check if the database already exists
    const result = await client.query(
      `SELECT datname FROM pg_database WHERE datname = 'cos720_db'`
    );

    if (result.rows.length > 0) {
      console.log('The database "cos720_db" exists.');

      try {
        // Drop tables (if they exist) before reconnecting
        await client.query(`
          DROP TABLE IF EXISTS students;
          DROP TABLE IF EXISTS modules;
          DROP TABLE IF EXISTS students_modules;
        `);
      } catch (error) {
        console.error('Error dropping tables:', error);
        // Handle any errors specifically related to dropping tables
      }

      client.end();
    } else {
      console.log('The database "cos720_db" does not exist.');
      console.log('Creating database cos720_db.....');

      await client.query('CREATE DATABASE cos720_db');

      client.end();
    }

    // Connect to the newly created or existing database
    const clientNew = new Client({
      user: 'postgres',
      host: 'localhost',
      password: 'admin',
      port: 5432,
      database: 'cos720_db' // Use the correct database name
    });

    await clientNew.connect();

    // Create tables with informative error handling
    try {
      await clientNew.query(`
        CREATE TABLE IF NOT EXISTS students (
          id VARCHAR(9) PRIMARY KEY,
          fname VARCHAR(100),
          lname VARCHAR(100),
          email VARCHAR(60),
          password VARCHAR(500),
          year_of_study INT,
          role VARCHAR(15)
        );

        CREATE TABLE IF NOT EXISTS modules(
          id VARCHAR(6) PRIMARY KEY,
          name VARCHAR(500),
          year_of_study INT,
          semester INT
        );

        CREATE TABLE IF NOT EXISTS students_modules(
          student_id VARCHAR(8) REFERENCES students(id),
          module_id VARCHAR(6) REFERENCES modules(id),
          CONSTRAINT students_modules_pk PRIMARY KEY(module_id, student_id)
        );
      `);

      console.log('Tables created successfully.');
    } catch (error) {
      console.error('Error creating tables:', error);
      // Handle any specific errors related to table creation
    }

    // Verification query (optional)
    const results = await clientNew.query('SELECT * FROM students');

    if (results) {
      console.log('Database and tables verified successfully.');
    } else {
      console.log('Database and tables verification unsuccessful.');
    }

    clientNew.end();
  } catch (error) {
    console.error('Error:', error);
  }
})();
