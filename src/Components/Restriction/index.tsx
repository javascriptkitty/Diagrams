import React from "react";
import { Card, CardContent } from "@material-ui/core";
import { Diagram, DiagramInfo, DiagramEntity, DiagramRelation, DiagramAggregate } from "../../models";
import DiagramEntityRestrictionEditor from "../DiagramEntityRestrictionEditor";
import DiagramValueRestrictionEditor from "../DiagramValueRestrictionEditor";
import DiagramRelationRestrictionEditor from "../DiagramRelationRestrictionEditor";
import DiagramAggregateRestrictionEditor from "../DiagramAggregateRestrictionEditor";
import SimpleSelect from "../MUI/SimpleSelect";
import { mxgraph } from "mxgraph";

interface RestrictionProps {
  diagramInfo: DiagramInfo;
  diagram: Diagram;
  element: mxgraph.mxCell;
}

interface RestrictionState {
  // cellValue: DiagramEntity | DiagramRelation | DiagramValue | DiagramAggregate
}
export default class Restriction extends React.Component<RestrictionProps, RestrictionState> {
  isClassifier: boolean;
  constructor(props: RestrictionProps) {
    super(props);
    this.state = {};
  }

  render() {
    const { diagramInfo, diagram, element } = this.props;
    console.log(element);

    if (diagramInfo.type !== "INDICATOR") {
      this.isClassifier = true;
    }

    let restrictionTypes;
    if (element) {
      if (element.vertex && element.value.type === "Value") {
        restrictionTypes = !this.isClassifier
          ? ["Фильтр по значению", "Классификатор значения"]
          : ["Фильтр по значению"];
      } else if (element.edge) {
        if (!this.isClassifier) {
          restrictionTypes = ["Классификатор связи", "Связь"];
        } else {
          if (element.source.value.type == "Aggregate") {
            restrictionTypes = ["Агрегирующая функция", "Связь"];
          } else {
            restrictionTypes = ["Связь"];
          }
        }
      }
    }

    return (
      <div className="restrictionContainer">
        <h2>Restrictions</h2>
        <Card>
          <CardContent>
            {element === null ? (
              <div>Выделите один из элементов, чтобы установить или отредактировать его ограничения</div>
            ) : (
              <div>
                <SimpleSelect restrictionTypes={restrictionTypes} />
                <div>
                  {element.vertex && element.value.type === "Entity" ? (
                    <div>
                      {" "}
                      <DiagramEntityRestrictionEditor element={element} diagramInfo={diagramInfo} />{" "}
                    </div>
                  ) : null}
                  {element.vertex && element.value.type === "Value" ? (
                    <div>
                      <DiagramValueRestrictionEditor element={element} diagramInfo={diagramInfo} />{" "}
                    </div>
                  ) : null}
                  {element.edge ? (
                    <div>
                      {" "}
                      <DiagramRelationRestrictionEditor element={element} diagramInfo={diagramInfo} />
                    </div>
                  ) : null}
                  {element.vertex && element.value.type === "Aggregate" ? (
                    <div>
                      {" "}
                      <DiagramAggregateRestrictionEditor element={element} diagramInfo={diagramInfo} />
                    </div>
                  ) : null}
                </div>{" "}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }
}
