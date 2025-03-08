import './terms_of_service.css'
import {Icon} from "../globals/icon";
import arrow_back from "../app_images/left.svg";
import {useNavigate} from "react-router-dom";
export const TermsOfService = () => {
    const navigate = useNavigate()
    const handleGoingBack = () => {
        navigate(-1)
    }
    return (
        <div className={'terms-of-service-container'}>
            <div className={'account-heading'}>
                <Icon src={arrow_back} clickable={true} onClick={handleGoingBack} size={50} className={'arrow-back'}/>
                <h1>Terms of Service</h1>
            </div>
            <ol>
                <li><
                    h3>Acceptance of Terms</h3>
                    <p>
                        By accessing and using this app, you agree to be bound by these Terms of Service.<br/>
                        If you do not agree to any part of these terms, please discontinue use immediately.
                    </p>
                </li>
                <li>
                    <h3>User Responsibilities</h3>
                    <p>
                        - You must use the app in accordance with all applicable laws and regulations.<br/>
                        - Do not attempt to hack, exploit vulnerabilities, or interfere with the app's
                        functionality.<br/>
                        - You are responsible for maintaining the confidentiality of your login credentials.
                    </p>
                </li>
                <li>
                    <h3>Privacy Policy</h3>
                    <p>
                        We are committed to protecting your privacy. Your personal data is collected, stored, and
                        processed according to our Privacy Policy.<br/>
                        By using this app, you consent to the collection and use of your data as described in our
                        policy.
                    </p>
                </li>
                <li>
                    <h3>Prohibited Activities</h3>
                    <p>
                        - Engaging in fraudulent activities, including identity theft and unauthorized
                        transactions.<br/>
                        - Distributing malware, spam, or harmful content.<br/>
                        - Using automated scripts to collect information from the app.
                    </p>
                </li>
                <li>
                    <h3>Changes to Terms</h3>
                    <p>
                        We reserve the right to modify these terms at any time. Any changes will be posted within
                        the app.<br/>
                        Continued use after changes indicates acceptance of the updated terms.
                    </p>
                </li>
                <li>
                    <h3>Limitation of Liability</h3>
                    <p>
                        We are not responsible for any direct, indirect, or incidental damages arising from the use of
                        this app.<br/>
                        Use the app at your own risk.
                    </p>
                </li>
                <li>
                    <h3>Contact Information</h3>
                    <p>
                        If you have any questions or concerns about these Terms of Service, please contact us via our
                        official website.
                    </p>
                </li>
            </ol>
        </div>
    )
}