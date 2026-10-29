async function assertDepartmentExists(departmentId) {
  const exists = await Department.exists({ _id: departmentId });
  if (!exists) {
    const err = new Error(`Department ${departmentId} not found`);
    err.statusCode = 400;
    throw err;
  }
}
 
// Only these fields may come from the client (never _id, createdAt, ...)
function pickEmployeeFields(body = {}) {
  const { name, jobTitle, salary, department, hireDate } = body;
  return { name, jobTitle, salary, department, hireDate };
}




const Employee = require('../models/Employee');
const Department = require('../models/Department');
 
exports.getEmployees = async (req, res) => {
  const { department, search } = req.query;
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Number(req.query.limit) || 20);
 
  const filter = {};
  if (department) filter.department = department;
  if (search) filter.name = { $regex: search, $options: 'i' }; // contains, ignore case
 
  const [items, total] = await Promise.all([
    Employee.find(filter)
      .populate('department', 'name') // bring the department name, like .Include()
      .sort('name')
      .skip((page - 1) * limit)
      .limit(limit),
    Employee.countDocuments(filter),
  ]);
 
  res.json({ items, total, page, pages: Math.ceil(total / limit) });
};
//-----/5

exports.getEmployee = async (req, res) => {
  const employee = await Employee.findById(req.params.id).populate('department', 'name');
  if (!employee) {
    return res.status(404).json({ message: 'Employee not found' });
  }
  res.json(employee);
};

exports.createEmployee = async (req, res) => {
  const data = pickEmployeeFields(req.body);
  if (data.department) await assertDepartmentExists(data.department);
  const employee = await Employee.create(data); // schema validation runs here
  await employee.populate('department', 'name');
  res.status(201).json(employee);
};
 
exports.updateEmployee = async (req, res) => {
  const data = pickEmployeeFields(req.body);
  if (data.department) await assertDepartmentExists(data.department);
  const employee = await Employee.findByIdAndUpdate(req.params.id, data, {
    new: true, // return the document AFTER the update
    runValidators: true, // run schema rules on update too (off by default!)
  }).populate('department', 'name');
  if (!employee) {
    return res.status(404).json({ message: 'Employee not found' });
  }
  res.json(employee);
};

exports.deleteEmployee = async (req, res) => {
  const employee = await Employee.findByIdAndDelete(req.params.id);
  if (!employee) {
    return res.status(404).json({ message: 'Employee not found' });
  }
  res.status(204).send();
};
