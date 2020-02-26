import React from "react";
import { TextField, Button, IconButton } from "@material-ui/core";
import { Card, CardContent } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import "./style.css";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";

const CreateNew = () => {
  return (
    <Grid container item xs={8} lg={10}>
      <Card>
        <CardContent>
          <div className="closeBtn">
            <Link to="/" aria-label="delete">
              <CloseIcon />
            </Link>
          </div>
          <div className="newItem">
            <h1>New</h1>
            <form>
              <TextField
                id="outlined-basic"
                label="Название"
                variant="outlined"
                helperText="Максимальная длина 45 символом"
              />
              <TextField id="outlined-multiline-static" label="Описание" multiline rows="4" variant="outlined" />
              <Button variant="contained" color="primary" href="#contained-buttons">
                Создать
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default CreateNew;
