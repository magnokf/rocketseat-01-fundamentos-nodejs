export function extractQueryParams (query) {
	
	const queryParams = query.split('&')
	
	const queryObject = {}
	
	queryParams.forEach(param => {
		const [key, value] = param.split('=')
		queryObject[key] = value
	})
	
	return queryObject
}