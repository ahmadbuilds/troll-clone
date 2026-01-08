import ListModel from '../models/listModel.js';

class ListService {
    async createList(boardId, title) {
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

        const newList = await ListModel.createList(listData);
        return newList;
    }

    async getLists(boardId) {
        if (!boardId) {
            throw new Error('Board ID is required');
        }
        const lists = await ListModel.getListsByBoard(boardId);
        return lists;
    }

    async updateList(listId, title) {
        if (!listId) {
            throw new Error('List ID is required');
        }
        const updatedList = await ListModel.updateList(listId, { title });
        return updatedList;
    }

    async deleteList(listId) {
        if (!listId) {
            throw new Error('List ID is required');
        }
        await ListModel.deleteList(listId);
        return { message: 'List deleted successfully' };
    }
}

export default new ListService();
