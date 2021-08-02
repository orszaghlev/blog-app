import React, { useState } from "react";
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
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { NavigateNext as NavigateNextIcon } from '@material-ui/icons';
import { NavigateBefore as NavigateBeforeIcon } from '@material-ui/icons';
import { IconButton } from "@material-ui/core";
import firebase from "../firebase/clientApp";
import { usePagination } from "use-pagination-firestore";

export function Home() {
    const [search, setSearch] = useState("");
    const [hunCount, setHunCount] = useState(1);
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

    const {
        items,
        isLoading,
        isStart,
        isEnd,
        getPrev,
        getNext,
    } = usePagination(
        firebase
            .firestore()
            .collection("/posts")
            .orderBy("id", "asc"),
        {
            limit: 9
        }
    );

    if (isLoading) {
        return <Spinner />
    } else if (!items) {
        return (
            <div class="jumbotron">
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
                    <h2>Bejegyzések</h2>
                    <Grid container
                        direction="row"
                        justify="space-evenly"
                        alignItems="center">
                        <form className={classes.search} noValidate autoComplete="off"
                            onChange={e => setSearch(e.target.value)}>
                            <TextField id="search" label="Keresés..." variant="filled" />
                        </form>
                        <Button variant="contained" style={{
                            backgroundColor: search === "hun" ? 'green' : '#dc3545',
                            color: 'white'
                        }}
                            onClick={() => {
                                setHunCount(hunCount + 1);
                                if (hunCount % 2 === 1) {
                                    setSearch("hun");
                                } else if (hunCount % 2 === 0) {
                                    setSearch("");
                                }
                            }}>Csak magyar bejegyzések</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container justify="center">
                            <Grid item>
                                <IconButton onClick={getPrev} disabled={isStart}>
                                    <NavigateBeforeIcon />
                                </IconButton>
                                <IconButton onClick={getNext} disabled={isEnd}>
                                    <NavigateNextIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Grid>
                    {
                        items.filter(li =>
                            li.isActive.toString() === "true"
                            && (new Date(li.date).getTime() < new Date().getTime())
                            && (li.tag.toLowerCase().includes(search.toLowerCase()) ||
                                li.date.includes(search.toLowerCase()) ||
                                li.title.toLowerCase().includes(search.toLowerCase()) ||
                                li.slug.toLowerCase().includes(search.toLowerCase()) ||
                                li.description.toLowerCase().includes(search.toLowerCase()) ||
                                li.content.toLowerCase().includes(search.toLowerCase())))
                            .map((post) => (
                                <div className="card col-sm-3 d-inline-block m-1 p-2 h-100" onClick={() => {
                                    history.push(`/home/${post.id}`)
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
                                        <CardActions style={{ justifyContent: "center" }}>
                                            <Button size="small" color="primary" align="center">
                                                Tovább
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </div>
                            ))
                    }
                </motion.div>
            </div >
        )
    }
}