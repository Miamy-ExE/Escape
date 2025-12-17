# Escape
### Note
A ~small~ <sup>_small my a##_</sup> way too big project that i picked up somewhere

## Why?
I had the opportunity to better my grade a little and we had "We Were Liars", so i decided to theme an escape room after the novel.  
And because i watched too much [GameTheory](https://www.youtube.com/channel/UCo_IB5145EVNcf8hw1Kku7w) i just had to include an ARG.  
<sup>*i really have a problem with free time..*</sup>  

## What?
Its a [Phaser.js](phaser.io) web application that is configured for ipads

## How?
I currently host it locally with the php dev server  
and with a hotspot by hostapd and dns/dhcp with dnsmasq

## To-Do
### Logic
- [ ] TerminalUI https://github.com/Miamy-ExE/Escape/issues/1
  - [ ] Prompt
  - [ ] Commands
- [ ] Hallway doors https://github.com/Miamy-ExE/Escape/issues/2
  - [ ] Sprites
  - [ ] States
  - [ ] Interactions
- [ ] Inventory
  - [ ] Animations
  - [ ] Item interactions
- [ ] Refine Item class
### Assets
- [ ] Gats room
- [ ] Level 3
  - [ ] Newer mansion
  - [ ] Flashback effects (old mansion burning)
- [ ] Background
  - [ ] Sky
  - [ ] Beach
- [ ] Crates
- [ ] Chest/box
- [ ] Safe
### ARG
- [ ] Glitching assets
- [ ] Broken items
- [ ] Hints

## Encryption
Most of the encrypted text went through one of [these](https://gchq.github.io/CyberChef/#recipe=XOR(%7B'option':'Hex','string':'af'%7D,'Standard',false)To_Hex('Space',0)Bit_shift_left(3)Rotate_right(2,false)Raw_Deflate('Dynamic%20Huffman%20Coding')&oeol=CR) algorithms.  
I used mostly used [CyberChef](https://gchq.github.io/CyberChef/) for these things and php for sometimess appearing or changing secrets.
