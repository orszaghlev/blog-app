import { useState, useEffect, useContext, useRef } from "react";
import PropTypes from 'prop-types';
import { Button } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import { Editor } from '@tinymce/tinymce-react';
import slugify from 'react-slugify';
import FirebaseContext from '../../../contexts/Firebase';

export default function EditPost({ post }) {
    const [id, setId] = useState("");
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [imgURL, setImgURL] = useState("");
    const [tag, setTag] = useState("");
    const [language, setLanguage] = useState("");
    const [isActive, setIsActive] = useState("");
    const [date, setDate] = useState("");
    const [notification, setNotification] = useState("");
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
    const { firebase } = useContext(FirebaseContext);

    useEffect(() => {
        setId(post?.id);
        setTitle(post?.title);
        setSlug(post?.slug);
        setDescription(post?.description);
        setContent(post?.content);
        setImgURL(post?.imgURL);
        setTag(post?.tag);
        setLanguage(post?.language);
        setIsActive(post?.isActive);
        setDate(post?.date);
    }, [post]);

    return (
        <>
            <br />
            <h5>Bejegyzés szerkesztése</h5>
            <form data-testid="edit-post" className={classes.container} noValidate
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
                        language: e.target.elements.language.value,
                        isActive: e.target.elements.isActive.value,
                        date: e.target.elements.date.value ?
                            e.target.elements.date.value.toString().replace("T", ". ").replaceAll("-", ". ") :
                            new Date().toLocaleTimeString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                        comments: post?.comments ? post.comments : [],
                        saves: post?.saves ? post.saves : []
                    };
                    await firebase.firestore().collection('posts').doc(data.id).set(data);
                }}
            >
                <Grid container spacing={2}
                    direction="column"
                    justify="space-around"
                    alignItems="stretch">
                    <Grid item xs>
                        <TextField inputProps={{ "data-testid": "input-edit-id" }} value={id} name="id" type="text" label="ID" variant="filled"
                            onChange={(e) => {
                                setId(e.target.value);
                            }}
                            required style={{ width: 800 }} />
                    </Grid>
                    <Grid item xs>
                        <TextField inputProps={{ "data-testid": "input-edit-title" }} value={title} name="title" type="text" label="Cím" variant="filled"
                            onChange={(e) => {
                                setTitle(e.target.value);
                                setSlug(slugify(e.target.value));
                            }}
                            required style={{ width: 800 }} />
                    </Grid>
                    <Grid item xs>
                        <TextField inputProps={{ "data-testid": "input-edit-slug" }} value={slug} name="slug" type="text" label="Slug" variant="filled"
                            required style={{ width: 800 }} />
                    </Grid>
                    <Grid item xs>
                        <Grid
                            container
                            alignItems="center"
                            justify="center"
                        >
                            <div class="form-group" style={{ width: "800px" }}>
                                <textarea data-tesitd="input-edit-description" value={description} name="description" label="Leírás" class="form-control" rows="3" required
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
                        <TextField inputProps={{ "data-testid": "input-edit-imgurl" }} value={imgURL} name="imgURL" label="Kép URL" variant="filled"
                            onChange={(e) => {
                                setImgURL(e.target.value);
                            }}
                            type="text" required style={{ width: 800 }} />
                    </Grid>
                    <Grid item xs>
                        <TextField inputProps={{ "data-testid": "input-edit-tag" }} value={tag} name="tag" type="text" label="Címkék" variant="filled"
                            onChange={(e) => {
                                setTag(e.target.value);
                            }}
                            required style={{ width: 800 }} />
                    </Grid>
                    <Grid item xs>
                        <TextField inputProps={{ "data-testid": "input-edit-language" }} value={language} name="language" label="Nyelv" variant="filled" type="text" select
                            onChange={(e) => {
                                setLanguage(e.target.value)
                            }}
                            required style={{ width: 800, textAlign: "left" }} >
                            <MenuItem value="Hungarian">Magyar</MenuItem>
                            <MenuItem value="English">Angol</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs>
                        <TextField
                            inputProps={{ "data-testid": "input-edit-date" }}
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
                        <TextField inputProps={{ "data-testid": "input-edit-isActive" }} value={isActive} name="isActive" label="Állapot" variant="filled" type="text" select
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
                            direction="column"
                            justify="center"
                            alignItems="center">
                            <Button type="submit" variant="contained" color="secondary" onClick={() => {
                                setNotification("Sikeres szerkesztés!");
                                setTimeout(() => {
                                    setNotification("");
                                }, 5000);
                            }}>
                                Szerkesztés
                            </Button>
                            {notification !== "" && (
                                <div className="text-success m-1">
                                    <h6>{notification}</h6>
                                </div>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
            </form>
            {notification === "" && (
                <br />
            )}
        </>
    )
}

EditPost.propTypes = {
    post: PropTypes.object.isRequired
};