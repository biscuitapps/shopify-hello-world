import React from "react";
import { Page, Layout, Card } from '@shopify/polaris';

class Error extends React.Component {

    render() {
        return (
            <Page>
                <Layout>
                    <Layout.Section>
                        <Card sectioned subdued>
                            <p style={{color: 'red'}}>{this.props.msg}</p>
                        </Card>
                    </Layout.Section>
                </Layout>
            </Page>
        )
    }
}

export default Error;
