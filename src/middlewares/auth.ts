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

export default router;
