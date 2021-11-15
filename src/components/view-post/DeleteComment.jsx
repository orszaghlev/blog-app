import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import FirebaseContext from '../../contexts/Firebase';
import useUserWhoCommented from '../../hooks/UseUserWhoCommented';

export default function DeleteComment({ docId, title, language, displayName, comment, yourOwnComment }) {
    const { firebase, FieldValue } = useContext(FirebaseContext);
    const { user } = useUserWhoCommented(displayName);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 300,
        boxShadow: 24,
        p: 4,
    };
    const handleDeleteComment = async () => {
        await firebase
            .firestore()
            .collection('posts')
            .doc(docId)
            .update({
                comments: FieldValue.arrayRemove({ displayName, comment })
            });
        await firebase
            .firestore()
            .collection('users')
            .doc(user?.docId)
            .update({
                ownComments: FieldValue.arrayRemove({ comment, title })
            });
        window.location.reload();
    };

    return (
        <>
            <FontAwesomeIcon title="Törlés" data-testid="delete-comment" className="btn btn-danger m-1"
                style={{ width: "40px", height: "40px" }} onClick={handleOpen} icon={faTrash}
            />
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="delete-comment-modal"
                aria-describedby="delete-comment-modal-description"
            >
                <Box sx={style}>
                    <Typography id="delete-comment-modal" variant="h6" component="h2">
                        {language === "Hungarian" && !yourOwnComment && <p>Biztos benne, hogy törli {displayName} hozzászólását?</p>}
                        {language === "Hungarian" && yourOwnComment && <p>Biztos benne, hogy törli a hozzászólását?</p>}
                        {language === "English" && !yourOwnComment && displayName.endsWith("s") && <p>Are you sure you would like to delete {displayName}' comment?</p>}
                        {language === "English" && !yourOwnComment && !displayName.endsWith("s") && <p>Are you sure you would like to delete {displayName}'s comment?</p>}
                        {language === "English" && yourOwnComment && <p>Are you sure you would like to delete your comment?</p>}
                    </Typography>
                    <Typography id="delete-comment-modal-description" sx={{ mt: 2 }}>
                        <Button data-testid="delete-comment-delete" variant="contained" color="secondary" style={{ marginRight: "10px" }} onClick={handleDeleteComment}>
                            {language === "Hungarian" ? "Törlés" : "Delete"}
                        </Button>
                        <Button data-testid="delete-comment-return" variant="contained" color="primary" onClick={() => {
                            handleClose();
                        }}>
                            {language === "Hungarian" ? "Vissza" : "Return"}
                        </Button>
                    </Typography>
                </Box>
            </Modal>
        </>
    )
}

DeleteComment.propTypes = {
    docId: PropTypes.string,
    title: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    comment: PropTypes.string.isRequired,
    yourOwnComment: PropTypes.bool.isRequired
};