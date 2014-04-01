/* 
 * Grupo 2 de IS
 * Diego Armando Mejía
 * Sergio Andrés Moreno
 * edwin giraldo
 * yoiner tabares
 * daniel
 * mario sanchez
 */
$(function() {

    var calendarioReservaEquipos;



    /// OJO los responsables de los préstamos de equipos NO se están tomando de la base de datos ********************
    ////  cambiar el tamaño al combo
    // deben tomarse de una lista estandar equipos-reserva-estado-equipos

    // ver cómo se construyó en "librería.js" para evitar el problema de la asincronicidad en la carga
    $("#equipos-reserva-equipos1")
            .getSelectList({clase: 'Equipo', oper: 'getSelect'})
            .change(function() {
                mostrarReservasEquipos();
            }).change(0);



    // clonar la lista de opciones para agregarla en otra lista
    var listaEquipos = $("#equipos-reserva-equipos1 > option").clone();
    $("#equipos-reserva-equipos").append(listaEquipos)

    $("#equipos-reserva-equipos1").prepend("<option value='0' selected='selected'>Todos</option>")

    $("#equipos-reserva-nombre-usuario").getSelectList({clase: 'Usuario', oper: 'getSelect'}).change(0);

    $("#equipos-reserva-fecha-inicio").datetimepicker();
    $("#equipos-reserva-fecha-fin").datetimepicker();

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
            mostrarFrmEquipo(start, end, allDay, jsEvent, 0);
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
        },
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
                console.log('pulsó doble clic');
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
        eventClick: function(event, jsEvent, view) {
            mostrarFrmEquipo(event.start, event.end, event.allDay, event.id);
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

    function mostrarReservasEquipos() { // OJO automáticamente envía la fecha de inicio y de finalización al servidor 
        console.log($("#equipos-reserva-equipos1").val());

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

    function mostrarFrmEquipo(start, end, allDay, eventId) {
        
        $("#equipos-reserva-frmreserva label").css("width", "90px");
        $("#equipos-reserva-frmreserva input").css("width", "192px");
        $("#equipos-reserva-frmreserva select").css("width", "200px");

        var eventObject = null;
        var totalEventos = calendarioReservaEquipos.fullCalendar('clientEvents').length;
        if (totalEventos) {
            eventObject = calendarioReservaEquipos.fullCalendar('clientEvents', [eventId])[0];
        }

        $('#equipos-reserva-frmreserva').dialog({
            autoOpen: true,
            width: 400,
            height: 435,
            modal: true,
            open: function() {
                $(".ui-dialog, .ui-dialog-titlebar, .ui-dialog-buttonpane").css({"font-size": "95%"});
                if (typeof eventObject === "undefined") {
                    $(this).dialog("option", "title", "Agregar reservas");
                    $('#btnActualizar, #btnEliminar').hide();
                    $('#btnAceptar, #btnCancelar').show();
                    inicializarFrmEquipo();
                } else {
                    $(this).dialog("option", "title", "Datos de la reserva");
                    $('#btnActualizar, #btnEliminar').show();
                    $('#btnAceptar').hide();

                    $("#equipos-reserva-nombre-usuario :selected").text(eventObject.title);
                    $("#equipos-reserva-fecha-inicio").val(($.fullCalendar.formatDate(eventObject.start, 'u')));
                    $("#equipos-reserva-fecha-fin").val(($.fullCalendar.formatDate(eventObject.end, 'u')));
                    $("#democalendario-color").css({"background-color": eventObject.color});
                    $("#equipos-reserva-observaciones").val(eventObject.observaciones);
                }
                $(".ui-dialog-titlebar-close").hide();
                $("#btnAceptar").button({icons: {primary: "ui-icon-check"}});
                $("#btnCancelar").button({icons: {primary: "ui-icon-close"}});
                $("#btnEliminar").button({icons: {primary: "ui-icon-close"}});
                $("#btnEliminar").button({icons: {primary: "ui-icon-trash"}});
                $("#btnActualizar").button({icons: {primary: "ui-icon-check"}});
            },
            buttons: [
                {
                    id: "btnAceptar", text: "Aceptar", click: function() {  // insertar un evento
                        insertarReservaEquipo(eventId, start, end, allDay);
                        $(this).dialog("close");
                    }
                },
                {
                    id: "btnActualizar", text: "Actualizar", click: function() {
                        actualizarReservaEquipo(eventId, start, end, allDay);
                        $(this).dialog("close");
                    }
                },
                {
                    id: "btnEliminar", text: "Eliminar", click: function() {
                        eliminarReservaEquipo(eventId);
                        $(this).dialog("close");
                    }
                },
                {
                    id: "btnCancelar", text: "Cancelar", click: function() {
                        inicializarFrmEquipo();
                        $(this).dialog("close");
                    }
                },
            ]
        });
    } // fin de mostrarFrmEvento

    function insertarReservaEquipo(eventId, start, end, allDay) {
        if ($("#equipos-reserva-nombre-usuario").val() == 0) {
            alert("Ingrese un usuario");
        } else {
            calendarioReservaEquipos.fullCalendar(
                    'renderEvent', {
                        id: eventId, /////////////////
                        title: $("#equipos-reserva-nombre-usuario  :selected").text(),
                        start: start,
                        end: end,
                        allDay: allDay,
                        color: $("#equipos-reserva-color").val(),
                        allDay: false
                    }, true);
            $.post("controlador/fachada.php", {// probar alguna función del servidor
                clase: 'ReservaEquipo',
                oper: 'insertarReserva',
                fk_usuario: $("#equipos-reserva-nombre-usuario").val(),
                fk_equipo: $("#equipos-reserva-equipos").val(),
                estado: $("#equipos-reserva-estado-equipos").val(),
                observaciones: $("#equipos-reserva-observaciones").val(),
                color: $("#equipos-reserva-color").val(),
                start: "" + start.getFullYear() + "-" + (parseInt(start.getMonth()) + 1) + "-" + start.getDate() + " " + start.getHours() + ":" + start.getMinutes(),
                end: "" + end.getFullYear() + "-" + (parseInt(end.getMonth()) + 1) + "-" + end.getDate() + " " + end.getHours() + ":" + end.getMinutes()
            }, function(data) {
                // Falta validar para que cuando ReservaEquipo::insertarReserva(..) falle, aquí se avise al usuario
                console.log(data);
                eventId.id = data.id;
            }, "json");
        }
    }

    function actualizarReservaEquipo(eventId, start, end, allDay) {
        calendarioReservaEquipos.fullCalendar('removeEvents', eventId);

        calendarioReservaEquipos.fullCalendar(
                'renderEvent', {
                    id: eventId, /////////////////
                    title: $("#equipos-reserva-nombre-usuario  :selected").text(),
                    start: start,
                    end: end,
                    allDay: allDay,
                    color: $("#equipos-reserva-color").val(),
                    allDay: false
                }, true);

        $.post("controlador/fachada.php", {// Comprobar comunicación C/S
            clase: 'ReservaEquipo', // no debería ser en la clase Utilidades sino en la clase Evento
            oper: 'actualizarReserva',
            idReserva: eventId,
            fk_usuario: $("#equipos-reserva-nombre-usuario").val(),
            fk_equipo: $("#equipos-reserva-equipos").val(),
            ////////////// ENVIAR COMO RESPONSABLE DE HABER PRESTADO, EL USUARIO LOGUEADO ////////////////////////////
            estado: $("#equipos-reserva-estado-equipos").val(),
            observaciones: $("#equipos-reserva-observaciones").val(),
            color: $("#equipos-reserva-color").val(),
            start: "" + start.getFullYear() + "-" + (parseInt(start.getMonth()) + 1) + "-" + start.getDate() + " " + start.getHours() + ":" + start.getMinutes(),
            end: "" + end.getFullYear() + "-" + (parseInt(end.getMonth()) + 1) + "-" + end.getDate() + " " + end.getHours() + ":" + end.getMinutes()
                    // se pueden enviar cuantos parametros se requieran
        }, function(data) {
            console.log(data);
        }, "json");
    }

    function eliminarReservaEquipo(eventId) {
        calendarioReservaEquipos.fullCalendar('removeEvents', eventId);

        $.post("controlador/fachada.php", {// Comprobar comunicación C/S
            clase: 'ReservaEquipo',
            oper: 'eliminarReserva',
            idReserva: eventId
        }, function(data) {
            console.log(data);
        }, "json");
    }

    function inicializarFrmEquipo() {
        $("#equipos-reserva-nombre-usuario").val(0);
        $("#equipos-reserva-fecha-inicio").val("");
        $("#equipos-reserva-fecha-fin").val("");
        $("#democalendario-color").val("");
        $("#equipos-reserva-observaciones").val("");
    }

});


