import { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import AddComment from './AddComment';
import EditComment from './EditComment';
import DeleteComment from './DeleteComment';

export default function ShowComments({ docId, title, language, comments: allComments, commentInput, user }) {
    const [comments, setComments] = useState(allComments);
    const useStyles = makeStyles({
        root: {
            maxWidth: 1000,
            border: "1px solid white",
        },
        media: {
            height: 200,
        },
    });
    const classes = useStyles();

    return (
        <>
            <Card className={classes.root}>
                <div>
                    <h4>{language === "Hungarian" ? (comments?.length === 0 ? "Jelenleg nincsenek hozzászólások!" : "Hozzászólások") : (comments?.length === 0 ? "There are no comments yet!" : "Comments")}</h4>
                </div>
                {comments?.map((comment, i) => (
                    <div key={i}>
                        <>
                            <p className="mb-1">
                                <span className="mr-1 font-bold">{comment?.displayName}</span>
                            </p>
                            <h5 className="mb-1">
                                <p>{comment?.comment}</p>
                            </h5>
                            {user?.userId === process.env.REACT_APP_FIREBASE_ADMIN_UID &&
                                <Grid container
                                    direction="row"
                                    justifyContent="center"
                                    alignItems="center">
                                    <DeleteComment
                                        docId={docId}
                                        title={title}
                                        displayName={comment?.displayName}
                                        comment={comment?.comment}
                                        comments={comments}
                                        setComments={setComments}
                                    />
                                    <EditComment
                                        docId={docId}
                                        title={title}
                                        language={language}
                                        displayName={comment?.displayName}
                                        comment={comment?.comment}
                                        comments={comments}
                                        setComments={setComments}
                                        commentInput={commentInput}
                                    />
                                </Grid>
                            }
                        </>
                    </div>
                ))}
                {user &&
                    <AddComment
                        docId={docId}
                        title={title}
                        language={language}
                        comments={comments}
                        setComments={setComments}
                        commentInput={commentInput}
                    />
                }
            </Card>
        </>
    )
}

ShowComments.propTypes = {
    docId: PropTypes.string,
    title: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    comments: PropTypes.array.isRequired,
    commentInput: PropTypes.object.isRequired,
    user: PropTypes.object
};