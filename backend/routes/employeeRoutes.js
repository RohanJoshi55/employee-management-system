const { body, validationResult } = require("express-validator");
const express = require("express");
const router = express.Router();

const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  patchEmployee,
  deleteEmployee,
  getEmployeeStats,
  getSalaryRangeStats,
  getDepartmentStats,
  getRecentEmployees,
} = require("../controllers/employeeController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const validateEmployee = [
  body("name")
    .notEmpty()
    .withMessage("Name is required"),

  body("department")
    .notEmpty()
    .withMessage("Department is required"),

  body("email")
    .isEmail()
    .withMessage("Valid email is required"),

  body("salary")
    .isNumeric()
    .withMessage("Salary must be a number"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    next();
  },
];

router.get("/employees", protect, getEmployees);

router.get("/employees/stats", protect, adminOnly, getEmployeeStats);

router.get("/employees/stats/salary-range", protect, adminOnly, getSalaryRangeStats);

router.get("/employees/stats/departments", protect, adminOnly, getDepartmentStats);

router.get("/employees/recent", protect, adminOnly, getRecentEmployees);

router.get("/employees/:id", protect, getEmployeeById);

router.post("/employees", protect, adminOnly, validateEmployee, createEmployee);

router.put("/employees/:id", protect, adminOnly, validateEmployee, updateEmployee);

router.patch("/employees/:id", protect, adminOnly, updateEmployee);

router.delete("/employees/:id", protect, adminOnly, deleteEmployee);

module.exports = router;