import React, { Component } from "react";
import ReactDOM from "react-dom";
import { TitleBlock, DiagramEntity, DiagramAggregate, DiagramInfo, DiagramValue } from "../model";
import { mxgraph } from "mxgraph";
import { Grid } from "@material-ui/core";
import Toolbar from "../Toolbar";

declare var require: any;

const mx: typeof mxgraph = require("mxgraph")({
  mxBasePath: "mxgraph"
});

const { mxGraph, mxClient, mxUtils, mxEvent, mxConstants, mxToolbar, mxCell } = mx;

export interface DiagramElementListener {
  onVertexSelected(diagramInfo: DiagramInfo, element: mxCell): void;

  onEdgeSelected(diagramInfo: DiagramInfo, element: mxCell): void;

  onCellDeselected(): void;
}

interface EditorProps {
  diagramInfo: DiagramInfo;
  location: any;
}

interface EditorState {
  type?: string;
  isClassifier?: Boolean;
  graph: mxgraph.mxGraph;
  cell: mxgraph.mxCell;
}

export default class EditorComponent extends React.Component<EditorProps, EditorState> {
  graph: mxgraph.mxGraph;

  constructor(props: EditorProps) {
    super(props);
    this.state = { type: "", isClassifier: false, graph: null, cell: null };
    this.loadGraph = this.loadGraph.bind(this);
  }

  componentDidMount() {
    this.loadGraph();
    // this.configureMouseHandler(this.diagramInfo, this.graph);
  }

  loadGraph() {
    const container = ReactDOM.findDOMNode(this.refs.divGraph);
    console.log(container);

    // Checks if the browser is supported
    if (!mxClient.isBrowserSupported()) {
      // Displays an error message if the browser is not supported.
      mxUtils.error("Browser is not supported!", 200, false);
    } else {
      // Disables the built-in context menu
      mxEvent.disableContextMenu(container);

      // Creates the graph inside the given container

      debugger;
      const graph = new mxGraph(container as Element);
      this.graph = graph;
      this.setState({ graph });

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
      vertexStyle[mxConstants.STYLE_STROKEWIDTH] = 1;
      vertexStyle[mxConstants.STYLE_STROKECOLOR] = "#000";

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

        let border;
        let shape1;

        border = this.state.isClassifier
          ? (border = graph.insertVertex(
              parent,
              null,
              new TitleBlock(),
              150,
              70,
              390,
              140,
              "rounded=1;fillColor=white;movable=0;deletable=0;noLabel=1"
            ))
          : null;

        shape1 = this.state.isClassifier
          ? graph.insertVertex(
              border,
              null,
              new DiagramEntity(),
              30,
              20,
              100,
              100,
              "shape=ellipse;movable=0;deletable=0; "
            )
          : null;

        if (this.state.isClassifier) {
          border.value.id = "tb";
          border.value.geometry = {
            x: border.geometry.x,
            y: border.geometry.y,
            width: border.geometry.width,
            height: border.geometry.height,
            parent: undefined
          };

          shape1.value.id = "te1";
          shape1.value.geometry = {
            x: shape1.geometry.x,
            y: shape1.geometry.y,
            width: shape1.geometry.width,
            height: shape1.geometry.height,
            parent: "border"
          };
        }

        let shape2;
        shape2 =
          this.state.type == "RELATION_CLASSIFIER"
            ? graph.insertVertex(
                border,
                null,
                new DiagramValue(),
                240,
                55,
                DatatypeShape.DEFAULT_WIDTH,
                DatatypeShape.DEFAULT_HEIGHT,
                "shape=vowl-datatype;movable=0;deletable=0;"
              )
            : null;
        // shape1.type = "title-entity";
        if (shape2) {
          // shape2.type = "title-value";
          shape2.value.id = "tv1";
          shape2.value.geometry = {
            x: shape2.geometry.x,
            y: shape2.geometry.y,
            width: shape2.geometry.width,
            height: shape2.geometry.height,
            parent: "border"
          };

          graph.insertEdge(border, "var", null, shape1, shape2);
        }
      } finally {
        //data
        // Updates the display
        graph.getModel().endUpdate();
      }
    }
  }

  configureKeyHandler(graph: mxGraph, listener: DiagramElementListener): void {
    const handler = new mxKeyHandler(graph);

    /**
     * Deletes selected cells on `Delete`.
     */
    handler.bindKey(46, () => {
      if (graph.isEnabled()) {
        listener.onCellDeselected();

        graph.removeCells(null, true);
      }
    });
  }

  configureMouseHandler(diagramInfo: DiagramInfo, graph: mxGraph, listener: DiagramElementListener): void {
    //if (!graphMouseConfigured) {

    graph.addMouseListener({
      mouseDown(sender: any, evt: mxMouseEvent) {
        const cell = evt.getCell();

        if (cell == null) {
          listener.onCellDeselected();
        } else if (cell.isVertex()) {
          listener.onVertexSelected(diagramInfo, cell);
        } else if (cell.isEdge()) {
          listener.onEdgeSelected(diagramInfo, cell);
        }
      },
      mouseMove(sender: any, evt: mxMouseEvent) {},

      mouseUp(sender: any, evt: mxMouseEvent) {}
    });
    //@ts-ignore
    graph.addListener(mxEvent.CELLS_ADDED, function(sender, evt) {
      if (evt.properties.parent.children.length > 1 && !(evt.properties.parent.value instanceof TitleBlock)) {
        const cellsGeo = graph.getChildCells(graph.getDefaultParent(), true, false).map((cell: mxCell) => {
          return cell.getGeometry();
        });

        const vertexGeo = evt.properties.cells[0].getGeometry();
        for (let i = 0; i < cellsGeo.length; i++) {
          const cell = cellsGeo[i];
          if (
            ((vertexGeo.x < cell.x && vertexGeo.x + vertexGeo.width > cell.x) ||
              (vertexGeo.x > cell.x && vertexGeo.x < cell.x + cell.width)) &&
            ((vertexGeo.y < cell.y && vertexGeo.y + vertexGeo.height > cell.y) ||
              (vertexGeo.y > cell.y && vertexGeo.y < cell.y + cell.height))
          ) {
            graph.removeCells([evt.properties.cells[0]], true);
          }
        }
      }
    });
    //@ts-ignore
    graph.addListener(mxEvent.ADD_CELLS, function(sender, evt) {
      if (evt.properties.parent.value instanceof TitleBlock && evt.properties.parent.children.length > 1) {
        debugger;
        const borderGeo = evt.properties.parent.getGeometry();
        const vertexGeo = evt.properties.cells[0].getGeometry();
        const d = 30;
        const borderXmin = borderGeo.x + d;
        const borderXmax = borderGeo.x + borderGeo.width - d;
        const borderYmin = borderGeo.y + d;
        const borderYmax = borderGeo.y + borderGeo.height - d;
        const vertexXmin = vertexGeo.x + borderGeo.x;
        const vertexXmax = vertexGeo.x + vertexGeo.width + borderGeo.x;
        const vertexYmin = vertexGeo.y + borderGeo.y;
        const vertexYmax = vertexGeo.y + vertexGeo.height + borderGeo.y;
        if (vertexXmax >= borderXmax && vertexXmax <= borderGeo.x + borderGeo.width) {
          borderGeo.width = borderGeo.width + d;
        }
        if (vertexYmax > borderYmax && vertexYmax < borderGeo.y + borderGeo.height) {
          borderGeo.height = borderGeo.height + d;
        }
        if (vertexXmin < borderXmin && vertexXmin > borderGeo.x) {
          borderGeo.x = borderGeo.x - d;
          borderGeo.width = borderGeo.width + d;
          // mxVertexHandler.prototype.moveChildren(evt.properties.parent, 20, 0);
        }
        if (vertexYmin > borderGeo.y && vertexYmin < borderYmin) {
          borderGeo.y = vertexYmin - d;
          borderGeo.height = borderGeo.height + d;
        }
      }
    });
    //@ts-ignore
    graph.addListener(mxEvent.RESIZE_END, function(sender, evt) {});
  }

  onCellValueChanged(event: { cell: mxgraph.mxCell; value: any }): void {
    const model = this.graph.getModel();
    model.beginUpdate();
    model.setValue(event.cell, event.value);
    if (event.cell.edges) {
      for (let i = 0; i < event.cell.edges.length; i++) {
        const cell = event.cell.edges[i].target;
        // if (cell.type == "title-entity" && cell.parent.value.type == "border-relation") {
        //   event.cell.edges[i].target.value.restriction = event.value.restriction;
        //   model.setValue(event.cell.edges[i].target, event.cell.edges[i].target.value);
        // }
      }
    }
    model.endUpdate();
  }

  render() {
    const { info } = this.props.location.state;

    const diagramInfo = { _id: "", _rev: "", label: info.label, description: info.description, type: info.type };

    return (
      <div style={{ margin: "15px", display: "flex", height: "100vh" }}>
        {this.state.graph && <Toolbar graph={this.state.graph} location={this.props.location} />}

        <div className="graphContainer" ref="divGraph" id="divGraph" />
      </div>
    );
  }
}
