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
            justifyContent="center"
            alignItems="center">
            <h5>{user?.favoritePosts?.length === 0 ? "Jelenleg nincsenek kedvenc bejegyzései!" : "Kedvenc bejegyzések"}</h5>
            {user?.favoritePosts?.map((postTitle, i) => (
                <div key={i}>
                    <Button size="small" data-testid="user-favoritePost-button" variant="text" color="primary" onClick={() => {
                        history.push(`/posts/${slugify(postTitle)}`)
                    }}>
                        <h6>{postTitle}</h6>
                    </Button>
                </div>
            ))}
        </Grid>
    )
}

ShowFavoritePosts.propTypes = {
    user: PropTypes.object
};