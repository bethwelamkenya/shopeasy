import React from 'react';
import { Tabs, Tab } from './tabs'; // Import the Tabs component

function ContentTabs() {
    return (
        <Tabs>
            <Tab label="Accounts">
                <div>
                    <h2>Accounts Content</h2>
                    <p>This is the content for the Accounts tab.</p>
                    {/* Add your accounts content here */}
                </div>
            </Tab>
            <Tab label="Savings">
                <div>
                    <h2>Savings Content</h2>
                    <p>This is the content for the Savings tab.</p>
                    {/* Add your savings content here */}
                </div>
            </Tab>
            <Tab label="Transactions">
                <div>
                    <h2>Transactions Content</h2>
                    <p>This is the content for the Transactions tab.</p>
                    {/* Add your transactions content here */}
                </div>
            </Tab>
        </Tabs>
    );
}

export default ContentTabs;
