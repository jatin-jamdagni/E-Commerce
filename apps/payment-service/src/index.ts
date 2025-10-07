import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

app.get('/health', (c) => {
  return c.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now()
  })
})


const start  = async()=>{
  try{

serve({
  fetch: app.fetch,
  port: 8002
}, (info) => {
    console.log("Payment-Service is runing on http://localhost:8002")
})

  }catch(error){
    console.log("Error in Starting Payment-Service",error);
    process.exit(1);
  }
}
start()