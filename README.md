# Escape
### Note
A ~small~ _small my a##_ way too big project that i picked up somewhere

## Why?
I had the opportunity to better my grade a little and we had "We Were Liars", so i decided to theme an escape room after the novel.  
And because i watched too much [GameTheory](https://www.youtube.com/channel/UCo_IB5145EVNcf8hw1Kku7w) i just had to include an ARG.  
<sup>*i really have a problem with free time..*</sup>  

## What?
Its a [Phaser.js](phaser.io) web application

## How?
I currently host it locally with the php dev server  
and with a hotspot by hostapd and dns/dhcp with dnsmasq

## To-Do
### Logic
- [ ] TerminalUI #1
  - [ ] prompt
  - [ ] commands
- [ ] hallway doors #2
  - [ ] sprites
  - [ ] states
  - [ ] interactions
- [ ] inventory
  - [ ] animations
  - [ ] item interactions
- [ ] refine item class
### Assets
- [ ] gats room
- [ ] level 3
  - [ ] newer mansion
  - [ ] flashback effects (old mansion burning)
- [ ] background
  - [ ] sky
  - [ ] beach
- [ ] crates
- [ ] chest/box
- [ ] safe
### ARG
- [ ] glitching assets
- [ ] broken items
- [ ] hints

## Encryption
Most of the encrypted text went through one of [these](https://gchq.github.io/CyberChef/#recipe=XOR(%7B'option':'Hex','string':'af'%7D,'Standard',false)To_Hex('Space',0)Bit_shift_left(3)Rotate_right(2,false)Raw_Deflate('Dynamic%20Huffman%20Coding')&oeol=CR) algorithms.  
I used mostly used [CyberChef](https://gchq.github.io/CyberChef/) for these things and php for sometimess appearing or changing secrets.
