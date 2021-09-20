import { useState, useEffect } from 'react';
import { getAllPosts } from '../services/Firebase';

export default function useAllPosts() {
    const [allPosts, setAllPosts] = useState(null);

    useEffect(() => {
        async function getPosts() {
            const posts = await getAllPosts();
            setAllPosts(posts);
        }

        getPosts();
    }, []);

    return { allPosts };
}