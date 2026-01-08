import commentService from '../services/commentService.js';

class CommentController {
    async getCommentsByCard(req, res) {
        try {
            const { cardId } = req.params;
            const comments = await commentService.getCommentsByCard(cardId, req.authToken);
            res.status(200).json(comments);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async createComment(req, res) {
        try {
            const { card_id, content } = req.body;
            const newComment = await commentService.createComment(card_id, content, req.authToken);
            res.status(201).json({ message: 'Comment created successfully'});
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateComment(req, res) {
        try {
            const { id } = req.params;
            const { content } = req.body;
            const updatedComment = await commentService.updateComment(id, content, req.authToken);
            res.status(200).json({ message: 'Comment updated successfully' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async deleteComment(req, res) {
        try {
            const { id } = req.params;
            const result = await commentService.deleteComment(id, req.authToken);
            res.status(200).json({"message":"Comment deleted successfully"});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new CommentController();
