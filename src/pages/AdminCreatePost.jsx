import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import ShowCreatePost from "../components/admin/create-post/ShowCreatePost";

export function AdminCreatePost() {
    return (
        <div className="p-3 content text-center m-auto" style={{ width: "1000px" }}>
            <Helmet>
                <title>Új bejegyzés</title>
                <meta name="description" content="Új bejegyzés" />
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
                <ShowCreatePost />
            </motion.div>
        </div>
    )
}