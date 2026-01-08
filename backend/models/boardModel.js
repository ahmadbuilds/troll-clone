import supabase, { getSupabaseClient } from '../config/supabaseClient.js';

class BoardModel {
    static async createBoard(boardData, authToken = null) {
        const client = getSupabaseClient(authToken);
        const { data, error } = await client
            .from('boards')
            .insert([boardData])
            .select();

        if (error) {
            throw error;
        }
        return data[0];
    }

    static async getBoardsByUser(userId, authToken = null) {
        const client = getSupabaseClient(authToken);
        const { data, error } = await client
            .from('boards')
            .select('*')
            .eq('created_by', userId);

        if (error) {
            throw error;
        }
        return data;
    }

    static async deleteBoard(boardId, authToken = null) {
        const client = getSupabaseClient(authToken);
        const { data, error } = await client
            .from('boards')
            .delete()
            .eq('board_id', boardId)
            .select();

        if (error) {
            throw error;
        }
        return data;
    }

    static async getBoardById(boardId, authToken = null) {
        const client = getSupabaseClient(authToken);
        const { data, error } = await client
            .from('boards')
            .select('*')
            .eq('board_id', boardId)
            .single();

        if (error) {
            throw error;
        }
        return data;
    }
}

export default BoardModel;
