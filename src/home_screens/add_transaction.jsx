import Enums from "../data_classes/enums";
import {useEffect, useState} from "react";
import Transaction from "../data_classes/transaction";
import {useNavigate} from "react-router-dom";
import {Icon} from "../globals/icon";
import arrow_back from "../app_images/left.svg";
import approve_and_update from '../app_images/approve_and_update.svg'
import './add_transaction.css'
import axios from "axios";
import BankAccount from "../data_classes/bank_account";

export const AddTransaction = ({user, accounts = [], savingsGoals = []}) => {
    const navigate = useNavigate()
    const enums = new Enums();
    const [types, setTypes] = useState([
        enums.transactionTypes.DEPOSIT,
        enums.transactionTypes.WITHDRAW,
        enums.transactionTypes.TRANSFER_OUT,
        enums.transactionTypes.TRANSFER_OUT_TO,
        enums.transactionTypes.DEPOSIT_GOAL,
        enums.transactionTypes.WITHDRAW_GOAL,
    ])
    const [formData, setFormData] = useState({
        accountNumber: accounts[0].accountNumber,
        type: types[0],
        targetAccountNumber: '',
        targetUserEmail: '',
        amount: '',
        currency: enums.currencyTypes.USD,
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [isOutside, setIsOutside] = useState(false)

    const [targetAccounts, setTargetAccounts] = useState(accounts.filter((acc) =>
        acc.accountNumber !== formData.accountNumber
    ))
    useEffect(() => {
        setError('')
        if (isOutside) {
            setTargetAccounts([])
        } else {
            setTargetAccounts(
                accounts.filter((acc) =>
                    acc.accountNumber !== formData.accountNumber
                )
            )
        }
    }, [accounts, formData.accountNumber, isOutside]);

    const handleGoingBack = () => {
        navigate(-1)
    }

    const fetchBankAccounts = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/bank_accounts/email/${formData.targetUserEmail}`);
            if (response.data.success) {
                setTargetAccounts(response.data.accounts.map(acc =>
                    BankAccount.fromJson(acc)
                ));
            } else {
                // setError('An error occurred' + response.data.message)
            }
        } catch (err) {
            // setError('An error occurred while fetching accounts: ' + err.message)
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!formData.accountNumber || !formData.amount) {
            setError('Please fill in all required fields');
            return;
        }

        if (formData.type === enums.transactionTypes.TRANSFER_OUT_TO) {
            if (!formData.targetUserEmail){
                setError('Please fill in target User email');
                return;
            }
        }

        try {
            const theResponse = await fetch(`http://localhost:8080/transactions/${user.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    amount: parseFloat(formData.amount),
                }),
            });
            const response = await theResponse.json()

            if (!theResponse.ok) {
                try {
                    console.log(response)
                    setError(response.message)
                    return
                } catch (e) {
                    setError(e)
                    return
                }
                // throw new Error(response.message || 'Failed to complete transaction');
            }
            const newTransaction = Transaction.fromJson(response);
            setSuccess(`Transaction for account ${newTransaction.accountNumber} created successfully!`);
            setFormData({
                accountNumber: '',
                type: enums.transactionTypes.DEPOSIT,
                targetAccountNumber: '',
                targetUserEmail: '',
                amount: '',
                currency: enums.currencyTypes.USD,
            });
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className={'add-transaction-container add-account-container'}>
            <div className={'account-heading'}>
                <Icon src={arrow_back} clickable={true} onClick={handleGoingBack} size={50} className={'arrow-back'}/>
                <h2>Add New Transaction</h2>
            </div>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <form onSubmit={handleSubmit}>
                <div className={'transaction-types'}>
                    {Object.entries(types).map(([key, value]) => (
                        <p key={key} onClick={(e) => {
                            setFormData({...formData, type: value})
                            if (value === enums.transactionTypes.TRANSFER_OUT_TO) {
                                setIsOutside(true)
                            } else {
                                setIsOutside(false)
                            }
                        }} className={
                            formData.type === value ? 'selected' : ''
                        }>{value.replace('_', ' ')}</p>
                    ))}
                </div>
                <div className="form-group">
                    <label className="form-label">Account Number</label>
                    <select
                        value={formData.accountNumber}
                        onChange={(e) =>
                            setFormData({...formData, accountNumber: e.target.value})}
                        className="currency-select"
                    >
                        {accounts.map((acc, key) => (
                            <option value={acc.accountNumber}>{acc.accountNumber}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Amount</label>
                    <input
                        type="number"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                        className="form-input"
                        required
                    />
                </div>

                {formData.type === enums.transactionTypes.TRANSFER_OUT ? (
                    <div className="form-group">
                        <label className="form-label">Account Number</label>
                        <select
                            value={formData.targetAccountNumber}
                            onChange={(e) => setFormData({...formData, targetAccountNumber: e.target.value})}
                            className="currency-select"
                        >
                            {targetAccounts.map((acc, key) => (
                                <option value={acc.accountNumber}>{acc.accountNumber}</option>
                            ))}
                        </select>
                    </div>
                ) : null}

                {formData.type === enums.transactionTypes.TRANSFER_OUT_TO ? (
                    <div>
                        <div className={'approve'}>
                            <div className="form-group">
                                <label className="form-label">Target User</label>
                                <input
                                    type="text"
                                    value={formData.targetUserEmail}
                                    onChange={(e) => setFormData({...formData, targetUserEmail: e.target.value})}
                                    className="form-input"
                                    // required
                                />
                            </div>
                            <Icon src={approve_and_update} className={'check'} clickable={true}
                                  onClick={fetchBankAccounts}/>
                        </div>

                        {targetAccounts.length !== 0 ? (
                            <div className="form-group">
                                <label className="form-label">Account Number</label>
                                <select
                                    value={formData.targetAccountNumber}
                                    onChange={(e) => setFormData({...formData, targetAccountNumber: e.target.value})}
                                    className="currency-select"
                                >
                                    {targetAccounts.map((acc, key) => (
                                        <option value={acc.accountNumber}>{acc.accountNumber}</option>
                                    ))}
                                </select>
                            </div>
                        ) : null}
                    </div>
                ) : null}

                {/*<div className="form-group">*/}
                {/*    <label className="form-label">Currency</label>*/}
                {/*    <select*/}
                {/*        value={formData.currency}*/}
                {/*        onChange={(e) => setFormData({...formData, currency: e.target.value})}*/}
                {/*        className="currency-select"*/}
                {/*    >*/}
                {/*        {Object.entries(enums.currencyTypes).map(([key, value]) => (*/}
                {/*            <option key={key} value={value}>{value}</option>*/}
                {/*        ))}*/}
                {/*    </select>*/}
                {/*</div>*/}

                <button
                    type="submit"
                    className="submit-button"
                >
                    Transact
                </button>
            </form>
        </div>
    )
}