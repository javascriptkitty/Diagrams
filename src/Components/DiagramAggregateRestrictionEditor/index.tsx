import React from "react";
import { DiagramInfo } from "../../models";
import { mxgraph } from "mxgraph";

interface RestrictionTypesProps {
  diagramInfo: DiagramInfo;
  restriction: string;
  element: mxgraph.mxCell;
}

export default function DiagramEAggregateRestrictionEditor(props: RestrictionTypesProps) {
  return <div></div>;
}
