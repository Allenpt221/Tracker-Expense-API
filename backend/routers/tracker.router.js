import expres from 'express';
import { addTracker, removeExpense, showAllExpense, updateExpense } from '../controllers/tracker.controller.js';

const router = expres.Router();

router.post('/', addTracker);
router.get('/', showAllExpense);
router.delete('/:id', removeExpense);
router.put('/:id', updateExpense);


export default router;