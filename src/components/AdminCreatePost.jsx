import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Button } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import firebase from "../firebase/clientApp";

export function AdminCreatePost() {
    const history = useHistory();

    const [isSignedIn, setIsSignedIn] = useState(false);

    useEffect(() => {
        const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
            setIsSignedIn(!!user);
        });
        return () => unregisterAuthObserver();
    }, []);

    if (!isSignedIn || !firebase.auth().currentUser.emailVerified) {
        return (
            <div class="jumbotron">
                <motion.div
                    animate={{ scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                >
                    <h3>Az adminisztrációs tartalmak megtekintéséhez bejelentkezés és hitelesítés szükséges!</h3>
                    <Button m="2rem" variant="contained" color="secondary" onClick={() => {
                        history.push("/admin/login")
                    }}>
                        Bejelentkezés, hitelesítés
                    </Button>
                    <Button m="2rem" variant="contained" color="secondary" onClick={() => {
                        history.push("/home")
                    }}>
                        Kezdőlap
                    </Button>
                </motion.div>
            </div>
        )
    } else {
        return (
            <div className="p-3 content text-center m-auto" style={{ width: "1000px" }}>
                <Helmet>
                    <title>Admin - Bejegyzés létrehozása</title>
                    <meta name="description" content="Admin - Bejegyzés létrehozása" />
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
                    <h2>Admin - Bejegyzés létrehozása</h2>
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            const data = {
                                id: e.target.elements.id.value,
                                title: e.target.elements.title.value,
                                slug: e.target.elements.slug.value,
                                description: e.target.elements.description.value,
                                content: e.target.elements.content.value,
                                imgURL: e.target.elements.imgURL.value,
                                tag: e.target.elements.tag.value
                            };
                            firebase.firestore().collection('posts').doc(data.id).set(data);
                            history.push(`/admin/posts`);
                        }}
                    >
                        <Grid container spacing={2}
                            direction="column"
                            justify="space-around"
                            alignItems="stretch">
                            <Grid item xs>
                                <TextField name="id" label="ID" variant="filled" type="text" required style={{ width: 800 }} />
                            </Grid>
                            <Grid item xs>
                                <TextField name="title" label="Cím" variant="filled" type="text" required style={{ width: 800 }} />
                            </Grid>
                            <Grid item xs>
                                <TextField name="slug" label="Slug" variant="filled" type="text" required style={{ width: 800 }} />
                            </Grid>
                            <Grid item xs>
                                <TextField name="description" label="Leírás" variant="filled" type="text" required style={{ width: 800 }} />
                            </Grid>
                            <Grid item xs>
                                <TextField name="content" label="Tartalom" variant="filled" type="text" required style={{ width: 800 }} />
                            </Grid>
                            <Grid item xs>
                                <TextField name="imgURL" label="Kép URL" variant="filled" type="text" required style={{ width: 800 }} />
                            </Grid>
                            <Grid item xs>
                                <TextField name="tag" label="Címke" variant="filled" type="text" required style={{ width: 800 }} />
                            </Grid>
                            <Grid item xs>
                                <Grid container spacing={2}
                                    direction="row"
                                    justify="space-evenly"
                                    alignItems="stretch">
                                    <Button type="submit" variant="contained" color="primary">
                                        Küldés
                                    </Button>
                                    <Button variant="contained" color="secondary" onClick={() => {
                                        history.push(`/admin/posts`)
                                    }}>
                                        Vissza
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </form>
                </motion.div>
            </div>
        )
    }
}