import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Grid } from "@material-ui/core";
import { Button } from '@material-ui/core';
import slugify from 'react-slugify';

export default function ShowFavoritePosts({ user }) {
    const history = useHistory();

    return (
        <Grid container
            direction="column"
            justify="center"
            alignItems="center">
            <h5>{user?.favoritePosts?.length === 0 ? "Jelenleg nincsenek kedvenc bejegyzései!" : "Kedvenc bejegyzések"}</h5>
            {user?.favoritePosts?.map((postTitle) => (
                <Button variant="text" color="primary" onClick={() => {
                    history.push(`/posts/${slugify(postTitle)}`)
                }}>
                    {postTitle}
                </Button>
            ))}
        </Grid>
    )
}

ShowFavoritePosts.propTypes = {
    user: PropTypes.object.isRequired
};