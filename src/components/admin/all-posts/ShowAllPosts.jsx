import { useState, useRef, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
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
import MenuItem from '@material-ui/core/MenuItem';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrash, faCopy, faSortUp, faSortDown, faHeart } from "@fortawesome/free-solid-svg-icons";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ModalImage from "react-modal-image";
import { firebase } from "../../../lib/Firebase";
import latinize from 'latinize';
import * as ROUTES from '../../../constants/Routes';

export default function ShowAllPosts({ posts }) {
    const [search, setSearch] = useState("");
    const [hunCount, setHunCount] = useState(1);
    const [activeCount, setActiveCount] = useState(1);
    const [inactiveCount, setInactiveCount] = useState(1);
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
    const editorRef = useRef(null);
    const [sortConfig, setSortConfig] = useState(null);
    const sortedItems = useMemo(() => {
        let sortableItems = [...posts];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (latinize(a[sortConfig.key].toString()) < latinize(b[sortConfig.key].toString())) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (latinize(a[sortConfig.key].toString()) > latinize(b[sortConfig.key].toString())) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [posts, sortConfig]);
    const requestSort = (key) => {
        let direction = 'ascending';
        if (
            sortConfig &&
            sortConfig.key === key &&
            sortConfig.direction === 'ascending'
        ) {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };
    const getClassNamesFor = (name) => {
        if (!sortConfig) {
            return;
        }
        return sortConfig.key === name ? sortConfig.direction : undefined;
    };

    return (
        <div className="p-1 m-auto text-center content bg-ivory">
            <Helmet>
                <title>Összes bejegyzés</title>
                <meta name="description" content="Összes bejegyzés" />
            </Helmet>
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
                <h2>Összes bejegyzés</h2>
                <Grid container
                    direction="row"
                    justify="space-around"
                    alignItems="center">
                    <form className={classes.search} noValidate autoComplete="off"
                        onChange={e => setSearch(e.target.value)}>
                        <TextField id="search" label="Keresés..." variant="filled" />
                    </form>
                    <Card className={classes.root}>
                        <CardActions style={{ justifyContent: "center" }}>
                            <Button size="2rem" color="primary" align="center" onClick={() => {
                                history.push(ROUTES.ADMIN_CREATE_POST)
                            }}>
                                Új bejegyzés
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
                <br />
                <Grid container
                    direction="row"
                    justify="space-around"
                    alignItems="center">
                    <Button variant="contained" style={{
                        backgroundColor: search === "hun" ? 'green' : '#dc3545',
                        color: 'white'
                    }}
                        onClick={() => {
                            setHunCount(hunCount + 1);
                            if (hunCount % 2 === 1) {
                                setSearch("hun");
                            } else if (hunCount % 2 === 0) {
                                setSearch("");
                            }
                        }}>Csak magyar bejegyzések</Button>
                    <Button variant="contained" style={{
                        backgroundColor: search === "true" ? 'green' : '#dc3545',
                        color: 'white'
                    }}
                        onClick={() => {
                            setActiveCount(activeCount + 1);
                            if (activeCount % 2 === 1) {
                                setSearch("true");
                            } else if (activeCount % 2 === 0) {
                                setSearch("");
                            }
                        }}>Csak aktív bejegyzések</Button>
                    <Button variant="contained" style={{
                        backgroundColor: search === "false" ? 'green' : '#dc3545',
                        color: 'white'
                    }}
                        onClick={() => {
                            setInactiveCount(inactiveCount + 1);
                            if (inactiveCount % 2 === 1) {
                                setSearch("false");
                            } else if (inactiveCount % 2 === 0) {
                                setSearch("");
                            }
                        }}>Csak inaktív bejegyzések</Button>
                </Grid>
                <div className="card">
                    <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center">
                                        <Button style={{ color: "white" }} onClick={() => requestSort('id')} className={getClassNamesFor('id')}>
                                            ID
                                            {getClassNamesFor('id') === "ascending" ? <FontAwesomeIcon icon={faSortUp} /> : ""}
                                            {getClassNamesFor('id') === "descending" ? <FontAwesomeIcon icon={faSortDown} /> : ""}
                                        </Button>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Button style={{ color: "white" }} onClick={() => requestSort('title')} className={getClassNamesFor('title')}>
                                            CÍM
                                            {getClassNamesFor('title') === "ascending" ? <FontAwesomeIcon icon={faSortUp} /> : ""}
                                            {getClassNamesFor('title') === "descending" ? <FontAwesomeIcon icon={faSortDown} /> : ""}
                                        </Button>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Button style={{ color: "white" }} onClick={() => requestSort('slug')} className={getClassNamesFor('slug')}>
                                            SLUG
                                            {getClassNamesFor('slug') === "ascending" ? <FontAwesomeIcon icon={faSortUp} /> : ""}
                                            {getClassNamesFor('slug') === "descending" ? <FontAwesomeIcon icon={faSortDown} /> : ""}
                                        </Button>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Button style={{ color: "white" }} onClick={() => requestSort('description')} className={getClassNamesFor('description')}>
                                            LEÍRÁS
                                            {getClassNamesFor('description') === "ascending" ? <FontAwesomeIcon icon={faSortUp} /> : ""}
                                            {getClassNamesFor('description') === "descending" ? <FontAwesomeIcon icon={faSortDown} /> : ""}
                                        </Button>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Button style={{ color: "white" }} onClick={() => requestSort('content')} className={getClassNamesFor('content')}>
                                            TARTALOM
                                            {getClassNamesFor('content') === "ascending" ? <FontAwesomeIcon icon={faSortUp} /> : ""}
                                            {getClassNamesFor('content') === "descending" ? <FontAwesomeIcon icon={faSortDown} /> : ""}
                                        </Button>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Button style={{ color: "white" }}>
                                            KÉP
                                        </Button>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Button style={{ color: "white" }} onClick={() => requestSort('tag')} className={getClassNamesFor('tag')}>
                                            CÍMKÉK
                                            {getClassNamesFor('tag') === "ascending" ? <FontAwesomeIcon icon={faSortUp} /> : ""}
                                            {getClassNamesFor('tag') === "descending" ? <FontAwesomeIcon icon={faSortDown} /> : ""}
                                        </Button>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Button style={{ color: "white" }} onClick={() => requestSort('date')} className={getClassNamesFor('date')}>
                                            DÁTUM
                                            {getClassNamesFor('date') === "ascending" ? <FontAwesomeIcon icon={faSortUp} /> : ""}
                                            {getClassNamesFor('date') === "descending" ? <FontAwesomeIcon icon={faSortDown} /> : ""}
                                        </Button>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Button style={{ color: "white" }} onClick={() => requestSort('isActive')} className={getClassNamesFor('isActive')}>
                                            ÁLLAPOT
                                            {getClassNamesFor('isActive') === "ascending" ? <FontAwesomeIcon icon={faSortUp} /> : ""}
                                            {getClassNamesFor('isActive') === "descending" ? <FontAwesomeIcon icon={faSortDown} /> : ""}
                                        </Button>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Button style={{ color: "white" }}>
                                            OPCIÓK
                                        </Button>
                                    </StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedItems.filter(li =>
                                    li.isActive.toString().toLowerCase().includes(search.toLowerCase()) ||
                                    li.tag.toLowerCase().includes(search.toLowerCase()) ||
                                    li.date.includes(search.toLowerCase()) ||
                                    li.title.toLowerCase().includes(search.toLowerCase()) ||
                                    li.slug.toLowerCase().includes(search.toLowerCase()) ||
                                    li.description.toLowerCase().includes(search.toLowerCase()) ||
                                    li.content.toLowerCase().includes(search.toLowerCase()))
                                    .map((post) => (
                                        <TableRow key={post.id}>
                                            <TableCell align="center">{post.id}</TableCell>
                                            <TableCell align="center">{post.title}</TableCell>
                                            <TableCell align="center">{post.slug}</TableCell>
                                            <TableCell align="center" style={{ width: "200px" }}>
                                                <textarea value={post.description} class="form-control" rows="3" onChange={(e) => {
                                                    const data = {
                                                        id: post.id,
                                                        title: post.title,
                                                        slug: post.slug,
                                                        description: e.target.value,
                                                        content: post.content,
                                                        imgURL: post.imgURL,
                                                        tag: post.tag,
                                                        isActive: post.isActive,
                                                        date: post.date
                                                    };
                                                    firebase.firestore().collection('posts').doc(post.id).set(data);
                                                }} />
                                            </TableCell>
                                            <TableCell align="center">
                                                <CKEditor
                                                    editor={ClassicEditor}
                                                    data={post.content}
                                                    config={{
                                                        toolbar: []
                                                    }}
                                                    onReady={editor => {
                                                        editorRef.current = editor
                                                        editor.editing.view.change(writer => {
                                                            writer.setStyle('height', '150px', editor.editing.view.document.getRoot());
                                                        });
                                                    }}
                                                    onChange={(editor) => {
                                                        const content = editor.getData();
                                                        const data = {
                                                            id: post.id,
                                                            title: post.title,
                                                            slug: post.slug,
                                                            description: post.description,
                                                            content: content,
                                                            imgURL: post.imgURL,
                                                            tag: post.tag,
                                                            isActive: post.isActive,
                                                            date: post.date
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
                                            <TableCell align="center" style={{ width: "150px" }}>{post.date}</TableCell>
                                            <TableCell align="center">
                                                <TextField value={post.isActive} name="isActive" label="Állapot" variant="filled" type="text" select
                                                    onChange={(e) => {
                                                        const data = {
                                                            id: post.id,
                                                            title: post.title,
                                                            slug: post.slug,
                                                            description: post.description,
                                                            content: post.content,
                                                            imgURL: post.imgURL,
                                                            tag: post.tag,
                                                            isActive: e.target.value,
                                                            date: post.date
                                                        };
                                                        firebase.firestore().collection('posts').doc(post.id).set(data);
                                                    }}
                                                    style={{ textAlign: "left" }} >
                                                    <MenuItem value="true">Aktív</MenuItem>
                                                    <MenuItem value="false">Inaktív</MenuItem>
                                                </TextField>
                                            </TableCell>
                                            <TableCell align="center">
                                                <button className="btn btn-light m-1"
                                                    style={{
                                                        width: "50px", height: "50px", border: '1px solid rgba(0, 0, 0, 0.5)'
                                                    }}
                                                    onClick={() => {

                                                    }}>
                                                    <FontAwesomeIcon icon={faHeart} style={{
                                                        color: localStorage.getItem('favItem' + (post.id)) !== null ? '#dc3545' : 'black'
                                                    }} />
                                                </button>
                                                <button className="btn btn-primary m-1" style={{ width: "50px", height: "50px" }} onClick={() => {
                                                    const data = {
                                                        id: ((parseInt(post.id)) + 1).toString(),
                                                        title: post.title,
                                                        slug: post.slug,
                                                        description: post.description,
                                                        content: post.content,
                                                        imgURL: post.imgURL,
                                                        tag: post.tag,
                                                        isActive: post.isActive,
                                                        date: post.date
                                                    };
                                                    firebase.firestore().collection('posts').doc(data.id).set(data);
                                                }}>
                                                    <FontAwesomeIcon icon={faCopy} />
                                                </button>
                                                <button className="btn btn-warning m-1" style={{ width: "50px", height: "50px" }} onClick={() => {
                                                    history.push(`/admin/edit-post/${post.slug}`)
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
        </div >
    )
}