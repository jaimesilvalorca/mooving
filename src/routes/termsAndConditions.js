import { Router } from "express";
import { renderTerms } from "../controller/termsController.js";

const router = Router();

router.get('/',renderTerms)


export default router

