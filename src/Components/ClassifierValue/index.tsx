import React from "react";
import FilterGroup from "../FilterGroup";
import ClassifierParametersEditor from "../ClassifierParametersEditor";
import SimpleSelect from "../MUI/SimpleSelect";
import { Diagram, DiagramInfo, ClassifierParameter } from "../../models";
import "./style.css";

interface ClassifierValueProps {
  diagramInfo: DiagramInfo;
  diagram: Diagram;
  diagramFromGraph: boolean;
}
interface ClassifierValueState {
  dataType: {};
  parameters: ClassifierParameter[];
}
const dataTypes = [
  { value: "http://www.w3.org/2001/XMLSchema#string", label: "текст" },
  { value: "http://www.w3.org/2001/XMLSchema#integer", label: "целое число" },
  { value: "http://www.w3.org/2001/XMLSchema#boolean", label: "нецелое число" },
  { value: "http://www.w3.org/2001/XMLSchema#date", label: "да / нет" },
  { value: "http://www.w3.org/2001/XMLSchema#dateTime", label: "дата и время" },
  { value: "http://www.w3.org/2001/XMLSchema#gYear", label: "календарный год" }
];
export default class ClassifierValue extends React.Component<ClassifierValueProps, ClassifierValueState> {
  constructor(props: ClassifierValueProps) {
    super(props);
    this.state = {
      dataType: null,
      parameters: []
    };
  }

  onSelect = (selected: string) => {
    const selectedType = dataTypes.find(type => type.value === selected);
    this.setState({ dataType: selectedType });
  };
  onParameterAdd = (param: ClassifierParameter) => {
    let newParams = this.state.parameters;
    newParams.push(param);
    this.setState({ parameters: newParams });
  };
  componentDidMount() {
    this.setState({ parameters: this.props.diagram.inputParameters });
  }
  render() {
    return (
      <div className="classifier-value">
        <div className="classifier-value-selectType">
          <p> Тип данных:</p>
          {/* classifierValue.datatype */}
          <SimpleSelect restrictionTypes={dataTypes} onSelect={this.onSelect} />
        </div>
        <ClassifierParametersEditor
          dataTypes={dataTypes}
          parameters={this.state.parameters}
          onParameterAdd={this.onParameterAdd}
        />
        <FilterGroup groupClassName="newFilterGroup" key={0} />
      </div>
    );
  }
}
