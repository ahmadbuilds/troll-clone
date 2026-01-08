import express from 'express';
import listController from '../controllers/listController.js';

const router = express.Router();

router.post('/', (req, res) => listController.createList(req, res));
router.get('/board/:boardId', (req, res) => listController.getLists(req, res));
router.patch('/:id', (req, res) => listController.updateList(req, res));
router.delete('/:id', (req, res) => listController.deleteList(req, res));

export default router;
