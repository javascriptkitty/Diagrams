import React, { Component } from "react";
import ReactDOM from "react-dom";
import { TitleBlock, DiagramEntity } from "../model";
import { mxgraph } from "mxgraph";

declare var require: any;

const mx: typeof mxgraph = require("mxgraph")({
  mxBasePath: "mxgraph"
});

const { mxGraph, mxClient, mxUtils, mxEvent, mxConstants } = mx;

export default class TemplateEditorComponent extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {};
    this.LoadGraph = this.LoadGraph.bind(this);
  }

  componentDidMount() {
    this.LoadGraph();
  }

  LoadGraph() {
    var container = ReactDOM.findDOMNode(this.refs.divGraph);
    console.log(container);
    var zoomPanel = ReactDOM.findDOMNode(this.refs.divZoom);

    // Checks if the browser is supported
    if (!mxClient.isBrowserSupported()) {
      // Displays an error message if the browser is not supported.
      mxUtils.error("Browser is not supported!", 200, false);
    } else {
      // Disables the built-in context menu
      mxEvent.disableContextMenu(container);

      // Creates the graph inside the given container
      const graph = new mxGraph(container as Element);

      // Gets the default parent for inserting new cells. This is normally the first
      // child of the root (ie. layer 0).
      const parent = graph.getDefaultParent();

      // Enables tooltips, new connections and panning
      graph.gridSize = 20;
      graph.setHtmlLabels(true);
      graph.isCellEditable = cell => false;
      graph.setConnectable(true);
      graph.setMultigraph(false);
      graph.setPanning(false);
      graph.setAllowDanglingEdges(false);
      graph.setAutoSizeCells(true);

      const vertexStyle = graph.getStylesheet().getDefaultVertexStyle();
      vertexStyle[mxConstants.STYLE_FONTSIZE] = 12;
      vertexStyle[mxConstants.STYLE_FONTCOLOR] = "#000";
      vertexStyle[mxConstants.STYLE_RESIZABLE] = 0;
      vertexStyle[mxConstants.STYLE_WHITE_SPACE] = "wrap";
      vertexStyle[mxConstants.STYLE_SPACING] = 4;

      const edgeStyle = graph.getStylesheet().getDefaultEdgeStyle();
      edgeStyle[mxConstants.STYLE_FONTSIZE] = 12;
      edgeStyle[mxConstants.STYLE_FONTCOLOR] = "#000";
      edgeStyle[mxConstants.STYLE_LABEL_BORDERCOLOR] = "#acf";
      edgeStyle[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = "#acf";
      edgeStyle[mxConstants.STYLE_STROKEWIDTH] = 2;
      edgeStyle[mxConstants.STYLE_STROKECOLOR] = "#000";
      edgeStyle[mxConstants.STYLE_RESIZABLE] = 0;

      graph.getModel().beginUpdate();
      try {
        //mxGrapg component
        var doc = mxUtils.createXmlDocument();
        var node = doc.createElement("Node");
        node.setAttribute("ComponentID", "[P01]");

        var border = graph.insertVertex(
          parent,
          null,
          new TitleBlock(),
          150,
          70,
          390,
          140,
          "rounded=1;strokeColor=black;fillColor=white;movable=0;deletable=0;noLabel=1;"
        );

        const shape1 = graph.insertVertex(
          border,
          null,
          new DiagramEntity(),
          30,
          20,
          100,
          100,
          "shape=ellipse;movable=0;deletable=0; "
        );
        shape1.value.id = "te1";
        shape1.value.geometry = {
          x: shape1.geometry.x,
          y: shape1.geometry.y,
          width: shape1.geometry.width,
          height: shape1.geometry.height,
          parent: "border"
        };
      } finally {
        //data
        // Updates the display
        graph.getModel().endUpdate();
      }
    }
  }
  render() {
    return <div className="graph-container" ref="divGraph" id="divGraph" />;
  }
}
