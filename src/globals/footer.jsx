import facebook from "../app_images/facebook_f.svg";
import './footer.css'
import {Icon} from "./icon";
import twitter from "../app_images/twitter_squared.svg";
import instagram from "../app_images/instagram_new.svg";

export const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="/about">About Us</a></li>
                        <li><a href="/services">Services</a></li>
                        <li><a href="/faq">FAQ</a></li>
                        <li><a href="/blog">Blog</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Contact Us</h3>
                    <p>Email: info@financetracker.com</p>
                    <p>Phone: +254 700 123 456</p>
                    <p>Address: Nairobi, Kenya</p>
                </div>

                <div className="footer-section">
                    <h3>Social Media</h3>
                    <div className="social-icons">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <Icon src={facebook} size={20}/>Facebook</a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                            <Icon src={twitter} size={20}/>Twitter</a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            <Icon src={instagram} size={20}/>Instagram</a>
                    </div>
                </div>

                <div className="footer-section copyright">
                    <p><a href={'/copy_write'}>&copy; {new Date().getFullYear()}</a> Finance Tracker. All rights reserved.</p>
                    <div className="footer-links">
                        <a href="/terms_of_service">Terms of Service</a>
                        <a href="/privacy">Privacy Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}