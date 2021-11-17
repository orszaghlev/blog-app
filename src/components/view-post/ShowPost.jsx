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
import Grid from '@material-ui/core/Grid';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import FirebaseContext from "../../contexts/Firebase";
import * as ROUTES from '../../constants/Routes';
import { FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon } from "react-share";

export default function ShowPost({ post, user }) {
    const [toggleSaved, setToggleSaved] = useState(user?.favoritePosts?.includes(post?.title));
    const { firebase, FieldValue } = useContext(FirebaseContext);
    const [notification, setNotification] = useState('');
    const history = useHistory();
    const useStyles = makeStyles({
        root: {
            maxWidth: 1224,
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
                            {post?.language === "Hungarian" ? (post?.tag.includes(",") ? "Címkék" : "Címke") : (post?.tag.includes(",") ? "Tags" : "Tag")}: {post?.tag}
                        </Typography>
                        <Typography variant="h6" color="textPrimary" component="h6">
                            {post?.description}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CKEditor
                    editor={ClassicEditor}
                    data={post?.content}
                    disabled={true}
                    config={{
                        alignment: {
                            options: ['justify']
                        },
                        toolbar: []
                    }}
                    onReady={editor => {
                        editorRef.current = editor;
                    }}
                />
                <CardActions style={{ justifyContent: "center" }}>
                    {user &&
                        <Button data-testid="add-to-favorites" size="small" color="primary" align="center" onClick={() => {
                            handleToggleSaved();
                            setNotification(post?.language === "Hungarian" ? (!toggleSaved ? "Sikeres hozzáadás!" : "Sikeres eltávolítás!") : (!toggleSaved ? "Post successfully added!" : "Post successfully removed!"));
                            setTimeout(() => {
                                setNotification("");
                            }, 5000);
                        }}>
                            {post?.language === "Hungarian" ? (!toggleSaved ? "Hozzáadás a kedvencekhez" : "Eltávolítás a kedvencek közül") : (!toggleSaved ? "Add to favorites" : "Remove from favorites")}
                        </Button>
                    }
                    <Button data-testid="show-post-return" size="small" color="secondary" align="center" onClick={() => {
                        history.push(ROUTES.HOME)
                    }}>
                        {post?.language === "Hungarian" ? "Vissza" : "Return"}
                    </Button>
                </CardActions>
                <Grid container
                    direction="row"
                    justifyContent="center"
                    alignItems="center">
                    <FacebookShareButton
                        url={process.env.REACT_APP_FIREBASE_AUTH_DOMAIN + `/posts/${post?.slug}`}
                        quote={post?.title}
                        hashtag={"#" + post?.title.toLowerCase().replace(' ', '_')}
                        description={post?.description}
                        className="facebook-share-button">
                        <FacebookIcon size={32} round />
                    </FacebookShareButton>
                    <TwitterShareButton
                        title={post?.title}
                        url={process.env.REACT_APP_FIREBASE_AUTH_DOMAIN + `/posts/${post?.slug}`}
                        hashtags={[post?.title.toLowerCase().replace(' ', '_')]}>
                        <TwitterIcon size={32} round />
                    </TwitterShareButton>
                </Grid>
                <br />
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