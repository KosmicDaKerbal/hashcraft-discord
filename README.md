![HashCraft Logo 1](https://github.com/user-attachments/assets/d27945d5-63db-466b-adb3-2dd0ce976cbc)
# HashCraft Discord Bot - DuinoCoin Faucet
A Duino-Coin Faucet in the form of a Discord Bot.

This is my first JavaScript Project, Specifically NodeJS. I am quite happy with how this project has become now.
<br>
### Note: The Duino-Coin API has a VPN/VPS detection system, so trying to host this bot on a VPS will return errors. It is best recommended to self-host it. I have made self hosting easier by utilising DockerFile and Docker-Compose.
System Requirements: Linux Operating System with Docker Installed, at least 512MB of RAM, at least 4GB of storage, and any Quad-Core CPU.

# Features

This faucet uses an in-system currency called mDU (Symbol: ⧈). The current conversion rate is 1 DUCO = 100 ⧈ mDU
1. Account linking: Link and Un-Link your Duino-Coin Accounts to the Bot's Database using `/link`
2. Faucet Claim: Get your daily drop of ⧈ mDU using `/claim`. The current drop amount depends on the following formula: `drop = round((1.046025869009)^n) + 10`, where `n = streak`
3. Balance Check: Check how much ⧈ mDU you have using `/balance`
4. Exchange ⧈ mDU for DUCO using `/deposit`

You can use the faucet [in the HashCraft Discord Server.](https://discord.gg/vH8fxYZcr8)
