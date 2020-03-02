/**
 * @see https://github.com/jgraph/mxgraph/blob/master/javascript/src/js/util/mxUtils.js
 */
declare var mxUtils: {
  /**
   *
   * @param message
   * @param width
   * @param close
   * @param icon
   */
  error(message: string, width: number, close?: boolean, icon?: any);

  makeDraggable(
    element: any,
    graphF: mxGraph,
    funct: (graph: mxGraph, evt: any, cell: mxCell, x: number, y: number) => void,
    dragElement?: any,
    dx?: number,
    dy?: number,
    autoscroll?: boolean,
    scalePreview?: boolean,
    highlightDropTargets?: boolean,
    getDropTarget?: (x: number, y: number) => void
  );

  setOpacity(node: Node, value: number): void;
};
