-- sirusi versión 1.0.1 Beta, 2 de febrero de 2014
-- Se agregó una relación entre usuario y programacion_monitores para facilitar
-- el CRUD sobre registro_monitoria.

DO LANGUAGE plpgsql $$ DECLARE
BEGIN
   IF NOT EXISTS(SELECT 0 FROM pg_class where relname = 'odd_seq') THEN
      CREATE SEQUENCE odd_seq INCREMENT BY 2 START WITH 1;
   ELSE
      RAISE NOTICE 'La secuencia odd_seq ya existe';
   END IF;

   IF NOT EXISTS(SELECT 0 FROM pg_class where relname = 'even_seq') THEN
      CREATE SEQUENCE even_seq INCREMENT BY 2 START WITH 2;
   ELSE
      RAISE NOTICE 'La secuencia even_seq ya existe';
   END IF;
END $$;

DROP TABLE IF EXISTS rol CASCADE;

CREATE TABLE rol (
  id serial NOT NULL,
  nombre varchar,
  CONSTRAINT pk_ro_id PRIMARY KEY (id),
  CONSTRAINT ck_ro_no CHECK (nombre IN ('ADMINISTRATIVO','ESTUDIANTE','MONITOR','EGRESADO','DOCENTE','INVITADO','ADMINISTRADOR')),
  CONSTRAINT ck_ro_id CHECK (id BETWEEN 0 AND 6)
);

DROP TABLE IF EXISTS dependencia CASCADE;

CREATE TABLE dependencia (
id serial,
nombre varchar(100),
correo varchar(50),
CONSTRAINT pk_dep_id PRIMARY KEY (id)
);

DROP TABLE IF EXISTS asignatura CASCADE;

CREATE TABLE asignatura (
  id varchar(100) NOT NULL,
  nombre varchar(100),
  modalidad SMALLINT,  -- 0-Presencial 1-semipresencial 2-No presencial 3-Formal 4-No formal, 5-Pregrado, 6-Postgrado
  fk_dependencia integer,
  CONSTRAINT pk_hg_id PRIMARY KEY (id),
      CONSTRAINT as_fk_dep FOREIGN KEY (fk_dependencia) REFERENCES dependencia (id) ON DELETE CASCADE
      
);

DROP TABLE IF EXISTS usuario CASCADE;

CREATE TABLE usuario (
  codigo character varying(12) NOT NULL,
  nombre character varying(30),
  apellido character varying(30),
  telefono character varying(50),
  email character varying(50),
  fk_rol integer,
  fk_dependencia integer,
  CONSTRAINT pk_us_co PRIMARY KEY (codigo),
  CONSTRAINT fk_us_ro FOREIGN KEY (fk_rol)
      REFERENCES rol (id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE,
      CONSTRAINT us_fk_id FOREIGN KEY (fk_dependencia)REFERENCES dependencia (id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS tipo_equipo CASCADE;

CREATE TABLE tipo_equipo (
  id serial NOT NULL,
  nombre character varying(20),
  CONSTRAINT pk_te_id PRIMARY KEY (id)
);

DROP TABLE IF EXISTS software CASCADE;

CREATE TABLE software (
  id serial NOT NULL,
  nombre character varying(50),
  version character varying(10),
  CONSTRAINT pk_so_id PRIMARY KEY (id)
);

DROP TABLE IF EXISTS sede CASCADE;

CREATE TABLE sede (
  nombre character varying(50) NOT NULL,
  direccion character varying(50),
  CONSTRAINT pk_se_no PRIMARY KEY (nombre)
);

DROP TABLE IF EXISTS equipo CASCADE;

CREATE TABLE equipo (
  id serial NOT NULL,
  codigo_inventario character varying(15),
  descripcion character varying,
  fk_tipo_equipo integer,
  estado SMALLINT,
  CONSTRAINT pk_eq_id PRIMARY KEY (id),
  CONSTRAINT ref_equipo_to_tipo_equipo FOREIGN KEY (fk_tipo_equipo)
      REFERENCES tipo_equipo (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);

DROP TABLE IF EXISTS bloque CASCADE;

CREATE TABLE bloque (
  nombre character varying(100) NOT NULL,  
  fk_sede character varying(50),
  CONSTRAINT pk_bl_no PRIMARY KEY (nombre),
  CONSTRAINT fk_bl_se FOREIGN KEY (fk_sede)
      REFERENCES sede (nombre) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS sala CASCADE;

CREATE TABLE sala (
  nombre character varying(50) NOT NULL,  
  capacidad smallint,
  fk_bloque character varying(50),
  CONSTRAINT pk_sa_no PRIMARY KEY (nombre),
  CONSTRAINT fk_bl_se FOREIGN KEY (fk_bloque)
      REFERENCES bloque (nombre) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS equipo_sala CASCADE;

CREATE TABLE equipo_sala (
  id serial NOT NULL,
  codigo_inventario character varying(15),
  observaciones character varying,
  estado smallint,
  fk_sala character varying(50),
  CONSTRAINT ck_estado_equipo CHECK (estado BETWEEN 0 AND 3), -- 0 SOLICITADO  1 USO 2 ENTREGADO 3 VENCIDA 
  CONSTRAINT pk_e_s_id PRIMARY KEY (id),
  CONSTRAINT fk_es_sa FOREIGN KEY (fk_sala)
      REFERENCES sala (nombre) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);

DROP TABLE IF EXISTS reserva_sala CASCADE;

CREATE TABLE reserva_sala (
  id integer NOT NULL DEFAULT nextval('odd_seq'),  -- OJO --
  fecha_inicio timestamp without time zone,
  fecha_fin timestamp without time zone,
  actividad character varying, 
  fk_usuario character varying(12),
  fk_sala character varying(50),
  estado smallint,
  observaciones character varying,
  fk_responsable varchar(12),  -- quien autoriza
  color varchar(10),
  CONSTRAINT ck_estado_reserva_sala CHECK (estado BETWEEN 0 AND 5), -- 0-SOLICITADA,  1- EN USO 2 ENTREGADA 3 VENCIDA, ...
  CONSTRAINT pk_rs_id PRIMARY KEY (id),
  CONSTRAINT fk_rs_sa FOREIGN KEY (fk_sala)
      REFERENCES sala (nombre) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_rs_so FOREIGN KEY (fk_usuario)
      REFERENCES usuario (codigo) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_rs_res FOREIGN KEY (fk_responsable)
      REFERENCES usuario (codigo) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE
  --CONSTRAINT ck_rs_res CHECK (fk_responsable=6 OR fk_responsable=2)   ??????????????????????
);

DROP TABLE IF EXISTS programacion_monitores CASCADE;

CREATE TABLE programacion_monitores (
  id serial NOT NULL,
  fk_usuario_monitor character varying(12),
  hora_inicio time without time zone,
  hora_fin time without time zone,
  dia smallint,
  CONSTRAINT programacion_monitores_pkey PRIMARY KEY (id),
  CONSTRAINT ref_programacion_monitores_to_usuario FOREIGN KEY (fk_usuario_monitor)
      REFERENCES usuario (codigo) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT ck_pm_dia CHECK (dia >= 0 AND dia <= 6)
);

DROP TABLE IF EXISTS control_monitorias CASCADE;

CREATE TABLE control_monitorias (
  id serial NOT NULL,
  fk_programacion_monitores integer,
  hora_inicio timestamp without time zone,
  hora_fin timestamp without time zone,
  fk_sala character varying(50),
  CONSTRAINT control_monitorias_pkey PRIMARY KEY (id),
  CONSTRAINT ref_monitorias_to_programacion_monitores FOREIGN KEY (fk_programacion_monitores)
      REFERENCES programacion_monitores (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT ref_monitorias_to_sala FOREIGN KEY (fk_sala)
      REFERENCES sala (nombre) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);

DROP TABLE IF EXISTS software_sala CASCADE;

CREATE TABLE software_sala (
  id serial NOT NULL,
  fk_software integer NOT NULL,  
  fk_sala character varying(50),
  CONSTRAINT software_sala_pkey PRIMARY KEY (id),
  CONSTRAINT fk_so_se FOREIGN KEY (fk_sala)
      REFERENCES sala (nombre) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_so_so FOREIGN KEY (fk_software)
      REFERENCES software (id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS registro_monitoria CASCADE;

CREATE TABLE registro_monitoria (
  id serial NOT NULL,
  fecha_inicio timestamp without time zone,
  fecha_fin timestamp without time zone,
  observaciones character varying,
  fk_usuario character varying(12) NOT NULL,
  fk_control_monitores integer,
  CONSTRAINT pk_rm_id_es PRIMARY KEY (id),
  CONSTRAINT ref_registro_monitoria_to_monitorias FOREIGN KEY (fk_control_monitores)
      REFERENCES control_monitorias (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT ref_registro_monitoria_to_usuario FOREIGN KEY (fk_usuario)
      REFERENCES usuario (codigo) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);

DROP TABLE IF EXISTS login CASCADE;

CREATE TABLE login (
  usuario character varying(12) NOT NULL,
  clave character varying(100),
  fk_rol smallint,
  CONSTRAINT pk_lo_us PRIMARY KEY (usuario),
  CONSTRAINT fk_lo_rl FOREIGN KEY (fk_rol)
      REFERENCES rol (id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_lo_us FOREIGN KEY (usuario)
      REFERENCES usuario (codigo) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS grupos CASCADE;

CREATE TABLE grupos (
  id character varying NOT NULL,
  fk_asignatura character varying(10) NOT NULL,
  fk_usuario_profe character varying(12),
  cupos smallint,
  fecha_inicio date,
  fecha_fin date,
  CONSTRAINT pk_dr_id PRIMARY KEY (id),
  CONSTRAINT fk_gr_as FOREIGN KEY (fk_asignatura)
      REFERENCES asignatura (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT fk_gr_pr FOREIGN KEY (fk_usuario_profe)
      REFERENCES usuario (codigo) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);

DROP TABLE IF EXISTS reserva_equipo CASCADE;

CREATE TABLE reserva_equipo (
  id serial NOT NULL,
  fecha_inicio timestamp without time zone,
  fecha_fin timestamp without time zone,
  color character varying(10),
  fk_usuario character varying(12),  -- 
  fk_equipo integer,
  estado smallint, -- 0 SOLICITADO, 1 EN USO, 2 ENTREGADO, 3 VENCIDO, ...
  observaciones character varying,
  fk_responsable varchar(12),  -- quien autoriza la reserva
  CONSTRAINT ck_estado_reserva_equipo CHECK (estado BETWEEN 0 AND 5),
  CONSTRAINT pk_re_id PRIMARY KEY (id),
  CONSTRAINT fk_re_eq FOREIGN KEY (fk_equipo)
      REFERENCES equipo (id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_re_us FOREIGN KEY (fk_usuario)
      REFERENCES usuario (codigo) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE,
      CONSTRAINT fk_re_res FOREIGN KEY (fk_responsable)
      REFERENCES usuario (codigo) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS restriccion_calendario CASCADE;

CREATE TABLE restriccion_calendario (
  id integer NOT NULL DEFAULT nextval('even_seq'),  -- OJO --
  hora_inicio time,  
  hora_fin time,    
  fk_usuario character varying(12),
  color character varying(10),
  fk_sala character varying(50),
  fk_grupo character varying,
  dia smallint,  -- siendo dia 0-domingo, 1-lunes, ...
  CONSTRAINT pk_rc_id PRIMARY KEY (id),
  CONSTRAINT fk_rc_gr FOREIGN KEY (fk_grupo)
      REFERENCES grupos (id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_rc_sa FOREIGN KEY (fk_sala)
      REFERENCES sala (nombre) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_rc_us FOREIGN KEY (fk_usuario)
      REFERENCES usuario (codigo) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE
);

----------------------------  PROCEDIMIENTOS Y VISTAS -----------------------------------------------

