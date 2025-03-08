import './add_bank_account.css'
import Enums from "../data_classes/enums";
import {useState} from "react";
import User from "../data_classes/user";
import BankAccount from "../data_classes/bank_account";
import {useNavigate} from "react-router-dom";
import {Icon} from "../globals/icon";
import arrow_back from "../app_images/left.svg";

export const AddBankAccount = ({user = new User()}) => {
    const navigate = useNavigate()
    const enums = new Enums();
    const [formData, setFormData] = useState({
        accountNumber: '',
        holderName: '',
        bankName: '',
        balance: '',
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

        if (!formData.accountNumber || !formData.holderName || !formData.bankName) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            const theResponse = await fetch(`http://localhost:8080/bank_accounts/${user.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    balance: parseFloat(formData.balance),
                }),
            });

            const response = await theResponse.json()
            if (!theResponse.ok) {
                throw new Error(response.message || 'Failed to create account');
            }

            const newAccount = BankAccount.fromJson(response);
            setSuccess(newAccount.accountNumber + " created successfully");
            setFormData({
                accountNumber: '',
                holderName: '',
                bankName: '',
                balance: '',
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
                <h2>Add New Bank Account</h2>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Account Number</label>
                    <input
                        type="text"
                        value={formData.accountNumber}
                        onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Holder Name</label>
                    <input
                        type="text"
                        value={formData.holderName}
                        onChange={(e) => setFormData({...formData, holderName: e.target.value})}
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Bank Name</label>
                    <input
                        type="text"
                        value={formData.bankName}
                        onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Balance</label>
                    <input
                        type="number"
                        step="0.01"
                        value={formData.balance}
                        onChange={(e) => setFormData({...formData, balance: e.target.value})}
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