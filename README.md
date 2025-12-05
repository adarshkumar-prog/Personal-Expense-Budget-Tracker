Personal Expense & Budget Tracker – Backend (Node.js + Express + MongoDB)
A simple and practical backend project to help users track daily expenses, manage budgets, and monitor monthly spending habits. Built with Node.js, Express, MongoDB, and JWT Auth.
Features
Authentication
User registration & login
JWT-based authentication
Password hashing using bcrypt
Expenses
Add new expenses
Edit & delete expenses
Fetch all expenses
Get monthly expenses (via query params)
Expense categories (food, travel, shopping, bills, etc.)
Budget Management
Set/update monthly budget limit
Check budget status
Automatic monthly expense aggregation
Warning when user is near limit
Analytics (Optional Future Enhancements)
Category-wise expense chart
Spending summary
CSV / PDF export
Project Structure
src/
 ├── user/
 │     ├── user.model.js
 │     ├── user.routes.js
 │     ├── user.controller.js
 │     └── user.service.js
 ├── expense/
 │     ├── expense.model.js
 │     ├── expense.routes.js
 │     ├── expense.controller.js
 │     └── expense.service.js
 ├── budget/
 │     ├── budget.model.js
 │     ├── budget.routes.js
 │     ├── budget.controller.js
 │     └── budget.service.js
 ├── middleware/
 │     └── auth.js
 ├── config/
 │     └── db.js
 ├── utils/
 └── server.js
A feature-based architecture is used for scalability and clean separation of concerns.
Tech Stack
Node.js
Express.js
MongoDB + Mongoose
JWT Authentication
bcrypt for password hashing
Category-based budgets
Weekly analysis
Notifications / email alerts
Frontend (React)
Author
Adarsh – Backend Developer

