import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import ShowLogin from "../components/login/ShowLogin";

export function Login() {
    return (
        <div className="p-3 content text-center m-auto" style={{ width: "1000px" }}>
            <Helmet>
                <title>Bejelentkezés</title>
                <meta name="description" content="Bejelentkezés" />
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
                <ShowLogin />
            </motion.div>
        </div>
    )
}