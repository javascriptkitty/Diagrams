import React from "react";

import { Card, CardContent, Radio, FormControl, RadioGroup, FormControlLabel, Button } from "@material-ui/core";
import SimpleFilter from "../SimpleFilter";
import AddIcon from "@material-ui/icons/Add";
import "./style.css";

export default function FilterGroup() {
  const [selectedValue, setSelectedValue] = React.useState("a");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };
  debugger;
  return (
    <Card>
      <CardContent className="filterGroup">
        <div className="filter-group-toggle">
          <FormControl component="fieldset">
            <RadioGroup aria-label="gender" name="gender1" value={selectedValue} onChange={handleChange}>
              <FormControlLabel value="and" control={<Radio />} label="и" />
              <FormControlLabel value="or" control={<Radio />} label="или" />
            </RadioGroup>
          </FormControl>
        </div>
        <div className="filter-group-add">
          <Button variant="contained" color="primary" startIcon={<AddIcon />}>
            Фильтр
          </Button>
          <Button variant="contained" color="primary" startIcon={<AddIcon />}>
            Группа
          </Button>
          <Button variant="contained" color="primary" startIcon={<AddIcon />}>
            Файл
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
