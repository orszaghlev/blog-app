import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Button } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import Grid from '@material-ui/core/Grid';
import firebase from "../firebase/clientApp";

export function AdminFavoritePosts() {
    const history = useHistory();

    const useStyles = makeStyles({
        table: {
            minWidth: 650,
        },
    });

    const StyledTableCell = withStyles((theme) => ({
        head: {
            backgroundColor: theme.palette.success.light,
            color: theme.palette.common.white,
        },
        body: {
            fontSize: 14,
        },
    }))(TableCell);

    const classes = useStyles();

    const [isSignedIn, setIsSignedIn] = useState(false);

    const favList = [];
    const getArray = JSON.parse(localStorage.getItem('favorites') || '0');
    for (var i = 0; i < getArray.length; i++) {
        let x = getArray[i];
        favList[i] = JSON.parse(localStorage.getItem('favItem' + [x]) || '');
    }
    const titles = favList.length === 0 ? "" : Object.keys(favList[0]);

    useEffect(() => {
        const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
            setIsSignedIn(!!user);
        });
        return () => unregisterAuthObserver();
    }, []);

    if (favList.length === 0) {
        return (
            <div class="jumbotron">
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
                    <h3>Nincsenek kedvenc bejegyzések!</h3>
                    <Button size="small" color="secondary" align="center" onClick={() => {
                        history.push(`/admin/posts`)
                    }}>
                        Vissza
                    </Button>
                </motion.div>
            </div>
        )
    } else if (!isSignedIn || !firebase.auth().currentUser.emailVerified) {
        return (
            <div class="jumbotron">
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
                    <h4>Az adminisztrációs felület megtekintéséhez bejelentkezés és hitelesítés szükséges!</h4>
                    <Grid container
                        direction="row"
                        justify="center"
                        alignItems="center">
                        <Button m="2rem" style={{ marginRight: "10px" }} variant="contained" color="primary"
                            onClick={() => {
                                history.push("/admin/login")
                            }}>
                            Bejelentkezés/Hitelesítés
                        </Button>
                        <Button m="2rem" variant="contained" color="secondary" onClick={() => {
                            history.push("/home")
                        }}>
                            Kezdőlap
                        </Button>
                    </Grid>
                </motion.div>
            </div>
        )
    } else {
        return (
            <div className="p-1 m-auto text-center content bg-ivory">
                <Helmet>
                    <title>Kedvenc bejegyzések</title>
                    <meta name="description" content="Kedvenc bejegyzések" />
                </Helmet>
                {isSignedIn && firebase.auth().currentUser.emailVerified && <>
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
                        <Grid container
                            direction="row"
                            justify="space-around"
                            alignItems="center">
                            <h2>Kedvenc bejegyzések</h2>
                        </Grid>
                        <Grid container
                            direction="row"
                            justify="space-around"
                            alignItems="center">
                            <table>
                                <thead>
                                    <tr>
                                        {titles.map((title, key) => (
                                            <th key={key}>{title} | </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {// eslint-disable-next-line
                                    favList.map((items, i) => {
                                        <tr key={i}>
                                            {(Object.values(favList[i])).map((value, key) => (
                                                <td key={key}>{value}</td>
                                            ))}
                                        </tr>
                                    })}
                                </tbody>
                            </table>
                        </Grid>
                    </motion.div>
                </>}
            </div>
        )
    }
}