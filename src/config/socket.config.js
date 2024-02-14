import { Server } from 'socket.io';
import ChatMessage from '../models/chat.models.js';
import productsModel from '../models/products.model.js';
import Carts from '../models/carts.models.js';

let io;
const chat_messages = []

export const initializeSocket = (server) => {
  io = new Server(server);

  io.on('connection', socket => {
    console.log('Conexión Exitosa Socket.io');


    const itemsPerPage = 10;
    socket.on('load', async ({ page }) => {
        try {
          const options = {
            limit: itemsPerPage,
            page,
            lean: true,
          };
    
          const products = await productsModel.paginate({}, options);
          const totalPages = Math.ceil(products.total / itemsPerPage);
    
          socket.emit('products', { products: products.docs, totalPages });
          console.log('Conexión Socket.io productos');
        } catch (error) {
          console.error('Error al obtener productos paginados:', error);
          socket.emit('error', { message: 'Error al obtener productos paginados' });
        }
      });
    
    
    socket.on('pageChanged', async newPage => {
        try {
            const options = {
                limit: itemsPerPage,
                page: newPage,
                lean: true
            };
    
            const products = await productsModel.paginate({}, options);
            io.emit('products', products);
        } catch (error) {
            console.error('Error al obtener productos paginados:', error);
        }
    });
    

    socket.on('carts', async () => {
        const carts = await Carts.find();
        socket.emit('carts', carts);
        console.log('Conexión Socket.io carts');
    });

    socket.on('message', data => {
        chat_messages.push(data)
        io.emit('messageLogs', chat_messages)
        console.log('Conexión Socket.io mensajes');
    });
    socket.on('message', async data => {
        const chatMessage = new ChatMessage(data);
        await chatMessage.save();        
        socket.broadcast.emit('newMessage', data);
        console.log('Conexión Socket.io nuevo mensaje');

    });

    socket.on('addToCart', async data => {
        if (data.product) {
            cart.push(data.product);
            io.emit('cartUpdated', cart);
        } else if (data.productId) {
            const product = await controller.getProductById(data.productId);
            if (!product.error) {
                cart.push(product);
                io.emit('cartUpdated', cart);
            }
        }
    });
    


    
    
}); 

}

export const getSocket = () => {
  if (!io) {
    throw new Error("Socket.io no se ha inicializado");
  }
  return io;
}