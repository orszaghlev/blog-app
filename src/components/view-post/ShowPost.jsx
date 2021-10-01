import { useState, useContext, useRef } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import FirebaseContext from "../../contexts/Firebase";
import * as ROUTES from '../../constants/Routes';

export default function ShowPost({ post, user }) {
    const [toggleSaved, setToggleSaved] = useState(user?.favoritePosts?.includes(post?.title));
    const { firebase, FieldValue } = useContext(FirebaseContext);
    const [notification, setNotification] = useState('');
    const history = useHistory();
    const useStyles = makeStyles({
        root: {
            maxWidth: 1000,
        },
        media: {
            height: 200,
        },
    });
    const classes = useStyles();
    const editorRef = useRef(null);
    const handleToggleSaved = async () => {
        setToggleSaved((toggleSaved) => !toggleSaved);
        await firebase
            .firestore()
            .collection('posts')
            .doc(post?.docId)
            .update({
                saves: toggleSaved ? FieldValue.arrayRemove(user?.userId) : FieldValue.arrayUnion(user?.userId)
            });
        await firebase
            .firestore()
            .collection('users')
            .doc(user?.docId)
            .update({
                favoritePosts: toggleSaved ? FieldValue.arrayRemove(post?.title) : FieldValue.arrayUnion(post?.title)
            });
    };

    return (
        <>
            <br />
            <Card className={classes.root}>
                <CardActionArea>
                    <CardMedia
                        className={classes.media}
                        image={post?.imgURL}
                        title={post?.title}
                    />
                    <CardContent>
                        <Typography variant="body2" color="textSecondary" component="p">
                            {post?.date}
                        </Typography>
                        <Typography gutterBottom variant="h4" component="h4">
                            {post?.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            {post?.tag.includes(",") ? "Címkék" : "Címke"}: {post?.tag}
                        </Typography>
                        <Typography variant="h6" color="textPrimary" component="h6">
                            {post?.description}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CKEditor
                    editor={ClassicEditor}
                    data={post?.content}
                    config={{
                        toolbar: []
                    }}
                    onReady={editor => {
                        editorRef.current = editor;
                        editor.isReadOnly = true;
                    }}
                />
                <CardActions style={{ justifyContent: "center" }}>
                    {user &&
                        <Button size="small" color="primary" align="center" onClick={() => {
                            handleToggleSaved();
                            setNotification(!toggleSaved ? "Sikeres hozzáadás!" : "Sikeres eltávolítás!");
                        }}>
                            {!toggleSaved ? "Hozzáadás a kedvencekhez" : "Eltávolitás a kedvencek közül"}
                        </Button>
                    }
                    <Button size="small" color="secondary" align="center" onClick={() => {
                        history.push(ROUTES.HOME)
                    }}>
                        Vissza
                    </Button>
                </CardActions>
                {notification && (
                    <div className="text-success">
                        {notification}
                    </div>
                )}
            </Card>
        </>
    )
}

ShowPost.propTypes = {
    post: PropTypes.object.isRequired,
    user: PropTypes.object
};