import React, { useState } from "react";
import "./style.css";
import MxGraphContainerComponent from "../MxGraphContainerComponent/index";
import { Grid } from "@material-ui/core";
import { mxgraph } from "mxgraph";
import { DiagramElementListener } from "../../mxgraph/editor";
import { Diagram, DiagramInfo } from "../../models";
import diagramJson from "../../data/diagram.json";
import Info from "../Info/index";
import Restriction from "../Restriction/index";
import StatisticsIndicatorComponent from "../StatisticsIndicatorComponent/index";
import Json2TypescriptService from "../../services/json2typescript";

declare var require: any;

const diagramInfo: DiagramInfo = {
  _id: "",
  _rev: "",
  type: null,
  label: "",
  description: "",
  modifiedAt: ""
};

const diagram: Diagram = new Json2TypescriptService().deserializeObject(diagramJson, Diagram) as Diagram;

interface TemplateProps {
  location: any;
  diagramInfo: DiagramInfo;
}

export default function TemplateEditor(props: TemplateProps) {
  const [interactionState, setInteractionState] = useState(null);

  function onVertexSelected(diagramInfo: DiagramInfo, element: mxgraph.mxCell): void {
    setInteractionState({ diagramInfo, element });
  }

  function onEdgeSelected(diagramInfo: DiagramInfo, element: mxgraph.mxCell): void {
    setInteractionState({ diagramInfo, element });
  }

  function onCellDeselected() {
    setInteractionState(null);
  }

  const listener: DiagramElementListener = {
    onVertexSelected,
    onEdgeSelected,
    onCellDeselected
  };

  const diagramInfo = props.location.state;

  return (
    <div className="editorContainer">
      <Grid container spacing={0}>
        <Grid item xs={3} sm={3} md={2}>
          <Info label={diagramInfo.label} description={diagramInfo.description} />
        </Grid>
        <Grid item xs={9} sm={9} md={8}>
          <MxGraphContainerComponent diagram={diagram} diagramInfo={diagramInfo} listener={listener} />
        </Grid>
        {interactionState && (
          <Grid item sm={3} md={2}>
            <StatisticsIndicatorComponent />{" "}
          </Grid>
        )}
        <Grid item sm={3} md={2}>
          <Restriction diagram={diagram} diagramInfo={diagramInfo} />
        </Grid>
      </Grid>
    </div>
  );
}
