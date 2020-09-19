---
title: "Website development on HTTPS"
date: "2019-01-04T20:33:32+05:30"
---
Long gone are the days when https for websites was a curiosity; reserved only for the checkout page. Encryption is the norm now.
<!--more-->

But as creators, we never bothered with https for our local website development. (That is on our own computer, while we're working on the foundations and stuff.)
In fact, it was a burden. We cannot get "real" https certificates on our
local workstations. We have to create our own.

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

{{< highlight bash >}}
easyrsa init-pki
easyrsa build-ca nopass
easyrsa --req-cn=example.local gen-req example.local nopass
easyrsa --subject-alt-name='DNS:example.local,DNS:www.example.local'  \
    sign-req server example.local
{{< /highlight >}}

### 2. Trust the fake

We have to let our computer believe this is all bonafide https infrastructure.

{{< highlight bash >}}
# Place our CA certificate where the computer will find it
sudo ln -s ~/pki/ca.crt /usr/local/share/ca-certificates/$HOST.crt

# Refresh the list of Certificate Authorities.
# This should show a message that one certificate was added:
#     Adding debian:$HOST.pem
sudo update-ca-certificates --fresh
{{< /highlight >}}

Chrome and Firefox need to have this certificate imported separately. This is a button in the preferences.

### 3. Encrypt all the things

To switch from http to https, we need a certificate and a key, exactly
like in the real world.

The *certificate* is in `~/pki/issued/example.local.crt`.

The corresponding *key* is in `~/pki/private/example.local.key`.

Where these go depends on the software you're using.

{{< figure src="baby-elephants-3545047_1280.jpg" caption="Two elephants, cuddling." >}}
