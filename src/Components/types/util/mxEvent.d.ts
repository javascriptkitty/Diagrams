/**
 * @see https://github.com/jgraph/mxgraph/blob/master/javascript/src/js/util/mxEvent.js
 */
declare class mxEvent {
  static ADD: string;
  static REMOVE: string;
  static CONNECT_cell: mxCell;
  static CELL_CONNECTED: string;
  static CELLS_RESIZED: string;
  static CELLS_ADDED: string;
  static CELLS_REMOVED: string;
  static ADD_CELLS: string;
  static CHANGE: string;

  static addListener(element: any, event: string, func: (evt: any) => void);

  /**
   *
   * @param evt
   * @param preventDefault
   * @param stopPropagation
   *
   * @see https://github.com/jgraph/mxgraph/blob/master/javascript/src/js/util/mxEvent.js#L641
   */
  static consume(evt: any, preventDefault?: boolean, stopPropagation?: boolean);
}
