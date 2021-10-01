import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { useHistory } from "react-router-dom";
import * as ROUTES from '../../constants/Routes';

export default function PostNotAvailable() {
    const history = useHistory();

    return (
        <>
            <h3>A kért bejegyzés nem érhető el!</h3>
            <Grid container
                direction="row"
                justify="center"
                alignItems="center">
                <Button m="2rem" variant="contained" color="secondary" onClick={() => {
                    history.push(ROUTES.HOME)
                }}>
                    Kezdőlap
                </Button>
            </Grid>
        </>
    )
}