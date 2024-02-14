export default class Hierarchy {
	constructor(obj) {
		Object.assign(this, obj)
	}
	
	toRootNodes() {
		let roots = []
		let keyedNodes = {}
		let nodes = JSON.parse(this.hierarchyFields)
		
		// key the nodes
		for(let node of nodes) {
			keyedNodes[node.id] = node
		}
		
		// make some nodes children of others
		for(let node of nodes) {
			if(node.parentId) {
				let parent = keyedNodes[node.parentId]
				if(!parent) {
					roots.push(node)
				}
				else {
					if(!parent.children) {
						parent.children = []
					}
					parent.children.push(node)
				}
			}
			else {
				roots.push(node)
			}
		}

		return roots
	}
}