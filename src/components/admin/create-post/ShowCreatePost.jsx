import { useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import { Editor } from '@tinymce/tinymce-react';
import slugify from 'react-slugify';
import { firebase } from "../../../lib/Firebase";
import * as ROUTES from '../../../constants/Routes';

export default function ShowCreatePost() {
    const history = useHistory();
    const [content, setContent] = useState("");
    const [slug, setSlug] = useState("");
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

    return (
        <>
            <h2>Új bejegyzés</h2>
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
                            new Date().toLocaleTimeString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                        comments: [],
                        saves: []
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
                        <Grid
                            container
                            alignItems="center"
                            justify="center"
                        >
                            <div class="form-group" style={{ width: "800px" }}>
                                <textarea name="description" label="Leírás" class="form-control" rows="3" placeholder="Leírás" required />
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
                        <TextField name="tag" label="Címkék" variant="filled" type="text" required style={{ width: 800 }} />
                    </Grid>
                    <Grid item xs>
                        <TextField
                            style={{ width: "800px" }}
                            id="datetime-local"
                            name="date"
                            label="Dátum"
                            type="datetime-local"
                            className={classes.textField}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
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
                                history.push(ROUTES.ADMIN_ALL_POSTS)
                            }}>
                                Vissza
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </form>
        </>
    )
}