import './copy_write.css'
import {Icon} from "../globals/icon";
import arrow_back from "../app_images/left.svg";
import {useNavigate} from "react-router-dom";

export const CopyWrite = () => {
    const navigate = useNavigate()
    const handleGoingBack = () => {
        navigate(-1)
    }
    return (
        <div className="copy-container">
            <div className={'account-heading'}>
                <Icon src={arrow_back} clickable={true} onClick={handleGoingBack} size={50} className={'arrow-back'}/>
                <h1>MIT License</h1>
            </div>
            <h3>Copyright (c) 2024 Bethwel Karanja</h3>
            <hr/>
            <p className="license">
                Permission is hereby granted, free of charge, to any person obtaining a copy
                of this software and associated documentation files (the "Software"), to deal
                in the Software without restriction, including without limitation the rights
                to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                copies of the Software, and to permit persons to whom the Software is
                furnished to do so, subject to the following conditions:
                <br/>
                The above copyright notice and this permission notice shall be included in all
                copies or substantial portions of the Software.
                <br/>
                THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                SOFTWARE.
            </p>
        </div>
    )
}