//import { application } from './app';

import { performance } from 'perf_hooks'
import Knex from 'knex';

var connected = false;

async function ensureConnetion(){
  if (connected) return;
  var startTime = performance.now();
  var client = Knex({
    client: 'pg',
    jsonbSupport: true,
    connection: {
      user: process.env.DB_CONNECTION_USER,
      password: process.env.DB_CONNECTION_PASSWORD,
      database: process.env.DB_CONNECTION_DATABASE,
      host: process.env.DB_CONNECTION_HOST,
      port: parseInt(process.env.DB_CONNECTION_PORT!)
    }
  });
  while (!connected){
    try{
      await client.transaction(async trx => {
        trx.raw("SELECT 1;").then(_ => {connected = true})
      })
    }
    catch(e){
      if (performance.now() - startTime > 120000) throw new Error("Unable to connect to database after 120s")
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function handler(context: any, event: any) {
  await ensureConnetion()
  console.log("Connected")
}