+++
showonlyimage = false
date = "2019-01-04T20:33:32+05:30"
title = "Website development on HTTPS: be your own GoDaddy"
draft = false
+++

Long gone are the days when https for websites was a curiosity;
reserved only for the checkout page. Encryption is the norm now.

But as creators, we never bothered with https when developing something.
In fact, it was a burden. We cannot get "real" https certificates on our
local workstations. We have to create our own.
<!--more-->

So let's fake being a huge provider like Go Daddy! When it all works,
maybe we get to [shoot some elephants](https://gawker.com/5787676/meet-godaddys-ridiculous-elephant-killing-ceo) too!

> These instructions are for a Debian/Ubuntu workstation.

## Becoming a Certificate Authority

What we want: to create https for any random domain we need. We can just be
bothered with a one-time setup, but we need zero friction for individual
websites. We have to become a _Certificate Authority_.

I've tried many variations, and this is the fastest way by far:

### 1. EasyRSA

It's a script that automates all the painful cryptic stuff. [Download it.](https://github.com/OpenVPN/easy-rsa/releases)

Say we want to https-ify **www.example.local**. Behold, the magic:

```
easyrsa init-pki
easyrsa build-ca nopass
easyrsa --req-cn=example.local gen-req example.local nopass
easyrsa --subject-alt-name='DNS:example.local,DNS:www.example.local'  \
    sign-req server example.local
```

### 2. Trust the fake

We have to let our computer believe this is all bonafide https infrastructure.

```
# Place our CA certificate where the computer will find it
sudo ln -s ~/pki/ca.crt /usr/local/share/ca-certificates/$HOST.crt

# Refresh the list of Certificate Authorities.
# This should show a message that one certificate was added:
#     Adding debian:$HOST.pem
sudo update-ca-certificates --fresh
```

### 3. Encrypt all the things

To switch from http to https, we need a certificate and a key, exactly
like in the real world.

The *certificate* is in `~/pki/issued/example.local.crt`.

The corresponding *key* is in `~/pki/private/example.local.key`.

Where these go depends on the software you're using.

![Two elephants, cuddling.][1]

[1]: /img/portfolio/baby-elephants-3545047_1280.jpg
