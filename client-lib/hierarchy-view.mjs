import { View } from '@webhandle/backbone-view'
import { treeFrame, treeNodeForm } from '../views/load-browser-views.mjs'
import makeTree from 'kalpa-tree-on-page'
import formValueInjector from "form-value-injector"

let websafeChars = 'abcdefghijklmnopqrstuvwxyz_1234567890'.split('')

let rootNode = {
	"id": 1, // must have a unique numeric id
	"label": "root", // should have a label
	"name": "root"
}

export default class HierarchyView extends View {

	/**
	 * Construct a new file browser
	 * @param {object} options 
	 * @param {array} options.nodes An array of data nodes representing the hierarchy
	 */
	constructor(options) {
		super(options)
		this.detailsSelector = '.item-details'
		this._rootNodeMessage = '<p>Add nodes to the tree on the left. For each node, set its attributes.</p>'
	}
	preinitialize() {
		this.className = 'hierarchies-view'
		if(!this.nodes) {
			this.nodes = [rootNode]
		}
		else if(typeof this.nodes === 'string') {
			this.nodes = JSON.parse(this.nodes)
		}

		this.events = {
			'click .create-node': 'createNode'
			, 'click .remove-node': 'removeNode'
			, 'change input,select,textarea': 'updateNode'
			, 'keyup input,select,textarea': 'updateNode'
		}
	}

	_createBlankNode(parent) {
		return {
			id: this._getNextNewId(),
			parentId: parent.id,
			label: 'A new node'
		}
	}
	
	_getNextNewId() {
		let top = 2
		Object.keys(this.tree.nodes).forEach(key => {
			key = parseInt(key)
			if(key >= top) {
				top = key + 1
			}
		})
		return top
	}
	
	_isRootNode(node) {
		if(!node) {
			return false
		}
		return this.tree.root.id == node.id
	}
	
	_sanitizeFormData() {
		let dialogBody = this.el.querySelector(this.detailsSelector)
		let controls = dialogBody.querySelectorAll('input, textarea, select')
		for (let control of controls) {
			try {
				let pattern = control.getAttribute('pattern')
				if(!pattern) {
					continue
				}
				let reg = new RegExp(pattern)
				let result = reg.exec(control.value)
				if(!result) {
					control.value = ''
					continue
				}
				if(result[0] != control.value) {
					control.value = result[0]
				}
			}
			catch(e) {}
		}

	}

	_gatherFormData(result = {}) {
		let dialogBody = this.el.querySelector(this.detailsSelector)
		let controls = dialogBody.querySelectorAll('input, textarea, select')
		for (let control of controls) {
			result[control.getAttribute('name')] = control.value
		}
		return result
	}
	
	_makeWebSafe(value) {
		value = value.toLowerCase()
		let result = ''
		for(let c of value) {
			if(websafeChars.includes(c)) {
				result += c
			}
			else {
				result += '-'
			}
		}
		result = result.replace(/--+/g, '-')
		
		return result
	}

	updateNode(evt, selected) {
		setTimeout(() => {
			this._sanitizeFormData()
			this._gatherFormData(this.node)
			
			if(!this.node.name) {
				this.node.name = this._makeWebSafe(this.node.label) || this._createDefaultName()
			}
			this.tree.edit(this.node)
		})
	}
	
	_createDefaultName() {
		return new Date().getTime() + ''
	}

	createNode(evt, selected) {
		let node = this._createBlankNode(this.node)
		this.tree.add(node)
		this.tree.select(node.id)
		this.node.name = this._createDefaultName() 
		this.tree.edit(this.node)
	}

	removeNode(evt, selected) {
		let node = this.tree.selected()
		if(!node) {
			return
		}
		if(this._isRootNode(node)) {
			return
		}

		let parentId = node.parentId
		this.tree.removeNode(node.id)
		this.tree.select(parentId)
	}

	setCurrentNode(node) {
		this.node = node
		if(this._isRootNode(node)) {
			this.renderRootNode(node)
		}
		else {
			this.renderNodeForm(node)
		}
	}

	renderRootNode(node) {
		let detailsPanel = this.el.querySelector(this.detailsSelector)
		detailsPanel.innerHTML = this._rootNodeMessage
	}
	renderNodeForm(node) {
		let detailsPanel = this.el.querySelector(this.detailsSelector)
		let content = treeNodeForm(node)
		content = formValueInjector(content, node)
		detailsPanel.innerHTML = content
	}
	
	serializeTree() {
		return this.tree.serializeTree()
	}
	serialize() {
		return this.tree.serialize()
	}

	async render() {
		this.el.innerHTML = treeFrame()
		if(!this.nodes) {
			this.nodes = [rootNode]
		}
		else if(typeof this.nodes === 'string') {
			this.nodes = JSON.parse(this.nodes)
		}

		makeTree({
			data: this.nodes
		}).then(tree => {
			this.tree = tree
			tree.editable()
			tree.on('select', (node) => {
				this.setCurrentNode(node)
			})
			let rootId = this.tree.root.id
			tree.select(rootId)
		})
	}
}

