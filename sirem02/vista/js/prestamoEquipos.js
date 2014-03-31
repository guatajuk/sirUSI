/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(function() {

    var calendario;

    $('#prestamo-equipos-color').simpleColor();

// las salas se deben agregar antes de este evento, aquí están simuladas
    $("#prestamo-equipos-cbosala").change(function() {
        mostrarEventos();
    }).change(0);

    calendario = $('#prestamo-equipos-calendario-reserva-equipos').fullCalendar({
        header: {
            left: 'prev,next,today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        ////////////////// Traducción a español ///////////////////
        allDayText: 'Todo el día',
        axisFormat: 'H:mm',
        titleFormat: {
            month: 'MMMM yyyy',
            week: "d[ MMM][ yyyy]{ '&#8212;' d MMM yyyy}",
            day: 'dddd, d MMM yyyy'
        },
        columnFormat: {
            month: 'ddd',
            week: 'ddd d/M',
            day: 'dddd d/M'
        },
        firstDay: 1,
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sab'],
        buttonText: {
            prev: '&nbsp;&#9668;&nbsp;',
            next: '&nbsp;&#9658;&nbsp;',
            prevYear: '&nbsp;&lt;&lt;&nbsp;',
            nextYear: '&nbsp;&gt;&gt;&nbsp;',
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día'
        },
        //////////////// Fin traducción a español ////////////////
        defaultView: 'agendaWeek',
        selectable: true,
        selectHelper: true,
        select: function(start, end, allDay, jsEvent, view) {
            mostrarFrmEvento(start, end, allDay, jsEvent);
            calendario.fullCalendar('unselect');
        },
        editable: true,
        events: {
            url: 'controlador/fachada.php',
            type: 'POST',
            data: {
                clase: 'Utilidades',
                oper: 'getEventos',
                idSala: $("#prestamo-equipos-cbosala").val() // <------------------------ OJO  --------------------------------
            }, error: function() {
                alert('Problemas leyendo el calendario');
            }
        },
        eventDrop: function(event, delta) {
            //...
        },
        eventRender: function(event) {
            //...
        },
        eventResize: function(event) {
            //...
        },
        eventMouseover: function(calEvent, jsEvent) {
            //...
        },
        eventMouseout: function(calEvent, jsEvent) {
            //...
        },
        eventClick: function(calEvent, jsEvent, view, eventid) {
            mostrarFrmEvento(calEvent.start, calEvent.end, calEvent.allDay);
        },
        loading: function(bool) {
            if (bool)
                $('#loading').show();
            else
                $('#loading').hide();
        }
    }).css({'margin': '0 auto', 'background-color': 'white'});


    $('#prestamo-equipos-calendario-reserva-equipos .fc-button-prev').on('click', function() {
        var inicio = calendario.fullCalendar('getView').start.toString();
        var fin = calendario.fullCalendar('getView').end.toString();
        console.log(inicio + ' -- ' + fin);
        mostrarEventos();
    });

    $('#prestamo-equipos-calendario-reserva-equipos .fc-button-next').on('click', function() {
        var inicio = calendario.fullCalendar('getView').start.toString();
        var fin = calendario.fullCalendar('getView').end.toString();
        console.log(inicio + ' -- ' + fin);
        mostrarEventos();
    });

    function mostrarFrmEvento(start, end, allDay, jsEvent) {
        $("#prestamo-equipos-dlgreserva label").css("width", "110px");
        $("#prestamo-equipos-dlgreserva input").css("width", "210px");
        $("#prestamo-equipos-dlgreserva select").css("width", "220px");

        $("#prestamo-equipos-hora-inicio").val(($.fullCalendar.formatDate(start, 'u')));

        $('#prestamo-equipos-dlgreserva').dialog({// la capa frmAutentica está definida en index.html
            autoOpen: true,
            width: 440,
            height: 540,
            modal: true,
            open: function() {
                $(".ui-dialog-titlebar-close").hide();
                $("#btnAceptar").button({icons: {primary: "ui-icon-check"}});
                $("#btnCancelar").button({icons: {primary: "ui-icon-close"}});
            },
            buttons: [{
                    id: "btnAceptar", text: "Aceptar", click: function() {
                        var fin = $("#prestamo-equipos-hora-fin").val();
                        if (fin) {
                            end = fin;
                        }
                        calendario.fullCalendar(
                                'renderEvent', {
                                    title: $("#prestamo-equipos-nombre-usuario :selected").text(),
                                    start: start,
                                    end: end,
                                    allDay: allDay,
                                    color: $("#new-prestamo-equipos-color").css("backgroundColor") // hice cambios en la linea 194 de la libreria
                                },
                        true // make the event "stick"
                                );

                        $(this).dialog("close");
                    }},
                {id: "btnCancelar", text: "Cancelar", click: function() {
                        $(this).dialog("close");
                    }}
            ]
        });
    }

    function mostrarEventos() {
        // OJO automáticamente envía la fecha de inicio y de finalización al servidor
        $.post("controlador/fachada.php", {
            clase: 'Utilidades',
            oper: 'getEventos',
            idSala: $("#prestamo-equipos-cbosala").val()
        }, function(data) {
            calendario.fullCalendar('removeEvents');
            $.each(data, function(index, event) {
                calendario.fullCalendar('renderEvent', event);
            });
        }, "json");
    }

});

