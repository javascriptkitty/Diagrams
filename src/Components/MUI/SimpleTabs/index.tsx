import React, { useState, useEffect } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import DataModel from "../../DataModel";
import SimpleMenu from "../Menu/index";
import DataService from "../../../services/data.service";
import { VisualQueryType, DiagramInfo } from "../../../models";
import { Link } from "react-router-dom";
import "./style.css";

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  }
}));

export default function SimpleTabs(props: TabPanelProps) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const [list, getList] = React.useState({ indicators: [], classifiers: [] });

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    Promise.all([
      DataService.getProjectDiagramInfos("2030cd40e03dc5b7d2aef75c39008142", [VisualQueryType.INDICATOR]),
      DataService.getProjectDiagramInfos("2030cd40e03dc5b7d2aef75c39008142", [
        VisualQueryType.ENTITY_CLASSIFIER,
        VisualQueryType.RELATION_CLASSIFIER,
        VisualQueryType.VALUE_CLASSIFIER
      ])
    ]).then(([res1, res2]) => {
      getList({ indicators: res1, classifiers: res2 });
      //error
    });
  });

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs centered value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="Индикаторы" {...a11yProps(0)} />
          <Tab label="Классификаторы" {...a11yProps(1)} />
          <Tab label="Модель данных" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <div className="addButton">
        <SimpleMenu value={value} />
      </div>
      <Paper className={classes.root}>
        <TabPanel value={value} index={0}>
          {list.indicators.map((el, index) => {
            return (
              <Link to={{ pathname: `/diagrams/${el._id}`, state: { info: el } }} key={index}>
                <div className="elName">
                  <div className="elName-top">
                    <h3>{el.label}</h3> <span>{el.modifiedAt.substr(0, 10)}</span>
                  </div>
                  <p>{el.description}</p>
                </div>
              </Link>
            );
          })}
        </TabPanel>
        <TabPanel value={value} index={1}>
          {list.classifiers.map((el, index) => {
            return (
              <Link to={{ pathname: `/diagrams/${el._id}`, state: { info: el } }} key={index}>
                <div className="elName">
                  <div className="elName-top">
                    <h3>{el.label}</h3> <span>{el.modifiedAt.substr(0, 10)}</span>
                  </div>
                  <p>{el.description}</p>
                </div>
              </Link>
            );
          })}
        </TabPanel>
        <TabPanel value={value} index={2}>
          <div className="uploadModel">
            <DataModel />
          </div>
        </TabPanel>
      </Paper>
    </div>
  );
}
