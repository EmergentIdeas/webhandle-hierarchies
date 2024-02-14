import Hierarchy from "../hierarchy.mjs"

/**
 * 
 * @param {object} data 
 * @param {Hierarchy} data.hierarchy The hierarchy to render
 * @param {string} data.name The name of the input field
 * @param {boolean} [data.leafNodesOnly] False by default, but if true it will render input controls only next to the leaves of the tree
 * @param {string} [data.indentationString] How the check boxes will be indented
 * @returns A string which is the box of check boxes for selecting the place in the hierarchy
 */
export default function groupCheckBox(data) {
	if (!data || typeof data !== 'object' || !data.hierarchy || data.hierarchy instanceof Hierarchy == false) {
		return ''
	}
	let d = Object.assign({
		name: data.hierarchy.name
		, leafNodesOnly: false
		, indentationString: '&nbsp;&nbsp;&nbsp;'
	}, data)

	let trees = data.hierarchy.toRootNodes()

	let result = `<div class="group-checks">`
	for(let node of trees) {
		if(!node.children) {
			continue
		}
		for(let child of node.children) {
			result += makeCheckboxes(child, d.name, d.indentationString, 0, d.leafNodesOnly)
		}
	}

	result + `</div>`
	return result
}

function indent(indentationString, level) {
	let result = ''
	while(level > 0) {
		level--
		result += indentationString
	}
	return result
}

function makeCheckboxes(node, name, indentationString, level, leafNodesOnly) {
	let result = '\n<br>'
	let hasChildren = node.children && node.children.length > 0

	result += `<label class="hierarchy-option" data-level="${level}">`
	result += indent(indentationString, level)

	if (!hasChildren || !leafNodesOnly) {
		result += `<input type="checkbox" name="${name}" value="${node.name}" /> `
	}

	result +=
	`
	${node.label}
	</label>
	`
	
	if(hasChildren) {
		let newLevel = level + 1
		for(let child of node.children) {
			result += makeCheckboxes(child, name, indentationString, newLevel, leafNodesOnly)
		}
	}

	return result
}