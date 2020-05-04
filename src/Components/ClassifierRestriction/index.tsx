import React from "react";
import DataService from "../../services/data.service";
import { FormControl, MenuItem, Select } from "@material-ui/core";

interface ClassifierProps {
  classifierList: any[];
  selected: {};
  // restriction: {};
  handleClassifierChange: Function;
  title: String;
}

export default function ClassifierRestrictionComponent(props: ClassifierProps) {
  const onClassifierChange = event => {
    debugger;
    DataService.getClassifierRestriction(event.target.value).then(res => {
      props.handleClassifierChange(res);
    });
  };
  console.log(props.selected);
  return (
    <div className="classifier">
      <h3>{props.title}</h3>
      <FormControl variant="outlined">
        <Select labelId="select-2-label" id="select-2" value={props.selected} onChange={onClassifierChange}>
          {props.classifierList.map((type, index) => {
            return (
              <MenuItem value={type.id} key={index}>
                {type.label}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
}
