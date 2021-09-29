import { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from 'prop-types';
import { Button } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import { Editor } from '@tinymce/tinymce-react';
import slugify from 'react-slugify';
import { firebase } from "../../../lib/Firebase";
import * as ROUTES from '../../../constants/Routes';

export default function ShowEditPost({ post }) {
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
        setId(post?.id);
        setTitle(post?.title);
        setSlug(post?.slug);
        setDescription(post?.description);
        setContent(post?.content);
        setImgURL(post?.imgURL);
        setTag(post?.tag);
        setIsActive(post?.isActive);
        setDate(post?.date);
    }, [post]);

    return (
        <>
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
                            new Date().toLocaleTimeString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                        comments: post?.comments,
                        saves: post?.saves
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
                                Szerkesztés
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

ShowEditPost.propTypes = {
    post: PropTypes.object.isRequired
};