import React, { useState, useEffect } from "react";
import "./style.css";
import MxGraphContainerComponent from "../MxGraphContainerComponent/index";
import { Grid } from "@material-ui/core";
import { mxgraph } from "mxgraph";
import { DiagramElementListener } from "../../mxgraph/editor";
import { DiagramInfo, DiagramRelation } from "../../models";
import Info from "../Info/index";
import Restriction from "../Restriction/index";
import ClassifierValue from "../ClassifierValue";
import DataService from "../../services/data.service";
import Json2TypescriptService from "../../services/json2typescript";
import { ToastContainer, toast } from "react-toastify";

// const diagram: Diagram = Json2TypescriptService.deserializeObject(diagramJson, Diagram) as Diagram;

interface TemplateProps {
  location: any;
  match: any;
}

//let diagramInfo;
export default function TemplateEditor(props: TemplateProps) {
  const [interactionState, setInteractionState] = useState({
    element: null,
    diagramInfo: props.location.state.info
  });
  const [save, onSave] = useState(false);
  const [diagram, getDiagram] = useState(null);
  function onVertexSelected(diagramInfo: DiagramInfo, element: mxgraph.mxCell): void {
    setInteractionState({ diagramInfo, element });
  }

  function onEdgeSelected(diagramInfo: DiagramInfo, element: mxgraph.mxCell): void {
    if (element.value == null) {
      element.value = new DiagramRelation();
    }
    setInteractionState({ diagramInfo, element });
  }

  function onCellDeselected() {
    setInteractionState({ diagramInfo, element: null });
  }

  const listener: DiagramElementListener = {
    onVertexSelected,
    onEdgeSelected,
    onCellDeselected
  };

  const saveDiagram = () => {
    onSave(true);
    toast.success("saved");
  };
  const deleteDiagram = () => {};
  useEffect(() => {
    onSave(false);
    if (diagram == null) {
      DataService.getDiagram(interactionState.diagramInfo._id).then(res => {
        // console.log(res);
        getDiagram(res);
      });
    }
  });

  const { diagramInfo } = interactionState;
  if (!diagram) return <span>loading...</span>;

  return (
    <div className="editorContainer">
      <Grid container spacing={3}>
        <Grid item xs={3} sm={3} md={2} lg={2}>
          <Info diagramInfo={diagramInfo} saveDiagram={saveDiagram} deleteDiagram={deleteDiagram} />
        </Grid>
        {diagramInfo.type !== "VALUE_CLASSIFIER" ? (
          <Grid item xs={9} sm={9} md={7} lg={7}>
            <MxGraphContainerComponent diagramInfo={diagramInfo} diagram={diagram} listener={listener} save={save} />
          </Grid>
        ) : null}

        {diagramInfo.type !== "VALUE_CLASSIFIER" ? (
          <Grid item xs={3} sm={3} md={3} lg={3}>
            <Restriction diagram={diagram} diagramInfo={diagramInfo} element={interactionState.element} />
          </Grid>
        ) : null}
        {diagramInfo.type === "VALUE_CLASSIFIER" ? (
          <Grid item xs={9} sm={9} md={10} lg={10}>
            <ClassifierValue />
          </Grid>
        ) : null}
      </Grid>
      <ToastContainer position="top-center" autoClose={4000} hideProgressBar={true} />
    </div>
  );
}
