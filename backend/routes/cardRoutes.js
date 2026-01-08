import express from 'express';
import cardController from '../controllers/cardController.js';

const router = express.Router();

router.post('/', (req, res) => cardController.createCard(req, res));
router.patch('/:id', (req, res) => cardController.updateCard(req, res));
router.delete('/:id', (req, res) => cardController.deleteCard(req, res));

export default router;
