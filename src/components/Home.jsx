import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPencilAlt, faTimes, faCopy } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Spinner } from "./Spinner.jsx";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

export function Home() {
    const [posts, setPosts] = useState([]);
    const [isPending, setPending] = useState(false);
    const history = useHistory();
    const [search, setSearch] = useState("");

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
                                    history.push(`/edit-post/${post.id}`)
                                }}>
                                    <FontAwesomeIcon icon={faPencilAlt} />
                                </button>
                                <button className="btn btn-danger m-1" onClick={() => {
                                    setPending(true);
                                    axios.delete(`http://localhost:4000/posts/${post.id}`)
                                        .catch(error => {
                                            console.error('Hiba!', error);
                                        });
                                    getPosts();
                                    setPending(false);
                                }}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                                <button className="btn btn-primary m-1" onClick={() => {
                                    history.push(`/posts/${post.id}`)
                                }}>
                                    <FontAwesomeIcon icon={faEye} />
                                </button>
                                <button className="btn btn-dark m-1" onClick={async (e) => {
                                    e.preventDefault();
                                    setPending(true);
                                    const data = {
                                        id: post.id,
                                        title: post.title,
                                        slug: post.slug,
                                        description: post.description,
                                        content: post.content,
                                        tag: post.tag
                                    };
                                    axios.post('http://localhost:4000/posts', data)
                                        .catch(error => {
                                            console.error('Hiba!', error);
                                        });
                                    getPosts();
                                    setPending(false);
                                }}>
                                    <FontAwesomeIcon icon={faCopy} />
                                </button>
                            </motion.div>
                        </div>
                    ))
            }
        </div >
    )
}