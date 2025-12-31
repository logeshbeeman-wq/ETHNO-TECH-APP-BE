// src/services/trainingService.js
import CenterTraining from '../models/CenterTraining.js';

/**
 * Service layer for training-related business logic
 * This layer sits between resolvers and models to handle complex operations
 */
class TrainingService {
    constructor(connection) {
        this.centerTrainingModel = new CenterTraining(connection);
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

        return {
            totalCenterTrainings: centerTrainings.length,
            totalTrainings: centerTrainings.length,
            centerTrainingsCompleted: centerTrainings.filter(t => t.examinationStatus === 'Completed').length,
        };
    }

    async getUpcomingTrainings() {
        const today = new Date().toISOString().split('T')[0];
        const allCenterTrainings = await this.centerTrainingModel.getAll();

        const upcomingCenter = allCenterTrainings.filter(
            t => t.startTrainingDate >= today
        );

        return {
            centerTrainings: upcomingCenter,
            total: upcomingCenter.length
        };
    }

    async getEmployeeStats(employeeId, startDate, endDate) {
        const centerTrainings = await this.centerTrainingModel.getAll();

        const allTrainings = centerTrainings.map(t => ({ ...t, source: 'center' }));

        let filtered = allTrainings.filter(t => t.employeeId === employeeId);

        if (startDate) {
            filtered = filtered.filter(t => t.startTrainingDate >= startDate);
        }
        if (endDate) {
            filtered = filtered.filter(t => t.endTrainingDate <= endDate);
        }

        let totalWeeks = 0;
        let fdpCount = 0;
        let certificationCount = 0;
        let trainerName = '';

        filtered.forEach(t => {
            if (!trainerName) trainerName = t.trainerName;

            // Calculate weeks
            const start = new Date(t.startTrainingDate);
            const end = new Date(t.endTrainingDate);
            const diffInMs = Math.abs(end - start);
            const weeks = diffInMs / (1000 * 60 * 60 * 24 * 7);
            totalWeeks += weeks;

            // FDP count (if fdp fields exist and are not 'None' or empty)
            if ((t.fdpReceived && t.fdpReceived !== 'None' && t.fdpReceived !== 'No') ||
                (t.fdpTaken && t.fdpTaken !== 'None' && t.fdpTaken !== 'No')) {
                fdpCount++;
            }

            // Certification count
            if (t.certification && t.certification !== 'None' && t.certification !== 'No') {
                certificationCount++;
            }
        });

        return {
            employeeId,
            name: trainerName || 'Unknown',
            totalWeeks: Math.round(totalWeeks * 10) / 10,
            fdpCount,
            certificationCount
        };
    }
}

export default TrainingService;
