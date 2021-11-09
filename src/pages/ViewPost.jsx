import { useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from "framer-motion";
import usePost from "../hooks/UsePost";
import useUser from "../hooks/UseUser";
import UserContext from '../contexts/User';
import LoggedInUserContext from "../contexts/LoggedInUser";
import ShowPost from "../components/view-post/ShowPost";
import ShowComments from "../components/view-post/ShowComments";
import MetaTags from 'react-meta-tags';

export default function ViewPost() {
    const { slug } = useParams();
    const { user: loggedInUser } = useContext(UserContext);
    const { user } = useUser(loggedInUser?.uid);
    const { post } = usePost(slug);
    const commentInput = useRef(null);

    useEffect(() => {
        if (post?.isActive === "true" && (new Date(post?.date).getTime() <= new Date().getTime())) {
            document.title = `${post?.title} | ${process.env.REACT_APP_FIREBASE_APP_NAME}`;
        } else {
            document.title = `Bejegyzés | ${process.env.REACT_APP_FIREBASE_APP_NAME}`;
        }
    }, [post]);

    return (
        <div className="m-auto text-center" style={{ width: "1000px" }}>
            <MetaTags>
                <meta name="description" content="Ha a vendég egy aktív bejegyzést kért le, akkor ezen az oldalon olvashatja el annak teljes tartalmát." />
                <meta property="og:title" content="Bejegyzés" />
                <meta property="og:description" content="Ha a vendég egy aktív bejegyzést kért le, akkor ezen az oldalon olvashatja el annak teljes tartalmát." />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="%REACT_APP_FIREBASE_APP_NAME%" />
                <meta property="og:locale" content="hu_HU" />
                <meta property="og:locale:alternate" content="en_US" />
            </MetaTags>
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
                {post?.isActive === "true" && (new Date(post?.date).getTime() <= new Date().getTime()) &&
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
                    </>
                }
            </motion.div>
        </div>
    )
}