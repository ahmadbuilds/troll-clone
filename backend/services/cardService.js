import CardModel from '../models/cardModel.js';

class CardService {
    async createCard(listId, title, description, priority) {
        if (!listId) {
            throw new Error('List ID is required');
        }
        if (!title) {
            throw new Error('Title is required');
        }

        // Validate priority if provided
        const validPriorities = ['Low', 'Medium', 'High'];
        if (priority && !validPriorities.includes(priority)) {
            throw new Error('Priority must be Low, Medium, or High');
        }

        const cardData = {
            list_id: listId,
            title: title,
            description: description || null,
            priority: priority || null,
        };

        const newCard = await CardModel.createCard(cardData);
        return newCard;
    }

    async updateCard(cardId, data) {
        if (!cardId) {
            throw new Error('Card ID is required');
        }
        const updatedCard = await CardModel.updateCard(cardId, data);
        return updatedCard;
    }

    async deleteCard(cardId) {
        if (!cardId) {
            throw new Error('Card ID is required');
        }
        await CardModel.deleteCard(cardId);
        return { message: 'Card deleted successfully' };
    }
}

export default new CardService();
