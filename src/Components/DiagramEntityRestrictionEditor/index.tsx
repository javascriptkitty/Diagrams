import React from "react";
import { Diagram, DiagramInfo, DiagramEntity, DiagramRelation, DiagramAggregate } from "../../models";
import { mxgraph } from "mxgraph";

import { Select } from "@material-ui/core";
import DataService from "../../services/data.service";

interface RestrictionTypesProps {
  diagramInfo: DiagramInfo;

  element: mxgraph.mxCell;
}

export default function DiagramEntityRestrictionEditor(props: RestrictionTypesProps) {
  let entityTypes = [];
  const { diagramInfo, element } = props;
  const isClassifier = diagramInfo.type == "INDICATOR" ? false : true;

  DataService.getOntologyEntities().then(res => (entityTypes = res));

  return <div>entity types should be here </div>;
}
