import React, { Component, createRef } from "react";
import { Card, CardContent } from "@material-ui/core";
import { Diagram, DiagramInfo } from "../../models";

interface RestrictionProps {
  diagramInfo: DiagramInfo;
  diagram: Diagram;
}

interface RestrictionState {
  isSelected: boolean;
  isVertex: boolean;
  isEdge: boolean;
  isClassifier: boolean;
}

export default class Restriction extends React.Component<RestrictionProps, RestrictionState> {
  constructor(props: RestrictionProps) {
    super(props);
    this.state = {
      isSelected: false,
      isVertex: false,
      isEdge: false,
      isClassifier: false
    };
  }

  componentDidMount() {}

  render() {
    return (
      <div className="restrictionContainer">
        <h2>Restrictions</h2>
        <Card>
          <CardContent>
            {!this.state.isSelected ? (
              <p>Выделите один из элементов, чтобы установить или отредактировать его ограничения</p>
            ) : (
              <div></div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }
}
