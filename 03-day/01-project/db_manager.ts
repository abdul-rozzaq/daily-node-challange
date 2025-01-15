import * as fs from 'fs';

interface Page {
    path: string;
    data: any[];
    index: number;
}

class JSONDbManager {
    private data: Page[] = [];
    private readonly fileName: string = './db.json';

    constructor() {
        this.load();
    }

    private load(): Page[] {
        try {
            const fileContent = fs.readFileSync(this.fileName, 'utf-8');
            this.data = JSON.parse(fileContent);
        } catch (error) {
            console.error('Error loading file:', error);
            this.data = [];
        }
        return this.data;
    }

    public save(): boolean {
        try {
            fs.writeFileSync(this.fileName, JSON.stringify(this.data, null, 4));
            return true;
        } catch (error) {
            console.error('Error saving file:', error);
            return false;
        }
    }

    public getPage(url: string): Page | undefined {
        return this.data.find(e => e.path === url);
    }

    private generateId(): number {
        return this.data.reduce((maxId, page) => Math.max(maxId, page.index), 0) + 1;
    }
}


export { JSONDbManager, Page };

