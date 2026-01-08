
import supabase from '../config/supabaseClient.js'

// Create a new board
export const createBoard = async (req, res) => {
    try {
        const { title, bg_color, img_url, user_id } = req.body;

        if (!title || !user_id) {
            return res.status(400).json({ error: 'Title and User ID are required' });
        }

        const { data, error } = await supabase
            .from('boards')
            .insert([{ title, bg_color, img_url, created_by: user_id }])
            .select();

        if (error) throw error;

        res.status(201).json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all boards for a user
export const getBoards = async (req, res) => {
    try {
        const { user_id } = req.query;

        if (!user_id) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const { data, error } = await supabase
            .from('boards')
            .select('*')
            .eq('created_by', user_id);

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a board
export const deleteBoard = async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('boards')
            .delete()
            .eq('board_id', id);

        if (error) throw error;

        res.status(200).json({ message: 'Board deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
