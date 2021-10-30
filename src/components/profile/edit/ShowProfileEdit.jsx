import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from 'prop-types';
import { Button } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { firebase } from "../../../lib/Firebase";
import * as ROUTES from '../../../constants/Routes';
import { doesUsernameExist } from "../../../services/Firebase";

export default function ShowProfileEdit({ user }) {
    const history = useHistory();
    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [error, setError] = useState("");
    const useStyles = makeStyles((theme) => ({
        container: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        textField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            width: 200,
        },
    }));
    const classes = useStyles();

    useEffect(() => {
        setUsername(user?.username);
        setFullName(user?.fullName);
    }, [user]);

    return (
        <>
            <h2>Felhasználói adatok szerkesztése</h2>
            <form data-testid="edit-user-data" className={classes.container} noValidate
                onSubmit={async (e) => {
                    e.preventDefault();
                    const usernameExists = await doesUsernameExist(username);
                    const data = {
                        userId: user?.userId,
                        username: e.target.elements.username.value,
                        fullName: e.target.elements.fullName.value,
                        emailAddress: user?.emailAddress,
                        favoritePosts: user?.favoritePosts,
                        ownComments: user?.ownComments,
                        dateCreated: user?.dateCreated
                    };
                    if (usernameExists.length && e.target.elements.username.value !== user?.username) {
                        setUsername('');
                        setError('A felhasználónév foglalt!');
                        setTimeout(() => {
                            setError("");
                        }, 5000);
                    } else {
                        firebase.firestore().collection('users').doc(data.userId).set(data);
                        history.push(ROUTES.PROFILE);
                    }
                }}
            >
                <Grid container spacing={2}
                    direction="column"
                    justifyContent="space-around"
                    alignItems="stretch">
                    <Grid item xs>
                        <TextField inputProps={{ "data-testid": "input-username" }} value={username || ""} name="username" type="text" label="Felhasználónév" variant="filled"
                            onChange={(e) => {
                                setUsername(e.target.value);
                            }}
                            required style={{ width: 800 }} />
                    </Grid>
                    <Grid item xs>
                        <TextField inputProps={{ "data-testid": "input-fullname" }} value={fullName || ""} name="fullName" type="text" label="Teljes név" variant="filled"
                            onChange={(e) => {
                                setFullName(e.target.value);
                            }}
                            required style={{ width: 800 }} />
                    </Grid>
                    <Grid item xs>
                        <Grid container spacing={2}
                            direction="row"
                            justifyContent="space-evenly"
                            alignItems="stretch">
                            <Button type="submit" variant="contained" color="primary">
                                Szerkesztés
                            </Button>
                            <Button data-testid="return" variant="contained" color="secondary" onClick={() => {
                                history.push(ROUTES.PROFILE)
                            }}>
                                Vissza
                            </Button>
                        </Grid>
                    </Grid>
                    {error && (
                        <div data-testid="error" className="text-danger">
                            {error}
                        </div>
                    )}
                </Grid>
            </form>
        </>
    )
}

ShowProfileEdit.propTypes = {
    user: PropTypes.object
};