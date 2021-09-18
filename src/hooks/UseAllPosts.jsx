import { useState, useEffect } from 'react';
import { getAllPosts } from '../services/Firebase';

export default function useAllPosts() {
    const [allPosts, setAllPosts] = useState();

    useEffect(() => {
        async function getPosts() {
            const [{posts}] = await getAllPosts();

            console.log(posts);
            setAllPosts(posts || {});
        }

        getPosts();
    }, []);

    return { allPosts };
}