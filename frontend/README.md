# Product Transactions Dashboard

# API Routes

1️⃣ Seed Data

GET /seedData

Fetches and stores transaction data from an external source into MongoDB.

2️⃣ Transactions

GET /transition?search=<query>&page=<page_number>

Fetches transactions based on search query and pagination.

Example: GET /transition?search=bag&page=1

3️⃣ Statistics

GET /statistics?month=<YYYY-MM>

Returns total sold items, total sale amount, and total unsold items for the given month.

Example: GET /statistics?month=2022-01

4️⃣ Bar Chart Data

GET /bar_chart?month=<MM>

Returns price range distribution for transactions in the selected month.

Example: GET /bar_chart?month=1

5️⃣ Pie Chart Data

GET /pie_chart?month=<MM>

Returns category-wise distribution of sold products for the selected month.

Example: GET /pie_chart?month=2

6️⃣ Combined API

GET /combinedApi?month=<YYYY-MM>

Fetches statistics, bar chart, and pie chart data in one request.

Example: GET /combinedApi?month=2022-01
