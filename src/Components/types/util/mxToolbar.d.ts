/**
 * @see https://github.com/jgraph/mxgraph/blob/master/javascript/src/js/util/mxToolbar.js
 */
declare class mxToolbar {
  constructor(container: any);

  enabled: boolean;

  /**
   *
   * @param title
   * @param icon
   * @param funct
   * @param pressedIcon
   * @param style
   * @param factoryMethod
   *
   * @see https://github.com/jgraph/mxgraph/blob/master/javascript/src/js/util/mxToolbar.js#L90
   */
  addItem(
    title: string,
    icon: any,
    funct: (evt: any) => void,
    pressedIcon?: any,
    style?: string,
    factoryMethod?: (menu, evt, cell) => void
  ): HTMLImageElement | HTMLButtonElement;

  /**
   *
   * @param title
   * @param icon
   * @param funct
   * @param pressedIcon
   * @param style
   * @param toggle
   *
   * @see https://github.com/jgraph/mxgraph/blob/master/javascript/src/js/util/mxToolbar.js#L369
   */
  addMode(
    title: string,
    icon: any,
    funct: (evt: any, cell: mxCell) => void,
    pressedIcon?: any,
    style?: string,
    toggle?: boolean
  ): HTMLImageElement | HTMLButtonElement;
}
