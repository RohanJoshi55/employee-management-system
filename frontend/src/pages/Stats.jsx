import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";

function Stats() {
  const [stats, setStats] = useState(null);
  const [departmentStats, setDepartmentStats] = useState([]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const overallRes = await axios.get("http://localhost:5000/employees/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const deptRes = await axios.get(
        "http://localhost:5000/employees/stats/departments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats(overallRes.data.stats || overallRes.data);
      setDepartmentStats(deptRes.data.departmentStats || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch stats");
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div>
      <Navbar />

      <main className="page-shell">
        <h1>Stats Dashboard</h1>

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

          <div className="stat-card">
            <h3>Lowest Salary</h3>
            <p>{stats?.lowestSalary || 0}</p>
          </div>
        </div>

        <h2>Department Stats</h2>

        <table>
          <thead>
            <tr>
              <th>Department</th>
              <th>Employees</th>
              <th>Average Salary</th>
              <th>Highest Salary</th>
              <th>Lowest Salary</th>
            </tr>
          </thead>

          <tbody>
            {departmentStats.map((dept, index) => (
              <tr key={dept.department || dept._id || index}>
                <td>{dept.department || dept._id}</td>
                <td>
                  {dept.totalEmployees ||
                    dept.employeeCount ||
                    dept.count ||
                    dept.total ||
                    dept.employees}
                </td>
                <td>{dept.averageSalary}</td>
                <td>{dept.highestSalary}</td>
                <td>{dept.lowestSalary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}

export default Stats;