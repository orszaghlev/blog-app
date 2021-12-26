import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

export default function ViewPost({ post }) {
    const [isActive, setIsActive] = useState((post?.isActive !== "true" || (new Date(post?.date).getTime() >= new Date().getTime())) ? false : true);
    const history = useHistory();

    useEffect(() => {
        if ((post?.isActive !== "true" || (new Date(post?.date).getTime() >= new Date().getTime()))) {
            setIsActive(false);
        }
    }, [post?.isActive, post?.date]);

    return (
        <>
            {isActive &&
                <button data-testid="isactive-button" className="btn btn-success m-1" style={{ width: "40px", height: "40px" }}
                    onClick={() => {
                        history.push(`/posts/${post?.slug}`)
                    }}>
                    <FontAwesomeIcon icon={faEye} title="Megtekintés" />
                </button>
            }
            {!isActive &&
                <button className="btn btn-success m-1 disabled" style={{ width: "40px", height: "40px" }}>
                    <FontAwesomeIcon icon={faEye} />
                </button>
            }
        </>
    )
}

ViewPost.propTypes = {
    post: PropTypes.object.isRequired
};