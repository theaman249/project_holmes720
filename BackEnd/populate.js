const { Pool, Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  password: 'admin',
  port: 5432
});

(async () => {
    try 
    {
        await client.connect();
    
        // Check if the database already exists
        const result = await client.query(
            `SELECT datname FROM pg_database WHERE datname = 'cos720_db'`
        );
  
        if(result.rows.length > 0) {
            
            // Connect to the newly created or existing database
            const clientNew = new Client({
                user: 'postgres',
                host: 'localhost',
                password: 'admin',
                port: 5432,
                database: 'cos720_db' // Use the correct database name
            });
  
            await clientNew.connect();

            try{                
                await clientNew.query(`
                    INSERT INTO modules VALUES 
                        ('COS151', 'introduction to computer science', 1, 1),
                        ('COS132', 'imperative programming', 1, 1),
                        ('COS110', 'program design: Introduction 110', 1, 2),
                        ('COS212', 'data structures and algorithms', 2, 1),
                        ('COS221', 'introduction to database design', 2, 1),
                        ('COS216', 'netcentric systems', 2, 1),
                        ('COS214', 'software modelling', 2, 2),
                        ('COS332', 'computer networks', 3, 1),
                        ('COS330', 'computer security', 3, 2),
                        ('COS301', 'software engineering', 3, 0),
                        ('COS700', 'research methods and project', 4, 0),
                        ('COS741', 'formal aspects of computing', 4, 1),
                        ('COS720', 'security I', 4, 1),
                        ('COS730', 'software engineering', 4, 1);
                `);

                await clientNew.query(`
                    INSERT INTO students_modules VALUES
                        ('u18105883', 'COS330'),
                        ('u18105883', 'COS301'),
                        ('u18105883', 'COS332');
                `);

                console.log("Data inserted successfully!");
                await clientNew.end();

            }catch(error){
                console.error('Error inserting data:', error);
            }
        }   
        else
        {
            console.log('The database "cos720_db" does not exist.');
            await client.end();
        }
    } 
    catch (error) {
      console.error('Error:', error);
    } finally{
        await client.end();
        process.exit(); // Terminate the Node.js process 
    }
})();
