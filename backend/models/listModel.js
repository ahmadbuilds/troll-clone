import supabase, { getSupabaseClient } from '../config/supabaseClient.js';

class ListModel {
    static async createList(listData, authToken = null) {
        const client = getSupabaseClient(authToken);
        const { data, error } = await client
            .from('lists')
            .insert([listData])
            .select();

        if (error) {
            throw error;
        }
        return data[0];
    }

    static async getListsByBoard(boardId, authToken = null) {
        const client = getSupabaseClient(authToken);
        const { data, error } = await client
            .from('lists')
            .select('*')
            .eq('board_id', boardId);

        if (error) {
            throw error;
        }
        return data;
    }

    static async updateList(listId, updateData, authToken = null) {
        const client = getSupabaseClient(authToken);
        const { data, error } = await client
            .from('lists')
            .update(updateData)
            .eq('id', listId)
            .select();

        if (error) {
            throw error;
        }
        return data[0];
    }

    static async deleteList(listId, authToken = null) {
        const client = getSupabaseClient(authToken);
        const { data, error } = await client
            .from('lists')
            .delete()
            .eq('id', listId)
            .select();

        if (error) {
            throw error;
        }
        return data;
    }
}

export default ListModel;
