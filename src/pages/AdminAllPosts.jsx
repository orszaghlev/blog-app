import { useState, useEffect } from "react";
import { getAllPosts } from "../services/Firebase";
import NoPostsAvailable from "../components/admin/all-posts/NoPostsAvailable";
import ShowAllPosts from "../components/admin/all-posts/ShowAllPosts";

export function AdminAllPosts() {
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
        return <ShowAllPosts posts={posts} />
    }
}