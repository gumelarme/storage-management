import axios from 'axios'
import {baseUrl} from '@/components/services/common';
export default class Auth {

	static async login(username, password){
		const url = `${baseUrl}/login`;
		// console.log("Logging in", url);
		return await axios.post(url, {username, password})
			.then(result => result);
	}
}
