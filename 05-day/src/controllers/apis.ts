import { Router } from "express";

import { addObject, deleteObject, getObject, getPage, updateObject } from "../services/apis.service.ts";


const router = Router();


router.get("/:name", getPage)
router.get("/:name/:id", getObject)
router.post("/:name", addObject)
router.put("/:name/:id", updateObject)
router.delete("/:name/:id", deleteObject)

export default router;

