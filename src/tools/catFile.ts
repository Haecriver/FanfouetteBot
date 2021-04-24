
import fs from 'fs';
import path from 'path';

const catFile = (fileName: string) => {
    return fileName ? fs.readFileSync(path.resolve(fileName), 'utf8').trim() : null;
}

export { catFile };

