import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { firebase } from '../lib/Firebase';
import Spinner from '../components/Spinner';
import ShowHome from "../components/home/ShowHome";

export default function Home() {
    const [allPosts, setAllPosts] = useState([]);
    const [lastPost, setLastPost] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const postsRef = firebase
        .firestore()
        .collection('posts')
        .orderBy('isActive', 'asc');
    const updateState = (collections) => {
        const isCollectionEmpty = collections.size === 0;
        if (!isCollectionEmpty) {
            const posts = collections.docs.map((post) => post.data());
            const lastPost = collections.docs[collections.docs.length - 1];
            setAllPosts(allPosts => [...allPosts, ...posts]);
            setLastPost(lastPost);
        } else {
            setIsEmpty(true);
        }
        setIsLoading(false);
    };
    const fetchMoreData = () => {
        setIsLoading(true);
        postsRef
            .startAfter(lastPost)
            .limit(6)
            .get()
            .then((collections) => {
                updateState(collections);
            });
    };

    useEffect(() => {
        document.title = 'Bejegyzések';
        postsRef
            .startAt('true')
            .limit(6)
            .get()
            .then((collections) => {
                updateState(collections);
            });
        // eslint-disable-next-line
    }, []);

    return (
        <div className="p-1 m-auto text-center content bg-ivory">
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
                {allPosts.length === 0 ? <Spinner /> : <ShowHome allPosts={allPosts} isLoading={isLoading} isEmpty={isEmpty} fetchMoreData={fetchMoreData} />}
            </motion.div>
        </div>
    )
}