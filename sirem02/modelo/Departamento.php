<?php

/**
 * Description of Departamento
 * Las instancias de esta clase se conectan con la base de datos a traves de
 * una referencia que se tiene de PDO.
 * @author Carlos
 */
class Departamento implements Persistible {

    /**
     * Inserta una nueva fila enviada por $_POST
     * @param <type> $argumentos El array que contiene los argumentos enviados por $_POST
     */
    function add($argumentos) {
        extract($argumentos);
        UtilConexion::$pdo->exec("SELECT departamento_insertar('$id', '$nombre')");
        echo UtilConexion::getEstado();
    }

    /**
     * Actualiza una fila.
     * @param <type> $argumentos Un array con el id a buscar y el nuevo tema
     */
    function edit($argumentos) {
        extract($argumentos);
        UtilConexion::$pdo->exec("SELECT departamento_actualizar('$id', '$idNuevo', '$nombre')");
        echo UtilConexion::getEstado();
    }

    /**
     * Elimina las filas cuyos IDs se pasen como argumentos.
     * @param <type> $argumentos los IDs de los departamentos a ser eliminados.
     * $argumentos es un cadena que contiene uno o varios números separados por
     * comas, que corresponden a los IDs de las filas a eliminar.
     */
    function del($argumentos) {
        $datos = "'{" . $argumentos['id'] . "}'";
        UtilConexion::$pdo->exec("select departamento_eliminar($datos)");
        echo UtilConexion::getEstado();
    }

    /**
     * Devuelve los datos necesarios para construir una tabla dinámica.
     * @param <type> $argumentos los argumentos enviados por:
     *               Departamento.js.crearTablaDepartamento()
     */
    function select($argumentos) {
        $where = UtilConexion::getWhere($argumentos); // Se construye la clausula WHERE
        if ($where) {
            $where = $where . " AND id <> '0'";
        } else {
            $where = " WHERE id <> '0'";
        }
        extract($argumentos);
        $count = UtilConexion::$pdo->query("SELECT id FROM departamento_select $where")->rowCount();
        // Calcula el total de páginas por consulta
        if ($count > 0) {
            $total_pages = ceil($count / $rows);
        } else {
            $total_pages = 0;
        }

        // Si por alguna razón página solicitada es mayor que total de páginas
        // Establecer a página solicitada total paginas  (¿por qué no al contrario?)
        if ($page > $total_pages) {
            $page = $total_pages;
        }

        // Calcular la posición de la fila inicial
        $start = $rows * $page - $rows;
        //  Si por alguna razón la posición inicial es negativo ponerlo a cero
        // Caso típico es que el usuario escriba cero para la página solicitada
        if ($start < 0) {
            $start = 0;
        }

        $respuesta = [
            'total' => $total_pages,
            'page' => $page,
            'records' => $count
        ];

        $sql = "SELECT * FROM departamento_select $where ORDER BY $sidx $sord LIMIT $rows OFFSET $start";
        foreach (UtilConexion::$pdo->query($sql) as $fila) {
            $respuesta['rows'][] = [
                'id' => $fila['id'],
                'cell' => [$fila['id'], $fila['nombre']]
            ];
        }
        // Quite los comentarios para ver el array original y el array codificado en JSON
        // error_log(print_r($respuesta, TRUE));
        // error_log(print_r(json_encode($respuesta), TRUE));
        echo json_encode($respuesta);
    }

    /**
     * Devuelve un array asociativo de la forma: {"id1":"Dato1", "id2":"Dato2", ...,"idN":"DatoN"}
     */
    public function getLista() {
        $filas[] = ['id' => 0, 'valor' => 'Seleccione un departamento'];
        $filas += UtilConexion::$pdo->query("SELECT id, nombre FROM departamento_select ORDER BY nombre")->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($filas);
    }

    public function getSelect() {
        $select = "<select>";
        $select .= "<option value='0'>Seleccione un departamento</option>";
        foreach (UtilConexion::$pdo->query("SELECT id, nombre FROM departamento_select ORDER BY nombre") as $fila) {
            $select .= "<option value='{$fila['id']}'>{$fila['nombre']}</option>";
        }
        echo ($select . "</select>");
    }

}

?>
