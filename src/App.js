import { useState, Suspense, useEffect } from "react";
import { BrowserRouter, NavLink, Route, Redirect, Switch } from "react-router-dom";
import { Home } from "./pages/Home";
import { ViewPost } from "./pages/ViewPost";
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import { Profile } from "./pages/Profile";
import { ProfileEdit } from "./pages/ProfileEdit";
import { AdminAllPosts } from "./pages/AdminAllPosts";
import { AdminCreatePost } from "./pages/AdminCreatePost";
import { AdminEditPost } from "./pages/AdminEditPost";
import { Helmet } from "react-helmet-async";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { firebase } from "./lib/Firebase";
import * as ROUTES from "./constants/Routes";
import ProtectedRouteUser from './helpers/ProtectedRouteUser';
import ProtectedRouteAdmin from './helpers/ProtectedRouteAdmin';
import UserContext from './contexts/User';
import useAuthListener from './hooks/UseAuthListener';

export default function App() {
  const { user } = useAuthListener();
  const [admin, setAdmin] = useState(null);
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

  useEffect(() => {
    if (user?.uid === process.env.REACT_APP_FIREBASE_ADMIN_UID) {
      setAdmin(user);
    } else {
      setAdmin(null);
    }
  }, [user]);

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
                {admin !== null && <>
                  <Button color="inherit">
                    <NavLink to={ROUTES.ADMIN_CREATE_POST}>
                      <span className="nav-link" style={{ color: 'white' }}>Új bejegyzés</span>
                    </NavLink>
                  </Button>
                  <Typography>|</Typography>
                  <Button color="inherit">
                    <NavLink to={ROUTES.ADMIN_ALL_POSTS}>
                      <span className="nav-link" style={{ color: 'white' }}>Összes bejegyzés</span>
                    </NavLink>
                  </Button>
                  <Typography>|</Typography>
                </>}
                {user && <>
                  <Button color="inherit">
                    <NavLink to={ROUTES.PROFILE}>
                      <span className="nav-link" style={{ color: 'white' }}>{user?.displayName}</span>
                    </NavLink>
                  </Button>
                  <Typography>|</Typography>
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
              <Route path={ROUTES.VIEW_POST} user={user} component={ViewPost} />
              <Route path={ROUTES.LOGIN} component={Login} />
              <Route path={ROUTES.SIGN_UP} component={SignUp} />
              <ProtectedRouteUser user={user} path={ROUTES.PROFILE} exact>
                <Profile />
              </ProtectedRouteUser>
              <ProtectedRouteUser user={user} path={ROUTES.PROFILE_EDIT} exact>
                <ProfileEdit />
              </ProtectedRouteUser>
              <ProtectedRouteAdmin admin={admin} path={ROUTES.ADMIN_ALL_POSTS} exact>
                <AdminAllPosts />
              </ProtectedRouteAdmin>
              <ProtectedRouteAdmin admin={admin} path={ROUTES.ADMIN_CREATE_POST} exact>
                <AdminCreatePost />
              </ProtectedRouteAdmin>
              <ProtectedRouteAdmin admin={admin} path={ROUTES.ADMIN_EDIT_POST} component={AdminEditPost} />
              <Redirect to={ROUTES.HOME} />
            </Switch>
          </Suspense>
        </BrowserRouter>
      </UserContext.Provider>
    </div >
  );
}
