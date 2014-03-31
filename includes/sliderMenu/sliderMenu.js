/*
 *  SliderMenu versión 0.9.0 - Un simple menú vertical creado a partir de una lista de opciones
 *  con el fin de ejemplificar la creación de plugins con JQuery y enseñarle a mis estudiantes
 *  que el codigo espaguetti es una horrible historia del siglo pasado.
 *  Copyright 2014 Carlos Cuesta Iglesias
 *  Versión con licencias MIT, BSD y GPL.
 *  Más información: carlos.cuesta@ucaldas.edu.co
 *  Pendiente: Agregar propiedades que permitan al usuario definir los colores de fondo y de texto.
 *             Posiblemente, permitir colapsar los submenús como un acordeón.
 *             ¿Verificar la existencia del objeto para evitar recrearlo?
 *             ¿Agregar un destructor?
 */
(function($) {

    var nombrePlugin = 'sliderMenu';

    var estilos = {
        cssOculto: {// aunque no se usa se deja como ejemplo. Se puede asignar así: .css(elementos.cssOculto)
            position: 'absolute',
            top: '30px',
            left: '-190px'
        },
        colorEntraActivo: "#5BFC50",
        colorSaleActivo: "#EAF0EA",
        colorEntraInactivo: "#CE0A0A",
        colorSaleInactivo: "#808080"
    };

    var propiedades = {
        menu: null,
        opciones: null,
        ancho: '230px',
        izquierda: 25,
        derecha: 15,
        tiempo: 150,
        factor: .8,
        background: '../includes/sliderMenu/imagenes/background.jpg'
    };

    var eventos = {
        vincular: function() {
            $.error('SliderMenu.init(): se esperaba\n.sliderMenu({..,vincular: function(linksDeOpciones) {...}, ...})');
            return;
        },
        ejecutar: function() {
        }
    };

    /**
     * lógica general del plugin. En esta función se define todo lo que hay que hacer
     * @param {Object} contenedor Elemento de la página en el que se va a crear el menú
     * @param {Object} elementos todo: estilos, propiedades, eventos
     * @param {Object} metodo
     * @returns {String}
     */
    var codigo = function(contenedor, elementos, metodo) {
        var _anterior = '';
        var _temporizador = 0;

        /**
         * Devuelve un HTML que representa la lista de opciones
         * @param {type} nombreLista el nombre con el que se creará la lista de opciones
         * @returns {String} un HTML que representa la lista de opciones del menú
         */
        _crearLista = function(nombreLista) {
            var listaOpciones = '';
            if (elementos.menu) {
                listaOpciones = '<ul id="' + nombreLista + '">\n';
                var i = 1;
                $.each(elementos.menu, function(submenu, opciones) {
                    listaOpciones += '<li><h3>' + submenu + '</h3></li>\n';
                    var j = 1;
                    $.each(opciones, function() {
                        var id = nombreLista + '-item-' + i + '-' + j;
                        listaOpciones += '<li><a id="' + id + '" href="">' + this + '</a></li>\n';
                        j++;
                    });
                    i++;
                });
                listaOpciones += '</ul>\n';
            } else {
                listaOpciones = '<ul id="' + nombreLista + '">Menú indefinido</ul>';
                $.error('SliderMenu.crearLista(): No ha definido opciones');
            }
            return listaOpciones;
        };

        /**
         * Agrega al contenedor la lista que representa el menú de la aplicación
         * y le hace unas pequeñas mejoras en la presentación
         * @param {String} lista un HTML que representa las opciones del menu
         * @param {String} nombreLista el nombre con el que se creó la lista
         * @returns {String} El selector que se utilizará para acceder a los hipervínculos
         */
        _crearMenu = function(lista, nombreLista) {
            contenedor.children().remove();
            var item = '#' + nombreLista + ' li';
            var linksDeOpciones = item + " a";
            contenedor.addClass("navigation-block");
            // no cambiar ni omitir el id="hide" del siguiente elemento 
            contenedor.html('<img src="' + elementos.background + '" id="hide" alt=""/>').append(lista);

            $(".navigation-block ul li h3, .navigation-block ul li a").css("width", elementos.ancho);

            // Crea la animación de deslizamiento para todos los elementos de la lista
            $(item).each(function() {
                // margen izquierda = - ([ancho del elemento] + [relleno vertical del elemento])
                // $(this).css("margin-left", "-180px");  // ¿se requiere? - parece que no
                _temporizador = (_temporizador * elementos.factor + elementos.tiempo);
                $(this).animate({
                    marginLeft: "0"
                }, _temporizador);
                $(this).animate({
                    marginLeft: "15px"
                }, _temporizador);
                $(this).animate({
                    marginLeft: "0"
                }, _temporizador);
            });
            return linksDeOpciones;
        };

        /**
         * Asignar los efectos para los eventos mouseOver, mouseOut y click
         * @param {String} linksDeOpciones El selector de los hipervínculos
         * @param {Array} desactivadas
         * @returns {undefined}
         */
        _aspecto = function(linksDeOpciones, desactivadas) {
            $(linksDeOpciones).each(function() {
                var colorEntra, colorSale;

                if (elementos.opciones[$(this).text()]) {  // verde: disponible
                    colorEntra = elementos.colorEntraActivo;
                    colorSale = elementos.colorSaleActivo;
                } else {  // rojo: no hay acceso
                    colorEntra = elementos.colorEntraInactivo;
                    colorSale = elementos.colorSaleInactivo;
                }
                // se resaltan las opciones por las que pasa el mouse
                $(this).css("color", colorSale).hover(
                        function() {
                            $(this).css("color", colorEntra);
                            $(this).animate({
                                paddingLeft: elementos.izquierda
                            }, _temporizador);
                        },
                        function() {
                            $(this).css("color", colorSale);
                            $(this).animate({
                                paddingLeft: elementos.derecha
                            }, _temporizador);
                        }
                ).on('click', function(event) {
                    // se marca la actual opción seleccionada
                    if (elementos.opciones[$(this).text()]) {
                        if (_anterior) {
                            var anterior = $('#' + _anterior);
                            anterior.text(anterior.text().substr(0, anterior.text().length - 2));
                        }
                        _anterior = $(this).attr("id");
                        $(this).text($(this).text() + ' >>');
                    }
                    event.preventDefault();
                });
            });
        };

        /**
         * Verifica si para cada link del menú existe una opción a la que se puede acceder
         * y retorna aquellos casos en los que el link tiene acceso denegado o el acceso es indefinido
         * @param {String} linksDeOpciones
         * @returns {Array}
         */
        _getDesactivadas = function(linksDeOpciones) {
            var encontrada = false;
            var noDisponibles = [];
            $(linksDeOpciones).each(function() {
                encontrada = false;
                var opcion = $(this).text();                                // el nombre de una opción del menú
                $.each(elementos.opciones, function(elemento, pagina) {   // las <opciones> referidas aquí se cargan al momento de autenticarse
                    if (opcion === elemento && pagina) {                    // si existe la opción y tiene una página asignada
                        encontrada = true;
                        return;
                    }
                });
                if (!encontrada) {
                    noDisponibles.push(opcion);
                }
            });
            return noDisponibles;
        };

        /**
         * Imprime la lista de opciones bloqueadas
         * @returns {Array}
         */
        metodo.opcionesBloqueadas = function() {
            console.log('Opciones bloqueadas:');
            console.log(bloqueadas);
        };

        /**
         * Carga una página en un contenedor
         * @param {type} args objeto que tiene el nombre del contenedor y de la página a cargar
         * @returns {undefined}
         */
        metodo.cargar = function(args) {
            args.pagina = args.pagina + '';  // esto porque es posible que obj.pagina llegue undefined
            if (args.pagina) {
                if (args.contenedor.length) {
                    args.contenedor.load(args.pagina, function(response, status, xhr) {
                        if (status === "error") {
                            alert("Lo siento, no se pudo dar acceso a '" + args.pagina + "' (Error " + xhr.status + ": " + xhr.statusText + ')');
                        }
                    });
                } else {
                    console.log('El elemento del DOM especificado para cargar la página es incorrecto');
                }
            } else {
                alert('La opción <' + args.pagina + '> no está disponible');
            }
        };

        // lógica de creación propiamente dicha de lo que se quiere, en este caso un menú a partir de una lista no ordenada
        var nombreLista = contenedor.attr('id') + '-list';
        var listaOpciones = _crearLista(nombreLista);
        var linksDeOpciones = _crearMenu(listaOpciones, nombreLista);
        var bloqueadas = _getDesactivadas(linksDeOpciones);

        if (elementos.hasOwnProperty('vincular')) {
            if (typeof (elementos.vincular) === "function") {
                elementos.vincular(linksDeOpciones); // llamada a la funcion que activa los hipervínculos
            } else {
                $.error('SliderMenu.init(): Se esperaba\n.sliderMenu({..,vincular: function(linksDeOpciones) {...}, ...})');
                return;
            }
        }
        _aspecto(linksDeOpciones, bloqueadas);
    }

    var metodos = {// aquí se define cómo se inicializa el objeto
        init: function(opciones) {
            return this.each(function() {
                /*las funciones se extienden primero*/
                var elementos = $.extend({}, eventos, estilos, propiedades, opciones);
                var data = $(this).data(nombrePlugin);
                if (!data) {
                    codigo($(this), elementos, metodos);
                    data = $(this).data(nombrePlugin, 'inicializado');
                }
            });
        }
    };

    /**
     * lógica de creación del objeto o llamado a métodos del objeto creado
     * @param {type} metodo
     * @returns {unresolved}
     */
    $.fn[nombrePlugin] = function(metodo) {
        if (metodos[metodo]) {
            return metodos[metodo].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof metodo === 'object' || !metodo) {
            return metodos.init.apply(this, arguments);
        } else {
            $.error('El método ' + nombrePlugin + '.' + metodo + ' no existe');
        }
    };
})(jQuery);

