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
        console.log(`=== Analyzing Stats for Employee: ${employeeId} ===`);
        console.log(`Range: ${startDate || 'ANY'} to ${endDate || 'ANY'}`);

        // 1. Fetch ALL records for this employee to analyze their full history
        const allRecords = await this.centerTrainingModel.findFiltered({ employeeId });
        console.log(`Total records found for this employee: ${allRecords.length}`);

        // 2. Filter based on date range overlap
        // A training session is relevant if it overlaps with the requested range.
        const resultFiltered = allRecords.filter(t => {
            // Convert to dates for comparison
            const sessionStart = t.startTrainingDate;
            const sessionEnd = t.endTrainingDate;

            // If no range provided, include everything
            if (!startDate && !endDate) return true;

            let isMatch = true;

            // Session must have started before our range ends
            if (endDate && sessionStart > endDate) isMatch = false;

            // Session must have ended after our range starts
            if (startDate && sessionEnd < startDate) isMatch = false;

            return isMatch;
        });

        console.log(`Records matching date range: ${resultFiltered.length}`);

        let totalWeeks = 0;
        let fdpCount = 0;
        let certificationCount = 0;
        let trainerName = '';
        const centers = new Set();

        resultFiltered.forEach(t => {
            if (!trainerName && t.trainerName) trainerName = t.trainerName;
            if (t.center) centers.add(t.center);

            // Calculate weeks using the portion of the training that falls WITHIN the range
            if (t.startTrainingDate && t.endTrainingDate) {
                const sDate = new Date(t.startTrainingDate);
                const eDate = new Date(t.endTrainingDate);

                // Adjust start/end to fit within the filter range for accurate week calculation
                const filterStart = startDate ? new Date(startDate) : sDate;
                const filterEnd = endDate ? new Date(endDate) : eDate;

                const effectiveStart = sDate < filterStart ? filterStart : sDate;
                const effectiveEnd = eDate > filterEnd ? filterEnd : eDate;

                if (!isNaN(effectiveStart) && !isNaN(effectiveEnd) && effectiveEnd > effectiveStart) {
                    const diffInMs = effectiveEnd - effectiveStart;
                    const weeks = diffInMs / (1000 * 60 * 60 * 24 * 7);
                    totalWeeks += weeks;
                }
            }

            // FDP and Certification checks (exclude 'None', 'No', 'NA')
            if ((t.fdpReceived && !['None', 'No', 'NA'].includes(t.fdpReceived)) ||
                (t.fdpTaken && !['None', 'No', 'NA'].includes(t.fdpTaken))) {
                fdpCount++;
            }

            if (t.certification && !['None', 'No', 'NA'].includes(t.certification)) {
                certificationCount++;
            }
        });

        return {
            employeeId,
            name: trainerName || 'Unknown',
            totalWeeks: Math.round(totalWeeks * 10) / 10,
            fdpCount,
            certificationCount,
            centerCount: centers.size,
            trainings: resultFiltered
        };
    }
}

export default TrainingService;
