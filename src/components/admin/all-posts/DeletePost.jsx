import { useContext } from 'react';
import PropTypes from 'prop-types';
import FirebaseContext from '../../../contexts/Firebase';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function DeletePost({ post }) {
    const { firebase } = useContext(FirebaseContext);

    return (
        <button data-testid="delete-post-button" className="btn btn-danger m-1" style={{ width: "50px", height: "50px" }} onClick={async () => {
            await firebase.firestore().collection('posts').doc(post?.id).delete();
            window.location.reload();
        }}>
            <FontAwesomeIcon icon={faTrash} />
        </button>
    )
}

DeletePost.propTypes = {
    post: PropTypes.object.isRequired
};