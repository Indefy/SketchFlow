#!/bin/bash

# Configuration
VPS_USER="your-username"
VPS_HOST="your-vps-ip"
DEPLOY_PATH="/var/www/sketchflow"
APP_NAME="sketchflow"

# Build the application locally
echo "Building application..."
npm run build

# Create deployment directory on VPS
echo "Creating deployment directory..."
ssh $VPS_USER@$VPS_HOST "sudo mkdir -p $DEPLOY_PATH"

# Copy the built files to VPS
echo "Copying files to VPS..."
scp -r dist/* $VPS_USER@$VPS_HOST:$DEPLOY_PATH/

# Copy Nginx configuration
echo "Setting up Nginx configuration..."
scp sketchflow.nginx.conf $VPS_USER@$VPS_HOST:/tmp/$APP_NAME.nginx.conf
ssh $VPS_USER@$VPS_HOST "sudo mv /tmp/$APP_NAME.nginx.conf /etc/nginx/sites-available/$APP_NAME.conf"

# Create symbolic link to enable the site
ssh $VPS_USER@$VPS_HOST "sudo ln -sf /etc/nginx/sites-available/$APP_NAME.conf /etc/nginx/sites-enabled/"

# Set proper permissions
ssh $VPS_USER@$VPS_HOST "sudo chown -R www-data:www-data $DEPLOY_PATH"

# Test Nginx configuration and reload
ssh $VPS_USER@$VPS_HOST "sudo nginx -t && sudo systemctl reload nginx"

echo "Deployment completed!"
