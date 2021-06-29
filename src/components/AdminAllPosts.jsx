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
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

export function AdminAllPosts(props) {
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState("");
    const [isPending, setPending] = useState(false);
    const history = useHistory();

    const useStyles = makeStyles((theme) => ({
        root: {
            maxWidth: 345,
        },
        media: {
            height: 140,
        },
        search: {
            '& > *': {
                margin: theme.spacing(0),
                width: '25ch',
            },
        },
    }));

    const classes = useStyles();

    useEffect(() => {
        setPending(true);
        const config = {
            headers: { Authorization: `Bearer ${props.match.params.accessToken}` }
        };
        axios.get('http://localhost:8000/api/posts', config)
            .then(data => setPosts(data.data))
            .catch(error => {
                console.error('Hiba!', error);
            });
        setPending(false);
    }, [props.match.params.accessToken])

    if (isPending) {
        return <Spinner />
    } else if (posts.length === 0) {
        return (
            <div class="jumbotron">
                <motion.div
                    animate={{ scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                >
                    <h3>Nincsenek elérhető bejegyzések!</h3>
                </motion.div>
            </div>
        )
    } else {
        return (
            <div className="p-1 m-auto text-center content bg-ivory">
                <Helmet>
                    <title>Bejegyzések</title>
                    <meta name="description" content="Bejegyzések" />
                </Helmet>
                <motion.div
                    animate={{ scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2>Bejegyzések</h2>
                </motion.div>
                <Grid container
                    direction="row"
                    justify="space-evenly"
                    alignItems="center">
                    <form className={classes.search} noValidate autoComplete="off"
                        onChange={e => setSearch(e.target.value)}>
                        <TextField id="search" label="Keresés..." variant="filled" />
                    </form>
                    <Button m="2rem" variant="contained" onClick={() => {
                        setPosts(posts.filter(li => li.tag.toLowerCase().includes("hun")))
                    }}>
                        Csak magyar nyelvű bejegyzések
                    </Button>
                </Grid>
                {
                    posts.filter(li =>
                        li.title.toLowerCase().includes(search.toLowerCase()) ||
                        li.slug.toLowerCase().includes(search.toLowerCase()) ||
                        li.description.toLowerCase().includes(search.toLowerCase()) ||
                        li.content.toLowerCase().includes(search.toLowerCase()))
                        .map((post) => (
                            <div className="card col-sm-3 d-inline-block m-1 p-2 h-100" onClick={() => {
                                history.push(`/${post.id}`)
                            }}>
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
                                                <Typography gutterBottom variant="h5" component="h2">
                                                    {post.title}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">
                                                    {post.description}
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                        <CardActions>
                                            <Button size="small" color="primary" align="center">
                                                Tovább
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </motion.div>
                            </div>
                        ))
                }
            </div >
        )
    }
}