import express from 'express';
import mongoose from 'mongoose';
import handlebars from 'express-handlebars';
import session from 'express-session'
import FileStore from 'session-file-store'
import MongoStore from 'connect-mongo'
import passport from 'passport'

import { __dirname } from './utils.js';
import productRouter from './routes/products.routes.js';
import path from 'path';
import { initializeSocket } from './config/socket.config.js';
import viewRouter from './routes/views.routes.js';
import cartsRouter from './routes/carts.routes.js';
import chatRouter from './routes/chat.routes.js';
import productsModel from './models/products.model.js';

import ProfileController from './controllers/profile.controller.js';
import registerRoutes from './routes/register.routes.js';
import registerViews from './routes/register.views.routes.js';
import sessionRoutes from './routes/sessions.routes.js';
import config from './config.js';






const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));
const fileStorage = FileStore(session)
const profileController = new ProfileController();


app.use(session({
   
    store: MongoStore.create({ mongoUrl: config.mongooseConnect, mongoOptions: {}, ttl: 60, clearInterval: 5000 }), // MONGODB
    secret: 'secretKeyAbc123',
    resave: false,
    saveUninitialized: false
}))





app.use(passport.initialize())
app.use(passport.session())



app.use((req, res, next) => {
    res.locals.showNavbar = true; 
    next();
  });
  
  const auth = (req, res, next) => {
    try {
      if (req.session.user) {
        next();
      } else {
        res.status(401).send({ status: 'ERR', data: 'Usuario no autenticado' });
      }
    } catch (err) {
      res.status(500).send({ status: 'ERR', data: err.message });
    }
  };
  



app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')


app.use('/', viewRouter)
app.use('/', chatRouter)


app.use('/api/carts', cartsRouter)
app.use('/api/products', productRouter)
app.use('/api/sessions', sessionRoutes);
app.use('/api/register', registerRoutes); 
app.get('/profile', auth, profileController.showProfile);

  

try{
    await mongoose.connect(config.mongooseConnect)
    
    const server = app.listen(config.PORT, () => {
        console.log(`Server running on port ${config.PORT}`);
        console.log(`http://localhost:${config.PORT}`);
    });
 
    initializeSocket(server);


 }catch(error){
     console.error("Error al conectar a la base de datos:", error.message)
}




app.get('*', (req, res) => {
    res.status(400).send(`<h1 style="color:red">Pagina no encontrada</h1>`)
});




