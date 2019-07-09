---
title: Error Pages for Reverse Proxied NGINX Directives
date: 2019-07-08 23:38:07
tags:
---

I use NGINX to [reverse proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/) a few of my services so that they can be reached at proper domain names (e.g. https://vaclist.net).
NGINX makes it very easy to redirect specific error codes to static pages. A common one for reverse proxy is [502 Bad Gateway](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/502), meaning the service couldn't be reached (server crashed, being upgraded, etc).

The default error page for NGINX is pretty ugly:

![502](/images/502.png)

You can easily catch these with the `error_page` server directive:

```
error_page 500 502 503 504 /server-error.html
```

Make sure to correctly set your web root and specify that the location of `/server-error.html` is `internal`.

```
    server {
        server_name <server_name>
        root <web_root>
    
        error_page 500 502 503 504 /server-error.html
        
        location /server-error.html {
            internal;
        }

        location / {
            include proxypass.conf;
            proxy_pass http://localhost:5000;
        }

    }
```