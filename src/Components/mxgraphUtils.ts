// tslint:disable-next-line:no-shadowed-variable

export function createVertex(style: string, x: number, y: number, width: number, height: number, type: string): mxCell {
  const vertex = new mxCell(null, new mxGeometry(x, y, width, height), style);

  vertex.setVertex(true);
  vertex.type = type;

  vertex.geometry.relative = false;

  return vertex;
}
/* const handler = function(graph, evt, cell, x, y) {
      graph.stopEditing(false);
      // debugger;
      const vertex = TemplateEditorComponent.createVertex(
        style,
        x,
        y,
        width,
        height,
        type
      );

      let valueId = 1;
      if (graph.getDefaultParent().children != null) {
        valueId =
          Math.max(...graph.getDefaultParent().children.map(v => +v.id)) + 1;
      }

      vertex.setValue(value.call(this, valueId));

      vertex.value.geometry = {
        x: vertex.geometry.x,
        y: vertex.geometry.y,
        width: vertex.geometry.width,
        height: vertex.geometry.height,
        parent: undefined
      };

      let currentCells = graph.getChildCells(
        graph.getDefaultParent(),
        true,
        false
      );

      const border =
        currentCells[0] && currentCells[0].value instanceof TitleBlock
          ? currentCells[0]
          : null;

      const vertexGeo = vertex.getGeometry();

      if (border && border.value.type == "border-entity") {
        const borderGeo = border.getGeometry();

        if (
          ((vertexGeo.x < borderGeo.x &&
            vertexGeo.x + vertexGeo.width > borderGeo.x) ||
            (vertexGeo.x > borderGeo.x &&
              vertexGeo.x < borderGeo.x + borderGeo.width)) &&
          ((vertexGeo.y < borderGeo.y &&
            vertexGeo.y + vertexGeo.height > borderGeo.y) ||
            (vertexGeo.y > borderGeo.y &&
              vertexGeo.y < borderGeo.y + borderGeo.height))
        ) {
          if (vertex.type == "Value") {
            if (border.children.length == 1) {
              vertex.geometry.x = 240;
              vertex.geometry.y = 30;
            } else {
              vertex.geometry.x =
                border.children[border.children.length - 2].geometry.x;
              vertex.geometry.y =
                border.children[border.children.length - 2].geometry.y + 50;
            }

            if (
              vertexGeo.y + vertexGeo.height + 20 <=
              borderGeo.y + borderGeo.height
            ) {
              borderGeo.height = borderGeo.height + 20;
            }
            graph.addCell(vertex, border);

            vertex.value.id = "vdt" + border.children.length;

            vertex.value.geometry.parent = "border";

            graph.insertEdge(
              border,
              null,
              null,
              border.children[0],
              border.children[border.children.length - 1]
            );
            debugger;
          }

          for (let i = 1; i < currentCells.length; i++) {
            const cellGeometry = currentCells[i].getGeometry();
            TemplateEditorComponent.moveCellsIfOverlapping(
              cellGeometry,
              currentCells[0].getGeometry(),
              currentCells,
              i,
              50,
              graph
            );
          }
        } else {
          graph.addCell(vertex, graph.getDefaultParent());
        }
      } else {
        graph.addCell(vertex, graph.getDefaultParent());
      }
      graph.setSelectionCell(vertex);
    };

    const img = toolbar.addMode(title, icon, (evt, cell) => {
      debugger;
      const pt = graph.getPointForEvent(evt);
      handler(graph, evt, cell, pt.x, pt.y);
    });
    img.classList.add("my-3");
    img.classList.add("mx-auto");
    img.classList.add("d-block");

    mxUtils.makeDraggable(img, graph, handler);
  } 
 */
