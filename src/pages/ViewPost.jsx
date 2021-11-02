import { useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from "framer-motion";
import usePost from "../hooks/UsePost";
import useUser from "../hooks/UseUser";
import UserContext from '../contexts/User';
import LoggedInUserContext from "../contexts/LoggedInUser";
import PostNotAvailable from "../components/view-post/PostNotAvailable";
import PostInactive from "../components/view-post/PostInactive";
import ShowPost from "../components/view-post/ShowPost";
import ShowComments from "../components/view-post/ShowComments";

export default function ViewPost() {
    const { slug } = useParams();
    const { user: loggedInUser } = useContext(UserContext);
    const { user } = useUser(loggedInUser?.uid);
    const { post } = usePost(slug);
    const commentInput = useRef(null);

    useEffect(() => {
        if (post && post?.isActive === "true" && (new Date(post?.date).getTime() <= new Date().getTime())) {
            document.title = post?.title;
        } else {
            document.title = "Bejegyzés";
        }
    }, [post]);

    return (
        <div className="m-auto text-center" style={{ width: "1000px" }}>
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
                {!post?.title ? <PostNotAvailable /> : (post?.isActive !== "true" ||
                    (new Date(post?.date).getTime() >= new Date().getTime()) ? <PostInactive post={post} /> :
                    <>
                        <LoggedInUserContext.Provider value={{ user }}>
                            <ShowPost post={post} user={user} />
                            <hr />
                            <ShowComments
                                docId={post?.docId}
                                title={post?.title}
                                language={post?.language}
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