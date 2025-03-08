import app_image from "../app_images/app_image.png";
import notification from "../app_images/bell.svg";
import moon from "../app_images/first_quarter.svg";
import home_page from "../app_images/home_page.svg";
import user_circled from "../app_images/user_male_circle.svg";
import user_a from "../app_images/user.svg";
import savings from "../app_images/money_box.svg";
import cashbook from "../app_images/cashbook.svg";
import menu from "../app_images/menu.svg";
import menu_close from "../app_images/drag_list_down.svg";
import {Icon} from "./icon";
import './top_app_bar.css'
import {useEffect, useRef, useState} from "react";

export const TopAppBar = ({user, onThemeChange}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const menuRef = useRef(null)
    const menuIconRef = useRef(null)
    const onChanged = () => {
        onThemeChange("")
    }

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target) && menuIconRef.current && !menuIconRef.current.contains(event.target)) {
                setIsMenuOpen(false)
            }
        }

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isMenuOpen])

    return (
        <header className="header">
            <div className="header_logo">
                <a href="/"><img src={app_image} alt={"app_image"}/> Personal Finance Tracker</a>
            </div>
            <div ref={menuIconRef} className={'header-menu-icon'}>
                <Icon src={isMenuOpen ? menu_close : menu} clickable={true} onClick={handleMenuToggle}/>
            </div>
            <div ref={menuRef} className={`header_contents ${isMenuOpen ? ' open' : ''}`}>
                {/* Navigation Links */}
                <nav className="header_nav">
                    <a href="/"><Icon src={home_page}/> Home</a>
                    <a href="/accounts"><Icon src={user_circled}/>Accounts</a>
                    <a href="/contact"><Icon src={savings}/>Savings</a>
                    <a href="/contact"><Icon src={cashbook}/>Transactions</a>
                </nav>

                {/* User Actions */}
                <div className="header_actions">
                    <a href="/cart" className="header_notifications" data-count={0}>
                        <Icon src={notification}/>
                    </a>
                    {user ? (
                        <a href="/account">{user.email[0].toUpperCase()}</a>
                    ) : (
                        <a href="/user_login">
                            <Icon src={user_a}/>
                        </a>
                    )}
                    <Icon src={moon} clickable={true} onClick={onChanged}></Icon>
                </div>
            </div>
        </header>
    )
}