import {useEffect, useState} from "react";
import './floating_action_button.css'
import add from '../app_images/plus_math.svg'
import close from '../app_images/multiply.svg'
import account from '../app_images/add_user_male.svg'
import savings from '../app_images/receive_cash.svg'
import transaction from '../app_images/add_dollar.svg'
import {Icon} from "./icon";
import {useLocation} from "react-router-dom";

export const FloatingActionButton = ({clickedItem}) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleFab = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="fab-container">
            <div className={`fab-child ${isOpen ? 'open' : ''}`}>
                <button className="fab-icon" onClick={() => {
                    clickedItem('account')
                }}>
                    <Icon src={account}/>
                </button>
                <button className="fab-icon" onClick={() => {
                    clickedItem('savings')
                }}>
                    <Icon src={savings}/>
                </button>
                <button className="fab-icon" onClick={() => {
                    clickedItem('transaction')
                }}>
                    <Icon src={transaction}/>
                </button>
            </div>

            <button className={`fab-main${isOpen ? ' active' : ''}`} onClick={toggleFab}>
                <Icon src={add}/>
            </button>
        </div>
    )
}