# Add hierarchies to a webhandle environment

## Install

```
npm install @webhandle/hierarchies
```

Add to less: 
```
@import "../node_modules/@webhandle/hierarchies/less/components";
```

Add to client js:

```
let hierarchies = require('@webhandle/hierarchies').default
hierarchies()
```

Add to server js:
```
const hierarchiesIntegrator = (await import('@webhandle/hierarchies')).default
hierarchiesIntegrator (dbName)
```

By default, the urls are:

/admin/hierarchies

Services are:
- hierarchies
