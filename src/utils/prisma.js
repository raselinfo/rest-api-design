const {PrismaClient}=require("@prisma/client")

const prisma = new PrismaClient({
    errorFormat: "minimal",
})

module.exports = prisma