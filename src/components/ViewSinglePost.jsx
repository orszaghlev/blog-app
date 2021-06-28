import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
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

export function ViewSinglePost(props) {
    const [post, setPost] = useState([]);
    const [isPending, setPending] = useState(false);
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

    useEffect(() => {
        setPending(true);
        const config = {
            headers: { Authorization: `Bearer ${props.match.params.accessToken}` }
        };
        axios.get(`http://localhost:8000/api/posts/${props.match.params.id}`, config)
            .then(data => setPost(data.data))
            .catch(error => {
                console.error('Hiba!', error);
            });
        setPending(false);
    }, [props.match.params.id, props.match.params.accessToken])

    if (isPending) {
        return <Spinner />
    } else {
        return (
            <div className="card m-auto" style={{ width: "1000px" }}>
                <Helmet>
                    <title>{post.title}</title>
                    <meta name="description" content={post.description} />
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
                                image={post.imgURL}
                                title={post.title}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h3" component="h3">
                                    {post.title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    {post.tag}
                                </Typography>
                                <Typography variant="h6" color="textPrimary" component="h6">
                                    {post.description}
                                </Typography>
                                <Typography variant="body2" color="textPrimary" component="p" align="left">
                                    {post.content}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        <CardActions>
                            <Button size="small" color="secondary" align="center" onClick={() => {
                                history.push(`/posts/${props.match.params.accessToken}`)
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