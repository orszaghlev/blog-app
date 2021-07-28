import './App.css';
import React, { useState, useEffect } from "react";
import { BrowserRouter, NavLink, Route, Redirect, Switch } from "react-router-dom";
import { Home } from "./components/Home.jsx";
import { ViewSinglePost } from "./components/ViewSinglePost.jsx";
import { AdminLogin } from "./components/AdminLogin.jsx";
import { AdminAllPosts } from "./components/AdminAllPosts.jsx";
import { AdminCreatePost } from "./components/AdminCreatePost.jsx";
import { AdminEditPost } from "./components/AdminEditPost.jsx";
import { Helmet } from "react-helmet-async";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import firebase from "./firebase/clientApp";

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
              <NavLink to={`/home`}>
                <span className="nav-link" style={{ color: 'white' }}>Blog App</span>
              </NavLink>
            </Typography>
            {!isSignedIn && <>
              <Button color="inherit">
                <NavLink to={`/admin/login`}>
                  <span className="nav-link" style={{ color: 'white' }}>Bejelentkezés</span>
                </NavLink>
              </Button>
            </>}
            {isSignedIn && !firebase.auth().currentUser.emailVerified && <>
              <Button color="inherit">
                <NavLink to={`/admin/login`}>
                  <span className="nav-link" style={{ color: 'white' }}>Hitelesítés</span>
                </NavLink>
              </Button>
            </>}
            {isSignedIn && firebase.auth().currentUser.emailVerified && <>
              <Button color="inherit">
                <NavLink to={`/admin/posts`}>
                  <span className="nav-link" style={{ color: 'white' }}>Adminisztrációs felület</span>
                </NavLink>
              </Button>
            </>}
            {isSignedIn && <>
              <Button color="inherit" onClick={() => firebase.auth().signOut()}>
                <NavLink to={`/home`}>
                  <span className="nav-link" style={{ color: 'white' }}>Kijelentkezés</span>
                </NavLink>
              </Button>
            </>}
          </Toolbar>
        </AppBar>
        <Switch>
          <Route path="/home" exact component={Home} />
          <Route path="/home/:id" component={ViewSinglePost} />
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin/posts" component={AdminAllPosts} />
          <Route path="/admin/create-post" component={AdminCreatePost} />
          <Route path="/admin/edit-post/:id" component={AdminEditPost} />
          <Redirect to="/home" />
        </Switch>
      </BrowserRouter >
    </div >
  );
}

export default App;
