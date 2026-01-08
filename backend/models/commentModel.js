import supabase, { getSupabaseClient } from '../config/supabaseClient.js';

class CommentModel {
    static async getCommentsByCard(cardId, authToken = null) {
        const client = getSupabaseClient(authToken);
        const { data, error } = await client
            .from('comments')
            .select('*')
            .eq('card_id', cardId)
            .order('created_at', { ascending: true });

        if (error) {
            throw error;
        }
        return data;
    }

    static async createComment(commentData, authToken = null) {
        const client = getSupabaseClient(authToken);
        const { data, error } = await client
            .from('comments')
            .insert([commentData])
            .select();

        if (error) {
            throw error;
        }
        return data[0];
    }

    static async updateComment(commentId, updateData, authToken = null) {
        const client = getSupabaseClient(authToken);
        const { data, error } = await client
            .from('comments')
            .update(updateData)
            .eq('id', commentId)
            .select();

        if (error) {
            throw error;
        }
        return data[0];
    }

    static async deleteComment(commentId, authToken = null) {
        const client = getSupabaseClient(authToken);
        const { data, error } = await client
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
