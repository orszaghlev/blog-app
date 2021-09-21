import { firebase, FieldValue } from '../lib/Firebase';

export async function doesUsernameExist(username) {
    const result = await firebase
        .firestore()
        .collection('users')
        .where('username', '==', username)
        .get();

    return result.docs.map((user) => user.data().length > 0);
}

export async function getUserByUsername(username) {
    const result = await firebase
        .firestore()
        .collection('users')
        .where('username', '==', username)
        .get();

    return result.docs.map((item) => ({
        ...item.data(),
        docId: item.id
    }));
}

export async function getUserByUserId(userId) {
    const result = await firebase
        .firestore()
        .collection('users')
        .where('userId', '==', userId)
        .get();

    return result.docs.map((item) => ({
        ...item.data(),
        docId: item.id
    }));
}

export async function getAllPosts() {
    const result = await firebase
        .firestore()
        .collection('posts')
        .get();
        
    return result.docs.map((item) => ({
        ...item.data()
    }));
}

export async function getPostByPostSlug(postSlug) {
    const result = await firebase
        .firestore()
        .collection('posts')
        .where('slug', '==', postSlug)
        .get();

    return result.docs.map((item) => ({
        ...item.data(),
        docId: item.id
    }));
}

export async function updateLoggedInUserFavoritePosts(
    loggedInUserDocId,
    postId,
    isFollowingPost
) {
    return firebase
        .firestore()
        .collection('users')
        .doc(loggedInUserDocId)
        .update({
            favoritePosts: isFollowingPost
                ? FieldValue.arrayRemove(postId)
                : FieldValue.arrayUnion(postId)
        });
}

export async function getFavoritePosts(userId, favoritePosts) {
    const result = await firebase
        .firestore()
        .collection('posts')
        .where('userId', 'in', favoritePosts)
        .get();
    const userFavoritePosts = result.docs.map((post) => ({
        ...post.data(),
        docId: post.id
    }));
    const postsWithUserDetails = await Promise.all(
        userFavoritePosts.map(async (post) => {
            let userSavedPost = false;
            if (post.saves.includes(userId)) {
                userSavedPost = true;
            }
            const user = await getUserByUserId(post.userId);
            const { username } = user[0];
            return { username, ...post, userSavedPost };
        })
    );

    return postsWithUserDetails;
}

export async function isUserFollowingPost(loggedInUserUsername, postUserId) {
    const result = await firebase
        .firestore()
        .collection('users')
        .where('username', '==', loggedInUserUsername)
        .where('favoritePosts', 'array-contains', postUserId)
        .get();
    const [response = {}] = result.docs.map((item) => ({
        ...item.data(),
        docId: item.id
    }));

    return response.userId;
}

export async function toggleSave(
    isSavingPost,
    activeUserDocId,
    postUserId
) {
    await updateLoggedInUserFavoritePosts(activeUserDocId, postUserId, isSavingPost);
}