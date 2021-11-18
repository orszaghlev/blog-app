import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import FirebaseContext from '../../../contexts/Firebase';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

export default function DuplicatePost({ post, isTabletOrMobile }) {
    const { firebase } = useContext(FirebaseContext);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: isTabletOrMobile ? 300 : 500,
        boxShadow: 24,
        p: 4,
    };
    const handleDuplicatePost = async () => {
        const data = {
            id: post?.id + "_masolat",
            title: post?.title + " (másolat)",
            slug: post?.slug + "-masolat",
            description: post?.description,
            content: post?.content,
            imgURL: post?.imgURL,
            tag: post?.tag,
            language: post?.language,
            isActive: post?.isActive,
            date: new Date().toLocaleTimeString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
            comments: [],
            saves: []
        };
        await firebase.firestore().collection('posts').doc(data.id).set(data);
        window.location.reload();
    };

    return (
        <>
            <button data-testid="duplicate-post-button" className="btn btn-primary m-1" style={{ width: "40px", height: "40px" }} onClick={handleOpen}>
                <FontAwesomeIcon icon={faCopy} title="Duplikálás" />
            </button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="duplicate-post-modal"
                aria-describedby="duplicate-post-modal-description"
            >
                <Box sx={style}>
                    <Typography id="duplicate-post-modal" variant="h6" component="h2">
                        Biztos benne, hogy duplikálja a(z) {post?.title} bejegyzést?
                    </Typography>
                    <Typography id="duplicate-post-modal-description" sx={{ mt: 2 }}>
                        <Button size={isTabletOrMobile ? "small" : "medium"} data-testid="duplicate-post-duplicate" variant="contained" color="secondary" style={{ marginRight: "10px" }} onClick={handleDuplicatePost}>
                            Duplikálás
                        </Button>
                        <Button size={isTabletOrMobile ? "small" : "medium"} data-testid="duplicate-post-return" variant="contained" color="primary" onClick={() => {
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

DuplicatePost.propTypes = {
    post: PropTypes.object.isRequired,
    isTabletOrMobile: PropTypes.bool.isRequired
};