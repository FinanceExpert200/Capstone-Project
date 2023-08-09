# Project Plan

Pod Members: Matthew Ibrahim, Lake Bradford, Joselyne Malan

## Problem Statement and Description

Our project addresses the lack of understanding and the perception of trading as gambling by providing a user-friendly platform that educates users about investment strategies. We aim to emphasize the quantitative and profit-oriented aspects of trading to empower individuals to make informed investment decisions. Our target audience consists of individuals seeking to learn about responsible investing, including beginners and those interested in quantitative trading approaches.
Our project's primary objective is to provide a secure and risk-free platform that educates users about diverse investment strategies, while dispelling the misconception that trading is synonymous with glorified gambling. Key features include descriptions of multiple trading strategies and their profitibality, and using the current market data to show how effective these strategies are in todays market.

## User Roles and Personas

User Persona #1: Olivia Martinez: a high school student from New York City, USA.

Age: 16
Access/sophistication with technology: Proficient with smartphones and uses them primarily.
Frequency of site access: A few times a week, after school hours.
Motivation/Pain points: Olivia can't wait to open her own brokage account. She is invested in becoming familar with the stock market. Growing up she has seen friend and family gain sucuess within this market. She has also heard of the multiple strategies people have taken to ensure a successful trade in the market. As a result, she wants to understand how these different strategies work. However, she is too young to open a real brokeage account and finds it difficult to understand the trading terminology used in this market.
User Persona #2: David Thompson: a small business owner from Sydney, Australia.

Age: 45
Access/sophistication with technology: Comfortable using computers and smartphones.
Frequency of site access: Once or twice a week, typically on weekends.
Motivation/Pain points: David is well aquainted with the stock markekt and done his own investment in the past. However, there were times where he has made poor investments resutlting in him losing his confidence in his trading skills. Now he seeks to diversify his investment portfolio and build up his financial confidence.

## User Stories

List the current user stories you will implement.
As a new user I want to create my own account so that I can keep track of my own data.
As a user I seek a platform that offers educational resources and guidance to help me understand the potential risks and benefits associated with each strategy.
As a user I want to understand the basic approach to these trading strategies so that I can confidently interact with the trading market.
As a user I want to receive a set amount of fictitious money so that I can interact with the market without risking my financial stability.
As a user I want to see a transaction of my trading history so that I can track my investment.
As a user I want to be able to see the data values from a particular company when i click on it so that I can see its % rate and current value
As a user I want to be able to choose different companies to trade with so that I can personalize my own trading choices.
As a user I want to interact with a data that reflects the market in real time so that I can visualize a possible trajectory in my investment
As a user I want to be able to buy and sell a stock from a selected company so that I can visualize my choice of trade.
As a user I want to be able to select what trading strategy I am intrested in using so that i can pair up the trading results with the selected strategy.

## Pages/Screens

List all the pages and screens in the app. Include wireframes for at least 3 of them.

![](pictures/Routes.jpg)
![](pictures/Home.jpg)
![](pictures/Login:Registration.jpg)
![](pictures/Reciept.jpg)
![](pictures/trade.gif)

## Data Model

<img width="1092" alt="Screenshot 2023-07-10 at 1 58 00 PM" src="https://github.com/FinanceExpert200/Capstone-Project/assets/89942749/9726799a-0c27-4bc3-ae87-f3c2ebede169">

## Endpoints

List the API endpoints you will need to implement.
POST REQUEST:
Adding a transaction using Postman
Link: https://stock-swap.onrender.com/trans/add
{
"ticker": "APPL",
"quantity": 2,
"curr_price": 240,
"user_id": 1,
"trans_type": "sell"
}
Buy Transaction
Link: https://stock-swap.onrender.com/trans/buy
{
"ticker": "APPL",
"quantity": 2,
"curr_price": 240,
"user_id": 1,
"trans_type": "sell"
}

Create a new User
Link: https://stock-swap.onrender.com/auth/register
{
"email": "test@gmail.com",
"firstName": "test",
"lastName": "test2",
"password": "1234"
}

GET REQUESTS

gets the account information for a user
https://stock-swap.onrender.com/trans/account/:id

LIST OF REQUEST:
Create - POST - Adding a transaction to a table
Update - PUT - Update user's profile data
Read - GET - Fetch the stocks from the Yahoo Finance API

**_Don't forget to set up your Issues, Milestones, and Project Board!_**
