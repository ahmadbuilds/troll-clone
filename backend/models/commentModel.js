import supabase from '../config/supabaseClient.js';

class CommentModel {
    static async getCommentsByCard(cardId) {
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('card_id', cardId)
            .order('created_at', { ascending: true });

        if (error) {
            throw error;
        }
        return data;
    }

    static async createComment(commentData) {
        const { data, error } = await supabase
            .from('comments')
            .insert([commentData])
            .select();

        if (error) {
            throw error;
        }
        return data[0];
    }

    static async updateComment(commentId, updateData) {
        const { data, error } = await supabase
            .from('comments')
            .update(updateData)
            .eq('id', commentId)
            .select();

        if (error) {
            throw error;
        }
        return data[0];
    }

    static async deleteComment(commentId) {
        const { data, error } = await supabase
            .from('comments')
            .delete()
            .eq('id', commentId)
            .select();

        if (error) {
            throw error;
        }
        return data;
    }
}

export default CommentModel;
