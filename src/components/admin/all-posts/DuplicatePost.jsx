import PropTypes from 'prop-types';
import { firebase } from "../../../lib/Firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

export default function DuplicatePost({ post }) {
    return (
        <button className="btn btn-primary m-1" style={{ width: "50px", height: "50px" }} onClick={() => {
            const data = {
                id: post?.id + "_masolat",
                title: post?.title + " (másolat)",
                slug: post?.slug + "-masolat",
                description: post?.description,
                content: post?.content,
                imgURL: post?.imgURL,
                tag: post?.tag,
                isActive: post?.isActive,
                date: new Date().toLocaleTimeString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                comments: [],
                saves: []
            };
            firebase.firestore().collection('posts').doc(data.id).set(data);
        }}>
            <FontAwesomeIcon icon={faCopy} />
        </button>
    )
}

DuplicatePost.propTypes = {
    post: PropTypes.object.isRequired
};