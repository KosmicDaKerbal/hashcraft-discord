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


# Configuring Environment Variables
The bot has a significant amount of environment variables for customization, this means anyone can apply their own branding and use it as their own faucet!

Before compiling, make sure you have two files in the source folder: `db.env` and `.env`.

I have provided a `.env.example` file and a `db.env.example` file, to explain all the environment variables used.<br>
The `.env` file contains the environment variables for the bot, while `db.env` contains environment variables for the bot's Database, which is MariaDB.<br>
Make sure you create the environment variables file, otherwise the bot will refuse to start, and make sure you add the parameters EXACTLY as mentioned, or the bot may not work properly.


# Build & Deploy Instructions (Linux):
<br>Instructions to build and deploy the bot are so easy, thanks to Docker!
1. Clone the repository: `git clone https://github.com/KosmicDaKerbal/hashcraft-discord.git`
2. Locate to the repository folder: `cd ~/hashcraft-discord`
3. Create `.env` and `db.env` and specify all environment variables.
4. Build Docker image ([Make sure you have Docker Installed](https://docs.docker.com/desktop/install/linux-install/)): `docker build -t <image name> .`
5. Deploy with Docker Compose: `docker compose up -d`
6. Your bot should be alive! Now, before you run any commands, you need to setup your database structure properly. Follow the instructions below.

### The Docker Compose installs two new images: MariaDB and PHPMyAdmin. This will allow you to manage your bot's database through a browser on port 8090.

# Database Table Structure (VERY IMPORTANT)
### WARNING: This is a <u>CRITICAL</u> step. If the table and columns are not configured properly, the bot WILL FAIL to make database queries.

Table construction instructions:
1. In the PHPMyAdmin Home Page, under the databases section, you will see the name of your database which you configured in the `db.env` file.
2. Create a new table named `Faucet` with 6 columns with the following labels: `userid`, `wallet_name`, `last_used`, `claims`, `streak` and `mdu_bal`, or you can use the following command in your MariaDB CLI:<br>
```
CREATE TABLE Faucet (userid BIGINT NOT NULL , wallet_name VARCHAR(32) NULL DEFAULT NULL , last_used DATE NULL DEFAULT NULL , claims SMALLINT UNSIGNED NOT NULL DEFAULT '0' , streak SMALLINT UNSIGNED NOT NULL DEFAULT '1' , mdu_bal INT(10) UNSIGNED NOT NULL DEFAULT '0', PRIMARY KEY (userid) ) ENGINE = InnoDB;
```
Replace <db-name> with the name of your database.

<br>
3. Each column has the following data structure:

You do not need to do this if you have configured using CLI.

| Column Name   | Item Type | Default Value | Properties | Primary Key |
| :---:         |     :---:   |       :---: |     :---:     |       :---:   |
| `userid`      | BIGINT      | None        | N/A     | ✓    |
| `wallet_name` | VARCHAR(32) | NULL        | NULLABLE       | -      |
| `last_used`   | DATE        | NULL        | NULLABLE       | -      |
| `claims`      | SMALLINT    | 0           | UNSIGNED, NON NULLABLE       | -      |
| `streak`      | SMALLINT    | 1           | UNSIGNED, NON NULLABLE       | -      |
| `mdu_bal`     | INT(10)     | 0           | UNSIGNED, NON NULLABLE       | -      |



4. Save the table and exit.
5. Now, you can use all the commands without issues!
