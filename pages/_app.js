import App from 'next/app';
import Head from 'next/head';
import Cookies from 'js-cookie';

import { AppProvider } from '@shopify/polaris';
import '@shopify/polaris/styles.css';

import Loading from './loading';

class MyApp extends App {

    constructor(props) {
        super(props);

        const shopOrigin = Cookies.get('shopOrigin');
        const locale = Cookies.get('locale');
        const accessToken = Cookies.get('accessToken');
        const initialized = Boolean(shopOrigin && locale && accessToken);
        this.state = {
            initialized: initialized,
            shopOrigin: initialized && shopOrigin,
            locale: initialized && locale.substr(0, 2),
            accessToken: initialized && accessToken
        };
    }

    async componentDidMount() {
        if (this.state.initialized) {
            const response = await fetch('/api/shop');
            const responseJson = await response.json();
            this.setState((state) => {
                state.shop = responseJson.shop;
                return state
            })
        }
    }

    render() {
        const { Component, pageProps } = this.props;
        return (
            <React.Fragment>
                <Head>
                    <title>Hello World App</title>
                    <meta charSet="utf-8" />
                </Head>
                {this.state.shop ? (
                    <AppProvider
                        shopOrigin={this.state.shopOrigin}
                        apiKey={API_KEY}
                        forceRedirect
                    >
                        {this.state.shop ? (
                            <Component {...{...pageProps, locale: this.state.locale, shop: this.state.shop}} />
                        ) : (
                            <Loading />
                        )}
                    </AppProvider>
                ) : (
                    <p style={{color: 'red'}}>Application not initialized properly. Go to <b>/shopify?shop=&lt;your_shop&gt;</b> to authenticate this application with your shop.</p>
                )}
            </React.Fragment>
        );
    }
}

export default MyApp;
