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
import { useMediaQuery } from 'react-responsive';

export default function ShowHome({ activePosts }) {
    const [search, setSearch] = useState("");
    const [hunSearch, setHunSearch] = useState(false);
    const [hunCount, setHunCount] = useState(1);
    const history = useHistory();
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
    const useStyles = makeStyles((theme) => ({
        root: {
            maxWidth: 408,
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
                justifyContent="space-evenly"
                alignItems="center">
                <form data-testid="search" className={classes.search} noValidate autoComplete="off"
                    onChange={e => setSearch(e.target.value)}>
                    <TextField size="small" className="TextField" inputProps={{ "data-testid": "input-search" }} id="search" label="Keresés..." variant="filled" />
                </form>
                <Button size="small" data-testid="hungarian-posts-only" variant="contained" style={{
                    backgroundColor: hunSearch ? 'green' : '#dc3545',
                    color: 'white',
                    marginTop: isTabletOrMobile ? '10px' : '0px'
                }}
                    onClick={() => {
                        setHunCount(hunCount + 1);
                        if (hunCount % 2 === 1) {
                            setHunSearch(true);
                        } else if (hunCount % 2 === 0) {
                            setHunSearch(false);
                        }
                    }}>Csak magyar bejegyzések
                </Button>
            </Grid>
            {
                activePosts?.filter(li =>
                    (new Date(li.date).getTime() < new Date().getTime())
                    && (hunSearch ? li.language.toLowerCase().includes("hungarian") : li.language.toLowerCase().includes(""))
                    && (li.tag.toLowerCase().includes(search.toLowerCase()) ||
                        li.language.toLowerCase().includes(search.toLowerCase()) ||
                        li.date.includes(search.toLowerCase()) ||
                        li.title.toLowerCase().includes(search.toLowerCase()) ||
                        li.slug.toLowerCase().includes(search.toLowerCase()) ||
                        li.description.toLowerCase().includes(search.toLowerCase()) ||
                        li.content.toLowerCase().includes(search.toLowerCase())))
                    .sort((a, b) => b.date.localeCompare(a.date))
                    .map((post, i) => (
                        <div key={i} className="col-sm-3 d-inline-block m-2 p-2">
                            <Grid container
                                direction="row"
                                justifyContent="center"
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
                                        <Button data-testid="view-post" size="small" color="primary" align="center" onClick={() => {
                                            history.push(`posts/${post?.slug}`)
                                        }}>
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
    allPosts: PropTypes.object
};