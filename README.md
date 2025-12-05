📌 Personal Expense & Budget Tracker – Backend

Node.js + Express + MongoDB

A simple and practical backend system that helps users track daily expenses, manage monthly budgets, and analyze spending patterns.
Built using Node.js, Express.js, MongoDB, JWT Authentication, and follows a feature-based folder architecture for scalability.

🚀 Features
🔐 Authentication

User registration & login

JWT-based authentication

Password hashing with bcrypt

💸 Expense Management

Add new expenses

Edit & delete expenses

Fetch all expenses

Get monthly expenses using query params

Supports categories: food, travel, shopping, bills, other

Auto-grouping by month

🎯 Budget Management

Set or update monthly budget limit

Check budget usage status

Automatic monthly aggregation

Warning when user is close to exceeding limit

📊 Analytics (Future Enhancements)

Category-wise charts

Weekly spending summary

CSV / PDF export

Email alerts / notifications

📂 Project Structure
src/
├── user/
│   ├── user.model.js
│   ├── user.routes.js
│   ├── user.controller.js
│   └── user.service.js
│
├── expense/
│   ├── expense.model.js
│   ├── expense.routes.js
│   ├── expense.controller.js
│   └── expense.service.js
│
├── budget/
│   ├── budget.model.js
│   ├── budget.routes.js
│   ├── budget.controller.js
│   └── budget.service.js
│
├── middleware/
│   └── auth.js
│
├── config/
│   └── db.js
│
├── utils/
│
└── server.js


This project uses a feature-based architecture, meaning each module (user, expense, budget) contains its own model, routes, controller, and service files.

🛠️ Tech Stack
Layer	Technology
Runtime	Node.js
Framework	Express.js
Database	MongoDB + Mongoose
Authentication	JWT Tokens
Security	bcrypt
Architecture	Feature-based modular structure
📥 Installation & Setup
1️⃣ Clone the repo
git clone https://github.com/adarshkumar-prog/Personal-Expense---Budget-Tracker.git
cd Personal-Expense---Budget-Tracker

2️⃣ Install dependencies
npm install

3️⃣ Environment variables

Create a .env file:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

4️⃣ Start the server
npm run dev


Backend will run on:

http://localhost:5000

🗂️ API Routes
👤 User Routes
Method	Endpoint	Description
POST	/api/users/register	Register a new user
POST	/api/users/login	Login user & return JWT
💸 Expense Routes (Protected)
Method	Endpoint	Description
POST	/api/expenses	Add new expense
GET	/api/expenses	Get all expenses
GET	/api/expenses/month?m=1	Get monthly expenses
PUT	/api/expenses/:id	Update expense
DELETE	/api/expenses/:id	Delete expense
🎯 Budget Routes (Protected)
Method	Endpoint	Description
POST	/api/budget	Set/update monthly budget
GET	/api/budget/status	Get usage & remaining budget
🎯 Future Enhancements

Recurring expenses

AI-based spend prediction

User notifications

PDF / CSV reports

Mobile app integration

👨‍💻 Author

Adarsh — Backend Developer
