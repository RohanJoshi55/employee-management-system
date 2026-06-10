import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";

function AddEmployee() {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [salary, setSalary] = useState("");

  const navigate = useNavigate();

  const handleAddEmployee = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/employees",
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

      toast.success("Employee added successfully");
      navigate("/employees");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add employee");
    }
  };

  return (
    <div>
      <Navbar />

      <div className="form-page">
        <div className="form-wrapper">
          <h1>Add Employee</h1>

          <form onSubmit={handleAddEmployee}>
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

            <button type="submit">Add Employee</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddEmployee;