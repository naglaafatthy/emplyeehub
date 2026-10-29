export default function EmployeeRow({ employee }) {
  return (
    <tr>
      <td>{employee.name}</td>
      <td>{employee.jobTitle}</td>
      {/* department is an object { _id, name } because the API uses populate */}
      <td><span className="badge">{employee.department?.name}</span></td>
      <td>{employee.salary.toLocaleString()} EGP</td>
    </tr>
  );
}
