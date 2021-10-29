import { useState, useRef, useMemo } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from 'prop-types';
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
import { faPencilAlt, faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ModalImage from "react-modal-image";
import latinize from 'latinize';
import * as ROUTES from '../../../constants/Routes';
import DuplicatePost from './DuplicatePost';
import DeletePost from './DeletePost';
import EditPost from "./EditPost";
import ViewPost from "./ViewPost";

export default function ShowAllPosts({ allPosts }) {
    const [search, setSearch] = useState("");
    const [hunSearch, setHunSearch] = useState(false);
    const [active, setActive] = useState(false);
    const [inactive, setInactive] = useState(false);
    const [hunCount, setHunCount] = useState(1);
    const [activeCount, setActiveCount] = useState(1);
    const [inactiveCount, setInactiveCount] = useState(1);
    const [postToBeEdited, setPostToBeEdited] = useState();
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
        let sortableItems = [...allPosts];
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
    }, [allPosts, sortConfig]);
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
        <>
            {postToBeEdited &&
                <>
                    <EditPost post={postToBeEdited} />
                    <hr />
                </>
            }
            <h2>Összes bejegyzés</h2>
            <Grid container
                direction="row"
                justifyContent="space-around"
                alignItems="center">
                <form className={classes.search} noValidate autoComplete="off"
                    onChange={e => setSearch(e.target.value)}>
                    <TextField inputProps={{ "data-testid": "input-search" }} id="search" label="Keresés..." variant="filled" />
                </form>
                <Card className={classes.root}>
                    <CardActions style={{ justifyContent: "center" }}>
                        <Button data-testid="create-post-button" color="primary" align="center" onClick={() => {
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
                justifyContent="space-around"
                alignItems="center">
                <Button data-testid="hungarian-posts-only" variant="contained" style={{
                    backgroundColor: hunSearch ? 'green' : '#dc3545',
                    color: 'white'
                }}
                    onClick={() => {
                        setHunCount(hunCount + 1);
                        if (hunCount % 2 === 1) {
                            setHunSearch(true);
                        } else if (hunCount % 2 === 0) {
                            setHunSearch(false);
                        }
                    }}>Csak magyar bejegyzések</Button>
                <Button data-testid="active-posts-only" variant="contained" style={{
                    backgroundColor: active ? 'green' : '#dc3545',
                    color: 'white'
                }}
                    onClick={() => {
                        setActiveCount(activeCount + 1);
                        if (activeCount % 2 === 1) {
                            setActive(true);
                            setInactive(false);
                        } else if (activeCount % 2 === 0) {
                            setActive(false);
                        }
                    }}>Csak aktív bejegyzések</Button>
                <Button data-testid="inactive-posts-only" variant="contained" style={{
                    backgroundColor: inactive ? 'green' : '#dc3545',
                    color: 'white'
                }}
                    onClick={() => {
                        setInactiveCount(inactiveCount + 1);
                        if (inactiveCount % 2 === 1) {
                            setInactive(true);
                            setActive(false);
                        } else if (inactiveCount % 2 === 0) {
                            setInactive(false);
                        }
                    }}>Csak inaktív bejegyzések</Button>
            </Grid>
            <div className="card">
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center">
                                    <Button data-testid="sort-by-id-button" style={{ color: "white" }} onClick={() => requestSort('id')} className={getClassNamesFor('id')}>
                                        ID
                                        {getClassNamesFor('id') === "ascending" ? <FontAwesomeIcon icon={faSortUp} /> : ""}
                                        {getClassNamesFor('id') === "descending" ? <FontAwesomeIcon icon={faSortDown} /> : ""}
                                    </Button>
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    <Button data-testid="sort-by-title-button" style={{ color: "white" }} onClick={() => requestSort('title')} className={getClassNamesFor('title')}>
                                        CÍM
                                        {getClassNamesFor('title') === "ascending" ? <FontAwesomeIcon icon={faSortUp} /> : ""}
                                        {getClassNamesFor('title') === "descending" ? <FontAwesomeIcon icon={faSortDown} /> : ""}
                                    </Button>
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    <Button data-testid="sort-by-slug-button" style={{ color: "white" }} onClick={() => requestSort('slug')} className={getClassNamesFor('slug')}>
                                        SLUG
                                        {getClassNamesFor('slug') === "ascending" ? <FontAwesomeIcon icon={faSortUp} /> : ""}
                                        {getClassNamesFor('slug') === "descending" ? <FontAwesomeIcon icon={faSortDown} /> : ""}
                                    </Button>
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    <Button data-testid="sort-by-description-button" style={{ color: "white" }} onClick={() => requestSort('description')} className={getClassNamesFor('description')}>
                                        LEÍRÁS
                                        {getClassNamesFor('description') === "ascending" ? <FontAwesomeIcon icon={faSortUp} /> : ""}
                                        {getClassNamesFor('description') === "descending" ? <FontAwesomeIcon icon={faSortDown} /> : ""}
                                    </Button>
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    <Button data-testid="sort-by-content-button" style={{ color: "white" }} onClick={() => requestSort('content')} className={getClassNamesFor('content')}>
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
                                    <Button data-testid="sort-by-tag-button" style={{ color: "white" }} onClick={() => requestSort('tag')} className={getClassNamesFor('tag')}>
                                        CÍMKÉK
                                        {getClassNamesFor('tag') === "ascending" ? <FontAwesomeIcon icon={faSortUp} /> : ""}
                                        {getClassNamesFor('tag') === "descending" ? <FontAwesomeIcon icon={faSortDown} /> : ""}
                                    </Button>
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    <Button data-testid="sort-by-language-button" style={{ color: "white" }} onClick={() => requestSort('language')} className={getClassNamesFor('language')}>
                                        NYELV
                                        {getClassNamesFor('language') === "ascending" ? <FontAwesomeIcon icon={faSortUp} /> : ""}
                                        {getClassNamesFor('language') === "descending" ? <FontAwesomeIcon icon={faSortDown} /> : ""}
                                    </Button>
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    <Button data-testid="sort-by-date-button" style={{ color: "white" }} onClick={() => requestSort('date')} className={getClassNamesFor('date')}>
                                        DÁTUM
                                        {getClassNamesFor('date') === "ascending" ? <FontAwesomeIcon icon={faSortUp} /> : ""}
                                        {getClassNamesFor('date') === "descending" ? <FontAwesomeIcon icon={faSortDown} /> : ""}
                                    </Button>
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    <Button data-testid="sort-by-isActive-button" style={{ color: "white" }} onClick={() => requestSort('isActive')} className={getClassNamesFor('isActive')}>
                                        ÁLLAPOT
                                        {getClassNamesFor('isActive') === "ascending" ? <FontAwesomeIcon icon={faSortUp} /> : ""}
                                        {getClassNamesFor('isActive') === "descending" ? <FontAwesomeIcon icon={faSortDown} /> : ""}
                                    </Button>
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    <Button style={{ color: "white" }}>
                                        MŰVELETEK
                                    </Button>
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedItems.filter(li =>
                                (hunSearch ? li.language.toLowerCase().includes("hungarian") : li.language.toLowerCase().includes(""))
                                && (active ? li.isActive.toLowerCase().includes("true") : li.isActive.toLowerCase().includes(""))
                                && (inactive ? li.isActive.toLowerCase().includes("false") : li.isActive.toLowerCase().includes(""))
                                && (li.isActive.toString().toLowerCase().includes(search.toLowerCase()) ||
                                    li.tag.toLowerCase().includes(search.toLowerCase()) ||
                                    li.language.toLowerCase().includes(search.toLowerCase()) ||
                                    li.date.includes(search.toLowerCase()) ||
                                    li.title.toLowerCase().includes(search.toLowerCase()) ||
                                    li.slug.toLowerCase().includes(search.toLowerCase()) ||
                                    li.description.toLowerCase().includes(search.toLowerCase()) ||
                                    li.content.toLowerCase().includes(search.toLowerCase())))
                                .map((post) => (
                                    <TableRow key={post?.id}>
                                        <TableCell align="center">{post?.id}</TableCell>
                                        <TableCell align="center">{post?.title}</TableCell>
                                        <TableCell align="center">{post?.slug}</TableCell>
                                        <TableCell align="center" style={{ width: "200px" }}>
                                            <textarea readOnly value={post?.description} className="form-control" rows="5" />
                                        </TableCell>
                                        <TableCell align="center">
                                            <CKEditor
                                                editor={ClassicEditor}
                                                data={post?.content}
                                                config={{
                                                    alignment: {
                                                        options: ['justify']
                                                    },
                                                    toolbar: []
                                                }}
                                                onReady={editor => {
                                                    editorRef.current = editor;
                                                    editor.editing.view.change(writer => {
                                                        writer.setStyle('height', '150px', editor.editing.view.document.getRoot());
                                                    });
                                                    editor.isReadOnly = true;
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <div style={{ width: "100px", height: "100px" }}>
                                                <ModalImage
                                                    alt={post?.title}
                                                    small={post?.imgURL}
                                                    large={post?.imgURL}
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell align="center">{post?.tag}</TableCell>
                                        <TableCell align="center">
                                            <TextField value={post?.language} name="language" label="Nyelv" type="text" select
                                                style={{ textAlign: "left" }} InputProps={{
                                                    readOnly: true,
                                                }}
                                            >
                                                <MenuItem value="Hungarian">Magyar</MenuItem>
                                                <MenuItem value="English">Angol</MenuItem>
                                            </TextField>
                                        </TableCell>
                                        <TableCell align="center" style={{ width: "150px" }}>{post?.date}</TableCell>
                                        <TableCell align="center">
                                            <TextField value={post?.isActive} name="isActive" label="Állapot" type="text" select
                                                style={{ textAlign: "left" }} InputProps={{
                                                    readOnly: true,
                                                }}
                                            >
                                                <MenuItem value="true">Aktív</MenuItem>
                                                <MenuItem value="false">Inaktív</MenuItem>
                                            </TextField>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Grid container
                                                direction="column"
                                                justifyContent="center"
                                                alignItems="center">
                                                <DeletePost post={post} />
                                                <button data-testid="scroll-to-edit-post-button" className="btn btn-warning m-1"
                                                    style={{ width: "50px", height: "50px" }} onClick={() => {
                                                        setPostToBeEdited(post);
                                                        window.scrollTo(0, 70);
                                                    }}>
                                                    <FontAwesomeIcon icon={faPencilAlt} />
                                                </button>
                                                <DuplicatePost post={post} />
                                                <ViewPost post={post} />
                                            </Grid>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    )
}

ShowAllPosts.propTypes = {
    allPosts: PropTypes.array.isRequired
};