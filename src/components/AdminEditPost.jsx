import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Button } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import firebase from "../firebase/clientApp";

export function AdminEditPost(props) {
    const history = useHistory();
    const [id, setId] = useState("");
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [imgURL, setImgURL] = useState("");
    const [tag, setTag] = useState("");

    const [isSignedIn, setIsSignedIn] = useState(false);

    useEffect(() => {
        firebase.firestore().collection("posts").doc(props.match.params.id).get().then((post) => {
            setId(post.data().id);
            setTitle(post.data().title);
            setSlug(post.data().slug);
            setDescription(post.data().description);
            setContent(post.data().content);
            setImgURL(post.data().imgURL);
            setTag(post.data().tag);
        })
            .catch((error) => { console.log(error) });
        const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
            setIsSignedIn(!!user);
        });
        return () => unregisterAuthObserver();
    }, [props.match.params.id])

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
                    <title>Admin - Bejegyzés szerkesztése</title>
                    <meta name="description" content="Admin - Bejegyzés szerkesztése" />
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
                    <h2>Admin - Bejegyzés szerkesztése</h2>
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
                                <TextField value={id} name="id" type="text" label="ID" variant="filled"
                                    onChange={(e) => {
                                        setId(e.target.value)
                                    }}
                                    required style={{ width: 800 }} />
                            </Grid>
                            <Grid item xs>
                                <TextField value={title} name="title" type="text" label="Cím" variant="filled"
                                    onChange={(e) => {
                                        setTitle(e.target.value)
                                    }}
                                    required style={{ width: 800 }} />
                            </Grid>
                            <Grid item xs>
                                <TextField value={slug} name="slug" type="text" label="Slug" variant="filled"
                                    onChange={(e) => {
                                        setSlug(e.target.value)
                                    }}
                                    required style={{ width: 800 }} />
                            </Grid>
                            <Grid item xs>
                                <TextField value={description} name="description" label="Leírás" variant="filled"
                                    onChange={(e) => {
                                        setDescription(e.target.value)
                                    }}
                                    type="text" required style={{ width: 800 }} />
                            </Grid>
                            <Grid item xs>
                                <TextField value={content} name="content" label="Tartalom" variant="filled"
                                    onChange={(e) => {
                                        setContent(e.target.value)
                                    }}
                                    type="text" required style={{ width: 800 }} />
                            </Grid>
                            <Grid item xs>
                                <TextField value={imgURL} name="imgURL" label="Kép URL" variant="filled"
                                    onChange={(e) => {
                                        setImgURL(e.target.value)
                                    }}
                                    type="text" required style={{ width: 800 }} />
                            </Grid>
                            <Grid item xs>
                                <TextField value={tag} name="tag" type="text" label="Címke" variant="filled"
                                    onChange={(e) => {
                                        setTag(e.target.value)
                                    }}
                                    required style={{ width: 800 }} />
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