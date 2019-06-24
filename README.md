# shopify-hello-world
Shopify expressjs hello world application with the following functionality so far:
* Shopify OAuth flow compliant (can be installed in a shop)
* Authorizes in online mode, that is, information about current admin user is available
* Performs query against Shopify RESTful Admin API
* Installs JS script that gets executed in the frontend store on load event
* Start, stop and restart bash-based lifecycle events making the app ready to use in production
* AWS CodePipeline hooks working with bash-based lifecycle events

## Technology Stack
* Web framework: Express (https://expressjs.com)
* Frontend framework: Next.js (https://nextjs.org/)
* Frontend React library: Polaris (https://polaris.shopify.com/)

## Installation
1. Clone the project from https://github.com/biscuitapps/shopify-hello-world.git
2. Go to ```shopify-hello-world directory```
3. Execute ```npm install```

## Usage
* Start in development mode: ```npm run dev```
* Build: ```npm run build```
* Start in production mode: ```npm run start``` or ```bin/service start```

## License
    MIT License

    Copyright (c) 2019 Jacek Mech

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
