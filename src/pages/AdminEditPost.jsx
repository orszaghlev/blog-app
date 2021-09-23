import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { firebase } from "../lib/Firebase";
import PostNotAvailable from "../components/admin/edit-post/PostNotAvailable";
import UnauthorizedAccess from "../components/admin/edit-post/UnauthorizedAccess";
import usePost from "../hooks/UsePost";
import ShowEditPost from "../components/admin/edit-post/ShowEditPost";

export function AdminEditPost(props) {
    const { post } = usePost(props.match.params.slug);
    const [isSignedIn, setIsSignedIn] = useState(false);

    useEffect(() => {
        const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
            setIsSignedIn(!!user);
        });
        return () => unregisterAuthObserver();
    }, [])

    return (
        <div className="p-3 content text-center m-auto" style={{ width: "1000px" }}>
            <Helmet>
                <title>Bejegyzés szerkesztése</title>
                <meta name="description" content="Bejegyzés szerkesztése" />
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
                {!post ? <PostNotAvailable /> : (!isSignedIn || firebase.auth().currentUser.uid !== process.env.REACT_APP_FIREBASE_ADMIN_UID ? <UnauthorizedAccess /> : <ShowEditPost post={post} />)}
            </motion.div>
        </div>
    )
}

AdminEditPost.propTypes = {
    props: PropTypes.object.isRequired
};