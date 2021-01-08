import axios from 'axios'

export default class Operation {
	static async getOperatedGoodsByWorkerId(id, active) {
		let url = `http://localhost:3000/operation/reader/${id}`;//reader还没改，考虑怎么改
		if (active) {
            url += `?active=${active}`;
            //添加一个货物数量变化
		}
		return await axios.get(url).then(data => data);
	}

	static async StoreGoods(id) {
		let url = "http://localhost:3000/operation/store/";//改了存取货物。用了store
        return await axios.put(url, {id}).then(data => data);
        //添加一个货物数量变化
	}

	static async withdraw(workersId, goodsId) {//形参改了，函数名改了
		let url = "http://localhost:3000/operation";//url changed
		return await axios.post(url, { workersId, goodsId}).then(data => data);
	}
}
