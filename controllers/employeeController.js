const Employee = require("../models/Employee");

const getEmployees = async (req, res) => {
  try {
    const filter = {};

    if (req.query.department) {
      filter.department = req.query.department;
    }

    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const sort = req.query.sort || "name";

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 10, 1);
    const skip = (page - 1) * limit;

    const employees = await Employee.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const totalEmployees = await Employee.countDocuments(filter);

    res.status(200).json({
      success: true,
      totalEmployees,
      page,
      limit,
      totalPages: Math.ceil(totalEmployees / limit),
      count: employees.length,
      employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createEmployee = async (req, res) => {
  try {
    const employee = await Employee.create({
      name: req.body.name,
      department: req.body.department,
      email: req.body.email,
      salary: req.body.salary,
    });

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      employee,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Employee validation failed",
      error: error.message,
    });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        department: req.body.department,
        email: req.body.email,
        salary: req.body.salary,
      },
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      employee,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Employee update failed",
      error: error.message,
    });
  }
};

const patchEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee patched successfully",
      employee,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Employee patch failed",
      error: error.message,
    });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
      employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getEmployeeStats = async (req, res) => {
  try {
    const stats = await Employee.aggregate([
      {
        $group: {
          _id: null,
          totalEmployees: { $sum: 1 },
          totalSalary: { $sum: "$salary" },
          averageSalary: { $avg: "$salary" },
          highestSalary: { $max: "$salary" },
          lowestSalary: { $min: "$salary" },
        },
      },
    ]);

    const departmentStats = await Employee.aggregate([
      {
        $group: {
          _id: "$department",
          totalEmployees: { $sum: 1 },
          totalSalary: { $sum: "$salary" },
          averageSalary: { $avg: "$salary" },
        },
      },
      {
        $sort: { totalEmployees: -1 },
      },
    ]);

    const finalStats = stats[0] || {
      totalEmployees: 0,
      totalSalary: 0,
      averageSalary: 0,
      highestSalary: 0,
      lowestSalary: 0,
    };

    res.status(200).json({
      success: true,
      stats: {
        totalEmployees: finalStats.totalEmployees,
        totalSalary: finalStats.totalSalary,
        averageSalary: Math.round(finalStats.averageSalary),
        highestSalary: finalStats.highestSalary,
        lowestSalary: finalStats.lowestSalary,
        departments: departmentStats.length,
      },
      departmentStats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSalaryRangeStats = async (req, res) => {
  try {
    const salaryRanges = await Employee.aggregate([
      {
        $bucket: {
          groupBy: "$salary",
          boundaries: [0, 50000, 100000, 200000, 500000, 1000000],
          default: "1000000+",
          output: {
            count: { $sum: 1 },
            employees: { $push: "$name" },
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      salaryRanges,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getDepartmentStats = async (req, res) => {
  try {
    const departmentStats = await Employee.aggregate([
      {
        $group: {
          _id: "$department",
          totalEmployees: { $sum: 1 },
          totalSalary: { $sum: "$salary" },
          averageSalary: { $avg: "$salary" },
          highestSalary: { $max: "$salary" },
          lowestSalary: { $min: "$salary" },
        },
      },
      {
        $project: {
          _id: 0,
          department: "$_id",
          totalEmployees: 1,
          totalSalary: 1,
          averageSalary: { $round: ["$averageSalary", 0] },
          highestSalary: 1,
          lowestSalary: 1,
        },
      },
      {
        $sort: { totalEmployees: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      count: departmentStats.length,
      departmentStats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getRecentEmployees = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 5;

    const employees = await Employee.find()
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: employees.length,
      employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
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
};