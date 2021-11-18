import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import FirebaseContext from '../../contexts/Firebase';
import useUser from '../../hooks/UseUser';
import UserContext from '../../contexts/User';

export default function AddComment({ docId, title, language, comments, setComments, commentInput, isTabletOrMobile }) {
    const [comment, setComment] = useState('');
    const { firebase, FieldValue } = useContext(FirebaseContext);
    const { user: { uid } } = useContext(UserContext);
    const { user } = useUser(uid);
    const handleSubmitComment = (e) => {
        e.preventDefault();
        setComments([...comments, { displayName: user.username, comment }]);
        setComment('');
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
        <form data-testid="add-comment-submit" className={classes.root} noValidate autoComplete="off" method="POST"
            onSubmit={(e) =>
                comment.length >= 1 ? handleSubmitComment(e) : e.preventDefault()
            }
        >
            <Grid container
                direction="column"
                justifyContent="center"
                alignItems="center">
                <TextField
                    size={isTabletOrMobile ? "small" : ""}
                    inputProps={{ "data-testid": "input-add-comment" }}
                    aria-label={language === "Hungarian" ? "Új hozzászólás" : "New comment"}
                    autoComplete="off"
                    type="text"
                    name="add-comment"
                    placeholder={language === "Hungarian" ? "Új hozzászólás" : "New comment"}
                    style={{ width: isTabletOrMobile ? 250 : 700 }}
                    value={comment}
                    onChange={({ target }) => setComment(target.value)}
                    ref={commentInput}
                />
                <Button
                    size={isTabletOrMobile ? "small" : ""}
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={comment.length < 1}
                    onClick={handleSubmitComment}
                >
                    {language === "Hungarian" ? "Közzététel" : "Send"}
                </Button>
                <br />
            </Grid>
        </form>
    );
}

AddComment.propTypes = {
    docId: PropTypes.string,
    title: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    comments: PropTypes.array.isRequired,
    setComments: PropTypes.func.isRequired,
    commentInput: PropTypes.object,
    isTabletOrMobile: PropTypes.bool.isRequired
};