import './App.css';
import { BrowserRouter, NavLink, Route, Redirect, Switch } from "react-router-dom";
import { Home } from "./pages/Home.jsx";

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar sticky-top navbar-fixed navbar-expand-sm navbar-dark bg-dark mb-3">
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink to={`/`} activeClassName="active">
                <span className="nav-link">Home</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
      <Switch>
        <Route path="/" exact component={Home} />
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
