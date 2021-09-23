import { useRef } from "react";
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
import { Editor } from '@tinymce/tinymce-react';
import * as ROUTES from '../../constants/Routes';

export default function ShowPost({ post, user }) {
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
                <Editor
                    apiKey={process.env.REACT_APP_TINY_API_KEY}
                    onInit={(editor) => editorRef.current = editor}
                    value={post?.content}
                    init={{
                        selector: 'textarea',
                        readonly: 1,
                        language: 'hu_HU',
                        menubar: false,
                        toolbar: false,
                        statusbar: false,
                        resize: false,
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                    }}
                />
                <CardActions style={{ justifyContent: "center" }}>
                    {user &&
                        <Button size="small" color="primary" align="center" onClick={() => {

                        }}>
                            Hozzáadás a kedvencekhez
                        </Button>
                    }
                    <Button size="small" color="secondary" align="center" onClick={() => {
                        history.push(ROUTES.HOME)
                    }}>
                        Vissza
                    </Button>
                </CardActions>
            </Card>
        </>
    )
}

ShowPost.propTypes = {
    post: PropTypes.object.isRequired,
    user: PropTypes.object
};