<?php

/**
 * Description of Zona
 * Las instancias de esta clase se conectan con la base de datos a traves de
    * una referencia que se tiene de PDO.
 * @author Carlos
 */
class Zona implements Persistible {

    private $tiposZonas;

    /**
     * Se crea una instancia de Zona que proporciona acceso a la información
     * persistente de Zonas con el propósito de permitir operaciones CRUD.
     * @param <ADODB> $conexion
     */
    function __construct() {
        $this->tiposZonas = array(
            '' => "No definida",
            1 => "Barrio",
            2 => "comuna",
            3 => "Corregimiento",
            4 => "Vereda",
            5 => "Zona centro",
            6 => "Zona rural",
            7 => "Zona urbana"
        );
    }

    /**
     * Recibe un array de datos a insertar y con ellos crea una nueva fila en
     * la tabla con_Zona
     * @param <type> $argumentos La descripción del tema de congreso a insertar
     */
    function add($argumentos) {
        extract($argumentos);
        $ok = UtilConexion::$pdo->exec("SELECT zona_insertar('$nombre', '$tipo', '$ciudad')");
        echo json_encode($ok ? array('ok' => $ok, "mensaje" => "") : array('ok' => $ok, "mensaje" => "No se pudo agregar la zona"));
    }

    /**
     * Actualiza una fila de Zonas.
     * @param <type> $argumentos Un array con el id a buscar y los otros nuevos datos,
     * estos datos se proporcionan de la siguiente manera:
     * $argumentos[0]: Id de la Zona a buscar y actualizar, los demás datos
     * corresponden a las columnas que se van a actualizar
     */
    function edit($argumentos) {
        extract($argumentos);
        $ok = UtilConexion::$pdo->exec("SELECT zona_actualizar($id, '$nombre', '$tipo', '$ciudad')");
        echo json_encode($ok ? array('ok' => $ok, "mensaje" => "") : array('ok' => $ok, "mensaje" => "Falló la actualización de los datos"));
    }

    /**
     * Elimina las Zonas cuyos IDs se pasen como argumentos.
     * @param <type> $argumentos los IDs de las Zonas a ser eliminadas.
     * $argumentos es un cadena que contiene uno o varios números separados por
     * comas, que corresponden a los IDs de las filas a eliminar.
     */
    function del($argumentos) {
        // El formato que espera postgres es: SELECT sede_eliminar('{v1,...,vn}');
        $datos = "'{" . $argumentos['id'] . "}'";
        $ok = UtilConexion::$pdo->exec("select zona_eliminar($datos)");
        echo json_encode($ok ? array('ok' => $ok, "mensaje" => "") : array('ok' => $ok, "mensaje" => "Falló la eliminación"));
    }

    /**
     * Devuelve los datos necesarios para construir una tabla dinámica.
     * @param <type> $argumentos los argumentos enviados por:
     * Zona.js.crearTablaZonas()
     */
    function select($argumentos) {
        $where = UtilConexion::getWhere($argumentos); // Se construye la clausula WHERE
        extract($argumentos);
        if (isset($id)) {
            $where = "WHERE ciudad_id = '$id'";
        } else {
            $where = "WHERE ciudad_id = 'ninguna'";
        }
        $count = UtilConexion::$pdo->query("SELECT id FROM zona_select $where")->rowCount();
        // Calcula el total de páginas por consulta
        if ($count > 0) {
            $total_pages = ceil($count / $rows);
        } else {
            $total_pages = 0;
        }

        // Si por alguna razón página solicitada es mayor que total de páginas
        // Establecer a página solicitada total paginas  (¿por qué no al contrario?)
        if ($page > $total_pages)
            $page = $total_pages;

        // Calcular la posición de la fila inicial
        $start = $rows * $page - $rows;
        //  Si por alguna razón la posición inicial es negativo ponerlo a cero
        // Caso típico es que el usuario escriba cero para la página solicitada
        if ($start < 0)
            $start = 0;

        $respuesta = [
            'total' => $total_pages,
            'page' => $page,
            'records' => $count
        ];

        $sql = "SELECT * FROM zona_select $where ORDER BY $sidx $sord LIMIT $rows OFFSET $start";
        foreach (UtilConexion::$pdo->query($sql) as $fila) {
            $departamento = $fila['departamento_nombre'];

            $respuesta['rows'][] = [
                'id' => $fila['id'],
                'cell' => [
                    $fila['id'],
                    $fila['nombre'],
                    $this->tiposZonas[$fila['tipo']],
                    $departamento,
                    $fila['ciudad_nombre'] . " " . ucfirst(strtolower($departamento))
                ]
            ];
        }
        echo json_encode($respuesta);
    }

    function getSelect($argumentos) {
        extract($argumentos);
        $where = "";
        if ($ciudad != "") {
            $where = "WHERE ciudad_id = '$ciudad'";
        }
        $rs = UtilConexion::$pdo->exec("SELECT nombre, id FROM zona_select $where");
        $lista = $rs->GetMenu('lstZonas', "", false, false, 1, 'id="lstzonas"');
        echo $lista;
    }

    /**
     * Devuelve un select con los tipos de zonas en que se puede clasificar un lugar municipal
     * @return <select>
     */
    function getTiposZonas() {
        echo json_encode($this->tiposZonas);
    }

    /**
     * http://localhost/gea/controlador/fachada.php?clase=Zona&oper=getLista&json=0
     * Devuelve un array asociativo de la forma:
     *      {"id1":"Dato1", "id2":"Dato2", ...,"idN":"DatoN"}
     * Util para crear combos en la capa de presentación
     * @param <type> $argumentos
     */
    public function getLista($argumentos) {
        $json = TRUE;
        $where = "";
        extract($argumentos);
        if (isset($ciudad)) {
            $where = "WHERE ciudad_id = '$ciudad'";
        }
        $filas[''] = 'Seleccione un lugar o zona';
        $filas += UtilConexion::$pdo->query("SELECT id, nombre FROM zona_select $where ORDER BY nombre")->fetchAll(PDO::FETCH_KEY_PAIR);
        $filas = Utilidades::getCombo($filas, $idSelect, $otrosDatos, $soloItems);
        echo $json ? json_encode($filas) : $filas;
    }

}

?>
