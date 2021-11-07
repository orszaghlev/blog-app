import { useEffect } from 'react';
import { motion } from "framer-motion";
import ShowForgotPassword from "../components/forgot-password/ShowForgotPassword";

export default function ForgotPassword() {
    useEffect(() => {
        document.title = `Elfelejtett jelszó | ${process.env.REACT_APP_FIREBASE_APP_NAME}`;
    }, []);

    return (
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
                <ShowForgotPassword />
            </motion.div>
        </div>
    )
}