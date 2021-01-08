import axios from 'axios'
import { baseUrl }from './common'

export default class BaseServices{
    constructor(singular, plural){
        this.singular= singular;
        this.plural= plural ? plural : `${singular}s`;
        this.url = `${baseUrl}/${this.plural}`
    }

    _u(id){
        return `${this.url}/${id}`;
    }

	async getAll(filter) {
        if(filter){
           filter = filter + 1; 
        }
		return await axios.get(this.url).then(resp => resp.data[this.plural].data);
	}

	async getOne(id) {
		return await axios.get(this._u(id)).then(resp => resp.data[this.singular]);
	}

	async add(data) {
        console.log("Adding data", this, data);
		return await axios.post(this.url, data).then(data => data);
	}

	async update(data) {
		return await axios.put(this._u(data.id), data).then(data => data);
	}

	async remove(id) {
        console.log(this);
		return await axios.delete(this._u(id)).then(data => data);
	}

}
