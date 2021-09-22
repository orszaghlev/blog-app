import { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
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
        <div className="p-3 content text-center m-auto" style={{ width: "1000px" }}>
            <Helmet>
                <title>Bejelentkezés</title>
                <meta name="description" content="Bejelentkezés" />
            </Helmet>
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
                <div>
                    <h2>Bejelentkezés</h2>
                </div>
                <form className={classes.root} noValidate autoComplete="off" onSubmit={handleLogin} method="POST">
                    <Grid container
                        direction="column"
                        justify="center"
                        alignItems="center">
                        {error && (
                            <div className="text-danger">
                                {error}
                            </div>
                        )}
                        <TextField
                            required
                            id="filled-required"
                            label="E-mail cím"
                            variant="filled"
                            onChange={({ target }) => setEmailAddress(target.value)}
                            value={emailAddress}
                        />
                        <TextField
                            required
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
                        <Button variant="contained" color="secondary" onClick={() => {
                            history.push(ROUTES.HOME);
                        }}>
                            Vissza
                        </Button>
                    </Grid>
                </form>
                <div className="m-2">
                    <p>
                        Nincsen fiókja?{` `}
                        <Link to={ROUTES.SIGN_UP}>
                            Regisztráljon!
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div >
    )
}