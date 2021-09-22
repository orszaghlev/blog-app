import { useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import PostNotAvailable from "../components/view-post/PostNotAvailable";
import PostInactive from "../components/view-post/PostInactive";
import usePost from "../hooks/UsePost";
import useUser from "../hooks/UseUser";
import UserContext from '../contexts/User';
import LoggedInUserContext from "../contexts/LoggedInUser";
import ShowPost from "../components/view-post/ShowPost";
import ShowComments from "../components/view-post/ShowComments";

export function ViewPost(props) {
    const { user: loggedInUser } = useContext(UserContext);
    const { user } = useUser(loggedInUser?.uid);
    const { post } = usePost(props.match.params.slug);
    const commentInput = useRef(null);

    if (!post) {
        return <PostNotAvailable />
    } else if (post?.isActive?.toString() !== "true" ||
        (new Date(post?.date).getTime() >= new Date().getTime())) {
        return <PostInactive />
    } else {
        return (
            <>
                <LoggedInUserContext.Provider value={{ user }}>
                    <ShowPost post={post} user={user} />
                    <ShowComments
                        docId={post?.docId}
                        comments={post?.comments}
                        posted={post?.date}
                        commentInput={commentInput}
                        user={user}
                    />
                </LoggedInUserContext.Provider>
            </>
        )
    }
}

ViewPost.propTypes = {
    props: PropTypes.object.isRequired
};