<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Configuracion
 *
 * @author Sebas
 */
class Configuracion {
    
    
    public static function leerJson(){
        $file='../serviciosTecnicos/varios/configuracion.json';
        $json = json_decode(file_get_contents($file), true);
        $jsonArray=[$json['fecha inicial'],$json['fecha final']];
        echo json_encode(["mensaje" => $jsonArray]);
        
        
    }
    
    public static function escribirJson(){
        if (isset($_POST['inicio']) && isset($_POST['fin'])) {
            $jsonAsArray=['fecha inicial'=>$_POST['inicio'],'fecha final'=>$_POST['fin']];
            $jsonArray=[$_POST['inicio'],$_POST['fin']];
            $json=  json_encode($jsonAsArray);
            file_put_contents('../serviciosTecnicos/varios/configuracion.json', $json);
            echo json_encode(["mensaje" => $jsonArray]);
        }else{
            $jsonArray=['No modificada','No modificada'];
            echo json_encode(["mensaje" => $jsonArray]);
        }
    }
    
    public static function procesarExcel(){
        error_log('entro a procesarExcel en Configuracion.php');
        require_once 'UtilReadFromExcel.php';
        $ex=new UtilReadFromExcel();
        $ex->prueba();
    }
    
}
