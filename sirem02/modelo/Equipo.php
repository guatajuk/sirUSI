<?php

class Equipo {

    public function getSelect($argumentos) {
        $id = 'cbo' . rand(0, 99999);
        extract($argumentos);
        $select = "<select id='$id'>";
        foreach (UtilConexion::$pdo->query("SELECT id, alias FROM equipo") as $fila) {
            $select .= "<option value='{$fila['id']}'>{$fila['alias']}</option>";
        }
        $select .= "</select>";
        echo tipoRetorno == 'json' ? json_encode($select) : $select;
    }

}

?>
