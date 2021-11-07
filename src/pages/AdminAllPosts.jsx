import { useEffect } from "react";
import { motion } from "framer-motion";
import Spinner from '../components/Spinner';
import ShowAllPosts from "../components/admin/all-posts/ShowAllPosts";
import useAllPosts from "../hooks/UseAllPosts";

export default function AdminAllPosts() {
    const { posts } = useAllPosts();

    useEffect(() => {
        document.title = `Összes bejegyzés | ${process.env.REACT_APP_FIREBASE_APP_NAME}`;
    }, []);

    return (
        <div className="p-1 m-auto text-center content bg-ivory">
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
                {(!posts || posts.length === 0) ? <Spinner /> : <ShowAllPosts allPosts={posts} />}
            </motion.div>
        </div>
    )
}