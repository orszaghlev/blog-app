import { useEffect } from "react";
import { motion } from "framer-motion";
import Spinner from '../components/Spinner';
import ShowHome from "../components/home/ShowHome";
import useActivePosts from "../hooks/UseActivePosts";
import MetaTags from 'react-meta-tags';

export default function Home() {
    const { posts } = useActivePosts();

    useEffect(() => {
        document.title = `Bejegyzések | ${process.env.REACT_APP_BLOG_NAME}`;
    }, []);

    return (
        <div className="p-3 content text-center m-auto" style={{ maxWidth: "1224px" }}>
            <MetaTags>
                <meta name="description" content="A blog kezdőlapja. A vendégek innen érhetik el az aktív bejegyzéseket." />
                <meta property="og:url" content="%REACT_APP_FIREBASE_AUTH_DOMAIN%/home" />
                <meta property="og:title" content="Bejegyzések" />
                <meta property="og:description" content="A blog kezdőlapja. A vendégek innen érhetik el az aktív bejegyzéseket." />
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
                {(!posts || posts.length === 0) ? <Spinner /> : <ShowHome activePosts={posts} />}
            </motion.div>
        </div>
    )
}