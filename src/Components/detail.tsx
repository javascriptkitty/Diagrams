import React from "react";
import { RouteComponentProps } from "react-router-dom";

export default class Detail extends React.Component<IDetailProps, IDetailState> {
  constructor(props: IDetailProps) {
    super(props);
    this.state = {
      id: this.props.match.params.id
    };
  }
  render() {
    return <h1>{this.state.id}</h1>;
  }
}

interface IDetailProps extends RouteComponentProps<{ id: string }> {}

interface IDetailState {
  id: string;
}
