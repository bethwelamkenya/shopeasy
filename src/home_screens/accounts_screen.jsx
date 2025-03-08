import './accounts_screen.css'
import bank_building from '../app_images/bank_building.svg'
import calendar from '../app_images/calendar.svg'
import credit_card from '../app_images/mastercard_credit_card.svg'
import user_icon from '../app_images/user.svg'
import {Icon} from "../globals/icon";
import {Navigate, useNavigate} from "react-router-dom";
import arrow_back from "../app_images/left.svg";

export const AccountsScreen = ({user, accounts = [], savingsGoals = [], transactions = []}) => {
    const navigate = useNavigate()
    const handleAccountClick = (account) => {
        navigate(`/account_details/${account.accountNumber}`, {state: {account: JSON.stringify(account)}})
        // navigate(`/account_details/${account}`)
    }
    const handleGoingBack = () => {
        navigate(-1)
    }
    return (
        <div className={'accounts-container'}>
            <div className={'account-heading'}>
                <Icon src={arrow_back} clickable={true} onClick={handleGoingBack} size={50} className={'arrow-back'}/>
                <h1>Your Accounts</h1>
            </div>
            <div className={'accounts-list'}>
                {accounts.length === 0 ? (
                    <h1>No Accounts Found</h1>
                ) : (
                    accounts.map((account, index) => (
                            <div className={'account-card'} key={index}
                                 onClick={() => {
                                     handleAccountClick(account)
                                 }}>
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
                        )
                    )
                )}
            </div>
        </div>
    )
}