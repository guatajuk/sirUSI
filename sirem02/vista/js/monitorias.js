/**
 * Ejemplo básico de manipulación de datos en JQGrid
 */
$( function () {
    
    $("#demosvarios_ver_salas").button();
    
    var mydata = [
		{id:"1",equipo:"Equipo ECJ01",estado:"En uso",usuario:"Carlos García"} ,
		{id:"2",equipo:"Equipo ECJ02",estado:"Dañado",usuario:""},
		{id:"3",equipo:"Equipo ECJ03",estado:"Disponible",usuario:""},
		{id:"4",equipo:"Equipo ECJ04",estado:"En uso",usuario:"Natalia Arango"},
		{id:"5",equipo:"Equipo ECJ05",estado:"En uso",usuario:"Diego Correa"},
		{id:"6",equipo:"Equipo ECJ06",estado:"Disponible",usuario:""},
		{id:"7",equipo:"Equipo ECJ07",estado:"Disponible",usuario:""},
		{id:"8",equipo:"Equipo ECJ08",estado:"Disponible",usuario:""},
		{id:"9",equipo:"Equipo ECJ09",estado:"En uso",usuario:"Monica Naranjo"},
		{id:"10",equipo:"Equipo ECJ10",estado:"Dañado",usuario:""}
		
	];
        
    jQuery("#list01").jqGrid({
            data: mydata,
            datatype: "local",
            height: 120,
            rowNum: 10,
            rowList: [10,20,30],
            colNames:['Equipo','Estado', 'Usuario actual'],
            colModel:[
                   // {name:'id',index:'id', width:60, sorttype:"int"},
                    {name:'equipo',index:'equipo',editable:true, edittype:'select', editoptions:{value:{1:'Equipo ECJ01',2:'Equipo ECJ02'}, dataInit: function(elemento) {$(elemento).width(160)}}, width:150},
                    {name:'estado',index:'estado',editable:true, edittype:'select', editoptions:{value:{1:'En uso'},dataInit: function(elemento) {$(elemento).width(160)}}, width:150},
                    {name:'usuario',index:'usuario', editable:true, width:250}		
            ],
            pager: "#plist01",
            viewrecords: true,
            caption: "Equipos disponibles en la sala J - Edificio Orlando Sierra"
    }).jqGrid('navGrid', '#plist01', {
            refresh: true,
            edit: true,
            add: true,
            del: true,
            search: true
        });
    
    var mydata2 = [
		{id:"1",usuario:"Carlos García",equipo:"Equipo ECJ01",horai:"10:38",horafin:"11:38",novedades:"ok"} ,
		{id:"2",usuario:"Carolina Cifuentes",equipo:"Equipo ECJ02",horai:"09:02",horafin:"09:38",novedades:"No se encuentra en buen estado."},
		{id:"3",usuario:"Diana Rendón",equipo:"Equipo ECJ03",horai:"13:08",horafin:"14:20",novedades:"ok"},
		{id:"4",usuario:"Natalia Arango",equipo:"Equipo ECJ04",horai:"18:06",horafin:"18:43",novedades:"ok"},
		{id:"5",usuario:"Diego Correa",equipo:"Equipo ECJ05",horai:"07:26",horafin:"08:40",novedades:"ok"},
		{id:"6",usuario:"Andres Torres",equipo:"Equipo ECJ06",horai:"08:03",horafin:"08:25",novedades:"ok"},
		{id:"7",usuario:"Sergio Ospina",equipo:"Equipo ECJ07",horai:"11:04",horafin:"12:00",novedades:"ok"},
		{id:"8",usuario:"Camila Cuesta",equipo:"Equipo ECJ08",horai:"10:25",horafin:"11:38",novedades:"ok"},
		{id:"9",usuario:"Monica Naranjo",equipo:"Equipo ECJ09",horai:"10:38",horafin:"10:38",novedades:"ok"},
		{id:"10",usuario:"Jorge Román",equipo:"Equipo ECJ10",horai:"10:38",horafin:"10:50",novedades:"El equipo se apagó y no vuelve a prender."}
		
	];
        
    jQuery("#list02").jqGrid({
            data: mydata2,
            datatype: "local",
            height: 120,
            rowNum: 10,
            rowList: [10,20,30],
            colNames:['Usuario','Equipo','Hora inicial','Hora final','Novedades/Observaciones'],
            colModel:[
                    {name:'usuario',index:'usuario',editable:true, width:170},
                    {name:'equipo',index:'equipo',editable:true, width:100},
                    {name:'horai',index:'horai',editable:true, width:80},
                    {name:'horafin',index:'horafin',editable:true, width:80},
                    {name:'novedades',index:'novedades',editable:true, width:220}
                    		
            ],
            pager: "#plist02",
            viewrecords: true,
            caption: "Turnos en la sala J - Edificio Orlando Sierra"
    }).jqGrid('navGrid', '#plist02', {
            refresh: true,
            edit: true,
            add: true,
            del: true,
            search: true
        });
});
