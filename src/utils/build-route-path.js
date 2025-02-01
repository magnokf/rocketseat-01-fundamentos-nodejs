export function buildRoutePath (path) {
	
	const routeParametersRegex = /:([a-zA-Z]+)/g
	const pathWithParameters = path.replace(routeParametersRegex, '(?<$1>[a-zA-Z0-9-]+)')

	return new RegExp(`^${pathWithParameters}(?<query>\\?(.*))?$`)
	
}