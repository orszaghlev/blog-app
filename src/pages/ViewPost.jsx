import PostNotAvailable from "../components/view-post/PostNotAvailable";
import PostInactive from "../components/view-post/PostInactive";
import usePost from "../hooks/UsePost";
import ShowPost from "../components/view-post/ShowPost";

export function ViewPost(props) {
    const { post } = usePost(props.match.params.id);

    if (!post) {
        return <PostNotAvailable />
    } else if (post?.isActive?.toString() !== "true" ||
        (new Date(post?.date).getTime() >= new Date().getTime())) {
        return <PostInactive />
    } else {
        return <ShowPost post={post} />
    }
}