
import fs from 'fs';
import path from 'path';

const logosDir = path.join(process.cwd(), 'public/logos');
const dataFile = path.join(process.cwd(), 'src/data/companies.ts');

const files = fs.readdirSync(logosDir);
const companies = [];

files.forEach(file => {
    if (file === '.DS_Store') return;

    const ext = path.extname(file);
    const name = path.basename(file, ext).trim();

    // Create safe filename
    const safeName = name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-\u0600-\u06FF]/g, '') // Keep Arabic chars and alphanumeric
        .replace(/-+/g, '-');

    const newFilename = `${safeName}${ext}`;

    // Rename file
    fs.renameSync(path.join(logosDir, file), path.join(logosDir, newFilename));

    companies.push({
        id: safeName,
        name: name, // Use original name as display name
        logo: `/logos/${newFilename}`,
        description: "Subsidiary of Mplan Group",
        url: "#"
    });
});

const content = `export interface Company {
  id: string;
  name: string;
  logo: string;
  description: string;
  url: string;
}

export const companies: Company[] = ${JSON.stringify(companies, null, 2)};
`;

fs.writeFileSync(dataFile, content);
console.log(`Processed ${companies.length} logos.`);
