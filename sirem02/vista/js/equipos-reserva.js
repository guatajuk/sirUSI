/* 
 * Reserva de equipos
 * Grupo 1 de IS
 * Brian Andres Castillo Henao
 * Diego Fernando Rojas
 * Jonathan Cortes
 */
$(function() {

    var calendarioReservaEquipos;
    var idUsuario;

    $("#equipos-reserva-equipos1")
            .getSelectList({clase: 'Equipo', oper: 'getSelect'})
            .change(function() {
        mostrarReservasEquipos();
    }).change(0);

    var listaDias = $("#equipos-reserva-dias").multiselect({
        minWidth: 222,
        checkAllText: "Todos",
        uncheckAllText: "Ninguno",
        noneSelectedText: "Seleccionar días",
        selectedText: "# de # seleccionados"
    });

    /*
     * Cargamos el combobox con los colores respectivos
     */

    $("#equipos-reserva-etiqueta-evento").change(function() {
        $(this).css({'color': 'white', 'backgroundColor': $(this).val()});
    }).change();

    $("#equipos-reserva-equipos").getSelectList({clase: 'Equipo', oper: 'getSelect'}).change(0);

    $("#equipos-reserva-equipos1").prepend("<option value='0' selected='selected'>Todos</option>");
    $("#equipos-reserva-equipos").prepend("<option value='0' selected='selected'>Seleccione Un Equipo</option>");

    $("#equipos-reserva-nombre-usuario").getSelectList({clase: 'Usuario', oper: 'getSelect'}).change(function() {
        idUsuario = $(this).val();
    });
    $("#equipos-reserva-nombre-usuario").change(0);
    $("#equipos-reserva-responsable").getSelectList({clase: 'Usuario', oper: 'getSelect'}).change(0);

    $("#equipos-reserva-fecha-inicio").datetimepicker({
        format: 'Y-m-d H:i'
    });
    $("#equipos-reserva-fecha-fin").datetimepicker({
        format: 'Y-m-d H:i'
    });

//Carga el fullcalendar con sus funciones asociadas
    calendarioReservaEquipos = $('#equipos-reserva-calendario').fullCalendar({
        monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
        buttonText: {
            today: 'hoy',
            month: 'mes',
            week: 'semana',
            day: 'día'},
        allDayText: "Toda el día",
        defaultView: 'agendaWeek',
        select: function(start, end, allDay, jsEvent, view) {  // se selecciona una celda vacía
            mostrarFrmEquipo(start, end, allDay, 0);
            calendarioReservaEquipos.fullCalendar('unselect');
        },
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        selectable: true,
        selectHelper: true,
        ///////////////
        editable: true,
                
        events: {
            url: 'controlador/fachada.php',
            type: 'POST',
            data: {
                clase: 'ReservaEquipo',
                oper: 'getEventos',
                idEquipo: $("#equipos-reserva-equipos1").val()
            }, error: function() {
                alert('Problemas leyendo el calendario');
            }
        },events: {
            url: 'controlador/fachada.php',
            type: 'POST',
            data: function() { 
                return {
                    clase: 'ReservaEquipo',
                    oper: 'getEventos',
                    idEquipo: $("#equipos-reserva-equipos1").val()
                };
            },
            error: function() {
                alert('Problemas leyendo el calendario');
            }
        },
                /*
                 * 
                 */
        eventDrop: function(eventId) {
            $.post("controlador/fachada.php", {
                id: eventId.id,
                clase: 'ReservaEquipo',
                oper: 'actualizarHorarioReserva',
                start: "" + eventId.start.getFullYear() + "-" + (parseInt(eventId.start.getMonth()) + 1) + "-" + eventId.start.getDate() + " " + eventId.start.getHours() + ":" + eventId.start.getMinutes(),
                end: "" + eventId.end.getFullYear() + "-" + (parseInt(eventId.end.getMonth()) + 1) + "-" + eventId.end.getDate() + " " + eventId.end.getHours() + ":" + eventId.end.getMinutes(),
            }, "json");
        },
        eventRender: function(event, element, view) {
            element.on('dblclick', function(e) { // para verlo funcionar debe estar desactivada la instrucción de "eventClick"
                e.preventDefault();
            });
            element.on('mousedown', function(e) {
                if (e.which === 3) {
                    console.log('pulsó clic derecho');
                    console.log(element);
                    console.log(event);
                    console.log(view);
                }
                e.preventDefault();
            });
        },
                /*
                 * Se encarga de mostrar el evento en el dialog con los datos respectivos de la reserva
                 */
        eventClick: function(event, jsEvent, view) {
            mostrarFrmEquipo(event.start, event.end, event.allDay, event.id);
        },
                /*
                 * Se encarga de mostrar la información asociada de la reserva cuando pasamos el cursor sobre la misma
                 */
        eventMouseover: function(event, jsEvent, view) {
            var id = event.id;
            $(jsEvent.target).attr('title', 'ID Reserva: ' + event.id + ' \nUsuario: ' + event.title + ' \nID Responsable: ' + event.fk_responsable + '\nObservaciones: ' + event.observaciones + '\nInicio: ' + event.start + '\nFin: ' + event.end);// +'\nfin: '+event.start);
            $(jsEvent.target).tooltip({container: "body"});
        },
        eventResize: function(eventId, dayDelta, minuteDelta, revertFunc) {
            $.post("controlador/fachada.php", {// probar alguna función del servidor
                id: eventId.id,
                clase: 'ReservaEquipo',
                oper: 'actualizarHorarioReserva',
                start: "" + eventId.start.getFullYear() + "-" + (parseInt(eventId.start.getMonth()) + 1) + "-" + eventId.start.getDate() + " " + eventId.start.getHours() + ":" + eventId.start.getMinutes(),
                end: "" + eventId.end.getFullYear() + "-" + (parseInt(eventId.end.getMonth()) + 1) + "-" + eventId.end.getDate() + " " + eventId.end.getHours() + ":" + eventId.end.getMinutes(),
            }, "json");
        },
        loading: function(bool) {
            if (bool) {
                // $('#loading').show();
            } else {
                // $('#loading').hide();
                menuContextual('#equipos-reserva-calendario .fc-event');
            }
        }
    }).css({
        'margin': '0 auto',
        'background-color': 'white'
    });

    function menuContextual(selector) {
        jQuery.contextMenu({
            selector: selector, //note the selector this will apply context to all events 
            trigger: 'right',
            callback: function(key, options) {
                //this is the element that was rightclicked
                console.log(options.$trigger.context);
                switch (key) {
                    case 'edit':
                        console.log('editando...');
                        break;
                    case 'del':
                        break;
                    case 'add':
                        break;
                }
            },
            items: {
                "edit": {name: "Edit", icon: "edit"},
                "cut": {name: "Cut", icon: "cut"},
                "copy": {name: "Copy", icon: "copy"},
                "paste": {name: "Paste", icon: "paste"},
                "delete": {name: "Delete", icon: "delete"},
                "sep1": "---------",
                "quit": {name: "Quit", icon: "quit"}
            }
        });
    }

    function holaMundo(event) {
        if (event.which === 3) {  //event.which = 3 is right click
            console.log("event right click .....")
        }
    }

    function mostrarReservasEquipos() {
        console.log('mostrarReservasEquipos::equipos-reserva-equipos1.val()=' + $("#equipos-reserva-equipos1").val());

        $.post("controlador/fachada.php", {
            clase: 'ReservaEquipo',
            oper: 'getEventos',
            idEquipo: $("#equipos-reserva-equipos1").val()
        }, function(data) {
            calendarioReservaEquipos.fullCalendar('removeEvents');
            $.each(data, function(index, event) {
                calendarioReservaEquipos.fullCalendar('renderEvent', event);
            });
        }, "json");
    }

    /*
     * Carga los datos asociados el evento en el dialog
     */
    function mostrarFrmEquipo(start, end, allDay, eventId) {

        $("#equipos-reserva-frmreserva label").css("width", "90px");
        $("#equipos-reserva-frmreserva select").css("width", "225px");
        $("#equipos-reserva-frmreserva :input:not(:checkbox)").css("width", "215px");

        $('#equipos-reserva-frmreserva').dialog({
            autoOpen: true,
            width: 430,
            height: 490,
            modal: true,
            open: function() {
                $('#equipos-reserva-dias .ui-multiselect').css('width', '400px');

                $(".ui-dialog, .ui-dialog-titlebar, .ui-dialog-buttonpane").css({"font-size": "95%"});
                $(".ui-dialog-titlebar-close").hide();
                $("#equipos-reserva-insertar").button({icons: {primary: "ui-icon-check"}});
                $("#equipos-reserva-cancelar").button({icons: {primary: "ui-icon-close"}});
                $("#equipos-reserva-eliminar").button({icons: {primary: "ui-icon-close"}});
                $("#equipos-reserva-eliminar").button({icons: {primary: "ui-icon-trash"}});
                $("#equipos-reserva-actualizar").button({icons: {primary: "ui-icon-check"}});

                if (eventId === 0) {
                    $(this).dialog("option", "title", "Agregar reservas");
                    $('#equipos-reserva-actualizar, #equipos-reserva-eliminar').hide();
                    $('#equipos-reserva-lstaplicar').hide();
                    $('#equipos-reserva-insertar, #equipos-reserva-cancelar').show();
                    inicializarFrmEquipo(start, end);
                } else {
                    $(this).dialog("option", "title", "Datos de la reserva");
                    $('#equipos-reserva-actualizar, #equipos-reserva-eliminar').show();
                    $('#equipos-reserva-lstaplicar').show();
                    $('#equipos-reserva-insertar').hide();

                    var eventObject = null;
                    if (calendarioReservaEquipos.fullCalendar('clientEvents').length) {
                        eventObject = calendarioReservaEquipos.fullCalendar('clientEvents', [eventId])[0];
                        $('#equipos-reserva-nombre-usuario option:contains("' + eventObject.title + '")').prop('selected', true);
//                        setTimeout("alert('Pasaron 10 segundos!')",10000);
                        $("#equipos-reserva-responsable").val(eventObject.fk_responsable);
                        $("#equipos-reserva-estado-equipos").val(eventObject.estado);
                        $("#equipos-reserva-equipos").val(eventObject.fk_equipo);
                        $("#equipos-reserva-fecha-inicio").val(strFechaHora(eventObject.start));
                        $("#equipos-reserva-fecha-fin").val(strFechaHora(eventObject.end));
                        $("#equipos-reserva-observaciones").val(eventObject.observaciones);
                    }
                }
            },
            buttons: [
                {
                    id: "equipos-reserva-insertar", text: "Aceptar", click: function() {  // insertar un evento
                        if ($("#equipos-reserva-nombre-usuario").val() == '0') {
                            alert("Ingrese un usuario");
                        }

                        else {
                            insertarReservaEquipo(allDay);
                        }

                    }
                },
                {
                    id: "equipos-reserva-actualizar", text: "Actualizar", click: function() {
                        actualizarReservaEquipo(eventId, start, end, allDay);
                        $('#equipos-reserva-frmreserva').dialog('destroy');
                    }
                },
                {
                    id: "equipos-reserva-eliminar", text: "Eliminar", click: function() {
                        eliminarReservaEquipo(eventId);
                        $('#equipos-reserva-frmreserva').dialog('destroy');
                    }
                },
                {
                    id: "equipos-reserva-cancelar", text: "Cancelar", click: function() {
                        inicializarFrmEquipo(start, end);
                        $('#equipos-reserva-frmreserva').dialog('destroy');
                    }
                },
            ]
        });
    } // fin de mostrarFrmEvento

    //------------------------------------------------------------


    function limpiarReserva(allDay) {
        var inicio = $("#equipos-reserva-fecha-inicio").val();
        var fin = $("#equipos-reserva-fecha-fin").val();

        var dias = listaDias.multiselect("getChecked").map(function() {
            return this.value;
        }).get();

        $.post("controlador/fachada.php", {// probar alguna función del servidor
            clase: 'ReservaEquipo',
            oper: 'limpiarReserva',
            fk_usuario: idUsuario,
            estado: $("#equipos-reserva-estado-equipos").val(),
            fk_equipo: $("#equipos-reserva-equipos").val(),
            color: $("#equipos-reserva-etiqueta-evento").val(),
            observaciones: $("#equipos-reserva-observaciones").val(),
            fk_responsable: $("#equipos-reserva-responsable").val(),
            start: inicio,
            end: fin,
            dias: dias,
        }, function(data) {
            if (data.ok) {
                calendarioReservaEquipos.fullCalendar("refetchEvents");
                calendarioReservaEquipos.fullCalendar("rerenderEvents");
                $('#equipos-reserva-frmreserva').dialog('destroy');
            } else {
                alert('limpió reserva');
            }
        }, "json");
    }


    //------------------------------------------------------------

    function insertarReservaEquipo(allDay) {
        var inicio = $("#equipos-reserva-fecha-inicio").val();
        var fin = $("#equipos-reserva-fecha-fin").val();

        var dias = listaDias.multiselect("getChecked").map(function() {
            return this.value;
        }).get();

        $.post("controlador/fachada.php", {// probar alguna función del servidor
            clase: 'ReservaEquipo',
            oper: 'insertarReserva',
            fk_usuario: idUsuario,
            estado: $("#equipos-reserva-estado-equipos").val(),
            fk_equipo: $("#equipos-reserva-equipos").val(),
            color: $("#equipos-reserva-etiqueta-evento").val(),
            observaciones: $("#equipos-reserva-observaciones").val(),
            fk_responsable: $("#equipos-reserva-responsable").val(),
            start: inicio,
            end: fin,
            dias: dias,
        }, function(data) {
            if (data.ok) {
                calendarioReservaEquipos.fullCalendar("refetchEvents");
                calendarioReservaEquipos.fullCalendar("rerenderEvents");
                $('#equipos-reserva-frmreserva').dialog('destroy');
            } else {
                alert('Falló la inserción del evento\nPor Favor, asegurese de ingresar correctamente\ntodos los datos Solicitados');
            }
        }, "json");
    }

    function actualizarReservaEquipo(eventId, start, end, allDay) {
        var inicio = $("#equipos-reserva-fecha-inicio").val();
        var fin = $("#equipos-reserva-fecha-fin").val();

        $.post("controlador/fachada.php", {
            clase: 'ReservaEquipo',
            oper: 'actualizarReserva',
            idReserva: eventId,
            fk_usuario: $("#equipos-reserva-nombre-usuario").val(),
            fk_equipo: $("#equipos-reserva-equipos").val(),
            estado: $("#equipos-reserva-estado-equipos").val(),
            color: $("#equipos-reserva-etiqueta-evento").val(),
            observaciones: $("#equipos-reserva-observaciones").val(),
            fk_responsable: $("#equipos-reserva-responsable").val(),
            multi: $('#equipos-reserva-aplicar').prop('checked') ? 1 : 0,
            start: inicio,
            end: fin
        }, function(data) {
            if (data.ok) {
                /*calendarioReservaEquipos.fullCalendar('removeEvents', eventId);
                 mostrarEvento(eventId, inicio, fin, allDay);*/

                calendarioReservaEquipos.fullCalendar("refetchEvents");
                calendarioReservaEquipos.fullCalendar("rerenderEvents");
            } else {
                alert('Falló la modificación de la reserva');
            }
        }, "json");
    }
    
    

    function mostrarEvento(id, start, end, allDay) {
        calendarioReservaEquipos.fullCalendar(
                'renderEvent', {
            id: id,
            title: $("#equipos-reserva-nombre-usuario :selected").text(),
            estado: $("#equipos-reserva-estado-equipos").val(),
            start: start,
            end: end,
            allDay: allDay,
            observaciones: $("#equipos-reserva-observaciones").val(),
            fk_responsable: $("#equipos-reserva-responsable :selected").text(),
            color: $("#equipos-reserva-etiqueta-evento").val()
        }, true);
    }

    function eliminarReservaEquipo(eventId, allDay) {
        calendarioReservaEquipos.fullCalendar('removeEvents', eventId);
        var inicio = $("#equipos-reserva-fecha-inicio").val();
        var fin = $("#equipos-reserva-fecha-fin").val();
        $.post("controlador/fachada.php", {// Comprobar comunicación C/S
            clase: 'ReservaEquipo',
            oper: 'eliminarReserva',
            idReserva: eventId,
            fk_usuario: $("#equipos-reserva-nombre-usuario").val(),
            color: $("#equipos-reserva-etiqueta-evento").val(),
            observaciones: $("#equipos-reserva-observaciones").val(),
            fk_responsable: $("#equipos-reserva-responsable").val(),
            multi: $('#equipos-reserva-aplicar').prop('checked') ? 1 : 0,
            start: inicio,
            end: fin
        }, function(data) {
            if (data.ok) {
                calendarioReservaEquipos.fullCalendar("refetchEvents");
                calendarioReservaEquipos.fullCalendar("rerenderEvents");
            } else {
                alert('Falló la Eliminación de la reserva');
            }
        }, "json");
    }

    function inicializarFrmEquipo(start, end) {
        $("#equipos-reserva-fecha-inicio").val(strFechaHora(start));
        $("#equipos-reserva-fecha-fin").val(strFechaHora(end));
        $("#equipos-reserva-nombre-usuario").val(0);
        $("#equipos-reserva-responsable").val(0);
        $("#equipos-reserva-observaciones").val('');
        $("#equipos-reserva-estado-equipos").val(0);
        $("#equipos-reserva-equipos").val(0);
        $("#equipos-reserva-accion-multiple").val(0);
    }

    function strFechaHora(fechaHora) {
        var mes = parseInt(fechaHora.getMonth()) + 1;
        if (mes <= 9) {
            mes = '0' + mes;
        }
        var dia = fechaHora.getDate();
        if (dia <= 9) {
            dia = '0' + dia;
        }
        var hora = fechaHora.getHours();
        if (hora <= 9) {
            hora = '0' + hora;
        }
        var minutos = fechaHora.getMinutes();
        if (minutos <= 9) {
            minutos = '0' + minutos;
        }
        return fechaHora.getFullYear() + "-" + mes + "-" + dia + " " + hora + ":" + minutos;
    }
});


