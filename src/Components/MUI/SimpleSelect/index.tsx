import React from "react";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

interface SelectProps {
  restrictionTypes: any[];
  onSelect: Function;
}

export default function SimpleSelect(props: SelectProps) {
  const [type, setType] = React.useState(props.restrictionTypes[0]);
  console.log(type);
  const handleChange = (event: React.ChangeEvent<{ value: Object }>) => {
    setType(event.target.value);
    console.log(event.target.value);
    debugger;
    props.onSelect(event.target.value);
  };

  return (
    <FormControl variant="outlined">
      <Select
        labelId="demo-simple-select-outlined-label"
        id="demo-simple-select-outlined"
        value={type}
        onChange={handleChange}
      >
        {props.restrictionTypes.map((type, index) => {
          return (
            <MenuItem value={type.value} key={index}>
              {type.label}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
