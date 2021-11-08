import { useEffect } from 'react';
import { motion } from "framer-motion";
import ShowForgotPassword from "../components/forgot-password/ShowForgotPassword";
import MetaTags from 'react-meta-tags';

export default function ForgotPassword() {
    useEffect(() => {
        document.title = `Elfelejtett jelszó | ${process.env.REACT_APP_FIREBASE_APP_NAME}`;
    }, []);

    return (
        <div className="p-3 content text-center m-auto" style={{ width: "1000px" }}>
            <MetaTags>
                <meta name="description" content="Elfelejtett jelszó esetén a felhasználó ezen az oldalon kérhet jelszó visszaállítás e-mailt." />
                <meta name="robots" content="noindex" />
                <meta property="og:url" content="%REACT_APP_FIREBASE_AUTH_DOMAIN%/forgot-password" />
                <meta property="og:title" content="Elfelejtett jelszó" />
                <meta property="og:description" content="Elfelejtett jelszó esetén a felhasználó ezen az oldalon kérhet jelszó visszaállítás e-mailt." />
                <meta property="og:type" content="website" />
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
                <ShowForgotPassword />
            </motion.div>
        </div>
    )
}