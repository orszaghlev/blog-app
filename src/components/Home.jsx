import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Spinner } from "./Spinner.jsx";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

export function Home() {
    const [posts, setPosts] = useState([]);
    const [postDeleteSlug, setDeleteSlug] = useState("");
    const [isPending, setPending] = useState(false);
    const history = useHistory();
    const [search, setSearch] = useState("");

    useEffect(() => {
        setPending(true);
        axios.get('http://localhost:4000/posts')
            .then(data => setPosts(data.data))
            .catch(error => {
                console.error('Hiba!', error);
            });
        setPending(false);
    }, [])

    if (isPending) {
        return <Spinner />
    }

    return (
        <div className="p-1 m-auto text-center content bg-ivory">
            <Helmet>
                <title>Bejegyzések</title>
                <meta name="description" content="Bejegyzések" />
            </Helmet>
            <div class="container">
                <input
                    type='text'
                    className='input'
                    onChange={e => setSearch(e.target.value)}
                    placeholder='Keresés...'
                />
                <button type="button" className="btn btn-primary m-1 p-1"
                >
                    Szűrés
                </button>
            </div>
            {
                posts.filter(li => li.description.toLowerCase().includes(search.toLowerCase()))
                    .map((post) => (
                        <div className="card col-sm-3 d-inline-block m-1 p-2 h-100">
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
                                <h5 className="text-dark">{post.title}</h5>
                                <p>{post.description}</p>
                                <button className="btn btn-warning m-1" onClick={() => {
                                    history.push(`/edit-post/${post.slug}`)
                                }}>
                                    <FontAwesomeIcon icon={faPencilAlt} />
                                </button>
                                <button className="btn btn-primary m-1" onClick={() => {
                                    history.push(`/posts/${post.slug}`)
                                }}>
                                    <FontAwesomeIcon icon={faEye} />
                                </button>
                            </motion.div>
                        </div>
                    ))
            }
        </div >
    )
}