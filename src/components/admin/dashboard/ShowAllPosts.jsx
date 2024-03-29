import { useState, useRef, useMemo } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from 'prop-types';
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ModalImage from "react-modal-image";
import latinize from 'latinize';
import DuplicatePost from './DuplicatePost';
import DeletePost from './DeletePost';
import EditPost from "./EditPost";
import ViewPost from "./ViewPost";
import * as ROUTES from '../../../constants/Routes';

export default function ShowAllPosts({ allPosts, isTabletOrMobile }) {
    const history = useHistory();
    const [search, setSearch] = useState("");
    const [hunSearch, setHunSearch] = useState(false);
    const [active, setActive] = useState(false);
    const [inactive, setInactive] = useState(false);
    const [hunCount, setHunCount] = useState(1);
    const [activeCount, setActiveCount] = useState(1);
    const [inactiveCount, setInactiveCount] = useState(1);
    const [postToBeEdited, setPostToBeEdited] = useState();
    const useStyles = makeStyles({
        table: {
            maxWidth: 1224,
        },
    });
    const StyledTableCell = withStyles((theme) => ({
        head: {
            backgroundColor: theme.palette.primary.light,
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
                    <EditPost post={postToBeEdited} isTabletOrMobile={isTabletOrMobile} />
                    <hr />
                </>
            }
            <h2>Admin felület</h2>
            <Grid container
                direction="row"
                justifyContent="space-evenly"
                alignItems="center">
                <form className={classes.search} noValidate autoComplete="off"
                    onChange={e => setSearch(e.target.value)}>
                    <TextField size="small" inputProps={{ "data-testid": "input-search" }} id="search" label="Keresés..." variant="filled" />
                </form>
                <Button size={isTabletOrMobile ? "small" : "medium"} data-testid="create-post" color="primary" variant="contained" style={{ marginTop: isTabletOrMobile ? '10px' : '0px' }}
                    onClick={() => {
                        history.push(ROUTES.ADMIN_CREATE_POST);
                    }}>
                    Új bejegyzés
                </Button>
            </Grid>
            <br />
            <Grid container
                direction="row"
                justifyContent="space-around"
                alignItems="center">
                <Button size="small" data-testid="hungarian-posts-only" variant="contained" style={{
                    backgroundColor: hunSearch ? 'green' : '#dc3545',
                    color: 'white'
                }}
                    onClick={() => {
                        setHunCount(hunCount + 1);
                        if (hunCount % 2 === 1) {
                            setHunSearch(true);
                        } else {
                            setHunSearch(false);
                        }
                    }}>Csak magyar bejegyzések</Button>
                <Button size="small" data-testid="active-posts-only" variant="contained" style={{
                    backgroundColor: active ? 'green' : '#dc3545',
                    color: 'white',
                    margin: isTabletOrMobile ? '10px' : '0px'
                }}
                    onClick={() => {
                        setActiveCount(activeCount + 1);
                        if (activeCount % 2 === 1) {
                            setActive(true);
                            setInactive(false);
                        } else {
                            setActive(false);
                        }
                    }}>Csak aktív bejegyzések</Button>
                <Button size="small" data-testid="inactive-posts-only" variant="contained" style={{
                    backgroundColor: inactive ? 'green' : '#dc3545',
                    color: 'white'
                }}
                    onClick={() => {
                        setInactiveCount(inactiveCount + 1);
                        if (inactiveCount % 2 === 1) {
                            setInactive(true);
                            setActive(false);
                        } else {
                            setInactive(false);
                        }
                    }}>Csak inaktív bejegyzések</Button>
            </Grid>
            <div className="p-3 content text-center m-auto" style={{ maxWidth: "1224px" }}>
                {sortedItems.filter(li =>
                    (hunSearch ? li.language.toLowerCase().includes("hungarian") : li.language.toLowerCase().includes(""))
                    && (active ? li.isActive.toLowerCase().includes("true") : li.isActive.toLowerCase().includes(""))
                    && (inactive ? li.isActive.toLowerCase().includes("false") : li.isActive.toLowerCase().includes(""))
                    && (li.id.toLowerCase().includes(search.toLowerCase()) ||
                        li.tag.toLowerCase().includes(search.toLowerCase()) ||
                        li.date.includes(search.toLowerCase()) ||
                        li.title.toLowerCase().includes(search.toLowerCase()) ||
                        li.description.toLowerCase().includes(search.toLowerCase()) ||
                        li.content.toLowerCase().includes(search.toLowerCase()))).length === 0 ?
                    <h5>Nincs találat!</h5> :
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
                                        <Button data-testid="sort-by-description-button" style={{ color: "white" }} onClick={() => requestSort('description')}
                                            className={getClassNamesFor('description')}>
                                            LEÍRÁS
                                            {getClassNamesFor('description') === "ascending" ? <FontAwesomeIcon icon={faSortUp} /> : ""}
                                            {getClassNamesFor('description') === "descending" ? <FontAwesomeIcon icon={faSortDown} /> : ""}
                                        </Button>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Button data-testid="sort-by-content-button" style={{ color: "white" }} onClick={() => requestSort('content')}
                                            className={getClassNamesFor('content')}>
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
                                        <Button data-testid="sort-by-date-button" style={{ color: "white" }} onClick={() => requestSort('date')} className={getClassNamesFor('date')}>
                                            DÁTUM
                                            {getClassNamesFor('date') === "ascending" ? <FontAwesomeIcon icon={faSortUp} /> : ""}
                                            {getClassNamesFor('date') === "descending" ? <FontAwesomeIcon icon={faSortDown} /> : ""}
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
                                    && (li.id.toLowerCase().includes(search.toLowerCase()) ||
                                        li.tag.toLowerCase().includes(search.toLowerCase()) ||
                                        li.date.includes(search.toLowerCase()) ||
                                        li.title.toLowerCase().includes(search.toLowerCase()) ||
                                        li.description.toLowerCase().includes(search.toLowerCase()) ||
                                        li.content.toLowerCase().includes(search.toLowerCase())))
                                    .map((post) => (
                                        <TableRow key={post?.id}>
                                            <TableCell align="center">{post?.id}</TableCell>
                                            <TableCell align="center">{post?.title}</TableCell>
                                            <TableCell align="center" >
                                                <textarea readOnly value={post?.description} className="form-control" rows="5" style={{ height: "150px", width: "150px" }} />
                                            </TableCell>
                                            <TableCell align="center">
                                                <CKEditor
                                                    editor={ClassicEditor}
                                                    data={post?.content}
                                                    disabled={true}
                                                    config={{
                                                        alignment: {
                                                            options: ['justify']
                                                        },
                                                        toolbar: []
                                                    }}
                                                    onReady={editor => {
                                                        editorRef.current = editor;
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
                                            <TableCell align="center" style={{ width: "150px" }}>{post?.date}</TableCell>
                                            <TableCell align="center">
                                                <Grid container
                                                    direction="column"
                                                    justifyContent="center"
                                                    alignItems="center">
                                                    <DeletePost post={post} isTabletOrMobile={isTabletOrMobile} />
                                                    <button data-testid="scroll-to-edit-post-button" className="btn btn-warning m-1"
                                                        style={{ width: "40px", height: "40px" }} onClick={() => {
                                                            setPostToBeEdited(post);
                                                            window.scrollTo(0, 64);
                                                        }}>
                                                        <FontAwesomeIcon icon={faPencilAlt} title="Szerkesztés" />
                                                    </button>
                                                    <DuplicatePost post={post} isTabletOrMobile={isTabletOrMobile} />
                                                    <ViewPost post={post} />
                                                </Grid>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                }
            </div>
        </>
    )
}

ShowAllPosts.propTypes = {
    allPosts: PropTypes.array.isRequired,
    isTabletOrMobile: PropTypes.bool.isRequired
};