import React, { Component } from "react";
import ReactDOM from "react-dom";
import { TitleBlock, DiagramEntity, DiagramInfo, DiagramValue } from "../model";
import { mxgraph } from "mxgraph";
import Toolbar from "../Toolbar/index";
import EditorComponent from "../EditorComponent/index";
import Restriction from "../Restriction/index";
import Info from "../Info/index";
import "./style.css";
import { Grid } from "@material-ui/core";

interface TemplateProps {
  graph: mxGraph;
  toolbar: mxToolbar;
  value: (id: string) => any;
  title: string;
  icon: string;
  style: string;
  width: number;
  height: number;
  type: string;
  location: any;
}

interface TemplateState {
  diagramInfo: DiagramInfo;
}

export default class TemplateEditor extends React.Component<TemplateProps, TemplateState> {
  render() {
    debugger;
    const { location } = this.props;
    const { info } = location.state;
    const diagramInfo = { _id: "", _rev: "", label: info.label, description: info.description, type: info.type };

    return (
      <div className="editorContainer">
        <Grid container item xs={3} sm={3} spacing={0}>
          <Info label={info.label} description={info.description} />
        </Grid>
        <Grid container item xs={9} sm={9} spacing={0} direction="row">
          <EditorComponent diagramInfo={diagramInfo} location={location} />
        </Grid>
        <Grid container item sm={4} spacing={0}>
          <Restriction />{" "}
        </Grid>
      </div>
    );
  }
}
