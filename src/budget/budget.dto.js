class AddBudgetRequestDTO{
    constructor( { ...props } ) {
        this.userId = props.userId;
        this.monthlyLimit = props.monthlyLimit;
        this.month = props.month;
        this.year = props.year;
        Object.freeze(this);
    }
}

class UpdateBudgetRequestDTO{
    constructor( { ...props } ) {
        this.userId = props.userId;
        this.monthlyLimit = props.monthlyLimit;
        this.month = props.month;
        this.year = props.year;
        Object.freeze(this);
    }
}

class BudgetGetDTO {
    constructor( { ...props } ) {
        this.userId = props.userId;
        this.monthlyLimit = props.monthlyLimit;
        this.month = props.month;
        this.year = props.year;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;

        Object.freeze(this);
    }
}

module.exports = {
    AddBudgetRequestDTO,
    UpdateBudgetRequestDTO,
    BudgetGetDTO,
}