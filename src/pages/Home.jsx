import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Spinner } from "./Spinner.jsx";

export function Home() {
    const [posts, setPosts] = useState([]);
    const [isPending, setPending] = useState(false);
    const history = useHistory();
    const [search, setSearch] = useState("");

    useEffect(() => {
        setPending(true);
        axios.get(`http://localhost:4000/posts`)
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
            <div class="container">
                <input
                    type='text'
                    className='input'
                    onChange={e => setSearch(e.target.value)}
                    placeholder='Keresés...'
                />
            </div>
            {posts.filter(li => li.description.toLowerCase().includes(search.toLowerCase()))
                .map((post) => (
                    <div className="card col-sm-3 d-inline-block m-1 p-2 h-100">
                        <h5 className="text-dark">{post.title}</h5>
                        <p>{post.description}</p>
                        <button className="btn btn-primary m-1" onClick={() => {
                            history.push(`/posts/${post.slug}`)
                        }}>
                            <FontAwesomeIcon icon={faEye} />
                        </button>
                    </div>
                ))}
        </div>
    )
}