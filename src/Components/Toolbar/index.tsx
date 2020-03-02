import React, { Component, createRef } from "react";
import { createVertex } from "../mxgraphUtils";
import { DiagramEntity, DiagramValue, DiagramAggregate } from "../model";
import { mxgraph } from "mxgraph";
import { Grid } from "@material-ui/core";

declare var require: any;

const mx: typeof mxgraph = require("mxgraph")({
  mxBasePath: "mxgraph"
});

const { mxUtils, mxToolbar } = mx;

function configureToolbar(graph: mxGraph, container: any, type: string) {
  const toolbar = new mxToolbar(container);

  //@ts-ignore
  toolbar.enabled = false;
  createToolbarItem(
    graph,
    //@ts-ignore
    toolbar,
    (id: string) => new DiagramEntity("e" + id),
    "Сущность",
    "../../assets/images/vowl-owl-class.png",
    "shape=ellipse;",
    100,
    100,
    "Entity"
  );
  createToolbarItem(
    graph,
    //@ts-ignore
    toolbar,
    (id: string) => new DiagramValue("vd" + id),
    "Значение c ограничениями",
    "../../assets/images/vowl-datatype.png",
    "shape=rectangle;",
    100,
    30,
    "notEntity"
  );

  const aggregateEl =
    type === "ENTITY_CLASSIFIER"
      ? createToolbarItem(
          graph,
          //@ts-ignore
          toolbar,
          (id: string) => new DiagramAggregate("a" + id),
          "агрегирующий блок",
          "../../assets/images/vowl-owl-aggregate.png",
          "shape=rhombus;strokeColor=black",
          100,
          100,
          "Aggregate"
        )
      : null;
}

function createToolbarItem(
  graph: mxGraph,
  toolbar: mxToolbar,
  value: any,
  title: string,
  icon: string,
  style: string,
  width: number,
  height: number,
  type: string
) {
  // debugger;
  // tslint:disable-next-line:no-shadowed-variable
  const handler = function(graph: mxGraph, evt: mxMouseEvent, cell: mxCell, x: number, y: number) {
    graph.stopEditing(false);
    const vertex = createVertex(style, x, y, width, height, type);
    let valueId = 1;
    if (graph.getDefaultParent().children != null) {
      valueId = Math.max(...graph.getDefaultParent().children.map(v => +v.id)) + 1;
    }
    vertex.setValue(value.call(null, valueId));
    graph.addCell(vertex);
    graph.setSelectionCell(vertex);
  };
  const img = toolbar.addMode(title, icon, (evt, cell) => {
    const pt = graph.getPointForEvent(evt);
    handler(graph, evt, cell, pt.x, pt.y);
  });
  img.classList.add("my-3");
  img.classList.add("mx-auto");
  img.classList.add("d-block");
  mxUtils.makeDraggable(img, graph, handler);
}

interface ToolbarProps {
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

export default class Toolbar extends React.Component<ToolbarProps> {
  containerRef: React.RefObject<HTMLDivElement> = createRef();

  constructor(props: ToolbarProps) {
    super(props);
  }

  componentDidMount() {
    const { graph } = this.props;
    const containerElement = this.containerRef.current;

    configureToolbar(graph, containerElement, this.props.location.state.info.type);
  }

  render() {
    return (
      <Grid container item xs={2} lg={2}>
        <div style={{ margin: "15px" }}>
          <h3>Элементы</h3> <div ref={this.containerRef} className="toolbarContainer" />{" "}
        </div>
      </Grid>
    );
  }
}
