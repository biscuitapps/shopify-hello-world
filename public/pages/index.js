import React from 'react';
import { Page, Layout, Card } from '@shopify/polaris';
import getMsg from '../utils/i18n';

class Index extends React.Component {

    render() {
        let locale = this.props.locale;
        return (
            <Page>
                <Layout>
                    <Layout.Section>
                        <Card title={getMsg(locale, 'welcome')} sectioned subdued>
                            {this.props.shop &&
                                <p>Shop ID: {this.props.shop.id}</p>
                            }
                        </Card>
                    </Layout.Section>
                </Layout>
            </Page>
        )
    }
}

export default Index;
