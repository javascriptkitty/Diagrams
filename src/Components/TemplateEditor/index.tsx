import React, { Component } from "react";
import ReactDOM from "react-dom";
import { TitleBlock, DiagramEntity, DiagramInfo, DiagramValue } from "../model";
import { mxgraph } from "mxgraph";
import Toolbar from "../Toolbar/index";
import EditorComponent from "../Editor/index";
import Restriction from "../Restriction/index";
import Info from "../Info/index";
import "./style.css";

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
  constructor(props: TemplateProps) {
    super(props);
    this.state = {
      diagramInfo: { _id: "", _rev: "", label: "", description: "", type: undefined }
    };
  }
  componentDid() {
    const { info } = this.props.location.state;
    debugger;
    if (info) {
      this.setState({
        diagramInfo: { _id: "", _rev: "", label: info.label, description: info.description, type: info.type }
      });
    }
  }

  render() {
    debugger;
    return (
      <div className="editorContainer">
        <Info label={this.state.diagramInfo.label} description={this.state.diagramInfo.description} />
        <Toolbar {...this.props} />
        <EditorComponent diagramInfo={this.state.diagramInfo} />

        <Restriction />
      </div>
    );
  }
}
