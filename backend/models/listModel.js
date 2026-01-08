import supabase from '../config/supabaseClient.js';

class ListModel {
    static async createList(listData) {
        const { data, error } = await supabase
            .from('lists')
            .insert([listData])
            .select();

        if (error) {
            throw error;
        }
        return data[0];
    }

    static async getListsByBoard(boardId) {
        const { data, error } = await supabase
            .from('lists')
            .select('*')
            .eq('board_id', boardId);

        if (error) {
            throw error;
        }
        return data;
    }

    static async updateList(listId, updateData) {
        const { data, error } = await supabase
            .from('lists')
            .update(updateData)
            .eq('id', listId)
            .select();

        if (error) {
            throw error;
        }
        return data[0];
    }

    static async deleteList(listId) {
        const { data, error } = await supabase
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
