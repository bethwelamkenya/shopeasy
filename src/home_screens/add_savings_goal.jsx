import './add_bank_account.css'
import Enums from "../data_classes/enums";
import {useState} from "react";
import User from "../data_classes/user";
import BankAccount from "../data_classes/bank_account";
import {Icon} from "../globals/icon";
import arrow_back from "../app_images/left.svg";
import {useNavigate} from "react-router-dom";
import SavingsGoal from "../data_classes/savings_goal";

export const AddSavingsGoal = ({user = new User(), accounts = []}) => {
    const navigate = useNavigate()
    const enums = new Enums();
    const [formData, setFormData] = useState({
        accountNumber: accounts[0].accountNumber,
        goalName: '',
        targetAmount: '',
        currency: enums.currencyTypes.USD,
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleGoingBack = () => {
        navigate(-1)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.accountNumber) {
            setError('Please fill in accountNumber');
            return;
        } else if (!formData.goalName) {
            setError('Please fill in goalName');
            return;
        } else if (!formData.targetAmount) {
            setError('Please fill in targetAmount');
            return;
        }

        try {
            const theResponse = await fetch(`http://localhost:8080/savings_goals/${user.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    targetAmount: parseFloat(formData.targetAmount),
                }),
            });

            const response = await theResponse.json()
            if (!theResponse.ok) {
                throw new Error(response.message || 'Failed to create account');
            }

            const newGoal = SavingsGoal.fromJson(response);
            setSuccess(newGoal.goalName + " created successfully");
            setFormData({
                accountNumber: formData.accountNumber,
                goalName: '',
                targetAmount: '',
                currency: enums.currencyTypes.USD,
            });
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="add-account-container">
            <div className={'account-heading'}>
                <Icon src={arrow_back} clickable={true} onClick={handleGoingBack} size={50} className={'arrow-back'}/>
                <h2>Add New Savings Goal</h2>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <form onSubmit={handleSubmit}>
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
                {/*<div className="form-group">*/}
                {/*    <label className="form-label">Account Number</label>*/}
                {/*    <select*/}
                {/*        value={formData.accountNumber}*/}
                {/*        onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}*/}
                {/*        className="currency-select"*/}
                {/*    >*/}
                {/*        {accountNumbers.map((acc, key) => (*/}
                {/*            <option value={acc}>{acc}</option>*/}
                {/*        ))}*/}
                {/*    </select>*/}
                {/*</div>*/}

                <div className="form-group">
                    <label className="form-label">Goal Name</label>
                    <input
                        type="text"
                        value={formData.goalName}
                        onChange={(e) => setFormData({...formData, goalName: e.target.value})}
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Target Amount</label>
                    <input
                        type="number"
                        step="0.01"
                        value={formData.targetAmount}
                        onChange={(e) => setFormData({...formData, targetAmount: e.target.value})}
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Currency</label>
                    <select
                        value={formData.currency}
                        onChange={(e) => setFormData({...formData, currency: e.target.value})}
                        className="currency-select"
                    >
                        {Object.entries(enums.currencyTypes).map(([key, value]) => (
                            <option key={key} value={value}>{value}</option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    className="submit-button"
                >
                    Create Account
                </button>
            </form>
        </div>
    );

}