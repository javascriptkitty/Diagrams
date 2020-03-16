import React from "react";
import { Diagram, DiagramInfo, DiagramEntity, DiagramRelation, DiagramAggregate } from "../../models";
import FilterGroup from "../FilterGroup";
import { FormControl, Select } from "@material-ui/core";
import { mxgraph } from "mxgraph";

interface RestrictionTypesProps {
  diagramInfo: DiagramInfo;
  restriction: string;
  element: mxgraph.mxCell;
}

export default function DiagramValueRestrictionEditor(props: RestrictionTypesProps) {
  const { diagramInfo, restriction, element } = props;
  const isClassifier = diagramInfo.type === "INDICATOR" ? false : true;

  return (
    <div>
      {restriction == "filter" ? (
        <div className="valueRestrictions">
          <FilterGroup />
        </div>
      ) : null}
      {restriction == "classifier" ? (
        <div className="classifier">
          <h3>Классификатор значения</h3>
          <FormControl variant="outlined">
            <Select></Select>{" "}
          </FormControl>
        </div>
      ) : null}
    </div>
  );
}
