const fs = require('fs');

let content = fs.readFileSync('src/components/ExpressBuilder/ThemeRenderer.jsx', 'utf8');

// 1. Revert handleOrder to just go to WhatsApp directly
const oldHandleOrder = `  const handleOrder = (itemName) => {
    if (!whatsapp) return;
    const rawNumber = String(whatsapp).replace(/[^0-9]/g, '');
    Swal.fire({
      title: 'Commander',
      text: \`Que souhaitez-vous faire pour : \${itemName} ?\`,
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: '📱 WhatsApp',
      confirmButtonColor: '#25D366',
      denyButtonText: '📞 Appeler',
      denyButtonColor: '#3B82F6',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        const message = encodeURIComponent(\`Bonjour, je souhaite commander : \${itemName}\`);
        window.location.href = \`https://wa.me/\${rawNumber}?text=\${message}\`;
      } else if (result.isDenied) {
        window.location.href = \`tel:+\${rawNumber}\`;
      }
    });
  };`;

const newHandleOrder = `  const handleOrder = (itemName) => {
    if (whatsapp) {
      const message = encodeURIComponent(\`Bonjour, je souhaite commander : \${itemName}\`);
      window.open(\`https://wa.me/\${String(whatsapp).replace(/[^0-9]/g, '')}?text=\${message}\`, '_blank');
    }
  };`;

content = content.replace(oldHandleOrder, newHandleOrder);

// 2. Change the contact phone rendering to be clickable (a href="tel:...")
const oldContactPhone = `                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-3 opacity-80" />
                  <p>{whatsapp || '+221 77 000 00 00'}</p>
                </div>`;

const newContactPhone = `                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-3 opacity-80" />
                  <a href={whatsapp ? \`tel:+\${String(whatsapp).replace(/[^0-9]/g, '')}\` : 'tel:+221770000000'} className="hover:underline">
                    {whatsapp || '+221 77 000 00 00'}
                  </a>
                </div>`;

content = content.replace(oldContactPhone, newContactPhone);

// 3. Make sure handleContact is exactly as it was, window.open
const handleContactOld = `  const handleContact = () => {
    if (whatsapp) {
      window.location.href = \`https://wa.me/\${String(whatsapp).replace(/[^0-9]/g, '')}\`;
    }
  };`;
const handleContactNew = `  const handleContact = () => {
    if (whatsapp) {
      window.open(\`https://wa.me/\${String(whatsapp).replace(/[^0-9]/g, '')}\`, '_blank');
    }
  };`;

content = content.replace(handleContactOld, handleContactNew);

fs.writeFileSync('src/components/ExpressBuilder/ThemeRenderer.jsx', content);
console.log('Update complete');
