const router = require('express').Router();
const c = require('../controllers/employeeController');
 
//router.route('/').get(c.getEmployees);
router.route('/').get(c.getEmployees).post(c.createEmployee);

//router.route('/:id').get(c.getEmployee);
router.route('/:id').get(c.getEmployee).put(c.updateEmployee).delete(c.deleteEmployee);

module.exports = router;




