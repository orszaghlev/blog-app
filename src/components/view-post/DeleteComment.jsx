import { useContext } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import FirebaseContext from '../../contexts/Firebase';
import useUserWhoCommented from '../../hooks/UseUserWhoCommented';

export default function DeleteComment({ docId, title, displayName, comment }) {
    const { firebase, FieldValue } = useContext(FirebaseContext);
    const { user } = useUserWhoCommented(displayName);
    const handleDeleteComment = () => {
        firebase
            .firestore()
            .collection('posts')
            .doc(docId)
            .update({
                comments: FieldValue.arrayRemove({ displayName, comment })
            });
        firebase
            .firestore()
            .collection('users')
            .doc(user?.docId)
            .update({
                ownComments: FieldValue.arrayRemove({ comment, title })
            });
    };

    return (
        <button className="btn btn-danger m-1" style={{ width: "40px", height: "40px" }} onClick={() => {
            handleDeleteComment();
        }}>
            <FontAwesomeIcon icon={faTrash} />
        </button>
    )
}

DeleteComment.propTypes = {
    docId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    comment: PropTypes.string.isRequired
};