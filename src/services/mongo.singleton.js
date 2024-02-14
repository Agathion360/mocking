import mongoose from 'mongoose';
import config from '../config.js';

export default class MongoSingleton {
  static #instance;

  constructor() {
    mongoose.connect(config.mongooseConnect);
  }

  static getInstance() {
    if (!this.#instance) {
      this.#instance = new MongoSingleton();
      console.log('MongoDB conectado');
    }else{
        console.log('conesion de mongo recuperada');
    }

    return this.#instance;
  }
}