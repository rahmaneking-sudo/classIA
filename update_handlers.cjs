const fs = require('fs');

let content = fs.readFileSync('src/components/ExpressBuilder/ThemeRenderer.jsx', 'utf8');

// 1. Replace the old handleOrder implementation
const oldHandler = `  const handleOrder = (itemName) => {
    setModalItemName(itemName || 'Demande Générale');
    setIsModalOpen(true);
  };`;

const newHandlers = `  const handleOrder = (itemName) => {
    if (!whatsapp) return;
    const rawNumber = whatsapp.replace(/[^0-9]/g, '');
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
        window.open(\`https://wa.me/\${rawNumber}?text=\${message}\`, '_blank');
      } else if (result.isDenied) {
        window.location.href = \`tel:+\${rawNumber}\`;
      }
    });
  };

  const handleReservation = (itemName) => {
    setModalItemName(itemName || 'Demande de Réservation');
    setIsModalOpen(true);
  };`;

content = content.replace(oldHandler, newHandlers);

// 2. Change specific uses of handleOrder to handleReservation
// We want to keep handleOrder for:
// - themeId === 'restaurant' (menu items) -> "Commander"
// - themeId === 'shop' (produits) -> "Acheter"
// But change to handleReservation for:
// - themeId === 'salon' -> "Réserver"
// - themeId === 'car' -> "Réserver sur WhatsApp" -> "Réserver"
// - themeId === 'realestate' -> "Être recontacté"
// - themeId === 'dentist' -> "Prendre RDV via WhatsApp" -> "Prendre Rendez-vous"
// - themeId === 'hotel' -> "Réserver"
// - themeId === 'carpentry' -> "Demander un devis"

content = content.replace(/<button onClick=\{\(\) => handleOrder\(item.title\)\} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold uppercase text-sm py-4 rounded-lg flex items-center justify-center transition-colors shadow-md">\s*<MessageCircle className="w-5 h-5 mr-2" \/> Réserver sur WhatsApp\s*<\/button>/g, 
`<button onClick={() => handleReservation(item.title)} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold uppercase text-sm py-4 rounded-lg flex items-center justify-center transition-colors shadow-md">\n                      <MessageCircle className="w-5 h-5 mr-2" /> Réserver le véhicule\n                    </button>`);

content = content.replace(/<button onClick=\{\(\) => handleOrder\(service\.title\)\} className="w-full bg-green-50 text-green-700 hover:bg-green-100 py-3 rounded-xl font-bold flex justify-center items-center transition-colors">\s*<MessageCircle className="w-5 h-5 mr-2" \/> Prendre RDV via WhatsApp\s*<\/button>/g,
`<button onClick={() => handleReservation(service.title)} className="w-full bg-green-50 text-green-700 hover:bg-green-100 py-3 rounded-xl font-bold flex justify-center items-center transition-colors">\n                    <MessageCircle className="w-5 h-5 mr-2" /> Prendre Rendez-vous\n                  </button>`);

// salon
content = content.replace(/<button onClick=\{\(\) => handleOrder\(item.title\)\} className="bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700 transition-colors flex items-center text-sm font-bold shadow-md">\s*<MessageCircle className="w-4 h-4 mr-2" \/> Réserver\s*<\/button>/g,
`<button onClick={() => handleReservation(item.title)} className="bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700 transition-colors flex items-center text-sm font-bold shadow-md">\n                      <MessageCircle className="w-4 h-4 mr-2" /> Réserver\n                    </button>`);

// hotel
content = content.replace(/<button onClick=\{\(\) => handleOrder\(room.title\)\} className="flex items-center justify-center w-full bg-green-700 text-white py-4 font-bold tracking-widest uppercase hover:bg-green-800 transition-colors mt-auto shadow-md">\s*<MessageCircle className="w-5 h-5 mr-2" \/> Réserver\s*<\/button>/g,
`<button onClick={() => handleReservation(room.title)} className="flex items-center justify-center w-full bg-green-700 text-white py-4 font-bold tracking-widest uppercase hover:bg-green-800 transition-colors mt-auto shadow-md">\n                      <MessageCircle className="w-5 h-5 mr-2" /> Réserver\n                    </button>`);

// realestate
content = content.replace(/<button onClick=\{\(\) => handleOrder\(item.title\)\} className="text-sm font-bold text-white bg-green-600 px-6 py-3 rounded flex items-center justify-center hover:bg-green-700 w-full mt-auto transition-colors shadow-md">\s*<MessageCircle className="w-5 h-5 mr-2" \/> Être recontacté pour ce bien\s*<\/button>/g,
`<button onClick={() => handleReservation(item.title)} className="text-sm font-bold text-white bg-green-600 px-6 py-3 rounded flex items-center justify-center hover:bg-green-700 w-full mt-auto transition-colors shadow-md">\n                      <MessageCircle className="w-5 h-5 mr-2" /> Être recontacté pour ce bien\n                    </button>`);

// carpentry
content = content.replace(/<button onClick=\{\(\) => handleOrder\(proj.title\)\} className="w-full bg-green-700 hover:bg-green-600 text-white py-3 font-bold flex items-center justify-center transition-colors shadow-md">\s*<MessageCircle className="w-5 h-5 mr-2" \/> Demander un devis\s*<\/button>/g,
`<button onClick={() => handleReservation(proj.title)} className="w-full bg-green-700 hover:bg-green-600 text-white py-3 font-bold flex items-center justify-center transition-colors shadow-md">\n                       <MessageCircle className="w-5 h-5 mr-2" /> Demander un devis\n                    </button>`);

fs.writeFileSync('src/components/ExpressBuilder/ThemeRenderer.jsx', content);
console.log("Updated ThemeRenderer with mixed handlers.");
