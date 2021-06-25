import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Spinner } from "./Spinner.jsx";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

export function ViewAllPosts() {
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState("");
    const [isPending, setPending] = useState(false);
    const history = useHistory();

    function getPosts() {
        axios.get('http://localhost:4000/posts')
            .then(data => setPosts(data.data))
            .catch(error => {
                console.error('Hiba!', error);
            });
    }

    useEffect(() => {
        setPending(true);
        getPosts();
        setPending(false);
    }, [])

    if (isPending) {
        return <Spinner />
    } else if (posts.length === 0) {
        return (
            <div class="jumbotron">
                <h3>Nincsenek elérhető posztok!</h3>
            </div>
        )
    } else {
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
                        onClick={() => {
                            setPosts(posts.filter(li => li.tag.toLowerCase().includes("hun")))
                        }}
                    >
                        Szűrés
                    </button>
                </div>
                {
                    posts.filter(li =>
                        li.title.toLowerCase().includes(search.toLowerCase()) ||
                        li.slug.toLowerCase().includes(search.toLowerCase()) ||
                        li.description.toLowerCase().includes(search.toLowerCase()) ||
                        li.content.toLowerCase().includes(search.toLowerCase()))
                        .map((post) => (
                            <div className="card col-sm-3 d-inline-block m-1 p-2 h-100" onClick={() => {
                                history.push(`/posts/${post.id}`)
                            }}>
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
                                    <img src={post.imgURL} alt="Bejegyzés indexképe"
                                        style={{ width: "100px", height: "100px" }} />
                                    <p>{post.description}</p>
                                </motion.div>
                            </div>
                        ))
                }
            </div >
        )
    }
}