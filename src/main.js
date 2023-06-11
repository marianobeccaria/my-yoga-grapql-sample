import { createYoga } from 'graphql-yoga'
import { createServer } from 'http'
import { PrismaClient } from '@prisma/client'
import { execute, parse } from 'graphql'
import { hello_schema } from './schemas/hello.js'
import { user_schema } from './schemas/users.js'

console.log('\n*** Runing main.js Yoga Server ***\n')

const prisma = new PrismaClient()

const yoga = createYoga({
  schema: user_schema,
  context: {db: prisma}
})

async function main() {
  const server = createServer(yoga)
  server.listen(4000, () => {
    console.info('Server is running on http://localhost:4000/graphql')
  })
}

main()