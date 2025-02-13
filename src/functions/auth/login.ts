import { sendResponseBody } from "../../util/response";
import { getDBInstance } from "../../db/db"

export const handle = async (event: any, _context: any) => {
	// await getDBInstance(true) // Pass True here to initialize DB always
	try {
		let res: any = {}
		let resMessage = 'Successfully logged in'
		const body = JSON.parse(event.body)
		res = body

		return sendResponseBody({
			origin: event.headers.origin,
			resCode: 200,
			success: res,
			message: resMessage,
		});
	} catch (error: any) {
		console.log(error)
		return sendResponseBody({
			resCode: 400,
			success: {
				name: error.code,
				message: error.message
			},
			message: '',
		})
	}
}

export const handler = async (event: any, context: any) => {
	return await handle(event, context)
}