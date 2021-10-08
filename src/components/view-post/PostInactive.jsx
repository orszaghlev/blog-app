import { useHistory } from "react-router-dom";
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import * as ROUTES from '../../constants/Routes';

export default function PostInactive({ post }) {
    const history = useHistory();

    return (
        <>
            <h3>{post?.language === "Hungarian" ? "A kért bejegyzés inaktív!" : "The requested post is inactive!"}</h3>
            <Grid container
                direction="row"
                justify="center"
                alignItems="center">
                <Button m="2rem" variant="contained" color="secondary" onClick={() => {
                    history.push(ROUTES.HOME)
                }}>
                    {post?.language === "Hungarian" ? "Vissza" : "Return"}
                </Button>
            </Grid>
        </>
    )
}

PostInactive.propTypes = {
    post: PropTypes.object.isRequired
};