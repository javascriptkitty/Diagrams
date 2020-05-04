import React, { useEffect } from "react";
import { DiagramInfo } from "../../models";
import { mxgraph } from "mxgraph";
import { FormControl, MenuItem, Select } from "@material-ui/core";
import DataService from "../../services/data.service";
import ClassifierRestriction from "../ClassifierRestriction";
import ClassifierRestrictionComponent from "../ClassifierRestriction";

interface RestrictionTypesProps {
  diagramInfo: DiagramInfo;

  element: mxgraph.mxCell;
}

let ontologyPromise;
let list;
export default function DiagramEntityRestrictionEditor(props: RestrictionTypesProps) {
  const [entityList, getEntityList] = React.useState([]);
  const [classifierList, getClassifierList] = React.useState([]);

  const { diagramInfo } = props;
  const isClassifier = diagramInfo.type === "INDICATOR" ? false : true;

  useEffect(() => {
    if (ontologyPromise == null) {
      ontologyPromise = DataService.getOntologyEntities().then(res => {
        getEntityList(res);
      });
    }
    if (!list) {
      list = DataService.getEntityClassifiers("2030cd40e03dc5b7d2aef75c39008142").then(res => {
        getClassifierList(res);
      });
    }
  });

  const [selected, setSelected] = React.useState("");
  const handleEntityChange = (event: React.ChangeEvent<{ value: string }>) => {
    debugger;
    setSelected(event.target.value);
  };
  const handleClassifierChange = event => {
    debugger;
    setSelected(event);
  };
  let description;
  for (let i = 0; i < entityList.length; i++) {
    if (entityList[i].uri == selected) {
      description = entityList[i].description;
      break;
    }
  }

  return (
    <div className="entityRestrictions">
      <h3>Тип сущности</h3>
      <FormControl variant="outlined">
        <Select labelId="select-1-label" id="select-1" value={selected} onChange={handleEntityChange}>
          {entityList.map((type, index) => {
            return (
              <MenuItem value={type.uri} key={index}>
                {type.label}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      {selected ? <p className="selected-description">{description}</p> : null}

      {!isClassifier ? (
        <ClassifierRestrictionComponent
          title="Классификатор сущности"
          classifierList={classifierList}
          selected={selected}
          handleClassifierChange={handleClassifierChange}
        />
      ) : null}
    </div>
  );
}
