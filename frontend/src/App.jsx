
import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const API_URL = 'http://localhost:5000/api/employees'

function App() {
  const [employees, setEmployees] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // GET API: Fetch employees from MongoDB
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(API_URL)
        setEmployees(response.data)
      } catch (error) {
        setError('Unable to load employees. Please check the backend.')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchEmployees()
  }, [])

  // POST API: Save employee in MongoDB
  const addEmployee = async (event) => {
    event.preventDefault()
    setError('')

    if (!name.trim() || !email.trim() || !role.trim()) {
      setError('Please fill in all fields.')
      return
    }

    try {
      const response = await axios.post(API_URL, {
        name,
        email,
        role,
      })

      setEmployees((previousEmployees) => [
        ...previousEmployees,
        response.data,
      ])

      setName('')
      setEmail('')
      setRole('')
      setShowForm(false)
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Unable to add employee. Please try again.'

      setError(message)
      console.error(error)
    }
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>EmployeeHub</h2>
        <p className="menu-label">MENU</p>
        <div className="menu-item active">Dashboard</div>
        <div className="menu-item">Employees</div>
        <div className="menu-item">Settings</div>
        <div className="sidebar-footer">
          Employee Management System
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome to your Employee Management System</p>
          </div>
          <span className="profile">SK</span>
        </header>

        <section className="stats">
          <div className="stat-card">
            <p>Total Employees</p>
            <h2>{employees.length}</h2>
          </div>

          <div className="stat-card">
            <p>Active Employees</p>
            <h2>{employees.length}</h2>
          </div>

          <div className="stat-card">
            <p>Departments</p>
            <h2>1</h2>
          </div>
        </section>

        <section className="employee-section">
          <div className="section-header">
            <div>
              <h2>Employee Directory</h2>
              <p>Manage your employee records</p>
            </div>

            <button onClick={() => setShowForm(!showForm)}>
              + Add Employee
            </button>
          </div>

          {error && <p className="error-message">{error}</p>}

          {showForm && (
            <form className="employee-form" onSubmit={addEmployee}>
              <h3>Add New Employee</h3>

              <input
                placeholder="Employee Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />

              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />

              <input
                placeholder="Job Role"
                value={role}
                onChange={(event) => setRole(event.target.value)}
              />

              <button type="submit">Save Employee</button>
            </form>
          )}

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4">Loading employees...</td>
                  </tr>
                ) : employees.length === 0 ? (
                  <tr>
                    <td colSpan="4">No employees found.</td>
                  </tr>
                ) : (
                  employees.map((employee) => (
                    <tr key={employee._id || employee.id}>
                      <td>{employee.name}</td>
                      <td>{employee.email}</td>
                      <td>{employee.role}</td>
                      <td>
                        <span className="status">Active</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
