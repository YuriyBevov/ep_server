const express = require('express');
const departmentsRoute = express.Router();
const controllers = require('../controllers/departments.controllers');

departmentsRoute.post('/create_department', controllers.addOne);
departmentsRoute.get('/get_departments', controllers.getAll);
departmentsRoute.post('/delete_department', controllers.deleteOne);
departmentsRoute.post('/update_department', controllers.updateOne);

module.exports = departmentsRoute;