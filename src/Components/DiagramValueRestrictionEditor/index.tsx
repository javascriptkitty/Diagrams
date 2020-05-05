import React, { useEffect } from "react";
import { DiagramInfo, ClassifierRestriction, SimpleFilter } from "../../models";
import FilterGroup from "../FilterGroup";
import DataService from "../../services/data.service";
import { mxgraph } from "mxgraph";
import ClassifierRestrictionComponent from "../ClassifierRestriction";

interface RestrictionTypesProps {
  diagramInfo: DiagramInfo;
  restriction: {};
  onRestrictionChange: Function;
  element: mxgraph.mxCell;
}

let list;
export default function DiagramValueRestrictionEditor(props: RestrictionTypesProps) {
  const { restriction } = props;
  const [classifierList, getClassifierList] = React.useState([]);

  // const isClassifier = diagramInfo.type === "INDICATOR" ? false : true;

  useEffect(() => {
    debugger;
    if (!list) {
      list = DataService.getValueClassifiers("2030cd40e03dc5b7d2aef75c39008142", props.element.value.datatype).then(
        res => {
          getClassifierList(res);
        }
      );
    }
  });

  console.log(props.element);
  const [selected, setSelected] = React.useState(props.element.value.restriction);
  debugger;
  const handleClassifierChange = event => {
    debugger;
    setSelected(event);
    props.onRestrictionChange(event);
  };

  return (
    <div>
      {restriction == null || restriction instanceof SimpleFilter ? (
        <div className="valueRestrictions">
          <FilterGroup groupClassName="filterGroup" key={0} />
        </div>
      ) : null}
      {restriction instanceof ClassifierRestriction ? (
        <div className="classifier">
          <ClassifierRestrictionComponent
            title="Классификатор значения"
            classifierList={classifierList}
            selected={selected}
            handleClassifierChange={handleClassifierChange}
          />
        </div>
      ) : null}
    </div>
  );
}
