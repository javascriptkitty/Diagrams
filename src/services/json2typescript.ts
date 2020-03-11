import { JsonConvert, OperationMode, ValueCheckingMode } from "json2typescript";

const j2tConverter = new JsonConvert();
j2tConverter.operationMode = OperationMode.ENABLE;
j2tConverter.ignorePrimitiveChecks = false;
j2tConverter.valueCheckingMode = ValueCheckingMode.ALLOW_NULL;

class Json2TypescriptService {
  public static converter(): JsonConvert {
    return j2tConverter;
  }

  /**
   * @deprecated
   * @see deserializeObject
   */
  converter(): JsonConvert {
    return j2tConverter;
  }

  deserializeObject<T>(jsonObject: any, classReference: new () => T): T {
    return this.converter().deserializeObject(jsonObject, classReference);
  }

  clone<T>(obj: T, classReference: new () => T): T {
    return this.converter().deserializeObject(JSON.parse(JSON.stringify(obj)), classReference);
  }
}

export default new Json2TypescriptService();
