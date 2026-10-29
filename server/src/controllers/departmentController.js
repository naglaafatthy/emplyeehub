const Department = require('../models/Department');
const Employee = require('../models/Employee');
 
// GET /api/departments
exports.getDepartments = async (req, res) => {
  const departments = await Department.find().sort('name');
  res.json(departments);
};
 
// POST /api/departments
exports.createDepartment = async (req, res) => {
  const department = await Department.create({ name: req.body?.name });
  res.status(201).json(department);
};
 
// DELETE /api/departments/:id
// MongoDB has no foreign keys, so WE protect departments that still have staff.
exports.deleteDepartment = async (req, res) => {
  const staff = await Employee.countDocuments({ department: req.params.id });
  if (staff > 0) {
    return res.status(409).json({ message: `Cannot delete: ${staff} employee(s) still in this department` });
  }
  const department = await Department.findByIdAndDelete(req.params.id);
  if (!department) {
    return res.status(404).json({ message: 'Department not found' });
  }
  res.status(204).send();
};
exports.updateDepartment = async (req, res) => {
  const department = await Department.findByIdAndUpdate(
    req.params.id,
    { name: req.body?.name },
    { new: true, runValidators: true }
  );
  if (!department) {
    return res.status(404).json({ message: 'Department not found' });
  }
  res.json(department);
};
