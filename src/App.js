import './App.css';
import { BrowserRouter, NavLink, Route, Redirect, Switch } from "react-router-dom";
import { Home } from "./pages/Home.jsx";
import { ViewPost } from "./pages/ViewPost.jsx";
import { HelmetProvider, Helmet } from "react-helmet-async";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <nav className="navbar sticky-top navbar-fixed navbar-expand-sm navbar-dark bg-dark mb-3">
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav">
              <li className="nav-item">
                <span className="nav-link">Blog app</span>
              </li>
              <li className="nav-item">
                <NavLink to={`/`} activeClassName="active">
                  <span className="nav-link">Bejegyzések</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/bejegyzes/:slug" exact component={ViewPost} />
          <Redirect to="/" />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
