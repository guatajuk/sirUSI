<?php

class usuario {

    /**
     * Devuelve el conjunto opciones a las que un usuario puede ingresar.
     * Con base en dichos datos construye un menú personalizado para el usuario autenticado correctamente.
     * El array de opciones contiene un conjunto de propiedades que corresponden exactamente a las opciones
     * del programa. Cada Propiedad tiene asignado el nombre de la página que se debe abrir. Se pueden dejar
     * propiedades como cadenas vacías lo cual se interpreta como que el usuario no tiene acceso a dicha opción.
     * Si la autenticación del usuario falla, se devuelve un array de opciones vacío.
     * @param type $argumentos un array que contiene el nombre del usuario y su contraseña MD5
     */
    public function autenticar($argumentos) {
        extract($argumentos);
        $opciones = [];
        // pasos a seguir a partir de aquí:
        // Validar el nombre de usuario y la contraseña
        // Si correctos llenar el array asociativo $opciones con pares nombre-opcion => pagina.
        // Si el usuario no tiene privilegios para acceder a la opción, el nombre de la página
        // se deja como un cadena en blanco.
        // los datos del usuario junto con su tipo se guardan en sesión para que "ciertas" funciones
        // tengan en cuenta los datos de la sesión. Por ejemplo: reservar una sala o un equipo;
        // también un monitor al autenticarse y terminar sesión genera un registro de monitoría llevada a cabo
        $opciones = [ // asigne aquí las páginas que se abrirán para cada opción
            'Asignación' => "vista/html/monitorias-asignacion.html",
            'Cerrar sesión' => '<-- este elemento es imprescindible, escrito exactamente así',
            'Comunidad' => "vista/html/comunidad.html",
            'Configuración' => "vista/html/configuracion.html",
            'Control' => "vista/html/monitorias-control.html",
            'Detalle de equipos' => "vista/html/equipos-detalle.html",
            'Detalle de salas' => "vista/html/salas-detalle.html",
            'Mantenimiento' => '',
            'Privilegios' => "vista/html/privilegios.html",
            'Reportes' => "vista/html/reportes.html",
            'Reserva de equipos' => "vista/html/equipos-reserva.html",
            'Reserva de salas' => "vista/html/salas-reserva.html",
            'Utilidades' => "vista/html/utilidades.html"
        ];
        // se retorna el array de opciones, si el array llega a la capa de presentación
        // sin el elemento 'Cerrar sesión', es porque falló la autenticación del usuario.
        echo json_encode($opciones);
    }

    /**
     * @param type $argumentos
     */
    public function getSelect($argumentos) {
        $id = 'cbo' . rand(0, 99999);
        extract($argumentos);
        $select = "<select id='$id'>";
        $select .= "<option value='0'>Seleccione un usuario</option>";
        foreach (UtilConexion::$pdo->query("SELECT codigo, nombre ||' '|| apellido AS nombre_usuario FROM usuarios") as $fila) {
            $select .= "<option value='{$fila['codigo']}'>{$fila['nombre_usuario']}</option>";
        }
        $select .= "</select>";
        echo tipoRetorno == 'json' ? json_encode($select) : ($select . "</select>");
    }

}

?>
