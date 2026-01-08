import listService from '../services/listService.js';
import CardModel from '../models/cardModel.js';

class ListController {
    async createList(req, res) {
        try {
            const { board_id, title } = req.body;
            const newList = await listService.createList(board_id, title);
            res.status(201).json({"message":"List created successfully"});
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getLists(req, res) {
        try {
            const { boardId } = req.params;
            const lists = await listService.getLists(boardId);
            const cards = await CardModel.getCardsByBoard(boardId);

            const listsWithCards = lists.map(list => {
                const listCards = cards.filter(card => card.list_id === list.id);
                const listObj = { ...list, cards: listCards };
                return listObj;
            });

            res.status(200).json(listsWithCards);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateList(req, res) {
        try {
            const { id } = req.params;
            const { title } = req.body;
            const updatedList = await listService.updateList(id, title);
            res.status(200).json({"message":"List update successfully"});
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async deleteList(req, res) {
        try {
            const { id } = req.params;
            const result = await listService.deleteList(id);
            res.status(200).json({"message":"List delete successfully"});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new ListController();
