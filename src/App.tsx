import React from "react";
import CreateNew from "./components/CreateNew";
import { Container } from "@material-ui/core";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SimpleTabs from "./components/MUI/SimpleTabs";
import TemplateEditor from "./components/TemplateEditor";

function App() {
  return (
    <Container>
      <Router>
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
