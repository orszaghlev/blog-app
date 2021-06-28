import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Spinner } from "./Spinner.jsx";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Button } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { Grid } from "@material-ui/core";

export function Home() {
    const [isPending, setPending] = useState(false);
    const [accessToken, setAccessToken] = useState("");
    const history = useHistory();

    if (isPending) {
        return <Spinner />
    } else {
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
                    <motion.div
                        animate={{ scale: 1.2 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2>Bejelentkezés</h2>
                    </motion.div>
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            setPending(true);
                            const data = {
                                email: e.target.elements.email.value,
                                password: e.target.elements.password.value
                            }
                            axios.post('http://localhost:8000/auth/login', data)
                                .then(data => setAccessToken(data.data.access_token))
                                .catch(error => {
                                    console.error('Hiba!', error);
                                });
                            setPending(false);
                            if (accessToken) {
                                history.push(`/posts/${accessToken}`);
                            }
                        }}
                    >
                        <Grid container spacing={2}
                            direction="column"
                            justify="space-around"
                            alignItems="stretch">
                            <Grid item xs>
                                <TextField name="email" label="Email" variant="filled" type="email" required />
                            </Grid>
                            <Grid item xs>
                                <TextField name="password" label="Jelszó" variant="filled" type="password" required />
                            </Grid>
                            <Grid item xs>
                                <Button type="submit" variant="contained" color="primary">
                                    Küldés
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </motion.div>
            </div >
        )
    }
}