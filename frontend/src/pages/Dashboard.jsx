import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [departments, setDepartments] = useState([]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      const statsRes = await axios.get("http://localhost:5000/employees/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const departmentRes = await axios.get(
        "http://localhost:5000/employees/stats/departments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats(statsRes.data.stats || statsRes.data);
      setDepartments(departmentRes.data.departmentStats || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load dashboard");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div>
      <Navbar />

      <main className="page-shell">
        <section className="hero">
          <p className="eyebrow">EMPLOYEE MANAGEMENT SYSTEM</p>

          <h1 className="dashboard-title">Dashboard Overview</h1>

          <p className="hero-text">
            Track employees, salary insights, and department distribution from one place.
          </p>
        </section>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Employees</h3>
            <p>{stats?.totalEmployees || stats?.count || 0}</p>
          </div>

          <div className="stat-card">
            <h3>Total Salary</h3>
            <p>{stats?.totalSalary || 0}</p>
          </div>

          <div className="stat-card">
            <h3>Average Salary</h3>
            <p>{stats?.averageSalary || 0}</p>
          </div>

          <div className="stat-card">
            <h3>Highest Salary</h3>
            <p>{stats?.highestSalary || 0}</p>
          </div>
        </div>

        <section className="panel">
          <h2>All Departments</h2>

          <div className="department-grid">
            {departments.map((dept, index) => (
              <div className="department-card" key={dept.department || dept._id || index}>
                <h3>{dept.department || dept._id}</h3>
                <p>
                  {dept.totalEmployees ||
                    dept.employeeCount ||
                    dept.count ||
                    dept.total ||
                    dept.employees}{" "}
                  Employees
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;