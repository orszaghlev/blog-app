import { useState } from "react";
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
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

export default function ShowHome({ posts }) {
    const [search, setSearch] = useState("");
    const [hunCount, setHunCount] = useState(1);
    const history = useHistory();
    const useStyles = makeStyles((theme) => ({
        root: {
            width: 350,
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

    return (
        <>
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
                    }}>Csak magyar bejegyzések
                </Button>
            </Grid>
            {
                posts?.filter(li =>
                    li.isActive.toString() === "true"
                    && (new Date(li.date).getTime() < new Date().getTime())
                    && (li.tag.toLowerCase().includes(search.toLowerCase()) ||
                        li.date.includes(search.toLowerCase()) ||
                        li.title.toLowerCase().includes(search.toLowerCase()) ||
                        li.slug.toLowerCase().includes(search.toLowerCase()) ||
                        li.description.toLowerCase().includes(search.toLowerCase()) ||
                        li.content.toLowerCase().includes(search.toLowerCase())))
                    .map((post) => (
                        <div className="card col-sm-3 d-inline-block m-1 p-2 h-100" style={{ border: "none" }} onClick={() => {
                            history.push(`/posts/${post?.slug}`)
                        }}>
                            <Grid container
                                direction="row"
                                justify="space-evenly"
                                alignItems="center">
                                <Card className={classes.root}>
                                    <CardActionArea>
                                        <CardMedia
                                            className={classes.media}
                                            image={post?.imgURL}
                                            title={post?.title}
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="h2">
                                                {post?.title}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary" component="p">
                                                {post?.description}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                    <CardActions style={{ justifyContent: "center" }}>
                                        <Button size="small" color="primary" align="center">
                                            Tovább
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        </div>
                    ))
            }
        </>
    )
}

ShowHome.propTypes = {
    posts: PropTypes.array.isRequired
};