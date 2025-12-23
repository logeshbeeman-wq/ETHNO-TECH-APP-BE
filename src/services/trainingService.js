// src/services/trainingService.js
import CenterTraining from '../models/CenterTraining.js';
import BatchTraining from '../models/BatchTraining.js';

/**
 * Service layer for training-related business logic
 * This layer sits between resolvers and models to handle complex operations
 */
class TrainingService {
    constructor(connection) {
        this.centerTrainingModel = new CenterTraining(connection);
        this.batchTrainingModel = new BatchTraining(connection);
    }

    // Center Training Services
    async getAllCenterTrainings() {
        return await this.centerTrainingModel.getAll();
    }

    async getCenterTrainingById(id) {
        const training = await this.centerTrainingModel.findById(id);
        if (!training) {
            throw new Error(`Center training with ID ${id} not found`);
        }
        return training;
    }

    async createCenterTraining(data) {
        // Add business logic validation here if needed
        this.validateTrainingDates(data.startTrainingDate, data.endTrainingDate);
        return await this.centerTrainingModel.create(data);
    }

    async updateCenterTraining(id, data) {
        // Verify the record exists
        await this.getCenterTrainingById(id);

        // Validate dates if they're being updated
        if (data.startTrainingDate || data.endTrainingDate) {
            const existing = await this.centerTrainingModel.findById(id);
            const startDate = data.startTrainingDate || existing.startTrainingDate;
            const endDate = data.endTrainingDate || existing.endTrainingDate;
            this.validateTrainingDates(startDate, endDate);
        }

        return await this.centerTrainingModel.update(id, data);
    }

    async deleteCenterTraining(id) {
        // Verify the record exists before deleting
        await this.getCenterTrainingById(id);
        return await this.centerTrainingModel.delete(id);
    }

    async getCenterTrainingsByCenter(center) {
        return await this.centerTrainingModel.findByCenter(center);
    }

    async getCenterTrainingsByTechnology(technology) {
        return await this.centerTrainingModel.findByTechnology(technology);
    }

    // Batch Training Services
    async getAllBatchTrainings() {
        return await this.batchTrainingModel.getAll();
    }

    async getBatchTrainingById(id) {
        const training = await this.batchTrainingModel.findById(id);
        if (!training) {
            throw new Error(`Batch training with ID ${id} not found`);
        }
        return training;
    }

    async createBatchTraining(data) {
        // Add business logic validation here if needed
        this.validateTrainingDates(data.startTrainingDate, data.endTrainingDate);
        return await this.batchTrainingModel.create(data);
    }

    async updateBatchTraining(id, data) {
        // Verify the record exists
        await this.getBatchTrainingById(id);

        // Validate dates if they're being updated
        if (data.startTrainingDate || data.endTrainingDate) {
            const existing = await this.batchTrainingModel.findById(id);
            const startDate = data.startTrainingDate || existing.startTrainingDate;
            const endDate = data.endTrainingDate || existing.endTrainingDate;
            this.validateTrainingDates(startDate, endDate);
        }

        return await this.batchTrainingModel.update(id, data);
    }

    async deleteBatchTraining(id) {
        // Verify the record exists before deleting
        await this.getBatchTrainingById(id);
        return await this.batchTrainingModel.delete(id);
    }

    async getBatchTrainingsByBatch(batch) {
        return await this.batchTrainingModel.findByBatch(batch);
    }

    async getBatchTrainingsByDepartment(department) {
        return await this.batchTrainingModel.findByDepartment(department);
    }

    async getBatchTrainingsByTechnology(technology) {
        return await this.batchTrainingModel.findByTechnology(technology);
    }

    // Shared utility methods
    validateTrainingDates(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start >= end) {
            throw new Error('End training date must be after start training date');
        }

        // Optional: Add more validation rules
        // e.g., training duration limits, future date checks, etc.
    }

    // Analytics and reporting methods
    async getTrainingStatistics() {
        const centerTrainings = await this.centerTrainingModel.getAll();
        const batchTrainings = await this.batchTrainingModel.getAll();

        return {
            totalCenterTrainings: centerTrainings.length,
            totalBatchTrainings: batchTrainings.length,
            totalTrainings: centerTrainings.length + batchTrainings.length,
            centerTrainingsCompleted: centerTrainings.filter(t => t.examinationStatus === 'Completed').length,
            batchTrainingsCompleted: batchTrainings.filter(t => t.examinationStatus === 'Completed').length,
        };
    }

    async getUpcomingTrainings() {
        const today = new Date().toISOString().split('T')[0];
        const allCenterTrainings = await this.centerTrainingModel.getAll();
        const allBatchTrainings = await this.batchTrainingModel.getAll();

        const upcomingCenter = allCenterTrainings.filter(
            t => t.startTrainingDate >= today
        );
        const upcomingBatch = allBatchTrainings.filter(
            t => t.startTrainingDate >= today
        );

        return {
            centerTrainings: upcomingCenter,
            batchTrainings: upcomingBatch,
            total: upcomingCenter.length + upcomingBatch.length
        };
    }
}

export default TrainingService;
