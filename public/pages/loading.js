import React from "react";
import { Page, Layout, Card } from '@shopify/polaris';

class Loading extends React.Component {

    render() {
        return (
            <Page>
                <Layout>
                    <Layout.Section>
                        <Card sectioned subdued>
                            <img src='/static/img/loader.gif' />
                        </Card>
                    </Layout.Section>
                </Layout>
            </Page>
        )
    }
}

export default Loading;
