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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONDbManager = void 0;
const fs = __importStar(require("fs"));
class JSONDbManager {
    constructor() {
        this.data = [];
        this.fileName = './db.json';
        this.load();
    }
    load() {
        try {
            const fileContent = fs.readFileSync(this.fileName, 'utf-8');
            this.data = JSON.parse(fileContent);
        }
        catch (error) {
            console.error('Error loading file:', error);
            this.data = [];
        }
        return this.data;
    }
    save() {
        try {
            fs.writeFileSync(this.fileName, JSON.stringify(this.data, null, 4));
            return true;
        }
        catch (error) {
            console.error('Error saving file:', error);
            return false;
        }
    }
    getPage(url) {
        return this.data.find(e => e.path === url);
    }
    generateId() {
        return this.data.reduce((maxId, page) => Math.max(maxId, page.index), 0) + 1;
    }
}
exports.JSONDbManager = JSONDbManager;
