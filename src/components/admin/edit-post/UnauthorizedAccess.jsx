import { Grid } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { firebase } from "../../../lib/Firebase";
import * as ROUTES from '../../../constants/Routes';

export default function UnauthorizedAccess() {
    const history = useHistory();

    return (
        <>
            <h4>A bejegyzés szerkesztéséhez adminisztrátori fiókba történő bejelentkezés szükséges!</h4>
            <Grid container
                direction="row"
                justify="center"
                alignItems="center">
                <Button m="2rem" style={{ marginRight: "10px" }} variant="contained" color="secondary" onClick={() => {
                    firebase.auth().signOut();
                    history.push(ROUTES.LOGIN);
                }}>
                    Bejelentkezés
                </Button>
                <Button m="2rem" variant="contained" color="secondary" onClick={() => {
                    history.push(ROUTES.HOME);
                }}>
                    Kezdőlap
                </Button>
            </Grid>
        </>
    )
}