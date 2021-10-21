const express = require('express');
const taskRoute = express.Router();
const controllers = require('../controllers/task.controllers');

taskRoute.post('/add_task', controllers.addTask)
taskRoute.get('/get_tasks', controllers.getAll)
taskRoute.post('/delete_task', controllers.deleteOne)

module.exports = taskRoute;