import { useContext } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import useUser from '../hooks/UseUser';
import UserContext from '../contexts/User';
import LoggedInUserContext from '../contexts/LoggedInUser';
import ShowProfileEdit from "../components/profile/edit/ShowProfileEdit";

export function ProfileEdit() {
    const { user: loggedInUser } = useContext(UserContext);
    const { user } = useUser(loggedInUser?.uid);

    return (
        <LoggedInUserContext.Provider value={{ user }}>
            <div className="p-3 content text-center m-auto" style={{ width: "1000px" }}>
                <Helmet>
                    <title>Felhasználói adatok szerkesztése</title>
                    <meta name="description" content="Felhasználói adatok szerkesztése" />
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
                    <ShowProfileEdit user={user} />
                </motion.div>
            </div>
        </LoggedInUserContext.Provider>
    )
}