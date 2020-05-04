import React from "react";
import { DiagramInfo, AggregateRestriction, OntologyRelation } from "../../models";
import { mxgraph } from "mxgraph";

interface RestrictionTypesProps {
  diagramInfo: DiagramInfo;
  restriction: {};

  onRestrictionChange: Function;
  element: mxgraph.mxCell;
}

export default function DiagramAggregateRestrictionEditor(props: RestrictionTypesProps) {
  return <div></div>;
}
