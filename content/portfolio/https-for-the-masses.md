+++
date = "2019-08-29T22:46:32+05:30"
draft = false
title = 'HTTPS for the masses'
image = ""
showonlyimage = false
+++

Remember that post where I showed you [how to easily run https on your
local development server](https://www.spacebabies.nl/portfolio/https-for-development-custom-certificate-authority/)? Well, it just got easier.

<!--more-->

Here is the full recipe, from raw ingredients to delicious baked https.

## 1: Download mkcert

All that boring and error-prone mucking with certificates got automated into
a single command. What's not to love? Head on over to [mkcert](https://github.com/FiloSottile/mkcert) and follow the
installation instructions. I chose to download the binary (on Linux):

```
mkdir -p $HOME/.local/mkcert
wget -P $HOME/.local/mkcert \
  https://github.com/FiloSottile/mkcert/releases/download/v1.4.0/mkcert-v1.4.0-linux-amd64
chmod +x $HOME/.local/mkcert/mkcert-v1.4.0-linux-amd64
ln -s -t $HOME/.local/mkcert/mkcert-v1.4.0-linux-amd64 $HOME/.local/bin/mkcert
```

I have `$HOME/.local/bin` in my PATH, and so should you.

## 2: Generate the Certificate Authority

We need an additional package to insert the certificates into Chrome:

```
sudo apt install libnss3-tools
```

Then, magic:

```
cd $HOME
mkcert -install
```

## 3: Generate key and certificate files

Your local webserver needs these.

Also magic:

```
mkcert example.local
```

# Bonus: Rails using NGINX with Passenger

As all the hard work has been away from us, there is now room for me to show
you how I like to run things locally.

- Using Virtual Hosts
- NGINX as the web server
- Passenger to run the application
- As neat and organized as possible

It goes a little something like this.

### 4: Install NGINX

```
sudo apt-get install nginx
```

You can use Apache if you want too. If you already have Apache running locally,
stop reading now and use that instead.

### 5: Install Passenger

Taken verbatim from the [documentation](https://www.phusionpassenger.com/docs/advanced_guides/install_and_upgrade/nginx/install/)

```
sudo apt-get install dirmngr gnupg

sudo apt-key adv \
  --keyserver hkp://keyserver.ubuntu.com:80 \
  --recv-keys 561F9B9CAC40B2F7

sudo apt-get install -y apt-transport-https ca-certificates

sudo sh -c \
  'echo deb https://oss-binaries.phusionpassenger.com/apt/passenger bionic main > /etc/apt/sources.list.d/passenger.list'

sudo apt-get update

sudo apt-get install -y libnginx-mod-http-passenger

if [ ! -f /etc/nginx/modules-enabled/50-mod-http-passenger.conf ]; then sudo ln -s /usr/share/nginx/modules-available/mod-http-passenger.load /etc/nginx/modules-enabled/50-mod-http-passenger.conf ; fi

sudo service nginx restart
```

### 6: Add a Virtual Host

Say we want to start developing `example.local`. I like to use _.local_ as a convention, but
you can go crazy with the name.

Create a file called `/etc/nginx/sites-available/example.local` with these contents:

```
server {
        listen 443 ssl default_server;
        listen [::]:443 ssl default_server;

        ssl_certificate certs/example.local.pem;
        ssl_certificate_key certs/example.local-key.pem;

        root /var/example.local/public;

        server_name example.local;

        passenger_enabled on;
        passenger_ruby /path/to/.rvm/wrappers/ruby-2.5.1/ruby;
        passenger_sticky_sessions on;
        passenger_app_env development;
}
```

The paths to `root` and `passenger_ruby` will be different for you.

### 7: DNS

Instead of wrestling dnsmasq or other DNS software, I manually
add the hostname I want to `/etc/hosts`. Has worked since the seventies, will probably
still work until the end of time.

```
127.0.0.1 localhost example.local
```

### 8: Take her for a spin

Enable the virtual host:

```
cd /etc/nginx/sites-enabled
ln -s ../sites-available/example.local
sudo service nginx restart
```

Restart chrome and visit https://example.local (fingers crossed).
