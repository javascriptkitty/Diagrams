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
  type: string;
  description: string;
  title: string;
}

export default class CreateNew extends React.Component<CreateProps, CreateState> {
  constructor(props: CreateProps) {
    super(props);
    this.state = {
      type: "",
      description: "",
      title: ""
    };

    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
  }

  onChangeTitle(e: any) {
    this.setState({
      title: e.target.value
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
    const info = {
      title: this.state.title,
      description: this.state.description,
      type: this.state.type
    };

    //   axios.post("/api/", info).then(res => {
    //     // debugger;;
    //     this.setState({ infoId: res.data.id });
    //   });
  }
  componentDidMount() {
    debugger;
    let type: string;
    if (this.props.match.params.type === "classifiers-entity") {
      type = "CLASSIFIER_ENTITY";
    } else if (this.props.match.params.type === "classifiers-relation") {
      type = "CLASSIFIER_RELATION";
    } else if (this.props.match.params.type === "classifiers-value") {
      type = "CLASSIFIER_VALUE";
    } else {
      type = "INDICATOR";
    }
    this.setState({
      type: type
    });
  }

  render() {
    let name: string;
    let url: string;
    const id: number = 1;
    if (this.props.match.params.type === "classifiers-entity") {
      name = "классификатор сущности";
      url = "classifiers";
    } else if (this.props.match.params.type === "classifiers-relation") {
      name = "классификатор связи";
      url = "classifiers";
    } else if (this.props.match.params.type === "classifiers-value") {
      name = "классификатор значения";
      url = "classifiers";
    } else {
      name = "индикатор";
      url = "indicators";
    }

    return (
      <Grid container item xs={10} lg={8}>
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
                  value={this.state.title}
                  onChange={this.onChangeTitle}
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
                  <Link to={{ pathname: `/${url}/${id}`, state: { info: this.state } }}> Создать</Link>
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </Grid>
    );
  }
}
