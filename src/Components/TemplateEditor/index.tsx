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
import ClassifierValue from "../ClassifierValue";

import Json2TypescriptService from "../../services/json2typescript";

const diagram: Diagram = Json2TypescriptService.deserializeObject(diagramJson, Diagram) as Diagram;

interface TemplateProps {
  location: any;
  diagramInfo: DiagramInfo;
}

interface InteractionState {
  diagramInfo: DiagramInfo;

  element: mxgraph.mxCell;
}

const DEFAULT_INTERACTION_STATE = {
  element: null,
  diagramInfo: null
};

export default function TemplateEditor(props: TemplateProps) {
  const [interactionState, setInteractionState] = useState(DEFAULT_INTERACTION_STATE);
  //  const [diagram, getDiagram] = useState({});
  function onVertexSelected(diagramInfo: DiagramInfo, element: mxgraph.mxCell): void {
    setInteractionState({ diagramInfo, element });
  }

  function onEdgeSelected(diagramInfo: DiagramInfo, element: mxgraph.mxCell): void {
    setInteractionState({ diagramInfo, element });
  }

  function onCellDeselected() {
    setInteractionState(DEFAULT_INTERACTION_STATE);
  }

  const listener: DiagramElementListener = {
    onVertexSelected,
    onEdgeSelected,
    onCellDeselected
  };

  const diagramInfo = props.location.state.info;

  return (
    <div className="editorContainer">
      <Grid container spacing={3}>
        <Grid item xs={3} sm={3} md={2} lg={2}>
          <Info label={diagramInfo.label} description={diagramInfo.description} />
        </Grid>
        {diagramInfo.type !== "VALUE_CLASSIFIER" ? (
          <Grid item xs={9} sm={9} md={7} lg={7}>
            <MxGraphContainerComponent diagram={diagram} diagramInfo={diagramInfo} listener={listener} />
          </Grid>
        ) : null}

        {diagramInfo.type !== "VALUE_CLASSIFIER" ? (
          <Grid item sm={3} md={3} lg={3}>
            <Restriction diagram={diagram} diagramInfo={diagramInfo} element={interactionState.element} />
          </Grid>
        ) : null}
        {diagramInfo.type === "VALUE_CLASSIFIER" ? (
          <Grid item xs={9} sm={9} md={10} lg={10}>
            <ClassifierValue />
          </Grid>
        ) : null}
      </Grid>
    </div>
  );
}
