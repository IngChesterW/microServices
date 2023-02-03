const express = require('express');
const router = express.Router();
const { json, response } = require('express');
const bodyParser= require('body-parser');
const path = require('path');
const request = require('request');
const axios = require('axios');
const { async } = require('rxjs');
const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');
const helpers = require('../lib/helpers');

//async for each 
const asyncForEach = async (array, callback) => {
  for (let i = 0; i < array.length; i++) {
    await callback(array[i], i, array);
  }
};

router.get('/prueba',async (req,res)=>{
       await request("http://localhost:4000/aplicacion/prueba/",(err,response,body)=>{  
           res.send(response.body);
        }); 

});
 
////////////////////////////////////////////---USO------DE-------SESIONES---INICIO--////////////////////////////////////////////////////////////

//ENTRAR-------EN-------------------LOGIN-------GET----------------------------->
router.get('/login',async(req,res)=>{
  res.render('/auth/login');
});
 
//SALIR-----DE---LA---SESION------------------------------------------------->
router.get('/logOut', (req, res) => {
  req.logOut();
  req.flash('message','salio correctamente de la session')
  res.redirect('/authentication/login');
});
////////////////////////////////////////////--USO------DE-------SESIONES---FIN--////////////////////////////////////////////////////////////




///////////////////////////////////////////////////--USUARIOS---INICIO--/////////////////////////////////////////////////////////////////


//LISTAR-----------USUARIOS------------------------------------------------------------------>
router.get('/Usuario', isLoggedIn ,async(req,res)=>{
  const auxi = req.session.passport; 
  const id = auxi.user;
  req.session.idUsuarios = id;
  const grad = await pool.query('select grado from usuarios where idUsuarios = ?',[id]);
  const aux = grad[0];
  const grado = aux.grado
  req.session.grado = grado;
  await request("http://localhost:4000/aplicacion/dashboard/"+id,(err,response,body)=>{  
    if(grado === 1){
      const infoAdmin =JSON.parse(body);
      res.render('aplicacion/listar/listarUsuario',{infoAdmin})
    };
    if(grado === 2){
      const infoDoc =JSON.parse(body);
      console.log('doc')
      res.render('aplicacion/listar/listarUsuario',{infoDoc})
    };
    if(grado === 3){
      const infoPac =JSON.parse(body);
   
      res.render('aplicacion/listar/listarUsuario',{infoPac}) 
    }

 }); 
});

//editar--------------------usuario--------GET----------------------------------------------------------->

router.get('/editarUsuario/:idUsuarios',async(req,res)=>{
    const {idUsuarios} = req.params;
    console.log(idUsuarios);

    const prohibido = 'cliente';
    const prohibido1 = 'admin';
    let infoAntiga = await pool.query('select * from usuarios where idUsuarios = ?',[idUsuarios]);
    await asyncForEach(infoAntiga, async (sect) => {
      sect.departamentos = await pool.query('select * from departamentos where nombreDep != ?',[prohibido1] );
     })
    res.render('aplicacion/modificar/modificarUsu',{infoAntiga});

}); 

//editar--------------------usuario--------POST---E----PUT------------------------------------------------>

router.post('/editarUsuario/',async(req,res)=>{
  let {nombre,telefono,grado,departamento,password,idUsuarios,fechaNac,apellidos}=req.body; 
  let nuevoInfo ={
   nombre,telefono,grado,departamento,password,fechaNac,apellidos
  };
  nuevoInfo.password = await helpers.encryptPassword(nuevoInfo.password);
  console.log(nuevoInfo.apellidos);
  await axios({ 
    method: 'put',   
    url: 'http://localhost:4000/aplicacion/editarUsuario/'+idUsuarios,
    data: nuevoInfo
}).then((response,err,body)=>{
    req.flash('message',nuevoInfo.nombre + ' fue modificado correctamente');
    res.redirect(301,'back')
}).catch((e)=>{
   console.log(e);
})
});  
 
//eliminar------------------usuario-------------------------------------------------------------------->
router.get('/eliminarUsuario/:idUsuarios', async (req,res)=>{
  const {idUsuarios} = req.params;
  console.log(idUsuarios);
  await request('http://localhost:4000/aplicacion/eliminarUsuario/'+idUsuarios,(err,response,body)=>{
  if(err){ 
     console.log(err);
     req.flash('message','algo deu errado');
     res.redirect(301,'back');
  }else{
    req.flash('message', idUsuarios + ' fue eliminado correctamente');
    res.redirect(301,'back');
  };
  })

});

//adicionar-------usuario------------GET----------------------------------------------------------------> 
router.get('/adicionarUsuario/',async(req,res)=>{
  const prohibido = 'cliente';
  const prohibido1 = 'admin';
  const departamentos = await pool.query('select * from departamentos where nombreDep != ? and nombreDep != ?',[prohibido,prohibido1]);
   res.render('aplicacion/adicionar/adicionarPersonal',{departamentos});
});

//adicionar---------usuarios------------POST------------------------------------------------------------>
router.post('/adicionarUsuario',async (req,res,flash)=>{
   const {nombre,telefono,grado,departamento,password}=req.body;
   const nuevoUsuario ={
    nombre,telefono,grado,departamento,password
   };
   await axios({
    method: 'post',
    url: 'http://localhost:4000/aplicacion/adicionarUsuario/',
    data: nuevoUsuario
  }).then((response,err,body)=>{
    if(err){
       console.log('merda');
    }else{
        req.flash('message', nuevoUsuario.nombre+ ' fue adicionado con exito');
        res.redirect(301,'/aplicacion/usuario')
      }
  }); 
});

///////////////////////////////////////////////////USUARIOS--FINAL/////////////////////////////////////////////////////



///////////////////////////////////////////////////--PACIENTE---INICIO--/////////////////////////////////////////////////////////////////


//Listar----------pacientes-------------------------------------------------->
router.get('/paciente', async (req,res)=>{
  const auxi = req.session.passport; 
  const id = auxi.user;
  req.session.idUsuarios = id;
  const grad = await pool.query('select grado from usuarios where idUsuarios = ?',[id]);
  const aux = grad[0];
  const grado = aux.grado
  req.session.grado = grado;
  await request("http://localhost:4000/aplicacion/paciente/"+id,(err,response,body)=>{  
    if(grado === 1){
      const infoAdmin =JSON.parse(body);
      console.log(infoAdmin);
      res.render('aplicacion/listar/listarPaciente',{infoAdmin})
    };
    if(grado === 2){
        const infoDoc =JSON.parse(body);
        console.log(infoDoc);
        res.render('aplicacion/listar/listarPaciente',{infoDoc})
      
    };
    if(grado === 3){
      const infoDoc =JSON.parse(body);
   
      res.render('aplicacion/listar/listarUsuario',{infoDoc}) 
    }

 }); 
});

/////////////////////////////////CATEGORIAS-----INICIO////////////////////////////////////////////////////////
 
router.get('/categorias',async(req,res)=>{
  const auxi = req.session.passport; 
  const id = auxi.user;
  req.session.idUsuarios = id;
  const grad = await pool.query('select grado from usuarios where idUsuarios = ?',[id]);
  const aux = grad[0];  
  const grado = aux.grado
  req.session.grado = grado;
  await request("http://localhost:4000/aplicacion/categorias/"+id,(err,response,body)=>{  
    if(grado === 1){
      let infoAdmin =JSON.parse(body);  
      if(infoAdmin.yo){
        console.log('no tiene '); 
        infoAdmin = {
          top : "no tienes nignuno, ve  a registrar más......"
        }
        console.log(infoAdmin); 
        res.render('aplicacion/listar/listarCategorias',{infoAdmin})
      }else{
      res.render('aplicacion/listar/listarCategorias',{infoAdmin})
      }
    };
    if(grado === 2){ 
      const infoDoc =JSON.parse(body);  
        if(infoDoc.yo){
        console.log('no tiene '); 
        const mensagem = infoDoc.yo;
        res.render('aplicacion/listar/listarCategorias',{mensagem})
      }else{
      res.render('aplicacion/listar/listarCategorias',{infoDoc})
      }
    };
    if(grado === 3){
      const infoPac =JSON.parse(body);
      console.log(infoPac)
      res.render('aplicacion/listar/listarCategorias',{infoPac,id})  
    }
 }); 
}); 

//adicionar-----------categorias-------------GET----------------------------------------->
router.get('/adicionarCat',async(req,res)=>{ 
  res.render('aplicacion/adicionar/adicionarCat')
});

//adicionar----------categorias--------------POST---------------------------------------->
router.post('/categoriasAdi',async(req,res)=>{
   const {nombreDep} = req.body;
   console.log(nombreDep);
   const auxi = req.session.passport; 
   const id = auxi.user;
   req.session.idUsuarios = id;
   const grad = await pool.query('select grado from usuarios where idUsuarios = ?',[id]);
   const aux = grad[0];
   const grado = aux.grado
   req.session.grado = grado;
  if(grado === 1){ 
    await axios({ 
      method: 'post',   
      url: 'http://localhost:4000/aplicacion/categoriasAdi/',
      data: {nombreDep}
  }).then((response,err,body)=>{
      req.flash('message', ' el departamento de  ' + nombreDep + ' fue agregado correctamente');
      res.redirect(301,'aplicacion/categorias');
  }).catch((e)=>{
     console.log(e);
  })
  }
}); 
 
//eliminar-----------categorias------------------------------------->
router.get('/eliminarCat/:idDep',async(req,res)=>{
  const {idDep} = req.params;
  const id = idDep;
  const grado = req.session.grado;
   request('http://localhost:4000/aplicacion/eliminarCat/'+id,(err,response,body)=>{
     if(err){
      console.log(err);
      res.redirect(301,'back');
     }else{
      req.flash('message', id + 'fue eliminado correctamente');
      res.redirect(301,'back');

     }
   });
});
 
/////////////////////////////////CATEGORIAS-----FIN////////////////////////////////////////////////////////




/////////////////////////////////SERVICIOS-----INICIO////////////////////////////////////////////////////////

//listar--------servicios--------------------------------------------------------->

router.get('/servicios',async(req,res)=>{
  const id = req.session.idUsuarios;
  console.log(id);
  request('http://localhost:4000/aplicacion/listarServ/'+id,(err,response,body)=>{
    if(err){
     console.log(err);
     res.redirect(301,'back');
    }else{
     req.flash('message', id + 'fue eliminado correctamente');
     res.redirect(301,'back');

    }
  });
});


//adicionar------servicios--------------------------------GET----------------------------->

router.get('/adicionarServ/:idDep',async(req,res)=>{ 
  const {idDep} = req.params;
  const id = idDep;
   res.render('aplicacion/adicionar/adicionarServ',{id})
}); 


//adicionar------servicios--------------------------------POST----------------------------->

router.post('/adicionarServ',async(req,res)=>{
  const { idDep,nombreServ,costo}=req.body;
   const nuevoInfo = { idDep,nombreServ,costo};
  await axios({ 
    method: 'post',   
    url: 'http://localhost:4000/aplicacion/adicionarServ/',
    data: nuevoInfo
}).then((response,err,body)=>{
    req.flash('message',nuevoInfo.nombreServ + ' fue adicionado correctamente');
    res.redirect(301,'back')
}).catch((e)=>{
   console.log(e);
   res.redirect(301,'back')
})
   
});


 

//eliminar-------servicios----------------------------------------------------------------->

router.get('/eliminarServ/:idServ',async(req,res)=>{
  const {idServ} = req.params;
  const id = idServ;
  const grado = req.session.grado;
   request('http://localhost:4000/aplicacion/eliminarServ/'+id,(err,response,body)=>{
     if(err){
      console.log(err);
      res.redirect(301,'back');
     }else{
      req.flash('message', id + 'fue eliminado correctamente');
      res.redirect(301,'back');

     }
   });
});


//editar-------------ruta-------------------------------------------------------------------->



/////////////////////////////////SERVICIOS-----FIN////////////////////////////////////////////////////////



/////////////////////////////////PERSONAL-----INICIO////////////////////////////////////////////////////////

//listar---------personal------------------------------------------------------------------->
router.get('/personal',async(req,res)=>{
  const auxi = req.session.passport; 
  const id = auxi.user;
  req.session.idUsuarios = id;
  const grad = await pool.query('select grado from usuarios where idUsuarios = ?',[id]);
  const aux = grad[0];
  const grado = aux.grado
  req.session.grado = grado;
  await request("http://localhost:4000/aplicacion/listarPersonal/"+id,(err,response,body)=>{  
    if(grado === 1){
      const infoAdmin =JSON.parse(body);
      console.log(infoAdmin)
      res.render('aplicacion/listar/listarPersonal',{infoAdmin})
    };
    if(grado === 2){
      const infoDoc =JSON.parse(body);
      console.log('doc')
      res.render('aplicacion/listar/listarPersonal',{infoDoc})
    };
    if(grado === 3){
     
    }

 }); 
});

/////////////////////////////////PERSONAL-----INICIO////////////////////////////////////////////////////////


/////////////////////////////////SOLICITUDES-----INICIO////////////////////////////////////////////////////////

//listar---------SOLICITUDES------------------------------------------------------------------->
router.get('/solicitudes',async(req,res)=>{
  const auxi = req.session.passport; 
  const id = auxi.user;
  req.session.idUsuarios = id;
  const todoUsDo = await pool.query('select * from usuarios where grado = 2');
  const todoUsPa = await pool.query('select * from usuarios where grado = 3');
  const grad = await pool.query('select grado from usuarios where idUsuarios = ?',[id]);
  const aux = grad[0];
  const grado = aux.grado 
  req.session.grado = grado;
  await request("http://localhost:4000/aplicacion/listarSolicitudes/"+id,(err,response,body)=>{  
    if(grado === 1){
      const infoAdmin =JSON.parse(body);
      console.log(infoAdmin)
      res.render('aplicacion/listar/listarSolicitudes',{infoAdmin,todoUsDo,todoUsPa})
    };
    if(grado === 2){
      const infoDoc = JSON.parse(body); 
      console.log(infoDoc)
      res.render('aplicacion/listar/listarSolicitudes',{infoDoc}) 
    };
    if(grado === 3){
      const infoPac = JSON.parse(body);
      if(infoPac.yo){
          const mensagem = 'no tiene agregado';
          res.render('aplicacion/listar/listarSolicitudes',{mensagem}) 
      }else{
        console.log(infoPac)
        res.render('aplicacion/listar/listarSolicitudes',{infoPac}) 
      }
     
    }   
 
 }); 
}); 

// ORDENAR----SOLICITUDES======----------------------------------------------------------------------->

//ordenar----por----------doctor---------------------------------------------------------------->
router.post('/solicitudes/ordenarPorPaciente', async(req,res)=>{
    const {idUsuarios} = req.body;
    const  infoAdmin = await pool.query('select * from solicitudes where idUsuario = ?',[idUsuarios]);
    res.render('aplicacion/listar/listarSolicitudes',{infoAdmin})
});

//adicionar-----solicitudes--------------------------------------------------------------------->
router.post('/solicitudes/adicionar', async(req,res)=>{
  const {fecha,idServ} = req.body;
  const idUsuarios = req.session.idUsuarios;
  console.log(idUsuarios)
  const novaInfo = { fecha, idServ, idUsuarios};
  await axios({ 
    method: 'post',   
    url: 'http://localhost:4000/aplicacion/solicitudes/adicionar',
    data: novaInfo
}).then((response,err,body)=>{
    req.flash('message',  ' fue solicitada  correctamente');
    res.redirect(301,'back')
}).catch((e)=>{
   console.log('carajo');  
   res.redirect(301,'back')  
})  
});

//adicionar------------solicitudes------------------------post----------------------------------->
router.post('/modificarSol', async (req,res)=>{
  const {idSol,idServ,idUsuario,grado,idServicio,fecha,estado,doctor} = req.body;
  const novaInfo = {idServ,idUsuario,grado,idServicio,fecha,estado,doctor} 
  await axios({ 
    method: 'post',   
    url: 'http://localhost:4000/aplicacion/adicionarServ/',
    data: novaInfo
}).then((response,err,body)=>{
    req.flash('message',nuevoInfo.nombreServ + ' fue adicionado correctamente');
    res.redirect(301,'back') 
}).catch((e)=>{
   console.log(e);
   res.redirect(301,'/aplicacion/solicitudes')
});
});
 
//eliminar---------SOLICITUDES------------------------------------------------------------------->
router.get('/eliminarSol/:idSol',async(req,res)=>{
  const {idSol} = req.params; 
  console.log(idSol)
  const id = idSol;
  const grado = req.session.grado;
   request('http://localhost:4000/aplicacion/eliminarSol/'+id,(err,response,body)=>{
     if(err){
      console.log(err);
      res.redirect(301,'back');
     }else{
      req.flash('message', id + 'fue eliminado correctamente');
      res.redirect(301,'back');

     }
   });
});
 
//confirmar------solicitudes-------------------get----------------->
router.get('/confirmarSol/:idSol', async(req,res)=>{
  const {idSol} = req.params;
  request('http://localhost:4000/aplicacion/confirmarSol/'+idSol,(err,response,body)=>{
    if(err){
     console.log(err);
     res.redirect(301,'aplicacion/solicitudes');
    }else{
     req.flash('message', id + 'fue eliminado correctamente');
     res.redirect(301,'aplicacion/solicitudes');

    }
  });
})

//editar----solicitudes------------------------get-------------------------------------------->
router.get('/editarSol/:idSol',async(req,res)=>{ 
     const{idSol}=req.params;
     request('http://localhost:4000/aplicacion/editarSol/'+idSol,(err,response,body)=>{
      if(err){
      console.log('tem erro fdm ');
       res.redirect(301,'back');
      }else{
       const info = JSON.parse(body);
       console.log(info)
       res.render('aplicacion/modificar/modificarSol',{info});
      }
    });
});
   /////////////////////////////////RESULTADOS-----INICIO////////////////////////////////////////////////////////

//listar---------RESULTADOS ------------------------------------------------------------------->
router.get('/resultados',async(req,res)=>{
  const auxi = req.session.passport; 
  const id = auxi.user;
  req.session.idUsuarios = id;
  const grad = await pool.query('select grado from usuarios where idUsuarios = ?',[id]);
  const aux = grad[0];
  const grado = aux.grado
  req.session.grado = grado;
  await request("http://localhost:4000/aplicacion/listarResultados/"+id,(err,response,body)=>{  
    if(grado === 1){
      const infoAdmin =JSON.parse(body);
      console.log(infoAdmin)
      res.render('aplicacion/listar/listarSolicitudes',{infoAdmin})
    };
    if(grado === 2){
      const infoDoc = JSON.parse(body);
      res.send(infoDoc);
    };
    if(grado === 3){ 
      const infoPac = JSON.parse(body);
      res.render('aplicacion/listar/listarResultados',{infoPac})
    }  
 
 }); 
  
  }); 
module.exports= router;  