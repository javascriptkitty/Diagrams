import React from "react";
import FilterGroup from "../FilterGroup";
import ClassifierParametersEditor from "../ClassifierParametersEditor";

export default function ClassifierValue() {
  const dataTypes = [
    { value: "http://www.w3.org/2001/XMLSchema#string", label: "текст" },
    { value: "http://www.w3.org/2001/XMLSchema#integer", label: "целое число" },
    { value: "http://www.w3.org/2001/XMLSchema#boolean", label: "нецелое число" },
    { value: "http://www.w3.org/2001/XMLSchema#date", label: "да / нет" },
    { value: "http://www.w3.org/2001/XMLSchema#dateTime", label: "дата и время" },
    { value: "http://www.w3.org/2001/XMLSchema#gYear", label: "календарный год" }
  ];
  return (
    <div className="classifier-value">
      <div></div>
      <ClassifierParametersEditor dataTypes={dataTypes} />
      <FilterGroup />
    </div>
  );
}
