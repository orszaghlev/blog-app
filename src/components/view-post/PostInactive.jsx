import { motion } from "framer-motion";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { useHistory } from "react-router-dom";
import * as ROUTES from '../../constants/Routes';

export default function PostInactive() {
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
                <h3 className="text-center">A kért bejegyzés inaktív!</h3>
                <Grid container
                    direction="row"
                    justify="center"
                    alignItems="center">
                    <Button m="2rem" variant="contained" color="secondary" onClick={() => {
                        history.push(ROUTES.HOME)
                    }}>
                        Vissza
                    </Button>
                </Grid>
            </motion.div>
        </div>
    )
}