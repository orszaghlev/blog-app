import { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import AddComment from './AddComment';

export default function ShowComments({ docId, title, comments: allComments, commentInput, user }) {
    const [comments, setComments] = useState(allComments);
    const useStyles = makeStyles({
        root: {
            maxWidth: 1000,
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
                    <h4>{comments?.length === 0 ? "Jelenleg nincsenek hozzászólások!" : "Hozzászólások"}</h4>
                </div>
                {comments?.map((comment) => (
                    <CardActionArea>
                        <CardContent>
                            <>
                                <p key={`${comment.comment}-${comment.displayName}`} className="mb-1">
                                    <span className="mr-1 font-bold">{comment.displayName}</span>
                                </p>
                                <p key={`${comment.comment}-${comment.displayName}`} className="mb-1">
                                    <h5>{comment.comment}</h5>
                                </p>
                            </>
                        </CardContent>
                    </CardActionArea>
                ))}
                {user &&
                    <AddComment
                        docId={docId}
                        title={title}
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
    docId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    comments: PropTypes.array.isRequired,
    posted: PropTypes.number.isRequired,
    commentInput: PropTypes.object.isRequired,
    user: PropTypes.object
};