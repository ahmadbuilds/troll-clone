import boardService from '../services/boardService.js';

class BoardController {
    async createBoard(req, res) {
        try {
            const { title, bg_color, img_url, user_id } = req.body;
            const newBoard = await boardService.createBoard(title, bg_color, img_url, user_id, req.authToken);
            res.status(201).json({"message":"Board created successfully"});
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async createBoardWithColor(req, res) {
        try {
            const { title, bg_color, user_id } = req.body;
            if (!bg_color) {
                return res.status(400).json({ error: 'Background color is required' });
            }
            const newBoard = await boardService.createBoard(title, bg_color, null, user_id, req.authToken);
            res.status(201).json({"message":"Board created successfully"});
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async createBoardWithImage(req, res) {
        try {
            const { title, img_url, user_id } = req.body;
            if (!img_url) {
                return res.status(400).json({ error: 'Image URL is required' });
            }
            const newBoard = await boardService.createBoard(title, null, img_url, user_id, req.authToken);
            res.status(201).json({"message":"Board created successfully"});
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getBoards(req, res) {
        try {
            const userId = req.headers['user-id'] || req.query.user_id;

            if (!userId) {
                return res.status(400).json({ error: 'User ID is required' });
            }

            const boards = await boardService.getBoards(userId, req.authToken);
            res.status(200).json(boards);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteBoard(req, res) {
        try {
            const { id } = req.params;
            const result = await boardService.deleteBoard(id, req.authToken);
            res.status(200).json({"message":"Board delete successfully"});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getBoardById(req, res) {
        try {
            const { id } = req.params;
            const board = await boardService.getBoard(id, req.authToken);
            res.status(200).json(board);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
}

export default new BoardController();
