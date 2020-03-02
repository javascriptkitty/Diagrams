/******************      Layouts          **************/

/**
 * @see https://github.com/jgraph/mxgraph/blob/master/javascript/src/js/layout/hierarchical/mxHierarchicalLayout.js
 */
declare class mxHierarchicalLayout {
  forceConstant: any;

  constructor(graph: mxGraph);

  execute(parent: mxCell);
}

/**
 * @see https://github.com/jgraph/mxgraph/blob/master/javascript/src/js/layout/mxFastOrganicLayout.js
 */
declare class mxFastOrganicLayout {
  forceConstant: number;

  constructor(graph: mxGraph);

  execute(parent: mxCell);
}

/**
 * @see https://github.com/jgraph/mxgraph/blob/master/javascript/src/js/layout/mxCircleLayout.js
 */
declare class mxCircleLayout {
  constructor(graph: mxGraph);
  constructor(graph: mxGraph, radius: number);

  execute(parent: mxCell);
}

declare class mxStackLayout {
  constructor(graph: mxGraph, spacing?: number, marginTop?: number);

  execute(parent: mxCell);
}

declare class mxRadialTreeLayout {
  constructor(graph: mxGraph);

  execute(parent: mxCell);
}

declare class mxCompactTreeLayout {
  constructor(graph: mxGraph);

  execute(parent: mxCell);
}

/******************      Layouts end      **************/
