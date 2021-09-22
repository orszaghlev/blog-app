import { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import AddComment from './AddComment';

export default function ShowComments({ docId, comments: allComments, commentInput, user }) {
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
            <div className="p-3 content text-center m-auto" style={{ width: "1000px" }}>
                <Card className={classes.root}>
                    <div>
                        <h4>{comments?.length === 0 ? "Jelenleg nincsenek hozzászólások!" : "Hozzászólások"}</h4>
                    </div>
                    {comments?.slice(0, 3).map((item) => (
                        <CardActionArea>
                            <CardContent>
                                <>
                                    <p key={`${item.comment}-${item.displayName}`} className="mb-1">
                                        <span className="mr-1 font-bold">{item.displayName}</span>
                                    </p>
                                    <p key={`${item.comment}-${item.displayName}`} className="mb-1">
                                        <h5>{item.comment}</h5>
                                    </p>
                                </>
                            </CardContent>
                        </CardActionArea>
                    ))}
                    {user &&
                        <AddComment
                            docId={docId}
                            comments={comments}
                            setComments={setComments}
                            commentInput={commentInput}
                        />
                    }
                </Card>
            </div>
        </>
    )
}

ShowComments.propTypes = {
    docId: PropTypes.string.isRequired,
    comments: PropTypes.array.isRequired,
    posted: PropTypes.number.isRequired,
    commentInput: PropTypes.object.isRequired,
    user: PropTypes.object
};