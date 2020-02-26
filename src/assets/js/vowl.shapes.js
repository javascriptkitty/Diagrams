/**
 * Replicates the VOWL's representation of owl:Class.
 *
 * @constructor
 *
 * @see http://vowl.visualdataweb.org/v2/#owlClass
 */
function OwlClassShape() {
  mxEllipse.call(this);
}

mxUtils.extend(OwlClassShape, mxEllipse);
mxCellRenderer.registerShape('vowl-owl-class', OwlClassShape);

OwlClassShape.DEFAULT_WIDTH = 100;
OwlClassShape.DEFAULT_HEIGHT = 100;

OwlClassShape.prototype.paintVertexShape = function (c, x, y, w, h) {

  c.setFillColor('#acf');
  c.setStrokeColor('#000');
  c.setStrokeWidth(2);

  mxEllipse.prototype.paintVertexShape.call(this, c, x, y, w, h);
};


/**
 * Replicates the VOWL's representation of rdfs:Literal.
 *
 * @constructor
 *
 * @see http://vowl.visualdataweb.org/v2/#rdfsLiteral
 */
function LiteralShape() {
  mxRectangleShape.call(this);
}

mxUtils.extend(LiteralShape, mxRectangleShape);
mxCellRenderer.registerShape('vowl-literal', LiteralShape);

LiteralShape.DEFAULT_WIDTH = 100;
LiteralShape.DEFAULT_HEIGHT = 30;

LiteralShape.prototype.paintVertexShape = function (c, x, y, w, h) {

  c.setFillColor('#fc3');
  c.setStrokeColor('#000');
  c.setStrokeWidth(2);
  c.setDashed(true);
  c.setDashPattern('5 5');

  mxRectangleShape.prototype.paintVertexShape.call(this, c, x, y, w, h);
};

/**
 * Replicates the VOWL's representation of rdfs:Datatype.
 *
 * @constructor
 *
 * @see http://vowl.visualdataweb.org/v2/#rdfsDatatype
 */
function DatatypeShape() {
  mxRectangleShape.call(this);
}

mxUtils.extend(DatatypeShape, mxRectangleShape);
mxCellRenderer.registerShape('vowl-datatype', DatatypeShape);

DatatypeShape.DEFAULT_WIDTH = 100;
DatatypeShape.DEFAULT_HEIGHT = 30;

DatatypeShape.prototype.paintVertexShape = function (c, x, y, w, h) {

  c.setFillColor('#fc3');
  c.setStrokeColor('#000');
  c.setStrokeWidth(2);

  mxRectangleShape.prototype.paintVertexShape.call(this, c, x, y, w, h);
};

