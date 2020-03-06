import { JsonConverter, JsonCustomConvert, JsonObject, JsonProperty } from "json2typescript";
import Json2TypescriptService from "./services/json2typescript";
import { CouchDBDocument } from "./services/couchdb";

@JsonObject("Filter")
export abstract class Filter {
  abstract toString(): string;
}

export enum SimpleFilterOperator {
  EQUAL = "EQUAL",
  LESS_OR_EQUAL = "LESS_OR_EQUAL",
  MORE_OR_EQUAL = "MORE_OR_EQUAL",
  LESS = "LESS",
  MORE = "MORE",
  SPARQL_EXP = "SPARQL_EXP"
}

@JsonConverter
export class SimpleFilterOperatorConverter implements JsonCustomConvert<SimpleFilterOperator> {
  deserialize(data: string): SimpleFilterOperator {
    return data as SimpleFilterOperator;
  }

  serialize(data: SimpleFilterOperator): string {
    return SimpleFilterOperator[data];
  }
}

@JsonObject("SimpleFilter")
export class SimpleFilter extends Filter {
  @JsonProperty("operator", SimpleFilterOperatorConverter)
  operator: SimpleFilterOperator = SimpleFilterOperator.EQUAL;
  @JsonProperty("value", String)
  value: string = null;

  constructor(operator?: SimpleFilterOperator, value?: string) {
    super();
    this.operator = operator || SimpleFilterOperator.EQUAL;
    this.value = value || null;
  }

  public getSPARQLOperator(): string {
    switch (this.operator) {
      case SimpleFilterOperator.EQUAL:
        return "=";
      case SimpleFilterOperator.LESS_OR_EQUAL:
        return "<=";
      case SimpleFilterOperator.MORE_OR_EQUAL:
        return ">=";
      case SimpleFilterOperator.LESS:
        return "<";
      case SimpleFilterOperator.MORE:
        return ">";
      case SimpleFilterOperator.SPARQL_EXP:
        return "sparql_exp";
    }
  }

  public toString(): string {
    return this.getSPARQLOperator() + " " + this.value;
  }
}

export enum FilterGroupOperator {
  AND = "AND",
  OR = "OR"
}

@JsonConverter
export class FilterGroupOperatorConverter implements JsonCustomConvert<FilterGroupOperator> {
  deserialize(data: string): FilterGroupOperator {
    return data as FilterGroupOperator;
  }

  serialize(data: FilterGroupOperator): string {
    return FilterGroupOperator[data];
  }
}

@JsonConverter
export class FilterArrayConverter implements JsonCustomConvert<Filter[]> {
  private simpleFilterOperatorConverter = new SimpleFilterOperatorConverter();
  private filterGroupOperatorConverter = new FilterGroupOperatorConverter();

  deserialize(data: [object]): Filter[] {
    return [];
    //   return data.map(filter => {
    //     if ("filters" in filter && "operator" in filter) {
    //       const obj = new FilterGroup();
    //       obj.operator = this.filterGroupOperatorConverter.deserialize(filter["operator"]);
    //       obj.filters = this.deserialize(filter["filters"]);
    //       return obj;
    //     } else if ("value" in filter && "operator" in filter) {
    //       const obj = new SimpleFilter();
    //       obj.operator = this.simpleFilterOperatorConverter.deserialize(filter["operator"]);
    //       obj.value = filter["value"];
    //       return obj;
    //     }
    //   }, this);
  }

  serialize(data: Filter[]): any {
    return JSON.stringify(data);
  }
}

@JsonObject("FilterGroup")
export class FilterGroup extends Filter {
  @JsonProperty("operator", FilterGroupOperatorConverter)
  operator: FilterGroupOperator = FilterGroupOperator.AND;
  @JsonProperty("filters", FilterArrayConverter)
  filters: Array<Filter> = [];

  public isEmpty(): boolean {
    if (this.filters.length === 0) {
      return true;
    }

    const index = this.filters.findIndex(filter => {
      if (filter instanceof SimpleFilter) {
        return true;
      } else if (filter instanceof FilterGroup) {
        return filter.isEmpty();
      }

      return false;
    });

    return index < 0;
  }

  public getSPARQLOperator(): string {
    switch (this.operator) {
      case FilterGroupOperator.AND:
        return "&&";
      case FilterGroupOperator.OR:
        return "||";
    }
  }

  public toString(): string {
    if (this.filters.length === 0) {
      return "";
    }
    if (this.filters.length === 1) {
      const firstFilter = this.filters[0];
      if (firstFilter instanceof SimpleFilter) {
        const simpleFilter = firstFilter as SimpleFilter;
        if (simpleFilter.operator === SimpleFilterOperator.SPARQL_EXP) {
          return "...";
        }
      }
      return firstFilter.toString();
    }
    return "...";
  }
}

@JsonConverter
export class DiagramValueRestrictionConverter
  implements JsonCustomConvert<SimpleFilterRestriction | ClassifierRestriction> {
  deserialize(data: any): SimpleFilterRestriction | ClassifierRestriction {
    if ("filter" in data) {
      return Json2TypescriptService.converter().deserializeObject(data, SimpleFilterRestriction);
    } else {
      return Json2TypescriptService.converter().deserializeObject(data, ClassifierRestriction);
    }
  }

  serialize(data: SimpleFilterRestriction | ClassifierRestriction): any {
    return data;
  }
}

@JsonConverter
export class DiagramRelationRestrictionConverter
  implements JsonCustomConvert<OntologyRelation | ClassifierRestriction> {
  deserialize(data: any): OntologyRelation | ClassifierRestriction {
    if ("uri" in data) {
      return Json2TypescriptService.converter().deserializeObject(data, OntologyRelation);
    } else {
      return Json2TypescriptService.converter().deserializeObject(data, ClassifierRestriction);
    }
  }

  serialize(data: OntologyRelation | ClassifierRestriction): any {
    return data;
  }
}

@JsonObject("SimpleFilterRestriction")
export class SimpleFilterRestriction {
  @JsonProperty("filter", FilterGroup)
  filter: FilterGroup = new FilterGroup();

  public toString(): string {
    return this.filter.toString();
  }
}

@JsonObject("ClassifierRestrictionParameter")
export class ClassifierRestrictionParameter {
  @JsonProperty("name", String, true)
  name: string = undefined;

  @JsonProperty("datatype", String, true)
  datatype: string = null;

  @JsonProperty("value", String, true)
  value: string = "";

  constructor(name?: string, datatype?: string, value?: string) {
    this.name = name || null;
    this.datatype = datatype || null;
    this.value = value || "";
  }
}

@JsonObject("Geometry")
export class Geometry {
  @JsonProperty("x", Number)
  x: number = undefined;

  @JsonProperty("y", Number)
  y: number = undefined;

  @JsonProperty("width", Number)
  width: number = undefined;

  @JsonProperty("height", Number)
  height: number = undefined;
  @JsonProperty("parent", String, true)
  parent?: string = undefined;

  constructor(x?: number, y?: number, width?: number, height?: number, parent?: string) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.parent = parent;
  }
}

@JsonObject("ClassifierRestriction")
export class ClassifierRestriction {
  @JsonProperty("id", String)
  id: string = undefined;

  @JsonProperty("label", String)
  label: string = undefined;

  @JsonProperty("inputParameters", [ClassifierRestrictionParameter], true)
  inputParameters: ClassifierRestrictionParameter[] = [];

  @JsonProperty("resultVarName", String, true)
  resultVarName?: string = null;

  constructor(id?: string, label?: string, inputParameters?: ClassifierRestrictionParameter[], resultVarName?: string) {
    this.id = id;
    this.label = label;
    this.inputParameters = inputParameters || [];
    this.resultVarName = resultVarName || null;
  }

  public toString(): string {
    return this.label || "";
  }
}

@JsonObject("DiagramValue")
export class DiagramValue {
  @JsonProperty("id", String)
  id: string = null;

  @JsonProperty("restriction", DiagramValueRestrictionConverter, true)
  restriction?: SimpleFilterRestriction | ClassifierRestriction = null;

  /**
   * By default, it's assumed to be `xsd:string`.
   */
  @JsonProperty("datatype", String)
  datatype?: string = null;

  @JsonProperty("geometry", Geometry, false)
  geometry?: Geometry = undefined;

  constructor(id?: string) {
    this.id = id;
  }

  public onRelationChanged(relation?: OntologyRelation): void {
    debugger;
    if (relation != null && relation.rangeUri && relation.rangeUri != null) {
      this.datatype = relation.rangeUri;
    } else {
      this.datatype = "string";
    }
  }

  public toString(): string {
    if (this.restriction == null) {
      return "";
    }

    return this.restriction.toString() || "";
  }
}

@JsonObject("OntologyResource")
export class OntologyResource {
  @JsonProperty("uri", String)
  uri: string = null;
  @JsonProperty("label", String)
  label: string = null;
  @JsonProperty("description", String, true)
  description?: string = null;
}

@JsonObject("OntologyEntity")
export class OntologyEntity extends OntologyResource {}

@JsonObject("OntologyRelation")
export class OntologyRelation extends OntologyResource {
  @JsonProperty("isDatatypeProperty", Boolean, true)
  isDatatypeProperty?: boolean = false;
  @JsonProperty("isObjectProperty", Boolean, true)
  isObjectProperty?: boolean = false;
  @JsonProperty("rangeUri", String)
  rangeUri?: string;
}

@JsonObject("AggregateRestriction")
export class AggregateRestriction {
  // @JsonProperty("id", String)
  // id: string = undefined;
  @JsonProperty("uri", String)
  uri: string = null;
  @JsonProperty("label", String)
  label: string = undefined;
  @JsonProperty("isDatatypeProperty", Boolean, true)
  isDatatypeProperty = false;
  @JsonProperty("isObjectProperty", Boolean, true)
  isObjectProperty = true;
  @JsonProperty("rangeUri", String)
  rangeUri: string;
  @JsonProperty("inputParameters", [ClassifierRestrictionParameter], true)
  inputParameters: ClassifierRestrictionParameter[] = [];

  constructor(
    // id?: string,
    label?: string,
    inputParameters?: ClassifierRestrictionParameter[]
  ) {
    // this.id = id;
    this.label = label;
    this.inputParameters = inputParameters || [];
  }

  public toString(): string {
    return this.label || "";
  }
}

@JsonObject("TitleBlock")
export class TitleBlock {
  @JsonProperty("id", String)
  id: string = undefined;

  @JsonProperty("type", String)
  type: string = "border";

  @JsonProperty("geometry", Geometry, false)
  geometry?: Geometry = undefined;

  constructor(id?: string) {
    this.id = id;
  }
}

@JsonObject("DiagramEntity")
export class DiagramEntity {
  @JsonProperty("id", String)
  id: string = null;

  @JsonProperty("restriction", OntologyEntity, true)
  restriction?: OntologyEntity = null;

  @JsonProperty("classifierRestriction", ClassifierRestriction, true)
  classifierRestriction?: ClassifierRestriction = null;

  @JsonProperty("geometry", Geometry, false)
  geometry?: Geometry = undefined;

  constructor(id?: string) {
    this.id = id;
  }

  public toString(): string {
    if (this.restriction == null) {
      return "";
    }

    return this.restriction.label || "";
  }
  type?: string = "Entity";
}

@JsonObject("DiagramAggregate")
export class DiagramAggregate {
  @JsonProperty("id", String)
  id: string = null;

  @JsonProperty("restriction", AggregateRestriction, true)
  restriction?: AggregateRestriction = null;
  @JsonProperty("classifierRestriction", ClassifierRestriction, true)
  classifierRestriction?: ClassifierRestriction = null;

  @JsonProperty("geometry", Geometry, false)
  geometry?: Geometry = undefined;

  constructor(id?: string) {
    this.id = id;
  }

  public toString(): string {
    if (this.restriction == null) {
      return "";
    }

    return this.restriction.label || "";
  }
  type?: string = "Aggregate";
}

@JsonObject("DiagramRelation")
export class DiagramRelation {
  @JsonProperty("sourceId", String)
  sourceId: string = null;
  @JsonProperty("targetId", String)
  targetId: string = null;
  @JsonProperty("restriction", DiagramRelationRestrictionConverter, true)
  restriction?: OntologyRelation | ClassifierRestriction | AggregateRestriction = null;
  @JsonProperty("resultVarName", String)
  resultVarName: string = null;

  @JsonProperty("includeInStatistic", Boolean, true)
  includeInStatistic?: boolean = false;

  public toString(): string {
    if (this.resultVarName != null) {
      return this.resultVarName;
    } else if (this.restriction == null) {
      return "";
    }

    return this.restriction.label || "";
  }
}

export enum VisualQueryType {
  INDICATOR = "INDICATOR",
  ENTITY_CLASSIFIER = "ENTITY_CLASSIFIER",
  RELATION_CLASSIFIER = "RELATION_CLASSIFIER",
  VALUE_CLASSIFIER = "VALUE_CLASSIFIER"
}

@JsonConverter
export class VisualQueryTypeConverter implements JsonCustomConvert<VisualQueryType> {
  deserialize(data: string): VisualQueryType {
    return data as VisualQueryType;
  }

  serialize(data: VisualQueryType): string {
    return VisualQueryType[data];
  }
}

@JsonObject("DiagramInfo")
export class DiagramInfo {
  @JsonProperty("_id", String)
  _id: string = undefined;
  @JsonProperty("_rev", String)
  _rev: string = undefined;

  @JsonProperty("type", String)
  type: string = undefined;

  @JsonProperty("label", String)
  label?: string = undefined;

  @JsonProperty("description", String, true)
  description?: string = null;

  @JsonProperty("modifiedAt", String, true)
  modifiedAt?: string = new Date().toISOString();

  @JsonProperty("projectId", String, true)
  projectId?: string = null;

  @JsonProperty("libraryDiagram", Boolean, true)
  libraryDiagram?: boolean = false;

  constructor(diagramInfo: {
    type?: string;
    label?: string;
    description?: string;
    projectId?: string;
    libraryDiagram?: boolean;
  }) {
    this.type = diagramInfo.type || null;
    this.label = diagramInfo.label || null;
    this.description = diagramInfo.description || null;
    this.projectId = diagramInfo.projectId || null;
    this.libraryDiagram = diagramInfo.libraryDiagram || false;
  }
}

@JsonObject("ClassifierParameter")
export class ClassifierParameter {
  @JsonProperty("datatype", String)
  datatype: string = null;

  @JsonProperty("name", String)
  name: string = null;

  @JsonProperty("defaultValue", String)
  defaultValue: string = "";

  constructor(datatype?: string, name?: string, defaultValue?: string) {
    this.datatype = datatype || null;
    this.name = name || null;
    this.defaultValue = defaultValue || "";
  }
}

@JsonObject("VisualQuery")
export class VisualQuery implements CouchDBDocument {
  @JsonProperty("_id", String)
  _id: string = null;
  @JsonProperty("_rev", String)
  _rev: string = null;

  @JsonProperty("queryType", VisualQueryTypeConverter)
  queryType: VisualQueryType = undefined;

  @JsonProperty("inputParameters", [ClassifierParameter], true)
  inputParameters?: ClassifierParameter[] = [];

  constructor(_id?: string, queryType?: VisualQueryType, inputParameters?: ClassifierParameter[]) {
    this._id = _id;
    this.queryType = queryType;
    this.inputParameters = inputParameters || [];
  }

  public static convertToSubClass<T extends VisualQuery>(query: T): T {
    switch (query.queryType) {
      case VisualQueryType.INDICATOR:
        // @ts-ignore
        return Json2TypescriptService.converter().deserializeObject(query, Diagram);
      case VisualQueryType.ENTITY_CLASSIFIER:
        // @ts-ignore
        return Json2TypescriptService.converter().deserializeObject(query, ClassifierEntityQuery);
      case VisualQueryType.RELATION_CLASSIFIER:
        // @ts-ignore
        return Json2TypescriptService.converter().deserializeObject(query, ClassifierRelationQuery);
      case VisualQueryType.VALUE_CLASSIFIER:
        // @ts-ignore
        return Json2TypescriptService.converter().deserializeObject(query, ClassifierValueQuery);
    }
  }
}

@JsonObject("Diagram")
export class Diagram extends VisualQuery {
  @JsonProperty("entities", [DiagramEntity])
  entities: DiagramEntity[] = [];

  @JsonProperty("values", [DiagramValue])
  values: DiagramValue[] = [];
  @JsonProperty("relations", [DiagramRelation])
  relations: DiagramRelation[] = [];
  @JsonProperty("expression", String, true)
  expression?: string = null;
  @JsonProperty("statisticIndicator", Boolean, true)
  statisticIndicator: boolean = false;
  @JsonProperty("titleBlock", [TitleBlock], true)
  titleBlock?: TitleBlock[] = [];
  @JsonProperty("aggregate", [DiagramAggregate], true)
  aggregate?: DiagramAggregate[] = [];

  constructor(
    _id?: string,
    entities?: DiagramEntity[],
    values?: DiagramValue[],
    relations?: DiagramRelation[],
    expression?: string,
    statisticIndicator?: boolean,
    titleBlock?: TitleBlock[],
    aggregate?: DiagramAggregate[]
  ) {
    super(_id, VisualQueryType.INDICATOR);
    this.entities = entities || [];
    this.values = values || [];
    this.relations = relations || [];

    this.expression = expression || null;
    this.statisticIndicator = statisticIndicator || false;
    this.titleBlock = titleBlock || [];
    this.aggregate = aggregate || [];
  }
}

@JsonObject("ClassifierEntityQuery")
export class ClassifierEntityQuery extends VisualQuery {
  @JsonProperty("sparqlQuery", String, true)
  sparqlQuery?: string = null;

  @JsonProperty("entities", [DiagramEntity], true)
  entities: DiagramEntity[] = [];
  @JsonProperty("aggregate", [DiagramAggregate], true)
  aggregate?: DiagramAggregate[] = [];
  @JsonProperty("values", [DiagramValue], true)
  values: DiagramValue[] = [];
  @JsonProperty("relations", [DiagramRelation], true)
  relations: DiagramRelation[] = [];
  @JsonProperty("titleBlock", [TitleBlock], true)
  titleBlock?: TitleBlock[] = [];
  @JsonProperty("expression", String, true)
  expression?: string = null;

  constructor(_id?: string, sparqlQuery?: string, inputParameters?: ClassifierParameter[]) {
    super(_id, VisualQueryType.ENTITY_CLASSIFIER, inputParameters);
    this.sparqlQuery = sparqlQuery || null;

    this.entities = [];
    this.aggregate = [];
    this.titleBlock = [];
    this.values = [];
    this.relations = [];
    this.expression = null;
  }
}

@JsonObject("ClassifierRelationQuery")
export class ClassifierRelationQuery extends VisualQuery {
  @JsonProperty("sparqlQuery", String, true)
  sparqlQuery?: string = null;

  @JsonProperty("entities", [DiagramEntity], true)
  entities: DiagramEntity[] = [];
  @JsonProperty("values", [DiagramValue], true)
  values: DiagramValue[] = [];
  @JsonProperty("relations", [DiagramRelation], true)
  relations: DiagramRelation[] = [];
  @JsonProperty("titleBlock", [TitleBlock])
  titleBlock?: TitleBlock[] = [];
  @JsonProperty("expression", String, true)
  expression?: string = null;

  constructor(_id?: string, sparqlQuery?: string, inputParameters?: ClassifierParameter[]) {
    super(_id, VisualQueryType.RELATION_CLASSIFIER, inputParameters);
    this.sparqlQuery = sparqlQuery || null;

    this.entities = [];
    this.values = [];
    this.relations = [];
    this.titleBlock = [];
    this.expression = null;
  }
}

@JsonObject("ClassifierValueQuery")
export class ClassifierValueQuery extends VisualQuery {
  @JsonProperty("restriction", SimpleFilterRestriction, true)
  restriction?: SimpleFilterRestriction = null;

  /**
   * By default, it's assumed to be `http://www.w3.org/2001/XMLSchema#string`.
   */
  @JsonProperty("datatype", String, true)
  datatype?: string = null;

  constructor(
    _id?: string,
    restriction?: SimpleFilterRestriction,
    datatype?: string,
    inputParameters?: ClassifierParameter[]
  ) {
    super(_id, VisualQueryType.VALUE_CLASSIFIER, inputParameters);
    this.restriction = restriction || null;
    this.datatype = datatype || null;
  }
}
