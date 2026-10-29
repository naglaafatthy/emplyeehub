const mongoose = require('mongoose');
 
const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters'],
    },
    jobTitle: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    salary: {
      type: Number,
      required: [true, 'Salary is required'],
      min: [1000, 'Salary must be at least 1000'],
    },
    // A reference to another document: like a foreign key
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Department is required'],
    },
    hireDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);
 
module.exports = mongoose.model('Employee', employeeSchema);
