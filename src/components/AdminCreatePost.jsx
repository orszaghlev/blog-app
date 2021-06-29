import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Spinner } from "./Spinner";
import axios from "axios";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Button } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { Grid } from "@material-ui/core";

export function AdminCreatePost(props) {
    const [isPending, setPending] = useState(false);

    const history = useHistory();

    if (isPending) {
        return <Spinner />
    }

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
                        axios.post('http://localhost:8000/admin/api/posts', data, config)
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