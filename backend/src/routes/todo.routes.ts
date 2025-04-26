import { Router } from 'express';
import { auth } from '../middleware/auth';
import { AddTodo, completedTodo, Deletetodo, GetTodos } from '../controllers/todo.controller';

const router = Router();


router.get('/gettodos',auth, GetTodos)
router.post('/addtodo',auth, AddTodo)
router.delete('/deletetodo/:id',auth, Deletetodo)
router.put('/updatetodo/:id',auth, completedTodo)

export default router;