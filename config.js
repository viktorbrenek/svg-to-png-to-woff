import fs from 'fs';
const paths = JSON.parse(fs.readFileSync(new URL('./paths.json', import.meta.url)));
export { paths };
