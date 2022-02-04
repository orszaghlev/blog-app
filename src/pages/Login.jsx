import { useEffect } from 'react';
import { motion } from "framer-motion";
import ShowLogin from "../components/login/ShowLogin";
import MetaTags from 'react-meta-tags';

export default function Login() {
    useEffect(() => {
        document.title = `Bejelentkezés | ${process.env.REACT_APP_BLOG_NAME}`;
    }, []);

    return (
        <div className="p-3 content text-center m-auto" style={{ maxWidth: "1224px" }}>
            <MetaTags>
                <meta name="description" content="Bejelentkezési felület. E-mail és jelszó megadásával tud a felhasználó bejelentkezni az oldalra." />
                <meta name="robots" content="noindex" />
                <meta property="og:url" content="%REACT_APP_FIREBASE_AUTH_DOMAIN%/login" />
                <meta property="og:title" content="Bejelentkezés" />
                <meta property="og:description" content="Bejelentkezési felület. E-mail és jelszó megadásával tud a felhasználó bejelentkezni az oldalra." />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="%REACT_APP_BLOG_NAME%" />
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
                <ShowLogin />
            </motion.div>
        </div>
    )
}