---
title: IRC Chat Protocol
date: 2019-04-20 15:01:06
tags: 
    - Typescript
    - Node
---

IRC is a 30 year old chat protocol that was widely used back in the day. Creating an IRC client is surprisingly easy.

We will learn to:

- [Open a streaming socket to an IRC server (eg. irc.freenode.net:6667)](#Open-a-socket-with-the-IRC-server)
- Identify with the server
- Identify with NickServ (for freenode)
- Connect to a channel
- Send a PRIVMSG (used for both channel and user messages)
- Recieve a PRIVMSG 
- Respond to server PINGs

### Open a socket with the IRC server

```typescript
const socket = new Socket();
socket.connect(6667, "irc.freenode.net");
```

### Recieve data

```typescript
const socket = new Socket();

socket.on("data", (buffer) => {
    console.log(buffer.toString());
});

socket.connect(6667, "irc.freenode.net");
```

You should get a response like this. (Note that "hitchcock" may be different depending on which server you were load-balanced to.)

```
:hitchcock.freenode.net NOTICE * :*** Looking up your hostname...

:hitchcock.freenode.net NOTICE * :*** Checking Ident
:hitchcock.freenode.net NOTICE * :*** Couldn't look up your hostname

:hitchcock.freenode.net NOTICE * :*** No Ident response
```

### Identify with the server

Identification is simple. All commands to the IRC server take the form of: 

### Identify with NickServ (for freenode)

### Connect to a channel

### Send a PRIVMSG

### Recieve a PRIVMSG

### Respond to server PINGs

- Away messages
- Server queries
- Op commands


### References

https://en.wikipedia.org/wiki/Internet_Relay_Chat
https://tools.ietf.org/html/rfc1459#section-1.1
https://www.alien.net.au/irc/irc2numerics.html
https://tools.ietf.org/html/rfc2812