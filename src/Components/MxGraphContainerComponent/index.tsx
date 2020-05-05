import React, { createRef } from "react";

import { mxgraph } from "mxgraph";
import {
  configureGraph,
  renderDiagram,
  DiagramElementListener,
  createTitleBlock,
  getDiagramFromGraph,
  onCellValueChanged
} from "../../mxgraph/editor";
import { configureToolbar } from "../../mxgraph/toolbar";
import { Diagram, DiagramInfo } from "../../models";
import "./style.css";

declare var require: any;

const mx: typeof mxgraph = require("mxgraph")({
  mxBasePath: "mxgraph"
});

interface MxGraphContainerComponentProps {
  listener: DiagramElementListener;
  diagramInfo: DiagramInfo;
  diagram: Diagram;
  cellValueChanged: { cell: mxgraph.mxCell; value: any };
  updateDiagram: Function;
  diagramFromGraph: boolean;
}

export default class MxGraphContainerComponent extends React.Component<MxGraphContainerComponentProps> {
  private toolbarRef: React.RefObject<HTMLDivElement> = createRef();
  private editorRef: React.RefObject<HTMLDivElement> = createRef();

  private graph: mxgraph.mxGraph;

  updateDiagram() {
    debugger;
    const newDiagram = getDiagramFromGraph(this.graph, this.props.diagram);
    this.props.updateDiagram(newDiagram);
  }
  componentDidMount() {
    const { diagramInfo, diagram, listener } = this.props;
    this.graph = new mx.mxGraph(this.editorRef.current);

    const isClassifier = diagramInfo.type === "INDICATOR" ? false : true;

    configureToolbar(this.graph, this.toolbarRef.current, diagramInfo);
    configureGraph(this.graph, isClassifier, diagramInfo, listener);
    renderDiagram(this.graph, diagram);
    if (isClassifier) {
      // if (
      //   (diagramInfo.type == "RELATION_CLASSIFIER" &&
      //     diagram.entities.length == 0 &&
      //     diagram.values.length == 0 &&
      //     diagram.titleBlock.length == 0) ||
      //   (diagramInfo.type == "ENTITY_CLASSIFIER" &&
      //     diagram.entities.length == 0 &&
      //     diagram.values.length == 0 &&
      //     diagram.titleBlock.length == 0 &&
      //     diagram.aggregate.length == 0)
      // )
      createTitleBlock(this.graph, diagramInfo);
    }
  }

  componentWillReceiveProps(nextProps) {
    debugger;
    if (nextProps.cellValueChanged && nextProps.cellValueChanged.cell != null) {
      // this.updateDiagram();
      onCellValueChanged(nextProps.cellValueChanged, this.graph);
    }
  }

  render() {
    console.log(this.props.listener);
    const toolbarStyle = {
      height: this.props.diagramInfo.type === "ENTITY_CLASSIFIER" ? 140 : 90
    };
    if (this.props.diagramFromGraph) {
      debugger;
      this.updateDiagram();
    }
    return (
      <div className="mxgraph-container">
        <div ref={this.toolbarRef} className="mxgraph-toolbar" style={toolbarStyle} />
        <div ref={this.editorRef} className="mxgraph-editor" />
      </div>
    );
  }
}
