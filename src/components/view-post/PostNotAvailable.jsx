import { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import * as ROUTES from '../../constants/Routes';
import Spinner from '../../components/Spinner';

export default function PostNotAvailable() {
    const [error, setError] = useState('');
    const history = useHistory();

    useEffect(() => {
        setTimeout(() => {
            setError("A kért bejegyzés nem érhető el!");
        }, 10000);
    })

    return (
        <>
            {error === "" &&
                <Spinner />
            }
            {error !== "" &&
                <Grid container
                    direction="column"
                    justify="center"
                    alignItems="center">
                    <h3>{error}</h3>
                    <Button data-testid="post-not-available-return" m="2rem" variant="contained" color="secondary" onClick={() => {
                        history.push(ROUTES.HOME)
                    }}>
                        Kezdőlap
                    </Button>
                </Grid>
            }
        </>
    )
}