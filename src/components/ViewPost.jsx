import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Spinner } from "./Spinner.jsx";

export function ViewPost(props) {
    const [post, setPost] = useState([]);
    const [isPending, setPending] = useState(false);
    const history = useHistory();

    useEffect(() => {
        setPending(true);
        axios.get(`http://localhost:4000/posts/${props.match.params.slug}`)
            .then(data => setPost(data.data))
            .catch(error => {
                console.error('Hiba!', error);
            });
        setPending(false);
    }, [props.match.params.slug])

    if (isPending) {
        return <Spinner />
    }

    return (
        <div className="card text-center m-auto" style={{ width: "1000px" }}>
            <h3>{post.title}</h3>
            <p>{post.description}</p>
            <p>{post.content}</p>
            <button className="m-auto btn btn-warning text-center" style={{ width: "100px", height: "40px" }} onClick={() => {
                history.push("/posts")
            }}>Vissza</button>
        </div>
    )

}