import React, { useState } from 'react';
import './tabs.css'; // Create this CSS file

function Tabs({ children }) {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabClick = (index) => {
        setActiveTab(index);
    };

    return (
        <div className="tabs">
            <div className="tab-list">
                {React.Children.map(children, (child, index) => (
                    <button
                        key={index}
                        className={`tab-list-item ${activeTab === index ? 'active' : ''}`}
                        onClick={() => handleTabClick(index)}
                    >
                        {child.props.label}
                    </button>
                ))}
            </div>
            <div className="tab-content">
                {React.Children.toArray(children)[activeTab]}
            </div>
        </div>
    );
}

function Tab({ label, children }) {
    return <div className="tab-panel">{children}</div>;
}

export { Tabs, Tab };
