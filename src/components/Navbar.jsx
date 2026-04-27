import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
    const { t, i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'vi' : 'en';
        i18n.changeLanguage(newLang);
    };

    return (
        <nav className="navbar-container">
            <h2 className="navbar-logo">✨ Miraland Archives</h2>
            <div className="navbar-links">
                <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 'bold' }}>{t('navbar.home')}</Link> |
                <Link to="/create" className="btn-magical"> {t('navbar.create')}</Link>
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