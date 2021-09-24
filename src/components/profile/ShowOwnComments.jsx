import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getAllPosts } from '../../services/Firebase';

export default function ShowOwnComments({ user }) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        async function getPosts() {
            const posts = await getAllPosts();
            setPosts(posts);
        }

        getPosts();
    }, []);

    return (
        <>
            <div>
                <h5>Saját hozzászólások</h5>
                {posts?.map((post) => (
                    post?.comments?.map((comment) => (
                        <div>
                            <p>{comment?.displayName === user?.username ? comment?.comment : ""}</p>
                        </div>
                    ))
                ))}
                <hr />
            </div>
        </>
    )
}

ShowOwnComments.propTypes = {
    user: PropTypes.object.isRequired
};