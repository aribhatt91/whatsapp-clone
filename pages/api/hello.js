// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const {GraphQLServer} = require("graphql-yoga");

const typeDefs = `
  type Message {}
`

export default function handler(req, res) {
  res.status(200).json({ name: 'John Doe' })
}
