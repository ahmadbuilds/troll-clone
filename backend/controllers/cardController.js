import cardService from '../services/cardService.js';

class CardController {
    async createCard(req, res) {
        try {
            const { list_id, title, description, priority, position } = req.body;
            const newCard = await cardService.createCard(list_id, title, description, priority, position);
            res.status(201).json({"message":"Card created successfully", card: newCard});
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateCard(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const updatedCard = await cardService.updateCard(id, data);
            res.status(200).json({"message":"Card update successfully"});
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async deleteCard(req, res) {
        try {
            const { id } = req.params;
            const result = await cardService.deleteCard(id);
            res.status(200).json({"message":"Card deleted successfully"});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new CardController();
