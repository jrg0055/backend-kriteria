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
            return res.status(401).json({ success: false, message: "Usuario o contraseña incorrectos" });
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return res.status(401).json({ success: false, message: "Usuario o contraseña incorrectos" });
        }

        return res.json({
            success: true,
            user: {
                id: user._id,
                name: (user as any).name,
                email: user.email,
                role: (user as any).role
            }
        });

    } catch (error) {
        console.error("Error en login:", error);
        return res.status(500).json({
            success: false,
            message: "Error interno del servidor"
        });
    }
});


router.post("/register", async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Todos los campos (nombre, email, password) son obligatorios"
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "El correo electrónico ya está registrado"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: 'basic',
            createdAt: new Date()
        });

        await newUser.save();

        const userObj = newUser.toObject();

        return res.status(201).json({
            success: true,
            message: "Usuario registrado con éxito",
            user: {
                id: userObj._id,
                name: userObj.name,
                email: userObj.email,
                role: userObj.role,
                createdAt: userObj.createdAt
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


