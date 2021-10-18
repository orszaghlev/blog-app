import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import FirebaseContext from '../../contexts/Firebase';
import useUserWhoCommented from '../../hooks/UseUserWhoCommented';

export default function DeleteComment({ docId, title, displayName, comment, comments, setComments }) {
    const { firebase, FieldValue } = useContext(FirebaseContext);
    const { user } = useUserWhoCommented(displayName);
    const [commentToBeDeleted, setCommentToBeDeleted] = useState(comment);
    const handleDeleteComment = () => {
        setComments(comments.filter(item => item.comment !== commentToBeDeleted));
        setCommentToBeDeleted('');
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
        <button data-testid="delete-comment" className="btn btn-danger m-1" style={{ width: "40px", height: "40px" }} onClick={() => {
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
    comment: PropTypes.string.isRequired,
    comments: PropTypes.array.isRequired,
    setComments: PropTypes.func.isRequired
};