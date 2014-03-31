/**
 * Ejemplos varios
 * @returns {undefined}
 */
$(function() {

    $("#ejemplos-varios").accordion({
        heightStyle: "content"
    });

    // Es posible que varias páginas tengan un botón Aceptar. Esta podría ser una forma de evitar conflictos:
    $("#demosvarios_aceptar").button().on("click", function(event) {
        window.open('http://www.google.com/search?q=jQuery+API+Documentation');
        event.preventDefault();
    });



    $("#select").multiselect({
        noneSelectedText: "Seleccione el estado",
        selectedList: 3// 0-based index,
    });

    $("#demosvarios_probar_algo").button().on("click", function() {
        // enviar a una variable el ARRAY de IDS

        $.post("controlador/fachada.php", {// probar alguna función del servidor
            clase: 'Reporte',
            oper: 'getPrestamoEquipos',
            estado: $("#select").val()  // enviar el vector
        },
        function(data) {
            descargar(data);
        }, "json");
    });


    $("#datepickerinicial").datepicker({dateFormat: 'yy-mm-dd', firstDay: 1});

    $("#datepickerfinal").datepicker({dateFormat: 'yy-mm-dd', firstDay: 1});

    $("#demosvarios_probar_algofecha").button().on("click", function() {
        // enviar a una variable el ARRAY de IDS

        $.post("controlador/fachada.php", {// probar alguna función del servidor
            clase: 'Reporte',
            oper: 'getPrestamoEquiposporFecha',
            fechainicial: $("#datepickerinicial").val(),
            fechafinal: $("#datepickerfinal").val()
        },
        function(data) {
            descargar(data);
        }, "json");
    });


    var equipos = getElementos({
        'clase': 'Reporte',
        'oper': 'getLista'
    });

    $("#demosvarios_cboequipos").agregarElementos(equipos);



    //************************************************************************
    $("#demosvarios_probar_algoequipo").button().on("click", function() {
        // enviar a una variable el ARRAY de IDS



        $.post("controlador/fachada.php", {// probar alguna función del servidor
            clase: 'Reporte',
            oper: 'getPrestamoEquiposporEquipo',
            nombre: $("#demosvarios_cboequipos :selected").text()
        },
        function(data) {
            descargar(data);
        }, "json");
    });

    /////////////////////////*********************************************************

    /** REPORTE CSV BACKUP DATABASE **/

    $("#demosvarios_probar_csv").button().on("click", function() {


        var categorias = new Array();

        $("#reporte_csv input[type='checkbox']:checked").each(function() {
            categorias.push($(this).val());

        });

        //alert(categorias);

        $.post("controlador/fachada.php", {// Comprobar comunicación C/S
            "clase": "Reporte",
            "oper": "guardarCSV",
            "opciones": categorias
        }, function(data) {
            /*if (data.mensaje) {
             alert(data.mensaje);
             } else {
             alert("¡Houston, tenemos problemas!");
             }*/
            descargar(data);
        }, "json");
    });


    /* ************************** */
//    
    $("#reservas_salas").multiselect({
        noneSelectedText: "Seleccione el estado",
        selectedList: false// 0-based index,
    });

    $("#demosvarios_probar_salas").button().on("click", function() {

        $.post("controlador/fachada.php", {// probar alguna función del servidor
            clase: 'Reporte',
            oper: 'reservaSala',
            estado: $("#reservas_salas").val()   //   el usuario debe elegir 0-solicitada 1-en uso 2-entregado null-todo
        },
        function(data) {
            descargar(data);
        }, "json");

    });

    $("#datepickerinicial").datepicker({dateFormat: 'yy-mm-dd', firstDay: 1});
    $("#datepickerfinal").datepicker({dateFormat: 'yy-mm-dd', firstDay: 1});
    $("#demosvarios_probar_salaporfecha").button().on("click", function() {
        // enviar a una variable el ARRAY de IDS

        $.post("controlador/fachada.php", {// probar alguna función del servidor
            clase: 'Reporte',
            oper: 'reservasalaporFecha',
            fechainicial: $("#datepickerinicial").val(),
            fechafinal: $("#datepickerfinal").val()
        },
        function(data) {
            descargar(data);
        }, "json");
    });


    /* ************************** */
    $("#select").multiselect({
        noneSelectedText: "Seleccione el estado",
        selectedList: 3// 0-based index,
    });

    $("#demosvarios_probar_equipos").button().on("click", function() {
        // enviar a una variable el ARRAY de IDS

        $.post("controlador/fachada.php", {// probar alguna función del servidor
            clase: 'Reporte',
            oper: 'getPrestamoEquipos',
//            estado: $("#select").val()  // enviar el vector
            estado: $("#select").val()  // enviar el vector

        },
        function(data) {
            descargar(data);
        }, "json");
    });


});