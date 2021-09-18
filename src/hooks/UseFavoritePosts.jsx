import { useState, useEffect } from 'react';
import { getFavoritePosts } from '../services/firebase';

export default function useFavoritePosts(user) {
    const [favoritePosts, setFavoritePosts] = useState(null);

    useEffect(() => {
        async function getUserFavoritePosts() {
            if (user?.favoritePosts?.length > 0) {
                const savedPosts = await getFavoritePosts(user.userId, user.favoritePosts);
                savedPosts.sort((a, b) => b.date - a.date);
                setFavoritePosts(savedPosts);
            }
        }
        getUserFavoritePosts();
    }, [user?.userId, user?.favoritePosts]);

    return { favoritePosts };
}