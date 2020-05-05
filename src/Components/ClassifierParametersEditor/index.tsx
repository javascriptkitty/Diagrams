import React, { useState } from "react";
import { Button, TextField, CardContent, Card, IconButton } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import SimpleSelect from "../MUI/SimpleSelect";
import { ClassifierParameter } from "../../models";
import "./style.css";

interface ParameterGroupProps {
  dataTypes: any[];
  parameters: ClassifierParameter[];
  onParameterAdd: Function;
}
export function ParameterGroup(props: ParameterGroupProps) {
  const onSelect = selected => {
    this.restriction = selected;
  };

  return (
    <div className="parameter-group">
      <form className="parameter-group-inputs">
        <SimpleSelect restrictionTypes={props.dataTypes} onSelect={onSelect} />
        <span>?</span>
        <TextField id="name" placeholder="name" variant="outlined" />
        <TextField id="default" placeholder="default" variant="outlined" />
        <IconButton aria-label="delete">
          <DeleteIcon />
        </IconButton>
      </form>
    </div>
  );
}

interface ClassifierParametersProps {
  dataTypes: any[];
  parameters: ClassifierParameter[];
  onParameterAdd: Function;
}
export default function ClassifierParametersEditor(props: ClassifierParametersProps) {
  const { dataTypes } = props;
  let [count, setCount] = useState(0);

  function incrementCount() {
    debugger;
    setCount(count++);
    renderParameterGroups(count);
  }

  function renderParameterGroups(count) {
    const groups = [];
    for (let i = 0; i < count; i++) {
      groups.push(
        <ParameterGroup
          key={i}
          dataTypes={dataTypes}
          parameters={props.parameters}
          onParameterAdd={props.onParameterAdd}
        />
      );
    }
    return groups;
  }

  return (
    <Card>
      <CardContent>
        <div className="input-parameters">
          <p>
            <strong>Входные параметры</strong>
          </p>
          <Button variant="contained" size="small" color="primary" startIcon={<AddIcon />} onClick={incrementCount}>
            Добавить параметр
          </Button>
        </div>
        {count === 0 ? (
          <p>
            <i>Параметры не заданы</i>
          </p>
        ) : (
          <div className="parameter-group-titles">
            <span>Тип данных</span>
            <span>Название</span>
            <span>Значение по умолчанию</span>
          </div>
        )}
      </CardContent>
      {/* <ParameterGroup dataTypes={dataTypes} /> */}
      {renderParameterGroups(count)}
    </Card>
  );
}
