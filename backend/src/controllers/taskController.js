const { Task, User } = require('../models');

exports.getAll = async (req, res, next) => {
  try {
    const where = req.user.role === 'admin' ? {} : { userId: req.user.id };
    const tasks = await Task.findAll({ where, order: [['createdAt', 'DESC']] });
    res.json({ success: true, data: tasks });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;
    const task = await Task.create({ title, description, status, userId: req.user.id });
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    if (req.user.role !== 'admin' && task.userId !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Not your task' });
    }

    const { title, description, status } = req.body;
    await task.update({ title, description, status });
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    if (req.user.role !== 'admin' && task.userId !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Not your task' });
    }

    await task.destroy();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
