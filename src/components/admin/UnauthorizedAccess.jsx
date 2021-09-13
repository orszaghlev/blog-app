import { motion } from "framer-motion";
import { Grid } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import * as ROUTES from '../../constants/Routes';

export default function UnauthorizedAccess() {
    const history = useHistory();

    return (
        <div class="jumbotron">
            <motion.div initial="hidden" animate="visible" variants={{
                hidden: {
                    scale: .8,
                    opacity: 0
                },
                visible: {
                    scale: 1,
                    opacity: 1,
                    transition: {
                        delay: .4
                    }
                },
            }}>
                <h4 className="text-center">Az adminisztrációs felület megtekintéséhez bejelentkezés és hitelesítés szükséges!</h4>
                <Grid container
                    direction="row"
                    justify="center"
                    alignItems="center">
                    <Button m="2rem" style={{ marginRight: "10px" }} variant="contained" color="secondary" onClick={() => {
                        history.push(ROUTES.ADMIN_LOGIN)
                    }}>
                        Bejelentkezés/Hitelesítés
                    </Button>
                    <Button m="2rem" variant="contained" color="secondary" onClick={() => {
                        history.push(ROUTES.HOME)
                    }}>
                        Kezdőlap
                    </Button>
                </Grid>
            </motion.div>
        </div>
    )
}