import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
	
	// all users
	{
		method: 'GET',
		path: buildRoutePath('/users'),
		handler: async (req, res) => {
			const users = database.select('users')
			return res.end(JSON.stringify(users))
		}
	},
	// create user
	{
		method: 'POST',
		path: buildRoutePath('/users'),
		handler: async (req, res) => {
			const { name, email } = req.body
			
			const user = database.insert('users', {
				id: randomUUID(),
				name,
				email
			})
			
			return res
				.writeHead(201)
				.end(JSON.stringify(user))
		}
	},
	// get user by id
	{
		method: 'GET',
		path: buildRoutePath('/users/:id'),
		handler: async (req, res) => {
			const { id } = req.params
			const user = database.select('users').find(user => user.id === id)
			
			if (!user) {
				return res
					.writeHead(404)
					.end(JSON.stringify({ error: 'User not found' }))
			}
			
			return res.end(JSON.stringify(user))
		}
	},
	// update user by id
	{
		method: 'PUT',
		path: buildRoutePath('/users/:id'),
		handler: async (req, res) => {
			const { id } = req.params
			const { name, email } = req.body
			
			database.update('users', id, { name, email })
			
			return res.writeHead(204).end()
		}
	},
	// delete user by id
	{
		method: 'DELETE',
		path: buildRoutePath('/users/:id'),
		handler: async (req, res) => {
			const { id } = req.params
			
			const users = database.select('users')
			const userIndex = users.findIndex(user => user.id === id)

			if (userIndex === -1) {
				return res
					.writeHead(404)
					.end(JSON.stringify({ error: 'User not found' }))
			}

			users.splice(userIndex, 1)

			database.delete('users', id)
			
			return res.writeHead(204).end()
			
		}
	},
]