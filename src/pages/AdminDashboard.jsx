import { useEffect } from "react";
import { motion } from "framer-motion";
import Spinner from '../components/Spinner';
import ShowAllPosts from "../components/admin/dashboard/ShowAllPosts";
import useAllPosts from "../hooks/UseAllPosts";
import MetaTags from 'react-meta-tags';
import { useMediaQuery } from 'react-responsive';

export default function AdminDashboard() {
    const { posts } = useAllPosts();
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });

    useEffect(() => {
        document.title = `Admin felület | ${process.env.REACT_APP_BLOG_NAME}`;
    }, []);

    return (
        <div className="p-3 content text-center m-auto" style={{ maxWidth: "1224px" }}>
            <MetaTags>
                <meta name="description" content="Kezelőfelület adminisztrátorok számára. Bejegyzések megtekintése, duplikálása, törlése és szerkesztése." />
                <meta name="robots" content="noindex" />
                <meta property="og:url" content="%REACT_APP_FIREBASE_AUTH_DOMAIN%/admin/dashboard" />
                <meta property="og:title" content="Admin felület" />
                <meta property="og:description" content="Kezelőfelület adminisztrátorok számára. Bejegyzések megtekintése, duplikálása, törlése és szerkesztése." />
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
                {(!posts || posts.length === 0) ? <Spinner /> : <ShowAllPosts allPosts={posts} isTabletOrMobile={isTabletOrMobile} />}
            </motion.div>
        </div>
    )
}