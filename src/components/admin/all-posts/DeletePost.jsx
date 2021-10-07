import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import FirebaseContext from '../../../contexts/Firebase';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function DeletePost({ allPosts, setAllPosts, post }) {
    const { firebase } = useContext(FirebaseContext);
    const [postToBeDeleted, setPostToBeDeleted] = useState(post);

    return (
        <button className="btn btn-danger m-1" style={{ width: "50px", height: "50px" }} onClick={async () => {
            setAllPosts(allPosts.filter(item => item !== postToBeDeleted));
            firebase.firestore().collection('posts').doc(post?.id).delete();
            setPostToBeDeleted();
        }}>
            <FontAwesomeIcon icon={faTrash} />
        </button>
    )
}

DeletePost.propTypes = {
    allPosts: PropTypes.object.isRequired,
    setAllPosts: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired
};