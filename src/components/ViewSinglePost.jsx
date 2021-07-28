import React from "react";
import { useHistory } from "react-router-dom";
import { Spinner } from "./Spinner.jsx";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import firebase from "../firebase/clientApp";
import { useCollection } from "react-firebase-hooks/firestore";

export function ViewSinglePost(props) {
    const history = useHistory();
    const [post, postLoading] = useCollection(
        firebase.firestore().collection("posts").doc(props.match.params.id),
        {}
    );

    const useStyles = makeStyles({
        root: {
            maxWidth: 1000,
        },
        media: {
            height: 200,
        },
    });

    const classes = useStyles();

    if (postLoading) {
        return <Spinner />
    } else if (!post) {
        return (
            <div class="jumbotron">
                <motion.div
                    animate={{ scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                >
                    <h3>A kért bejegyzés nem érhető el!</h3>
                </motion.div>
            </div>
        )
    } else {
        return (
            <div className="card m-auto" style={{ width: "1000px" }}>
                <Helmet>
                    <title>{post.data().title}</title>
                    <meta name="description" content={post.data().description} />
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
                    <Card className={classes.root}>
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                image={post.data().imgURL}
                                title={post.data().title}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h4" component="h4">
                                    {post.data().title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    {post.data().tag}
                                </Typography>
                                <Typography variant="h6" color="textPrimary" component="h6">
                                    {post.data().description}
                                </Typography>
                                <Typography variant="body" color="textPrimary" component="p" align="left">
                                    {post.data().content}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        <CardActions style={{ justifyContent: "center" }}>
                            <Button size="small" color="secondary" align="center" onClick={() => {
                                history.push(`/home`)
                            }}>
                                Vissza
                            </Button>
                        </CardActions>
                    </Card>
                </motion.div>
            </div>
        )
    }
}