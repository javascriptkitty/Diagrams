/**
 * @see https://github.com/jgraph/mxgraph/blob/master/javascript/src/js/handler/mxKeyHandler.js
 */
declare class mxKeyHandler {

  constructor(graph: mxGraph);
  constructor(graph: mxGraph, target: any);

  bindKey(code: number, funct: (evt: any) => void): void;

}
