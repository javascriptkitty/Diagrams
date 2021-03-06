import React from "react";
import { TextField, Button } from "@material-ui/core";
import { Card, CardContent } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import "./style.css";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";

interface CreateProps {
  match: any;
  params: any;
}

interface CreateState {
  description: string;
  type: string;
  label: string;
  _id: string;
  _rev: string;
  modifiedAt: string;
}

export default class CreateNew extends React.Component<CreateProps, CreateState> {
  type: string;
  url: string;

  constructor(props: CreateProps) {
    super(props);
    this.state = {
      description: "",
      label: "",
      type: "",
      _id: "",
      _rev: "",
      modifiedAt: new Date().toISOString()
    };

    this.onChangeLabel = this.onChangeLabel.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
  }

  onChangeLabel(e: any) {
    this.setState({
      label: e.target.value
    });
  }

  onChangeDescription(e: any) {
    this.setState({
      description: e.target.value
    });
  }

  onSubmit(e: any) {
    debugger;
    e.preventDefault();
    // const info = {
    //   label: this.state.label,
    //   description: this.state.description,
    //   type: this.type
    // };

    console.log(this.state);

    // });
    //   axios.post("/api/", info).then(res => {
    //     // debugger;;
    //     this.setState({ _id: res.data._id, _rev:res.data._rev });
    //   });
  }
  componentDidMount() {
    this.setState({ type: this.type });
  }

  render() {
    let name: string;

    if (this.props.match.params.type === "classifiers-entity") {
      name = "классификатор сущности";
      this.type = "ENTITY_CLASSIFIER";
      this.url = "classifiers";
    } else if (this.props.match.params.type === "classifiers-relation") {
      name = "классификатор связи";
      this.type = "RELATION_CLASSIFIER";
      this.url = "classifiers";
    } else if (this.props.match.params.type === "classifiers-value") {
      name = "классификатор значения";
      this.type = "VALUE_CLASSIFIER";
      this.url = "classifiers";
    } else {
      name = "индикатор";
      this.type = "INDICATOR";
      this.url = "indicators";
    }

    return (
      <Grid container item sm={10} lg={8}>
        <div className="createNew">
          <Card>
            <CardContent>
              <div className="closeBtn">
                <Link to="/">
                  <CloseIcon />
                </Link>
              </div>
              <div className="newItem">
                <h1>Новый {name} </h1>
                <form onSubmit={this.onSubmit.bind(this)}>
                  <TextField
                    id="outlined-basic"
                    label="Название"
                    variant="outlined"
                    helperText="Максимальная длина 45 символом"
                    value={this.state.label}
                    onChange={this.onChangeLabel}
                  />
                  <TextField
                    id="outlined-multiline-static"
                    label="Описание"
                    value={this.state.description}
                    onChange={this.onChangeDescription}
                    multiline
                    rows="4"
                    variant="outlined"
                  />
                  <Button variant="contained" type="submit" color="primary">
                    {" "}
                    <Link to={{ pathname: `/${this.url}/1`, state: { info: this.state } }}> Создать</Link>
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </Grid>
    );
  }
}
