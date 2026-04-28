import Tilt from 'react-parallax-tilt';
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// HELPER FUNCTION: Remove Vietnamese Accents for easy searching
const removeAccents = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
};

export default function Home() {
    const { t } = useTranslation();

    // State variables
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [orderBy, setOrderBy] = useState('created_at');
    const [filterNation, setFilterNation] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [visibleCount, setVisibleCount] = useState(6);

    useEffect(() => {
        fetchPosts();
    }, [orderBy, filterNation]);

    const fetchPosts = async () => {
        setIsLoading(true); // Trigger loading animation
        setVisibleCount(6);

        // Start building the Supabase query
        let query = supabase.from('lore_posts').select();

        // If a specific nation is selected, add a filter
        if (filterNation !== 'All') {
            query = query.eq('nation_flag', filterNation);
        }

        // Order the results and execute the fetch
        const { data, error } = await query.order(orderBy, { ascending: false });
            
        if (!error) {
            if (searchQuery.trim() !== '') {
                const normalizedQuery = removeAccents(searchQuery);
                const filteredData = data.filter(post =>
                    removeAccents(post.title).includes(normalizedQuery)
                );
                setPosts(filteredData);
            } else {
                setPosts(data);
            }
        }

        setIsLoading(false); // Turn off loading animation
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>

            {/* CONTROL SECTION */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                
                {/* Sort Dropdown */}
                <select value={orderBy} onChange={(e) => setOrderBy(e.target.value)} style={{ padding: '0.5rem', borderRadius: '5px' }}>
                    <option value="created_at">{t('feed.sort_new')}</option>
                    <option value="upvotes">{t('feed.sort_top')}</option>
                </select>

                {/* Filter Dropdown */}
                <select value={filterNation} onChange={(e) => setFilterNation(e.target.value)} style={{ padding: '0.5rem', borderRadius: '5px' }}>
                    <option value="All">{t('feed.filter_all')}</option>
                    <option value="Apple">{t('nations.Apple')}</option>
                    <option value="Lilith">{t('nations.Lilith')}</option>
                    <option value="Cloud">{t('nations.Cloud')}</option>
                    <option value="Pigeon">{t('nations.Pigeon')}</option>
                    <option value="North">{t('nations.North')}</option>
                    <option value="Wasteland">{t('nations.Wasteland')}</option>
                    <option value="Ruin">{t('nations.Ruin')}</option>
                </select>

                {/* Search Form */}
                <form onSubmit={(e) => { e.preventDefault(); fetchPosts(); }} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="text"
                        placeholder={t('feed.search')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
                    />
                    <button type="submit" style={{ padding: '0.5rem 1rem', background: '#333', color: 'white', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>
                        🔍
                    </button>
                </form>

            </div>

            {/* LOADING ANIMATION */}
            {isLoading ? (
                <div style={{ textAlign: 'center', fontSize: '1.5rem', color: '#ff69b4', padding: '3rem' }}>
                    {t('feed.loading')}
                </div>
            ) : (

                /* THE POSTS GRID */
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
                    {posts.length === 0 ? (
                        <p>No archives found. Be the first to add one!</p>
                    ) : (
                        posts.slice(0, visibleCount).map((post) => (
                        <Tilt
                            key={post.id}
                            glareEnable={true}
                            glareMaxOpacity={0.4}
                            glareColor='white'
                            glarePosition='all'
                            scale={1.02}
                            transitionSpeed={400}
                            tiltMaxAngleX={8}
                            tiltMaxAngleY={8}
                        >
                            <div className="glass-card floating-archive">
                                <img
                                    src={post.image_url}
                                    alt={post.title}
                                    loading="lazy"
                                    style={{ width: '100%', height: '250px', objectFit: 'cover', objectPosition: 'top center' }}
                                />

                                <div style={{ padding: '1rem' }}>
                                    <span style={{ fontSize: '0.8rem', background: '#f0f8ff', padding: '0.2rem 0.5rem', borderRadius: '5px' }}>
                                        {t('categories.' + post.category)} • {t(`nations.${post.nation_flag}`)}
                                    </span>

                                    <h3 style={{ margin: '0.5rem 0' }}>{post.title}</h3>

                                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#888' }}>
                                        🗓️ {t('date.posted')} {new Date(post.created_at).toLocaleDateString()}
                                    </p>

                                    <p style={{ margin: '0 0 1rem', color: '#666' }}>
                                        💖 {t('feed.upvotes')}: {post.upvotes}
                                    </p>

                                    <Link to={`/post/${post.id}`} className="btn-miraland btn-pink" style={{ display: 'block', marginTop: '1rem' }}>
                                        {t('feed.read_more')}
                                    </Link>
                                </div>
                            </div>
                        </Tilt>
                        ))
                    )}
                </div>
            )}

            {/* Load More Button */}
            {!isLoading && visibleCount < posts.length && (
                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                    <button
                        onClick={() => setVisibleCount(prev => prev + 6)}
                        className='btn-miraland btn-gold'
                        style={{ padding: '1rem 3rem', fontSize: '1.2rem', boxShadow: '0 8px 25px rgba(218, 165, 32, 0.4)' }}
                    >
                        ✨ Load More Archives
                    </button>
                </div>
            )}




        </div>
    );
}