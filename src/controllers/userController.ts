import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../schemas/User';

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_para_kriteria';

// REGISTRO
export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email ya en uso" });

        // Hashing compatible con Edge Workers
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: 'basic'
        });

        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ token, user: { name, email, role: 'basic' } });
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor al registrar" });
    }
};

// LOGIN
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !user.password) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Credenciales inválidas" });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            user: { name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor al loguear" });
    }
};