import React from "react";
import CreateNew from "./Components/CreateNew";
import MxGraphEditor from "./Components/MxGraphEditor";

import { Container } from "@material-ui/core";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SimpleTabs from "./Components/MUI/SimpleTabs";

function App() {
  return (
    <Container>
      <Router>
        <Switch>
          <Route path="/:type/new" component={CreateNew} />

          <Route path="/indicators/:id" component={MxGraphEditor} />
          <Route path="/classifiers/:id" component={MxGraphEditor} />
          <Route path="/" component={SimpleTabs} />
        </Switch>
      </Router>
    </Container>
  );
}

export default App;
