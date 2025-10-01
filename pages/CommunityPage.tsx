import React from 'react';
import Card from '../components/ui/Card';
import { useLanguage, useUser } from '../AppContext';

const NewPostModal: React.FC<{ onClose: () => void; onPost: (title: string, content: string) => void; }> = ({ onClose, onPost }) => {
    const { t } = useLanguage();
    const [title, setTitle] = React.useState('');
    const [content, setContent] = React.useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim() && content.trim()) {
            onPost(title, content);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">{t('createDiscussionTitle')}</h2>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('title')}</label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder={t('titlePlaceholder')}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('content')}</label>
                            <textarea
                                id="content"
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                rows={5}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder={t('contentPlaceholder')}
                                required
                            />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">{t('cancel')}</button>
                        <button type="submit" className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">{t('post')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || 'h-5 w-5'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const CommunityPage: React.FC = () => {
    const { t } = useLanguage();
    const { 
        userProfile,
        posts, 
        addNewPost,
        deletePost,
        deleteComment,
        postComment,
        toggleComments,
        handleCommentChange
    } = useUser();
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const handleAddNewPost = (title: string, content: string) => {
        addNewPost(title, content);
        setIsModalOpen(false);
    };

    return (
        <>
            {isModalOpen && <NewPostModal onClose={() => setIsModalOpen(false)} onPost={handleAddNewPost} />}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('communityHub')}</h1>
                    <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
                        {t('newDiscussion')}
                    </button>
                </div>
                {posts.map(post => (
                    <Card key={post.id} className="p-0 overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <img src={post.avatar} alt={post.author} className="w-12 h-12 rounded-full object-cover" />
                                    <div>
                                        <p className="font-semibold text-gray-800 dark:text-gray-100">{post.title}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('postedBy')} {post.author} &bull; {post.date}</p>
                                    </div>
                                </div>
                                {post.authorId === userProfile.id && (
                                    <button onClick={() => deletePost(post.id)} className="p-1 text-red-600 dark:text-red-500 flex-shrink-0" aria-label={t('delete')}>
                                        <TrashIcon />
                                    </button>
                                )}
                            </div>
                            <p className="mt-4 text-gray-600 dark:text-gray-300">{post.content}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-3 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                            <div className="flex items-center gap-6">
                                <span className="flex items-center gap-1.5">{post.comments.length} {t('replies')}</span>
                                <span className="flex items-center gap-1.5">{post.views} {t('views')}</span>
                            </div>
                            <button onClick={() => toggleComments(post.id)} className="font-semibold text-green-600 dark:text-green-400 hover:underline">
                                {post.showComments ? t('cancel') : `${t('comment')}`}
                            </button>
                        </div>
                        {post.showComments && (
                            <div className="p-6 border-t dark:border-gray-700">
                                <div className="space-y-4">
                                    {post.comments.map(comment => (
                                        <div key={comment.id} className="flex items-start gap-3">
                                            <img src={comment.avatar} alt={comment.author} className="w-9 h-9 rounded-full object-cover" />
                                            <div className="flex-1 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                                                <div className="flex justify-between items-center">
                                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{comment.author}</p>
                                                     {comment.authorId === userProfile.id && (
                                                        <button onClick={() => deleteComment(post.id, comment.id)} className="text-red-600 dark:text-red-500 flex-shrink-0" aria-label={t('delete')}>
                                                            <TrashIcon className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{comment.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="flex items-start gap-3 pt-4">
                                        <img src={userProfile.avatar} alt={userProfile.name} className="w-9 h-9 rounded-full object-cover" />
                                        <div className="flex-1">
                                            <textarea
                                                value={post.newCommentText}
                                                onChange={e => handleCommentChange(post.id, e.target.value)}
                                                rows={2}
                                                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                placeholder={t('addReplyPlaceholder')}
                                            />
                                            <button 
                                                onClick={() => postComment(post.id)} 
                                                disabled={!post.newCommentText.trim()}
                                                className="mt-2 px-4 py-1.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-colors text-sm">
                                                {t('post')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>
                ))}
            </div>
        </>
    );
};

export default CommunityPage;