import React from "react";

import { IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import SimpleSelect from "../MUI/SimpleSelect";

export default function SimpleFilter() {
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
    <div>
      <SimpleSelect restrictionTypes={filters} onSelect={onSelect} />{" "}
      <IconButton aria-label="delete">
        <DeleteIcon />
      </IconButton>
    </div>
  );
}
