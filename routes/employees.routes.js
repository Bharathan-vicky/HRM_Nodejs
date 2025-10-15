// routes/employees.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const permit = require('../middlewares/role.middleware');
const {
  createEmployee, updateEmployee, deleteEmployee, getEmployees
} = require('../controllers/employee.controller');

router.post('/', auth, permit('Admin'), createEmployee);
router.get('/', auth, permit('Admin'), getEmployees);
router.put('/:id', auth, permit('Admin'), updateEmployee);
router.delete('/:id', auth, permit('Admin'), deleteEmployee);

module.exports = router;
