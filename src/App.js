import './App.css';
import { BrowserRouter, NavLink, Route, Redirect, Switch } from "react-router-dom";
import { Home } from "./components/Home.jsx";
import { ViewAllPosts } from "./components/ViewAllPosts.jsx";
import { ViewSinglePost } from "./components/ViewSinglePost.jsx";
import { Helmet } from "react-helmet-async";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

function App() {
  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }));

  const classes = useStyles();

  return (
    <div className="App">
      <Helmet>
        <title>Blog alkalmazás</title>
        <meta name="description" content="Blog alkalmazás" />
      </Helmet>
      <BrowserRouter>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            </IconButton>
            <Typography variant="h6" className={classes.title} align="left">
              Blog App
            </Typography>
            <Button color="inherit">
              <NavLink to={`/`}>
                <span className="nav-link" style={{ color: 'white' }}>Bejelentkezés</span>
              </NavLink>
            </Button>
          </Toolbar>
        </AppBar>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/posts/:accessToken" exact component={ViewAllPosts} />
          <Route path="/posts/:accessToken/:id" component={ViewSinglePost} />
          <Redirect to="/" />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
