import * as http from 'http';
import { JSONDbManager, Page } from './db_manager';

const db: JSONDbManager = new JSONDbManager();

const handleRequestBody = (request: http.IncomingMessage): Promise<string> => {
    return new Promise((resolve, reject) => {
        let body = '';
        request.on('data', (chunk) => (body += chunk));
        request.on('end', () => resolve(body));
        request.on('error', (err) => reject(err));
    });
};

const sendResponse = (response: http.ServerResponse, statusCode: number, data: object | string) => {
    response.writeHead(statusCode, { 'Content-Type': 'application/json' });
    response.end(typeof data === 'string' ? data : JSON.stringify(data));
};

const server = http.createServer(async (request, response) => {

    const page: Page | undefined = db.getPage(request.url ?? "/");

    if (!page) {
        return sendResponse(response, 404, { error: 'Not found' });
    }

    if (request.method === 'GET') {
        return sendResponse(response, 200, page.data);

    } else if (request.method === 'POST') {
        try {
            const body = await handleRequestBody(request);
            const pageObject = JSON.parse(body);
            pageObject.id = page.index + 1;

            page.index++;
            page.data.push(pageObject);

            db.save();

            return sendResponse(response, 200, { message: 'Success', added: pageObject });
        } catch (err) {
            console.error(err);
            return sendResponse(response, 400, { error: 'Invalid JSON' });
        }
    } else if (request.method === 'PUT') {
        try {
            const body = await handleRequestBody(request);
            const updatedData = JSON.parse(body);
            const itemIndex = page.data.findIndex(item => item.id === updatedData.id);

            if (itemIndex === -1) {
                return sendResponse(response, 404, { error: 'Item not found' });
            }

            page.data[itemIndex] = { ...page.data[itemIndex], ...updatedData };
            db.save();

            return sendResponse(response, 200, { message: 'Item updated', updated: page.data[itemIndex] });
        } catch (err) {
            console.error(err);
            return sendResponse(response, 400, { error: 'Invalid JSON' });
        }
    } else if (request.method === 'DELETE') {
        try {
            const body = await handleRequestBody(request);
            const { id } = JSON.parse(body);
            const itemIndex = page.data.findIndex(item => item.id === id);

            if (itemIndex === -1) {
                return sendResponse(response, 404, { error: 'Item not found' });
            }

            const deletedItem = page.data.splice(itemIndex, 1);
            db.save();

            return sendResponse(response, 200, { message: 'Item deleted', deleted: deletedItem });
        } catch (err) {
            console.error(err);
            return sendResponse(response, 400, { error: 'Invalid JSON' });
        }
    }
});

server.listen(3000, () => console.log('Server is running on port 3000'));
