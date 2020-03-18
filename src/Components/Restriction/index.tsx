import React from "react";
import { Card, CardContent } from "@material-ui/core";
import { Diagram, DiagramInfo, DiagramEntity, DiagramAggregate } from "../../models";
import DiagramEntityRestrictionEditor from "../DiagramEntityRestrictionEditor";
import DiagramValueRestrictionEditor from "../DiagramValueRestrictionEditor";
import DiagramRelationRestrictionEditor from "../DiagramRelationRestrictionEditor";
import DiagramAggregateRestrictionEditor from "../DiagramAggregateRestrictionEditor";
import SimpleSelect from "../MUI/SimpleSelect";
import { mxgraph } from "mxgraph";
import { Button } from "@material-ui/core";

interface RestrictionProps {
  diagramInfo: DiagramInfo;
  diagram: Diagram;
  element: mxgraph.mxCell;
}

interface RestrictionState {
  restriction: string;
  selected: mxgraph.mxCell;
}
export default class Restriction extends React.Component<RestrictionProps, RestrictionState> {
  isClassifier: boolean;
  restrictionTypes: any[];
  restriction: string;
  constructor(props: RestrictionProps) {
    super(props);
    this.state = {
      restriction: null,
      selected: this.props.element
    };
  }
  onSelect = (selected: string) => {
    this.restriction = selected;
  };

  render() {
    const { diagramInfo, element } = this.props;

    if (diagramInfo.type !== "INDICATOR") {
      this.isClassifier = true;
    }

    if (element) {
      if (element.vertex && element.value.type === "Value") {
        this.restrictionTypes = !this.isClassifier
          ? [
              { value: "filter", label: "Фильтр по значению" },
              { value: "classifier", label: "Классификатор значения" }
            ]
          : [{ value: "filter", label: "Фильтр по значению" }];
      } else if (element.edge) {
        if (!this.isClassifier) {
          this.restrictionTypes = [
            { value: "classifier", label: "Классификатор связи" },
            { value: "relation", label: "Связь" }
          ];
        } else {
          if (element.source.value.type === "Aggregate") {
            this.restrictionTypes = [
              { value: "aggregate", label: "Агрегирующая функция" },
              { value: "relation", label: "Связь" }
            ];
          } else {
            this.restrictionTypes = [{ value: "relation", label: "Связь" }];
          }
        }
      }
    }

    return (
      <div className="restrictionContainer">
        <h2>Restrictions</h2>
        <Card>
          <CardContent>
            {element === null || (element.vertex && element.value.type === "title-entity") ? (
              <div>Выделите один из элементов, чтобы установить или отредактировать его ограничения</div>
            ) : (
              <div className="restrictionType">
                {element.edge || element.value.type !== "Entity" ? (
                  <SimpleSelect restrictionTypes={this.restrictionTypes} onSelect={this.onSelect} />
                ) : null}
                <div>
                  {element.value instanceof DiagramEntity || element.value instanceof DiagramAggregate ? (
                    <div>
                      {" "}
                      <DiagramEntityRestrictionEditor element={element} diagramInfo={diagramInfo} />{" "}
                    </div>
                  ) : null}
                  {element.vertex && element.value.type === "Value" ? (
                    <div>
                      <DiagramValueRestrictionEditor
                        element={element}
                        diagramInfo={diagramInfo}
                        restriction={this.restriction}
                      />{" "}
                    </div>
                  ) : null}
                  {element.edge ? (
                    <div>
                      {" "}
                      <DiagramRelationRestrictionEditor
                        element={element}
                        diagramInfo={diagramInfo}
                        restriction={this.restriction}
                      />
                      <DiagramAggregateRestrictionEditor
                        element={element}
                        diagramInfo={diagramInfo}
                        restriction={this.restriction}
                      />
                    </div>
                  ) : null}
                </div>{" "}
                <Button variant="contained" color="primary">
                  Применить
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }
}
