import { motion } from "framer-motion";

export default function NoPostsAvailable() {
    return (
        <div class="jumbotron">
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
                <h3 className="text-center">Jelenleg nincsenek elérhető bejegyzések!</h3>
            </motion.div>
        </div>
    )
}