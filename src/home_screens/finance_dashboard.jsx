import './finance_dashboard.css'
import {Icon} from "../globals/icon";
import add from '../app_images/plus_math.svg'
import {useNavigate} from "react-router-dom";
import Helpers from "../data_classes/helpers";


function FinanceDashboard({user = null, accounts = [], savingsGoals = [], transactions = []}) {
    const helper = new Helpers()
    const navigate = useNavigate()
    const handleAccountClick = (account) => {
        navigate(`/account_details/${account.accountNumber}`, {state: {account: JSON.stringify(account)}})
        // navigate(`/account_details/${account}`)
    }
    const handleSavingsClick = (savings) => {
        navigate(`/savings_details/${savings.goalName}`, {state: {savings: JSON.stringify(savings)}})
        // navigate(`/account_details/${account}`)
    }
    const handleTransactionClick = (transaction) => {
        navigate(`/transaction_details/${transaction.id}`, {state: {transaction: JSON.stringify(transaction)}})
        // navigate(`/account_details/${account}`)
    }

    return (
        <div className="finance-tracker">
            {user !== null ? (
                <h1>Email: {user.email}</h1>
            ) : (
                <h1>No User Found</h1>
            )}
            <div className="section">
                <h2>Your Accounts</h2>
                <div className="accounts-grid">
                    {accounts.length === 0 ? (
                        <h3>No Accounts found</h3>
                    ) : (
                        accounts.map((account, index) => (
                            <div className="account-card" key={index} onClick={() => {
                                handleAccountClick(account)
                            }}>
                                <h3>{account.bankName}</h3>
                                <p>{helper.truncateString(account.accountNumber, 4)}</p>
                                <p>{account.holderName}</p>
                                <p>{account.balanceFormatted()}</p>
                                <p>{account.currency}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="section">
                <h2>Your Savings goals</h2>
                <div className="savings-grid">
                    {savingsGoals.length === 0 ? (
                        <h3>No Savings Goals found</h3>
                    ) : (
                        savingsGoals.map((goal, index) => (
                            <div className="savings-card" key={index} onClick={() => {
                                handleSavingsClick(goal)
                            }}>
                                <h3>{goal.goalName}</h3>
                                <p>{helper.truncateString(goal.accountNumber, 4)}</p>
                                <p>Target: {goal.targetAmountFormatted()}</p>
                                <p>Saved: {goal.savedAmountFormatted()}</p>
                                <p>{goal.currency}</p>
                            </div>
                        )))}
                </div>
            </div>

            <div className="section">
                <h2>Recent Transactions</h2>
                <table className={'list-table'}>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Account Number</th>
                        <th>Type</th>
                        <th>Date</th>
                        <th>Amount</th>
                    </tr>
                    </thead>
                    <tbody>
                    {transactions.length === 0 ? (
                        <tr className={'empty-list'}>
                            <td colSpan={6}><h3>No Transactions found</h3></td>
                        </tr>
                    ) : (
                        transactions.map((transaction, index) => (
                            <tr key={index} onClick={() => handleTransactionClick(transaction)}>
                                <td>{transaction.id}</td>
                                <td>{transaction.accountNumber}</td>
                                <td>{transaction.type}</td>
                                <td>{transaction.getCreatedAt()}</td>
                                <td>{transaction.amountFormatted()}</td>
                            </tr>
                        )))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default FinanceDashboard