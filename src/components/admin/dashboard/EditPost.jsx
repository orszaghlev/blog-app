import { useState, useEffect, useContext, useRef } from "react";
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Button } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import { Editor } from '@tinymce/tinymce-react';
import slugify from 'react-slugify';
import FirebaseContext from '../../../contexts/Firebase';

export default function EditPost({ post, isTabletOrMobile }) {
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
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 300,
        boxShadow: 24,
        p: 4,
    };
    const handleEditPost = async (e) => {
        e.preventDefault();
        const data = {
            id: id,
            title: title,
            slug: slug,
            description: description,
            content: content,
            imgURL: imgURL,
            tag: tag,
            language: language,
            isActive: isActive,
            date: date ? date :
                new Date().toLocaleTimeString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
            comments: post?.comments ? post.comments : [],
            saves: post?.saves ? post.saves : []
        };
        await firebase.firestore().collection('posts').doc(data.id).set(data);
        window.location.reload();
    };

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
            <form data-testid="edit-post-form" className={classes.container} noValidate
                onSubmit={handleEditPost}
            >
                <Grid container spacing={2}
                    direction="column"
                    justifyContent="space-around"
                    alignItems="stretch">
                    <h4>Bejegyzés szerkesztése</h4>
                    <Grid item xs>
                        <TextField className="TextField" inputProps={{ "data-testid": "input-edit-id" }} value={id} name="id" type="text" label="ID" variant="filled"
                            onChange={(e) => {
                                setId(e.target.value);
                            }}
                            required style={{ width: isTabletOrMobile ? 300 : 700 }} />
                    </Grid>
                    <Grid item xs>
                        <TextField className="TextField" inputProps={{ "data-testid": "input-edit-title" }} value={title} name="title" type="text" label="Cím" variant="filled"
                            onChange={(e) => {
                                setTitle(e.target.value);
                                setSlug(slugify(e.target.value));
                            }}
                            required style={{ width: isTabletOrMobile ? 300 : 700 }} />
                    </Grid>
                    <Grid item xs>
                        <TextField className="TextField" inputProps={{ "data-testid": "input-edit-slug" }} value={slug} name="slug" type="text" label="Slug" variant="filled"
                            required style={{ width: isTabletOrMobile ? 300 : 700 }} />
                    </Grid>
                    <Grid item xs>
                        <Grid
                            container
                            alignItems="center"
                            justifyContent="center"
                        >
                            <div className="form-group" style={{ width: isTabletOrMobile ? 300 : 700 }}>
                                <textarea data-testid="input-edit-description" value={description} name="description" label="Leírás" className="form-control" rows="3" required
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
                            justifyContent="center"
                        >
                            <Editor
                                apiKey={process.env.REACT_APP_TINY_API_KEY}
                                onInit={(editor) => editorRef.current = editor}
                                value={content}
                                init={{
                                    skin: (document.body.className === "dark-mode" ? "oxide-dark" : ""),
                                    content_css: (document.body.className === "dark-mode" ? "dark" : ""),
                                    language: 'hu_HU',
                                    width: isTabletOrMobile ? 300 : 700,
                                    menubar: false,
                                    plugins: [
                                        'advlist autolink lists link image charmap print preview anchor',
                                        'searchreplace visualblocks code fullscreen',
                                        'insertdatetime media table paste code wordcount'
                                    ],
                                    toolbar: 'undo redo | formatselect | ' +
                                        'bold italic | alignleft aligncenter ' +
                                        'alignright alignjustify | bullist numlist outdent indent | ' +
                                        'removeformat',
                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                }}
                                onEditorChange={(content) => {
                                    setContent(content);
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs>
                        <TextField className="TextField" inputProps={{ "data-testid": "input-edit-imgURL" }} value={imgURL} name="imgURL" label="Kép URL" variant="filled"
                            onChange={(e) => {
                                setImgURL(e.target.value);
                            }}
                            type="text" required style={{ width: isTabletOrMobile ? 300 : 700 }} />
                    </Grid>
                    <Grid item xs>
                        <TextField className="TextField" inputProps={{ "data-testid": "input-edit-tag" }} value={tag} name="tag" type="text" label="Címkék" variant="filled"
                            onChange={(e) => {
                                setTag(e.target.value);
                            }}
                            required style={{ width: isTabletOrMobile ? 300 : 700 }} />
                    </Grid>
                    <Grid item xs>
                        <TextField className="TextField" inputProps={{ "data-testid": "input-edit-language" }} value={language} name="language" label="Nyelv" variant="filled" type="text" select
                            onChange={(e) => {
                                setLanguage(e.target.value)
                            }}
                            required style={{ width: isTabletOrMobile ? 300 : 700, textAlign: "left" }} >
                            <MenuItem value="Hungarian">Magyar</MenuItem>
                            <MenuItem value="English">Angol</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs>
                        <TextField
                            inputProps={{ "data-testid": "input-edit-date" }}
                            style={{ width: isTabletOrMobile ? 300 : 700 }}
                            id="datetime-local"
                            name="date"
                            label="Dátum"
                            type="datetime-local"
                            value={date.toString().replaceAll(". ", "-").split("").reverse().join("").replace("-", "T").split("").reverse().join("")}
                            className="TextField"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={(e) => {
                                setDate(e.target.value.toString().replace("T", ". ").replaceAll("-", ". "));
                            }}
                        />
                    </Grid>
                    <Grid item xs>
                        <TextField className="TextField" inputProps={{ "data-testid": "input-edit-isActive" }} value={isActive} name="isActive" label="Állapot" variant="filled" type="text" select
                            onChange={(e) => {
                                setIsActive(e.target.value)
                            }}
                            required style={{ width: isTabletOrMobile ? 300 : 700, textAlign: "left" }} >
                            <MenuItem value="true">Aktív</MenuItem>
                            <MenuItem value="false">Inaktív</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs>
                        <Grid container spacing={2}
                            direction="column"
                            justifyContent="center"
                            alignItems="center">
                            <Button data-testid="edit-post-button" variant="contained" color="primary" onClick={handleOpen}>
                                Szerkesztés
                            </Button>
                            <Modal
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="edit-post-modal"
                                aria-describedby="edit-post-modal-description"
                            >
                                <Box sx={style}>
                                    <Typography id="edit-post-modal" variant="h6" component="h2">
                                        Biztos benne, hogy szerkeszti a(z) {post?.title} bejegyzést?
                                    </Typography>
                                    <Typography id="edit-post-modal-description" sx={{ mt: 2 }}>
                                        <Button data-testid="edit-post-edit" variant="contained" color="secondary" style={{ marginRight: "10px" }} type="submit" onClick={handleEditPost}>
                                            Szerkesztés
                                        </Button>
                                        <Button data-testid="edit-post-return" variant="contained" color="primary" onClick={() => {
                                            handleClose();
                                        }}>
                                            Vissza
                                        </Button>
                                    </Typography>
                                </Box>
                            </Modal>
                        </Grid>
                    </Grid>
                </Grid>
            </form>
            <br />
        </>
    )
}

EditPost.propTypes = {
    post: PropTypes.object.isRequired,
    isTabletOrMobile: PropTypes.bool.isRequired
};