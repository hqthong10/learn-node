import { Task } from '../models/task.model.js';

export const root = {
    hello: () => 'Hello GraphQL!',

    tasks: async () => {
        return Task.find().sort({ createdAt: -1 });
    },

    task: async ({ id }) => {
        return Task.findById(id);
    },

    createTask: async ({ title, description }) => {
        return Task.create({
            title,
            description
        });
    },

    updateTask: async ({ id, ...updates }) => {
        return Task.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true
        });
    },

    deleteTask: async ({ id }) => {
        const deletedTask = await Task.findByIdAndDelete(id);

        return deletedTask !== null;
    }
};
