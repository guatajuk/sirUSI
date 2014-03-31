<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of RestriccionesSalas
 *
 * @author USUARIO
 */
class RestriccionesSalas {

    /**
     * 
     * @param type $argumentos
     */
    public function getReservas($argumentos) {
        extract($argumentos);
        $sql = "
            (SELECT id_reserva_sala AS id, u.nombre ||' '|| u.apellido as usuario, fk_cod_sala as sala, fecha_inicio,fecha_fin, tipo_actividad, fk_responsable as responsable, color 
                FROM reserva_sala, usuarios u WHERE fk_cod_sala ='h' AND u.codigo=fk_cod_usuario) 
             UNION
            (SELECT rs.id, rs.nombre_docente as usuario, rs.fk_cod_sala AS sala, rs.fecha_inicio, rs.fecha_fin, 'clase' AS tipo_actividad, 'natalia' AS responsable, rs.color  
                FROM programacion_salas rs join salas s on rs.fk_cod_sala=s.cod_sala WHERE rs.fk_cod_sala ='h') 
            ORDER BY usuario
        ";
        $reservas = [];
        foreach (UtilConexion::$pdo->query($sql) as $lista) {
            $reservas[] = [
                'id' => $lista['id'],
                'title' => $lista['usuario'],
                'sala' => $lista['sala'],
                'start' => $lista['fecha_inicio'],
                'end' => $lista['fecha_fin'],
                'tipoactividad' => $lista['tipo_actividad'],
                'responsable' => $lista['responsable'],
                'color' => $lista['color'],
                'allDay' => FALSE
//              'anotacion' => $evento['anotacion'] // no puede faltar el campo para observaciones
            ];
        }
        echo json_encode($reservas);
    }

    public function insertarProgramacion($argumentos) {
        extract($argumentos);
        UtilConexion::$pdo->exec("INSERT INTO programacion_salas(cod_asignatura, nombre_asignatura, grupo, fecha_inicio, fecha_fin, 
                                         nombre_docente, fk_cod_sala, color)
                                         VALUES ('$cod_asignatura', '$nombre_asignatura','$grupo','$start','$end','$nombre_docente','$fk_cod_sala','$color' ) RETURNING id");
        error_log("INSERT INTO programacion_salas(cod_asignatura, nombre_asignatura, grupo, fecha_inicio, fecha_fin, 
                               nombre_docente, fk_cod_sala, color)
                               VALUES ('$cod_asignatura', '$nombre_asignatura','$grupo','$start','$$end','$nombre_docente','$fk_cod_sala','$color' ) RETURNING id");

        $id = UtilConexion::$pdo->lastInsertId();
        echo json_encode(['id' => $id]);
    }

    public function actualizarProgramacion($argumentos) {
        extract($argumentos);
        error_log("UPDATE programacion_salas
                     SET  fecha_inicio='$start', fecha_fin='$end' 
                     WHERE id=$idReserva");
        UtilConexion::$pdo->exec("UPDATE programacion_salas
                     SET  fecha_inicio='$start', fecha_fin='$end' 
                     WHERE id=$idReserva");

        UtilConexion::getEstado();
    }

    public function eliminarProgramacion($argumentos) {
        extract($argumentos);
        error_log($argumentos, 1);
        error_log("DELETE FROM programacion_salas WHERE id=$idReserva");
        UtilConexion::$pdo->exec("DELETE FROM programacion_salas WHERE id=$idReserva");
        UtilConexion::getEstado();
    }

}

?>
