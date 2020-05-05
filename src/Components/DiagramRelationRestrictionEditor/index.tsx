import React, { useEffect } from "react";
import { DiagramInfo, OntologyRelation, ClassifierRestriction } from "../../models";
import { mxgraph } from "mxgraph";
import DataService from "../../services/data.service";
import { FormControl, MenuItem, Select } from "@material-ui/core";
import ClassifierRestrictionComponent from "../ClassifierRestriction";

interface RestrictionTypesProps {
  diagramInfo: DiagramInfo;
  restriction: {};
  onRestrictionChange: Function;
  element: mxgraph.mxCell;
}

let ontologyPromise;
let list;
export default function DiagramRelationRestrictionEditor(props: RestrictionTypesProps) {
  const [relationList, getRelationList] = React.useState([]);
  const [classifierList, getClassifierList] = React.useState([]);

  const { diagramInfo, restriction } = props;
  const isClassifier = diagramInfo.type === "INDICATOR" ? false : true;

  useEffect(() => {
    if (ontologyPromise == null) {
      ontologyPromise = DataService.getOntologyRelations().then(res => {
        getRelationList(res);
        //error
      });
    }
    if (!list) {
      list = DataService.getRelationClassifiers("2030cd40e03dc5b7d2aef75c39008142").then(res => {
        debugger;
        getClassifierList(res);
      });
    }
  });

  const [selected, setSelected] = React.useState("");

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelected(event.target.value as string);
  };
  const handleClassifierChange = event => {
    debugger;
    props.onRestrictionChange(event);
  };
  return (
    <div>
      {restriction == null || restriction instanceof OntologyRelation ? (
        <div className="relRestrictions">
          <h3>Тип связи</h3>
          <FormControl variant="outlined">
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={selected}
              onChange={handleChange}
            >
              {relationList.map((type, index) => {
                return (
                  <MenuItem value={type.uri} key={index}>
                    {type.label}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
      ) : (
        <div>
          {!isClassifier ? (
            <ClassifierRestrictionComponent
              title="Классификатор связи"
              classifierList={classifierList}
              selected={selected}
              handleClassifierChange={handleClassifierChange}
            />
          ) : null}
        </div>
      )}
    </div>
  );
}
