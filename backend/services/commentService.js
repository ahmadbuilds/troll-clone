import CommentModel from '../models/commentModel.js';

class CommentService {
    async getCommentsByCard(cardId, authToken) {
        if (!cardId) {
            throw new Error('Card ID is required');
        }
        const comments = await CommentModel.getCommentsByCard(cardId, authToken);
        return comments;
    }

    async createComment(cardId, content, authToken) {
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

        const newComment = await CommentModel.createComment(commentData, authToken);
        return newComment;
    }

    async updateComment(commentId, content, authToken) {
        if (!commentId) {
            throw new Error('Comment ID is required');
        }
        if (!content || content.trim() === '') {
            throw new Error('Content is required');
        }

        const updatedComment = await CommentModel.updateComment(commentId, { content: content.trim() }, authToken);
        return updatedComment;
    }

    async deleteComment(commentId, authToken) {
        if (!commentId) {
            throw new Error('Comment ID is required');
        }
        await CommentModel.deleteComment(commentId, authToken);
        return { message: 'Comment deleted successfully' };
    }
}

export default new CommentService();
