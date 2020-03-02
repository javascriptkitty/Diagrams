/**
 * @see https://github.com/jgraph/mxgraph/blob/master/javascript/src/js/model/mxGraphModel.js
 */
declare class mxGraphModel {
  /**
   * @see https://github.com/jgraph/mxgraph/blob/master/javascript/src/js/model/mxGraphModel.js#L1921
   */
  beginUpdate(): void;

  /**
   * @see https://github.com/jgraph/mxgraph/blob/master/javascript/src/js/model/mxGraphModel.js#L1946
   */
  endUpdate(): void;

  /**
   *
   * @param cell
   * @param value
   *
   * @see https://github.com/jgraph/mxgraph/blob/master/javascript/src/js/model/mxGraphModel.js#L1608
   */
  setValue(cell: mxCell, value: any): any;

  cloneCell(cell: any): any;
}
