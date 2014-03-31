/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Compendio de funciones CRUD para xxxxxxxxxxxxxxxxxxxxxxxxxxxx
 */
var equipoInicial;

$(function() {

    /* Inicio de lo que se ejecutará cuando el formulario Localidades.html cargue */

    var jqGridEquipos, jqGridTurnos, idEquipo, datosEquipo, idTurnos, datosTurnos, idSala, foranea, hora = $('#hora').val(), fecha = $('#fecha').text();

    crearTablaEquipos();
    crearTablaTurnos();


    console.log("ñññññññññññññññññññññññññññññññññññññññññññññññññññññññññññññññññññññhora")
    console.log(hora)
    console.log(fecha)

    /* Fin de lo que se ejecutará cuando el formulario Localidades.html cargue */

    /* Implementación necesaria */

    /**
     * Muestra una tabla con la información de los temas de congresos a partir de
     * la información recibida de TemaCongreso.seleccionar()
     */
    $("#action").button().on("click", function() {
        var hora = $('#hora').val(), fecha = $('#fecha').val();
        $.post("controlador/fachada.php", {// Comprobar comunicación C/S
            clase: 'Salas',
            oper: 'getSelect',
            id: 'listasalas',
            hora: hora,
            fecha: fecha
        }, function(data) {
            //console.log(data)
            var prueba = "riosueño";
            prueba = prueba.substring(3, 6);
            String.substring(5, 10);
            console.log(prueba)
            $('#salas').html(data);
            $('#listasalas').on("change", function() {
                idSala = $(this).val(); // asignar a una variable el ID del grupo seleccionado y ...
                //  idSala = idSala.substring(5,10);
                crearTablaEquipos();
                console.log("ñññññññññññññññññññññññññññññññññññññññññññññññññññññññññññññññññññññhora")
                console.log(hora)
                console.log(fecha)
            }).val('0').change();
        }, "json");
    });

    function crearTablaEquipos() {
        var hora = $('#hora').val(), fecha = $('#fecha').val();
        console.log(idSala)
        if (jqGridEquipos) { // si el grid ya fue creado, no se re-crea sino que se actualizan los parametros y se recarga 
            var titulo;
            if (!idSala || idSala == -1)
            {
                titulo = 'Gestión de asignaturas';
            } else {
                titulo = 'Equipos de  ' + $('#listasalas :selected').text();
            }
            $("#tablaEquipos").jqGrid('setGridParam', {// hacer lo siguiente con con el grid de asignaturas: 
                postData: {
                    foranea: idSala, // 1) enviar al servidor el ID del grupo seleccionado
                    hora: hora,
                    fecha: fecha
                }}).setCaption(titulo).trigger("reloadGrid"); // 2) asignarle un título acorde con el grupo seleccionado y recargar el grid 
            return; // Esta instrucción garantiza que el grid se cree completo sólo una vez 
        }

        jqGridEquipos = jQuery("#tablaEquipos").jqGrid({
            url: 'controlador/fachada.php',
            datatype: "json",
            mtype: 'POST',
            postData: {
                clase: 'Monitorias',
                oper: 'select',
                foranea: idSala,
                hora: hora,
                fecha: fecha
            },
            colNames: ['Alias', 'Estado', 'Usuario'],
            colModel: [
                {name: 'cod_pc', index: 'cod_pc', width: 100, align: 'center', editable: true, editoptions: {size: 37,
                        dataInit: function(elemento) {
                            $(elemento).width(282)
                        }
                    }},
                {name: 'observaciones', index: 'observaciones', width: 300, editable: true, editoptions: {size: 37,
                        dataInit: function(elemento) {
                            $(elemento).width(282)
                        }
                    }},
                {name: 'nombre', index: 'nombres', width: 300, editable: false, editoptions: {size: 37,
                        dataInit: function(elemento) {
                            $(elemento).width(282)
                        }
                    }}
            ],
            rowNum: 100,
            width: 700,
            rowList: [100, 200, 300],
            pager: '#pTablaEquipos',
            sortname: 'id',
            viewrecords: true,
            sortorder: "asc",
            caption: "Gestión de equipos",
            multiselect: false,
            editurl: "controlador/fachada.php?clase=Monitorias",
            onSelectRow: function(id) {
                idEquipo = id
                datosEquipo = jQuery(jqGridEquipos).getRowData(idEquipo);   // Recuperar los datos de la fila seleccionada
                //idTurnos = ''
                console.log(datosEquipo)
                crearTablaTurnos()
            }
        }).jqGrid('navGrid', '#pTablaEquipos', {
            refresh: true,
            edit: true,
            add: true,
            del: true,
            search: true
        },
        {// Antes de enviar a Departamento->edit(...) se agrega un POST
            modal: true, jqModal: true,
            width: 500,
        },
                {// Antes de enviar a TemaCongreso->add(...) se agrega un POST
                    modal: true, jqModal: true,
                    width: 500,
                    afterSubmit: function(response, postdata) {
                        // Enseguida se muestran lo fundamental de las validaciones de errores ocurridos en el servidor
                        console.log(response);  // 
                        var respuesta = jQuery.parseJSON(response.responseText)
                        return respuesta.ok ? [true, "", ""] : [false, respuesta.mensaje, ""];
                    }
                },
        {modal: true, jqModal: true,
            width: 300,
        },
                {multipleSearch: true, multipleGroup: true}
        )
    }



    function crearTablaTurnos() {
        var hora = $('#hora').val(), fecha = $('#fecha').val();
        if (jqGridTurnos) {
            jqGridTurnos.jqGrid('setGridParam', {postData: {id: idEquipo,
                    hora: hora,
                    fecha: fecha}})
            if (!idEquipo) {
                jqGridTurnos.jqGrid('setCaption', "Turnos").trigger("reloadGrid")
            } else {
                jqGridTurnos.jqGrid('setCaption', "turnos de " + datosEquipo['cod_pc'].capitalize()).trigger("reloadGrid")
            }
            return
        }
        jqGridTurnos = jQuery('#tablaTurnos').jqGrid({
            url: 'controlador/fachada.php',
            datatype: "json",
            mtype: 'POST',
            postData: {
                clase: 'Turnos',
                oper: 'select',
                hora: hora,
                fecha: fecha
            },
            colNames: ['Usuario', 'Equipo', 'Hora inicial', 'Hora final', 'Novedades/Observaciones'],
            colModel: [
                {name: 'fk_cod_estudiante', index: 'fk_cod_estudiante', width: 200, align: 'center', editable: true, editoptions: {size: 44,
                        dataInit: function(elemento) {
                            $(elemento).width(282)
                        }
                    }},
                {name: 'fk_cod_pc', index: 'fk_cod_pc', width: 200, editable: true, editoptions: {size: 44,
                        dataInit: function(elemento) {
                            $(elemento).width(292)
                        },
                    }},
                {name: 'fecha_inicio', index: 'fecha_inicio', width: 250, editable: true, editoptions: {size: 44,
                        dataInit: function(elemento) {
                            $(elemento).width(282)
                        }
                    }},
                {name: 'fecha_fin', index: 'fecha_fin', width: 250, editable: true, editoptions: {size: 44,
                        dataInit: function(elemento) {
                            $(elemento).width(282)
                        }
                    }},
                {name: 'observaciones', index: 'observaciones', width: 250, editable: true, editoptions: {size: 44,
                        dataInit: function(elemento) {
                            $(elemento).width(282)
                        }
                    }}
            ],
            rowNum: 200,
            width: 700,
            rowList: [200, 700, 1300],
            pager: '#pTablaTurnos',
            sortname: 'usuario',
            viewrecords: true,
            sortorder: "asc",
            caption: "Turnos",
            multiselect: false,
            editurl: "controlador/fachada.php?clase=Turnos",
            onSelectRow: function(id) {
                idTurnos = id
                datosTurnos = jQuery(jqGridTurnos).getRowData(idTurnos);   // Recuperar los datos de la fila seleccionada
                //   crearTablaZonas()

            }
        }).jqGrid('navGrid', '#pTablaTurnos', {
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
                        $('#fk_cod_equipo').val(idEquipo)
                    },
                },
                {modal: true, jqModal: true,
                    width: 300
                },
        {multipleSearch: true, multipleGroup: true}
        )
    }



})
