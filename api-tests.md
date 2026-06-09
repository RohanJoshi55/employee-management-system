# Employee Tracker API

Base URL

http://localhost:5000

---

# 1. Get All Employees

Method: GET

URL:

http://localhost:5000/employees

Description:

Returns all employees from MongoDB.

---

# 2. Get Employee By ID

Method: GET

URL:

http://localhost:5000/employees/:id

Example:

http://localhost:5000/employees/686266aa7dbc484a68c835b2f

Description:

Returns a single employee.

Note:
You haven't built this endpoint yet.
We'll add it next.

---

# 3. Create Employee

Method: POST

URL:

http://localhost:5000/employees

Body:

{
  "name": "Lalit",
  "department": "Data Analysis",
  "email": "lalit@test.com",
  "salary": 90000
}

Description:

Creates a new employee.

---

# 4. Update Employee

Method: PUT

URL:

http://localhost:5000/employees/:id

Example:

http://localhost:5000/employees/686266aa7dbc484a68c835b2f

Body:

{
  "name": "Lalit",
  "department": "Data Analysis",
  "email": "lalit@test.com",
  "salary": 100000
}

Description:

Updates the complete employee record.

Important:

PUT expects the entire employee object.

---

# 5. Delete Employee

Method: DELETE

URL:

http://localhost:5000/employees/:id

Example:

http://localhost:5000/employees/686266aa7dbc484a68c835b2f

Description:

Deletes the employee from MongoDB.

---

# Validation Rules

Employee Schema

{
  "name": {
    "type": "String",
    "required": true
  },

  "department": {
    "type": "String",
    "required": true
  },

  "email": {
    "type": "String",
    "required": true,
    "unique": true
  },

  "salary": {
    "type": "Number",
    "required": true
  }
}

---

# Current Routes

GET     /employees

POST    /employees

PUT     /employees/:id

DELETE  /employees/:id

---

# Future Routes

GET     /employees/:id

GET     /employees?department=HR

PATCH   /employees/:id