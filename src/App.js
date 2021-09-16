import React, { Suspense } from "react";
import { BrowserRouter, NavLink, Route, Redirect, Switch } from "react-router-dom";
import { Home } from "./pages/Home";
import { ViewPost } from "./pages/ViewPost";
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import { Profile } from "./pages/Profile";
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
import { firebase } from "./lib/Firebase";
import * as ROUTES from "./constants/Routes";
import ProtectedRoute from './helpers/ProtectedRoute';
import UserContext from './contexts/User';
import useAuthListener from './hooks/UseAuthListener';

export default function App() {
  const { user } = useAuthListener();

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
        <title>Blogmotor</title>
        <meta name="description" content="Blogmotor" />
      </Helmet>
      <UserContext.Provider value={{ user }}>
        <BrowserRouter>
          <Suspense fallback={<p>Betöltés...</p>}>
            <AppBar position="static">
              <Toolbar>
                <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                </IconButton>
                <Typography variant="h6" className={classes.title} align="left">
                  <NavLink to={ROUTES.HOME}>
                    <span className="nav-link" style={{ color: 'white' }}>Blogmotor</span>
                  </NavLink>
                </Typography>
                {!user && <>
                  <Button color="inherit">
                    <NavLink to={ROUTES.LOGIN}>
                      <span className="nav-link" style={{ color: 'white' }}>Bejelentkezés</span>
                    </NavLink>
                  </Button>
                </>}
                {user && user.username === "admin" && <>
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
                {user && <>
                  <Button color="inherit">
                    <NavLink to={ROUTES.PROFILE}>
                      <span className="nav-link" style={{ color: 'white' }}>Profil</span>
                    </NavLink>
                  </Button>
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
              <ProtectedRoute user={user} path={ROUTES.PROFILE} exact>
                <Profile />
              </ProtectedRoute>
              <Route path={ROUTES.ADMIN_ALL_POSTS} component={AdminAllPosts} />
              <Route path={ROUTES.ADMIN_FAVORITE_POSTS} component={AdminFavoritePosts} />
              <Route path={ROUTES.ADMIN_CREATE_POST} component={AdminCreatePost} />
              <Route path={ROUTES.ADMIN_EDIT_POST} component={AdminEditPost} />
              <Redirect to={ROUTES.HOME} />
            </Switch>
          </Suspense>
        </BrowserRouter>
      </UserContext.Provider>
    </div >
  );
}
