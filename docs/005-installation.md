---
title: Installation
---

<div class="navFlow">
  <div class="next"><a href="006-administration.html">Administration &raquo;</a></div>
  <div class="previous"><a href="004-structure.html">&laquo; Structure</a></div>
</div>

- [Installation](#installation)
  - [Server Requirements](#server-requirements)
  - [1. Clone the Github Repo](#1-clone-the-github-repo)
  - [2. Create your `.env` Files](#2-create-your-env-files)
  - [3. Blockchain Setup](#3-blockchain-setup)
    - [Setting Up A Provider](#setting-up-a-provider)
    - [Using a Custom Infura Account](#using-a-custom-infura-account)
    - [Setting Up Your Wallet](#setting-up-your-wallet)
      - [A Note About Your Wallet's Balance](#a-note-about-your-wallets-balance)
      - [Metamask](#metamask)
      - [Testnet Faucets](#testnet-faucets)
    - [Deploying Your Contract](#deploying-your-contract)
      - [Update your `.env` file](#update-your-env-file)
      - [Run the Deploy Command](#run-the-deploy-command)
  - [4. Configuration Setup](#4-configuration-setup)
    - [Update Your `.env` Files](#update-your-env-files)
    - [Configuring Data Source Credentials](#configuring-data-source-credentials)
      - [Qualtrics](#qualtrics)
    - [A Note About Deploying to PaaS Services (Config Values)](#a-note-about-deploying-to-paas-services-config-values)
  - [5. Deploying](#5-deploying)
    - [Docker](#docker)
    - [Manually Building and Deploying](#manually-building-and-deploying)
      - [Postgres](#postgres)
      - [Frontend](#frontend)
        - [Install Dependencies](#install-dependencies)
        - [Create a Build](#create-a-build)
      - [API](#api)
        - [Install Dependencies](#install-dependencies-1)
        - [Create a Build](#create-a-build-1)
    - [Heroku Example](#heroku-example)

# Installation

## Server Requirements

- [NodeJS 10.16+](https://nodejs.org/en/download/)
- [Postgres 12.2+](https://www.postgresql.org/download/)

## 1. Clone the Github Repo

The GitHub repo for the project can be found <a href="https://github.com/newamericafoundation/digi_survey_assure" target="_blank">here</a>. You'll need to clone this locally before you begin.

To do this, use a CLI tool (for example "Terminal" on Mac), navigate to the directory where you want the project to live (`cd path/to/survey_assure`), and close the repo using:

```
git clone https://github.com/newamericafoundation/digi_survey_assure.git digi_survey_assure .
```

If your machine doesn't have git installed, please refer to this <a href="https://git-scm.com/book/en/v2/Getting-Started-Installing-Git" target="_blank">documentation</a>.

## 2. Create your `.env` Files

In both `/api` and `/frontend`, make a copy of `.example.env` and rename them to `.env`. You will be editing these throughout the setup process.

## 3. Blockchain Setup

### Setting Up A Provider

The application uses [EtherJS](https://docs.ethers.io/ethers.js/html/) for all interactions with the Blockchain. EtherJS comes with a default provider that connects to both Etherscan & Infura simultaneously, thereby negating the need for you to run a node. In most cases, we recommend that you use this provider, however if you want to set up your own provider you are welcome to do so.

### Using a Custom Infura Account

While not required, if you choose to set up your own [Infura](https://infura.io/) account, you can do so from their website and then update the following config options on your `api/.env` file before deploying your contract:

```
INFURA_PROJECT_ID
INFURA_PROJECT_SECRET
```

Creating your own Infura account gives you the added benefit of statistics around your calls to the Blockchain.

### Setting Up Your Wallet

In order to properly utilize the Blockchain for survey responses, you will need to be able to fund transactions. As such, you will need to provide the application with a private key for a wallet you own. We recommend creating a dedicated wallet using [Metamask](https://metamask.io/) for this task. Please see their documentation for information on how to export your key once you've created a wallet.

Once exported, open the `api/.env` file and update this config value:

```
BLOCKCHAIN_WALLET_PRIVATE_KEY
```

#### A Note About Your Wallet's Balance

You will need to manually manage your wallet and ensure that it always has an acceptable balance (Survey Assure does not do this for you). Failure to do so will result in rejected Blockchain requests. Please see the "Estimating Blockchain Costs" section for a general guide on anticipated costs.

#### Metamask

Metamask provides extensions for various web browsers, such as Chrome. [Download](https://metamask.io/download.html) and install Metamask in your browser of choice.

Once installed, you will need to fund your wallet. To fund your wallet, you can use a faucet (if you are using a Testnet) or you can send ETH from another source to your Metamask wallet (if you are using the Mainnet).

**If you are using the Ethereum Mainnet and need to purchase ETH, please ensure that you only purchase ETH from [reputable sources](https://docs.ethhub.io/using-ethereum/how-to-buy-ether/).** Refer to the "Estimating Blockchain Costs" below for more information on expected costs.

#### Testnet Faucets

Faucets allow you to acquire a small amount of "testnet ETH". [Click here](https://docs.ethhub.io/using-ethereum/test-networks/) for information on the differences between the various testnets. Recommended Ethereum Testnets:

- [Kovan](https://faucet.kovan.network/)
- [Rinkeby](https://www.rinkeby.io/#faucet)
- [Ropsten](https://faucet.ropsten.be/)

Others exist but will need to be integrated with Infura to work out-of-the-box with the platform. If you choose to integrate directly with your custom node, you will need to create a [JsonRpcProvider](https://docs.ethers.io/ethers.js/html/api-providers.html) from within the `api/src/service/blockchainService.ts` service.

### Deploying Your Contract

#### Update your `.env` file

Now that you have selected a network to deploy on and have found your private key in Metamask, you will need to open your `api/.env` file and update the following config value:

- `BLOCKCHAIN_PROVIDER_NETWORK`: Set this to the name of your desired network.

#### Run the Deploy Command

**Important Note:** You should do this *locally* and *before* you deploy your application to your web server (Survey Assure needs your contract address for configuration reasons).

To deploy your contract, you will need to run the following command using a command line tool running from the `api` folder within the project:
- `npm run bc:deploy` 

You should see something like the following on your screen once successful:

```
--- Your Contact Address ---> YOUR_CONTRACT_ADDRESS_HERE
--- Your transaction hash ---> YOUR_TX_ID_HERE
```

Copy the value of `YOUR_CONTRACT_ADDRESS_HERE` into your `api/.env` file under the `BLOCKCHAIN_CONTRACT_ADDRESS` config option.

You are now ready to deploy the application to your web server. If the application throws an error, you will need to double check all of your Blockchain config values to ensure that they are correct and try again.

## 4. Configuration Setup

### Update Your `.env` Files

Open your new `.env` file and update your environment variables according to your desired configuration (follow the comments within each `.env` file for information on what each config value represents.).

**Important: Never commit the `.env` file to a git repository and keep its contents secret at all times!**

You will need to edit two `.env` files:
- `frontend/.env`
- `api/.env`

### Configuring Data Source Credentials

The application reserves five config variables for integrating with various data sources. Please see this guide on which you will need to update for each provider:

#### Qualtrics

```
SURVEY_DATA_PROVIDER_URL=https://DATACENTER_ID_HERE.qualtrics.com/API/v3
SURVEY_DATA_PROVIDER_CRED1=YOUR_API_KEY_HERE
```

- [Locating your data center ID](https://api.qualtrics.com/docs/base-url-and-datacenter-ids)
- [Locating your API key](https://api.qualtrics.com/docs/api-key-authentication)


### A Note About Deploying to PaaS Services (Config Values)

If you are deploying to a PaaS platform like [Heroku](https://devcenter.heroku.com/articles/config-vars), [Netlify](https://docs.netlify.com/configure-builds/environment-variables/) or [AWS Elastic Beanstalk](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/environments-cfg-softwaresettings.html#environments-cfg-softwaresettings-console) without using Docker, you will need to manually input all environment variables into those platforms directly before deploying. In other words, your `.env` file only matters for Docker and local deployments.

## 5. Deploying

A number of options are available to you when it comes to deploying the application. Please select the strategy which best fits your business needs.

### Docker

The tool comes with Docker Compose, allowing you to build all needed components automatically. Run `docker-compose up` to build the images and launch the app. Please see the `docker-compose.yml` file for information on ports, etc.. By default the app is exposed on port 4000 (`http://localhost:4000`).

If you choose to use Docker, please see your respective cloud service for information on deploying Docker-based applications.

### Manually Building and Deploying

The app is effectively two apps in one: a Koa-based API and a ReactJS-based frontend. When manually deploying (or developing locally), you will need to build and deploy both.

#### Postgres

You will need [Postgres](https://www.postgresql.org/) running locally before the application will work. Postgres is free and open source.

Once running, create a database that the application can use. An example (which is actually used by Docker for the production build) can be found within the `api/db/init.sql` file.

Once your database is set up, update your `api/.env` file with the correct connection details.

```
PGDATABASE
PGHOST
PGPASSWORD
PGPORT
PGUSER
````

#### Frontend

The frontend uses [React Create App](https://github.com/facebook/create-react-app); please see their documentation for a more in-depth guide.

##### Install Dependencies

- Before building, run `npm install`.

##### Create a Build

- Production build: `npm run build`
  - Development build (real-time rebuilds): `npm start`

Once you run the production build command, your app will be automatically served as a static route from the API. AFTER building and starting the API, simply point your browser to the designated port within the API's config (defaults to 4000) to see your app in action (`http://localhost:4000/`).

#### API

##### Install Dependencies

- Before building, run `npm install`.

##### Create a Build

- Production build: `npm run build`
  - Development build (real-time rebuilds): `npm run build:watch`
- Run your database migrations: `npm run db:migrate`
- Start your App: `npm start`

You are now ready to go!

### Heroku Example

The following example is not an endorsement of Heroku over other platforms, but rather a practical example of the above steps for a real-world platform. The process would be *very* similar for other PaaS providers.

- In Heroku, create two separate apps, one for the API (buildpack = heroku/nodejs), one for the frontend (buildpack = https://github.com/mars/create-react-app-buildpack).
- For the API, provision a "Heroku Postgres" add-on.
- For both apps, copy the contents of the respective local `.env` files to the respective Heroku app configs under "Settings > Reveal Config Vars" in Heroku. Make changes as necessary, keeping in mind that Heroku will automatically set `DATABASE_URL` for you once the database is provisioned, so you should not manually add it. Also note that you will need to use `DATABASE_USE_SSL=true` to connect to Heroku Postgres.
- For both the frontend and API, follow the instructions provided within Heroku under "Deploy > Deploy using Heroku Git" to push your code to Heroku.
- You should now be live!

<div class="navFlow navBottom">
  <div class="next"><a href="006-administration.html">Administration &raquo;</a></div>
  <div class="previous"><a href="004-structure.html">&laquo; Structure</a></div>
</div>
