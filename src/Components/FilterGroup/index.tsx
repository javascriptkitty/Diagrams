import React from "react";

import { Card, CardContent, Button, IconButton, TextField } from "@material-ui/core";
import SimpleSelect from "../MUI/SimpleSelect";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";

import "./style.css";
import SplitButton from "../MUI/ButtonGroup";

interface FilterGroupProps {
  groupClassName: string;

  key: number;
}
export default function FilterGroup(props: FilterGroupProps) {
  const [selected, setSelected] = React.useState(0);
  let [countGroup, setCountGroup] = React.useState(0);
  let [countFilter, setCountFilter] = React.useState(0);

  const selectOption = index => {
    setSelected(index);
  };

  function incrementGroupCount() {
    debugger;

    setCountGroup(countGroup++);
    renderFilterGroups(countGroup);
  }
  function incrementFilterCount() {
    debugger;

    setCountFilter(countFilter++);
    renderSimpleFilters(countFilter);
  }

  function renderFilterGroups(count) {
    const groups = [];
    for (let i = 0; i < count; i++) {
      groups.push(<FilterGroup key={i} groupClassName={props.groupClassName} />);
    }
    return groups;
  }
  function renderSimpleFilters(filter) {
    const filters = [];
    for (let i = 0; i < filter; i++) {
      filters.push(<SimpleFilter />);
    }
    return filters;
  }
  return (
    <Card>
      <CardContent className={props.groupClassName}>
        <div className="filter-group-toggle">
          <SplitButton selectOption={selectOption} />
        </div>
        <div className="filter-group-add">
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={incrementFilterCount}>
            Фильтр
          </Button>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={incrementGroupCount}>
            Группа
          </Button>
          <Button variant="contained" color="primary" startIcon={<AddIcon />}>
            Файл
          </Button>
        </div>
      </CardContent>
      <div className="simpleFilters">{renderSimpleFilters(countFilter)}</div>
      {renderFilterGroups(countGroup)}
    </Card>
  );
}

export function SimpleFilter() {
  // const [selectedValue, setSelectedValue] = React.useState("a");

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setSelectedValue(event.target.value);
  // };
  const onSelect = (selected: string) => {
    this.restriction = selected;
  };
  const filters = [
    { value: "EQUAL", label: "=" },
    { value: "LESS_OR_EQUAL", label: "<=" },
    { value: "MORE_OR_EQUAL", label: ">=" },
    { value: "LESS", label: "<" },
    { value: "MORE", label: ">" },
    { value: "SPARQL_EXP", label: "sparql" }
  ];
  return (
    <div className="simpleFilter">
      <SimpleSelect restrictionTypes={filters} onSelect={onSelect} />
      <TextField variant="outlined" style={{ width: "100%" }} />
      <IconButton aria-label="delete">
        <DeleteIcon />
      </IconButton>
    </div>
  );
}
