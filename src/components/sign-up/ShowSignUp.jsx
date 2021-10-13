import { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import FirebaseContext from '../../contexts/Firebase';
import * as ROUTES from '../../constants/Routes';
import { doesEmailAddressExist, doesUsernameExist } from '../../services/Firebase';

export default function ShowSignUp() {
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
        const emailAddressExists = await doesEmailAddressExist(emailAddress);
        if (!usernameExists.length && !emailAddressExists.length) {
            try {
                const createdUserResult = await firebase
                    .auth()
                    .createUserWithEmailAndPassword(emailAddress, password);

                await createdUserResult.user.updateProfile({
                    displayName: username
                });
                const data = {
                    userId: createdUserResult.user.uid,
                    username: username.toLowerCase(),
                    fullName,
                    emailAddress: emailAddress.toLowerCase(),
                    favoritePosts: [],
                    ownComments: [],
                    dateCreated: Date.now()
                }
                await firebase
                    .firestore()
                    .collection('users')
                    .doc(data.userId)
                    .set(data);
                history.push(ROUTES.PROFILE);
            } catch (error) {
                setUsername('');
                setFullName('');
                setEmailAddress('');
                setPassword('');
                setError('A regisztráció során hiba történt! Kérjük, próbálja újra!');
                setTimeout(() => {
                    setError("");
                }, 5000);
            }
        } else {
            setUsername('');
            setFullName('');
            setEmailAddress('');
            setPassword('');
            setError('Már regisztráltak ezzel a felhasználónévvel és/vagy e-mail címmel!');
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
                <h2>Regisztráció</h2>
            </div>
            <form data-testid="sign-up" className={classes.root} noValidate autoComplete="off" onSubmit={handleSignUp} method="POST">
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
                        inputProps={{ "data-testid": "input-username" }}
                        id="filled-required"
                        label="Felhasználónév"
                        variant="filled"
                        onChange={({ target }) => setUsername(target.value)}
                        value={username}
                    />
                    <TextField
                        required
                        inputProps={{ "data-testid": "input-fullname" }}
                        id="filled-required"
                        label="Teljes név"
                        variant="filled"
                        onChange={({ target }) => setFullName(target.value)}
                        value={fullName}
                    />
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
                        Regisztráció
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
                    Van fiókja?{` `}
                    <Link to={ROUTES.LOGIN} data-testid="login">
                        Jelentkezzen be!
                    </Link>
                </p>
            </div>
        </>
    )
}