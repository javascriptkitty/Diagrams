import React from "react";
import { Card, CardContent } from "@material-ui/core";
import { Diagram, DiagramInfo } from "../../models";
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
}
export default class Restriction extends React.Component<RestrictionProps, RestrictionState> {
  isClassifier: boolean;
  restrictionTypes: string[];
  restriction: string;
  constructor(props: RestrictionProps) {
    super(props);
    this.state = {
      restriction: null
    };
  }
  onSelect = (selected: string) => {
    this.setState({
      restriction: selected
    });
  };

  render() {
    const { diagramInfo, diagram, element } = this.props;
    console.log(element);

    if (diagramInfo.type !== "INDICATOR") {
      this.isClassifier = true;
    }

    if (element) {
      if (element.vertex && element.value.type === "Value") {
        this.restrictionTypes = !this.isClassifier
          ? ["Фильтр по значению", "Классификатор значения"]
          : ["Фильтр по значению"];
      } else if (element.edge) {
        if (!this.isClassifier) {
          this.restrictionTypes = ["Классификатор связи", "Связь"];
        } else {
          if (element.source.value.type == "Aggregate") {
            this.restrictionTypes = ["Агрегирующая функция", "Связь"];
          } else {
            this.restrictionTypes = ["Связь"];
          }
        }
      }
    }

    return (
      <div className="restrictionContainer">
        <h2>Restrictions</h2>
        <Card>
          <CardContent>
            {element === null || (element.vertex && element.value.type == "title-entity") ? (
              <div>Выделите один из элементов, чтобы установить или отредактировать его ограничения</div>
            ) : (
              <div>
                {element.vertex && element.value.type !== "Entity" ? (
                  <SimpleSelect restrictionTypes={this.restrictionTypes} onSelect={this.onSelect} />
                ) : null}
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
