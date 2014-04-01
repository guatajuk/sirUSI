<?php

/**
 * Description of Ciudad
 * Las instancias de esta clase se conectan con la base de datos a traves de
 * una referencia que se tiene de PDO.
 * @author Carlos
 */
class Ciudad implements Persistible {

    /**
     * Recibe un array de datos a insertar y con ellos crea una nueva fila en
     * la tabla con_Ciudad
     * @param <type> $argumentos La descripción del tema de congreso a insertar
     */
    function add($argumentos) {
        extract($argumentos);
        $ok = UtilConexion::$pdo->exec("SELECT ciudad_insertar('$ciudad_id', '$ciudad_nombre', '$fk_departamento')");
        echo json_encode($ok ? array('ok' => $ok, "mensaje" => "") : array('ok' => $ok, "mensaje" => "No se pudo agregar la ciudad"));
    }

    /**
     * Actualiza una fila de Ciudads.
     * @param <type> $argumentos Un array con el id a buscar y los otros nuevos datos,
     * estos datos se proporcionan de la siguiente manera:
     * $argumentos[0]: Id de la Ciudad a buscar y actualizar, los demás datos
     * corresponden a las columnas que se van a actualizar
     */
    function edit($argumentos) {
        extract($argumentos);
        $ok = UtilConexion::$pdo->exec("SELECT ciudad_actualizar('$id', '$ciudad_id', '$ciudad_nombre', '$fk_departamento')");
        echo json_encode($ok ? array('ok' => $ok, "mensaje" => "") : array('ok' => $ok, "mensaje" => "Falló la actualización de los datos"));
    }

    /**
     * Elimina las Ciudads cuyos IDs se pasen como argumentos.
     * @param <type> $argumentos los IDs de las Ciudads a ser eliminadas.
     * $argumentos es un cadena que contiene uno o varios números separados por
     * comas, que corresponden a los IDs de las filas a eliminar.
     */
    function del($argumentos) {
        // El formato que espera postgres es: SELECT sede_eliminar('{v1,...,vn}');
        $datos = "'{" . $argumentos['id'] . "}'";
        $ok = UtilConexion::$pdo->exec("select ciudad_eliminar($datos)");
        echo json_encode($ok ? array('ok' => $ok, "mensaje" => "") : array('ok' => $ok, "mensaje" => "Falló la eliminación"));
    }

    /**
     * Devuelve los datos necesarios para construir una tabla dinámica.
     * @param <type> $argumentos los argumentos enviados por:
     * Ciudad.js.crearTablaCiudades()
     */
    function select($argumentos) {
        $where = UtilConexion::getWhere($argumentos); // Se construye la clausula WHERE
        extract($argumentos);
        if (isset($id)) {
            $where = "WHERE departamento_id = '$id'";
        } else {
            $where = "WHERE departamento_id = 'ninguno'";
        }
        $count = UtilConexion::$pdo->query("SELECT ciudad_id FROM ciudad_select $where")->rowCount();
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

        $sql = "SELECT * FROM ciudad_select $where ORDER BY $sidx $sord LIMIT $rows OFFSET $start";
        foreach (UtilConexion::$pdo->query($sql) as $fila) {
            $respuesta['rows'][] = [
                'id' => $fila['ciudad_id'],
                'cell' => [$fila['ciudad_id'], $fila['ciudad_nombre'], $fila['departamento_nombre']]
            ];
        }
        echo json_encode($respuesta);
    }

    function getSelect($argumentos) {
        extract($argumentos);
        $where = "";
        if ($departamento != "") {
            $where = "WHERE departamento_id = '$departamento'";
        }
        $rs = UtilConexion::$pdo->exec("SELECT ciudad_nombre, ciudad_id FROM ciudad_select $where");
        $lista = $rs->GetMenu('lstCiudades', "", false, false, 1, 'id="lstCiudades"');
        echo $lista;
    }

    /**
     * Devuelve un array asociativo de la forma: {"id1":"Dato1", "id2":"Dato2", ...,"idN":"DatoN"}
     * Util para crear combos en la capa de presentación
     * @param <type> $argumentos
     */
    public function getLista($argumentos) {
        $where = "";
        extract($argumentos);
        if (isset($departamento)) {
            $where = "WHERE departamento_id = '$departamento'";
        }
        $filas[''] = 'Seleccione una ciudad';
        $filas += UtilConexion::$pdo->query("SELECT ciudad_id, ciudad_nombre FROM ciudad_select $where ORDER BY ciudad_nombre")->fetchAll(PDO::FETCH_KEY_PAIR);
        echo json_encode($filas);
    }

    /**
     * Devuelve el código de una ciudad y un departamento dado el nombre de la ciudad y el departamento
     * @param string $argumentos un array que tiene el nombre de la ciudad y del departamento separados sólo por espacio
     */
    public function getLocalidad($argumentos) {
        extract($argumentos);
        $localidad = explode(' ', $localidad);
        if (count($localidad) == 2) {
            $ciudad = ucfirst($localidad[0]);
            $departamento = strtoupper($localidad[1]);
            if (($fila = UtilConexion::$pdo->query("SELECT * FROM ciudad_select WHERE ciudad_nombre = '$ciudad' AND departamento_nombre = '$departamento'")->fetch(PDO::FETCH_ASSOC))) {
                return array('idDepto' => $fila['departamento_id'], 'depto' => $fila['departamento_nombre'], 'idCiudad' => $fila['ciudad_id'], 'ciudad' => $fila['ciudad_nombre']);
            }
        } else {
            return array('idDepto' => 0, 'depto' => '', 'idCiudad' => 0, 'ciudad' => '');
        }
    }

}

?>
