import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import FirebaseContext from '../../contexts/Firebase';
import useUser from '../../hooks/UseUser';
import UserContext from '../../contexts/User';

export default function AddComment({ docId, comments, setComments, commentInput }) {
    const [comment, setComment] = useState('');
    const { firebase, FieldValue } = useContext(FirebaseContext);
    const {
        user: { uid }
    } = useContext(UserContext);
    const { user } = useUser(uid);
    const handleSubmitComment = (e) => {
        e.preventDefault();
        setComments([...comments, { displayName: user.username, comment }]);
        setComment('');
        return firebase
            .firestore()
            .collection('posts')
            .doc(docId)
            .update({
                comments: FieldValue.arrayUnion({ displayName: user.username, comment })
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
        <div className="p-3 content text-center m-auto" style={{ width: "1000px" }}>
            <form className={classes.root} noValidate autoComplete="off" method="POST"
                onSubmit={(e) =>
                    comment.length >= 1 ? handleSubmitComment(e) : e.preventDefault()
                }
            >
                <Grid container
                    direction="column"
                    justify="center"
                    alignItems="center">
                    <TextField
                        aria-label="Hozzászólás"
                        autoComplete="off"
                        className="text-sm text-gray-base w-full mr-3 py-5 px-4"
                        type="text"
                        name="add-comment"
                        placeholder="Hozzászólás"
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
                        onClick={handleSubmitComment}
                    >
                        Közzététel
                    </Button>
                </Grid>
            </form>
        </div>
    );
}

AddComment.propTypes = {
    docId: PropTypes.string.isRequired,
    comments: PropTypes.array.isRequired,
    setComments: PropTypes.func.isRequired,
    commentInput: PropTypes.object
};