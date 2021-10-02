import PropTypes from 'prop-types';
import { firebase } from "../../../lib/Firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function DeletePost({ post }) {
    return (
        <button className="btn btn-danger m-1" style={{ width: "50px", height: "50px" }} onClick={async () => {
            firebase.firestore().collection('posts').doc(post?.id).delete().then(() => {
            });
        }}>
            <FontAwesomeIcon icon={faTrash} />
        </button>
    )
}

DeletePost.propTypes = {
    post: PropTypes.object.isRequired
};