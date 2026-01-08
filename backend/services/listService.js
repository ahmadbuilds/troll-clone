import ListModel from '../models/listModel.js';

class ListService {
    async createList(boardId, title, authToken) {
        if (!boardId) {
            throw new Error('Board ID is required');
        }
        if (!title) {
            throw new Error('Title is required');
        }

        const listData = {
            board_id: boardId,
            title: title,
        };

        const newList = await ListModel.createList(listData, authToken);
        return newList;
    }

    async getLists(boardId, authToken) {
        if (!boardId) {
            throw new Error('Board ID is required');
        }
        const lists = await ListModel.getListsByBoard(boardId, authToken);
        return lists;
    }

    async updateList(listId, title, authToken) {
        if (!listId) {
            throw new Error('List ID is required');
        }
        const updatedList = await ListModel.updateList(listId, { title }, authToken);
        return updatedList;
    }

    async deleteList(listId, authToken) {
        if (!listId) {
            throw new Error('List ID is required');
        }
        await ListModel.deleteList(listId, authToken);
        return { message: 'List deleted successfully' };
    }
}

export default new ListService();
