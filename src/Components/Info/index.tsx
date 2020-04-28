import React from "react";
import { Card, CardContent, Button } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { Diagram, DiagramInfo } from "../../models";
import SaveIcon from "@material-ui/icons/Save";
import RemoveRedEyeIcon from "@material-ui/icons/RemoveRedEye";
import DataService from "../../services/data.service";
import { Link, Redirect } from "react-router-dom";

interface InfoProps {
  diagramInfo: DiagramInfo;
  saveDiagram: Function;
  deleteDiagram: Function;
}

interface InfoState {
  isClassifier: boolean;
  onDelete: boolean;
}

export default class Info extends React.Component<InfoProps, InfoState> {
  constructor(props: InfoProps) {
    super(props);
    this.state = {
      isClassifier: false,
      onDelete: false
    };
  }

  onDelete = () => {
    debugger;
    this.props.deleteDiagram();
    this.setState({ onDelete: true });
  };

  onSave = () => {
    this.props.saveDiagram();
  };

  componentDidMount() {
    debugger;
  }

  render() {
    if (this.state.onDelete) {
      return <Redirect to="/" />;
    }
    return (
      <div className="infoContainer">
        <Card>
          <CardContent>
            <h3>{this.props.diagramInfo.label}</h3>
            <p>{this.props.diagramInfo.description}</p>
            <div>
              <Button variant="contained" color="default" startIcon={<RemoveRedEyeIcon />}>
                Показать SPARQL
              </Button>
              <hr />
            </div>
            <Button variant="contained" color="secondary" startIcon={<DeleteIcon />} onClick={this.onDelete}>
              Delete
            </Button>
            <Button variant="contained" color="primary" size="small" startIcon={<SaveIcon />} onClick={this.onSave}>
              Save
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
}
