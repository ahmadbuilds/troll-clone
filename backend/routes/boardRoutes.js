import express from 'express';
import boardController from '../controllers/boardController.js';

const router = express.Router();

router.post('/with-color', (req, res) => boardController.createBoardWithColor(req, res));
router.post('/with-image', (req, res) => boardController.createBoardWithImage(req, res));
router.post('/', (req, res) => boardController.createBoard(req, res));
router.get('/', (req, res) => boardController.getBoards(req, res));
router.get('/:id', (req, res) => boardController.getBoardById(req, res));
router.delete('/:id', (req, res) => boardController.deleteBoard(req, res));

export default router;
