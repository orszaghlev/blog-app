import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Spinner } from "./Spinner.jsx";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Button } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { NavigateNext as NavigateNextIcon } from '@material-ui/icons';
import { NavigateBefore as NavigateBeforeIcon } from '@material-ui/icons';
import { IconButton } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrash, faCopy } from "@fortawesome/free-solid-svg-icons";
import { Editor } from '@tinymce/tinymce-react';
import ModalImage from "react-modal-image";
import firebase from "../firebase/clientApp";
import { usePagination } from "use-pagination-firestore";

export function AdminAllPosts() {
    const [search, setSearch] = useState("");
    const history = useHistory();

    const useStyles = makeStyles({
        table: {
            minWidth: 650,
        },
    });

    const StyledTableCell = withStyles((theme) => ({
        head: {
            backgroundColor: theme.palette.success.light,
            color: theme.palette.common.white,
        },
        body: {
            fontSize: 14,
        },
    }))(TableCell);

    const classes = useStyles();

    const {
        items,
        isLoading,
        isStart,
        isEnd,
        getPrev,
        getNext,
    } = usePagination(
        firebase
            .firestore()
            .collection("/posts")
            .orderBy("id", "asc"),
        {
            limit: 10
        }
    );

    const [isSignedIn, setIsSignedIn] = useState(false);

    const editorRef = useRef(null);

    useEffect(() => {
        const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
            setIsSignedIn(!!user);
        });
        return () => unregisterAuthObserver();
    }, []);

    if (isLoading) {
        return <Spinner />
    } else if (!items) {
        return (
            <div class="jumbotron">
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
                    <h3>Nincsenek elérhető bejegyzések!</h3>
                </motion.div>
            </div>
        )
    } else if (!isSignedIn || !firebase.auth().currentUser.emailVerified) {
        return (
            <div class="jumbotron">
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
                    <h4>Az adminisztrációs felület megtekintéséhez bejelentkezés és hitelesítés szükséges!</h4>
                    <Grid container
                        direction="row"
                        justify="center"
                        alignItems="center">
                        <Button m="2rem" style={{ marginRight: "10px" }} variant="contained" color="primary"
                            onClick={() => {
                                history.push("/admin/login")
                            }}>
                            Bejelentkezés/Hitelesítés
                        </Button>
                        <Button m="2rem" variant="contained" color="secondary" onClick={() => {
                            history.push("/home")
                        }}>
                            Kezdőlap
                        </Button>
                    </Grid>
                </motion.div>
            </div>
        )
    } else {
        return (
            <div className="p-1 m-auto text-center content bg-ivory">
                <Helmet>
                    <title>Adminisztrációs felület</title>
                    <meta name="description" content="Adminisztrációs felület" />
                </Helmet>
                {isSignedIn && firebase.auth().currentUser.emailVerified && <>
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
                        <Grid container
                            direction="row"
                            justify="space-around"
                            alignItems="center">
                            <h2>Adminisztrációs felület</h2>
                            <form className={classes.search} noValidate autoComplete="off"
                                onChange={e => setSearch(e.target.value)}>
                                <TextField id="search" label="Keresés..." variant="filled" />
                            </form>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container justify="center">
                                <Grid item>
                                    <IconButton onClick={getPrev} disabled={isStart}>
                                        <NavigateBeforeIcon />
                                    </IconButton>
                                    <IconButton onClick={getNext} disabled={isEnd}>
                                        <NavigateNextIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container justify="center">
                            <Button style={{ marginRight: "10px" }} variant="contained" color="primary" onClick={() => {
                                history.push(`/admin/create-post`);
                            }}>Bejegyzés létrehozása</Button>
                            <Button variant="contained" color="secondary" onClick={() => {
                                setSearch("hun");
                            }}>Csak magyar bejegyzések</Button>
                        </Grid>
                        <div className="card">
                            <TableContainer component={Paper}>
                                <Table className={classes.table} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell align="center">ID</StyledTableCell>
                                            <StyledTableCell align="center">Cím</StyledTableCell>
                                            <StyledTableCell align="center">Slug</StyledTableCell>
                                            <StyledTableCell align="center">Leírás</StyledTableCell>
                                            <StyledTableCell align="center">Tartalom</StyledTableCell>
                                            <StyledTableCell align="center">Kép</StyledTableCell>
                                            <StyledTableCell align="center">Címke</StyledTableCell>
                                            <StyledTableCell align="center">Opciók</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {items.filter(li =>
                                            li.isActive.toString() === "true" &&
                                            (li.tag.toLowerCase().includes(search.toLowerCase()) ||
                                                li.title.toLowerCase().includes(search.toLowerCase()) ||
                                                li.slug.toLowerCase().includes(search.toLowerCase()) ||
                                                li.description.toLowerCase().includes(search.toLowerCase()) ||
                                                li.content.toLowerCase().includes(search.toLowerCase())))
                                            .map((post) => (
                                                <TableRow key={post.id}>
                                                    <TableCell align="center">{post.id}</TableCell>
                                                    <TableCell align="center">{post.title}</TableCell>
                                                    <TableCell align="center">{post.slug}</TableCell>
                                                    <TableCell align="center">
                                                        <textarea value={post.description} class="form-control" rows="3" onChange={(e) => {
                                                            const data = {
                                                                id: post.id,
                                                                title: post.title,
                                                                slug: post.slug,
                                                                description: e.target.value,
                                                                content: post.content,
                                                                imgURL: post.imgURL,
                                                                tag: post.tag,
                                                                isActive: post.isActive
                                                            };
                                                            firebase.firestore().collection('posts').doc(post.id).set(data);
                                                        }} />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Editor
                                                            apiKey={process.env.REACT_APP_TINY_API_KEY}
                                                            onInit={(editor) => editorRef.current = editor}
                                                            value={post.content}
                                                            init={{
                                                                language: 'hu_HU',
                                                                height: 200,
                                                                width: 500,
                                                                menubar: false,
                                                                plugins: [
                                                                    'advlist autolink lists link image charmap print preview anchor',
                                                                    'searchreplace visualblocks code fullscreen',
                                                                    'insertdatetime media table paste code help wordcount'
                                                                ],
                                                                toolbar: 'undo redo | formatselect | ' +
                                                                    'bold italic backcolor | alignleft aligncenter ' +
                                                                    'alignright alignjustify | bullist numlist outdent indent | ' +
                                                                    'removeformat | help',
                                                                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                                            }}
                                                            onEditorChange={(content) => {
                                                                const data = {
                                                                    id: post.id,
                                                                    title: post.title,
                                                                    slug: post.slug,
                                                                    description: post.description,
                                                                    content: content,
                                                                    imgURL: post.imgURL,
                                                                    tag: post.tag,
                                                                    isActive: post.isActive
                                                                };
                                                                firebase.firestore().collection('posts').doc(post.id).set(data);
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <div style={{ width: "100px", height: "100px" }}>
                                                            <ModalImage
                                                                alt={post.title}
                                                                small={post.imgURL}
                                                                large={post.imgURL}
                                                            />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell align="center">{post.tag}</TableCell>
                                                    <TableCell align="center">
                                                        <button className="btn btn-primary m-1" style={{ width: "50px", height: "50px" }} onClick={() => {
                                                            const data = {
                                                                id: ((parseInt(post.id)) + 1).toString(),
                                                                title: post.title,
                                                                slug: post.slug,
                                                                description: post.description,
                                                                content: post.content,
                                                                imgURL: post.imgURL,
                                                                tag: post.tag,
                                                                isActive: post.isActive
                                                            };
                                                            firebase.firestore().collection('posts').doc(data.id).set(data);
                                                        }}>
                                                            <FontAwesomeIcon icon={faCopy} />
                                                        </button>
                                                        <button className="btn btn-warning m-1" style={{ width: "50px", height: "50px" }} onClick={() => {
                                                            history.push(`/admin/edit-post/${post.id}`)
                                                        }}>
                                                            <FontAwesomeIcon icon={faPencilAlt} />
                                                        </button>
                                                        <button className="btn btn-danger m-1" style={{ width: "50px", height: "50px" }} onClick={async () => {
                                                            firebase.firestore().collection('posts').doc(post.id).delete().then(() => {
                                                            });
                                                        }}>
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </motion.div>
                </>}
            </div >
        )
    }
}