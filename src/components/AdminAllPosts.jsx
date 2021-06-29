import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Spinner } from "./Spinner.jsx";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Button } from '@material-ui/core';

export function AdminAllPosts(props) {
    const [posts, setPosts] = useState([]);
    const [isPending, setPending] = useState(false);
    const history = useHistory();

    useEffect(() => {
        setPending(true);
        const config = {
            headers: { Authorization: `Bearer ${props.match.params.accessToken}` }
        };
        axios.get('http://localhost:8000/auth/posts', config)
            .then(data => setPosts(data.data))
            .catch(error => {
                console.error('Hiba!', error);
            });
        setPending(false);
    }, [props.match.params.accessToken])

    if (isPending) {
        return <Spinner />
    } else if (posts.length === 0) {
        return (
            <div class="jumbotron">
                <motion.div
                    animate={{ scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                >
                    <h3>Nincsenek elérhető bejegyzések!</h3>
                </motion.div>
            </div>
        )
    } else {
        return (
            <div className="p-1 m-auto text-center content bg-ivory">
                <Helmet>
                    <title>Admin - Bejegyzések</title>
                    <meta name="description" content="Admin - Bejegyzések" />
                </Helmet>
                <motion.div
                    animate={{ scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2>Admin - Bejegyzések</h2>
                    <Button variant="contained" onClick={() => {
                        history.push(`/admin/create-post/${props.match.params.accessToken}`)
                    }}>Új bejegyzés</Button>
                </motion.div>
                {
                    posts.map((post) => (
                        <div className="card">
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
                            </motion.div>
                        </div>
                    ))
                }
            </div >
        )
    }
}