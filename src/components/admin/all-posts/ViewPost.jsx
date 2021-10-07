import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

export default function ViewPost({ post }) {
    const [isActive, setIsActive] = useState(post?.isActive === "true" ? true : false);
    const history = useHistory();

    useEffect(() => {
        if (post?.isActive === "false") {
            setIsActive(false);
        }
    }, [post?.isActive]);

    return (
        <>
            {isActive &&
                <button className="btn btn-success m-1" style={{ width: "50px", height: "50px" }}
                    onClick={() => {
                        history.push(`/posts/${post?.slug}`)
                    }}>
                    <FontAwesomeIcon icon={faEye} />
                </button>
            }
            {!isActive &&
                <button className="btn btn-success m-1 disabled" style={{ width: "50px", height: "50px" }}>
                    <FontAwesomeIcon icon={faEye} />
                </button>
            }
        </>
    )
}

ViewPost.propTypes = {
    post: PropTypes.object.isRequired
};