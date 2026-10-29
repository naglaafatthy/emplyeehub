const router = require('express').Router();
const c = require('../controllers/departmentController');
 
router.route('/').get(c.getDepartments).post(c.createDepartment);
router.route('/:id').put(c.updateDepartment).delete(c.deleteDepartment);
module.exports = router;
