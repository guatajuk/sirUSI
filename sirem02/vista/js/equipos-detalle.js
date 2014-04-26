
$(function() {

    var jqGridTipoEquipo, jqGridDetallesEquipo,
            idTipoEquipo, datosTipoEquipo, idDetallesEquipo, datosDetallesEquipo;

    crearTablaTipoEquipo();
    crearTablaDetallesEquipo();

    /*
     * Cargamos la tablatipo de equipo
     * 
     */

    function crearTablaTipoEquipo() {
        jqGridTipoEquipo = jQuery("#tablaTipoEquipo").jqGrid({
            url: 'controlador/fachada.php',
            datatype: "json",
            mtype: 'POST',
            postData: {
                clase: 'TipoEquipo',
                oper: 'select'
            },
            colNames: ['ID', 'NOMBRE'],
            colModel: [
                {name: 'id', index: 'id', width: 55, align: 'center', editable: true, editoptions: {size: 37,
                        dataInit: function(elemento) {
                            $(elemento).width(282)
                        }
                    }},
                {name: 'nombre', index: 'nombre', width: 500, editable: true, editoptions: {size: 37,
                        dataInit: function(elemento) {
                            $(elemento).width(282)
                        }
                    }}
            ],
            rowNum: 100,
            width: 600,
            rowList: [100, 200, 300],
            pager: '#pTablaTipoEquipo',
            sortname: 'id',
            viewrecords: true,
            sortorder: "asc",
            caption: "Gestión de Tipos de equipos",
            multiselect: false,
            editurl: "controlador/fachada.php?clase=TipoEquipo",
            onSelectRow: function(id) {
                idTipoEquipo = id
                datosTipoEquipo = jQuery(jqGridTipoEquipo).getRowData(idTipoEquipo);   // Recuperar los datos de la fila seleccionada
                idDetallesEquipo = ''
                crearTablaDetallesEquipo();
            }
        }).jqGrid('navGrid', '#pTablaTipoEquipo', {
            refresh: true,
            edit: true,
            add: true,
            del: true,
            search: true
        },
        {// Antes de enviar a Equipos->edit(...) se agrega un POST
            modal: true, jqModal: true,
            width: 500,
            beforeSubmit: function(postdata) {
                postdata.idNuevo = $('#id').val();
                return[true, ''];
            },
            afterSubmit: function(response, postdata) {
                var respuesta = jQuery.parseJSON(response.responseText);
                return [respuesta.ok, respuesta.mensaje, ''];
            }
        },
        {
            modal: true, jqModal: true,
            width: 500,
            afterSubmit: function(response, postdata) {
                var respuesta = jQuery.parseJSON(response.responseText);
                return [respuesta.ok, respuesta.mensaje, ''];
            }
        },
        {modal: true, jqModal: true,
            width: 300,
            afterSubmit: function(response, postdata) {
                var respuesta = jQuery.parseJSON(response.responseText);
                return [respuesta.ok, respuesta.mensaje, ''];
            }
        },
        {multipleSearch: true, multipleGroup: true}
        )
    }
    /*
     * Cargamos la tabla con los detalles del equipo que señalamos anteriormente
     */
    function crearTablaDetallesEquipo() {
        if (jqGridDetallesEquipo) {
            jqGridDetallesEquipo.jqGrid('setGridParam', {postData: {id: idTipoEquipo}})
            if (!idTipoEquipo) {
                jqGridDetallesEquipo.jqGrid('setCaption', "Equipo").trigger("reloadGrid")
            } else {
                jqGridDetallesEquipo.jqGrid('setCaption', "Detalles de " + datosTipoEquipo['nombre'].capitalize()).trigger("reloadGrid")
            }
            return
        }
        jqGridDetallesEquipo = jQuery('#tablaEquipo').jqGrid({
            url: 'controlador/fachada.php',
            datatype: "json",
            mtype: 'POST',
            postData: {
                clase: 'Equipo',
                oper: 'select'
            },
            colNames: ['CODIGO INVENTARIO', 'DESCRIPCION', 'TIPO DE EQUIPO', 'ESTADO'],
            colModel: [
                {name: 'codigo_inventario', index: 'codigo_inventario', width: 250, editable: true, editoptions: {size: 44,
                        dataInit: function(elemento) {
                            $(elemento).width(282)
                        }
                    }},
                {name: 'descripcion', index: 'descripcion', width: 250, align: 'center', editable: true, editoptions: {size: 44,
                        dataInit: function(elemento) {
                            $(elemento).width(282)
                        }
                    }},
                {name: 'fk_tipo_equipo', index: 'fk_tipo_equipo', hidden: false, width: 250, editable: true, edittype: 'select',
                    editoptions: {
                        dataInit: function(elemento) {
                            $(elemento).width(292)
                        },
                        value: getElementos({'clase': 'Equipo', 'oper': 'getTiposEquipo'})
                                //defaultValue: idTipoEquipo
                    }
                },
                {name: 'estado', index: 'estado', hidden: false, width: 250, editable: true, edittype: 'select',
                    editoptions: {
                        dataInit: function(elemento) {
                            $(elemento).width(292)
                        },
                        value: getElementos({'clase': 'Equipo', 'oper': 'getEstadoEquipo'})
                                //defaultValue: idTipoEquipo
                    }
                }
            ],
            rowNum: 200,
            width: 600,
            rowList: [200, 700, 1300],
            pager: '#pTablaEquipo',
            sortname: 'codigo_inventario',
            viewrecords: true,
            sortorder: "asc",
            caption: "Equipos",
            multiselect: false,
            editurl: "controlador/fachada.php?clase=Equipo",
            onSelectRow: function(id) {
                idDetallesEquipo = id
                datosDetallesEquipo = jQuery(jqGridDetallesEquipo).getRowData(idDetallesEquipo);   // Recuperar los datos de la fila seleccionada

            }
        }).jqGrid('navGrid', '#pTablaEquipo', {
            refresh: true,
            edit: true,
            add: true,
            del: true,
            search: true
        },
        {// Antes de enviar a obj->edit(...) se agrega un POST
            modal: true, jqModal: true,
            width: 465,
        },
                {// Antes de enviar a obj->add(...) se agrega un POST
                    modal: true, jqModal: true,
                    width: 465,
                    afterShowForm: function() {
                        $('#fk_tipo_equipo').val(idTipoEquipo)
                    },
                },
                {modal: true, jqModal: true,
                    width: 300
                },
        {multipleSearch: true, multipleGroup: true}
        )
    }
})
