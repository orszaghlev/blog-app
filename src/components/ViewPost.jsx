import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Spinner } from "./Spinner.jsx";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

export function ViewPost(props) {
    const [post, setPost] = useState([]);
    const [isPending, setPending] = useState(false);
    const history = useHistory();

    useEffect(() => {
        setPending(true);
        axios.get(`http://localhost:4000/posts/${props.match.params.id}`)
            .then(data => setPost(data.data))
            .catch(error => {
                console.error('Hiba!', error);
            });
        setPending(false);
    }, [props.match.params.id])

    if (isPending) {
        return <Spinner />
    }

    return (
        <div className="card text-center m-auto" style={{ width: "1000px" }}>
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
                <h2>{post.title}</h2>
                <h4>{post.description}</h4>
                <h5>{post.tag}</h5>
                <img src={post.imgURL} style={{width: "500px", height: "500px"}} alt="Bejegyzés képe"/>
                <p>{post.content}</p>
                <button className="m-auto btn btn-warning text-center" style={{ width: "100px", height: "40px" }}
                    onClick={() => {
                        history.push("/posts")
                    }}>Vissza</button>
            </motion.div>
        </div>
    )
}