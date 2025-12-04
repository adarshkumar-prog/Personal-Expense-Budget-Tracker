class AddExpenseRequestDTO {
    constructor( { ...props } ) {
        this.amount = props.amount;
        this.category = props.category;
        this.date = props.date;
        this.description = props.description;
        this.userId = props.userId;

        Object.freeze(this);
    }
}

class ExpenseGetDTO {
    constructor( { ...props } ) {
        this.id = props.id;
        this.amount = props.amount;
        this.category = props.category;
        this.date = props.date;
        this.description = props.description;
        this.userId = props.userId;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;

        Object.freeze(this);
    }
}

module.exports = {
    AddExpenseRequestDTO,
    ExpenseGetDTO,
}