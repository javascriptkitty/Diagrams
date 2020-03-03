/******************      Model         **************/

/**
 * @see https://github.com/jgraph/mxgraph/blob/master/javascript/src/js/model/mxCell.js
 */
declare class mxCell {
  id: any;
  value;
  geometry;
  style;
  vertex;
  edge;
  connectable;
  visible;
  collapsed;
  parent;
  source;
  target;
  // type;

  /**
   * @see https://github.com/jgraph/mxgraph/blob/master/javascript/src/js/model/mxCell.js#L169
   */
  children: mxCell[];
  edges;
  mxTransient;

  /**
   *
   * @param value
   * @param geometry
   * @param style
   *
   * @see https://github.com/jgraph/mxgraph/blob/master/javascript/src/js/model/mxCell.js#L67
   */
  constructor(value?: any, geometry?: mxGeometry, style?: string);

  getId();

  setId(id);

  getValue(): any;

  /**
   *
   * @param value
   *
   * @see https://github.com/jgraph/mxgraph/blob/master/javascript/src/js/model/mxCell.js#L227
   */
  setValue(value: any);

  valueChanged(newValue: any): any;

  getGeometry();

  setGeometry(geometry);

  getStyle();

  setStyle(style);

  isVertex();

  setVertex(vertex);

  isEdge();

  setEdge(edge);

  isConnectable();

  setConnectable(connectable);

  isVisible();

  setVisible(visible);

  isCollapsed();

  setCollapsed(collapsed);

  getParent();

  setParent(parent);

  getTerminal(source);

  setTerminal(terminal, isSource);

  getChildCount();

  getIndex(child);

  getChildAt(index);

  insert(child, index);

  remove(index);

  removeFromParent();

  /**
   * @see https://github.com/jgraph/mxgraph/blob/master/javascript/src/js/model/mxCell.js#L606
   */
  getEdgeCount(): number;

  getEdgeIndex(edge);

  getEdgeAt(index);

  insertEdge(edge, isOutgoing);

  removeEdge(edge, isOutgoing);

  removeFromTerminal(isSource);

  getAttribute(name, defaultValue);

  setAttribute(name, value);

  /**
   * Returns a clone of the cell.  Uses cloneValue to clone the user object.  All fields in mxTransient are ignored during the cloning.
   */
  clone(): mxCell;

  cloneValue();
}

/******************      Model end     **************/
