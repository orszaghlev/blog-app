import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Spinner } from "./Spinner.jsx";

export function Home() {
    const [posts, setPosts] = useState([]);
    const [isPending, setPending] = useState(false);
    const history = useHistory();
    const [search, setSearch] = useState("");

    useEffect(() => {
        setPending(true);
        axios.get(``)
            .then(data => setPosts(data.data))
            .catch(error => {
                console.error('There was an error!', error);
            });
        setPending(false);
    }, [])

    if (isPending) {
        return <Spinner />
    }

    return (
        <div className="p-1 m-auto text-center content bg-ivory">
            
            <input
                type='text'
                className='input'
                onChange={e => setSearch(e.target.value)}
                placeholder='Keresés...'
            />
        </div>
    )
}