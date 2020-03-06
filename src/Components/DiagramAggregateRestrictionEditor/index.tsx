import React from "react";
import { Diagram, DiagramInfo, DiagramEntity, DiagramRelation, DiagramAggregate } from "../../models";
import { mxgraph } from "mxgraph";
import RestrictionTypes from "../RestrictionTypes";

interface RestrictionTypesProps {
  diagramInfo: DiagramInfo;

  element: mxgraph.mxCell;
}

export default function DiagramEAggregateRestrictionEditor(props: RestrictionTypesProps) {
  const { diagramInfo, element } = props;

  return (
    <div>
      <RestrictionTypes diagramInfo={diagramInfo} element={element} />
    </div>
  );
}
