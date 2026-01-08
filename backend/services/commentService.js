import CommentModel from '../models/commentModel.js';

class CommentService {
    async getCommentsByCard(cardId) {
        if (!cardId) {
            throw new Error('Card ID is required');
        }
        const comments = await CommentModel.getCommentsByCard(cardId);
        return comments;
    }

    async createComment(cardId, content) {
        if (!cardId) {
            throw new Error('Card ID is required');
        }
        if (!content || content.trim() === '') {
            throw new Error('Content is required');
        }

        const commentData = {
            card_id: cardId,
            content: content.trim()
        };

        const newComment = await CommentModel.createComment(commentData);
        return newComment;
    }

    async updateComment(commentId, content) {
        if (!commentId) {
            throw new Error('Comment ID is required');
        }
        if (!content || content.trim() === '') {
            throw new Error('Content is required');
        }

        const updatedComment = await CommentModel.updateComment(commentId, { content: content.trim() });
        return updatedComment;
    }

    async deleteComment(commentId) {
        if (!commentId) {
            throw new Error('Comment ID is required');
        }
        await CommentModel.deleteComment(commentId);
        return { message: 'Comment deleted successfully' };
    }
}

export default new CommentService();
