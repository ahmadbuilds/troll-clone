import BoardModel from '../models/boardModel.js';

class BoardService {
    async createBoard(title, bgColor, imgUrl, userId, authToken) {
        if (!title) {
            throw new Error('Title is required');
        }

        const boardData = {
            title: title,
            bg_color: bgColor,
            img_url: imgUrl,
            created_by: userId
        };

        const newBoard = await BoardModel.createBoard(boardData, authToken);
        return newBoard;
    }

    async getBoards(userId, authToken) {
        if (!userId) {
            throw new Error('User ID is required');
        }
        const boards = await BoardModel.getBoardsByUser(userId, authToken);
        return boards;
    }

    async deleteBoard(boardId, authToken) {
        if (!boardId) {
            throw new Error('Board ID is required');
        }
        await BoardModel.deleteBoard(boardId, authToken);
        return { message: 'Board deleted successfully' };
    }

    async getBoard(boardId, authToken) {
        if (!boardId) {
            throw new Error('Board ID is required');
        }
        const board = await BoardModel.getBoardById(boardId, authToken);
        return board;
    }
}

export default new BoardService();
