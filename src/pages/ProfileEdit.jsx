import { useEffect, useContext } from "react";
import { motion } from "framer-motion";
import useUser from '../hooks/UseUser';
import UserContext from '../contexts/User';
import LoggedInUserContext from '../contexts/LoggedInUser';
import ShowProfileEdit from "../components/profile/edit/ShowProfileEdit";
import MetaTags from 'react-meta-tags';

export default function ProfileEdit() {
    const { user: loggedInUser } = useContext(UserContext);
    const { user } = useUser(loggedInUser?.uid);

    useEffect(() => {
        document.title = `Profil szerkesztése | ${process.env.REACT_APP_FIREBASE_APP_NAME}`;
    }, []);

    return (
        <LoggedInUserContext.Provider value={{ user }}>
            <div className="p-3 content text-center m-auto" style={{ width: "1000px" }}>
                <MetaTags>
                    <meta name="description" content="A felhasználó ezen az oldalon szerkesztheti profiljának bizonyos adatait." />
                    <meta name="robots" content="noindex" />
                    <meta property="og:url" content="%REACT_APP_FIREBASE_AUTH_DOMAIN%/profile/edit" />
                    <meta property="og:title" content="Profil szerkesztése" />
                    <meta property="og:description" content="A felhasználó ezen az oldalon szerkesztheti profiljának bizonyos adatait." />
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
                    <ShowProfileEdit user={user} />
                </motion.div>
            </div>
        </LoggedInUserContext.Provider>
    )
}