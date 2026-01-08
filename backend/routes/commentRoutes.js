import express from 'express';
import commentController from '../controllers/commentController.js';

const router = express.Router();

router.get('/card/:cardId', (req, res) => commentController.getCommentsByCard(req, res));
router.post('/', (req, res) => commentController.createComment(req, res));
router.patch('/:id', (req, res) => commentController.updateComment(req, res));
router.delete('/:id', (req, res) => commentController.deleteComment(req, res));

export default router;
