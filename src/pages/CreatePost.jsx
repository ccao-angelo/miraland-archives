import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useTranslation } from 'react-i18next';
import { arenaData } from '../arenaData';
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [toastMessage, setToastMessage] = useState('');

    const [category, setCategory] = useState('Lore');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null);
    const [nation, setNation] = useState('Apple');
    const [secretKey, setSecretKey] = useState('');
    const [themeId, setThemeId] = useState('beach_party');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file || !file.name) {
            alert("Please upload an image first! / Vui lòng tải ảnh lên!");
            return;
        }
        
        // 1. Upload image
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('suit_images')
            .upload(fileName, file);

        if (uploadError) {
            console.error("uploadError", uploadError);
            alert("Error uploading image. Check console.");
            return;
        }

        // 2. Get image URL
        const { data: { publicUrl } } = supabase.storage
            .from ('suit_images')
            .getPublicUrl(fileName);

        // 3. Save to database
        const { error: insertError } = await supabase
            .from ('lore_posts')
            .insert([{
                title,
                content,
                image_url: publicUrl,
                category,
                theme_name: category === 'Arena' ? themeId : null,
                nation_flag: nation,
                secret_key: secretKey
            }]);

        if (insertError) {
            console.error("Database insert error:", insertError);
            alert("Error saving post. Check console.");
        } else {
            setToastMessage("✨ Successfully Added to The Archives!");
            setTimeout(() => navigate('/'), 2000); // Wait 2s then go home
        }
    };

    const currentLang = i18n.language;

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
            {toastMessage && <div className="toast-notification">{toastMessage}</div>}
            <h2>{t('navbar.create')}</h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label>
                    <b>{t('form.category')}</b>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', padding: '0.5rem '}}>
                        <option value="Lore">{t('form.cat_lore')}</option>
                        <option value="Arena">{t('form.cat_arena')}</option>
                        <option value="Competition">{t('form.cat_comp')}</option>
                        <option value="Cosplay">{t('form.cat_cosplay')}</option>
                    </select>
                </label>

                {/* DYNAMIC FIELD: Arena Theme Selector */}
                {category === 'Arena' && (
                    <div style={{
                        padding: '1.5rem',
                        borderRadius: '12px',
                        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.65), rgba(255, 255, 255, 0.5)), url(${arenaData[themeId].bgUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        border: '2px solid var(--nikki-pink)',
                        boxShadow: 'var(--magical-shadow)',
                        transition: 'background 0.4 ease-in-out'
                    }}>
                        <label style={{ fontWeight: 'bold', color: 'var(--nikki-dark-pink)', textShadow: '0 2px 4px rgba(255,255,255,0.9)' }}>
                            {t('form.select_theme')}
                        </label>
                        <select value={themeId} onChange={(e) => setThemeId(e.target.value)} style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0 1rem 0' }}>
                            {Object.keys(arenaData).map(key => (
                                <option key={key} value={key}>{arenaData[key].name[currentLang]}</option>
                            ))}
                        </select>

                        <p style={{ margin: 0, textShadow: '0 2px 4px rgba(255,255,255,0.9)' }}>
                            <b style={{ color: 'var(--nikki-dark-pink)' }}>{t('form.attributes')}</b> {arenaData[themeId].attributes[currentLang].join(' | ')}
                        </p>
                    </div>
                )}

                <input type="text" placeholder={t('form.title')} required onChange={(e) => setTitle(e.target.value)} style={{ padding: '0.5rem' }}/>

                <textarea placeholder={t('form.lore')} rows="4" required onChange={(e) => setContent(e.target.value)} style={{ padding: '0.5rem' }}></textarea>

                <select  value={nation} onChange={(e) => setNation(e.target.value)} style={{ padding: '0.5rem' }}>
                    <option value="Apple">{t('nations.Apple')}</option>
                    <option value="Lilith">{t('nations.Lilith')}</option>
                    <option value="Cloud">{t('nations.Cloud')}</option>
                    <option value="Pigeon">{t('nations.Pigeon')}</option>
                    <option value="North">{t('nations.North')}</option>
                    <option value="Wasteland">{t('nations.Wasteland')}</option>
                    <option value="Ruin">{t('nations.Ruin')}</option>
                </select>

                <input type="file" accept="image/*" required onChange={(e) => setFile(e.target.files[0])} />

                <input type="password" placeholder={t('form.secret_key')} required onChange={(e) => setSecretKey(e.target.value)} style={{ padding: '0.5rem' }}/>

                <button type="submit" className="btn-magical "style={{ padding: '0.75rem', background: '#ffb6c1', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                    {t('form.submit')}
                </button>

            </form>
        </div>
    );
}