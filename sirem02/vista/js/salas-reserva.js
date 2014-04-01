/* 
 * Reserva de salas
 * Darwin Buitrago
 * Iván Camilo Damián
 * Jhonatan Camilo Cuartas
 * Daniela Jaramillo
 */
$(function() { // inicio del JS que le hace todo el trabajo sucio al HTML 

    var calendarioReservaSalas;

    $("#salas-reserva-tabs").tabs();

    $("#salas-reserva-lista-salas")
            .getSelectList({clase: 'Sala', oper: 'getSelect'})
            .change(function() {
                mostrarReservasSalas();
            }).change(0);

    $("#salas-reserva-lista-usuarios").getSelectList({clase: 'Usuario', oper: 'getSelect'});

    calendarioReservaSalas = $('#calendario_reserva_salas').fullCalendar({
        header: {
            left: 'prev,next,today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
        allDayText: "Todo el dia",
        buttonText: {today: 'hoy', month: 'mes', week: 'semana', day: 'día'
        },
        defaultView: 'agendaWeek',
        selectable: true,
        selectHelper: true,
        select: function(start, end, allDay, jsEvent, view) {  // se selecciona una celda vacía
            mostrarFrmSala(start, end, allDay, 0);
            calendarioReservaSalas.fullCalendar('unselect');
        },
        editable: true,
        events: {
            url: 'controlador/fachada.php',
            type: 'POST',
            data: {
                clase: 'RestriccionesSalas',
                oper: 'getReservas',
                idSala: $("#salas-reserva-lista-salas").val() // <---- OJO sin usar variable idSala 
            }, error: function() {
                calendarioReservaSalas.fullCalendar('unselect');
                alert('Problemas leyendo el calendario');
            }
        },
        eventClick: function(event, jsEvent, view) {
            mostrarFrmSala(event.start, event.end, event.allDay, event.id);
        },
        eventDrop: function(event, delta) {
//            actualizarReserva(event.id,event.start,event.end);
            $.post("controlador/fachada.php", {
                clase: 'Sala',
                oper: 'actualizarReserva',
                idReserva: event.id,
                start: "" + event.start.getFullYear() + "-" + (parseInt(event.start.getMonth()) + 1) + "-" + event.start.getDate() + " " + event.start.getHours() + ":" + event.start.getMinutes(),
                end: "" + event.end.getFullYear() + "-" + (parseInt(event.end.getMonth()) + 1) + "-" + event.end.getDate() + " " + event.end.getHours() + ":" + event.end.getMinutes()
            },
            function(data) {

            }, "json");

            //
            $.post("controlador/fachada.php", {
                clase: 'RestriccionesSalas',
                oper: 'actualizarProgramacion',
                idReserva: event.id,
                start: "" + event.start.getFullYear() + "-" + (parseInt(event.start.getMonth()) + 1) + "-" + event.start.getDate() + " " + event.start.getHours() + ":" + event.start.getMinutes(),
                end: "" + event.end.getFullYear() + "-" + (parseInt(event.end.getMonth()) + 1) + "-" + event.end.getDate() + " " + event.end.getHours() + ":" + event.end.getMinutes()
            },
            function(data) {

            }, "json");

        },
        eventResize: function(event, dayDelta, minuteDelta, revetFunc) {
            // var inicio = Date.parse(event.start); 
            // // var fin = Date.parse(event.end); 
            $.post("controlador/fachada.php",
                    {
                        clase: 'Sala',
                        oper: 'actualizarReserva',
                        allday: 'false',
                        idReserva: event.id,
                        start: "" + event.start.getFullYear() + "-" + (parseInt(event.start.getMonth()) + 1) + "-" + event.start.getDate() + " " + event.start.getHours() + ":" + event.start.getMinutes(),
                        end: "" + event.end.getFullYear() + "-" + (parseInt(event.end.getMonth()) + 1) + "-" + event.end.getDate() + " " + event.end.getHours() + ":" + event.end.getMinutes()
                                //............. 
                    });

            $.post("controlador/fachada.php",
                    {
                        clase: 'RestriccionesSalas',
                        oper: 'actualizarProgramacion',
                        allday: 'false',
                        idReserva: event.id,
                        start: "" + event.start.getFullYear() + "-" + (parseInt(event.start.getMonth()) + 1) + "-" + event.start.getDate() + " " + event.start.getHours() + ":" + event.start.getMinutes(),
                        end: "" + event.end.getFullYear() + "-" + (parseInt(event.end.getMonth()) + 1) + "-" + event.end.getDate() + " " + event.end.getHours() + ":" + event.end.getMinutes()
                                //............. 
                    });
        },
        // eventRender: function(event) {...}
        // eventResize: function(event) {...}
//        eventMouseover: function(event) {
//            // una simple prueba que demuestra que se pueden manipular todos los datos necesarios
//            var id = event.id;
//            console.log(id + ' ' + event.descripcion);
//
//        },
        loading: function(bool) {
            if (bool)
                $('#loading').show();
            else
                $('#loading').hide();
        }

    }).css({
        'margin': '0 auto',
        'background-color': 'white'
    });

    $('#calendario_reserva_salas .fc-button-prev').on('click', function() {
        mostrarReservasSalas();
    });

    $('#calendario_reserva_salas .fc-button-next').on('click', function() {
        mostrarReservasSalas();
    });


////////////////////////////////////////////////////////////////////////////////////////////////////////

    function mostrarFrmSala(start, end, allDay, eventId) {
        $("#salas-reserva-frmreserva label").css("width", "100px");
        $("#salas-reserva-frmreserva input").css("width", "192px");
        $("#salas-reserva-frmreserva select").css("width", "200px");

        var eventObject = null;
        var totalEventos = calendarioReservaSalas.fullCalendar('clientEvents').length;
        if (totalEventos) {
            eventObject = calendarioReservaSalas.fullCalendar('clientEvents', [eventId])[0];
        }
//      $("#democalendario_hora_inicio").val(($.fullcalendar.formatDate(start, 'u')));
        $('#salas-reserva-frmreserva').dialog({
            autoOpen: true,
            width: 500,
            height: 480,
            modal: true,
            open: function() {
                if (typeof eventObject === "undefined") {
                    $(this).dialog("option", "title", "Agregar reservas");
                    $('#btnActualizar, #btnEliminar').hide();
                    $('#btnAceptar, #btnCancelar').show();
                    inicializarFrmSala();
                } else {
                    // Lo que sigue es una condición que hay que programar para saber que ficha se bloquea
                    var fichaBloqueada = 99999;
                    if (fichaBloqueada === 0) {
                        $("#salas-reserva-tabs").tabs("option", "disabled", 0);
                    } else if (fichaBloqueada === 1) {
                        $("#salas-reserva-tabs").tabs("option", "disabled", 1);
                    } else {
                        alert('Condición para activar la ficha correcta no implementada aún en function mostrarFrmSala()');
                    }
                    $(this).dialog("option", "title", "Datos de la reserva");
                    $('#btnActualizar, #btnEliminar').show();
                    $('#btnAceptar').hide();

                    $("#salas-reserva-lista-usuarios :selected").text(eventObject.title);
                    $("#responsable").val(eventObject.responsable);
                    $("#tipoactividad").val(eventObject.tipoactividad);
                    $("#democalendario_color").val(eventObject.color);
                }
                $(".ui-dialog-titlebar-close").hide();
                $("#btnAceptar").button({icons: {primary: "ui-icon-check"}});
                $("#btnCancelar").button({icons: {primary: "ui-icon-close"}});
                $("#btnEliminar").button({icons: {primary: "ui-icon-trash"}});
                $("#btnActualizar").button({icons: {primary: "ui-icon-check"}});
            },
            buttons: [
                {
                    id: "btnAceptar", text: "Aceptar", click: function() {  // insertar un evento
                        insertarReservaSala(eventId, start, end, allDay);
                        $(this).dialog("close");
                    }
                },
                {
                    id: "btnActualizar", text: "Actualizar", click: function() {
                        var activo = $("#salas-reserva-tabs").tabs("option", "active");
                        if (activo === 0) {  // tab reserva de salas 
                            actualizarReservaSala(eventId, start, end, allDay);
                        } else if (activo === 1) {  // tab programacion de asignaturas
                            actualizarProgramacionSala(eventId, start, end, allDay);
                        }
                        $(this).dialog("close");
                    }
                },
                {
                    id: "btnEliminar", text: "Eliminar", click: function() {
                        eliminarReservaSala(eventId);
                        $(this).dialog("close");
                    }
                },
                {
                    id: "btnCancelar", text: "Cancelar", click: function() {
                        inicializarFrmSala();
                        $(this).dialog("close");
                    }
                }
            ]
        });

    }

    function eliminarReservaSala(eventId) {
        $('#calendario_reserva_salas').fullCalendar('removeEvents', eventId);
        $('.tooltipevent').remove();
        $(this).dialog("close");
        $.post("controlador/fachada.php", {// Comprobar comunicación C/S
            clase: 'Sala', // no debería ser en la clase Utilidades sino en la clase Evento
            oper: 'eliminarReserva',
            idReserva: eventId
        }, function(data) {
            console.log(data);
        }, "json");

        $.post("controlador/fachada.php", {// Comprobar comunicación C/S
            clase: 'RestriccionesSalas', // no debería ser en la clase Utilidades sino en la clase Evento
            oper: 'eliminarProgramacion',
            idReserva: eventId
                    // se pueden enviar cuantos parametros se requieran
        }, function(data) {
            console.log(data);
        }, "json");
    }

    function inicializarFrmSala() {
        $("#salas-reserva-lista-usuarios :selected").text("");
        $("#responsable").val("");
        $("#tipoactividad").val("");
        $("#democalendario_color").val("");
    }

    function insertarReservaSala(eventId, start, end, allDay) {
        calendarioReservaSalas.fullCalendar(
                'renderEvent', {
                    id: eventId,
                    title: $("#salas-reserva-lista-usuarios :selected").text(),
                    start: start,
                    end: end,
                    color: $("#democalendario_color").val(),
                    allDay: false
                }, true);  // make the event "stick",
        $.post("controlador/fachada.php", {// probar alguna función del servidor
            fk_usuario: $("#salas-reserva-lista-usuarios :selected").val(),
            fk_sala: $("#salas-reserva-lista-salas  :selected").val(),
            start: "" + start.getFullYear() + "-" + (parseInt(start.getMonth()) + 1) + "-" + start.getDate() + " " + start.getHours() + ":" + start.getMinutes(),
            end: "" + end.getFullYear() + "-" + (parseInt(end.getMonth()) + 1) + "-" + end.getDate() + " " + end.getHours() + ":" + end.getMinutes(),
            tipo_actividad: $("#tipoactividad").val(),
            responsable: $("#responsable").val(),
            color: $("#democalendario_color").val(),
            clase: 'Sala',
            oper: 'insertarReserva'

        }, function(data) {
            // validaciones si la inserción ok
            eventId = data.id;
        }, "json");
        $(this).dialog("close");
    }

    function mostrarReservasSalas() { // OJO automáticamente envía la fecha de inicio y de finalización al servidor
        $.post("controlador/fachada.php", {
            clase: 'RestriccionesSalas',
            oper: 'getReservas',
            idSala: $("#salas-reserva-lista-salas").val()
        },
        function(data) {
            calendarioReservaSalas.fullCalendar('removeEvents');
            $.each(data, function(index, event) {
                calendarioReservaSalas.fullCalendar('renderEvent', event);
                calendarioReservaSalas.fullCalendar('unselect');
            });
        }, "json");
    }

    function actualizarReservaSala(eventId, start, end) {
        $.post("controlador/fachada.php", {
            clase: 'Sala',
            oper: 'actualizarReserva',
            idEvento: eventId,
            start: "" + start.getFullYear() + "-" + (parseInt(start.getMonth()) + 1) + "-" + start.getDate() + " " + start.getHours() + ":" + start.getMinutes(),
            end: "" + end.getFullYear() + "-" + (parseInt(end.getMonth()) + 1) + "-" + end.getDate() + " " + end.getHours() + ":" + end.getMinutes()
        },
        function(data) {
            $.each(data, function(index, event) {
                calendarioReservaSalas.fullCalendar('renderEvent', event);
            });
        }, "json");////
    }

    function actualizarProgramacionSala(eventId, start, end) {
        $('#calendario_reserva_salas').fullCalendar('removeEvents', eventId);

        calendarioReservaSalas.fullCalendar('renderEvent', {
            id: eventId,
            title: $("#salas-reserva-lista-usuarios :selected").text(),
            start: start,
            end: end,
            color: $("#democalendario_color").val(),
            allDay: false
        },
        true  // make the event "stick",
                );
        $.post("controlador/fachada.php", {// Comprobar comunicación C/S
            clase: 'Sala', // no debería ser en la clase Utilidades sino en la clase Evento
            oper: 'modificarReserva',
            idReserva: eventId,
            idUsuario: $("#salas-reserva-lista-usuarios :selected").val(),
            idSala: $("#salas-reserva-lista-salas  :selected").val(),
//                            start: "" + start.getFullYear() + "-" + (parseInt(start.getMonth()) + 1) + "-" + start.getDate() + " " + start.getHours() + ":" + start.getMinutes(),
//                            end: "" + end.getFullYear() + "-" + (parseInt(end.getMonth()) + 1) + "-" + end.getDate() + " " + end.getHours() + ":" + end.getMinutes(),
            tipoActividad: $("#tipoactividad").val(),
            responsable: $("#responsable").val(), ////////// TOMAR ESTE DATO DEL USUARIO LOGUEADO  *********************
            color: $("#democalendario_color").val(),
            // se pueden enviar cuantos parametros se requieran
        }, function() {
            console.log(data);
        }, "json");
    }


});


