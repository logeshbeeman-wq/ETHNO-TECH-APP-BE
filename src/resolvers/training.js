// src/resolvers/training.js
import CenterTraining from '../models/CenterTraining.js';
import { pool } from '../db.js';

export const trainingResolvers = {
    Query: {
        // Center Training Queries
        centerTrainings: async (_, __, { user, models }) => {
            if (!user) {
                throw new Error('Authentication required');
            }
            const centerTrainingModel = models?.CenterTraining || new CenterTraining(pool);
            return await centerTrainingModel.getAll();
        },

        centerTraining: async (_, { id }, { user, models }) => {
            if (!user) {
                throw new Error('Authentication required');
            }
            const centerTrainingModel = models?.CenterTraining || new CenterTraining(pool);
            return await centerTrainingModel.findById(id);
        },

        centerTrainingsByCenter: async (_, { center }, { user, models }) => {
            if (!user) {
                throw new Error('Authentication required');
            }
            const centerTrainingModel = models?.CenterTraining || new CenterTraining(pool);
            return await centerTrainingModel.findByCenter(center);
        },

        centerTrainingsByTechnology: async (_, { technology }, { user, models }) => {
            if (!user) {
                throw new Error('Authentication required');
            }
            const centerTrainingModel = models?.CenterTraining || new CenterTraining(pool);
            return await centerTrainingModel.findByTechnology(technology);
        },

        centerTrainingsByFilter: async (_, { filter }, { user, models }) => {
            if (!user) {
                throw new Error('Authentication required');
            }
            const centerTrainingModel = models?.CenterTraining || new CenterTraining(pool);
            return await centerTrainingModel.findFiltered(filter);
        },
    },

    Mutation: {
        // Center Training Mutations
        createCenterTraining: async (_, { input }, { user, models }) => {
            if (!user) {
                throw new Error('Authentication required');
            }

            // Only admin and superadmin can create training records
            if (!['admin', 'superadmin'].includes(user.role)) {
                throw new Error('Insufficient permissions');
            }

            const centerTrainingModel = models?.CenterTraining || new CenterTraining(pool);
            return await centerTrainingModel.create(input);
        },

        updateCenterTraining: async (_, { input }, { user, models }) => {
            if (!user) {
                throw new Error('Authentication required');
            }

            // Only admin and superadmin can update training records
            if (!['admin', 'superadmin'].includes(user.role)) {
                throw new Error('Insufficient permissions');
            }

            const { id, ...fields } = input;
            const centerTrainingModel = models?.CenterTraining || new CenterTraining(pool);
            return await centerTrainingModel.update(id, fields);
        },

        deleteCenterTraining: async (_, { id }, { user, models }) => {
            if (!user) {
                throw new Error('Authentication required');
            }

            // Only admin and superadmin can delete training records
            if (!['admin', 'superadmin'].includes(user.role)) {
                throw new Error('Insufficient permissions');
            }

            const centerTrainingModel = models?.CenterTraining || new CenterTraining(pool);
            return await centerTrainingModel.delete(id);
        },
    },
};
