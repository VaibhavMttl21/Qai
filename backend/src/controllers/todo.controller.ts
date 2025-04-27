
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

export const AddTodo = async (req: AuthRequest, res: Response) => {
    try {
        // Check if user is authenticated
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { description } = req.body;
        
        if (!description) {
            return res.status(400).json({ message: 'Description is required' });
        }
        
    
        const todo = await prisma.todo.create({
            data: {
                description,
                userId: req.user.id,
            }
        });
    
        res.status(201).json(todo);
    } catch (error) {
        console.error('Error creating todo:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

    export const completedTodo = async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const { completed } = req.body;
            const todo = await prisma.todo.update({
                where: {
                    id: id,
                },
                data: {
                    completed: completed,
                },
            })
            res.status(200).json(todo);
        }catch (error) {
            console.error('Error fetching todos:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }


    export const GetTodos = async (req: AuthRequest, res: Response) => {
        try {
            const todos = await prisma.todo.findMany({
                where: {
                    userId: req.user?.id || '',
                },
            });
    
            res.status(200).json(todos);
        } catch (error) {
            console.error('Error fetching todos:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    export const Deletetodo = async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
    
            const todo = await prisma.todo.delete({
                where: {
                    id: id,
                },
            });
    
            res.status(200).json(todo);
        } catch (error) {
            console.error('Error deleting todo:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }