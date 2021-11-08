import { useState, Suspense, useEffect } from "react";
import { BrowserRouter, NavLink, Route, Redirect, Switch } from "react-router-dom";
import Home from "./pages/Home";
import ViewPost from "./pages/ViewPost";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/ProfileEdit";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCreatePost from "./pages/AdminCreatePost";
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
import DarkModeToggle from './darkModeToggle';
import MetaTags from 'react-meta-tags';
import './styles.scss';

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
        document.title = `${process.env.REACT_APP_FIREBASE_APP_NAME}`;
        if (user?.uid === process.env.REACT_APP_FIREBASE_ADMIN_UID) {
            setAdmin(user);
        } else {
            setAdmin(null);
        }
    }, [user]);

    return (
        <div className="App">
            <MetaTags>
                <meta name="description" content="%REACT_APP_FIREBASE_APP_DESCRIPTION" />
                <meta property="og:url" content="%REACT_APP_FIREBASE_AUTH_DOMAIN%" />
                <meta property="og:title" content="%REACT_APP_FIREBASE_APP_NAME%" />
                <meta property="og:description" content="%REACT_APP_FIREBASE_APP_DESCRIPTION" />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="%REACT_APP_FIREBASE_APP_NAME%" />
                <meta property="og:locale" content="hu_HU" />
                <meta property="og:locale:alternate" content="en_US" />
            </MetaTags>
            <UserContext.Provider value={{ user }}>
                <BrowserRouter>
                    <Suspense fallback={<p>Betöltés...</p>}>
                        <AppBar position="static">
                            <Toolbar>
                                <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                                </IconButton>
                                <Typography variant="h6" className={classes.title} align="left">
                                    <NavLink to={ROUTES.HOME}>
                                        <span className="nav-link" style={{ color: 'white' }}>{process.env.REACT_APP_FIREBASE_APP_NAME}</span>
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
                                        <NavLink to={ROUTES.ADMIN_DASHBOARD}>
                                            <span className="nav-link" style={{ color: 'white' }}>Admin felület</span>
                                        </NavLink>
                                    </Button>
                                    <Typography>|</Typography>
                                </>}
                                {user && <>
                                    <Button color="inherit">
                                        <NavLink to={ROUTES.PROFILE}>
                                            <span className="nav-link" style={{ color: 'white' }}>Profil</span>
                                        </NavLink>
                                    </Button>
                                    <Typography>|</Typography>
                                    <Button color="inherit" onClick={() => firebase.auth().signOut()}>
                                        <NavLink to={ROUTES.HOME}>
                                            <span className="nav-link" style={{ color: 'white' }}>Kijelentkezés</span>
                                        </NavLink>
                                    </Button>
                                </>}
                                <Typography component={'div'}>
                                    <DarkModeToggle />
                                </Typography>
                            </Toolbar>
                        </AppBar>
                        <Switch>
                            <Route path={ROUTES.HOME} exact component={Home} />
                            <Route path={ROUTES.VIEW_POST} user={user} component={ViewPost} />
                            <Route path={ROUTES.LOGIN} component={Login} />
                            <Route path={ROUTES.SIGN_UP} component={SignUp} />
                            <Route path={ROUTES.FORGOT_PASSWORD} component={ForgotPassword} />
                            <ProtectedRouteUser user={user} path={ROUTES.PROFILE} exact>
                                <Profile />
                            </ProtectedRouteUser>
                            <ProtectedRouteUser user={user} path={ROUTES.PROFILE_EDIT} exact>
                                <ProfileEdit />
                            </ProtectedRouteUser>
                            <ProtectedRouteAdmin admin={admin} user={user} path={ROUTES.ADMIN_DASHBOARD} exact>
                                <AdminDashboard />
                            </ProtectedRouteAdmin>
                            <ProtectedRouteAdmin admin={admin} user={user} path={ROUTES.ADMIN_CREATE_POST} exact>
                                <AdminCreatePost />
                            </ProtectedRouteAdmin>
                            <Redirect to={ROUTES.HOME} />
                        </Switch>
                    </Suspense>
                </BrowserRouter>
            </UserContext.Provider>
        </div >
    );
}
