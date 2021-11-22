import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import * as ROUTES from '../../constants/Routes';
import { useMediaQuery } from 'react-responsive';
import Spinner from '../../components/Spinner';

export default function ShowNotFound() {
    const history = useHistory();
    const [isUnavailable, setIsUnavailable] = useState(false);
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });

    useEffect(() => {
        let unmounted = false;
        if (!unmounted) {
            setTimeout(() => {
                setIsUnavailable(true);
            }, 5000);
        }
        return () => { unmounted = true };
    }, []);

    return (
        <Grid container
            direction="column"
            justifyContent="center"
            alignItems="center">
            {!isUnavailable &&
                <Spinner />
            }
            {isUnavailable &&
                <>
                    <h2>A keresett oldal nem található!</h2>
                    <Button size={isTabletOrMobile ? "small" : "medium"} data-testid="not-found-return" m="2rem" variant="contained" color="secondary" onClick={() => {
                        history.push(ROUTES.HOME)
                    }}>
                        Kezdőlap
                    </Button>
                </>
            }
        </Grid>
    )
}