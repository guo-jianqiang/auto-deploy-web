#!/bin/bash

projectName=$1
port=$2
user=$3
host=$4
deployDir=$5
env=$6

nginxconfig="server {
    listen          ${port};
    server_name     localhost;
    location / {
        root    ${deployDir}/${projectName};
        index   index.html index.htm;
        try_files \$uri /index.html;
    }
}"

ssh ${user}@${host} "echo '${nginxconfig}' > /etc/nginx/conf.d/${projectName}-${env}.conf && systemctl reload nginx"