import { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import FirebaseContext from '../../contexts/Firebase';
import * as ROUTES from '../../constants/Routes';
import { useMediaQuery } from 'react-responsive';

export default function ShowLogin() {
    const history = useHistory();
    const { firebase } = useContext(FirebaseContext);
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const isInvalid = password === '' || emailAddress === '';
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await firebase.auth().signInWithEmailAndPassword(emailAddress, password);
            history.push(ROUTES.HOME);
        } catch (error) {
            setEmailAddress('');
            setPassword('');
            setError("Sikertelen bejelentkezés, nem megfelelő e-mail és/vagy jelszó!");
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
                <h2>Bejelentkezés</h2>
            </div>
            <form data-testid="login" className={classes.root} noValidate autoComplete="off" onSubmit={handleLogin} method="POST">
                <Grid container
                    direction="column"
                    justifyContent="center"
                    alignItems="center">
                    {error && (
                        <div data-testid="error" className="text-danger">
                            {error}
                        </div>
                    )}
                    <TextField
                        className="TextField"
                        required
                        inputProps={{ "data-testid": "input-email" }}
                        id="email-filled-required"
                        label="E-mail cím"
                        variant="filled"
                        onChange={({ target }) => setEmailAddress(target.value)}
                        value={emailAddress}
                        size={isTabletOrMobile ? "small" : "medium"}
                    />
                    <TextField
                        className="TextField"
                        required
                        inputProps={{ "data-testid": "input-password" }}
                        id="password-filled-required"
                        label="Jelszó"
                        variant="filled"
                        type="password"
                        onChange={({ target }) => setPassword(target.value)}
                        value={password}
                        autoComplete="off"
                        size={isTabletOrMobile ? "small" : "medium"}
                    />
                </Grid>
                <Grid container
                    direction="row"
                    justifyContent="center"
                    alignItems="center">
                    <Button size={isTabletOrMobile ? "small" : "medium"} type="submit" variant="contained" color="primary" disabled={isInvalid} style={{ marginRight: "10px" }}>
                        Bejelentkezés
                    </Button>
                    <Button size={isTabletOrMobile ? "small" : "medium"} data-testid="return" variant="contained" color="secondary" onClick={() => {
                        history.push(ROUTES.HOME);
                    }}>
                        Vissza
                    </Button>
                </Grid>
            </form>
            <div className="m-2">
                <p>
                    Nincsen fiókja?{` `}
                    <Link to={ROUTES.SIGN_UP} data-testid="sign-up">
                        Regisztráljon!
                    </Link>
                </p>
                <p>
                    <Link to={ROUTES.FORGOT_PASSWORD} data-testid="forgot-password">
                        Elfelejtette a jelszavát?
                    </Link>
                </p>
            </div>
        </>
    )
}