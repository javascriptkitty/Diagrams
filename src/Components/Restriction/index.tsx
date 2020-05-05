import React from "react";
import { Card, CardContent } from "@material-ui/core";
import {
  Diagram,
  DiagramInfo,
  DiagramEntity,
  DiagramAggregate,
  OntologyEntity,
  ClassifierRestriction,
  OntologyRelation,
  AggregateRestriction,
  SimpleFilter
} from "../../models";

import DiagramEntityRestrictionEditor from "../DiagramEntityRestrictionEditor";
import DiagramValueRestrictionEditor from "../DiagramValueRestrictionEditor";
import DiagramRelationRestrictionEditor from "../DiagramRelationRestrictionEditor";
import DiagramAggregateRestrictionEditor from "../DiagramAggregateRestrictionEditor";
import SimpleSelect from "../MUI/SimpleSelect";
import { mxgraph } from "mxgraph";
import { Button } from "@material-ui/core";
import "./style.css";

interface RestrictionProps {
  diagramInfo: DiagramInfo;
  diagram: Diagram;
  element: mxgraph.mxCell;
  onRestrictionChange: Function;
}

type RestrictionType = OntologyEntity | OntologyRelation | ClassifierRestriction | SimpleFilter | AggregateRestriction;

interface RestrictionState {
  restriction: RestrictionType;
}
export default class Restriction extends React.Component<RestrictionProps, RestrictionState> {
  isClassifier: boolean;
  restrictionTypes: any[];

  constructor(props: RestrictionProps) {
    super(props);

    this.state = {
      restriction: props.element && props.element.value.restriction
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.element) {
      this.setState({ restriction: nextProps.element.value.restriction });
    }
  }

  onSelect = (selected: string) => {
    debugger;

    let newRestriction;
    switch (selected) {
      case "relation":
        newRestriction = new OntologyRelation();
        break;
      case "classifier":
        newRestriction = new ClassifierRestriction();
        break;
      case "aggregate":
        newRestriction = new AggregateRestriction();
        break;
      case "filter":
        newRestriction = new SimpleFilter();
        break;
      default:
        newRestriction = new OntologyEntity();
    }

    this.setState({ restriction: newRestriction });
  };

  onRestrictionChange = (restriction: RestrictionType) => {
    this.props.onRestrictionChange(restriction);
  };

  apply = () => {
    console.log(this.props.element);
    debugger;
    this.props.onRestrictionChange(this.state.restriction);
  };

  render() {
    const { diagramInfo, element } = this.props;

    console.log(element);
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
            { value: "relation", label: "Связь" },
            { value: "classifier", label: "Классификатор связи" }
          ];
        } else {
          if (element.source.value.type === "Aggregate") {
            this.restrictionTypes = [
              { value: "relation", label: "Связь" },
              { value: "aggregate", label: "Агрегирующая функция" }
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
              <div className="selected-description ">
                Выделите один из элементов, чтобы установить или отредактировать его ограничения
              </div>
            ) : (
              <div className="restrictionType">
                {element.edge || element.value.type !== "Entity" ? (
                  <SimpleSelect restrictionTypes={this.restrictionTypes} onSelect={this.onSelect} />
                ) : null}
                <div>
                  {element.value instanceof DiagramEntity || element.value instanceof DiagramAggregate ? (
                    <div>
                      {" "}
                      <DiagramEntityRestrictionEditor
                        element={element}
                        diagramInfo={diagramInfo}
                        restriction={this.state.restriction}
                        onRestrictionChange={this.onRestrictionChange}
                      />{" "}
                    </div>
                  ) : null}
                  {element.vertex && element.value.type === "Value" ? (
                    <div>
                      <DiagramValueRestrictionEditor
                        element={element}
                        diagramInfo={diagramInfo}
                        restriction={this.state.restriction}
                        onRestrictionChange={this.onRestrictionChange}
                      />{" "}
                    </div>
                  ) : null}
                  {element.edge ? (
                    <div>
                      {" "}
                      <DiagramRelationRestrictionEditor
                        element={element}
                        diagramInfo={diagramInfo}
                        restriction={this.state.restriction}
                        onRestrictionChange={this.onRestrictionChange}
                      />
                      <DiagramAggregateRestrictionEditor
                        element={element}
                        diagramInfo={diagramInfo}
                        restriction={this.state.restriction}
                        onRestrictionChange={this.onRestrictionChange}
                      />
                    </div>
                  ) : null}
                </div>{" "}
                <Button variant="contained" color="primary" onClick={this.apply}>
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
