import { Grid } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import * as ROUTES from '../../../constants/Routes';

export default function NoPostsAvailable() {
    const history = useHistory();

    return (
        <>
            <h3>Jelenleg nincsenek elérhető bejegyzések!</h3>
            <Grid container
                direction="row"
                justify="center"
                alignItems="center">
                <Button size="2rem" color="secondary" variant="contained" onClick={() => {
                    history.push(ROUTES.ADMIN_CREATE_POST)
                }}>
                    Új bejegyzés
                </Button>
            </Grid>
        </>
    )
}