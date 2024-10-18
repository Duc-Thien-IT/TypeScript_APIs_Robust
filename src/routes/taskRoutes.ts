import { Router } from 'express';
import {
    addTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask
} from '../controller/taskController';

const router = Router();

router.post('/', addTask); 
router.get('/', getAllTasks); 
router.get('/:id', getTaskById); 
router.put('/:id', updateTask); 
router.delete('/:id', deleteTask); 

export default router;
