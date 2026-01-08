import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_API;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const userId = process.argv[2] || 'ee992c2d-95f0-4b54-bb46-343c886ada51';

async function generateToken() {
    try {
        const { data: user, error: userError } = await supabase.auth.admin.getUserById(userId);
        
        if (userError) {
            console.error('Error fetching user:', userError.message);
            return;
        }
        
        if (!user) {
            console.error('User not found with ID:', userId);
            return;
        }

        console.log('\n=== User Details ===');
        console.log('Email:', user.user.email);
        console.log('ID:', user.user.id);
        
        const { data, error } = await supabase.auth.admin.generateLink({
            type: 'magiclink',
            email: user.user.email
        });
        
        if (error) {
            console.error('Error generating token:', error.message);
            return;
        }
        
        const { data: session, error: sessionError } = await supabase.auth.admin.createUser({
            email: user.user.email,
            email_confirm: true,
            user_metadata: user.user.user_metadata
        });
        
        if (!sessionError && session) {
            console.log('\nSession created! Use this in testing (note: this might be a new user)');
        }
        
    } catch (err) {
        console.error('Unexpected error:', err.message);
    }
}

generateToken();
