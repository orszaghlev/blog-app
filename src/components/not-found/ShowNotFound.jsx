import { useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import * as ROUTES from '../../constants/Routes';

export default function ShowNotFound() {
    const history = useHistory();

    return (
        <Grid container
            direction="column"
            justifyContent="center"
            alignItems="center">
            <h2>A keresett oldal nem található!</h2>
            <Button data-testid="not-found-return" m="2rem" variant="contained" color="secondary" onClick={() => {
                history.push(ROUTES.HOME)
            }}>
                Kezdőlap
            </Button>
        </Grid>
    )
}