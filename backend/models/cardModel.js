import supabase from '../config/supabaseClient.js';

class CardModel {
    static async createCard(cardData) {
        const { data, error } = await supabase
            .from('cards')
            .insert([cardData])
            .select();

        if (error) {
            throw error;
        }
        return data[0];
    }

    static async getCardsByList(listId) {
        const { data, error } = await supabase
            .from('cards')
            .select('*')
            .eq('list_id', listId);

        if (error) {
            throw error;
        }
        return data;
    }

    static async getCardsByBoard(boardId) {
        const { data, error } = await supabase
            .from('cards')
            .select('*, lists!inner(board_id)')
            .eq('lists.board_id', boardId);

        if (error) {
            throw error;
        }
        return data;
    }

    static async updateCard(cardId, updateData) {
        const { data, error } = await supabase
            .from('cards')
            .update(updateData)
            .eq('id', cardId)
            .select();

        if (error) {
            throw error;
        }
        return data[0];
    }

    static async deleteCard(cardId) {
        const { data, error } = await supabase
            .from('cards')
            .delete()
            .eq('id', cardId)
            .select();

        if (error) {
            throw error;
        }
        return data;
    }
}

export default CardModel;
