import React from "react";
import { Diagram, DiagramInfo, OntologyEntity, DiagramEntity, DiagramRelation, DiagramAggregate } from "../../models";
import { mxgraph } from "mxgraph";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { FormControl, MenuItem, Select } from "@material-ui/core";
import DataService from "../../services/data.service";

interface RestrictionTypesProps {
  diagramInfo: DiagramInfo;

  element: mxgraph.mxCell;
}

export default function DiagramEntityRestrictionEditor(props: RestrictionTypesProps) {
  const [state, setState] = React.useState([]);

  const { diagramInfo, element } = props;
  const isClassifier = diagramInfo.type == "INDICATOR" ? false : true;

  DataService.getOntologyEntities().then(res => {
    setState(res);
    //error
  });

  const [selected, setSelected] = React.useState("");

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelected(event.target.value as string);
  };

  return (
    <div className="entityRestrictions">
      <h3>Тип сущности</h3>
      <FormControl variant="outlined">
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={selected}
          onChange={handleChange}
        >
          {state.map((type, index) => {
            return (
              <MenuItem value={type.uri} key={index}>
                {type.label}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      {!isClassifier ? (
        <div className="classifier">
          <h3>Классификатор сущности</h3>
          <FormControl variant="outlined">
            <Select></Select>{" "}
          </FormControl>
        </div>
      ) : null}
    </div>
  );
}
