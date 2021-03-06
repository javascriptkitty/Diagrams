import React from "react";
import { Card, CardContent, Button } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

import SaveIcon from "@material-ui/icons/Save";
import RemoveRedEyeIcon from "@material-ui/icons/RemoveRedEye";
interface InfoProps {
  label: string;
  description: string;
}

interface InfoState {
  isClassifier: boolean;
}

export default class Info extends React.Component<InfoProps, InfoState> {
  constructor(props: InfoProps) {
    super(props);
    this.state = {
      isClassifier: false
    };
  }

  componentDidMount() {}

  render() {
    return (
      <div className="infoContainer">
        <Card>
          <CardContent>
            <h3>{this.props.label}</h3>
            <p>{this.props.description}</p>
            <div>
              <Button variant="contained" color="default" startIcon={<RemoveRedEyeIcon />}>
                Показать SPARQL
              </Button>
              <hr />
            </div>
            <Button variant="contained" color="secondary" startIcon={<DeleteIcon />}>
              Delete
            </Button>
            <Button variant="contained" color="primary" size="small" startIcon={<SaveIcon />}>
              Save
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
}
