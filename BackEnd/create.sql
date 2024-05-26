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
    student_id VARCHAR(9) REFERENCES students(id),
    module_id VARCHAR(6) REFERENCES modules(id),
    CONSTRAINT students_modules_pk PRIMARY KEY(module_id, student_id)
);