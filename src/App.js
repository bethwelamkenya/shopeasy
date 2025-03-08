import React, {useEffect, useState} from 'react';
import './App.css';
import './fonts.css'
import FinanceDashboard from "./home_screens/finance_dashboard";
import {TopAppBar} from "./globals/top_app_bar";
import {BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate} from "react-router-dom";
import {UserLogin} from "./user_account/user_login";
import {UserSignup} from "./user_account/user_signup";
import {Footer} from "./globals/footer";
import BankAccount from './data_classes/bank_account'
import SavingsGoal from './data_classes/savings_goal'
import Transaction from './data_classes/transaction'
import {AccountsScreen} from "./home_screens/accounts_screen";
import {CopyWrite} from "./app_screens/copy_write";
import {TermsOfService} from "./app_screens/terms_of_service";
import {AccountDetails} from "./home_screens/account_details";
import {FloatingActionButton} from "./globals/floating_action_button";
import NotFound from "./globals/not_found";
import {AddBankAccount} from "./home_screens/add_bank_account";
import User from "./data_classes/user";
import axios from "axios";
import {AddSavingsGoal} from "./home_screens/add_savings_goal";
import {AddTransaction} from "./home_screens/add_transaction";

const Enums = require('./data_classes/enums')


function App() {
    const location = useLocation()
    const navigate = useNavigate()
    const enums = new Enums()
    const theme = localStorage.getItem("theme");
    const [isDarkTheme, setIsDarkTheme] = useState(
        theme === "dark"
    )
    const [showFab, setShowFab] = useState(false)
    const localUser = localStorage.getItem("user")
    // const [user, setUser] = useState(new User()); // Define setUser
    const [user, setUser] = useState(localUser ? User.fromJson(JSON.parse(localUser)) : null); // Define setUser
    const [accounts, setAccounts] = useState([])
    const [transactions, setTransactions] = useState([])
    const [savingsGoals, setSavingsGoals] = useState([])

    const myBody = (document.getElementById('my_body'));
    myBody.className = `root${isDarkTheme ? " dark" : ''}`
    const toggleTheme = () => {
        console.log("clicked")
        myBody.className = `root${!isDarkTheme ? " dark" : ''}`

        localStorage.setItem("theme", !isDarkTheme ? "dark" : "light");
        setIsDarkTheme(!isDarkTheme)
    }
    const handleClickedFabItem = (item) => {
        if (item === 'account') {
            navigate('/add_bank_account')
        } else if (item === 'savings') {
            navigate('/add_savings_goal')
        } else if (item === 'transaction') {
            navigate('/add_transaction')
        }
    }
    useEffect(message => {
        if (!user) {
            navigate('/user_login')
            return
        }
        const userEmail = user.email

        const fetchBankAccounts = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/bank_accounts/email/${user.id}`);
                console.log(response)
                if (response.data) {
                    setAccounts(response.data.map(acc =>
                        BankAccount.fromJson(acc)
                    ));
                } else {
                    // alert('An error occurred' + response.data.message)
                }
            } catch (err) {
                // alert('An error occurred while fetching accounts: ' + err.message);
            }
        };

        const fetchSavingsGoals = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/savings_goals/email/${user.id}`);
                if (response.data) {
                    setSavingsGoals(response.data.map(goal =>
                        SavingsGoal.fromJson(goal)
                    ));
                } else {
                    // alert('An error occurred' + response.data.message)
                }
            } catch (err) {
                // alert('An error occurred while fetching savings goals: ' + err.message);
            }
        };

        const fetchTransactions = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/transactions/email/${user.id}`);
                if (response.data) {
                    setTransactions(response.data.map(transaction =>
                        Transaction.fromJson(transaction)
                    ));
                } else {
                    // alert('An error occurred' + response.data.message)
                }
            } catch (err) {
                // alert('An error occurred while fetching transactions: ' + err.message);
            }
        };

        fetchBankAccounts();
        fetchSavingsGoals()
        fetchTransactions()
    }, [user]);

    useEffect(() => {
        if (location.pathname === '/' ||
            location.pathname === '/accounts' ||
            location.pathname === '/savings' ||
            location.pathname === '/transactions'
        ) {
            setShowFab(true)
        } else {
            setShowFab(false)
        }
    }, [location.pathname])

    return (
        <div className={"App"}>
            <TopAppBar user={user} onThemeChange={toggleTheme}/>
            {/*{user ? <TopAppBar user={user} onThemeChange={toggleTheme}/> : null}*/}
            <Routes>
                <Route path={"/user_login"} element={<UserLogin/>}/>
                <Route path={"/user_signup"} element={<UserSignup/>}/>
                <Route path={'/'} element={
                    <FinanceDashboard user={user}
                                      accounts={accounts}
                                      savingsGoals={savingsGoals}
                                      transactions={transactions}
                    ></FinanceDashboard>
                }/>
                <Route path={'/accounts'}
                       element={<AccountsScreen user={user} accounts={accounts} savingsGoals={savingsGoals}
                                                transactions={transactions}/>}/>
                <Route path={'/account_details/:accountNumber'}
                       element={<AccountDetails user={user} accounts={accounts} savingsGoals={savingsGoals}
                                                transactions={transactions}/>}/>
                <Route path={"/add_bank_account"} element={<AddBankAccount user={user}/>}/>
                <Route path={'/add_savings_goal'} element={<AddSavingsGoal user={user} accounts={accounts}/>}/>
                <Route path={'/add_transaction'}
                       element={<AddTransaction user={user} accounts={accounts} savingsGoals={savingsGoals}/>}/>
                <Route path={'/copy_write'} element={<CopyWrite/>}/>
                <Route path={'/terms_of_service'} element={<TermsOfService/>}/>
                <Route path={'*'} element={<NotFound/>}/>
            </Routes>
            {user ? showFab ? <FloatingActionButton clickedItem={handleClickedFabItem}/> : null
                : null}
            <Footer/>
        </div>
    );
}

function AppWrapper() {
    return <Router><App/></Router>
}

export default AppWrapper;
