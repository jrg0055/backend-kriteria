// typescript
import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../schemas/User";

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || !user.password) {
            return res.json({ success: false });
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return res.json({ success: false });
        }

        return res.json({ success: true });

    } catch (error) {
        console.error("Error en login:", error);
        return res.status(500).json({
            success: false,
            message: "No funciona"
        });
    }
});


router.post("/register", async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        // 1. Validar campos obligatorios
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Todos los campos (nombre, email, password) son obligatorios"
            });
        }

        // 2. Comprobar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "El correo electrónico ya está registrado"
            });
        }

        // 3. Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Crear el nuevo usuario (rol y fecha por defecto manejados por el esquema o manualmente)
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: 'basic',
            createdAt: new Date()
        });

        await newUser.save();

        return res.status(201).json({
            success: true,
            message: "Usuario registrado con éxito",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                createdAt: newUser.createdAt
            }
        });

    } catch (error) {
        console.error("Error en registro:", error);
        return res.status(500).json({
            success: false,
            message: "Error al registrar el usuario"
        });
    }
});


export default router;


