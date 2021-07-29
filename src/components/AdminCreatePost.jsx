import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Button } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import MenuItem from '@material-ui/core/MenuItem';
import { Editor } from '@tinymce/tinymce-react';
import slugify from 'react-slugify';
import firebase from "../firebase/clientApp";

export function AdminCreatePost() {
    const history = useHistory();
    const [content, setContent] = useState("");
    const [slug, setSlug] = useState("");

    const [isSignedIn, setIsSignedIn] = useState(false);

    const editorRef = useRef(null);

    useEffect(() => {
        const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
            setIsSignedIn(!!user);
        });
        return () => unregisterAuthObserver();
    }, []);

    if (!isSignedIn || !firebase.auth().currentUser.emailVerified) {
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
                        <Button m="2rem" style={{ marginRight: "10px" }} variant="contained" color="primary" onClick={() => {
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
            <div className="p-3 content text-center m-auto" style={{ width: "1000px" }}>
                <Helmet>
                    <title>Bejegyzés létrehozása</title>
                    <meta name="description" content="Bejegyzés létrehozása" />
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
                    <h2>Bejegyzés létrehozása</h2>
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            const data = {
                                id: e.target.elements.id.value,
                                title: e.target.elements.title.value,
                                slug: e.target.elements.slug.value,
                                description: e.target.elements.description.value,
                                content: content,
                                imgURL: e.target.elements.imgURL.value,
                                tag: e.target.elements.tag.value,
                                isActive: e.target.elements.isActive.value
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
                                <TextField name="title" label="Cím" variant="filled" type="text" required style={{ width: 800 }}
                                    onChange={(e) => {
                                        setSlug(slugify(e.target.value));
                                    }} />
                            </Grid>
                            <Grid item xs>
                                <TextField value={slug} name="slug" label="Slug" variant="filled" type="text" required style={{ width: 800 }} />
                            </Grid>
                            <Grid item xs>
                                <TextareaAutosize name="description" label="Leírás" type="text" aria-label="maximum height" maxRows={3}
                                    placeholder="Leírás" required style={{ width: 800 }} />
                            </Grid>
                            <Grid item xs>
                                <Grid
                                    container
                                    alignItems="center"
                                    justify="center"
                                >
                                    <Editor
                                        apiKey={process.env.REACT_APP_TINY_API_KEY}
                                        onInit={(editor) => editorRef.current = editor}
                                        initialValue="Tartalom"
                                        init={{
                                            language: 'hu_HU',
                                            width: 800,
                                            menubar: false,
                                            plugins: [
                                                'advlist autolink lists link image charmap print preview anchor',
                                                'searchreplace visualblocks code fullscreen',
                                                'insertdatetime media table paste code help wordcount'
                                            ],
                                            toolbar: 'undo redo | formatselect | ' +
                                                'bold italic backcolor | alignleft aligncenter ' +
                                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                                'removeformat | help',
                                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                        }}
                                        onChange={(e) => {
                                            setContent(e.target.getContent());
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item xs>
                                <TextField name="imgURL" label="Kép URL" variant="filled" type="text" required style={{ width: 800 }} />
                            </Grid>
                            <Grid item xs>
                                <TextField name="tag" label="Címke" variant="filled" type="text" required style={{ width: 800 }} />
                            </Grid>
                            <Grid item xs>
                            <TextField name="isActive" label="Állapot" variant="filled" type="text" required
                                style={{ width: 800, textAlign: "left" }} select>
                                <MenuItem value="true">Aktív</MenuItem>
                                <MenuItem value="false">Inaktív</MenuItem>
                            </TextField>
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