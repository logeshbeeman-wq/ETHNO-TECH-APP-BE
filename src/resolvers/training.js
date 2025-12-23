// src/resolvers/training.js
import CenterTraining from '../models/CenterTraining.js';
import BatchTraining from '../models/BatchTraining.js';
import { pool } from '../db.js';

export const trainingResolvers = {
    Query: {
        // Center Training Queries
        centerTrainings: async (_, __, { user }) => {
            if (!user) {
                throw new Error('Authentication required');
            }
            const centerTrainingModel = new CenterTraining(pool);
            return await centerTrainingModel.getAll();
        },

        centerTraining: async (_, { id }, { user }) => {
            if (!user) {
                throw new Error('Authentication required');
            }
            const centerTrainingModel = new CenterTraining(pool);
            return await centerTrainingModel.findById(id);
        },

        centerTrainingsByCenter: async (_, { center }, { user }) => {
            if (!user) {
                throw new Error('Authentication required');
            }
            const centerTrainingModel = new CenterTraining(pool);
            return await centerTrainingModel.findByCenter(center);
        },

        centerTrainingsByTechnology: async (_, { technology }, { user }) => {
            if (!user) {
                throw new Error('Authentication required');
            }
            const centerTrainingModel = new CenterTraining(pool);
            return await centerTrainingModel.findByTechnology(technology);
        },

        // Batch Training Queries
        batchTrainings: async (_, __, { user }) => {
            if (!user) {
                throw new Error('Authentication required');
            }
            const batchTrainingModel = new BatchTraining(pool);
            return await batchTrainingModel.getAll();
        },

        batchTraining: async (_, { id }, { user }) => {
            if (!user) {
                throw new Error('Authentication required');
            }
            const batchTrainingModel = new BatchTraining(pool);
            return await batchTrainingModel.findById(id);
        },

        batchTrainingsByBatch: async (_, { batch }, { user }) => {
            if (!user) {
                throw new Error('Authentication required');
            }
            const batchTrainingModel = new BatchTraining(pool);
            return await batchTrainingModel.findByBatch(batch);
        },

        batchTrainingsByDepartment: async (_, { department }, { user }) => {
            if (!user) {
                throw new Error('Authentication required');
            }
            const batchTrainingModel = new BatchTraining(pool);
            return await batchTrainingModel.findByDepartment(department);
        },

        batchTrainingsByTechnology: async (_, { technology }, { user }) => {
            if (!user) {
                throw new Error('Authentication required');
            }
            const batchTrainingModel = new BatchTraining(pool);
            return await batchTrainingModel.findByTechnology(technology);
        },
    },

    Mutation: {
        // Center Training Mutations
        createCenterTraining: async (_, { input }, { user }) => {
            if (!user) {
                throw new Error('Authentication required');
            }

            // Only admin and superadmin can create training records
            if (!['admin', 'superadmin'].includes(user.role)) {
                throw new Error('Insufficient permissions');
            }

            const centerTrainingModel = new CenterTraining(pool);
            return await centerTrainingModel.create(input);
        },

        updateCenterTraining: async (_, { input }, { user }) => {
            if (!user) {
                throw new Error('Authentication required');
            }

            // Only admin and superadmin can update training records
            if (!['admin', 'superadmin'].includes(user.role)) {
                throw new Error('Insufficient permissions');
            }

            const { id, ...fields } = input;
            const centerTrainingModel = new CenterTraining(pool);
            return await centerTrainingModel.update(id, fields);
        },

        deleteCenterTraining: async (_, { id }, { user }) => {
            if (!user) {
                throw new Error('Authentication required');
            }

            // Only admin and superadmin can delete training records
            if (!['admin', 'superadmin'].includes(user.role)) {
                throw new Error('Insufficient permissions');
            }

            const centerTrainingModel = new CenterTraining(pool);
            return await centerTrainingModel.delete(id);
        },

        // Batch Training Mutations
        createBatchTraining: async (_, { input }, { user }) => {
            if (!user) {
                throw new Error('Authentication required');
            }

            // Only admin and superadmin can create training records
            if (!['admin', 'superadmin'].includes(user.role)) {
                throw new Error('Insufficient permissions');
            }

            const batchTrainingModel = new BatchTraining(pool);
            return await batchTrainingModel.create(input);
        },

        updateBatchTraining: async (_, { input }, { user }) => {
            if (!user) {
                throw new Error('Authentication required');
            }

            // Only admin and superadmin can update training records
            if (!['admin', 'superadmin'].includes(user.role)) {
                throw new Error('Insufficient permissions');
            }

            const { id, ...fields } = input;
            const batchTrainingModel = new BatchTraining(pool);
            return await batchTrainingModel.update(id, fields);
        },

        deleteBatchTraining: async (_, { id }, { user }) => {
            if (!user) {
                throw new Error('Authentication required');
            }

            // Only admin and superadmin can delete training records
            if (!['admin', 'superadmin'].includes(user.role)) {
                throw new Error('Insufficient permissions');
            }

            const batchTrainingModel = new BatchTraining(pool);
            return await batchTrainingModel.delete(id);
        },
    },
};
