
import MongoDataService from '@dankolz/mongodb-data-service'
import Hierarchy from './hierarchy.mjs'

export default class HierarchiesDataService extends MongoDataService {

	/**
	 * Transforms the results of fetches. This is sometimes done when the object from the database should be augmented
	 * with additional information or should be converted into an object with a specific class. Override this function
	 * at need. By default it does essentially nothing.
	 * @param {object[]} result An array of objects from the database
	 * @param {string} collectionName The name of the collection these objects came from. If this class only queries a single
	 * collection, this parameter won't be of much use. If it queries multiple collection, this will help inform the method
	 * what to do with the object.
	 * @returns A promise which results in an array of objects.
	 */
	async postFetchesProcessor(result, collectionName) {
		return new Promise((resolve, reject) => {
			result = result.map(item => new Hierarchy(item))
			resolve(result)
		})
	}

}

