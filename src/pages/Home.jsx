import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { getAllPosts } from "../services/Firebase";
import NoPostsAvailable from "../components/home/NoPostsAvailable";
import ShowHome from "../components/home/ShowHome";

export function Home() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        async function getPosts() {
            const posts = await getAllPosts();
            setPosts(posts);
        }

        getPosts();
    }, [posts]);

    return (
        <div className="p-1 m-auto text-center content bg-ivory">
            <Helmet>
                <title>Bejegyzések</title>
                <meta name="description" content="Bejegyzések" />
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
                {!posts ? <NoPostsAvailable /> : <ShowHome posts={posts} />}
            </motion.div>
        </div>
    )
}