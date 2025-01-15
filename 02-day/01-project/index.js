"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
const db_manager_1 = require("./db_manager");
const db = new db_manager_1.JSONDbManager();
const handleRequestBody = (request) => {
    return new Promise((resolve, reject) => {
        let body = '';
        request.on('data', (chunk) => (body += chunk));
        request.on('end', () => resolve(body));
        request.on('error', (err) => reject(err));
    });
};
const sendResponse = (response, statusCode, data) => {
    response.writeHead(statusCode, { 'Content-Type': 'application/json' });
    response.end(typeof data === 'string' ? data : JSON.stringify(data));
};
const server = http.createServer((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const page = db.getPage((_a = request.url) !== null && _a !== void 0 ? _a : "/");
    if (!page) {
        return sendResponse(response, 404, { error: 'Not found' });
    }
    if (request.method === 'GET') {
        return sendResponse(response, 200, page.data);
    }
    else if (request.method === 'POST') {
        try {
            const body = yield handleRequestBody(request);
            const pageObject = JSON.parse(body);
            pageObject.id = page.index + 1;
            page.index++;
            page.data.push(pageObject);
            db.save();
            return sendResponse(response, 200, { message: 'Success', added: pageObject });
        }
        catch (err) {
            console.error(err);
            return sendResponse(response, 400, { error: 'Invalid JSON' });
        }
    }
    else if (request.method === 'PUT') {
        try {
            const body = yield handleRequestBody(request);
            const updatedData = JSON.parse(body);
            const itemIndex = page.data.findIndex(item => item.id === updatedData.id);
            if (itemIndex === -1) {
                return sendResponse(response, 404, { error: 'Item not found' });
            }
            page.data[itemIndex] = Object.assign(Object.assign({}, page.data[itemIndex]), updatedData);
            db.save();
            return sendResponse(response, 200, { message: 'Item updated', updated: page.data[itemIndex] });
        }
        catch (err) {
            console.error(err);
            return sendResponse(response, 400, { error: 'Invalid JSON' });
        }
    }
    else if (request.method === 'DELETE') {
        try {
            const body = yield handleRequestBody(request);
            const { id } = JSON.parse(body);
            const itemIndex = page.data.findIndex(item => item.id === id);
            if (itemIndex === -1) {
                return sendResponse(response, 404, { error: 'Item not found' });
            }
            const deletedItem = page.data.splice(itemIndex, 1);
            db.save();
            return sendResponse(response, 200, { message: 'Item deleted', deleted: deletedItem });
        }
        catch (err) {
            console.error(err);
            return sendResponse(response, 400, { error: 'Invalid JSON' });
        }
    }
}));
server.listen(3000, () => console.log('Server is running on port 3000'));
