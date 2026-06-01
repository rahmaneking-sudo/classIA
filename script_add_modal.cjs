const fs = require('fs');
let content = fs.readFileSync('src/components/ExpressBuilder/ThemeRenderer.jsx', 'utf8');

// The pattern looks like:
// {renderFooter('...', '...')}
// </div>
// );

content = content.replace(/(\{renderFooter\([^)]*\)\})\s*<\/div>\s*\);\s*\}/g, (match, p1) => {
  return `${p1}\n        {renderReservationModal()}\n      </div>\n    );\n  }`;
});

// Also replace cases where renderFooter is called without arguments, e.g. {renderFooter()}
content = content.replace(/(\{renderFooter\(\)\})\s*<\/div>\s*\);\s*\}/g, (match, p1) => {
  return `${p1}\n        {renderReservationModal()}\n      </div>\n    );\n  }`;
});

fs.writeFileSync('src/components/ExpressBuilder/ThemeRenderer.jsx', content);
console.log("Updated themes with Modal.");
