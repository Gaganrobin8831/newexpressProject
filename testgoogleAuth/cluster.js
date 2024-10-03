const cluster = require('node:cluster');
const express = require('express');
const numCPUs = require('node:os').availableParallelism();
const process = require('node:process');
const port = 8000
const app = express()
if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {

    app.get('/',(req,res)=>{
        return res.json({msg:`Worker ${process.pid} started`})
    })
  app.listen(port,()=>{
    console.log(`your port is run on port : ${port}`);
  })
//   console.log(`Worker ${process.pid} started`);
}