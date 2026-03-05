# Investment Tracker
## Overview

Investment Tracker is a web application that allows users to track and analyze their investment portfolio in one place.

Users can add their investments and monitor their current value using real-time market data fetched from the Finnhub API. The application provides insights into portfolio performance, including profit/loss, daily changes, and asset diversification.

## Dashboard view
<img width="1888" height="857" alt="image" src="https://github.com/user-attachments/assets/6e7f3411-2f6e-4f9d-86d5-2f41d4286b95" />


## Features

The application consists of several main sections:

### Dashboard
Provides a general overview of the portfolio, including:
- current portfolio value
- total profit/loss
- daily change
- asset diversification by type and company

### Portfolio
Displays the full list of investments held by the user.

### Charts
Visualizes portfolio performance through charts such as:
- portfolio value over time
- profit over time
- return rate

### Transaction History
Allows users to review their past investment transactions.

### Investor Journal
A section where users can record notes, decisions, and reflections related to their investments.

### Learning Resources
Educational materials organized by different levels of investment knowledge.

### Advisor
A simple advisory tool based on a questionnaire that evaluates the user's portfolio diversification and provides recommendations.


## Tech Stack

Backend:
- Python
- Django REST Framework

Frontend:
- React.js

Database:
- PostgreSQL

External APIs:
- Finnhub API


## Architecture

The application follows a full-stack architecture:

- Backend built with Django REST Framework providing RESTful API
- React frontend consuming backend endpoints
- PostgreSQL database for storing user portfolios, transactions and assets
- External financial data fetched from Finnhub API


## Key Backend Features

- REST API built with Django REST Framework
- JWT authentication
- integration with external financial API
- caching to limit external API calls
- portfolio value calculation logic

## Setup

1. Clone repository

git clone https://github.com/your-repo/investment-app

2. Backend setup

cd backend  
pip install -r requirements.txt  
python manage.py migrate  
python manage.py runserver  

3. Frontend setup

cd frontend  
npm install  
npm start
