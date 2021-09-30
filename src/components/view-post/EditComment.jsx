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

export default function EditComment({ docId, title, displayName, originalComment, comments, setComments, commentInput }) {
    const [comment, setComment] = useState(originalComment);
    const { firebase, FieldValue } = useContext(FirebaseContext);
    const [showForm, setShowForm] = useState(false);
    const { user } = useUserWhoCommented(displayName);
    const handleEditComment = (e) => {
        e.preventDefault();
        setComments([...comments, { displayName: user.username, comment }]);
        setComment('');
        firebase
            .firestore()
            .collection('posts')
            .doc(docId)
            .update({
                comments: FieldValue.arrayRemove({ displayName, comment: originalComment })
            });
        firebase
            .firestore()
            .collection('posts')
            .doc(docId)
            .update({
                comments: FieldValue.arrayUnion({ displayName: user.username, comment })
            });
        firebase
            .firestore()
            .collection('users')
            .doc(user?.docId)
            .update({
                ownComments: FieldValue.arrayRemove({ comment: originalComment, title })
            });
        firebase
            .firestore()
            .collection('users')
            .doc(user?.docId)
            .update({
                ownComments: FieldValue.arrayUnion({ comment, title })
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
            <button className="btn btn-warning m-1" style={{ width: "40px", height: "40px" }} onClick={() => {
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
                        <form className={classes.root} noValidate autoComplete="off" method="POST"
                            onSubmit={(e) =>
                                comment.length >= 1 ? handleEditComment(e) : e.preventDefault()
                            }
                        >
                            <Grid container
                                direction="column"
                                justify="center"
                                alignItems="center">
                                <TextField
                                    aria-label="Hozzászólás szerkesztése"
                                    autoComplete="off"
                                    type="text"
                                    name="add-comment"
                                    style={{ width: "800px" }}
                                    value={comment}
                                    onChange={({ target }) => setComment(target.value)}
                                    ref={commentInput}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    disabled={comment.length < 1}
                                    onClick={handleEditComment}
                                >
                                    Szerkesztés
                                </Button>
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
    displayName: PropTypes.string.isRequired,
    originalComment: PropTypes.string.isRequired,
    comments: PropTypes.array.isRequired,
    setComments: PropTypes.func.isRequired,
    commentInput: PropTypes.object
};