#!/bin/bash

. /home/ec2-user/.nvm/nvm.sh

sudo chown -R ec2-user /home/ec2-user/apps/shopify-hello-world
sudo chgrp -R ec2-user /home/ec2-user/apps/shopify-hello-world
chmod +x /home/ec2-user/apps/shopify-hello-world/bin/*

cd /home/ec2-user/apps/shopify-hello-world
npm install
npm run build
aws s3 cp s3://shopify-hello-world/integration.env ./.env
