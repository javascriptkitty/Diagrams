import React from "react";
import { TextField, Button, IconButton } from "@material-ui/core";
import { Card, CardContent } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import "./style.css";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";

const CreateNew = (props: any) => {
  let type: string;
  let url: string;
  const id: number = 1;
  if (props.match.params.type == "classifiers-entity") {
    type = "классификатор сущности";
    url = "classifiers";
  } else if (props.match.params.type == "classifiers-relation") {
    type = "классификатор связи";
    url = "classifiers";
  } else if (props.match.params.type == "classifiers-value") {
    type = "классификатор значения";
    url = "classifiers";
  } else {
    type = "индикатор";
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
            <h1>Новый {type} </h1>
            <form>
              <TextField
                id="outlined-basic"
                label="Название"
                variant="outlined"
                helperText="Максимальная длина 45 символом"
              />
              <TextField id="outlined-multiline-static" label="Описание" multiline rows="4" variant="outlined" />
              <Button variant="contained" color="primary">
                {" "}
                <Link to={`/${url}/${id}`}> Создать</Link>
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default CreateNew;
