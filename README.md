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
