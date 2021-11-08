import { useEffect } from 'react';
import { motion } from "framer-motion";
import ShowSignUp from "../components/sign-up/ShowSignUp";
import MetaTags from 'react-meta-tags';

export default function SignUp() {
    useEffect(() => {
        document.title = `Regisztráció | ${process.env.REACT_APP_FIREBASE_APP_NAME}`;
    }, []);

    return (
        <div className="p-3 content text-center m-auto" style={{ width: "1000px" }}>
            <MetaTags>
                <meta name="description" content="Regisztrációs felület. A vendégek az adataik megadásával készíthetnek felhasználói profilt ezen az oldalon." />
                <meta name="robots" content="noindex" />
                <meta property="og:url" content="%REACT_APP_FIREBASE_AUTH_DOMAIN%/sign-up" />
                <meta property="og:title" content="Regisztráció" />
                <meta property="og:description" content="Regisztrációs felület. A vendégek az adataik megadásával készíthetnek felhasználói profilt ezen az oldalon." />
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
                <ShowSignUp />
            </motion.div>
        </div>
    )
}