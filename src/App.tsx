import React from "react";
import TemplateEditorComponent from "./Components/MxGraphEditor/MxGraphEditor";
import { Container, AppBar, Tabs, Tab } from "@material-ui/core";
import "./App.css";
import SimpleTabs from "./Components/MUI/SimpleTabs/SimpleTabs";

function App() {
  return (
    <Container>
      <SimpleTabs />
      {/* <AppBar position="static">
      <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
    <Tab label="Item One" {...a11yProps(0)} />
    <Tab label="Item Two" {...a11yProps(1)} />
    <Tab label="Item Three" {...a11yProps(2)} />
  </Tabs>
        </AppBar> */}
      <TemplateEditorComponent />
    </Container>
  );
}

export default App;
