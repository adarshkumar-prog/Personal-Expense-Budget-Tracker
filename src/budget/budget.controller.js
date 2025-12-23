const budgetService = require('./budget.service');
const budgetDTO = require('./budget.dto');
const autoBind = require('auto-bind');

class BudgetController {
    constructor(budgetService) {
        this.service = budgetService;
        this.dto = budgetDTO;
        autoBind(this);
    }

    async setBudget (req, res, next) {
        try {
            const response = await this.service.setBudget( new this.dto.AddBudgetRequestDTO({ ...req.body }), req.user.id );
            response.data = new this.dto.BudgetGetDTO(response.data);
            return res.status(201).json(response);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getBudget (req, res, next) {
        try {
            const response = await this.service.getBudget( req.user.id );
            return res.status(200).json(response);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async addMoreBudget (req, res, next) {
        try {
            const response = await this.service.addMoreBudget( req.params.id, new this.dto.UpdateBudgetRequestDTO({ ...req.body }), req.user.id );
            response.data = new this.dto.BudgetGetDTO(response.data);
            return res.status(200).json(response);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async deleteBudget (req, res, next) {
        try {
            const response = await this.service.deleteBudget( req.params.id, req.user.id );
            return res.status(200).json(response);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new BudgetController(budgetService);