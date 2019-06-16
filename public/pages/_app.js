import App from 'next/app';
import Head from 'next/head';
import Cookies from 'js-cookie';

import { AppProvider } from '@shopify/polaris';
import '@shopify/polaris/styles.css';

import Loading from './loading';
import Error from './error';

class MyApp extends App {

    constructor(props) {

        super(props);

        const shopOrigin = Cookies.get('shopOrigin');
        const locale = Cookies.get('locale');
        const accessToken = Cookies.get('accessToken');
        const configured = Boolean(shopOrigin && locale && accessToken);

        this.state = {
            loaded: false,
            configured: configured,
            shopOrigin: shopOrigin,
            locale: locale && locale.substr(0, 2),
            accessToken: accessToken
        };
    }

    async componentDidMount() {

        if (this.state.configured) {
            const response = await fetch('/api/shop');
            const responseJson = await response.json();
            this.setState((state) => {
                state.loaded = true;
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

                <AppProvider
                >
                    {process.browser ? (
                        <p>
                            {this.state.configured ? (
                                <p>
                                    {this.state.loaded ? (
                                        <Component {...{...pageProps, locale: this.state.locale, shop: this.state.shop}} />
                                    ) : (
                                        <Loading />
                                    )}
                                </p>
                            ) : (
                                <Error msg='Application not configured properly. Go to /shopify?shop=&lt;your_shop&gt; to authenticate this application with your shop.' />
                            )}
                        </p>
                    ) : (
                        <Loading />
                    )}
                </AppProvider>
            </React.Fragment>
        );
    }
}

export default MyApp;
