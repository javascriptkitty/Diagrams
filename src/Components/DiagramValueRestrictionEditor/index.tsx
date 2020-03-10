import React from "react";
import { Diagram, DiagramInfo, DiagramEntity, DiagramRelation, DiagramAggregate } from "../../models";
import { mxgraph } from "mxgraph";

interface RestrictionTypesProps {
  diagramInfo: DiagramInfo;

  element: mxgraph.mxCell;
}

export default function DiagramValueRestrictionEditor(props: RestrictionTypesProps) {
  const { diagramInfo, element } = props;
  const isClassifier = diagramInfo.type === "INDICATOR" ? false : true;
  console.log(props);
  return <div></div>;
}
