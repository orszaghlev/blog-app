import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import ShowSignUp from "../components/sign-up/ShowSignUp"

export function SignUp() {
    return (
        <div className="p-3 content text-center m-auto" style={{ width: "1000px" }}>
            <Helmet>
                <title>Regisztráció</title>
                <meta name="description" content="Regisztráció" />
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
                <ShowSignUp />
            </motion.div>
        </div>
    )
}