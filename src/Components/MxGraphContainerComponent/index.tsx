import React, { createRef } from "react";

import { mxgraph } from "mxgraph";
import { configureGraph, renderDiagram, DiagramElementListener, createTitleBlock } from "../../mxgraph/editor";
import { configureToolbar } from "../../mxgraph/toolbar";
import { Diagram, DiagramInfo, DiagramValue } from "../../models";
import "./style.css";

declare var require: any;

const mx: typeof mxgraph = require("mxgraph")({
  mxBasePath: "mxgraph"
});

interface MxGraphContainerComponentProps {
  listener: DiagramElementListener;
  diagramInfo: DiagramInfo;
  diagram: Diagram;
}

export default class MxGraphContainerComponent extends React.Component<MxGraphContainerComponentProps> {
  private toolbarRef: React.RefObject<HTMLDivElement> = createRef();
  private editorRef: React.RefObject<HTMLDivElement> = createRef();

  private graph: mxgraph.mxGraph;

  componentDidMount() {
    const { diagram, diagramInfo, listener } = this.props;
    this.graph = new mx.mxGraph(this.editorRef.current);

    const isClassifier = false;

    configureToolbar(this.graph, this.toolbarRef.current, diagramInfo);
    configureGraph(this.graph, isClassifier, diagramInfo, listener);
    renderDiagram(this.graph, diagram);
    if (isClassifier) {
      createTitleBlock(this.graph, diagramInfo);
    }
  }

  render() {
    const toolbarStyle = {
      height: this.props.diagramInfo.type === "ENTITY_CLASSIFIER" ? 140 : 90
    };
    return (
      <div className="mxgraph-container">
        <div ref={this.toolbarRef} className="mxgraph-toolbar" style={toolbarStyle} />
        <div ref={this.editorRef} className="mxgraph-editor" />
      </div>
    );
  }
}
