import { useEffect } from 'react';
import { motion } from "framer-motion";
import MetaTags from 'react-meta-tags';
import ShowNotFound from "../components/not-found/ShowNotFound";

export default function NotFound() {
    useEffect(() => {
        document.title = `404 | ${process.env.REACT_APP_FIREBASE_APP_NAME}`;
    }, []);

    return (
        <div className="p-3 content text-center m-auto" style={{ maxWidth: "1224px" }}>
            <MetaTags>
                <meta name="description" content="A keresett oldal nem található. Ha a vendég olyan aloldalra tévedne, ami számára nem elérhető vagy nem is létezik, akkor ez az üzenet fogadja." />
                <meta property="og:url" content="%REACT_APP_FIREBASE_AUTH_DOMAIN%/not-found" />
                <meta property="og:title" content="404" />
                <meta property="og:description" content="A keresett oldal nem található. Ha a vendég olyan aloldalra tévedne, ami számára nem elérhető vagy nem is létezik, akkor ez az üzenet fogadja." />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="%REACT_APP_FIREBASE_APP_NAME%" />
                <meta property="og:locale" content="hu_HU" />
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
                <ShowNotFound />
            </motion.div>
        </div>
    );
}