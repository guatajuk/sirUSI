$(document).ready(function () {
    $("#dialog").dialog({
        autoOpen: false,
        modal: true,
        width: 400,
        height: 200,
        closeOnEscape: false,
        draggable: false,
        resizable: true,
        buttons: {
            'Si, continuar trabajando': function(){
                $(this).dialog('close');
            },
            'No, cerrar sesión': function(){
                $.idleTimeout.options.onTimeout.call(this);
            }
        }
    });

    var $countdown = $("#dialog-countdown");

    $.idleTimeout('#dialog', 'div.ui-dialog-buttonpane button:first', {
        idleAfter: 10,
        pollingInterval: 2,
        keepAliveURL: 'keepalive.php',
        serverResponseEquals: 'OK',
        onTimeout: function(){
            window.location = "timeout.htm";
        },
        onIdle: function(){
            $(this).dialog("open");
        },
        onCountdown: function(counter){
            $countdown.html(counter); // update the counter
        }
    });
})