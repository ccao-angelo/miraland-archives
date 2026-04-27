import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useTranslation } from 'react-i18next';
import { arenaData } from '../arenaData';

export default function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [toastMessage, setToastMessage] = useState('');

    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    // 1. Fetch Post and Comment on load
    useEffect(() => {
        fetchPostData();
    }, [id]);

    const fetchPostData = async () => {
        // Get the post
        const { data: postData } = await supabase
            .from('lore_posts')
            .select()
            .eq('id', id)
            .single();
        
        setPost(postData);

        // Get the comments
        const { data: commentData } = await supabase
            .from('comments')
            .select()
            .eq('post_id', id)
            .order('created_at', { ascending: false });

        setComments(commentData || []);
    };

    // 2. Upvote Logic
    const handleUpvote = async () => {
        const newUpvoteCount = post.upvotes + 1;

        const { error } = await supabase
            .from('lore_posts')
            .update({ upvotes: newUpvoteCount })
            .eq('id', id);

        if (!error) {
            setPost({ ...post, upvotes: newUpvoteCount });
        }
    };

    // 3. Comment Logic
    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const { error } = await supabase
            .from('comments')
            .insert([{ post_id: id, content: newComment }]);

        if (!error) {
            setNewComment('');
            fetchPostData();
        }
    };

    // 4. Secret Key Delete Logic
    const handleDelete = async () => {
        const userAttempt = window.prompt(t('detail.prompt_key'));

        if(userAttempt == post.secret_key) {
            // Delete image from storage to save space
            const fileName = post.image_url.split('/').pop();
            await supabase.storage.from('suit_images').remove([fileName]);

            // Delete post from database
            await supabase.from('lore_posts').delete().eq('id', id);

            setToastMessage("🗑️ Archive Deleted.");
            setTimeout(() => navigate('/'), 2000);
        } else {
            alert(t('detail.wrong_key'));
        }
    };

    if (!post) return <h2 style={{ textAlign: 'center', padding: '2rem' }}>Loading Archive...</h2>;

    // 5. Check Key and Enter Edit Mode
    const handleEditClick = () => {
        const userAttempt = window.prompt(t('detail.prompt_key'));
        if (userAttempt === post.secret_key) {
            setEditTitle(post.title);
            setEditContent(post.content);
            setIsEditing(true); // Turn the page into edit mode
        } else {
            alert(t('detail.wrong_key'));
        }
    };

    // 6. Save the Edited Data to Supabase
    const handleSaveEdit = async () => {
        const { error } = await supabase
            .from('lore_posts')
            .update({ title: editTitle, content: editContent })
            .eq('id', id);
        
        if (!error) {
            setPost({ ...post, title: editTitle, content: editContent});
            setIsEditing(false); // Turn off edit mode
            setToastMessage("✨ Archive Successfully Updated!");
            setTimeout(() => setToastMessage(''), 3000); // Clear the message after 3s
        } else {
            console.error(error);
            alert("Error updating archive.");
        }
    };

    return (
        <div className="glass-card" style={{ maxWidth: '900px', margin: '2rem auto', padding: '2rem' }}>
            {toastMessage && <div className="toast-notification">{toastMessage}</div>}
            
            <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap', alignItems: 'flex-start', padding: '2rem', background: 'rgba(255, 255, 255, 0.5)', borderRadius: '12px' }}>
                <div style={{ flex: '1', minWidth: '300px' }}>
                    <img
                    src={post.image_url}
                    alt={post.title}
                    loading="lazy"
                    style={{
                        width: '100%',
                        borderRadius: '12px',
                        objectFit: 'cover',
                        objectPosition: 'top center',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
                    }} />
                </div>

                { /* Lore & Controls */}
                <div style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column' }}>
                    
                    {/* Top Bar: Badge & Action Buttons */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                        <span style={{ background: '#fff0f5', color: '#ff69b4', border: '1px solid #ffb6c1', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                            {t('categories.' + post.category)} • {t('nations.' + post.nation_flag)}
                        </span>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={handleEditClick} className="btn-miraland btn-gold" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                                ✏️ {t('detail.edit')}
                            </button>
                            <button onClick={handleDelete} className="btn-miraland btn-red" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                                🗑️ {t('detail.delete')}
                            </button>
                        </div>
                    </div>

                    {/* CONDITIONAL RENDERING: Edit Mode vs View Mode */}
                    {isEditing ? (
                        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                style={{ fontSize: '2rem', fontWeight: 'bold', padding: '0.5rem', width: '100%', fontFamily: 'Playfair Display, serif', color: '#ff69b4' }}
                            />
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                rows="8"
                                style={{ padding: '1rem', width: '100%', fontFamily: 'inherit', lineHeight: '1.6' }}
                            ></textarea>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button onClick={handleSaveEdit} className="btn-miraland btn-pink">
                                    ✅ {t('detail.save')}
                                </button>
                                <button onClick={() => setIsEditing(false)} className="btn-miraland" style={{ background: '#95a5a6', color: 'white' }}>
                                    ❌ {t('detail.cancel')}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                        <h1 style={{ margin: '1.5rem 0 1rem 0', fontSize: '2.5rem', lineHeight: '1.2' }}>{post.title}</h1>
                        <p style={{ lineHeight: '1.8', color: '#555', whiteSpace: 'pre-wrap', fontSize: '1.05rem' }}>{post.content}</p>

                        {post.theme_name && arenaData[post.theme_name] && (
                            <div style={{
                                marginTop: '2rem',
                                padding: '1.5rem',
                                borderRadius: '12px',
                                backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.6)), url(${arenaData[post.theme_name].bgUrl})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                border: '2px solid var(--nikki-pink)',
                                boxShadow: 'var(--magical-shadow)'
                            }}>
                                <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--nikki-dark-pink)', textShadow: '0 2px 4px rgba(255, 255, 255, 0.9)' }}>
                                    👑 {arenaData[post.theme_name].name[i18n.language]}
                                </h3>
                                <p style={{ margin: 0, fontWeight: 'bold', color: '#333', textShadow: '0 2px 4px rgba(255,255,255,0.9)' }}>
                                    {t('form.attributes')} {arenaData[post.theme_name].attributes[i18n.language].join(' | ')}
                                </p>
                            </div>
                        )}

                        <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
                            <button onClick={handleUpvote} className="btn-miraland btn-pink" style={{ fontSize: '1.1rem', padding: '1rem 2rem', boxShadow: '0 8px 25px rgba(255, 105, 180, 0.4)' }}>
                                💖 {post.upvotes} {t('detail.upvote')}
                            </button>
                        </div>
                    </>
                    )}
                </div>
            </div>

            <hr style={{ margin: '3rem 0', border: '1px solid #eee' }} />

            {/* Comment Section */}
            <div>
                <h3>💬 {t('detail.comments')} ({comments.length})</h3>

                <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={t('detail.add_comment')}
                        style={{ flex: '1', padding: '0.8rem', borderRadius: '5px', border: '1px solid #ccc' }}
                        required
                    />
                    <button type="submit" className="btn-magical" style={{ background: '#333', color: 'white', padding: '0 1.5rem', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>
                        {t('detail.submit_comment')}
                    </button>
                </form>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {comments.map(comment => (
                        <div key={comment.id} style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '8px' }}>
                            <p style={{ margin: 0 }}>{comment.content}</p>
                            <small style={{ color: '#888' }}>{new Date(comment.created_at).toLocaleString()}</small>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}