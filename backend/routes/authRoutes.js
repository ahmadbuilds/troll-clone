import express from 'express';
import supabase from '../config/supabaseClient.js';

const router = express.Router();

//token
router.get('/token/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Get user from database
        const { data: user, error } = await supabase
            .from('users')
            .select('id, email')
            .eq('id', userId)
            .single();
            
        if (error || !user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({
            message: 'Token Generation Instructions',
            user: {
                id: user.id,
                email: user.email
            },
            instructions: [
                'Option 1: Login via your React app and get token from browser console:',
                '  - Login with your credentials',
                '  - Open DevTools Console',
                '  - Run: (await supabase.auth.getSession()).data.session.access_token',
                '',
                'Option 2: Use Supabase Dashboard:',
                '  - Go to Authentication > Users',
                '  - Click on your user',
                '  - Find the Access Token field',
                '',
                'Option 3: Create a test endpoint below',
            ],
            tempSolution: 'Call POST /api/auth/dev-login with { "email": "' + user.email + '", "password": "your_password" }'
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/auth/dev-login - Login and get token (dev only!)
router.post('/dev-login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) {
            return res.status(401).json({ error: error.message });
        }
        
        res.json({
            message: 'Login successful! Copy the access_token below',
            access_token: data.session.access_token,
            user: {
                id: data.user.id,
                email: data.user.email
            },
            usage: {
                postman_header_key: 'Authorization',
                postman_header_value: `Bearer ${data.session.access_token}`
            }
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
