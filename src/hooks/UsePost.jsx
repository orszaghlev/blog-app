import { useState, useEffect } from 'react';
import { getPostByPostSlug } from '../services/Firebase';
import PropTypes from 'prop-types';

export default function usePost(postSlug) {
    const [activePost, setActivePost] = useState();

    useEffect(() => {
        async function getPostObjByPostSlug(postSlug) {
            const [post] = await getPostByPostSlug(postSlug);
            setActivePost(post || {});
        }

        if (postSlug) {
            getPostObjByPostSlug(postSlug);
        }
    }, [postSlug]);

    return { post: activePost };
}

usePost.propTypes = {
    postSlug: PropTypes.string.isRequired
};