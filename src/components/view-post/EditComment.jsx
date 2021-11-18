import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import FirebaseContext from '../../contexts/Firebase';
import useUserWhoCommented from '../../hooks/UseUserWhoCommented';

export default function EditComment({ docId, title, language, displayName, comment, commentInput, yourOwnComment, isTabletOrMobile }) {
    const { firebase, FieldValue } = useContext(FirebaseContext);
    const [showForm, setShowForm] = useState(false);
    const { user } = useUserWhoCommented(displayName);
    const [commentToBeEdited, setCommentToBeEdited] = useState(comment);
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
    const handleEditComment = async (e) => {
        e.preventDefault();
        await firebase
            .firestore()
            .collection('posts')
            .doc(docId)
            .update({
                comments: FieldValue.arrayRemove({ displayName, comment })
            });
        await firebase
            .firestore()
            .collection('posts')
            .doc(docId)
            .update({
                comments: FieldValue.arrayUnion({ displayName: user.username, comment: commentToBeEdited })
            });
        await firebase
            .firestore()
            .collection('users')
            .doc(user?.docId)
            .update({
                ownComments: FieldValue.arrayRemove({ comment, title })
            });
        await firebase
            .firestore()
            .collection('users')
            .doc(user?.docId)
            .update({
                ownComments: FieldValue.arrayUnion({ comment: commentToBeEdited, title })
            });
        window.location.reload();
    };
    const useStyles = makeStyles((theme) => ({
        root: {
            '& .MuiTextField-root': {
                margin: theme.spacing(1),
                width: '25ch',
            },
        },
    }));
    const classes = useStyles();

    return (
        <>
            <FontAwesomeIcon title="Szerkesztés" data-testid="show-edit-form" className="btn btn-warning m-1"
                style={{ width: "40px", height: "40px" }} onClick={() => setShowForm(!showForm)} icon={faPencilAlt}
            />
            <Grid container
                direction="column"
                justifyContent="center"
                alignItems="center">
                {
                    showForm && (
                        <form data-testid="edit-comment-submit" className={classes.root} noValidate autoComplete="off" method="POST"
                            onSubmit={handleEditComment}>
                            <Grid container
                                direction="column"
                                justifyContent="center"
                                alignItems="center">
                                <hr className="mx-auto" style={{ width: isTabletOrMobile ? 250 : 700 }} />
                                <h5>{language === "Hungarian" ? "Hozzászólás szerkesztése" : "Edit comment"}</h5>
                                <TextField
                                    size={isTabletOrMobile ? "small" : ""}
                                    inputProps={{ "data-testid": "input-edit-comment" }}
                                    aria-label={language === "Hungarian" ? "Hozzászólás szerkesztése" : "Edit comment"}
                                    autoComplete="off"
                                    type="text"
                                    name="edit-comment"
                                    style={{ width: isTabletOrMobile ? 250 : 700 }}
                                    value={commentToBeEdited || ""}
                                    onChange={({ target }) => setCommentToBeEdited(target.value)}
                                    ref={commentInput}
                                />
                                <div className="m-2">
                                </div>
                                <Grid container spacing={2}
                                    direction="row"
                                    justifyContent="space-evenly"
                                    alignItems="stretch">
                                    <Button
                                        size={isTabletOrMobile ? "small" : ""}
                                        data-testid="edit-comment-modal-button"
                                        variant="contained"
                                        color="primary"
                                        disabled={comment.length < 1}
                                        onClick={handleOpen}
                                    >
                                        {language === "Hungarian" ? "Szerkesztés" : "Edit"}
                                    </Button>
                                    <Button size={isTabletOrMobile ? "small" : ""} data-testid="edit-comment-return" variant="contained" color="secondary" onClick={() => {
                                        setShowForm(!showForm);
                                    }}>
                                        {language === "Hungarian" ? "Vissza" : "Return"}
                                    </Button>
                                    <Modal
                                        open={open}
                                        onClose={handleClose}
                                        aria-labelledby="edit-comment-modal"
                                        aria-describedby="edit-comment-modal-description"
                                    >
                                        <Box sx={style}>
                                            <Typography id="edit-comment-modal" variant="h6" component="h2">
                                                {language === "Hungarian" && !yourOwnComment && <p>Biztos benne, hogy szerkeszti {displayName} hozzászólását?</p>}
                                                {language === "Hungarian" && yourOwnComment && <p>Biztos benne, hogy szerkeszti a hozzászólását?</p>}
                                                {language === "English" && !yourOwnComment && displayName.endsWith("s") && <p>Are you sure you would like to edit {displayName}' comment?</p>}
                                                {language === "English" && !yourOwnComment && !displayName.endsWith("s") && <p>Are you sure you would like to edit {displayName}'s comment?</p>}
                                                {language === "English" && yourOwnComment && <p>Are you sure you would like to edit your comment?</p>}
                                            </Typography>
                                            <Typography id="edit-comment-modal-description" sx={{ mt: 2 }}>
                                                <Button size={isTabletOrMobile ? "small" : ""} data-testid="edit-comment-edit" variant="contained" color="secondary" style={{ marginRight: "10px" }} type="submit"
                                                    onClick={handleEditComment}>
                                                    {language === "Hungarian" ? "Szerkesztés" : "Edit"}
                                                </Button>
                                                <Button size={isTabletOrMobile ? "small" : ""} data-testid="edit-comment-return-modal" variant="contained" color="primary" onClick={() => {
                                                    handleClose();
                                                }}>
                                                    {language === "Hungarian" ? "Vissza" : "Return"}
                                                </Button>
                                            </Typography>
                                        </Box>
                                    </Modal>
                                </Grid>
                            </Grid>
                            <hr className="mx-auto" style={{ width: isTabletOrMobile ? 250 : 700 }} />
                        </form>
                    )
                }
            </Grid>
        </>
    )
}

EditComment.propTypes = {
    docId: PropTypes.string,
    title: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    comment: PropTypes.string.isRequired,
    commentInput: PropTypes.object,
    yourOwnComment: PropTypes.bool.isRequired,
    isTabletOrMobile: PropTypes.bool.isRequired
};