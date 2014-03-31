/**
 * Ejemplos de uso de pestañas para evitar menús muy anidados
 * @returns {undefined}
 */
$(function() {
    $("#demo_tabs").tabs({
        activate: function(event, ui) {
            console.log($(this).tabs('option', 'active'));
        }
    });

})

