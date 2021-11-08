import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import FirebaseContext from '../../../contexts/Firebase';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function DeletePost({ post }) {
    const { firebase } = useContext(FirebaseContext);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        boxShadow: 24,
        p: 4,
    };
    const handleDeletePost = async () => {
        await firebase.firestore().collection('posts').doc(post?.id).delete();
        window.location.reload();
    };

    return (
        <>
            <button data-testid="delete-post-button" className="btn btn-danger m-1" style={{ width: "50px", height: "50px" }} onClick={handleOpen}>
                <FontAwesomeIcon icon={faTrash} title="Törlés" />
            </button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="delete-post-modal"
                aria-describedby="delete-post-modal-description"
            >
                <Box sx={style}>
                    <Typography id="delete-post-modal" variant="h6" component="h2">
                        Biztos benne, hogy törli a(z) {post?.title} bejegyzést?
                    </Typography>
                    <Typography id="delete-post-modal-description" sx={{ mt: 2 }}>
                        <Button data-testid="delete-post-delete" variant="contained" color="secondary" style={{ marginRight: "10px" }} onClick={handleDeletePost}>
                            Törlés
                        </Button>
                        <Button data-testid="delete-post-return" variant="contained" color="primary" onClick={() => {
                            handleClose();
                        }}>
                            Vissza
                        </Button>
                    </Typography>
                </Box>
            </Modal>
        </>
    )
}

DeletePost.propTypes = {
    post: PropTypes.object.isRequired
};