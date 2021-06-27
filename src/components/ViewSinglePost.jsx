import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Spinner } from "./Spinner.jsx";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

export function ViewSinglePost(props) {
    const [post, setPost] = useState([]);
    const [isPending, setPending] = useState(false);
    const history = useHistory();

    useEffect(() => {
        setPending(true);
        const config = {
            headers: { Authorization: `Bearer ${props.match.params.access_token}` }
        };
        axios.get(`http://localhost:8000/api/posts/${props.match.params.id}`, config)
            .then(data => setPost(data.data))
            .catch(error => {
                console.error('Hiba!', error);
            });
        setPending(false);
    }, [props.match.params.id, props.match.params.access_token])

    if (isPending) {
        return <Spinner />
    } else {
        return (
            <div className="card m-auto" style={{ width: "1000px" }}>
                <Helmet>
                    <title>{post.title}</title>
                    <meta name="description" content={post.description} />
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
                    <h2 className="text-center">{post.title}</h2>
                    <h4 className="text-center">{post.description}</h4>
                    <h5 className="text-center">{post.tag}</h5>
                    <img className="text-center" src={post.imgURL} style={{ width: "300px", height: "300px" }} alt="Bejegyzés képe" />
                    <p>{post.content}</p>
                    <button className="m-auto btn btn-warning text-center" style={{ width: "300px", height: "40px" }}
                        onClick={() => {
                            history.push("/posts")
                        }}>Vissza</button>
                </motion.div>
            </div>
        )
    }
}