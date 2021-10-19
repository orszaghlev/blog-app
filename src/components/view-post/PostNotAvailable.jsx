import { useHistory } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import * as ROUTES from '../../constants/Routes';

export default function PostNotAvailable() {
    const history = useHistory();

    return (
        <>
            <Grid container
                direction="column"
                justify="center"
                alignItems="center">
                <Button data-testid="post-not-available-return" m="2rem" variant="contained" color="secondary" onClick={() => {
                    history.push(ROUTES.HOME)
                }}>
                    Kezdőlap
                </Button>
            </Grid>
        </>
    )
}