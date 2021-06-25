import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Spinner } from "./Spinner";
import axios from "axios";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { uuidv4 } from "./IDGenerator.jsx";

export function CreatePost() {
    const [isPending, setPending] = useState(false);
    const history = useHistory();

    if (isPending) {
        return <Spinner />
    }

    return (
        <div className="p-3 content text-center m-auto" style={{ width: "1000px" }}>
            <Helmet>
                <title>Bejegyzés létrehozása</title>
                <meta name="description" content="Bejegyzés létrehozása" />
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
                <h2>Bejegyzés létrehozása</h2>
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        setPending(true);
                        const data = {
                            id: uuidv4(),
                            title: e.target.elements.title.value,
                            slug: e.target.elements.slug.value,
                            description: e.target.elements.description.value,
                            content: e.target.elements.content.value,
                            imgURL: e.target.elements.imgURL.value,
                            tag: e.target.elements.tag.value
                        };
                        axios.post('http://localhost:4000/posts', data)
                            .catch(error => {
                                console.error('Hiba!', error);
                            });
                        setPending(false);
                        history.push("/posts");
                    }}
                ></form>
                <div className="form-group row pb-3 p-3">
                    <label>Cím</label>
                    <input type="text" className="form-control" name="title" placeholder="Cím" />
                </div>
                <div className="form-group row pb-3 p-3">
                    <label>Szöveges azonosító</label>
                    <input type="text" className="form-control" name="slug" placeholder="Szöveges azonosító" />
                </div>
                <div className="form-group row pb-3 p-3">
                    <label>Leírás</label>
                    <input type="text" className="form-control" name="description" placeholder="Leírás" />
                </div>
                <div className="form-group row pb-3 p-3">
                    <label>Tartalom</label>
                    <input type="text" className="form-control" name="content" placeholder="Tartalom" />
                </div>
                <div className="form-group row pb-3 p-3">
                    <label>Kép URL</label>
                    <input type="text" className="form-control" name="imgURL" placeholder="Kép URL" />
                </div>
                <div className="form-group row pb-3 p-3">
                    <label>Címke</label>
                    <input type="text" className="form-control" name="tag" placeholder="Címke" />
                </div>
                <div className="m-auto form-group row">
                    <button type="submit" className="btn btn-primary" style={{ width: "100px", height: "40px" }}>Küldés</button>
                    <button className="btn btn-warning" style={{ width: "100px", height: "40px" }} onClick={() => {
                        history.push("/posts")
                    }}>Vissza</button>
                </div>
            </motion.div>
        </div>
    )
}