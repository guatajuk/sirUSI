
$(function() {

    var treeData = [
        {title: "item1 with key and tooltip",  key: "0", tooltip: "Look, a tool tip!"},
        {title: "item2: selected on init", key: "id2", selected: true},
        {title: "Folder", isFolder: true, key: "id3",
            children: [
                {title: "Sub-item 3.1", key: "id3.1",
                    children: [
                        {title: "Sub-item 3.1.1", key: "id3.1.1"},
                        {title: "Sub-item 3.1.2", key: "id3.1.2"}
                    ]
                },
                {title: "Sub-item 3.2",
                    children: [
                        {title: "Sub-item 3.2.1", key: "id3.2.1"},
                        {title: "Sub-item 3.2.2", key: "id3.2.2"}
                    ]
                }
            ]
        },
        {title: "Document with some children (expanded on init)", key: "id4", expand: true,
            children: [
                {title: "Sub-item 4.1 (active on init)", activate: true,
                    children: [
                        {title: "Sub-item 4.1.1", key: "id4.1.1"},
                        {title: "Sub-item 4.1.2", key: "id4.1.2"}
                    ]
                },
                {title: "Sub-item 4.2 (selected on init)", selected: true,
                    children: [
                        {title: "Sub-item 4.2.1", key: "id4.2.1"},
                        {title: "Sub-item 4.2.2", key: "id4.2.2"}
                    ]
                },
                {title: "Sub-item 4.3 (hideCheckbox)", hideCheckbox: true},
                {title: "Sub-item 4.4 (unselectable)", unselectable: true}
            ]
        }
    ];

    // console.log(JSON.stringify(treeData));
    $("#tree3").fancytree({
        // extensions: ["select"],
        checkbox: true,
        selectMode: 3, // seleccionar los hijos de los nodos seleccionados
        // Enseguida se ejemplifican dos formas de asignar el origen de los datos
        source: treeData,
        //source: {
        //    url: "controlador/fachada.php?clase=DemoFancyTree&oper=getArbol"
        //},
        init: function(event, data, flag) {
            data.tree.getNodeByKey("id3").setExpanded(true);
        },
        dblclick: function(e, data) {
            data.node.toggleSelected();
        },
        keydown: function(e, data) {
            if (e.which === 32) {
                data.node.toggleSelected();
                e.preventDefault();
            }
        },
        // Estas opciones sólo se requieren cuando hay más de un árbol en la página:
        // initId: "treeData",
        // cookieId: "fancytree-Cb3",
        // idPrefix: "fancytree-Cb3-"
    });

    $("#tree3 ul").css({
        'width': '500px',
        'height': '400px',
        'overflow': 'auto',
        'position': 'relative'
    });

    // seleccionar un nodo
    var tree = $("#tree3").fancytree("getTree"),
        nodo = tree.getNodeByKey("0");
    nodo.setSelected(true);

    $("#btnToggleSelect").click(function() {
        $("#tree3").fancytree("getRootNode").visit(function(node) {
            node.toggleSelected();
        });
        return false;
    });

    $("#btnDeselectAll").click(function() {
        $("#tree3").fancytree("getTree").visit(function(node) {
            node.setSelected(false);
        });
        return false;
    });

    $("#btnSelectAll").click(function() {
        $("#tree3").fancytree("getTree").visit(function(node) {
            node.setSelected(true);
        });
        return false;
    });

    $("#btnVerEstado").on('click', function(event) {
        getInfoNodos();
        event.preventDefault();
    });

    function getInfoNodos(data) {
        data = data || $("#tree3").fancytree("getRootNode");

        // Get a list of all selected nodes, and convert to a key array:
        var selKeys = $.map(data.tree.getSelectedNodes(), function(node) {
            return node.key;
        });
        $("#echoSelection3").text(selKeys.join(", "));

        // Get a list of all selected TOP nodes
        var selRootNodes = data.tree.getSelectedNodes(true);
        // ... and convert to a key array:
        var selRootKeys = $.map(selRootNodes, function(node) {
            return node.key;
        });
        $("#echoSelectionRootKeys3").text(selRootKeys.join(", "));
        $("#echoSelectionRoots3").text(selRootNodes.join(", "));
    }
});
