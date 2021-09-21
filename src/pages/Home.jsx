import { useState, useEffect } from "react";
import { getAllPosts } from "../services/Firebase";
import NoPostsAvailable from "../components/home/NoPostsAvailable";
import ShowHome from "../components/home/ShowHome";

export function Home() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        async function getPosts() {
            const posts = await getAllPosts();
            setPosts(posts);
        }

        getPosts();
    }, []);

    if (!posts) {
        return <NoPostsAvailable />
    } else {
        return <ShowHome posts={posts} />
    }
}