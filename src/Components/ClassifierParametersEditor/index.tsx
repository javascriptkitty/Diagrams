import React, { useState } from "react";
import { Button, TextField, CardContent, Card, IconButton } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
//import SimpleSelect from '../MUI/SimpleSelect';
import "./style.css";

export function ParameterGroup() {
  // const onSelect = (selected: string) => {
  //     this.restriction = selected;
  // };

  return (
    <div className="parameter-group">
      <div className="parameter-group-titles">
        <span>Тип данных</span>
        <span>Название</span>
        <span>Значение по умолчанию</span>
      </div>

      <form className="parameter-group-inputs">
        {/* <SimpleSelect restrictionTypes={dataTypes} onSelect={onSelect} /> */}
        <span>?</span>
        <TextField id="name" label="name" variant="outlined" />
        <TextField id="default" label="default" variant="outlined" />
        <IconButton aria-label="delete">
          <DeleteIcon />
        </IconButton>
      </form>
    </div>
  );
}

interface ClassifierParametersProps {
  dataTypes: any[];
}
export default function ClassifierParametersEditor(props: ClassifierParametersProps) {
  //  const { dataTypes } = props;
  let [count, setCount] = useState(0);

  function incrementCount() {
    setCount(count++);
  }

  function renderParameterGroups(count) {
    const groups = [];
    for (let i = 0; i < count; i++) {
      groups.push(<ParameterGroup key={i} />);
    }
    return groups;
  }

  return (
    <Card>
      <CardContent>
        <div className="input-parameters">
          <p>Входные параметры</p>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={incrementCount}>
            Добавить параметр
          </Button>
        </div>
      </CardContent>
      {renderParameterGroups(count)}
    </Card>
  );
}
