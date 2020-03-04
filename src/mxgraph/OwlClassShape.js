const mx = require('mxgraph')({
    mxBasePath: 'assets/mxgraph'
});

/**
 * Replicates the VOWL's representation of owl:Class.
 *
 * @constructor
 *
 * @see http://vowl.visualdataweb.org/v2/#owlClass
 */
export function OwlClassShape() {
    mx.mxEllipse.call(this);
}

mx.mxUtils.extend(OwlClassShape, mx.mxEllipse);
mx.mxCellRenderer.registerShape('vowl-owl-class', OwlClassShape);

OwlClassShape.DEFAULT_WIDTH = 100;
OwlClassShape.DEFAULT_HEIGHT = 100;

OwlClassShape.prototype.paintVertexShape = function(c, x, y, w, h) {
    c.setFillColor('#acf');
    c.setStrokeColor('#000');
    c.setStrokeWidth(2);

    mx.mxEllipse.prototype.paintVertexShape.call(this, c, x, y, w, h);
};

/**
 * Replicates the VOWL's representation of rdfs:Literal.
 *
 * @constructor
 *
 * @see http://vowl.visualdataweb.org/v2/#rdfsLiteral
 */
export function LiteralShape() {
    mx.mxRectangleShape.call(this);
}

mx.mxUtils.extend(LiteralShape, mx.mxRectangleShape);
mx.mxCellRenderer.registerShape('vowl-literal', LiteralShape);

LiteralShape.DEFAULT_WIDTH = 100;
LiteralShape.DEFAULT_HEIGHT = 30;

LiteralShape.prototype.paintVertexShape = function(c, x, y, w, h) {
    c.setFillColor('#fc3');
    c.setStrokeColor('#000');
    c.setStrokeWidth(2);
    c.setDashed(true);
    c.setDashPattern('5 5');

    mx.mxRectangleShape.prototype.paintVertexShape.call(this, c, x, y, w, h);
};

/**
 * Replicates the VOWL's representation of rdfs:Datatype.
 *
 * @constructor
 *
 * @see http://vowl.visualdataweb.org/v2/#rdfsDatatype
 */
export function DatatypeShape() {
    mx.mxRectangleShape.call(this);
}

mx.mxUtils.extend(DatatypeShape, mx.mxRectangleShape);
mx.mxCellRenderer.registerShape('vowl-datatype', DatatypeShape);

DatatypeShape.DEFAULT_WIDTH = 100;
DatatypeShape.DEFAULT_HEIGHT = 30;

DatatypeShape.prototype.paintVertexShape = function(c, x, y, w, h) {
    c.setFillColor('#fc3');
    c.setStrokeColor('#000');
    c.setStrokeWidth(2);

    mx.mxRectangleShape.prototype.paintVertexShape.call(this, c, x, y, w, h);
};
