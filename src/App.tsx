import React from "react";
import CreateNew from "./components/CreateNew";
import { Container, AppBar, Toolbar, Typography } from "@material-ui/core";
import "./App.css";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import SimpleTabs from "./components/MUI/SimpleTabs";
import TemplateEditor from "./components/TemplateEditor";

function App() {
  return (
    <Container>
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">
              {" "}
              <Link to="/">AMAZING DIAGRAMS</Link>
            </Typography>
          </Toolbar>
        </AppBar>
        <Switch>
          <Route path="/:type/new" component={CreateNew} />
          <Route path="/diagrams/:id" component={TemplateEditor} />
          <Route path="/indicators/:id" component={TemplateEditor} />
          <Route path="/classifiers/:id" component={TemplateEditor} />
          <Route path="/" component={SimpleTabs} />
        </Switch>
      </Router>
    </Container>
  );
}

export default App;
