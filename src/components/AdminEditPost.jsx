import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Spinner } from "./Spinner";
import axios from "axios";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Button } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { Grid } from "@material-ui/core";

export function AdminEditPost(props) {
    const [isPending, setPending] = useState(false);
    const [post, setPost] = useState([]);
    const [id, setId] = useState("");
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [imgURL, setImgURL] = useState("");
    const [tag, setTag] = useState("");
    const history = useHistory();

    useEffect(() => {
        setPending(true);
        const config = {
            headers: { Authorization: `Bearer ${props.match.params.accessToken}` }
        };
        axios.get(`http://localhost:8000/admin/api/posts/${props.match.params.id}`, config)
            .then(data => setPost(data.data))
            .then(setId(post.id))
            .then(setTitle(post.title))
            .then(setSlug(post.slug))
            .then(setDescription(post.description))
            .then(setContent(post.content))
            .then(setImgURL(post.imgURL))
            .then(setTag(post.tag))
            .catch(error => {
                console.error('Hiba!', error);
            });
        setPending(false);
    }, [props.match.params.id, props.match.params.accessToken, post.id, post.title, post.slug, post.description,
    post.content, post.imgURL, post.tag])

    if (isPending) {
        return <Spinner />
    }

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
                        setPending(true);
                        const data = {
                            id: e.target.elements.id.value,
                            title: e.target.elements.title.value,
                            slug: e.target.elements.slug.value,
                            description: e.target.elements.description.value,
                            content: e.target.elements.content.value,
                            imgURL: e.target.elements.imgURL.value,
                            tag: e.target.elements.tag.value
                        };
                        const config = {
                            headers: { Authorization: `Bearer ${props.match.params.accessToken}` }
                        };
                        axios.put(`http://localhost:8000/admin/api/posts/${props.match.params.id}`, data, config)
                            .catch(error => {
                                console.error('Hiba!', error);
                            });
                        setPending(false);
                        history.push(`/admin/posts/${props.match.params.accessToken}`);
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
                                    history.push(`/admin/posts/${props.match.params.accessToken}`)
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