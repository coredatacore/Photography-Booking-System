import fs from 'fs';
import path from 'path';

const pages = [
  'Home', 'Portfolio', 'Packages', 'Contact', 'Booking', 'Login', 'Register'
];

const clientPages = [
  'Dashboard', 'Bookings', 'Payments', 'Profile'
];

const adminPages = [
  'Dashboard', 'Bookings', 'Clients', 'Packages', 'Payments', 'Reports', 'Settings'
];

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

ensureDir(path.join(process.cwd(), 'src/pages/client'));
ensureDir(path.join(process.cwd(), 'src/pages/admin'));

pages.forEach(p => {
  const content = `export const ${p} = () => {
  return <div className="p-8 text-light"><h1 className="text-3xl font-serif text-primary">${p}</h1></div>;
};`;
  fs.writeFileSync(path.join(process.cwd(), 'src/pages', `${p}.tsx`), content);
});

clientPages.forEach(p => {
  const content = `export const Client${p} = () => {
  return <div className="text-light"><h1 className="text-3xl font-serif text-primary mb-6">Client ${p}</h1></div>;
};`;
  fs.writeFileSync(path.join(process.cwd(), 'src/pages/client', `${p}.tsx`), content);
});

adminPages.forEach(p => {
  const content = `export const Admin${p} = () => {
  return <div className="text-light"><h1 className="text-3xl font-serif text-primary mb-6">Admin ${p}</h1></div>;
};`;
  fs.writeFileSync(path.join(process.cwd(), 'src/pages/admin', `${p}.tsx`), content);
});

console.log('Done creating placeholders.');