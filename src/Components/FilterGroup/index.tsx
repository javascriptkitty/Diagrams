import React from "react";

import { Card, CardContent, Radio, FormControl, RadioGroup, FormControlLabel, Button } from "@material-ui/core";
//import SimpleFilter from '../SimpleFilter';
import AddIcon from "@material-ui/icons/Add";
import "./style.css";
import SplitButton from "../MUI/ButtonGroup";

export default function FilterGroup() {
  const [selected, setSelected] = React.useState(0);
  const selectOption = index => {
    setSelected(index);
  };

  return (
    <Card>
      <CardContent className="filterGroup">
        <div className="filter-group-toggle">
          <SplitButton selectOption={selectOption} />
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
