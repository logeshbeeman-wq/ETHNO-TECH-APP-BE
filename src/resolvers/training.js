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

            // Map/Sanitize input
            const sanitizedInput = {
                ...input,
                strength: parseInt(input.strength || 0, 10), // Ensure int
                fdpReceived: input.fdpReceived || input.fdp || 'NA',
                fdpTaken: input.fdpTaken || 'NA',
                center: input.center || `Center-${input.centerId || 'Unknown'}`, // Default if missing
                // Clean up extra fields if necessary, though model only picks what it needs usually? 
                // Model Create takes destructured props, so extra props in sanitizedInput might be ignored or cause issue if destructuring is strict?
                // Model destructures: const { centerId ... } = data. So extra fields are fine.
            };

            return await centerTrainingModel.create(sanitizedInput);
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

            // Sanitize Update Fields
            const sanitizedFields = { ...fields };
            if (fields.strength) sanitizedFields.strength = parseInt(fields.strength, 10);

            const centerTrainingModel = models?.CenterTraining || new CenterTraining(pool);
            return await centerTrainingModel.update(id, sanitizedFields);
        },

        async deleteCenterTraining(_, { id }, { user, models }) {
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

        async bulkUploadCenterTrainings(_, { input }, { user, models }) {
            if (!user) {
                throw new Error('Authentication required');
            }

            // Only admin and superadmin can create training records
            if (!['admin', 'superadmin'].includes(user.role)) {
                throw new Error('Insufficient permissions');
            }

            const centerTrainingModel = models?.CenterTraining || new CenterTraining(pool);
            let successCount = 0;
            const errors = [];

            for (const trainingData of input) {
                try {
                    const sanitizedInput = {
                        ...trainingData,
                        strength: parseInt(trainingData.strength || 0, 10),
                        fdpReceived: trainingData.fdpReceived || trainingData.fdp || 'NA',
                        fdpTaken: trainingData.fdpTaken || 'NA',
                        center: trainingData.center || `Center-${trainingData.centerId || 'Unknown'}`,
                    };
                    await centerTrainingModel.create(sanitizedInput);
                    successCount++;
                } catch (error) {
                    errors.push(`Error creating training record for center ${trainingData.center || 'unknown'}: ${error.message}`);
                }
            }

            return {
                success: successCount > 0,
                message: `Successfully uploaded ${successCount} training records.`,
                count: successCount,
                errors: errors
            };
        }
    },
};
