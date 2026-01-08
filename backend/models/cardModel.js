import supabase, { getSupabaseClient } from '../config/supabaseClient.js';

class CardModel {
    static async createCard(cardData, authToken = null) {
        const client = getSupabaseClient(authToken);
        const { data, error } = await client
            .from('cards')
            .insert([cardData])
            .select();

        if (error) {
            throw error;
        }
        return data[0];
    }

    static async getCardsByList(listId, authToken = null) {
        const client = getSupabaseClient(authToken);
        const { data, error } = await client
            .from('cards')
            .select('*')
            .eq('list_id', listId);

        if (error) {
            throw error;
        }
        return data;
    }

    static async getCardsByBoard(boardId, authToken = null) {
        const client = getSupabaseClient(authToken);
        const { data, error } = await client
            .from('cards')
            .select('*, lists!inner(board_id)')
            .eq('lists.board_id', boardId);

        if (error) {
            throw error;
        }
        return data;
    }

    static async updateCard(cardId, updateData, authToken = null) {
        const client = getSupabaseClient(authToken);
        const { data, error } = await client
            .from('cards')
            .update(updateData)
            .eq('id', cardId)
            .select();

        if (error) {
            throw error;
        }
        return data[0];
    }

    static async deleteCard(cardId, authToken = null) {
        const client = getSupabaseClient(authToken);
        const { data, error } = await client
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
