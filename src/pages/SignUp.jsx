import { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import FirebaseContext from '../contexts/Firebase';
import * as ROUTES from '../constants/Routes';
import { doesUsernameExist } from '../services/Firebase';

export function SignUp() {
    const history = useHistory();
    const { firebase } = useContext(FirebaseContext);
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const isInvalid = password === '' || emailAddress === '';

    const handleSignUp = async (e) => {
        e.preventDefault();

        const usernameExists = await doesUsernameExist(username);
        if (!usernameExists.length) {
            try {
                const createdUserResult = await firebase
                    .auth()
                    .createUserWithEmailAndPassword(emailAddress, password);

                await createdUserResult.user.updateProfile({
                    displayName: username
                });

                await firebase
                    .firestore()
                    .collection('users')
                    .add({
                        userId: createdUserResult.user.uid,
                        username: username.toLowerCase(),
                        fullName,
                        emailAddress: emailAddress.toLowerCase(),
                        favoritePosts: [],
                        dateCreated: Date.now()
                    });

                return history.push(`/profile/${username}`);
            } catch (error) {
                setUsername('');
                setFullName('');
                setEmailAddress('');
                setPassword('');
                setError(error.message);
            }
        } else {
            setUsername('');
            setFullName('');
            setEmailAddress('');
            setPassword('');
            setError('Már regisztráltak ezzel a felhasználónévvel!');
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
                <title>Regisztráció</title>
                <meta name="description" content="Regisztráció" />
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
                    <h2>Regisztráció</h2>
                </div>
                {error && (
                    <p>
                        {error}
                    </p>
                )}
                <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSignUp} method="POST">
                    <Grid container
                        direction="column"
                        justify="center"
                        alignItems="center">
                        <TextField
                            required
                            id="filled-required"
                            label="Felhasználónév"
                            variant="filled"
                            onChange={({ target }) => setUsername(target.value)}
                            value={username}
                        />
                        <TextField
                            required
                            id="filled-required"
                            label="Teljes név"
                            variant="filled"
                            onChange={({ target }) => setFullName(target.value)}
                            value={fullName}
                        />
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
                            Regisztráció
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
                        Van fiókja?{` `}
                        <Link to={ROUTES.LOGIN}>
                            Jelentkezzen be!
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div >
    )
}