import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import FirebaseContext from '../../contexts/Firebase';
import useUserWhoCommented from '../../hooks/UseUserWhoCommented';

export default function EditComment({ docId, title, language, displayName, comment, comments, setComments, commentInput }) {
    const { firebase, FieldValue } = useContext(FirebaseContext);
    const [showForm, setShowForm] = useState(false);
    const { user } = useUserWhoCommented(displayName);
    const [commentToBeEdited, setCommentToBeEdited] = useState(comment);
    const handleEditComment = (e) => {
        e.preventDefault();
        setComments([...comments, { displayName: user.username, comment: commentToBeEdited }].filter(item => item.comment !== comment));
        firebase
            .firestore()
            .collection('posts')
            .doc(docId)
            .update({
                comments: FieldValue.arrayRemove({ displayName, comment })
            });
        firebase
            .firestore()
            .collection('posts')
            .doc(docId)
            .update({
                comments: FieldValue.arrayUnion({ displayName: user.username, comment: commentToBeEdited })
            });
        firebase
            .firestore()
            .collection('users')
            .doc(user?.docId)
            .update({
                ownComments: FieldValue.arrayRemove({ comment, title })
            });
        firebase
            .firestore()
            .collection('users')
            .doc(user?.docId)
            .update({
                ownComments: FieldValue.arrayUnion({ comment: commentToBeEdited, title })
            });
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
            <button data-testid="show-edit-form" className="btn btn-warning m-1" style={{ width: "40px", height: "40px" }} onClick={() => {
                setShowForm(!showForm);
            }}>
                <FontAwesomeIcon icon={faPencilAlt} />
            </button>
            <Grid container
                direction="column"
                justify="center"
                alignItems="center">
                {
                    showForm && (
                        <form data-testid="edit-comment-submit" className={classes.root} noValidate autoComplete="off" method="POST"
                            onSubmit={(e) =>
                                comment.length >= 1 ? handleEditComment(e) : e.preventDefault()
                            }
                        >
                            <Grid container
                                direction="column"
                                justify="center"
                                alignItems="center">
                                <TextField
                                    inputProps={{ "data-testid": "input-edit-comment" }}
                                    aria-label={language === "Hungarian" ? "Hozzászólás szerkesztése" : "Edit comment"}
                                    autoComplete="off"
                                    type="text"
                                    name="edit-comment"
                                    style={{ width: "800px" }}
                                    value={commentToBeEdited}
                                    onChange={({ target }) => setCommentToBeEdited(target.value)}
                                    ref={commentInput}
                                />
                                <div className="m-2">
                                </div>
                                <Grid container spacing={2}
                                    direction="row"
                                    justify="space-evenly"
                                    alignItems="stretch">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        disabled={comment.length < 1}
                                        onClick={(e) => {
                                            handleEditComment(e);
                                            setShowForm(!showForm);
                                        }}
                                    >
                                        {language === "Hungarian" ? "Szerkesztés" : "Edit"}
                                    </Button>
                                    <Button data-testid="edit-comment-return" variant="contained" color="secondary" onClick={() => {
                                        setShowForm(!showForm);
                                    }}>
                                        {language === "Hungarian" ? "Vissza" : "Return"}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    )
                }
            </Grid>
        </>
    )
}

EditComment.propTypes = {
    docId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    comment: PropTypes.string.isRequired,
    comments: PropTypes.array.isRequired,
    setComments: PropTypes.func.isRequired,
    commentInput: PropTypes.object
};