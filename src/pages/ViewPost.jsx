import { useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
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

    return (
        <div className="m-auto text-center" style={{ width: "1000px" }}>
            <Helmet>
                <title>{post ? post?.title : "Bejegyzés"}</title>
                <meta name="description" content={post ? post?.description : "Bejegyzés"} />
            </Helmet>
            <motion.div initial="hidden" animate="visible" variants={{
                hidden: {
                    scale: .8,
                    opacity: 0
                },
                visible: {
                    scale: 1,
                    opacity: 1,
                    transition: {
                        delay: .4
                    }
                },
            }}>
                {!post ? <PostNotAvailable /> : (post?.isActive?.toString() !== "true" ||
                    (new Date(post?.date).getTime() >= new Date().getTime()) ? <PostInactive /> :
                    <>
                        <LoggedInUserContext.Provider value={{ user }}>
                            <ShowPost post={post} user={user} />
                            <hr />
                            <ShowComments
                                docId={post?.docId}
                                title={post?.title}
                                comments={post?.comments}
                                posted={post?.date}
                                commentInput={commentInput}
                                user={user}
                            />
                        </LoggedInUserContext.Provider>
                    </>)}
            </motion.div>
        </div>
    )
}

ViewPost.propTypes = {
    props: PropTypes.object.isRequired
};