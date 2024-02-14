let initialized = false
import hierarchiesIntegrator from '../../server-lib/hierarchies-integrator.mjs'
import kalpaTreeOnPage from 'kalpa-tree-on-page'
import webhandle from 'webhandle'
export default function enableHierarchies(dbName, options) {
	if (!initialized) {
		initialized = true
		kalpaTreeOnPage(webhandle)
		hierarchiesIntegrator(dbName, options)
	}
}

