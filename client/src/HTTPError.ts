export default class HTTPError extends Error {
	constructor(public status: number | string, message: string) {
		super(message);
		this.name = status.toString();
	}
}
