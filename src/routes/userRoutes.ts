import { Router } from "express";
import { getUsers, login, register } from "../controllers/userController";

const router = Router();

// Como se monta en /auth en index.ts, estas rutas serán /auth/register, etc.
router.post('/register', register);
router.post('/login', login);
router.get("/", getUsers);

export default router;