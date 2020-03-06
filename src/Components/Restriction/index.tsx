import React from "react";
import { Card, CardContent } from "@material-ui/core";
import { Diagram, DiagramInfo, DiagramEntity, DiagramRelation, DiagramAggregate } from "../../models";
import DiagramEntityRestrictionEditor from "../DiagramEntityRestrictionEditor";
import DiagramValueRestrictionEditor from "../DiagramValueRestrictionEditor";
import DiagramRelationRestrictionEditor from "../DiagramRelationRestrictionEditor";
import DiagramAggregateRestrictionEditor from "../DiagramAggregateRestrictionEditor";
import { mxgraph } from "mxgraph";
import { render } from "@testing-library/react";

interface RestrictionProps {
  diagramInfo: DiagramInfo;
  diagram: Diagram;
  element: mxgraph.mxCell;
}

interface RestrictionState {
  isClassifier: boolean;
  isVertex: boolean;
  isEdge: boolean;
  // cellValue: DiagramEntity | DiagramRelation | DiagramValue | DiagramAggregate
}
export default class Restriction extends React.Component<RestrictionProps, RestrictionState> {
  constructor(props: RestrictionProps) {
    super(props);
    this.state = {
      isClassifier: false,
      isVertex: false,
      isEdge: false
      // cellValue: null
    };
  }

  render() {
    const { diagramInfo, diagram, element } = this.props;
    console.log(element);

    return (
      <div className="restrictionContainer">
        <h2>Restrictions</h2>
        <Card>
          <CardContent>
            {element === null ? (
              <div>Выделите один из элементов, чтобы установить или отредактировать его ограничения</div>
            ) : (
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
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }
}
