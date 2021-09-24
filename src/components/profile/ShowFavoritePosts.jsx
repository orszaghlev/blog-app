import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Grid } from "@material-ui/core";
import { Button } from '@material-ui/core';

export default function ShowFavoritePosts({ user }) {
    const history = useHistory();

    return (
        <Grid container
            direction="column"
            justify="center"
            alignItems="center">
            <h5>{user?.favoritePosts.length === 0 ? "Jelenleg nincsenek kedvenc bejegyzései!" : "Kedvenc bejegyzések"}</h5>
            {user?.favoritePosts.map((postSlug) => (
                <Button variant="text" color="primary" onClick={() => {
                    history.push(`/posts/${postSlug}`)
                }}>
                    {postSlug.replaceAll('-', ' ')}
                </Button>
            ))}
        </Grid>
    )
}

ShowFavoritePosts.propTypes = {
    user: PropTypes.object.isRequired
};