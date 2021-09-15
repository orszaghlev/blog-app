import React, { useState, useEffect } from "react";
import { BrowserRouter, NavLink, Route, Redirect, Switch } from "react-router-dom";
import { Home } from "./pages/Home";
import { ViewPost } from "./pages/ViewPost";
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import { AdminAllPosts } from "./pages/AdminAllPosts";
import { AdminCreatePost } from "./pages/AdminCreatePost";
import { AdminEditPost } from "./pages/AdminEditPost";
import { AdminFavoritePosts } from "./pages/AdminFavoritePosts";
import { Helmet } from "react-helmet-async";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import firebase from "./lib/Firebase";
import * as ROUTES from "./constants/Routes";

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

  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
      setIsSignedIn(!!user);
    });
    return () => unregisterAuthObserver();
  }, []);

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
              <NavLink to={ROUTES.HOME}>
                <span className="nav-link" style={{ color: 'white' }}>Blog App</span>
              </NavLink>
            </Typography>
            {!isSignedIn && <>
              <Button color="inherit">
                <NavLink to={ROUTES.LOGIN}>
                  <span className="nav-link" style={{ color: 'white' }}>Bejelentkezés</span>
                </NavLink>
              </Button>
            </>}
            {isSignedIn && firebase.auth().currentUser.emailVerified && <>
              <Button color="inherit">
                <NavLink to={ROUTES.ADMIN_CREATE_POST}>
                  <span className="nav-link" style={{ color: 'white' }}>Új bejegyzés</span>
                </NavLink>
              </Button>
              <Button color="inherit">
                <NavLink to={ROUTES.ADMIN_FAVORITE_POSTS}>
                  <span className="nav-link" style={{ color: 'white' }}>Kedvenc bejegyzések</span>
                </NavLink>
              </Button>
              <Button color="inherit">
                <NavLink to={ROUTES.ADMIN_ALL_POSTS}>
                  <span className="nav-link" style={{ color: 'white' }}>Összes bejegyzés</span>
                </NavLink>
              </Button>
            </>}
            {isSignedIn && <>
              <Button color="inherit" onClick={() => firebase.auth().signOut()}>
                <NavLink to={ROUTES.HOME}>
                  <span className="nav-link" style={{ color: 'white' }}>Kijelentkezés</span>
                </NavLink>
              </Button>
            </>}
          </Toolbar>
        </AppBar>
        <Switch>
          <Route path={ROUTES.HOME} exact component={Home} />
          <Route path={ROUTES.VIEW_POST} component={ViewPost} />
          <Route path={ROUTES.LOGIN} component={Login} />
          <Route path={ROUTES.SIGN_UP} component={SignUp} />
          <Route path={ROUTES.ADMIN_ALL_POSTS} component={AdminAllPosts} />
          <Route path={ROUTES.ADMIN_FAVORITE_POSTS} component={AdminFavoritePosts} />
          <Route path={ROUTES.ADMIN_CREATE_POST} component={AdminCreatePost} />
          <Route path={ROUTES.ADMIN_EDIT_POST} component={AdminEditPost} />
          <Redirect to={ROUTES.HOME} />
        </Switch>
      </BrowserRouter >
    </div >
  );
}

export default App;
