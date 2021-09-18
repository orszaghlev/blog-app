import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Button } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import { Editor } from '@tinymce/tinymce-react';
import slugify from 'react-slugify';
import { firebase } from "../lib/Firebase";
import * as ROUTES from '../constants/Routes';
import PostNotAvailable from "../components/admin/edit-post/PostNotAvailable";
import UnauthorizedAccess from "../components/admin/edit-post/UnauthorizedAccess";

export function AdminEditPost(props) {
    const history = useHistory();
    const [id, setId] = useState("");
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [imgURL, setImgURL] = useState("");
    const [tag, setTag] = useState("");
    const [isActive, setIsActive] = useState("");
    const [date, setDate] = useState("");

    const [isSignedIn, setIsSignedIn] = useState(false);

    const editorRef = useRef(null);

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
        firebase.firestore().collection("posts").doc(props.match.params.id).get().then((post) => {
            setId(post.data().id);
            setTitle(post.data().title);
            setSlug(post.data().slug);
            setDescription(post.data().description);
            setContent(post.data().content);
            setImgURL(post.data().imgURL);
            setTag(post.data().tag);
            setIsActive(post.data().isActive);
            setDate(post.data().date);
        })
            .catch((error) => { console.log(error) });
        const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
            setIsSignedIn(!!user);
        });
        return () => unregisterAuthObserver();
    }, [props.match.params.id])

    if (id === "") {
        return <PostNotAvailable />
    } else if (!isSignedIn || !firebase.auth().currentUser.emailVerified) {
        return <UnauthorizedAccess />
    } else {
        return (
            <div className="p-3 content text-center m-auto" style={{ width: "1000px" }}>
                <Helmet>
                    <title>Bejegyzés szerkesztése</title>
                    <meta name="description" content="Bejegyzés szerkesztése" />
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
                    <h2>Bejegyzés szerkesztése</h2>
                    <form className={classes.container} noValidate
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
                                isActive: e.target.elements.isActive.value,
                                date: e.target.elements.date.value ?
                                    e.target.elements.date.value.toString().replace("T", ". ").replaceAll("-", ". ") :
                                    new Date().toLocaleTimeString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                            };
                            firebase.firestore().collection('posts').doc(data.id).set(data);
                            history.push(ROUTES.ADMIN_ALL_POSTS);
                        }}
                    >
                        <Grid container spacing={2}
                            direction="column"
                            justify="space-around"
                            alignItems="stretch">
                            <Grid item xs>
                                <TextField value={id} name="id" type="text" label="ID" variant="filled"
                                    onChange={(e) => {
                                        setId(e.target.value);
                                    }}
                                    required style={{ width: 800 }} />
                            </Grid>
                            <Grid item xs>
                                <TextField value={title} name="title" type="text" label="Cím" variant="filled"
                                    onChange={(e) => {
                                        setTitle(e.target.value);
                                        setSlug(slugify(e.target.value));
                                    }}
                                    required style={{ width: 800 }} />
                            </Grid>
                            <Grid item xs>
                                <TextField value={slug} name="slug" type="text" label="Slug" variant="filled"
                                    required style={{ width: 800 }} />
                            </Grid>
                            <Grid item xs>
                                <Grid
                                    container
                                    alignItems="center"
                                    justify="center"
                                >
                                    <div class="form-group" style={{ width: "800px" }}>
                                        <textarea value={description} name="description" label="Leírás" class="form-control" rows="3" required
                                            onChange={(e) => {
                                                setDescription(e.target.value);
                                            }}>{description}</textarea>
                                    </div>
                                </Grid>
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
                                        value={content}
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
                                        onEditorChange={(content) => {
                                            setContent(content);
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item xs>
                                <TextField value={imgURL} name="imgURL" label="Kép URL" variant="filled"
                                    onChange={(e) => {
                                        setImgURL(e.target.value);
                                    }}
                                    type="text" required style={{ width: 800 }} />
                            </Grid>
                            <Grid item xs>
                                <TextField value={tag} name="tag" type="text" label="Címkék" variant="filled"
                                    onChange={(e) => {
                                        setTag(e.target.value);
                                    }}
                                    required style={{ width: 800 }} />
                            </Grid>
                            <Grid item xs>
                                <TextField
                                    style={{ width: "800px" }}
                                    id="datetime-local"
                                    name="date"
                                    label="Dátum"
                                    type="datetime-local"
                                    value={date.toString().replaceAll(". ", "-").split("").reverse().join("").replace("-", "T").split("").reverse().join("")}
                                    className={classes.textField}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={(e) => {
                                        setDate(e.target.value.toString().replace("T", ". ").replaceAll("-", ". "));
                                    }}
                                />
                            </Grid>
                            <Grid item xs>
                                <TextField value={isActive} name="isActive" label="Állapot" variant="filled" type="text" select
                                    onChange={(e) => {
                                        setIsActive(e.target.value)
                                    }}
                                    required style={{ width: 800, textAlign: "left" }} >
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
                                        history.push(ROUTES.ADMIN_ALL_POSTS)
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