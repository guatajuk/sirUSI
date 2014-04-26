<?php

/**
 * Description of TipoEquipo
 *
 * @author Jonathan Cortes
 */
class TipoEquipo {
    
    function add($argumentos) {
        extract($argumentos);
        UtilConexion::$pdo->exec("Insert Into tipo_equipo values('$id', '$nombre')");
        echo UtilConexion::getEstado();
    }
    
    function edit($argumentos) {
        extract($argumentos);
        UtilConexion::$pdo->exec("Update tipo_equipo set id = '$id', nombre = '$nombre' where id = '$id'");
        echo UtilConexion::getEstado();
    }
    
    function del($argumentos) {
        extract($argumentos);
        UtilConexion::$pdo->exec("delete from tipo_equipo where id = '$id'");
        echo UtilConexion::getEstado();
    }

    function select($argumentos) {
        $where = UtilConexion::getWhere($argumentos); 
        if ($where) {
            $where = $where . " AND id <> 0";
        } else {
            $where = " WHERE id <> 0";
        }
        extract($argumentos);
        $count = UtilConexion::$pdo->query("SELECT id FROM tipo_equipo $where")->rowCount();
        if ($count > 0) {
            $total_pages = ceil($count / $rows);
        } else {
            $total_pages = 0;
        }

        if ($page > $total_pages) {
            $page = $total_pages;
        }

        $start = $rows * $page - $rows;
        if ($start < 0) {
            $start = 0;
        }

        $respuesta = [
            'total' => $total_pages,
            'page' => $page,
            'records' => $count
        ];

        $sql = "SELECT * FROM tipo_equipo $where ORDER BY $sidx $sord LIMIT $rows OFFSET $start";
        foreach (UtilConexion::$pdo->query($sql) as $fila) {
            $respuesta['rows'][] = [
                'id' => $fila['id'],
                'cell' => [$fila['id'], $fila['nombre']]
            ];
        }
        echo json_encode($respuesta);
    }    
}

?>
