/// <reference path="model/mxCell.d.ts"/>
/// <reference path="Util.d.ts"/>
/// <reference path="View.d.ts"/>
/// <reference path="Handlers.d.ts"/>
/// <reference path="mxGraphHandler.d.ts"/>
/// <reference path="Shape.d.ts"/>

declare class mxGraph {
  constructor(container: any);

  mouseListeners;
  isMouseDown;
  model;
  view;
  stylesheet;
  selectionModel;
  cellEditor;
  cellRenderer;
  multiplicities;
  renderHint;
  dialect;
  gridSize;
  gridEnabled;
  portsEnabled;
  nativeDblClickEnabled;
  doubleTapEnabled;
  doubleTapTimeout;
  doubleTapTolerance;
  lastTouchY;
  lastTouchTime;
  tapAndHoldEnabled;
  tapAndHoldDelay;
  tapAndHoldInProgress;
  tapAndHoldValid;
  initialTouchX;
  initialTouchY;
  tolerance;
  defaultOverlap;
  defaultParent;
  alternateEdgeStyle;
  backgroundImage;
  pageVisible;
  pageBreaksVisible;
  pageBreakColor;
  pageBreakDashed;
  minPageBreakDist;
  preferPageSize;
  pageFormat;
  pageScale;
  enabled;
  escapeEnabled;
  invokesStopCellEditing;
  enterStopsCellEditing;
  useScrollbarsForPanning;
  exportEnabled;
  importEnabled;
  cellsLocked;
  cellsCloneable;
  foldingEnabled;
  cellsEditable;
  cellsDeletable;
  cellsMovable;
  edgeLabelsMovable;
  vertexLabelsMovable;
  dropEnabled;
  splitEnabled;
  cellsResizable;
  cellsBendable;
  cellsSelectable;
  cellsDisconnectable;
  autoSizeCells;
  autoSizeCellsOnAdd;
  autoScroll;
  timerAutoScroll;
  allowAutoPanning;
  ignoreScrollbars;
  autoExtend;
  maximumGraphBounds;
  minimumGraphSize;
  minimumContainerSize;
  maximumContainerSize;
  resizeContainer;
  border;
  keepEdgesInForeground;
  allowNegativeCoordinates;
  constrainChildren;
  constrainChildrenOnResize;
  extendParents;
  extendParentsOnAdd;
  extendParentsOnMove;
  recursiveResize;
  collapseToPreferredSize;
  zoomFactor;
  keepSelectionVisibleOnZoom;
  centerZoom;
  resetViewOnRootChange;
  resetEdgesOnResize;
  resetEdgesOnMove;
  resetEdgesOnConnect;
  allowLoops;
  defaultLoopStyle;
  multigraph;
  connectableEdges;
  allowDanglingEdges;
  cloneInvalidEdges;
  disconnectOnMove;
  labelsVisible;
  htmlLabels;
  swimlaneSelectionEnabled;
  swimlaneNesting;
  swimlaneIndicatorColorAttribute;
  imageBundles;
  minFitScale;
  maxFitScale;
  panDx;
  panDy;
  collapsedImage;
  expandedImage;
  warningImage;
  alreadyConnectedResource;
  containsValidationErrorsResource;
  collapseExpandResource;

  addListener(event: string, listener: (sender: any, evt: any) => void);

  getTooltipForCell(cell);

  setTooltips(bool: boolean);

  init(container);

  createHandlers(container);

  createSelectionModel();

  createStylesheet();

  createGraphView();

  createCellRenderer();

  createCellEditor();

  /**
   * @see https://github.com/jgraph/mxgraph/blob/master/javascript/src/js/view/mxGraph.js#L1848
   */
  getModel(): mxGraphModel;

  getView();

  getStylesheet();

  setStylesheet(stylesheet);

  getSelectionModel();

  setSelectionModel(selectionModel);

  getSelectionCellsForChanges(changes);

  graphModelChanged(changes);

  getRemovedCellsForChanges(changes);

  processChange(change);

  removeStateForCell(cell);

  addCellOverlay(cell, overlay);

  getCellOverlays(cell);

  removeCellOverlay(cell, overlay);

  removeCellOverlays(cell);

  clearCellOverlays(cell);

  setCellWarning(cell, warning, img, isSelect);

  startEditing(evt);

  startEditingAtCell(cell, evt);

  getEditingValue(cell, evt);

  /**
   *
   * @param cancel
   *
   * @see refreshCellValueEvent
   */
  stopEditing(cancel: boolean): void;

  labelChanged(cell, value, evt);

  cellLabelChanged(cell, value, autoSize);

  escape(evt);

  click(me);

  dblClick(evt, cell);

  tapAndHold(me);

  scrollPointToVisible(x, y, extend, border);

  createPanningManager();

  getBorderSizes();

  getPreferredPageSize(bounds, width, height);

  sizeDidChange();

  doResizeContainer(width, height);

  updatePageBreaks(visible, width, height);

  getCellStyle(cell);

  postProcessCellStyle(style);

  setCellStyle(style, cells);

  toggleCellStyle(key, defaultValue, cell);

  toggleCellStyles(key, defaultValue, cells);

  setCellStyles(key, value, cells);

  toggleCellStyleFlags(key, flag, cells);

  setCellStyleFlags(key, flag, value, cells);

  alignCells(align, cells, param);

  flipEdge(edge);

  addImageBundle(bundle);

  removeImageBundle(bundle);

  getImageFromBundles(key);

  orderCells(back, cells);

  cellsOrdered(cells, back);

  groupCells(group, border, cells);

  getCellsForGroup(cells);

  getBoundsForGroup(group, children, border);

  createGroupCell(cells);

  ungroupCells(cells);

  removeCellsFromParent(cells);

  updateGroupBounds(cells, border, moveGroup);

  cloneCells(cells, allowInvalidEdges);

  /**
   *
   * @param parent
   * @param id
   * @param value
   * @param source
   * @param target
   *
   * @see https://github.com/jgraph/mxgraph/blob/master/javascript/src/js/model/mxCell.js#L650
   */
  insertEdge(
    parent: mxCell,
    id: string,
    value: any,
    source: mxCell,
    target: mxCell
  );
  /**
   *
   * @param parent
   * @param id
   * @param value
   * @param source
   * @param target
   * @param style
   *
   * @see https://github.com/jgraph/mxgraph/blob/master/javascript/src/js/model/mxCell.js#L650
   */
  insertEdge(
    parent: mxCell,
    id: string,
    value: any,
    source: mxCell,
    target: mxCell,
    style: string
  );

  createEdge(parent, id, value, source, target, style);

  /**
   *
   * @param parent
   * @param id
   * @param value
   * @param x
   * @param y
   * @param width
   * @param height
   * @param style
   * @param relative
   *
   * @see https://github.com/jgraph/mxgraph/blob/master/javascript/src/js/view/mxGraph.js#L4475
   */
  insertVertex(
    parent: mxCell,
    id: string,
    value: any,
    x: number,
    y: number,
    width: number,
    height: number,
    style: string,
    relative: boolean
  );

  /**
   *
   * @param parent
   * @param id
   * @param value
   * @param x
   * @param y
   * @param width
   * @param height
   * @param style
   *
   * @see https://github.com/jgraph/mxgraph/blob/master/javascript/src/js/view/mxGraph.js#L4475
   */
  insertVertex(
    parent: mxCell,
    id: string,
    value: any,
    x: number,
    y: number,
    width: number,
    height: number,
    style?: string
  );

  addEdge(edge, parent, source, target, index);

  /**
   *
   * @param cell
   * @param parent
   * @param index
   * @param source
   * @param target
   *
   * @see https://github.com/jgraph/mxgraph/blob/master/javascript/src/js/view/mxGraph.js#L4584
   */
  addCell(
    cell: mxCell,
    parent?: mxCell,
    index?: any,
    source?: mxCell,
    target?: mxCell
  );

  addCells(cells, parent, index, source, target);

  /**
   * @param source
   * @param type
   * @param attr
   * @param value
   * @param min
   * @param max
   * @param validNeighbors
   * @param countError
   * @param typeError
   * @param  validNeighborsAllowed
   */

  cellsAdded(cells, parent, index, source, target, absolute, constrain);

  autoSizeCell(cell, recurse);

  /**
   * @param cells
   * @param includeEdges
   *
   * @see https://github.com/jgraph/mxgraph/blob/master/javascript/src/js/view/mxGraph.js#L4786
   */
  removeCells(cells: mxCell[], includeEdges: boolean);

  /**
   * @see https://github.com/jgraph/mxgraph/blob/master/javascript/src/js/view/mxGraph.js#L4786
   */
  removeCells();

  cellsRemoved(cells);

  splitEdge(edge, cells, newEdge, dx, dy);

  toggleCells(show, cells, includeEdges);

  cellsToggled(cells, show);

  foldCells(collapse, recurse, cells, checkFoldable);

  cellsFolded(cells, collapse, recurse, checkFoldable);

  swapBounds(cell, willCollapse);

  updateAlternateBounds(cell, geo, willCollapse);

  addAllEdges(cells);

  getAllEdges(cells);

  updateCellSize(cell, ignoreChildren);

  cellSizeUpdated(cell, ignoreChildren);

  getPreferredSizeForCell(cell);

  resizeCell(cell, bounds, recurse);

  resizeCells(cells, bounds, recurse);

  cellsResized(cells, bounds, recurse);

  cellResized(cell, bounds, ignoreRelative, recurse);

  resizeChildCells(cell, newGeo);

  constrainChildCells(cell);

  scaleCell(cell, dx, dy, recurse);

  extendParent(cell);

  importCells(cells, dx, dy, target, evt);

  moveCells(cells, dx, dy, clone, target, evt);

  cellsMoved(cells, dx, dy, disconnect, constrain, extend);

  translateCell(cell, dx, dy);

  getCellContainmentArea(cell);

  getMaximumGraphBounds();

  constrainChild(cell);

  resetEdges(cells);

  resetEdge(edge);

  getAllConnectionConstraints(terminal, source);

  getConnectionConstraint(edge, terminal, source);

  setConnectionConstraint(edge, terminal, source, constraint);

  getConnectionPoint(vertex, constraint);

  connectCell(edge, terminal, source, constraint);

  cellConnected(edge, terminal, source, constraint);

  disconnectGraph(cells);

  getCurrentRoot();

  getTranslateForRoot(cell);

  isPort(cell);

  getTerminalForPort(cell, source);

  getChildOffsetForCell(cell);

  enterGroup(cell);

  exitGroup();

  home();

  isValidRoot(cell);

  getGraphBounds();

  getCellBounds(cell, includeEdges, includeDescendants);

  getBoundingBoxFromGeometry(cells, includeEdges);

  refresh(cell);

  snap(value);

  panGraph(dx, dy);

  zoomIn();

  zoomOut();

  zoomActual();

  zoomTo(scale, center);

  zoom(factor, center);

  zoomToRect(rect);

  fit(border, keepOrigin);

  scrollCellToVisible(cell, center);

  scrollRectToVisible(rect);

  getCellGeometry(cell);

  isCellVisible(cell);

  isCellCollapsed(cell);

  isCellConnectable(cell);

  isOrthogonal(edge);

  isLoop(state);

  isCloneEvent(evt);

  isToggleEvent(evt);

  isGridEnabledEvent(evt);

  isConstrainedEvent(evt);

  validationAlert(message);

  isEdgeValid(edge, source, target);

  getEdgeValidationError(edge, source, target);

  validateEdge(edge, source, target);

  validateGraph(cell, context);

  getCellValidationError(cell);

  validateCell(cell, context);

  getBackgroundImage();

  setBackgroundImage(image);

  getFoldingImage(state);

  convertValueToString(cell);

  getLabel(cell);

  isHtmlLabel(cell);

  isHtmlLabels();

  setHtmlLabels(value);

  isWrapping(cell);

  isLabelClipped(cell);

  getTooltip(state, node, x, y);

  getTooltipForCell(cell);

  getCursorForCell(cell);

  getStartSize(swimlane);

  getImage(state);

  getVerticalAlign(state);

  getIndicatorColor(state);

  getIndicatorGradientColor(state);

  getIndicatorShape(state);

  getIndicatorImage(state);

  getBorder();

  setBorder(value);

  isResizeContainer();

  setResizeContainer(value);

  /**
   * @see https://github.com/jgraph/mxgraph/blob/master/javascript/src/js/view/mxGraph.js#L9282
   */
  isEnabled();

  /**
   *
   * @param value
   *
   * @see https://github.com/jgraph/mxgraph/blob/master/javascript/src/js/view/mxGraph.js#L9297
   */
  setEnabled(value: boolean): void;

  isEscapeEnabled();

  setEscapeEnabled(value);

  isInvokesStopCellEditing();

  setInvokesStopCellEditing(value);

  isEnterStopsCellEditing();

  setEnterStopsCellEditing(value);

  isCellLocked(cell);

  isCellsLocked();

  setCellsLocked(value);

  getCloneableCells(cells);

  isCellCloneable(cell);

  isCellsCloneable();

  setCellsCloneable(value);

  getExportableCells(cells);

  canExportCell(cell);

  getImportableCells(cells);

  canImportCell(cell);

  isCellSelectable(cell);
  isCellSelectable(cell);

  isCellsSelectable();

  setCellsSelectable(value);

  getDeletableCells(cells);

  isCellDeletable(cell);

  isCellsDeletable();

  setCellsDeletable(value);

  isLabelMovable(cell);

  isCellRotatable(cell);

  getMovableCells(cells);

  isCellMovable(cell);

  isCellsMovable();

  setCellsMovable(value);

  isGridEnabled();

  setGridEnabled(value);

  isPortsEnabled();

  setPortsEnabled(value);

  getGridSize();

  setGridSize(value);

  getTolerance();

  setTolerance(value);

  isVertexLabelsMovable();

  setVertexLabelsMovable(value);

  isEdgeLabelsMovable();

  setEdgeLabelsMovable(value);

  isSwimlaneNesting();

  setSwimlaneNesting(value);

  isSwimlaneSelectionEnabled();

  setSwimlaneSelectionEnabled(value);

  /**
   * @see https://github.com/jgraph/mxgraph/blob/master/javascript/src/js/view/mxGraph.js#L9916
   */
  isMultigraph(): boolean;

  /**
   *
   * @param value
   *
   * @see https://github.com/jgraph/mxgraph/blob/master/javascript/src/js/view/mxGraph.js#L9932
   */
  setMultigraph(value: boolean);

  isAllowLoops();

  setAllowDanglingEdges(value);

  isAllowDanglingEdges();

  setConnectableEdges(value);

  isConnectableEdges();

  setCloneInvalidEdges(value);

  isCloneInvalidEdges();

  setAllowLoops(value);

  isDisconnectOnMove();

  setDisconnectOnMove(value);

  isDropEnabled();

  setDropEnabled(value);

  isSplitEnabled();

  setSplitEnabled(value);

  isCellResizable(cell);

  isCellsResizable();

  setCellsResizable(value);

  isTerminalPointMovable(cell, source);

  isCellBendable(cell);

  isCellsBendable();

  setCellsBendable(value);

  isCellEditable(cell);

  isCellsEditable();

  setCellsEditable(value);

  isCellDisconnectable(cell, terminal, source);

  isCellsDisconnectable();

  setCellsDisconnectable(value);

  /**
   *
   * @param cell
   *
   * @see https://github.com/jgraph/mxgraph/blob/master/javascript/src/js/view/mxGraph.js#L10320
   */
  isValidSource(cell: mxCell);

  /**
   *
   * @param cell
   *
   * @see https://github.com/jgraph/mxgraph/blob/master/javascript/src/js/view/mxGraph.js#L10337
   */
  isValidTarget(cell: mxCell);

  isValidConnection(source, target);

  /**
   *
   * @param connectable
   *
   * @see https://github.com/jgraph/mxgraph/blob/master/javascript/src/js/view/mxGraph.js#L10371
   */
  setConnectable(connectable: boolean);

  /**
   *
   * @see https://github.com/jgraph/mxgraph/blob/master/javascript/src/js/view/mxGraph.js#L10371
   */
  isConnectable(): boolean;

  setPanning(enabled);

  isEditing(cell);

  isAutoSizeCell(cell);

  isAutoSizeCells();

  setAutoSizeCells(value);

  isExtendParent(cell);

  isExtendParents();

  setExtendParents(value);

  isExtendParentsOnAdd();

  setExtendParentsOnAdd(value);

  isExtendParentsOnMove();

  setExtendParentsOnMove(value);

  isRecursiveResize();

  setRecursiveResize(value);

  isConstrainChild(cell);

  isConstrainChildren();

  setConstrainChildrenOnResize(value);

  isConstrainChildrenOnResize();

  setConstrainChildren(value);

  isAllowNegativeCoordinates();

  setAllowNegativeCoordinates(value);

  getOverlap(cell);

  isAllowOverlapParent(cell);

  getFoldableCells(cells, collapse);

  isCellFoldable(cell, collapse);

  isValidDropTarget(cell: mxCell, cells, evt);

  isSplitTarget(target, cells, evt);

  getDropTarget(cells, evt, cell);

  /**
   * @see https://github.com/jgraph/mxgraph/blob/master/javascript/src/js/view/mxGraph.js#L10886
   */
  getDefaultParent(): mxCell;

  setDefaultParent(cell);

  getSwimlane(cell);

  getCellAt(x, y, parent, vertices, edges);

  intersects(state, x, y);

  hitsSwimlaneContent(swimlane, x, y);

  getChildVertices(parent);

  getChildEdges(parent);

  getChildCells(parent, vertices, edges);

  getConnections(cell, parent);

  getIncomingEdges(cell, parent);

  getOutgoingEdges(cell, parent);

  getEdges(cell, parent, incoming, outgoing, includeLoops, recurse);

  isValidAncestor(cell, parent, recurse);

  getOpposites(edges, terminal, sources, targets);

  getEdgesBetween(source, target, directed);

  /**
   *
   * @param evt
   * @param addOffset
   *
   * @see https://github.com/jgraph/mxgraph/blob/master/javascript/src/js/view/mxGraph.js#L11457
   */
  getPointForEvent(evt: any, addOffset?: boolean): mxPoint;

  getCells(x, y, width, height, parent, result);

  getCellsBeyond(x0, y0, parent, rightHalfpane, bottomHalfpane);

  findTreeRoots(parent, isolate, invert);

  traverse(vertex, directed, func, edge, visited);

  isCellSelected(cell);

  isSelectionEmpty();

  clearSelection();

  getSelectionCount();

  getSelectionCell();

  getSelectionCells();

  setSelectionCell(cell);

  setSelectionCells(cells);

  addSelectionCell(cell);

  addSelectionCells(cells);

  removeSelectionCell(cell);

  removeSelectionCells(cells);

  selectRegion(rect, evt);

  selectNextCell();

  selectPreviousCell();

  selectParentCell();

  selectChildCell();

  selectCell(isNext, isParent, isChild);

  selectAll(parent);

  selectVertices(parent);

  selectEdges(parent);

  selectCells(vertices, edges, parent);

  selectCellForEvent(cell, evt);

  selectCellsForEvent(cells, evt);

  createHandler(state: mxCellState);

  /**
   *
   * @param listener
   *
   * @see https://github.com/jgraph/mxgraph/blob/master/javascript/src/js/view/mxGraph.js#L12301
   */
  addMouseListener(listener: { mouseDown: any; mouseMove: any; mouseUp: any });

  removeMouseListener(listener);

  updateMouseEvent(me);

  getStateForTouchEvent(evt);

  isEventIgnored(evtName, me, sender);

  isSyntheticEventIgnored(evtName, me, sender);

  isEventSourceIgnored(evtName, me);

  fireMouseEvent(evtName, me, sender);

  fireGestureEvent(evt, cell);

  destroy();
}
