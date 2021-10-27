import { useEffect } from "react";
import { motion } from "framer-motion";
import Spinner from '../components/Spinner';
import ShowHome from "../components/home/ShowHome";
import useActivePosts from "../hooks/UseActivePosts";

export default function Home() {
    const { posts } = useActivePosts();

    useEffect(() => {
        document.title = 'Bejegyzések';
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
                {(!posts || posts.length === 0) ? <Spinner /> : <ShowHome activePosts={posts} />}
            </motion.div>
        </div>
    )
}