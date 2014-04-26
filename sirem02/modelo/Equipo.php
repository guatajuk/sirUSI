<?php

class Equipo implements Persistible {

    public function getSelect($argumentos) {
        $id = 'cbo' . rand(0, 99999);
        extract($argumentos);
        $select = "<select id='$id'>";
        foreach (UtilConexion::$pdo->query("Select e.id as id, t.nombre||' '||e.descripcion as descripcion
                                        	from equipo e, tipo_equipo t
                                                    Where e.fk_tipo_equipo = t.id Order by 1 asc;") as $fila) {
            $select .= "<option value='{$fila['id']}'>{$fila['descripcion']}</option>";
        }
        $select .= "</select>";
        echo tipoRetorno == 'json' ? json_encode($select) : $select;
    }

    private $estadosEquipo;

//    public function getUsuarios() {
//        $filas['0'] = 'Seleccione un Equipo';
//        //$filas += UtilConexion::$pdo->query("SELECT nombre FROM usuarios where roll LIKE '%MONITOR%'")->fetchAll(PDO::FETCH_KEY_PAIR);
//        $filas += UtilConexion::$pdo->query("SELECT id, nombre FROM tipo_equipo ORDER BY nombre")->fetchAll(PDO::FETCH_KEY_PAIR);
//        error_log(print_r($filas, true));
//        echo json_encode($filas);
//    }

    function __construct() {
               
        $this->estadosEquipo = array(
            //'' => "",
            '1' => "En reparación",
            '2' => "No disponible",
            '3' => "Disponible"
        );
    }

    function add($argumentos) {
        extract($argumentos);
        UtilConexion::$pdo->exec("Insert Into equipo (codigo_inventario,descripcion,fk_tipo_equipo,estado) values('$codigo_inventario', '$descripcion', $fk_tipo_equipo, $estado)");
        
        //$ok = UtilConexion::$pdo->exec("Insert Into estudiante values ('$codigo', '$nombre', '$fecha_nacimiento', '$activo')");
        echo UtilConexion::getEstado();
    }

    function edit($argumentos) {
        extract($argumentos);
        UtilConexion::$pdo->exec("Update equipo set codigo_inventario = '$codigo_inventario', descripcion = '$descripcion', fk_tipo_equipo = '$fk_tipo_equipo', estado= '$estado' where codigo_inventario = '$id'");
        //error_log("Update equipo set codigo_inventario = '$codigo_inventario', descripcion = '$descripcion', fk_tipo_equipo = '$fk_tipo_equipo', estado= '$estado' where codigo_inventario = '$id'");
        echo UtilConexion::getEstado();
    }

    function del($argumentos) {
        //$datos = "'{" . $argumentos['id'] . "}'";
        extract($argumentos);
        UtilConexion::$pdo->exec("delete from equipo where codigo_inventario = '$id'");
        //error_log("delete from equipo where codigo_inventario = '$id'");
        //$ok = UtilConexion::$pdo->exec("select estudiante_eliminar('{7}')");
        //echo json_encode($ok ? array('ok' => $ok, "mensaje" => "") : array('ok' => $ok, "mensaje" => "Falló la eliminación"));
        echo UtilConexion::getEstado();
    }

    function select($argumentos) {
        $where = UtilConexion::getWhere($argumentos);
        extract($argumentos);
        if (isset($id)) {
            $where = "Where fk_tipo_equipo = $id";
        } else {
            $where = "Where fk_tipo_equipo = 0";
        }
        extract($argumentos);
        $count = UtilConexion::$pdo->query("SELECT codigo_inventario FROM equipo $where")->rowCount();
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

        $sql = "Select e.codigo_inventario as cod, e.descripcion as desc, t.nombre as nombre, e.estado as estado
                    from equipo as e, tipo_equipo as t
                        $where AND e.fk_tipo_equipo = t.id  ORDER BY $sidx $sord LIMIT $rows OFFSET $start";
        
        
//        print_r($sql);
        foreach (UtilConexion::$pdo->query($sql) as $fila) {
            $respuesta['rows'][] = [
                'id' => $fila['cod'],
                'cell' => [$fila['cod'], $fila['desc'], $fila['nombre'], $this->estadosEquipo[$fila['estado']]]
            ];
        }
        // Quite los comentarios para ver el array original y el array codificado en JSON
        // error_log(print_r($respuesta, TRUE));
        // error_log(print_r(json_encode($respuesta), TRUE));
        //error_log(print_r($respuesta, true));
        echo json_encode($respuesta);
    }

    /**
     * Devuelve un array asociativo de la forma: {"id1":"Dato1", "id2":"Dato2", ...,"idN":"DatoN"}
     */
//    public function getLista() {
//        $filas[] = ['id' => 0, 'valor' => 'Seleccione un departamento'];
//        $filas += UtilConexion::$pdo->query("SELECT id, nombre FROM departamento_select ORDER BY nombre")->fetchAll(PDO::FETCH_ASSOC);
//        echo json_encode($filas);
//    }

    public function getLista() {
        $filas[] = ['Seleccione Estado del Equipo'];
        $filas += UtilConexion::$pdo->query("SELECT codigo_inventario, estado FROM equipo ORDER BY fk_tipo_equipo")->fetchAll(PDO::FETCH_KEY_PAIR);
        //error_log(print_r($filas, true));
        echo json_encode($filas);
    }
    
    public function getTiposEquipo() {
        $filas[] = ['Seleccione Tipo del Equipo'];
        $filas += UtilConexion::$pdo->query("select id as id_tequipo, nombre as nombre_tequipo from tipo_equipo;")->fetchAll(PDO::FETCH_KEY_PAIR);
        //error_log(print_r($filas, true));
        echo json_encode($filas);
    }
    
     function getEstadoEquipo() {
        echo json_encode($this->estadosEquipo);
    }
}


?>
