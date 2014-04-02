<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Grupos
 *
 * @author EQUIPO
 */
class Grupo {
    //put your code here
    
    public function getSelect($argumentos) {
        $id = 'cbo' . rand(0, 99999);
        extract($argumentos);
        $select = "<select id='$id'>";
        $select .= "<option value='0'>Seleccione un Grupo</option>";
        foreach (UtilConexion::$pdo->query("SELECT g.id id , g.id || ' '|| a.nombre grupo  FROM grupos g inner join asignatura a on g.fk_asignatura= a.id") as $fila) {
            $select .= "<option value='{$fila['id']}'>{$fila['grupo']}</option>";
        }
        $select .= "</select>";
        echo tipoRetorno == 'json' ? json_encode($select) : ($select . "</select>");
    }
    
}
