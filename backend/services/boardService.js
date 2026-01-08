import BoardModel from '../models/boardModel.js';

class BoardService {
    async createBoard(title, bgColor, imgUrl, userId) {
        if (!title) {
            throw new Error('Title is required');
        }

        const boardData = {
            title: title,
            bg_color: bgColor,
            img_url: imgUrl,
            created_by: userId
        };

        const newBoard = await BoardModel.createBoard(boardData);
        return newBoard;
    }

    async getBoards(userId) {
        if (!userId) {
            throw new Error('User ID is required');
        }
        const boards = await BoardModel.getBoardsByUser(userId);
        return boards;
    }

    async deleteBoard(boardId) {
        if (!boardId) {
            throw new Error('Board ID is required');
        }
        await BoardModel.deleteBoard(boardId);
        return { message: 'Board deleted successfully' };
    }

    async getBoard(boardId) {
        if (!boardId) {
            throw new Error('Board ID is required');
        }
        const board = await BoardModel.getBoardById(boardId);
        return board;
    }
}

export default new BoardService();
