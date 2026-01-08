import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      // If we have a session, we are definitely not a guest in the "exclusive" sense
      if (session) {
        setIsGuest(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Login function
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  // Signup function
  const signup = async (email, password, username, role) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          role,
        },
      },
    });

    if (error) throw error;

    if (data.user) {
      // Insert into users table
      const { error: insertError } = await supabase.from("users").insert([
        {
          id: data.user.id, // Assuming 'id' in users table links to auth.users.id
          username,
          email,
          role,
        },
      ]);

      if (insertError) {
        // Optional: rollback signup or just log error?
        // For now, throwing error so UI can show it.
        console.error("Error inserting user details:", insertError);
        throw new Error("Signup successful but failed to save user details.");
      }
    }

    return data;
  };

  // Logout function
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setIsGuest(false);
    setUser(null);
    setSession(null);
  };

  // Guest login function
  const enterAsGuest = () => {
    setIsGuest(true);
  };

  const value = {
    session,
    user,
    isGuest,
    login,
    signup,
    logout,
    enterAsGuest,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
