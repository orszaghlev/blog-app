import './App.css';
import { BrowserRouter, NavLink, Route, Redirect, Switch } from "react-router-dom";
import { Home } from "./components/Home.jsx";
import { ViewPost } from "./components/ViewPost.jsx";
import { CreatePost } from "./components/CreatePost.jsx";
import { EditPost } from "./components/EditPost.jsx";
import { Helmet } from "react-helmet-async";

function App() {
  return (
    <div className="App">
      <Helmet>
        <title>Blog alkalmazás</title>
        <meta name="description" content="Blog alkalmazás" />
      </Helmet>
      <BrowserRouter>
        <nav className="navbar sticky-top navbar-fixed navbar-expand-sm navbar-dark bg-dark mb-3">
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav">
              <li className="nav-item">
                <span className="nav-link">Blog alkalmazás</span>
              </li>
              <li className="nav-item">
                <NavLink to={`/posts`} activeClassName="active">
                  <span className="nav-link">Bejegyzések</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to={`/create-post`} activeClassName="active">
                  <span className="nav-link">Bejegyzés létrehozása</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/posts" exact component={Home} />
          <Route path="/posts/:id" component={ViewPost} />
          <Route path="/create-post" component={CreatePost} />
          <Route path="/edit-post/:id" component={EditPost} />
          <Redirect to="/" />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
