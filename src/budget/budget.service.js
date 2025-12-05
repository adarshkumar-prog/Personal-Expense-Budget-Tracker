const budgetModel = require('./budget.model');
const userModel = require("../user/user.models");
const autoBind = require('auto-bind');

class BudgetService {
    constructor(budgetModel, userModel) {
        this.budgetModel = budgetModel;
        this.userModel = userModel;
        autoBind(this);
    }
    
    async setBudget (budgetDTO, loginUserId) {
        try {
            const userId = budgetDTO.userId;
            const loggedInUserId = loginUserId.toString();
            console.log(loggedInUserId, userId);
            if(userId.toString() !== loggedInUserId) {
                throw new Error('Unauthorized to set budget for this user');
            }
            const user = await this.userModel.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            const budgetExists = await this.budgetModel.findOne({ userId: user.id, month: budgetDTO.month, year: budgetDTO.year });
            if (budgetExists) {
                throw new Error('Budget for this month already exists if you want to update please use update option');
            }
            const budgetData = await this.budgetModel.create({
                ...budgetDTO,
                userId: user.id,
            });
            if (budgetData) {
                return {
                    data: budgetData.toJSON(),
                    message: 'Budget set successfully',
                };
            }
            throw new Error('Setting budget failed');
        } catch (error) {
            throw error;
        }
    }

    async getBudget (userId) {
        try {
            const user = await this.userModel.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            const budgetData = await this.budgetModel.findOne({ userId }).sort({ createdAt: -1 });
            if(!budgetData) {
                throw new Error('No budget found for this user');
            }
            return {
                data: budgetData,
                message: 'Budget fetched successfully',
            };
        } catch (error) {
            throw error;
        }
    }

    async updateBudget (id, budgetDTO, loginUserId) {
        try {
            const loggedInUserId = loginUserId.toString();
            if(budgetDTO.userId.toString() !== loggedInUserId) {
                throw new Error('Unauthorized to update budget for this user');
            }
            const budget = await this.budgetModel.findById(id);
            if (!budget) {
                throw new Error('Budget not found');
            }
            if (!budget.userId.equals(budgetDTO.userId)) {
                throw new Error('Unauthorized to update this budget');
            }
            const updatedBudget = await this.budgetModel.findByIdAndUpdate(
                id,
                { $set: { monthlyLimit: budgetDTO.monthlyLimit, month: budgetDTO.month, year: budgetDTO.year } },
                { new: true }
            );
            if (updatedBudget) {
                return {
                    data: updatedBudget.toJSON(),
                    message: 'Budget updated successfully',
                };
            }
            throw new Error('Updating budget failed');
        } catch (error) {
            throw error;
        }
    }

    async deleteBudget (id, userId) {
        try {
            if(!id) {
                throw new Error('Budget id is required to delete budget');
            }
            if(!userId) {
                throw new Error('User id is required to delete budget');
            }
            const user = await this.userModel.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            const budget = await this.budgetModel.findById(id);
            if (!budget) {
                throw new Error('Budget not found');
            }
            if (!budget.userId.equals(userId)) {
                throw new Error('Unauthorized to delete this budget');
            }
            await this.budgetModel.findByIdAndDelete(id);
            return {
                message: 'Budget deleted successfully',
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new BudgetService(budgetModel, userModel);