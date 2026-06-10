import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";

function EditEmployee() {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [salary, setSalary] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  const fetchSingleEmployee = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`http://localhost:5000/employees/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const employee = res.data.employee || res.data;

      setName(employee.name);
      setDepartment(employee.department);
      setEmail(employee.email);
      setSalary(employee.salary);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch employee");
    }
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `http://localhost:5000/employees/${id}`,
        {
          name,
          department,
          email,
          salary: Number(salary),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Employee updated successfully");
      navigate("/employees");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update employee");
    }
  };

  useEffect(() => {
    fetchSingleEmployee();
  }, []);

  return (
    <div>
      <Navbar />

      <div className="form-page">
        <div className="form-wrapper">
          <h1>Edit Employee</h1>

          <form onSubmit={handleUpdateEmployee}>
            <input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Enter Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />

            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="number"
              placeholder="Enter Salary"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
            />

            <div className="form-actions">
              <button type="submit">Update Employee</button>

              <button
                type="button"
                className="secondary-btn"
                onClick={() => navigate("/employees")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditEmployee;