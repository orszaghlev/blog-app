import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Spinner } from "./Spinner.jsx";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTimes } from "@fortawesome/free-solid-svg-icons";

export function AdminAllPosts(props) {
    const [posts, setPosts] = useState([]);
    const [isPending, setPending] = useState(false);
    const history = useHistory();

    const useStyles = makeStyles({
        table: {
            minWidth: 650,
        },
    });

    const classes = useStyles();

    function getPosts() {
        const config = {
            headers: { Authorization: `Bearer ${props.match.params.accessToken}` }
        };
        axios.get('http://localhost:8000/auth/posts', config)
            .then(data => setPosts(data.data))
            .catch(error => {
                console.error('Hiba!', error);
            });
    };

    useEffect(() => {
        setPending(true);
        getPosts();
        setPending(false);
    }, [props.match.params.accessToken])

    if (isPending) {
        return <Spinner />
    } else if (posts.length === 0) {
        return (
            <div class="jumbotron">
                <motion.div
                    animate={{ scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                >
                    <h3>Nincsenek elérhető bejegyzések!</h3>
                </motion.div>
            </div>
        )
    } else {
        return (
            <div className="p-1 m-auto text-center content bg-ivory">
                <Helmet>
                    <title>Admin - Bejegyzések</title>
                    <meta name="description" content="Admin - Bejegyzések" />
                </Helmet>
                <motion.div
                    animate={{ scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2>Admin - Bejegyzések</h2>
                    <Button variant="contained" onClick={() => {
                        history.push(`/admin/create-post/${props.match.params.accessToken}`)
                    }}>Új bejegyzés</Button>
                </motion.div>
                <div className="card">
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
                        <TableContainer component={Paper}>
                            <Table className={classes.table} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">ID</TableCell>
                                        <TableCell align="center">Cím</TableCell>
                                        <TableCell align="center">Slug</TableCell>
                                        <TableCell align="center">Leírás</TableCell>
                                        <TableCell align="center">Tartalom</TableCell>
                                        <TableCell align="center">Kép URL</TableCell>
                                        <TableCell align="center">Címke</TableCell>
                                        <TableCell align="center">Opciók</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {posts.map((post) => (
                                        <TableRow key={post.id}>
                                            <TableCell align="left">{post.id}</TableCell>
                                            <TableCell align="left">{post.title}</TableCell>
                                            <TableCell align="left">{post.slug}</TableCell>
                                            <TableCell align="left">{post.description}</TableCell>
                                            <TableCell align="left">{post.content}</TableCell>
                                            <TableCell align="left">{post.imgURL}</TableCell>
                                            <TableCell align="left">{post.tag}</TableCell>
                                            <TableCell align="left">
                                                <button className="btn btn-danger m-1" style={{ width: "50px", height: "50px" }} onClick={async () => {
                                                    setPending(true);
                                                    await axios.delete(`http://localhost:8000/auth/posts/${post.id}`)
                                                        .catch(error => {
                                                            console.error('Hiba!', error);
                                                        });
                                                    await getPosts();
                                                    setPending(false);
                                                }
                                                }>
                                                    <FontAwesomeIcon icon={faTimes} />
                                                </button>
                                                <button className="btn btn-primary m-1" style={{ width: "50px", height: "50px" }} onClick={() => {
                                                    history.push(`/admin/edit-post/${props.match.params.accessToken}/${post.id}`)
                                                }}>
                                                    <FontAwesomeIcon icon={faPencilAlt} />
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </motion.div>
                </div>
            </div >
        )
    }
}