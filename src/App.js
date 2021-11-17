import { useState, Suspense, useEffect } from "react";
import { BrowserRouter, NavLink, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import ViewPost from "./pages/ViewPost";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/ProfileEdit";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCreatePost from "./pages/AdminCreatePost";
import NotFound from "./pages/NotFound";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { firebase } from "./lib/Firebase";
import * as ROUTES from "./constants/Routes";
import ProtectedRouteUser from './helpers/ProtectedRouteUser';
import ProtectedRouteAdmin from './helpers/ProtectedRouteAdmin';
import UserContext from './contexts/User';
import useAuthListener from './hooks/UseAuthListener';
import DarkModeToggle from './darkModeToggle';
import MetaTags from 'react-meta-tags';
import { useMediaQuery } from 'react-responsive';
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
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

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
                                <Typography variant="h6" className={classes.title} align="left">
                                    <NavLink to={ROUTES.HOME}>
                                        <span className="nav-link" style={{ color: 'white' }}>{process.env.REACT_APP_FIREBASE_APP_NAME}</span>
                                    </NavLink>
                                </Typography>
                                {!isTabletOrMobile && <>
                                    {!user && <>
                                        <Button color="inherit">
                                            <NavLink to={ROUTES.LOGIN}>
                                                <span className="nav-link" style={{ color: 'white' }}>Bejelentkezés</span>
                                            </NavLink>
                                        </Button>
                                    </>}
                                    {admin !== null && <>
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
                                </>}
                                {isTabletOrMobile && !user && <>
                                    <Button color="inherit">
                                        <NavLink to={ROUTES.LOGIN}>
                                            <FontAwesomeIcon icon={faSignInAlt} style={{ color: 'white' }} />
                                        </NavLink>
                                    </Button>
                                </>}
                                {isTabletOrMobile && user && <>
                                    <Button color="inherit"
                                        id="positioned-button"
                                        aria-controls="positioned-menu"
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}
                                        onClick={handleClick}
                                    >
                                        <FontAwesomeIcon icon={faBars} />
                                    </Button>
                                    <Menu
                                        id="positioned-menu"
                                        aria-labelledby="positioned-button"
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left',
                                        }}
                                    >
                                        {admin !== null &&
                                            <MenuItem onClick={handleClose}>
                                                <NavLink to={ROUTES.ADMIN_DASHBOARD}>
                                                    <span className="nav-link">Admin felület</span>
                                                </NavLink>
                                            </MenuItem>
                                        }
                                        <MenuItem onClick={handleClose}>
                                            <NavLink to={ROUTES.PROFILE}>
                                                <span className="nav-link">Profil</span>
                                            </NavLink>
                                        </MenuItem>
                                        <MenuItem onClick={() => {
                                            handleClose();
                                            firebase.auth().signOut();
                                        }}>
                                            <NavLink to={ROUTES.HOME}>
                                                <span className="nav-link">Kijelentkezés</span>
                                            </NavLink>
                                        </MenuItem>
                                    </Menu>
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
                            <Route component={NotFound} />
                        </Switch>
                    </Suspense>
                </BrowserRouter>
            </UserContext.Provider>
        </div >
    );
}
