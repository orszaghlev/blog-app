import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Grid } from "@material-ui/core";
import Popover from '@material-ui/core/Popover';
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "../firebase/clientApp";

export function AdminLogin() {
    const history = useHistory();

    const useStyles = makeStyles((theme) => ({
        root: {
            maxWidth: 500,
        },
        media: {
            height: 100,
        },
        typography: {
            padding: theme.spacing(2),
        },
    }));

    const classes = useStyles();

    const uiConfig = {
        signInFlow: 'popup',
        signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.GithubAuthProvider.PROVIDER_ID,
        ],
        callbacks: {
            signInSuccessWithAuthResult: () => false,
        },
    };

    const [isSignedIn, setIsSignedIn] = useState(false);

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        firebase.auth().currentUser.sendEmailVerification();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    useEffect(() => {
        const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
            setIsSignedIn(!!user);
        });
        return () => unregisterAuthObserver();
    }, []);

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
                {!isSignedIn && <>
                    <div className="text-center">
                        <motion.div
                            animate={{ scale: 1.2 }}
                            transition={{ duration: 0.5 }}
                        >
                            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
                        </motion.div>
                    </div>
                </>}
                {isSignedIn && <>
                    <div className="text-center m-3">
                        <h5>Bejelentkezve {firebase.auth().currentUser.displayName ? firebase.auth().currentUser.displayName : "<ismeretlen>"} felhasználóként.</h5>
                        {!firebase.auth().currentUser.email && <>
                            <h6>Az Ön e-mail címe nem elérhető.</h6>
                            <Button aria-describedby={id} m="2rem" variant="contained" color="primary" onClick={() => firebase.auth().signOut()}>
                                Bejelentkezés másik fiókkal
                            </Button>
                        </>}
                        {firebase.auth().currentUser.email && <>
                            <h6>{firebase.auth().currentUser.emailVerified ?
                                "Az Ön e-mail címe hitelesített, így az adminisztrációs műveletek elérhetővé váltak." :
                                "Az Ön e-mail címe nem hitelesített, így az adminisztrációs műveletek nem elérhetőek."}</h6>
                            {firebase.auth().currentUser.email && !firebase.auth().currentUser.emailVerified && <>
                                <Button aria-describedby={id} m="2rem" variant="contained" color="primary" onClick={handleClick}>
                                    E-mail hitelesítése
                                </Button>
                                <Popover
                                    id={id}
                                    open={open}
                                    anchorEl={anchorEl}
                                    onClose={handleClose}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'center',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'center',
                                    }}
                                >
                                    <Typography className={classes.typography}>Hitelesítő e-mail elküldve.</Typography>
                                </Popover>
                            </>}
                        </>}
                    </div>
                    {firebase.auth().currentUser.emailVerified && <>
                        <Grid container justify="center">
                            <Card className={classes.root}>
                                <CardActions style={{ justifyContent: "center" }}>
                                    <Button size="medium" color="primary" align="center" onClick={() => {
                                        history.push(`/admin/posts`)
                                    }}>
                                        Bejegyzések megtekintése
                                    </Button>
                                    <Typography>|</Typography>
                                    <Button size="medium" color="primary" align="center" onClick={() => {
                                        history.push(`/admin/create-post/`)
                                    }}>
                                        Bejegyzés létrehozása
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    </>}
                </>}
            </motion.div>
        </div >
    )
}