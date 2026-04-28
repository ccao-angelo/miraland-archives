import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabaseClient';

export default function Navbar({ session }) {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'vi' : 'en';
        i18n.changeLanguage(newLang);
    };

    const handleLogOut = async () => {
        await supabase.auth.signOut();
        navigate('/'); // Send user to home after logging in
    };

    return (
        <nav className="navbar-container">
            <h2 className="navbar-logo">✨ Miraland Archives</h2>
            <div className="navbar-links">
                <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 'bold' }}>{t('navbar.home')}</Link> |
                <Link to="/create" className="btn-magical"> {t('navbar.create')}</Link>
                
                {/* CONDITIONAL AUTH BUTTONS */}
                {session ? (
                    <button onClick={handleLogOut} className="btn-miraland btn-red" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                        Log Out
                    </button>
                ) : (
                    <Link to="/auth" className="btn-miraland btn-gold" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                        Log In
                    </Link>
                )}
                
                <button onClick={toggleLanguage} style={{
                    background: 'transparent',
                    border: '1px solid var(--nikki-gold)',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    color: 'var(--nikki-gold)'
                }}>
                    {i18n.language === 'en' ? 'VI' : 'EN'}
                </button>
            </div>
        </nav>
    );
}