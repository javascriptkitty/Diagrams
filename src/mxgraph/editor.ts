import { mxgraph } from "mxgraph";

import { DatatypeShape, OwlClassShape } from "./OwlClassShape";
import { Diagram, DiagramInfo, DiagramValue, DiagramEntity } from "../models";

declare var require: any;

const mx: typeof mxgraph = require("mxgraph")({
  mxBasePath: "mxgraph"
});

export interface DiagramElementListener {
  onVertexSelected(diagramInfo: DiagramInfo, element: mxgraph.mxCell): void;

  onEdgeSelected(diagramInfo: DiagramInfo, element: mxgraph.mxCell): void;

  onCellDeselected(): void;
}

function configureKeyHandler(graph: mxgraph.mxGraph, listener: DiagramElementListener): void {
  const handler = new mx.mxKeyHandler(graph);

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

function configureMouseHandler(
  diagramInfo: DiagramInfo,
  graph: mxgraph.mxGraph,
  listener: DiagramElementListener
): void {
  //if (!graphMouseConfigured) {

  graph.addMouseListener({
    mouseDown(sender: any, evt: mxgraph.mxMouseEvent) {
      const cell = evt.getCell();

      if (cell == null) {
        listener.onCellDeselected();
      } else if (cell.isVertex()) {
        listener.onVertexSelected(diagramInfo, cell);
      } else if (cell.isEdge()) {
        listener.onEdgeSelected(diagramInfo, cell);
      }
    },
    mouseMove(sender: any, evt: mxgraph.mxMouseEvent) {},

    mouseUp(sender: any, evt: mxgraph.mxMouseEvent) {}
  });
}

export function configureEventHandlers(
  graph: mxgraph.mxGraph,
  diagramInfo: DiagramInfo,
  listener: DiagramElementListener
) {
  configureKeyHandler(graph, listener);
  configureMouseHandler(diagramInfo, graph, listener);
}

export function configureGraph(
  graph: mxgraph.mxGraph,
  isClassifier: boolean,
  diagramInfo: DiagramInfo,
  eventHandlers: any
): void {
  configureEventHandlers(graph, diagramInfo, eventHandlers);

  graph.gridSize = 20;
  graph.setHtmlLabels(true);
  graph.isCellEditable = (cell: mxgraph.mxCell) => false;
  graph.setConnectable(true);
  graph.setMultigraph(false);
  graph.setPanning(false);
  graph.setAllowDanglingEdges(false);
  graph.setAutoSizeCells(true);

  //  validation

  graph.isValidSource = (cell: mxgraph.mxCell) => {
    // for INDICATORS
    if (cell.isVertex() && cell.value != null && cell.value instanceof DiagramValue && !isClassifier) {
      return false;
    }

    return mx.mxGraph.prototype.isValidSource.call(graph, cell);
  };

  graph.isValidTarget = (cell: mxgraph.mxCell) => {
    //
    if (cell.value === "border") {
      return false;
    }
    const cellType = cell.getAttribute("type");
    const parentCellType = cell.getAttribute("type");
    if (cellType === "title-entity" && parentCellType === "border-relation" && cell.edges.length > 1) {
      return false;
    }

    if (cell.isVertex() && cell.value != null && cell.value instanceof DiagramValue) {
      return cell.getEdgeCount() <= 0;
    }

    return mx.mxGraph.prototype.isValidTarget.call(graph, cell);
  };

  const vertexStyle = graph.getStylesheet().getDefaultVertexStyle();
  vertexStyle[mx.mxConstants.STYLE_FONTSIZE] = 12;
  vertexStyle[mx.mxConstants.STYLE_FONTCOLOR] = "#000";
  vertexStyle[mx.mxConstants.STYLE_RESIZABLE] = 0;
  vertexStyle[mx.mxConstants.STYLE_WHITE_SPACE] = "wrap";
  vertexStyle[mx.mxConstants.STYLE_SPACING] = 4;
  vertexStyle[mx.mxConstants.STYLE_STROKEWIDTH] = 1;
  vertexStyle[mx.mxConstants.STYLE_STROKECOLOR] = "#000";

  const edgeStyle = graph.getStylesheet().getDefaultEdgeStyle();
  edgeStyle[mx.mxConstants.STYLE_FONTSIZE] = 12;
  edgeStyle[mx.mxConstants.STYLE_FONTCOLOR] = "#000";
  edgeStyle[mx.mxConstants.STYLE_LABEL_BORDERCOLOR] = "#acf";
  edgeStyle[mx.mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = "#acf";
  edgeStyle[mx.mxConstants.STYLE_STROKEWIDTH] = 2;
  edgeStyle[mx.mxConstants.STYLE_STROKECOLOR] = "#000";
  edgeStyle[mx.mxConstants.STYLE_RESIZABLE] = 0;
}

export function renderDiagram(graph: mxgraph.mxGraph, diagram: Diagram): void {
  const layout = new mx.mxCircleLayout(graph, 150);

  // Adds cells to the model in a single step
  graph.getModel().beginUpdate();
  try {
    const parent = graph.getDefaultParent();

    let previous = graph.model.getStyle;
    graph.model.getStyle = function(cell) {
      if (cell != null) {
        var style = previous.apply(this, [cell]);

        const parentCellType = this.isEdge(cell) && cell.parent.getAttribute("type");

        if (parentCellType === "border-entity") {
          var target = this.getTerminal(cell, false);

          const targetType = target != null && target.getAttribute("type");
          if (targetType === "Value") {
            style += ";labelBackgroundColor=lightgreen";
          }
        }

        return style;
      }

      return null;
    };

    const vertexes: { [key: string]: any } = {};

    diagram.entities.forEach(entity => {
      vertexes[entity.id] = graph.insertVertex(parent, null, entity, null, null, 100, 100, "shape=ellipse;");
    });

    diagram.values.forEach(vertex => {
      let cell = graph.insertVertex(parent, null, vertex, null, null, 100, 30, "shape=rectangle;fillColor=#fc3;");

      vertexes[vertex.id] = cell;
    });

    diagram.relations.forEach(relation => {
      graph.insertEdge(
        parent,
        null,
        relation,
        vertexes[relation.sourceId],
        vertexes[relation.targetId],
        "verticalAlign=bottom;verticalLabelPosition=top;"
      );
    });

    layout.execute(parent);
  } finally {
    // Updates the display
    graph.getModel().endUpdate();
  }
}

// function createTitleBlock() {
//   const parent = this.graph.getDefaultParent();
//   let border;
//   let shape1;
//   const borderWidth = this.type == "RELATION_CLASSIFIER" ? 390 : 300;

//   border = this.isClassifier
//     ? (border = this.graph.insertVertex(
//         parent,
//         null,
//         new TitleBlock(),
//         120,
//         70,
//         borderWidth,
//         140,
//         "rounded=1;fillColor=white;movable=0;deletable=0;noLabel=1"
//       ))
//     : null;

//   shape1 = this.isClassifier
//     ? this.graph.insertVertex(
//         border,
//         null,
//         new DiagramEntity(),
//         30,
//         20,
//         100,
//         100,
//         "shape=ellipse;movable=0;deletable=0; "
//       )
//     : null;

//   if (this.isClassifier) {
//     border.value.id = "tb";
//     border.value.geometry = {
//       x: border.geometry.x,
//       y: border.geometry.y,
//       width: border.geometry.width,
//       height: border.geometry.height,
//       parent: undefined
//     };

//     shape1.value.id = "te1";
//     shape1.value.geometry = {
//       x: shape1.geometry.x,
//       y: shape1.geometry.y,
//       width: shape1.geometry.width,
//       height: shape1.geometry.height,
//       parent: "border"
//     };
//   }

//   let shape2;
//   shape2 =
//     this.type == "RELATION_CLASSIFIER"
//       ? this.graph.insertVertex(
//           border,
//           null,
//           new DiagramValue(),
//           240,
//           55,
//           DatatypeShape.DEFAULT_WIDTH,
//           DatatypeShape.DEFAULT_HEIGHT,
//           "shape=vowl-datatype;movable=0;deletable=0;"
//         )
//       : null;
//   shape1.value.type = "title-entity";
//   if (shape2) {
//     shape2.value.type = "title-value";
//     shape2.value.id = "tv1";
//     shape2.value.geometry = {
//       x: shape2.geometry.x,
//       y: shape2.geometry.y,
//       width: shape2.geometry.width,
//       height: shape2.geometry.height,
//       parent: "border"
//     };

//     this.graph.insertEdge(border, "var", null, shape1, shape2);
//   }
// }
