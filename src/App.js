import React, { Component } from 'react';
import './App.css';
import Home from './home'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import Admin_dashboard from './admin/admin_nav_side';
import adminLogin from './admin/adminLogin';
import pageNotFound from './404';


export class App extends Component {
  componentDidMount() {
    console.log = () => { };
    console.warn = console.error = () => { };
  }
  render() {
    return (
      <div>
        <Router>
          <div className="container">
            <Switch>
              <Route  path="/Admin/login" component={adminLogin}>
              </Route>
              <Route path="/Admin">
                <Admin_dashboard />
              </Route>
              <Route exact path="/">
                <Home />
              </Route>
              {/* <Route component={pageNotFound} /> */}

            </Switch>
          </div>

        </Router >
      </div >
    )
  }
}

export default App

