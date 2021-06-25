import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Spinner } from "./Spinner.jsx";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

export function Home() {
    const [isPending, setPending] = useState(false);
    const history = useHistory();
    const [accessToken, setAccessToken] = useState("");

    if (isPending) {
        return <Spinner />
    } else if (!accessToken) {
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
                    <h2>Bejelentkezés</h2>
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
                            history.push("/posts");
                        }}
                    >
                        <div className="form-group row pb-3 p-3">
                            <label>Email</label>
                            <input type="text" className="form-control" name="email" placeholder="Email" />
                        </div>
                        <div className="form-group row pb-3 p-3">
                            <label>Jelszó</label>
                            <input type="password" className="form-control" name="password" placeholder="Jelszó" />
                        </div>
                        <div className="m-auto form-group row">
                            <button type="submit" className="btn btn-primary" style={{ width: "100px", height: "40px" }}>Küldés</button>
                        </div>
                    </form>
                </motion.div>
            </div>
        )
    }
}