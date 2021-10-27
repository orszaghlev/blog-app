import { useEffect, useState, useContext } from 'react';
import FirebaseContext from '../contexts/Firebase';

export default function useAllPosts() {
    const [posts, setPosts] = useState([]);
    const { firebase } = useContext(FirebaseContext);

    useEffect(() => {
        firebase
            .firestore()
            .collection('posts')
            .orderBy("date", "desc")
            .get()
            .then((snapshot) => {
                const allPosts = snapshot.docs.map((postsObj) => ({
                    ...postsObj.data(),
                    docId: postsObj.id,
                }));
                setPosts(allPosts);
            })
            .catch((error) => {
                console.log(error.message);
            });
    }, [firebase]);

    return { posts };
}