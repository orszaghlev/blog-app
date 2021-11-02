import { useEffect, useState, useContext } from 'react';
import FirebaseContext from '../contexts/Firebase';

export default function useActivePosts() {
    const [posts, setPosts] = useState([]);
    const { firebase } = useContext(FirebaseContext);

    useEffect(() => {
        firebase
            .firestore()
            .collection('posts')
            .where("isActive", "==", "true")
            .get()
            .then((snapshot) => {
                const activePosts = snapshot.docs.map((postsObj) => ({
                    ...postsObj.data(),
                    docId: postsObj.id,
                }));
                setPosts(activePosts);
            })
            .catch((error) => {
                console.log(error.message);
            });
    }, [firebase]);

    return { posts };
}