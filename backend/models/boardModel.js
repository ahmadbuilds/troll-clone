import supabase from '../config/supabaseClient.js';

class BoardModel {
    static async createBoard(boardData) {
        const { data, error } = await supabase
            .from('boards')
            .insert([boardData])
            .select();

        if (error) {
            throw error;
        }
        return data[0];
    }

    static async getBoardsByUser(userId) {
        const { data, error } = await supabase
            .from('boards')
            .select('*')
            .eq('created_by', userId);

        if (error) {
            throw error;
        }
        return data;
    }

    static async deleteBoard(boardId) {
        const { data, error } = await supabase
            .from('boards')
            .delete()
            .eq('board_id', boardId)
            .select();

        if (error) {
            throw error;
        }
        return data;
    }

    static async getBoardById(boardId) {
        const { data, error } = await supabase
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
