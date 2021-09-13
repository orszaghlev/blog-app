import { motion } from "framer-motion";
import { Grid } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import * as ROUTES from '../../../constants/Routes';

export default function PostNotAvailable() {
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
                <h3 className="text-center">A kért bejegyzés nem érhető el!</h3>
                <Grid container
                    direction="row"
                    justify="center"
                    alignItems="center">
                    <Button size="2rem" style={{ marginRight: "10px" }} variant="contained" color="secondary" align="center" onClick={() => {
                        history.push(ROUTES.ADMIN_CREATE_POST)
                    }}>
                        Új bejegyzés
                    </Button>
                    <Button size="2rem" style={{ marginRight: "10px" }} variant="contained" color="secondary" align="center" onClick={() => {
                        history.push(ROUTES.ADMIN_FAVORITE_POSTS)
                    }}>
                        Kedvenc bejegyzések
                    </Button>
                    <Button size="2rem" variant="contained" color="secondary" align="center" onClick={() => {
                        history.push(ROUTES.ADMIN_ALL_POSTS)
                    }}>
                        Összes bejegyzés
                    </Button>
                </Grid>
            </motion.div>
        </div>
    )
}