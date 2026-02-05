import { Request, Response } from 'express';
import User from '../schemas/User'; // ajusta la importación si tu modelo usa CommonJS

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default { getUsers };
