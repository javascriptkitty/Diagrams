import { mxgraph } from "mxgraph";
// import { DatatypeShape, OwlClassShape } from '../mxgraph/OwlClassShape';
import { DiagramEntity, DiagramValue, DiagramInfo, DiagramAggregate } from "../models";

declare var require: any;

const mx: typeof mxgraph = require("mxgraph")({
  mxBasePath: "mxgraph"
});

function moveCellsIsOverlapping(
  cellGeometry: any,
  borderGeometry: any,
  currentCells: any,
  i: number,
  delta: number,
  graph: any
) {
  const cellMinX = cellGeometry.x;
  const cellMaxX = cellGeometry.x + cellGeometry.width;
  const cellMinY = cellGeometry.y;
  const cellMaxY = cellGeometry.y + cellGeometry.height;
  let didMove = false;
  let xDir = null;
  let yDir = null;

  if (cellMinX > borderGeometry.x && cellMinX < borderGeometry.x + borderGeometry.width) {
    xDir = "right";
  } else if (cellMaxX > borderGeometry.x && cellMaxX < borderGeometry.x + borderGeometry.width) {
    xDir = "left";
  }
  if (cellMinY > borderGeometry.y && cellMinY < borderGeometry.y + borderGeometry.height) {
    yDir = "up";
  } else if (cellMaxY > borderGeometry.y && cellMaxY < borderGeometry.y + borderGeometry.height) {
    yDir = "down";
  }
  if (xDir && yDir) {
    const deltaX = delta * (xDir === "right" ? 1 : -1);
    const deltaY = delta * (yDir === "up" ? -1 : 1);
    currentCells[i].geometry.x = cellGeometry.x + cellGeometry.width + deltaX;
    currentCells[i].geometry.y = cellGeometry.y + cellGeometry.height + deltaY;
    didMove = true;
  }
  if (didMove) {
    graph.getView().clear(currentCells[i], false, false);
    graph.getView().validate();
  }
}

function createVertex(
  style: string,
  x: number,
  y: number,
  width: number,
  height: number,
  type: string
): mxgraph.mxCell {
  const vertex = new mx.mxCell(type, new mx.mxGeometry(x, y, width, height), style);

  vertex.setVertex(true);
  vertex.setAttribute("type", type);
  return vertex;
}

export function configureToolbar(graph: mxgraph.mxGraph, container: any, diagramInfo: DiagramInfo): void {
  const toolbar = new mx.mxToolbar(container);

  // TODO
  //    toolbar.enabled = false;

  createToolbarItem(
    graph,
    toolbar,
    id => new DiagramEntity("e" + id),
    "Сущность",
    "../assets/images/vowl-owl-class.png",
    "shape=ellipse;",
    100,
    100,
    "Entity"
  );
  createToolbarItem(
    graph,
    toolbar,
    id => new DiagramValue("vd" + id),
    "Значение c ограничениями",
    "../assets/images/vowl-datatype.png",
    "shape=rectangle;fillColor=#fc3;",
    100,
    30,
    "Value"
  );
  if (diagramInfo.type === "ENTITY_CLASSIFIER") {
    createToolbarItem(
      graph,
      toolbar,
      id => new DiagramAggregate("a" + id),
      "агрегирующий блок",
      "../assets/images/vowl-owl-aggregate.png",
      "shape=rhombus",
      100,
      100,
      "Aggregate"
    );
  }
}

export function createToolbarItem(
  graph: mxgraph.mxGraph,
  toolbar: mxgraph.mxToolbar,
  value: (id: number) => any,
  title: string,
  icon: string,
  style: string,
  width: number,
  height: number,
  type: string
): void {
  // tslint:disable-next-line:no-shadowed-variable
  const handler = function(graph: mxgraph.mxGraph, evt: any, cell: mxgraph.mxCell, x: number, y: number) {
    graph.stopEditing(false);

    const vertex = createVertex(style, x, y, width, height, type);

    let valueId = 1;
    if (graph.getDefaultParent().children != null) {
      valueId = Math.max(...graph.getDefaultParent().children.map(v => +v.id)) + 1;
    }

    vertex.setValue(value(valueId));

    let currentCells = graph.getChildCells(graph.getDefaultParent(), true, false);

    let cellsGeo = [];

    const border = currentCells[0] && currentCells[0].value === "border" ? currentCells[0] : null;
    const borderType = border && border.getAttribute("type");
    const vertexType = vertex.getAttribute("type");

    let offset =
      border == null || borderType === "border-relation" || (borderType === "border-entity" && vertexType !== "Value")
        ? 0
        : 1;

    for (let i = offset; i < currentCells.length; i++) {
      cellsGeo.push(currentCells[i].getGeometry());
    }

    const vertexGeo = vertex.getGeometry();

    for (let i = 0; i < cellsGeo.length; i++) {
      const cell = cellsGeo[i];
      if (
        ((vertexGeo.x < cell.x && vertexGeo.x + vertexGeo.width > cell.x) ||
          (vertexGeo.x > cell.x && vertexGeo.x < cell.x + cell.width)) &&
        ((vertexGeo.y < cell.y && vertexGeo.y + vertexGeo.height > cell.y) ||
          (vertexGeo.y > cell.y && vertexGeo.y < cell.y + cell.height))
      ) {
        graph.removeCells([vertex], true);
      }
    }

    if (borderType === "border-entity") {
      const borderGeo = border.getGeometry();

      if (
        ((vertexGeo.x < borderGeo.x && vertexGeo.x + vertexGeo.width > borderGeo.x) ||
          (vertexGeo.x > borderGeo.x && vertexGeo.x < borderGeo.x + borderGeo.width)) &&
        ((vertexGeo.y < borderGeo.y && vertexGeo.y + vertexGeo.height > borderGeo.y) ||
          (vertexGeo.y > borderGeo.y && vertexGeo.y < borderGeo.y + borderGeo.height))
      ) {
        for (let i = 0; i < border.children.length; i++) {
          const geo = border.children[i].getGeometry();

          moveCellsIsOverlapping(vertexGeo, geo, border.children, i, 20, graph);
        }

        if (vertexType === "Value") {
          graph.addCell(vertex, border);

          graph.insertEdge(border, null, null, border.children[0], border.children[border.children.length - 1]);
          border.geometry.height += 5;
          border.geometry.width += 5;
        }

        for (let i = 1; i < currentCells.length; i++) {
          const cellGeometry = currentCells[i].getGeometry();
          moveCellsIsOverlapping(cellGeometry, currentCells[0].getGeometry(), currentCells, i, 50, graph);
        }
      } else {
        graph.addCell(vertex, graph.getDefaultParent());
      }
    } else {
      graph.addCell(vertex, graph.getDefaultParent());
    }
    graph.setSelectionCell(vertex);
  };

  const img = toolbar.addMode(title, icon, (evt: any, cell: mxgraph.mxCell) => {
    const pt = graph.getPointForEvent(evt);
    handler(graph, evt, cell, pt.x, pt.y);
  });
  img.classList.add("my-3");
  img.classList.add("mx-auto");
  img.classList.add("d-block");

  mx.mxUtils.makeDraggable(img, graph, handler);
}
