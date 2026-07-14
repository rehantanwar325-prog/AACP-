const fs = require('fs');
console.log(JSON.stringify(JSON.parse(fs.readFileSync('node_modules/wrangler/config-schema.json')).properties.assets, null, 2));
