import { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import FirebaseContext from '../../contexts/Firebase';
import * as ROUTES from '../../constants/Routes';
import { useMediaQuery } from 'react-responsive';

export default function ShowForgotPassword() {
    const history = useHistory();
    const { firebase } = useContext(FirebaseContext);
    const [emailAddress, setEmailAddress] = useState('');
    const [error, setError] = useState('');
    const [notification, setNotification] = useState('');
    const isInvalid = emailAddress === '';
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
    const handlePasswordReset = async (e) => {
        e.preventDefault();
        try {
            await firebase.auth().sendPasswordResetEmail(emailAddress);
            setNotification("A megadott e-mail címre kiküldtünk egy jelszó visszaállítást segítő mailt!");
        } catch (error) {
            setEmailAddress('');
            setError("A megadott e-mail címmel még nem regisztrált felhasználó!");
            setTimeout(() => {
                setError("");
            }, 5000);
        }
    };
    const useStyles = makeStyles((theme) => ({
        root: {
            '& .MuiTextField-root': {
                margin: theme.spacing(1),
                width: '25ch',
            },
        },
    }));
    const classes = useStyles();

    return (
        <>
            <div>
                <h2>Elfelejtett jelszó</h2>
            </div>
            <form data-testid="forgot-password" className={classes.root} noValidate autoComplete="off" onSubmit={handlePasswordReset} method="POST">
                <Grid container
                    direction="column"
                    justifyContent="center"
                    alignItems="center">
                    {error && notification === "" && (
                        <div data-testid="error" className="text-danger">
                            {error}
                        </div>
                    )}
                    <TextField
                        size={isTabletOrMobile ? "small" : "medium"}
                        className="TextField"
                        required
                        inputProps={{ "data-testid": "input-email" }}
                        id="email-filled-required"
                        label="E-mail cím"
                        variant="filled"
                        onChange={({ target }) => setEmailAddress(target.value)}
                        value={emailAddress}
                    />
                </Grid>
                <Grid container
                    direction="row"
                    justifyContent="center"
                    alignItems="center">
                    <Button size={isTabletOrMobile ? "small" : "medium"} type="submit" variant="contained" color="primary" disabled={isInvalid} style={{ marginRight: "10px" }}>
                        Jelszó visszaállítása
                    </Button>
                    <Button size={isTabletOrMobile ? "small" : "medium"} data-testid="return" variant="contained" color="secondary" onClick={() => {
                        history.push(ROUTES.LOGIN);
                    }}>
                        Vissza
                    </Button>
                </Grid>
            </form>
            <div className="m-2">
                {notification === "" &&
                    <p>
                        Nincsen fiókja?{` `}
                        <Link to={ROUTES.SIGN_UP} data-testid="sign-up">
                            Regisztráljon!
                        </Link>
                    </p>
                }
                {notification !== "" &&
                    <div className="text-success">
                        {notification}
                    </div>
                }
            </div>
        </>
    )
}