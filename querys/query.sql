-- Create the table for storing user registration data
CREATE TABLE register (
  id INT PRIMARY KEY AUTO_INCREMENT,
  register_id VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(50) NOT NULL UNIQUE,
  email_id VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the table for storing student details
CREATE TABLE student_details (
  id INT PRIMARY KEY AUTO_INCREMENT,
  register_id VARCHAR(50) NOT NULL,
  name VARCHAR(50) NOT NULL,
  email_id VARCHAR(50) NOT NULL,
  course VARCHAR(50) NOT NULL,
  course_selected VARCHAR(50) NOT NULL,
  department VARCHAR(50) NOT NULL,
  phone_no VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the table for storing available unaided courses 
CREATE TABLE unaided_courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  label VARCHAR(255) NOT NULL,
  value VARCHAR(255) NOT NULL,
  register_count INT NOT NULL DEFAULT 0,
  available_seats INT NOT NULL DEFAULT 60
);

-- Create the table for storing available aided courses 
CREATE TABLE aided_courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  label VARCHAR(255) NOT NULL,
  value VARCHAR(255) NOT NULL,
  register_count INT NOT NULL DEFAULT 0,
  available_seats INT NOT NULL DEFAULT 60
);

INSERT INTO aided_courses (label, value) VALUES
  ("English - Corporate English", "English"),
  ("History - History for Competitive Examinations", "History"),
  ("Mathematics - Mathematics for Data Science", "Mathematics"),
  ("Physics - Physics in Everyday Life", "Physics"),
  ("Chemistry - Water Management an Environmental Perspective", "Chemistry"),
  ("Botany - Ornamental Horticulture", "Botany"),
  ("Zoology - Wild Life Diversity and Conservation", "Zoology"),
  ("Nutrition And Dietetics - Basic Cookery", "Nutrition And Dietetics"),
  ("Computer Science - Data Processing through Excel Lab", "Computer Science"),
  ("Commerce - Fundamentals of Accounting", "Commerce"
);

INSERT INTO unaided_courses (label, value)
VALUES
  ("Tamil - Pechukkalai", "Tamil"),
  ("English - Corporate English", "English"),
  ("Mathematics - Mathematics for Data Science", "Mathematics"),
  ("Physics - Physics in Everyday Life", "Physics"),
  ("Computer Science - Data Processing through Excel Lab", "Computer Science"),
  ("Computer Applications - Data Processing through Excel Lab", "Computer Applications"),
  ("Information Technology - Data Processing through Excel Lab", "Information Technology"),
  ("Computer Technology - Data Processing through Excel Lab", "Computer Technology"),
  ("Computer Science with Data Analytics - Data Processing through Excel Lab", "Computer Science with Data Analytics"),
  ("Commerce - Fundamentals of Accounting", "Commerce"),
  ("Commerce [CA] - Occupational Health and Safety Measures", "Commerce [CA]"),
  ("Commerce [E-Commerce] - Brand Management", "Commerce [E-Commerce]"),
  ("Commerce [CS] - Modern Retail Techniques", "Commerce [CS]"),
  ("Commerce [PA] - Cyber Law", "Commerce [PA]"),
  ("Commerce [A&F] - Production Management", "Commerce [A&F]"),
  ("Commerce [B&I] - Banking Practice", "Commerce [B&I]"),
  ("Commerce [Cooperation] - Dynamics of Cooperation", "Commerce [Cooperation]"),
  ("Business Administration [CA] - Soft Skill Development", "Business Administration [CA]"),
  ("Biochemistry - Health & Hygiene", "Biochemistry"),
  ("Costume Design & Fashion - Fashion Concepts", "Costume Design & Fashion"),
  ("Geography - Climate Change and Global Warming", "Geography"
);
