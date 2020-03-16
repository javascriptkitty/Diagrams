import React from "react";
import { Diagram, DiagramInfo, DiagramEntity, DiagramRelation, DiagramAggregate } from "../../models";
import { mxgraph } from "mxgraph";

interface RestrictionTypesProps {
  diagramInfo: DiagramInfo;
  restriction: string;
  element: mxgraph.mxCell;
}

export default function DiagramEAggregateRestrictionEditor(props: RestrictionTypesProps) {
  const { diagramInfo, element } = props;

  return <div></div>;
}
