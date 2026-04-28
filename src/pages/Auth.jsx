import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);

        let error;
        if (isLogin) {
            // Log an existing user in
            const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
            error = signInError;
        } else {
            // Create a new user
            const { error: signUpError } = await supabase.auth.signUp({ email, password });
            error = signUpError;
        }

        if (error) {
            alert(error.message);
        } else {
            alert(isLogin ? "Welcome back!" : "Account created successfully!");
            navigate('/'); // Send user to  the home page
        }
        setLoading(false);
    };

    return (
        <div className="glass-card" style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', textAlign: 'center' }}>
            <h2 style={{ color: 'var(--nikki-dark-pink)' }}>{isLogin ? 'Welcome Back' : 'Join Miraland'}</h2>

            <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                <input
                    type="email"
                    placeholder="Stylist Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ padding: '0.8 rem' }}
                />
                <input 
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ padding: '0.8rem' }}
                />
                <button type="submit" className="btn-miraland btn-pink" disabled={loading}>
                    {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
                </button>
            </form>

            <p style={{ marginTop: '1rem', cursor: 'pointer', color: '#666' }} onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
            </p>
        </div>  
    );
}