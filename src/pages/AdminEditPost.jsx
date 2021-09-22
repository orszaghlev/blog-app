import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
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

    if (!post) {
        return <PostNotAvailable />
    } else if (!isSignedIn || firebase.auth().currentUser.uid !== process.env.REACT_APP_FIREBASE_ADMIN_UID) {
        return <UnauthorizedAccess />
    } else {
        return <ShowEditPost post={post} />
    }
}

AdminEditPost.propTypes = {
    props: PropTypes.object.isRequired
};