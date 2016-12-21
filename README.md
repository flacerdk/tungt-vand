# Tungt vand

This is a (partially) improved, mobile-friendly version of the website
for [Den Danske Ordbog (DDO)](http://ordnet.dk/ddo).

Try the service [here](http://tungt-vand.maskd.dk).

## Setup

Install the dependencies with `npm install` and run the server with `npm start`.

At the moment, using the website requires installing
the [React client](https://github.com/flacerdk/tungt-vand-client).

## Rationale

I'm learning Danish and DDO is a very valuable resource for me. However, using
it with a phone is less than optimal: their website is really only intended for
desktops, and their app doesn't provide some information I often check (most
importantly, pronunciation). So I decided to make my own interface, by checking
DDO and parsing the response.

This might seem overblown, but this preliminary version is already immensely
helpful to me.

## TODO

Not all useful elements are parsed yet, and the styling and layout need some
adjustments. These are my priorities right now. 

I was originally considering a mobile app (possibly using React Native), but it
turns out that the website already works pretty well, so I haven't done anything
in that front yet. I still plan to do it eventually, because I could do more
interesting things with the phone's features: local storage, integration with
Anki, etc.
