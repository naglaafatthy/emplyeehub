require('dotenv').config();
const mongoose = require('mongoose');
const Department = require('../src/models/Department');
const Employee = require('../src/models/Employee');
 
async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
 
  await Employee.deleteMany({});
  await Department.deleteMany({});
 
  const [it, hr, finance] = await Department.create([{ name: 'IT' }, { name: 'HR' }, { name: 'Finance' }]);
 
  await Employee.create([
    { name: 'Ahmed Ali', jobTitle: 'Developer', salary: 25000, department: it._id },
    { name: 'Sara Adel', jobTitle: 'QA Engineer', salary: 17000, department: it._id },
    { name: 'Mona Hassan', jobTitle: 'Recruiter', salary: 18000, department: hr._id },
    { name: 'Omar Khaled', jobTitle: 'Accountant', salary: 20000, department: finance._id },
  ]);
 
  console.log('Seeded 3 departments and 4 employees');
  await mongoose.disconnect();
}
 
seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
