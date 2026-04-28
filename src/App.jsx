import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import PostDetail from './pages/PostDetail';
import Auth from './pages/Auth';

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // 1. Check if user's logged in when the app loads
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // 2. Listen for changes (log in or log out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div>
      <Navbar session={session} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/post/:id" element={<PostDetail session={session} />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </div>
  );
}