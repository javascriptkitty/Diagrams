import React, { useEffect } from "react";
import { DiagramInfo, OntologyEntity } from "../../models";
import { mxgraph } from "mxgraph";
import { FormControl, MenuItem, Select } from "@material-ui/core";
import DataService from "../../services/data.service";
import ClassifierRestrictionComponent from "../ClassifierRestriction";

interface RestrictionTypesProps {
  diagramInfo: DiagramInfo;
  restriction: {};
  element: mxgraph.mxCell;
  onRestrictionChange: Function;
}

let ontologyPromise;
let list;
export default function DiagramEntityRestrictionEditor(props: RestrictionTypesProps) {
  const [entityList, getEntityList] = React.useState([]);
  const [classifierList, getClassifierList] = React.useState([]);

  const { diagramInfo } = props;
  const isClassifier = diagramInfo.type === "INDICATOR" ? false : true;

  useEffect(() => {
    debugger;
    console.log(props.restriction);
    if (props.restriction) {
      setEntitySelected(props.restriction);
    }
    if (props.element.value.classifierRestriction) {
      setClassifierSelected(props.element.value.classifierRestriction);
    }

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

  const [entitySelected, setEntitySelected] = React.useState({});
  const [classifierSelected, setClassifierSelected] = React.useState({});

  const handleEntityChange = (event: React.ChangeEvent<{ value: OntologyEntity }>) => {
    debugger;
    setEntitySelected(event.target.value);
    props.onRestrictionChange(event.target.value);
  };
  const handleClassifierChange = event => {
    debugger;
    setClassifierSelected(event);
    //  props.onRestrictionChange(event);
    props.element.value.classifierRestriction = event;
  };
  let description;
  for (let i = 0; i < entityList.length; i++) {
    if (entityList[i].uri === classifierSelected) {
      description = entityList[i].description;
      break;
    }
  }

  return (
    <div className="entityRestrictions">
      <div>
        <h3>Тип сущности</h3>
        <FormControl variant="outlined">
          <Select labelId="select-1-label" id="select-1" value={entitySelected} onChange={handleEntityChange}>
            {entityList.map((type, index) => {
              return (
                <MenuItem value={type} key={index}>
                  {type.label}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        {entitySelected ? <p className="selected-description">{description}</p> : null}
      </div>

      {!isClassifier ? (
        <ClassifierRestrictionComponent
          title="Классификатор сущности"
          classifierList={classifierList}
          selected={classifierSelected}
          handleClassifierChange={handleClassifierChange}
        />
      ) : null}
    </div>
  );
}
