import { useEffect, useState } from 'react';
import { getEmployees } from '../api';
import EmployeeRow from '../components/EmployeeRow';
 
export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]); // [] until the server answers
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
 
  // Runs ONCE, after the page appears
  useEffect(() => {
    async function load() {
      try {
        const data = await getEmployees(); // api.js -> axios -> GET /api/employees
        setEmployees(data.items);
        setTotal(data.total);
      } catch (err) {
        setError(err.message); // e.g. "Network Error" when the API is not running
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);
 
  if (loading) return <p className="muted">Loading…</p>;
 
  return (
    <section>
      <h2>Employees ({total})</h2>
      {error && <p className="error">{error}</p>}
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr><th>Name</th><th>Job title</th><th>Department</th><th>Salary</th></tr>
          </thead>
          <tbody>
            {employees.map((e) => (
              <EmployeeRow key={e._id} employee={e} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
