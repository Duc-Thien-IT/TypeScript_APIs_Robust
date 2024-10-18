import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { Task } from '../models/task';
import pool from '../config/db';

// Validation rules
const taskValidationRules = [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('completed').isBoolean().withMessage('Completed must be a boolean'),
];

// Add task
export const addTask = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    const { title, description, completed } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO task (title, description, completed) VALUES ($1, $2, $3) RETURNING *',
            [title, description, completed]
        );
        const task: Task = result.rows[0];
        res.status(201).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

// Get all tasks
export const getAllTasks = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await pool.query('SELECT * FROM task');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

// Get task by ID
export const getTaskById = async (req: Request, res: Response): Promise<void> => {
    const taskId = parseInt(req.params.id);
    try {
        const result = await pool.query('SELECT * FROM task WHERE id = $1', [taskId]);
        const task = result.rows[0];
        if (!task) {
            res.status(404).send('Task not found');
            return;
        }
        res.json(task);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

// Update task by ID
export const updateTask = async (req: Request, res: Response): Promise<void> => {
    const taskId = parseInt(req.params.id);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    const { title, description, completed } = req.body;

    try {
        const result = await pool.query(
            'UPDATE task SET title = $1, description = $2, completed = $3 WHERE id = $4 RETURNING *',
            [title, description, completed, taskId]
        );
        const task = result.rows[0];
        if (!task) {
            res.status(404).send('Task not found');
            return;
        }
        res.json(task);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

// Delete task by ID
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
    const taskId = parseInt(req.params.id);
    try {
        const result = await pool.query('DELETE FROM task WHERE id = $1 RETURNING *', [taskId]);
        const task = result.rows[0];
        if (!task) {
            res.status(404).send('Task not found');
            return;
        }
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};
