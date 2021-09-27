import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { getAllPosts } from "../services/Firebase";
import NoPostsAvailable from "../components/admin/all-posts/NoPostsAvailable";
import ShowAllPosts from "../components/admin/all-posts/ShowAllPosts";

export function AdminAllPosts() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        async function getPosts() {
            const posts = await getAllPosts();
            setPosts(posts);
        }

        getPosts();
    }, []);

    return (
        <div className="p-1 m-auto text-center content bg-ivory">
            <Helmet>
                <title>Összes bejegyzés</title>
                <meta name="description" content="Összes bejegyzés" />
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
                {!posts ? <NoPostsAvailable /> : <ShowAllPosts posts={posts} />}
            </motion.div>
        </div>
    )
}