import React from "react";
import { Diagram, DiagramInfo, DiagramEntity, DiagramRelation, DiagramAggregate } from "../../models";
import { mxgraph } from "mxgraph";
import SimpleSelect from "../MUI/SimpleSelect";
import { Any } from "json2typescript";

interface RestrictionTypesProps {
  diagramInfo: DiagramInfo;
  element: mxgraph.mxCell;
}

export default function RestrictionTypes(props: RestrictionTypesProps) {
  const { diagramInfo, element } = props;
  const isClassifier = diagramInfo.type === "INDICATOR" ? false : true;
  console.log(props.diagramInfo);
  let restrictionTypes = [];
  if (element.vertex) {
    if (element.value.type === "Value") {
      restrictionTypes = !isClassifier
        ? [
            {
              label: "Классификатор значения"
              //   value: ClassifierRestriction.name
            },
            {
              label: "Фильтр по значению"
              //   value: SimpleFilterRestriction.name
            }
          ]
        : [
            {
              label: "Фильтр по значению"
              //   value: SimpleFilterRestriction.name
            }
          ];

      //  value-fixed
      //  [ { label: "Агрегирующая функция", value: SimpleFilterRestriction.name }];
      //
    } else if (element.edge) {
      if (!isClassifier) {
        restrictionTypes = [
          {
            label: "Классификатор связи"
            //   value: ClassifierRestriction.name
          },
          { label: "Связь" }
          // value: OntologyRelation.name }
        ];

        // if edgeFixed
        // restrictionTypes = [{ label: "Переменная", value: VariableName.name }];
      } else {
        //   if (_cell.source.type == "Aggregate") {
        //     restrictionTypes = [
        //       {
        //         label: "Агрегирующая функция",
        //         value: AggregateRestriction.name
        //       },
        //       { label: "Связь", value: OntologyRelation.name }
        //     ];
        //   } else {
        //     restrictionTypes = [{ label: "Связь", value: OntologyRelation.name }];
        //   }
      }
    }
  }
  return (
    <div>
      <div>
        <SimpleSelect restrictionTypes={restrictionTypes} />
      </div>
    </div>
  );
}
