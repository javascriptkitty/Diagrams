import React, { useState, useEffect } from "react";
import { Card, CardContent, Button, Grid } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import DataService from "../../services/data.service";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& > *": {
        margin: theme.spacing(1)
      }
    },
    input: {
      display: "none"
    }
  })
);

interface ModelProps {
  //   index: any;
  //   value: any;
}

enum UploadState {
  SELECT,
  UPLOADING,
  DONE
}

export default function DataModel(props: ModelProps) {
  const classes = useStyles();
  const [uploadState, setUploadState] = React.useState({ uploadState: UploadState.SELECT });
  const [dataModelExists, setDataModelExists] = React.useState(false);

  useEffect(() => {
    DataService.dataModelExists().then(exists => {
      setDataModelExists(exists);
    });
  });

  const notify = () => toast("Модель данных обновлена', 'Модель данных была успешно обновлена!");

  function fileInputChange(file: any) {
    setUploadState({ uploadState: UploadState.UPLOADING });

    DataService.uploadDataModel(file).then(() => {
      debugger;

      setDataModelExists(true);
      // TODO: SAVE FILES
    });
  }

  let cn;
  let uploadMessage;

  switch (uploadState.uploadState) {
    case UploadState.SELECT:
      cn = "uploadstate-select";
      uploadMessage = "Модель данных не загружена";
      break;
    case UploadState.UPLOADING:
    case UploadState.DONE:
      cn = "uploadstate-uploading";
      uploadMessage = "Модель данных загружена";
      break;
  }

  return (
    <Grid container item xs={12} sm={10} md={6}>
      <Card>
        <CardContent>
          <h3>Модель данных</h3>
          <div className={cn}>{uploadMessage}</div>

          <form>
            <input
              onChange={fileInputChange}
              accept=".ttl"
              className={classes.input}
              id="contained-button-file"
              name="file"
              type="file"
            />
            <label htmlFor="contained-button-file">
              <div className="uploadButton">
                <Button variant="contained" color="primary" component="span">
                  Upload
                </Button>{" "}
                <span>Поддерживаются файлы в формате RDF/Turtle (.ttl)</span>{" "}
              </div>
            </label>
          </form>
        </CardContent>
      </Card>
    </Grid>
  );
}
