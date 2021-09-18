import { useState, useEffect } from 'react';
import { getPostByPostId } from '../services/Firebase';

export default function usePost(postId) {
    const [activePost, setActivePost] = useState();

    useEffect(() => {
        async function getPostObjByPostId(postId) {
            const [post] = await getPostByPostId(postId);
            setActivePost(post || {});
        }

        if (postId) {
            getPostObjByPostId(postId);
        }
    }, [postId]);

    return { post: activePost };
}