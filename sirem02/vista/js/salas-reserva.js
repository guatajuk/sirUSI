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
    $("#salas-reserva-etiqueta-evento").change(function() {
        $(this).css({'color': 'white', 'backgroundColor': $(this).val()});
    }).change();

    var listaDias = $("#salas-reserva-dias").multiselect({
        minWidth: 222,
        checkAllText: "Todos",
        uncheckAllText: "Ninguno",
        noneSelectedText: "Seleccionar días",
        selectedText: "# de # seleccionados"
    });



    $("#salas-reserva-lista-salas").getSelectList({
        clase: 'Sala',
        oper: 'getSelect'
    }).change(function() {
        calendarioReservaSalas.fullCalendar('refetchEvents');
//   
    });

    $("#salas-restriccion-usuario").getSelectList({
        clase: 'Usuario',
        oper: 'getSelect'
    });

    $("#salas-reserva-solicitante").getSelectList({
        clase: 'Usuario',
        oper: 'getSelect'
    });

    $("#equipos-reserva-etiqueta-evento").change(function() {
        $(this).css({'color': 'white', 'backgroundColor': $(this).val()});
    }).change()

    $("#salas-restriccion-grupo").getSelectList({
        clase: 'Grupo',
        oper: 'getSelect'
    });


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
            mostrarFrmSala(start, end, allDay, '0');
            calendarioReservaSalas.fullCalendar('unselect');
        },
        editable: true,
        events: {
            url: 'controlador/fachada.php',
            type: 'POST',
            data: function() { // OJO, aquí se hizo un cambio para obligarlo a que reciba el actual $("#salas-reserva-lista-salas").val() 
                return {
                    clase: 'Sala',
                    oper: 'getEventosSalas',
                    idSala: $("#salas-reserva-lista-salas").val()
                };
            },
            error: function() {
                alert('Problemas leyendo el calendario');
            }
        },
        eventClick: function(event, jsEvent, view) {
            mostrarFrmSala(event.start, event.end, event.allDay, event.id);
            calendarioReservaSalas.fullCalendar('unselect');
        },
        eventDrop: function(event, delta) {

            actualizarReservaSala(event.id, event.start, event.end);

            //
//            $.post("controlador/fachada.php", {
//                clase: 'RestriccionesSalas',
//                oper: 'actualizarProgramacion',
//                idReserva: event.id,
//                start: "" + event.start.getFullYear() + "-" + (parseInt(event.start.getMonth()) + 1) + "-" + event.start.getDate() + " " + event.start.getHours() + ":" + event.start.getMinutes(),
//                end: "" + event.end.getFullYear() + "-" + (parseInt(event.end.getMonth()) + 1) + "-" + event.end.getDate() + " " + event.end.getHours() + ":" + event.end.getMinutes()
//            },
//            function(data) {
//
//            }, "json");

        },
        eventResize: function(event, dayDelta, minuteDelta, revetFunc) {

            actualizarReservaSala(event.id, event.start, event.end);


            /*falta organizar para restriccion sala*/


//            $.post("controlador/fachada.php",
//                    {
//                        clase: 'RestriccionesSalas',
//                        oper: 'actualizarProgramacion',
//                        allday: 'false',
//                        idReserva: event.id,
//                        start: "" + event.start.getFullYear() + "-" + (parseInt(event.start.getMonth()) + 1) + "-" + event.start.getDate() + " " + event.start.getHours() + ":" + event.start.getMinutes(),
//                        end: "" + event.end.getFullYear() + "-" + (parseInt(event.end.getMonth()) + 1) + "-" + event.end.getDate() + " " + event.end.getHours() + ":" + event.end.getMinutes()
//                                //............. 
//                    });
        },
        eventMouseover: function(event, jsEvent, view) {
            $(jsEvent.target).attr('title', event.infoComplementaria);
        },
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
        calendarioReservaSalas.fullCalendar("refetchEvents");
        calendarioReservaSalas.fullCalendar("rerenderEvents");

//        mostrarReservasSalas();
//        mostrarRestriccionesSalas();
    });

    $('#calendario_reserva_salas .fc-button-next').on('click', function() {
        calendarioReservaSalas.fullCalendar("refetchEvents");
        calendarioReservaSalas.fullCalendar("rerenderEvents");
//         mostrarReservasSalas();
//        mostrarRestriccionesSalas();
    });


////////////////////////////////////////////////////////////////////////////////////////////////////////

    function mostrarFrmSala(start, end, allDay, eventId) {
        var ficha;
        if ($("#salas-reserva-lista-salas").val() === '0') {
            alert("Por favor seleccione una sala");
            return;
        }
        $("#salas-reserva-frmreserva label").css("width", "100px");
        $("#salas-reserva-frmreserva input").css("width", "0px");
        $("#salas-reserva-frmreserva input:not(:checkbox)").css("width", "215px");
        $("#salas-reserva-frmreserva select").css("width", "221px");
        $("#salas-reserva-frmreserva textarea").css("width", "221px");

        $('#salas-reserva-frmreserva').dialog({
            autoOpen: true,
            width: 'auto',
            height: 'auto',
            modal: true,
            open: function() {
                $(".ui-dialog, .ui-dialog-titlebar, .ui-dialog-buttonpane").css({"font-size": "95%"});
                $(".ui-dialog-titlebar-close").hide();
                $("#btnAceptar").button({icons: {primary: "ui-icon-check"}});
                $("#btnCancelar").button({icons: {primary: "ui-icon-close"}});
                $("#btnEliminar").button({icons: {primary: "ui-icon-trash"}});
                $("#btnActualizar").button({icons: {primary: "ui-icon-check"}});


                if (eventId === '0') {
                    $(this).dialog("option", "title", "Agregar reservas");
                    $('#btnActualizar, #btnEliminar').hide();
                    $('#btnAceptar, #btnCancelar').show();
                    $('#salas-reserva-lstaplicar').hide();
                    inicializarFrmSala(start, end);
                } else {
//                    $('#salas-reserva-eliminar').show();
                    $('#salas-reserva-lstaplicar').show();
                    ficha = $("#salas-reserva-tabs").tabs("option", "active");
                    // Lo que sigue es una condición que hay que programar para saber que ficha se bloquea
                    var fichaBloqueada = 99999;
                    if (fichaBloqueada === 0) {
                        $("#salas-reserva-tab1").tabs("option", "disabled", 0);
                    } else if (fichaBloqueada === 1) {
                        $("#salas-reserva-tab2").tabs("option", "disabled", 1);
                    }
                    $(this).dialog("option", "title", "Datos de la reserva");
                    $('#btnActualizar, #btnEliminar', '#btnCancelar').show();

                    $('#btnAceptar').hide();

                    // La siguiente condición en realidad no se debería requerir nunca
                    var eventObject = null;
                    if (calendarioReservaSalas.fullCalendar('clientEvents').length) {
                        $('#salas-reserva-eliminar').attr('enabled', true);
                        eventObject = calendarioReservaSalas.fullCalendar('clientEvents', [eventId])[0];
                        console.log(eventId);
                        $('#salas-reserva-solicitante option:contains("' + eventObject.title + '")').prop('selected', true);
//                        $("#salas-reserva-solicitante :selected").text(eventObject.title);
                        $("#salas-reserva-responsable-reserva").val(eventObject.responsable);
                        $("#salas-reserva-actividad-reserva").val(eventObject.actividad);
                        $("#salas-reserva-observaciones-reserva").val(eventObject.observaciones);
//                        $("#salas-reserva-etiqueta-evento").val(eventObject.color);
                        $("#salas-reserva-estado-reserva").val(eventObject.estado);
                        $("#salas-reserva-fecha-inicio-reserva").val(strFechaHora(eventObject.start));
                        $("#salas-reserva-fecha-fin-reserva").val(strFechaHora(eventObject.end));
                        $("#sala-restriccion-modalidad").val(eventObject.modalidad);
                        $("#salas-restriccion-hora-inicio").val(strHora(start));
                        $("#salas-restriccion-hora-fin").val(strHora(end));
                        $('#salas-restriccion-grupo option:contains("' + eventObject.grupo + '")').prop('selected', true);
                        $('#salas-restriccion-dia option:contains("' + eventObject.dia + '")').prop('selected', true);
//                        $("#salas-restriccion-usuario").text(eventObject.usuario);
                        $("#salas-restriccion-grupo").val(eventObject.grupo);
                        $('#salas-restriccion-usuario option:contains("' + eventObject.title + '")').prop('selected', true);
                    }
                }
            },
            buttons: [
                {
                    id: "btnAceptar", text: "Aceptar", click: function() {  // insertar un evento
                        ficha = $("#salas-reserva-tabs").tabs("option", "active");
                        if (ficha === 0) {
                            insertarReservaSala(allDay);
                        } else if (ficha === 1) {
                            insertarRestriccionSala(allDay);
                        }
//                        
                    }
                },
                {
                    id: "btnActualizar", text: "Actualizar",
                    click: function() {
                        ficha = $("#salas-reserva-tabs").tabs("option", "active");
                        if (ficha === 0) { // tab reserva de salas
                            modificarReservaSala(eventId, start, end, allDay);
                        } 
                        else if (ficha === 1) { // tab programación de asignaturas 
                            modificarProgramacionSala(eventId, start, end, allDay);
                        }
                    }
                },
                {
                    id: "btnEliminar", text: "Eliminar", click: function() {
                        ficha = $("#salas-reserva-tabs").tabs("option", "active");
                        if (ficha === 0) { // tab reserva de salas
                            eliminarReservaSala(eventId);
                        } else if (ficha === 1) { // tab programación de asignaturas 
                            console.log('Falta programar la eliminación de una selección de programación') //???????????????????????????????????????????????????????????????????? 
                        }
                    }
                },
                {
                    id: "btnCancelar", text: "Cancelar", click: function() {
                        $('#salas-reserva-frmreserva').dialog('destroy');
                    }
                }
            ]
        });

    }

    function inicializarFrmSala(start, end) {
        $("#salas-reserva-solicitante :selected").text("");
        $("#salas-reserva-actividad-reserva").val("");
        $("#salas-reserva-responsable-reserva").val(usuario.nombre);
        $("salas-reserva-estado").val(0).change();
        $("#salas-reserva-observaciones-reserva").val("");
        $("#salas-reserva-fecha-inicio-reserva").val(strFechaHora(start));
        $("#salas-reserva-fecha-fin-reserva").val(strFechaHora(end));
        $("#salas-restriccion-hora-inicio").val(strHora(start));
        $("#salas-restriccion-hora-fin").val(strHora(end));
        $("#salas-restriccion-modalidad").val(0).change();
        $("#salas-restriccion-usuario :selected").text("");
        $("#salas-restriccion-grupo :selected").text("");

    }


    function insertarReservaSala(allDay) {
        var solicitante = $("#salas-reserva-solicitante").val();
        if (solicitante === '0') {
            alert('Por favor seleccione quien solicita');
            return;
        }

        var inicio = $("#salas-reserva-fecha-inicio-reserva").val();
        var fin = $("#salas-reserva-fecha-fin-reserva").val();
        var fi = new Date(inicio);
        var ff = new Date(fin);
        if (new Date(fin).getTime() < new Date(inicio).getTime()) {
            alert('malo');
            return;
        }
        var dias = listaDias.multiselect("getChecked").map(function() {
            return this.value;
        }).get();

        $.post("controlador/fachada.php", {
            clase: 'Sala',
            oper: 'insertarReservaSala',
            fk_usuario: $("#salas-reserva-solicitante").val(),
            fk_Sala: $("#salas-reserva-lista-salas").val(),
            start: inicio,
            end: fin,
            dias: dias,
            actividad: $("#salas-reserva-actividad-reserva").val(),
            estado: $('#salas-reserva-estado').val(),
            observaciones: $('#salas-reserva-observaciones-reserva').val(),
            responsable: usuario.id,
            color: $('#salas-reserva-etiqueta-evento').val()

        }, function(data) {

            if (data.ok) {

                // OJO cuando end > start habrá que utilizar $.each(data, function(index, event) {..}); para poder mostrar todos los eventos
                $('#salas-reserva-frmreserva').dialog('destroy');
                calendarioReservaSalas.fullCalendar("refetchEvents");
                calendarioReservaSalas.fullCalendar("rerenderEvents");
//                mostrarEvento(data.id, inicio, fin, allDay);


            } else {

                alert(data.mensaje);

            }


        }, "json");
    }


    function insertarRestriccionSala(allDay) {
        var inicio = $("#salas-restriccion-hora-inicio").val();
        var fin = $("#salas-restriccion-hora-fin").val();

        $.post("controlador/fachada.php", {
            clase: 'Sala',
            oper: 'insertarRestriccion',
            sala: $("#salas-reserva-lista-salas").val(),
            start: inicio,
            end: fin,
            grupo: $("#salas-restriccion-grupo").val(),
            modalidad: $("#salas-restriccion-modalidad").val(),
            dia: $("#salas-restriccion-dia").val(),
            color: $("#salas-reserva-etiqueta-evento").val(),
            usuario: $("#salas-restriccion-usuario").val()

        }, function(data) {

            if (data.ok) {
// OJO cuando end > start habrá que utilizar $.each(data, function(index, event) {..}); para poder mostrar todos los eventos
                $('#salas-reserva-frmreserva').dialog('destroy');
                calendarioReservaSalas.fullCalendar("refetchEvents");
                calendarioReservaSalas.fullCalendar("rerenderEvents");
//                mostrarEvento(data.id, inicio, fin, allDay);
            } else {
                alert(data.mensaje);
            }
        }, "json");
    }

    /* eliminar reserv_sala ya esta bueno*/
    function eliminarReservaSala(eventId) {

        var inicio = $("#salas-reserva-fecha-inicio-reserva").val();
        var fin = $("#salas-reserva-fecha-fin-reserva").val();

        $('#calendario_reserva_salas').fullCalendar('removeEvents', eventId);
        $('.tooltipevent').remove();
//        $('#salas-reserva-frmreserva').dialog('destroy');
        $.post("controlador/fachada.php", {// Comprobar comunicación C/S
            clase: 'Sala', // no debería ser en la clase Utilidades sino en la clase Evento
            oper: 'eliminarReservaSala',
            idReserva: eventId,
            start: inicio,
            end: fin,
            seleccion: $('#salas-reserva-aplicar').prop('checked') ? 1 : 0,
//            fk_usuario: usuario.id,
            fk_sala: $("#salas-reserva-lista-salas  :selected").val()


        }, function(data) {
            if (data.ok) {

                $('#salas-reserva-frmreserva').dialog('destroy');
                calendarioReservaSalas.fullCalendar("refetchEvents");
                calendarioReservaSalas.fullCalendar("rerenderEvents");
//                mostrarReservasSalas();
            } else {
                alert(data.mensaje);
            }



        }, "json");


    }

    function modificarReservaSala(eventId, start, end) {
        var inicio = $("#salas-reserva-fecha-inicio-reserva").val();
        var fin = $("#salas-reserva-fecha-fin-reserva").val();
        var dias = listaDias.multiselect("getChecked").map(function() {
            return this.value;
        }).get();

        $.post("controlador/fachada.php", {// Comprobar comunicación C/S
            clase: 'Sala', // no debería ser en la clase Utilidades sino en la clase Evento
            oper: 'modificarReservaSala',
            idReserva: eventId,
            usuario: $("#salas-reserva-solicitante :selected").val(),
            fk_sala: $("#salas-reserva-lista-salas  :selected").val(),
            start: inicio,
            end: fin,
            dias: dias,
            actividad: $("#salas-reserva-actividad-reserva").val(),
            estado: $('#salas-reserva-estado').val(),
            observaciones: $('#salas-reserva-observaciones-reserva').val(),
            fk_responsable: $("#salas-reserva-responsable-reserva").val(),
            seleccion: $('#salas-reserva-aplicar').prop('checked') ? 1 : 0,
            color: $("#salas-reserva-etiqueta-evento").val()
                    // se pueden enviar cuantos parametros se requieran
        }, function(data) {
            if (data.ok) {
                $('#salas-reserva-frmreserva').dialog('destroy');
//                calendarioReservaSalas.fullCalendar("refetchEvents");
//                calendarioReservaSalas.fullCalendar("rerenderEvents");
            } else {
                alert(data.mensaje);
            }

        }, "json");
    }


    function modificarProgramacionSala(eventId, start, end) {
        var inicio = $("#salas-restriccion-hora-inicio").val();
        var fin = $("#salas-restriccion-hora-fin").val();
        
        $.post("controlador/fachada.php", {// Comprobar comunicación C/S
            clase: 'Sala', // no debería ser en la clase Utilidades sino en la clase Evento
            oper: 'modificarRestriccion',
            idReserva: eventId,
            fk_usuario: $("#salas-restriccion-usuario").val(),
            fk_sala: $("#salas-reserva-lista-salas").val(),
            start: inicio,
            grupo:$("#salas-restriccion-grupo").val(),
            end:fin, 
            modalidad: $("#salas-restriccion-modalidad").val(),
            dia: $("#salas-restriccion-dia").val(),
            color: $("#salas-reserva-etiqueta-evento").val()
            
            
                       
            // se pueden enviar cuantos parametros se requieran
        }, 
           function(data) {
            if (data.ok) {
                $('#salas-reserva-frmreserva').dialog('destroy');
                calendarioReservaSalas.fullCalendar("refetchEvents");
                calendarioReservaSalas.fullCalendar("rerenderEvents");
            } else {
                alert(data.mensaje);
            }

        
        }, "json");
    }


    function mostrarReservasSalas() { // OJO automáticamente envía la fecha de inicio y de finalización al servidor
        $.post("controlador/fachada.php", {
            clase: 'Sala',
            oper: 'getEventosSalas',
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


    function strHora(fechaHora) {
        var hora = fechaHora.getHours();
        if (hora < 9) {
            hora = '0' + hora;
        }
        var minutos = fechaHora.getMinutes();
        if (minutos < 9) {
            minutos = '0' + minutos;
        }
        return hora + ":" + minutos;
    }


    function strFechaHora(fechaHora) {
        var mes = parseInt(fechaHora.getMonth()) + 1;
        if (mes < 9) {
            mes = '0' + mes;
        }
        var dia = fechaHora.getDate();
        if (dia < 9) {
            dia = '0' + dia;
        }
        var hora = fechaHora.getHours();
        if (hora < 9) {
            hora = '0' + hora;
        }
        var minutos = fechaHora.getMinutes();
        if (minutos < 9) {
            minutos = '0' + minutos;
        }
        return fechaHora.getFullYear() + "-" + mes + "-" + dia + " " + hora + ":" + minutos;
    }

});




