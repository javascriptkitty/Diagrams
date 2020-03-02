import React, { Component } from "react";
import ReactDOM from "react-dom";
import { TitleBlock, DiagramEntity } from "../model";
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
  title: string;
  description: string;
  type: string;
}

export default class TemplateEditor extends React.Component<TemplateProps, TemplateState> {
  constructor(props: TemplateProps) {
    super(props);
    this.state = {
      title: "",
      description: "",
      type: ""
    };
  }
  componentDidMount() {
    const { info } = this.props.location.state;
    console.log(info);
    if (info) {
      this.setState({ title: info.title, description: info.description, type: info.type });
    }
  }

  render() {
    return (
      <div className="editorContainer">
        <Info title={this.state.title} description={this.state.description} />
        <Toolbar {...this.props} />
        <EditorComponent />

        <Restriction />
      </div>
    );
  }
}
