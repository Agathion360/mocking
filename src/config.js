import * as url from 'url';
import dotenv from "dotenv"
import { Command } from "commander"

const cliOptions = new Command()
cliOptions
    .option('--port <port>')
    .option('--mode <mode>')
cliOptions.parse(process.argv)

const mode = cliOptions.opts().mode




switch (mode) {
    case 'prod':
        dotenv.config({path: './.env.production'})
        break;
    
    case 'dev':
        dotenv.config({path: './.env.development'})
        break;
    
    default:
        dotenv.config({path: './.env.development'})
}

const config = {
    PORT : cliOptions.opts().port,
    MODE : cliOptions.opts().mode,
    mongooseConnect : process.env.MONGOOSE_REMOTE,
    CLIENT_ID : process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    CALLBACK_URL : process.env.CALLBACK_URL,
}
    
export default config