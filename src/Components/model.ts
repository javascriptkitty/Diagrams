import {
  JsonConverter,
  JsonCustomConvert,
  JsonObject,
  JsonProperty,
  Any
} from "json2typescript";

@JsonObject("TitleBlock")
export class TitleBlock {
  @JsonProperty("id", String)
  id: string = undefined;

  @JsonProperty("type", String)
  type: string = "border";

  //   @JsonProperty("geometry", Geometry, false)
  //   geometry?: Geometry = undefined;

  constructor(id?: string) {
    this.id = id;
  }
}

@JsonObject("DiagramEntity")
export class DiagramEntity {
  @JsonProperty("id", String)
  id: string = null;

  // @JsonProperty("restriction", OntologyEntity, true)
  // restriction?: OntologyEntity = null;

  // @JsonProperty("classifierRestriction", ClassifierRestriction, true)
  // classifierRestriction?: ClassifierRestriction = null;

  // @JsonProperty("geometry", Geometry, false)
  // geometry?: Geometry = undefined;

  // constructor(id?: string) {
  //   this.id = id;
  // }

  // public toString(): string {
  //   if (this.restriction == null) {
  //     return "";
  //   }

  //   return this.restriction.label || "";
  // }
  // type?: string = "Entity";
}
