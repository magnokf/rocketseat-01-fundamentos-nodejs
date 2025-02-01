import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'
import * as sea from 'node:sea'

const database = new Database()

export const routes = [
	
	// all tasks
	{
		method: 'GET',
		path: buildRoutePath('/tasks'),
		handler: async (req, res) => {
			const { search } = req.query
			const tasks = database.select('tasks',
				search ? {
					title: search,
					description: search,
					complete_at: search
				} : null)
			return res.end(JSON.stringify(tasks))
		}
	},
	// create task
	{
		method: 'POST',
		path: buildRoutePath('/tasks'),
		handler: async (req, res) => {
			const { title, description } = req.body
			
			const task = database.insert('tasks', {
				id: randomUUID(),
				title,
				description,
				completed_at: null,
				created_at: new Date(),
				updated_at: new Date()
			})
			
			return res
				.writeHead(201)
				.end(JSON.stringify(task))
		}
	},
	// get task by id
	{
		method: 'GET',
		path: buildRoutePath('/tasks/:id'),
		handler: async (req, res) => {
			const { id } = req.params
			const task = database.select('tasks').find(task => task.id === id)
			
			if (!task) {
				return res
					.writeHead(404)
					.end(JSON.stringify({ error: 'Task not found' }))
			}
			
			return res.end(JSON.stringify(task))
		}
	},
	// update task by id
	{
		method: 'PUT',
		path: buildRoutePath('/tasks/:id'),
		handler: async (req, res) => {
			const { id } = req.params
			const { title, description, is_completed, created_at} = req.body
			
			let updated_at = new Date()
			let completed_at = null
			
			if (is_completed) {
				completed_at = new Date()
				updated_at = new Date()
			}
			
			database.update('tasks', id, {
				title,
				description,
				completed_at,
				created_at,
				updated_at
				
			})
			
			return res.writeHead(204).end()
		}
	},
	// delete task by id
	{
		method: 'DELETE',
		path: buildRoutePath('/tasks/:id'),
		handler: async (req, res) => {
			const { id } = req.params
			
			const tasks = database.select('tasks')
			const userIndex = tasks.findIndex(user => user.id === id)
			
			if (userIndex === -1) {
				return res
					.writeHead(404)
					.end(JSON.stringify({ error: 'User not found' }))
			}
			
			tasks.splice(userIndex, 1)
			
			database.delete('tasks', id)
			
			return res.writeHead(204).end()
			
		}
	}
]