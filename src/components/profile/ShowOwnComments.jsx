import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Grid } from "@material-ui/core";
import { Button } from '@material-ui/core';
import slugify from 'react-slugify';

export default function ShowOwnComments({ user }) {
    const history = useHistory();

    return (
        <Grid container
            direction="column"
            justify="center"
            alignItems="center">
            <h5 data-testid="user-comments-title">{user?.ownComments.length === 0 ? "Jelenleg nincsenek saját hozzászólásai!" : "Saját hozzászólások"}</h5>
            {user?.ownComments?.map((comment) => (
                <div>
                    <Button data-testid="user-comment-button" variant="text" color="primary" onClick={() => {
                        history.push(`/posts/${slugify(comment?.title)}`)
                    }}>
                        <h6 data-testid="user-comment-title">{comment?.title}</h6>
                    </Button>
                    <p data-testid="user-comment-comment">{comment?.comment}</p>
                </div>
            ))}
            <hr />
        </Grid>
    )
}

ShowOwnComments.propTypes = {
    user: PropTypes.object.isRequired
};