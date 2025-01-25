import { Request, Response } from "express";
import { JSONDbManager, Page } from "./db.service.ts";


const db = new JSONDbManager();


export function getAllPages(request: Request, response: Response) {
    let pages = db.data;

    return response.render("index", { pages });
}


export function addNewPage(request: Request, response: Response) {
    let pages = db.data;

    console.log(request.body);

    const { name } = request.body;

    const index = pages.findIndex(item => item.name == name)

    if (index == -1 && name != '') {
        const page = { name: name, index: 0, data: [] }

        db.data.push(page);
        db.save()

        return response.status(201).json({ message: "Added", page: page });
    } else {
        return response.status(400).json({ message: `Page ${name} already exists` });
    }
}






export function getPage(request: Request, response: Response) {
    const { name } = request.params;

    const page = db.getPage(name);

    return response.json(page);
}


export function getObject(request: Request, response: Response) {
    const { name, id } = request.params;

    const page: Page | undefined = db.getPage(name);

    const itemIndex: number = page.data.findIndex(item => item.id == id);

    if (itemIndex != -1) {
        return response.status(200).send(page.data[itemIndex])
    }

    return response.status(404).send({ "message": "Object not found" });

}


export function addObject(request: Request, response: Response) {
    const { name } = request.params;

    const page = db.getPage(name);
    const pageObject = { id: db.generateId(), ...request.body };

    page.index++;

    page.data.push(pageObject);
    db.save()

    return response.status(201).send({
        "message": "Added",
        "data": pageObject,
    })
}


export function updateObject(request: Request, response: Response) {
    const { name, id } = request.params;

    const page = db.getPage(name);
    const itemIndex = page.data.findIndex(item => item.id == id);

    if (itemIndex === -1) return response.status(404).send({ "message": "Object not found" });

    page.data[itemIndex] = { ...page.data[itemIndex], ...request.body };

    db.save();

    return response.status(201).send({
        "message": "Updated",
        "data": page.data[itemIndex],
    })
}


export function deleteObject(request: Request, response: Response) {
    const { name, id } = request.params;

    const page = db.getPage(name);
    const itemIndex = page.data.findIndex(item => item.id == id);

    if (itemIndex === -1) return response.status(404).send({ "message": "Object not found" });

    page.data.splice(itemIndex, 1);

    db.save();

    return response.status(201).send({
        "message": "Updated",
        "data": page.data[itemIndex],
    })
}