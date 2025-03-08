import {useLocation, useNavigate, useParams} from "react-router-dom";
import BankAccount from "../data_classes/bank_account";
import {Icon} from "../globals/icon";
import bank_building from "../app_images/bank_building.svg";
import credit_card from "../app_images/mastercard_credit_card.svg";
import user_icon from "../app_images/user.svg";
import calendar from "../app_images/calendar.svg";
import './account_details.css'
import arrow_back from '../app_images/left.svg'
import {Tab, Tabs} from "../globals/tabs";

export const AccountDetails = ({user, accounts = [], savingsGoals = [], transactions = []}) => {
    const navigate = useNavigate()
    const location = useLocation()
    const theAccount = JSON.parse(location.state?.account || '{}')
    const {accountNumber} = useParams()
    const account = BankAccount.fromJson(theAccount)
    if (!account || account.accountNumber !== accountNumber) {
        return <div>Account Not Found</div>
    }

    const accountSavings = savingsGoals.filter(savings_goal =>
        savings_goal.accountNumber === account.accountNumber
    )

    const accountTransactions = transactions.filter(transaction =>
        transaction.accountNumber === account.accountNumber
    )

    const handleGoingBack = () => {
        navigate(-1)
    }

    return (
        <div className={'account-details-container'}>
            <div className={'account-heading'}>
                <Icon src={arrow_back} clickable={true} onClick={handleGoingBack} size={50} className={'arrow-back'}/>
                <h1>{account.accountNumber}</h1>
            </div>
            <div className={'account-card'}>
                <div className={'bank_name'}>
                    <div className={'bank_icon'}>
                        <Icon src={bank_building}/>
                        <h3>{account.bankName}</h3>
                    </div>
                    <p>{account.currency}</p>
                </div>
                <h3 className={'amount'}>{account.balanceFormatted()}</h3>
                <div className={'details_card'}>
                    <Icon src={credit_card} size={20}/>
                    <div className={'other_card'}>
                        <p>Account Number</p>
                        <h5>{account.accountNumber}</h5>
                    </div>
                </div>
                <div className={'details_card'}>
                    <Icon src={user_icon} size={20}/>
                    <div className={'other_card'}>
                        <p>Account Holder</p>
                        <h5>{account.holderName}</h5>
                    </div>
                </div>
                <div className={'details_card'}>
                    <Icon src={calendar} size={20}/>
                    <div className={'other_card'}>
                        <p>Created Date</p>
                        <h5>{account.getCreatedAt()}</h5>
                    </div>
                </div>
            </div>
            <div className={'account-tabs'}>
                <Tabs>
                    <Tab label={'Savings Goals'}>

                        <table className={'list-table'}>
                            <thead>
                            <tr>
                                <th>No.</th>
                                <th>Goal Name</th>
                                <th>Target</th>
                                <th>Saved</th>
                                <th>Currency</th>
                                <th>Date</th>
                            </tr>
                            </thead>
                            <tbody>

                            {accountSavings.length === 0 ? (
                                <tr className={'empty-list'}>
                                    <td colSpan={6}><h3>No Savings Goals found</h3></td>
                                </tr>
                            ) : (accountSavings.map((goal, index) => (
                                <tr>
                                    <td>{index + 1}.</td>
                                    <td>{goal.goalName}</td>
                                    <td>{goal.targetAmountFormatted()}</td>
                                    <td>{goal.savedAmountFormatted()}</td>
                                    <td>{goal.currency}</td>
                                    <td>{goal.getCreatedAt()}</td>
                                </tr>
                            )))}
                            </tbody>
                        </table>
                    </Tab>
                    <Tab label={'Transactions'}>
                        <table className={'list-table'}>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Type</th>
                                <th>Date</th>
                                <th>Amount</th>
                            </tr>
                            </thead>
                            <tbody>
                            {accountTransactions.length === 0 ? (
                                    <tr className={'empty-list'}>
                                        <td colSpan={6}><h3>No Transactions found</h3></td>
                                    </tr>
                            ) : (
                                accountTransactions.map((transaction, index) => (
                                    <tr key={index}>
                                        <td>{transaction.id}</td>
                                        {/*<p>{transaction.accountNumber}</p>*/}
                                        <td>{transaction.type}</td>
                                        <td>{transaction.getCreatedAt()}</td>
                                        <td>{transaction.amountFormatted()}</td>
                                    </tr>
                                )))}
                            </tbody>
                        </table>
                    </Tab>
                </Tabs>
            </div>
            <div></div>
        </div>
    )
}