const express = require('express');
const router = express.Router();
const { json, query } = require('express');
const bodyParser= require('body-parser');
const path = require('path');
const request = require('request');
const axios = require('axios');
const { async } = require('rxjs');
const pool = require('../database');
const { route } = require('.');
const { isLoggedIn } = require('../lib/auth');
const helpers = require('../lib/helpers');
const { Console } = require('console');
const jwt = require('jsonwebtoken');
const { matchPassword } = require('../lib/helpers');

//------------PRUEBA

router.get('/prueba',async(req,res)=>{ 
     const caca = await pool.query('select * from usuarios')
     console.log(caca);
     res.send(caca);
});

//async for each 
const asyncForEach = async (array, callback) => {
  for (let i = 0; i < array.length; i++) {
    await callback(array[i], i, array);
  }
};



////////////////////////////////////////////////////////////////////AQUI----COMIENZAN-----------LOS---------------USUARIOS////////////////////////////////////////


///listar usuarios

router.get('/dashboard/:idUsuarios',async(req,res)=>{
  const {idUsuarios} = req.params; 
  const grad = await  pool.query('select grado from usuarios where idUsuarios =?',[idUsuarios]);
  auxi = grad[0];
  const grado = auxi.grado;
  console.log(grado)
  if(grado === 1){
   console.log('ADMIN DASH')
   const info = await pool.query('select * from usuarios');
   await asyncForEach(info, async (sect) => {
     sect.departamento = await pool.query(`select * from departamentos where idDep = ${sect.departamento}`);
   });
   if (info[0] ){
     console.log('hay')
     res.send(info);
   }else{
     console.log('no hay')
     const putaQuePariu = { yo:'eu'};
     res.send(putaQuePariu);
   }
  };
  if(grado === 2){
   console.log('doc')
   const info = await pool.query('select * from usuarios where idUsuarios = ?',[idUsuarios]);
   await asyncForEach(info, async (sect) => {
     sect.departamento = await pool.query(`select * from departamentos where idDep = ${sect.departamento}`);
   });
   console.log(info);
   res.send(info); 
  };
  if(grado === 3){
   console.log('doc')
   const info = await pool.query('select * from usuarios where idUsuarios = ?',[idUsuarios]);
   res.send(info); 
  };
});


//eliminar usuario
router.get('/eliminarUsuario/:idUsuarios',async(req,res)=>{
  const {idUsuarios} = req.params;
  console.log(idUsuarios);
  try{
  await pool.query('delete from usuarios where idUsuarios = ?',[idUsuarios]);
  res.send('foi eliminado');
  }catch(e){
    console.log(e);
  }
})
router.delete('/eliminarUsuario/:idUsuarios',async(req,res)=>{
  const {idUsuarios} = req.params;
  console.log(idUsuarios);
  try{
  await pool.query('delete from usuarios where idUsuarios = ?',[idUsuarios]);
  res.send(idUsuarios + 'foi eliminado');
  }catch(e){
    console.log(e);

  }
})
//adicionar usuario
router.post('/adicionarUsuario',async(req,res)=>{
  let {nombre,telefono,password,departamento,grado} = req.body;
  let puto= {
    nombre,
    telefono,
    password,
    departamento,
    grado
  }; 
  puto.password = await helpers.encryptPassword(password)
  console.log('caca')
  try{
    await pool.query('insert into usuarios set ?',[puto]);
    res.send('adicionado correctamente');
  }catch(e){
     console.log(e);
     res.redirect('back');
  }; 
});
//editar usuarios
router.get('/editarUsuario/:id',(req,res)=>{ 
  res.render('/aplicacion/modificar/modificarUsu')
  });
//editar usuarios put
  router.put('/editarUsuario/:idUsuarios',async(req,res)=>{
   const{idUsuarios} = req.params;
   nuevaInfo = req.body,
   console.log(nuevaInfo); 
   await pool.query('update  usuarios set ? where idUsuarios = ?',[nuevaInfo,idUsuarios]);
   res.send('back');
  });
 


//pacientes
router.get('/paciente/:idUsuarios',async(req,res)=>{
  const {idUsuarios} = req.params; 
  const id = idUsuarios;
  const grad = await  pool.query('select grado from usuarios where idUsuarios =?',[idUsuarios]);
  auxi = grad[0];
  const grado = auxi.grado;
  console.log(grado)
  if(grado === 1){
   const info = await pool.query('select * from usuarios where grado = 3');
   if (info[0] ){
    console.log('hay')
    res.send(info);
  }else{
    console.log('no hay')
    const putaQuePariu = { yo:'eu'};
    res.send(putaQuePariu);
  }

  };
  if(grado === 2){
   console.log('doc')
   const estado = 'confirmado';
   const info = await pool.query('select * from solicitudes where estado = ? and doctor = ?',[estado, idUsuarios]);
   await asyncForEach(info, async (sect) => {
    sect.pacientes = await pool.query(`select * from usuarios where idUsuarios = ${sect.idUsuario}`);
    await asyncForEach(info, async (sect) => {
      sect.servicios = await pool.query(`select * from servicios where  idServ = ${sect.idServicio}`);
    });
  });
  if (info[0] ){
    console.log('hay')
    res.send(info);
  }else{
    console.log('no hay')
    const putaQuePariu = { yo:'eu'};
    res.send(putaQuePariu);
  } 
  };
  if(grado === 3){
   console.log('doc')
   const info = await pool.query('select * from usuarios where idUsuarios = ?',[idUsuarios]);
   res.send(info); 
  };
});

//listar categorias

router.get('/categorias/:idUsuarios',async(req,res)=>{
  const {idUsuarios} = req.params; 
  const grad = await  pool.query('select grado from usuarios where idUsuarios =?',[idUsuarios]);
  auxi = grad[0];
  const grado = auxi.grado;
  console.log(grado)
  if(grado === 1){
    const prohibido = 5;
    const prohibido1 = 'admin';
   const info = await pool.query('select * from departamentos where nombreDep != ? and idDep != ? ',[prohibido1,prohibido] );
   await asyncForEach(info, async (sect) => {
    sect.servicios = await pool.query(`select * from servicios where idDep = ${sect.idDep}`);
  });
  if (info[0] ){
    console.log('hay')
    res.send(info);
  }else{
    console.log('no hay')
    const message = { yo:'eu'};
    console.log(message); 
    res.send(message);
  }
  };
  if(grado === 2){
   console.log('doc')
   const info = await pool.query('select * from usuarios, departamentos where usuarios.idUsuarios = ?  and  usuarios.departamento = departamentos.idDep',[idUsuarios]);
   await asyncForEach(info, async (sect) => {
    sect.departamento = await pool.query(`select * from servicios where idDep = ${sect.departamento}`);
    });
    if (info[0] ){
      console.log('hay')
      res.send(info);
    }else{
      console.log('no hay')
      const putaQuePariu = { yo:'eu'};
      res.send(putaQuePariu);
    }
  }; 
  if(grado === 3){
    const prohibido = 5;
    const prohibido1 = 'admin';
   const info = await pool.query('select * from departamentos where nombreDep != ? and idDep != ? ',[prohibido1,prohibido] );
   await asyncForEach(info, async (sect) => {
    sect.servicios = await pool.query(`select * from servicios where idDep = ${sect.idDep}`);
    sect.usuario = idUsuarios;
  });
  if (info[0] ){
    console.log('hay')
    res.send(info);
  }else{
    console.log('no hay')
    const putaQuePariu = { yo:'eu'};
    res.send(putaQuePariu);
  }
  };
});

//adicionar categorias 

router.post('/categoriasAdi',async(req,res)=>{
    const {nombreDep} = req.body;
    console.log(nombreDep);
    const puto = {nombreDep}
    await pool.query('insert into departamentos set ?',[puto]);
    console.log(puto);
    res.send(puto);
});

//eliminar categorias

router.get('/eliminarCat/:id', async(req,res)=>{
  const {id} = req.params
  const idDep = id;
  console.log(id);
  await pool.query('delete from departamentos where idDep = ?',[idDep]);
  res.send('hecho');
});

//eliminar servicios

router.get('/eliminarServ/:id', async(req,res)=>{
  const {id} = req.params
  const idServ = id;
  console.log(id);
  await pool.query('delete from servicios where idServ = ?',[idServ]);
  res.send('hecho'); 
});

 
 //adicionar servicios

router.post('/adicionarServ/', async(req,res)=>{ 
  const { idDep,nombreServ,costo}=req.body;
  const id = idDep;
  const nuevoInfo = { idDep,nombreServ,costo};
  await pool.query('insert into servicios set   ?',[nuevoInfo]);
  res.send('hecho');
});
//listar servicios

router.get('/listarServ/:id', async(req,res)=>{
  const {id} = req.params
  const idUsuarios = id;
  console.log(id);
   const info =await pool.query('select *  from usuarios, departamentos where usuarios.idUsuarios = ? and usuarios.departamento = departamentos.idDep',[idUsuarios]);
  await asyncForEach(info, async (sect) => {
    sect.servicios = await pool.query(`select * from servicios where idDep = ${sect.departamento}`);
  });
  console.log(info);
  res.send(info);
});

//listar personal  

router.get('/listarPersonal/:idUsuarios',async(req,res)=>{
  const {idUsuarios} = req.params; 
  const grad = await  pool.query('select grado from usuarios where idUsuarios =?',[idUsuarios]);
  auxi = grad[0];
  const grado = auxi.grado;
  console.log(grado)
  if(grado === 1){
   console.log('ADMIN DASH')
   const info = await pool.query('select * from usuarios where grado = 2');
   await asyncForEach(info, async (sect) => {
     sect.departamento = await pool.query(`select * from departamentos where idDep = ${sect.departamento}`);
   });
   if (info[0] ){
    console.log('hay')
    res.send(info);
  }else{
    console.log('no hay')
    const putaQuePariu = { yo:'eu'};
    res.send(putaQuePariu);
  }
  };
  if(grado === 2){
   console.log('doc') 
   const info = await pool.query('select * from usuarios where idUsuarios = ?',[idUsuarios]);
   res.send(info); 
  };
  if(grado === 3){
   console.log('doc')
   const info = await pool.query('select * from usuarios where idUsuarios = ?',[idUsuarios]);
   res.send(info); 
  };
});
//listar solicitudes 

router.get('/listarSolicitudes/:idUsuarios',async(req,res)=>{
  const {idUsuarios} = req.params; 
  const grad = await  pool.query('select grado from usuarios where idUsuarios =?',[idUsuarios]);
  auxi = grad[0];
  const grado = auxi.grado;
  console.log(grado)
  if(grado === 1){
    const estado = 'solicitado';
   console.log('ADMIN DASH')
   const info = await pool.query('select * from solicitudes where estado = ?',[estado]);
   await asyncForEach(info, async (sect) => {
     sect.usuarios = await pool.query(`select * from usuarios where idUsuarios = ${sect.idUsuario} `);
     await asyncForEach(info, async (sect) => {
     sect.servicios =  await pool.query(`select * from servicios where idServ = ${sect.idServicio}`);
     await asyncForEach(info, async (sect) => {
      sect.doctores =  await pool.query(`select * from usuarios where idUsuarios = ${sect.doctor} `);
     });
    });
    });
    if (info[0] ){
      console.log('hay')
      res.send(info);
    }else{
      console.log('no hay')
      const putaQuePariu = { yo:'eu'};
      res.send(putaQuePariu);
    }
  
  };
  if(grado === 2){
   console.log(req.session) 
   const estado = 'solicitado';
   const info = await pool.query('select * from solicitudes where  estado =  ? ',[estado]);
   await asyncForEach(info, async (sect) => {
     sect.pacientes = await pool.query(`select * from usuarios where idUsuarios = ${sect.idUsuario} `);
     await asyncForEach(info, async (sect) => {
     sect.servicios =  await pool.query(`select * from servicios where idServ = ${sect.idServicio}`);
    });
    });
    if (info[0] ){
      console.log('hay')
      res.send(info);
    }else{
      console.log('no hay')
      const putaQuePariu = { yo:'eu'};
      res.send(putaQuePariu);
    }
  }; 
  if(grado === 3){
    console.log(idUsuarios) 
    const estado = 'solicitado';
    const info = await pool.query('select * from  solicitudes where  estado =  ? and idUsuario = ?',[estado,idUsuarios]);
    await asyncForEach(info, async (sect) => {
      sect.doctores = await pool.query(`select * from usuarios where idUsuarios = ${sect.doctor} `);
      await asyncForEach(info, async (sect) => {
      sect.servicios =  await pool.query(`select * from servicios where idServ = ${sect.idServicio}`);
     });
     });
     if (info[0] ){
       console.log('hay')
       res.send(info);
     }else{
       console.log('no hay')
       const putaQuePariu = { yo:'eu'};
       res.send(putaQuePariu); 
     }
  };
});
 
//adicionar solicitudes
router.post('/solicitudes/adicionar', async(req,res)=>{
   const {idServ,idUsuarios,fecha} = req.body;
   const novaSol = { idServicio : idServ,idUsuario : idUsuarios,fecha, estado:'solicitado'};
   console.log('novaSol');
   await pool.query('insert into solicitudes set ?',[novaSol]);
   res.send('caca');
  });

//eliminar solicitudes

router.get('/eliminarSol/:id', async(req,res)=>{ 
  const {id} = req.params
  console.log(id); 
  const idSol = id;
  console.log(idSol);
  await pool.query('delete from solicitudes where idSol = ?',[idSol]);
  res.send('hecho');
});

//editar solicitudes get

router.get('/editarSol/:idSol', async (req,res)=>{
    const{idSol} = req.params;
    const info = await pool.query('select * from solicitudes where idSol = ?',[idSol])
    res.send(info);
});

//editar solicitudes post
router.post('/editarSol',async(req,res)=>{
  const {idSol,idServ,idUsuario,grado,idServicio,fecha,estado,doctor} = req.body;
  const novaInfo = {idServ,idUsuario,grado,idServicio,fecha,estado,doctor} 
  console.log(novaInfo);

  await pool.query('insert into solicitudes set ? where idSol = ?',[novaInfo,idSol]);
  res.send(novaInfo);
})

//confirmar consultas
router.post('/confirmarSol', async(req,res)=>{
  const {idSol,idUsuarios} = req.body;
  console.log(idUsuarios);
  const puta = {estado : 'confirmado', doctor:idUsuarios}
  await pool.query('update solicitudes set ? where idSol = ?' ,[puta,idSol])
  res.send('pedo')
});

//finalizar un servicio 
router.put('/finalizarSol/:idSol',async(req,res)=>{
    const {idSol} = req.params;
    console.log(idSol);
    const es = {estado : 'finalizado'}
    try{
    await pool.query('update solicitudes set ? where idSol = ?',[es,idSol]);
    res.send('hecho');
    }catch(e){
      console.log(e);
    }
    
});
 
//listar resultados


router.get('/listarResultados/:idUsuarios',async(req,res)=>{
  const {idUsuarios} = req.params; 
  const grad = await  pool.query('select grado from usuarios where idUsuarios =?',[idUsuarios]);
  auxi = grad[0];
  const grado = auxi.grado;
  console.log(grado)
  if(grado === 1){
    const auxi = { estado : 'solicitado'}; 
   console.log('ADMIN DASH')
   const info = await pool.query('select * from resultados where idPaciente = ?',[idUsuarios]);
    res.send(info.idServ);
    if (info[0] ){
      console.log('hay')
      res.send(info);
    }else{
      console.log('no hay')
      const putaQuePariu = { yo:'eu'};
      res.send(putaQuePariu);
    }
  
  };
  if(grado === 2){
   console.log(idUsuarios) 
   const estado = 'solicitado';
   const info = await pool.query('select * from solicitudes where  estado =  ? and doctor = ?',[estado,idUsuarios]);
   await asyncForEach(info, async (sect) => {
     sect.pacientes = await pool.query(`select * from usuarios where idUsuarios = ${sect.idUsuario} `);
     await asyncForEach(info, async (sect) => {
     sect.servicios =  await pool.query(`select * from servicios where idServ = ${sect.idServicio}`);
    });
    });
    if (info[0] ){
      console.log('hay')
      res.send(info);
    }else{
      console.log('no hay')
      const putaQuePariu = { yo:'eu'};
      res.send(putaQuePariu);
    } 
  }; 
  if(grado === 3){

   console.log('PAC DASH')
   const info = await pool.query('select * from resultados, usuarios where resultados.idPaciente = usuarios.idUsuarios');
   await asyncForEach(info, async (sect) => {
     sect.doctor = await pool.query(`select * from usuarios where idUsuarios = ${sect.idDoctor} `);
     await asyncForEach(info, async (sect) => {
     sect.servicios =  await pool.query(`select * from servicios, departamentos where servicios.idServ = ${sect.idServ} and servicios.idDep = departamentos.idDep`);
    });
    });
    if (info[0] ){
      console.log('hay')
      res.send(info);
    }else{
      console.log('no hay')
      const putaQuePariu = { yo:'eu'};
      res.send(putaQuePariu);
    }
  }
});

//listar facturas 

router.get('/listarFacturas/:idUsuarios',async(req,res)=>{
  const {idUsuarios} = req.params; 
  const grad = await  pool.query('select grado from usuarios where idUsuarios =?',[idUsuarios]);
  auxi = grad[0];
  const grado = auxi.grado;
  console.log(grado)
  if(grado === 1){
   console.log('ADMIN DASH')
   const info = await pool.query('select * from facturas ');
   await asyncForEach(info, async (sect) => {
     sect.paciente = await pool.query(`select * from usuarios where idUsuarios = ${sect.paciente} `);
     await asyncForEach(info, async (sect) => {
     sect.servicios =  await pool.query(`select * from servicios where idServ = ${sect.idServ}`);
     await asyncForEach(info, async (sect) => {
      sect.doctores =  await pool.query(`select * from usuarios where idUsuarios = ${sect.doctor} `);
     });
    });
    });
    if (info[0] ){
      console.log('hay')
      res.send(info);
    }else{
      console.log('no hay')
      const putaQuePariu = { yo:'eu'};
      res.send(putaQuePariu);
    }
  
  };
  if(grado === 2){
   console.log(idUsuarios) 
   const estado = 'solicitado';
   const info = await pool.query('select * from solicitudes where  estado =  ?',[estado]);
   await asyncForEach(info, async (sect) => {
     sect.pacientes = await pool.query(`select * from usuarios where idUsuarios = ${sect.idUsuario} `);
     await asyncForEach(info, async (sect) => {
     sect.servicios =  await pool.query(`select * from servicios where idServ = ${sect.idServicio}`);
    });
    });
    if (info[0] ){
      console.log('hay')
      res.send(info);
    }else{
      console.log('no hay')
      const putaQuePariu = { yo:'eu'};
      res.send(putaQuePariu);
    }
  }; 
  if(grado === 3){
    console.log(idUsuarios) 
    const estado = 'solicitado';
    const info = await pool.query('select * from  solicitudes where  estado =  ? and idUsuario = ?',[estado,idUsuarios]);
    await asyncForEach(info, async (sect) => {
      sect.doctores = await pool.query(`select * from usuarios where idUsuarios = ${sect.doctor} `);
      await asyncForEach(info, async (sect) => {
      sect.servicios =  await pool.query(`select * from servicios where idServ = ${sect.idServicio}`);
     });
     });
     if (info[0] ){
       console.log('hay')
       res.send(info);
     }else{
       console.log('no hay')
       const putaQuePariu = { yo:'eu'};
       res.send(putaQuePariu); 
     }
  };
});
router.delete('/eliminarFac/:idFac',async (req,res)=>{
  console.log('carajo')
  const {idFac}= req.params;
  console.log(idFac);
  await pool.query('delete from facturas where idFac = ?',[idFac]);
  res.send('hecho')
})


module.exports= router;  