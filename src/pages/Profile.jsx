import { useEffect, useContext } from "react";
import { motion } from "framer-motion";
import useUser from '../hooks/UseUser';
import UserContext from '../contexts/User';
import LoggedInUserContext from '../contexts/LoggedInUser';
import ShowProfile from "../components/profile/ShowProfile";
import ShowFavoritePosts from "../components/profile/ShowFavoritePosts";
import ShowOwnComments from "../components/profile/ShowOwnComments";

export default function Profile() {
    const { user: loggedInUser } = useContext(UserContext);
    const { user } = useUser(loggedInUser?.uid);

    useEffect(() => {
        document.title = "Profil";
    }, []);

    return (
        <LoggedInUserContext.Provider value={{ user }}>
            <div className="p-3 content text-center m-auto" style={{ width: "1000px" }}>
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