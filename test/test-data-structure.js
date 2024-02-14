import mocha from "mocha";
import {assert} from 'chai'
import Hierarchy from "../server-lib/hierarchy.mjs";


let testData = 
{"_id":"65ca65f32cd571ccc7b9c7a2","hierarchyFields":"[{\"id\":1,\"label\":\"root\"},{\"id\":7,\"parentId\":1,\"label\":\"A new node6\",\"name\":\"\"},{\"id\":2,\"parentId\":7,\"label\":\"second node\",\"name\":\"node2d-dslfk3241234124l112341234\"},{\"id\":3,\"parentId\":1,\"label\":\"A new node5\",\"name\":\"\"},{\"id\":6,\"parentId\":1,\"label\":\"A new node4\",\"name\":\"\"},{\"id\":5,\"parentId\":1,\"label\":\"A new node3\",\"name\":\"\"},{\"id\":4,\"parentId\":1,\"label\":\"A new node2\",\"name\":\"\"}]","name":"asdfaf","groups":[],"id":"JSyjH2uDcEGOEYLJv9wXgmIiWcTDzlahk1lWiA86REc"}


describe("a basic test which shows tests are working", function() {
	
	it("make tree", function() {

		let hi = new Hierarchy(testData)
		
		let roots = hi.toRootNodes()
		
		assert.equal(roots.length, 1)
		let root = roots[0]
		assert.equal(root.children.length, 5)
		assert.equal(root.children[0].children.length, 1)
	})

})