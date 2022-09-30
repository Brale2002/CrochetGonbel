const express = require('express')
const app = express()
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./db/crochetgonbel.db');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));
const port = 3005
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const sessions = require('express-session');
const url = require('url');
const querystring = require('querystring');

const timeEXp = 1000 * 60 * 60 * 24;

app.use(sessions({
  secret: "rndnsdgnednfeubawejbsjvbsdjfbsdjhvjzedakalicamillesdjhdsfhjstjdeqwewq",
  saveUninitialized: true,
  cookie: {
    maxAge: timeEXp
  },
  resave: false
}));

conectado = false;

app.get('/', (req, res) => {
  session = req.session;
  if (session.userid) {
    conectado = true
    if (conectado == true) {
      return res.render('index', {
        nombre: session.usernom
      })
    }

  }
  res.render('index');


});

app.get('/logout', (req, res) => {
  session = req.session;
  if (session.userid) {
    req.session.destroy();
    conectado = false
    return res.redirect('/');
  }
  return res.redirect('/login')

})

app.get('/consulta', (req, res) => {
   session = req.session;
   email=req.session.userid;
  db.get("SELECT email,name,telefono FROM usuario WHERE email=$email", {
    $email: email
  }, (error, row) => {
    
    cone=false;
   
    if (session.userid) {
      cone = true
      if (cone == true) {
        return res.render('consulta',{
          email:row.email,
          name:row.name,
          telefono:row.telefono


        })
      }
  
    }
  
  })
})

app.get("/carrito", (req, res) => {
  res.render("carritoCompra");
});

app.get("/cambiar", (req, res) => {
  res.render("verificar");
});

app.get("/admin", (req, res) => {
  res.render("admin");
});

app.get("/insertar", (req, res) => {
  res.render("insertar");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/confifactura", (req, res) => {
  res.render("confifactura");
});

app.get("/contraerror", (req, res) => {
  res.render("errorcontra");
});

app.get("/registro", (req, res) => {
  res.render("registrar");
});

app.get("/productos", (req, res) => {
  res.render("productos");
});

app.get("/porfavor", (req, res) => {
  res.render("porfavor");
});

app.get("/coleccion", (req, res) => {
  res.render("coleccion");
});

app.get("/usuario", (req, res) => {
  res.render("usuario");
});


app.post('/registrar',(req,res) =>{
  let email=req.body.email;
  let name=req.body.name;
  let number=req.body.number;
  let password=req.body.password;
  const saltRounds =10;
  const salt= bcrypt.genSaltSync(saltRounds);
  const hash= bcrypt.hashSync(password, salt);

  db.run(`INSERT INTO usuario(email, name, telefono, password) VALUES (?,?,?,?)`,
  [email,name,number,hash],
  function (error) {
    if (!error) {
      return res.redirect("/login");
    } else {
      console.log("Insert error", error.code);
      if (error.code == "SQLITE_CONSTRAINT") {
        return res.render('usuario')
      }
      return res.send('error')
    }

  });

})



app.post('/login', (req, res) => {

  let email = req.body.email;
  let password = req.body.password;
  db.get("SELECT name,password FROM usuario WHERE email=$email", {
    $email: email
  }, (error, row) => {
    if (error) {
      return res.send("Ha ocurrido un error desconocido");
    }
    console.log(row);
    if (row) {
      console.log(row.password);
      if (bcrypt.compareSync(password, row.password)) {
        session = req.session;

        session.userid = email;
        session.usernom = row.name;
        return res.redirect('/');

      }
      return res.send('incorrecto');
    }
    return res.send('existe');
  });
})

let cone=false;

app.get('/productos1', (req, res) => {
  let tt;
  db.all("SELECT id_producto,nombre_producto,precio,imagen FROM productos", {

  }, (error, row) => {
    tt=row;
    cone=false;
    session = req.session;
    email=req.session.userid;
    if (session.userid) {
      cone = true
      if (cone == true) {
        return res.render('productos',{
          nombre: session.usernom,tt

        })
      }
  
    }

    if (!error) {

     
      res.render('productos', {
        tt
      }
     
      
      );
    
    }
  
  })
})

app.post('/veri', (req, res) => {
  session = req.session;
  email = req.session.userid;
  let password = req.body.password;
  db.get("SELECT password FROM usuario WHERE $email=email", {
    $email: email
  }, (error, row) => {
    if (error) {
      return res.send("Ha ocurrido un error desconocido");
    }
    console.log(row);
    if (row) {
      console.log(row.password);
      if (bcrypt.compareSync(password, row.password)) {

        return res.render('cambiocontra');

      }
      return res.redirect('/contraerror');
    }
  });
})

app.post('/cambio', (req, res) => {
  session = req.session;
  email = req.session.userid;
  let password = req.body.password;
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  db.run(`UPDATE usuario SET password=? WHERE email=?`,
    [hash, email],
    (error, row) => {

      if (!error) {
        req.session.destroy();
        conectado = false;
        return res.redirect('/');
      }
      if (error) {
        console.log(error);
        res.send("no se pudo cargar");
      }
    }

  )
});

app.get('/comprar/:idarticulo', (req, res) => {
  session = req.session;

  if (session.userid) {
    let id = req.params.idarticulo;

    let validatorId = parseInt(id)
    if (isNaN(validatorId)) {
      return res.render('ingreseid');
    }

    db.get("SELECT id_producto,nombre_producto,precio,imagen FROM productos WHERE $id_producto=id_producto  ", {
      $id_producto: id
    }, (error, row) => {
data=row;
if (!error) {
  res.render('factura',{
    data: [{

      nombre: row.nombre_producto,
      precio:row.precio,
      id_producto:row.id_producto,
      imagen: row.imagen
  
    }]
  });
}
if (error) {
  return console.log(error);
}

    })


  }
else {
    res.redirect('/porfavor');
  };

})

app.post('/realizarcompra/:idarticulo', (req, res) => {

  session = req.session;

  if (session.userid) {
  
    let id = req.params.idarticulo;
    email = session.userid;
    
    let validatorId = parseInt(id)
    if (isNaN(validatorId)) {
      return res.render('ingreseid');
    }
    
    let fecha = new Date();
    arreglo = [, fecha.getDate(), fecha.getMonth() + 1, fecha.getFullYear(), ]
    listo = arreglo.join(" ");
    db.run(`INSERT INTO compras(id_compra,fecha,emailUsuario,id_produ) VALUES(?,?,?,?)`,
      [, listo, email, id],

      function (error) {
        if (!error) {
         
          return res.redirect("/confifactura");
             
        }
        if (error) {
          return console.log("error");
        }


      }


    )

  } else {
    res.render('porfaini')
  };
})

 app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})













