import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/employees?search=${search}&department=${department}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEmployees(res.data.employees || res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch employees");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/employees/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Employee deleted successfully");
      fetchEmployees();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete employee");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [search, department]);

  return (
    <div>
      <Navbar />

      <main className="page-shell">
        <h1>Employees</h1>

        <div className="filters">
          <input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select value={department} onChange={(e) => setDepartment(e.target.value)}>
            <option value="">All Departments</option>
            <option value="Full Stack Dev">Full Stack Dev</option>
            <option value="Finance">Finance</option>
            <option value="Operations">Operations</option>
            <option value="Data Analysis">Data Analysis</option>
            <option value="Tech">Tech</option>
            <option value="Design">Design</option>
          </select>
        </div>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Email</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan="5">No employees found</td>
              </tr>
            ) : (
              employees.map((employee) => (
                <tr key={employee._id}>
                  <td>{employee.name}</td>
                  <td>{employee.department}</td>
                  <td>{employee.email}</td>
                  <td>{employee.salary}</td>
                  <td>
                    <Link to={`/edit-employee/${employee._id}`}>
                      <button>Edit</button>
                    </Link>

                    <button onClick={() => handleDelete(employee._id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
}

export default Employees;