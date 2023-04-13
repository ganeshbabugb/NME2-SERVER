const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config({
  path: "./.env",
});

const app = express();
app.use(express.json());
app.use(cors());

// SET UP MySQL DATABASE CONNECTION
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE,
});

// CONNECT TO MySQL
db.connect((err) => {
  if (err) {
    console.error("Error connecting to database: " + err.stack);
    return;
  }
  console.log("Connected to database");
});

//PERFECT WORKING
app.get("/api/unaided-courses", (req, res) => {
  // Execute the SQL query
  const query = `
    SELECT label, value
    FROM unaided_courses
    WHERE register_count < 60;
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal server error");
    } else {
      // Send the results as JSON
      res.json(results);
    }
  });
});

//PERFECT WORKING
app.get("/api/aided-courses", (req, res) => {
  // Execute the SQL query
  const query = `
    SELECT label, value
    FROM aided_courses
    WHERE register_count < 60;
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal server error");
    } else {
      // Send the results as JSON
      res.json(results);
    }
  });
});

// PERFECTLY WORKING
// Register API
app.post("/api/register", (req, res) => {
  const { name, register_id, email_id, password } = req.body;
  // Check if user already exists
  db.query(
    "SELECT * FROM register WHERE register_id = ?",
    [register_id],
    (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        res.status(409).send("USER ALREADY EXISTS");
      } else {
        // Insert user into database
        db.query(
          "INSERT INTO register (name, register_id, email_id, password) VALUES (?, ?, ?, ?)",
          [name, register_id, email_id, password],
          (err, result) => {
            if (err) throw err;
            res.send("USER REGISTERED SUCCESSFULLY");
          }
        );
      }
    }
  );
});

//PERFECT WORKING
app.post("/api/login", (req, res) => {
  const { register_id, password } = req.body;
  const sql = `SELECT * FROM register WHERE register_id='${register_id}'`;
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("ERROR LOGGING IN");
    } else if (results.length === 0) {
      res.status(401).send("REGISTER ID NOT FOUND");
    } else if (results[0].password !== password) {
      res.status(401).send("INVALID PASSWORD");
    } else {
      res.send(results[0]);
    }
  });
});

//REGISTER API
app.post("/api/register-course", (req, res) => {
  const {
    register_id,
    name,
    email_id,
    course,
    course_selected,
    department,
    phone_no,
  } = req.body;

  // Execute the SQL query to select the user with the given email
  const selectQuery = `
    SELECT register_id FROM register WHERE email_id = ?;
  `;
  db.query(selectQuery, [email_id], (err, selectResults) => {
    if (err) {
      console.error(err);
      res.status(500).send("INTERNAL SERVER ERROR");
    } else if (selectResults.length > 0) {
      // User does exist, check if user is already registered in the `student_details` table using `register_id`
      const userExistsQuery = `
        SELECT * FROM student_details WHERE register_id = ?;
      `;
      db.query(userExistsQuery, [register_id], (err, userExistsResults) => {
        if (err) {
          console.error(err);
          res.status(500).send("INTERNAL SERVER ERROR");
        } else if (userExistsResults.length > 0) {
          res.status(400).send("USER ALREADY REGISTERED FOR A COURSE");
        } else {
          // User does not exist in `student_details` table, insert the user into the table and update the register count for the course
          const userQuery =
            "INSERT INTO student_details (register_id, name, email_id, course, course_selected, department, phone_no) VALUES (?, ?, ?, ?, ?, ?, ?)";
          const userValues = [
            register_id,
            name,
            email_id,
            course,
            course_selected,
            department,
            phone_no,
          ];
          db.query(userQuery, userValues, (err, userResults) => {
            if (err) {
              console.error(err);
              res.status(500).send("INTERNAL SERVER ERROR");
            } else {
              const courseQuery = `
                UPDATE ${course}_courses
                SET register_count = register_count + 1, available_seats = available_seats - 1
                WHERE value = ?
                  AND register_count < 60
                  AND available_seats > 0;
              `;
              db.query(courseQuery, [course_selected], (err, courseResults) => {
                if (err) {
                  console.error(err);
                  res.status(500).send("INTERNAL SERVER ERROR");
                } else if (courseResults.affectedRows === 0) {
                  res.status(403).send("COURSE IS FULL");
                } else {
                  res.send("COURSE REGISTERED SUCCESSFULLY");
                }
              });
            }
          });
        }
      });
    } else {
      res.status(400).send("USER NOT FOUND");
    }
  });
});

// API endpoint to retrieve all student details
app.get("/student-details", (req, res) => {
  const selectQuery = `
    SELECT * FROM student_details;
  `;
  db.query(selectQuery, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("INTERNAL SERVER ERROR");
    } else {
      res.send(results);
    }
  });
});

//Working
app.get("/aided-courses", (req, res) => {
  const sql = `SELECT id, value, register_count, available_seats FROM aided_courses`;
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.get("/unaided-courses", (req, res) => {
  const sql = `SELECT id, value, register_count, available_seats FROM unaided_courses`;
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.get("/details", (req, res) => {
  const sql = `SELECT id, name, register_id, email_id, password FROM register`;
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
