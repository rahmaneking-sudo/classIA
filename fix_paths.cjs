const fs = require('fs');
const glob = require('glob');
const path = require('path');

const files = glob.sync('api/**/*.js');
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  let newContent = content;
  
  const depth = file.split('/').length - 1; // e.g., api/auth/login.js -> depth 2
  
  // Calculate path to api/
  const toApi = '../'.repeat(depth - 1) || './';
  // Calculate path to root/
  const toRoot = '../'.repeat(depth);
  
  newContent = newContent.replace(/import connectDB from '.*?_lib\/db\.js';/g, `import connectDB from '${toApi}_lib/db.js';`);
  newContent = newContent.replace(/import \{ protectStudent \} from '.*?_lib\/protect\.js';/g, `import { protectStudent } from '${toApi}_lib/protect.js';`);
  newContent = newContent.replace(/import \{ protectAdmin \} from '.*?_lib\/protect\.js';/g, `import { protectAdmin } from '${toApi}_lib/protect.js';`);
  
  newContent = newContent.replace(/import Lead from '.*?backend\/models\/Lead\.js';/g, `import Lead from '${toRoot}backend/models/Lead.js';`);
  newContent = newContent.replace(/import Admin from '.*?backend\/models\/Admin\.js';/g, `import Admin from '${toRoot}backend/models/Admin.js';`);
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Fixed', file);
  }
}
