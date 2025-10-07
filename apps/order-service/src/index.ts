import Fastify from "fastify";

const fastify = Fastify()



fastify.get("/health",(request , reply)=>{
    return reply.status(200).send({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now()
  })
})



const start = async () => {
    try {
        await fastify.listen({ port: 8001 })
        console.log("Order-Service is runing on http://localhost:8001")

    } catch (error) {
        console.log("Error in Starting Order-Service", error);

        fastify.log.error(error);
        process.exit(1)
    }
}

start()