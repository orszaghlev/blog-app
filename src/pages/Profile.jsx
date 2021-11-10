import { useEffect, useContext } from "react";
import { motion } from "framer-motion";
import useUser from '../hooks/UseUser';
import UserContext from '../contexts/User';
import LoggedInUserContext from '../contexts/LoggedInUser';
import ShowProfile from "../components/profile/ShowProfile";
import ShowFavoritePosts from "../components/profile/ShowFavoritePosts";
import ShowOwnComments from "../components/profile/ShowOwnComments";
import MetaTags from 'react-meta-tags';

export default function Profile() {
    const { user: loggedInUser } = useContext(UserContext);
    const { user } = useUser(loggedInUser?.uid);

    useEffect(() => {
        document.title = `Profil | ${process.env.REACT_APP_FIREBASE_APP_NAME}`;
    }, []);

    return (
        <LoggedInUserContext.Provider value={{ user }}>
            <div className="p-3 content text-center m-auto" style={{ width: "500px" }}>
                <MetaTags>
                    <meta name="description" content="A felhasználó profilja. Tartalmazza a regisztráláskor megadott információkat, illetve a felhasználó kedvenc bejegyzéseit és saját hozzászólásait." />
                    <meta name="robots" content="noindex" />
                    <meta property="og:url" content="%REACT_APP_FIREBASE_AUTH_DOMAIN%/profile" />
                    <meta property="og:title" content="Profil" />
                    <meta property="og:description" content="A felhasználó profilja. Tartalmazza a regisztráláskor megadott információkat, illetve a felhasználó kedvenc bejegyzéseit és saját hozzászólásait." />
                    <meta property="og:type" content="profile" />
                    <meta property="og:site_name" content="%REACT_APP_FIREBASE_APP_NAME%" />
                    <meta property="og:locale" content="hu_HU" />
                </MetaTags>
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
                    <ShowProfile user={user} />
                    <hr />
                    <ShowFavoritePosts user={user} />
                    <hr />
                    <ShowOwnComments user={user} />
                </motion.div>
            </div>
        </LoggedInUserContext.Provider>
    )
}