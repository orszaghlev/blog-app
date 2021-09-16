import { useContext } from "react";
import PropTypes from 'prop-types';
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Grid } from "@material-ui/core";
import useUser from '../hooks/UseUser';
import LoggedInUserContext from '../contexts/LoggedInUser';
import UserContext from '../contexts/User';

export function Profile() {
    const { user: loggedInUser } = useContext(UserContext);
    const { user } = useUser(loggedInUser?.uid);

    return (
        <LoggedInUserContext.Provider value={{ user }}>
            <div className="p-3 content text-center m-auto" style={{ width: "1000px" }}>
                <Helmet>
                    <title>Profil</title>
                    <meta name="description" content="Profil" />
                </Helmet>
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
                    <div>
                        <h2>Profil</h2>
                    </div>
                    <Grid container
                        direction="column"
                        justify="center"
                        alignItems="center">
                        <p>Felhasználónév: {user?.username}</p>
                        <p>Teljes név: {user?.fullName}</p>
                        <p>E-mail cím: {user?.emailAddress}</p>
                        <p>Profil létrehozásának dátuma: {user?.dateCreated}</p>
                        <p>Kedvenc bejegyzések: {user?.favoritePosts}</p>
                    </Grid>
                </motion.div>
            </div>
        </LoggedInUserContext.Provider>
    )
}

Profile.propTypes = {
    user: PropTypes.object.isRequired
};