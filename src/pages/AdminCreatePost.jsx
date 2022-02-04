import { useEffect } from "react";
import { motion } from "framer-motion";
import ShowCreatePost from "../components/admin/create-post/ShowCreatePost";
import MetaTags from 'react-meta-tags';

export default function AdminCreatePost() {
    useEffect(() => {
        document.title = `Új bejegyzés | ${process.env.REACT_APP_BLOG_NAME}`;
    }, []);

    return (
        <div className="p-3 content text-center m-auto" style={{ maxWidth: "1224px" }}>
            <MetaTags>
                <meta name="description" content="Bejegyzés létrehozása. Kizárólag adminisztrátorok számára elérhető." />
                <meta name="robots" content="noindex" />
                <meta property="og:url" content="%REACT_APP_FIREBASE_AUTH_DOMAIN%/admin/create-post" />
                <meta property="og:title" content="Új bejegyzés" />
                <meta property="og:description" content="Bejegyzés létrehozása. Kizárólag adminisztrátorok számára elérhető." />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="%REACT_APP_BLOG_NAME%" />
                <meta property="og:locale" content="hu_HU" />
                <meta property="og:locale:alternate" content="en_US" />
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
                <ShowCreatePost />
            </motion.div>
        </div>
    )
}