const express = require('express');
const departmentsRoute = express.Router();
const controllers = require('../controllers/departments.controllers');

departmentsRoute.post('/create_department', controllers.addOne);
departmentsRoute.get('/get_departments', controllers.getAll);

module.exports = departmentsRoute;