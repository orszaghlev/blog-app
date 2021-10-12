import { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import FirebaseContext from '../../contexts/Firebase';
import * as ROUTES from '../../constants/Routes';

export default function ShowLogin() {
    const history = useHistory();
    const { firebase } = useContext(FirebaseContext);
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const isInvalid = password === '' || emailAddress === '';
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
                    justify="center"
                    alignItems="center">
                    {error && (
                        <div data-testid="error" className="text-danger">
                            {error}
                        </div>
                    )}
                    <TextField
                        required
                        inputProps={{ "data-testid": "input-email" }}
                        id="filled-required"
                        label="E-mail cím"
                        variant="filled"
                        onChange={({ target }) => setEmailAddress(target.value)}
                        value={emailAddress}
                    />
                    <TextField
                        required
                        inputProps={{ "data-testid": "input-password" }}
                        id="filled-password-input"
                        label="Jelszó"
                        variant="filled"
                        type="password"
                        onChange={({ target }) => setPassword(target.value)}
                        value={password}
                    />
                </Grid>
                <Grid container
                    direction="row"
                    justify="center"
                    alignItems="center">
                    <Button type="submit" variant="contained" color="primary" disabled={isInvalid} style={{ marginRight: "10px" }}>
                        Bejelentkezés
                    </Button>
                    <Button data-testid="return" variant="contained" color="secondary" onClick={() => {
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
            </div>
        </>
    )
}