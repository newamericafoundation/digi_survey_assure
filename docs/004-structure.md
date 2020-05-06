---
title: Application Structure
---

<div class="navFlow">
  <div class="next"><a href="005-installation.html">Installation &raquo;</a></div>
  <div class="previous"><a href="003-features.html">&laquo; Features</a></div>
</div>

# Application Structure

*An overview of the components and libraries that comprise the functional application.*

## Front End

**Survey Dashboard**

The user-facing front end was developed in React, with support from open-source libraries like [Chartjs](https://www.chartjs.org/) and [Foundation Icon](https://zurb.com/playground/foundation-icon-fonts-3) fonts.

**Administrative Layer**

The admin layer has been fully integrated into the front end experience, also using React.

**Audit Layer**

Blockchain information for data points, hashes and metadata use a Merkle tree structure

## Plugins

**Data Source APIs**

Platform specific support for the data source connection, in this instance [Qualtrics](https://www.qualtrics.com/), to retrieve survey responses. 

**Normalizers**

Formats  the incoming source data for visualization and recording on chain.

**Visualizers**

Handles the conversion of data into a visual format, currently via an in this instance an integration with [Chartjs](https://www.chartjs.org/), to display question bar and pie charts.

**Composite Formulas**

Custom formulas for applying to composites. This instance supports standard averages, and mean averages with cut offs for weighted data.

## Blockchain

**General Interaction**

The [EtherJS](https://docs.ethers.io/ethers.js/html/) library provides the main point of connectivity to the Blockchain through Infura, without having to stand up a new node.

**Infura**

We used [Infura](https://infura.io/) for HTTPS connection support between the application and Blockchain.

**MetaMask**

[MetaMask](https://metamask.io/) was used for managing the Eth currency that is used to fund transaction costs when data is being recorded on chain.


## Infrastructure & Dependencies

**Hosting**

Any modern cloud based platform, like [Heroku](https://devcenter.heroku.com/articles/config-vars) or [AWS](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/environments-cfg-softwaresettings.html#environments-cfg-softwaresettings-console), with support for NodeJS can be used to host the main application.

**Survey Data Storage**

In this instance data for visualization is stored in Postgres.

**Tools**

[Chartjs](https://www.chartjs.org/) and [Foundation Icons](https://zurb.com/playground/foundation-icon-fonts-3) were the two external open-source libraries used.


## Application Logic

**User Interface**

  * Users can access a platform for a survey topic to see all the survey responses visualized in charts and composite summaries. The user can audit and validate the data presented by drilling down to a layer with the blockchain hash information.

**Business Logic**

  * The platform has a data agnostic plugin structure to give greater flexibility in the data sources and APIs it can connect to, intake and support. In the pilot iteration, Qualtrics was used. Additionally there is plugin support for calculations and summary composites to make the responses more dynamic when visualizing key metrics or points of interest.
  * The system is designed for accessibility. The plugin structure allows for expanded development to include other popular survey platforms like Google Forms and Survey Monkey.
  * Visualization can be expanded through adding support for display formats and charting libraries, allowing for more types of business data to appear in the application.

**Blockchain Layer**

  * The benefits of integrating with Blockchain allow for the platform to be transparent, immutable and auditable. This gives the data added value and integrity as well as peace of mind for the participants supplying their responses.

**Data Flow**

  * The method in which data is recorded to Blockchain, by use of the Merkle tree structure, allows for more dynamic representation and deeper auditing of the data. This flexibility allows for support for both archived and live, ongoing surveys to have a clearly defined, well organized hashing structure and associated metadata.

**Costs**

  * If deploying to the Ethereum Mainnet you can expect to incur costs when (1) the contract is deployed and (2) when a survey response is registered. The exact cost in FIAT currency varies depending on the value of ETH relative to FIAT, but when testing was done on April 27th, 2020, with the cost of ETH at roughly $193 (usd), 440 responses were hashed and sent to a contract and averaged ~$0.017 per transaction (one transaction = one survey response). This cost is situational and we recommend using a gas station tool online for a better indicator of your potential costs, but in the above scenario, 440 x $0.017 = ~$7.48.

  * Note that all transactions will contain roughly the same data size in bytes, 
consisting of a numeric survey response ID and a 65 character Merkle root.
  * Web hosting costs, for the purpose of deploying Survey Assure, will vary based upon the overall needs of the organization.  Services like Heroku or AWS over a variety of support tiers that can be tailored for specific needs.  For the purpose of conducting functional/unit testing of the application we utilized Heroku’s “Hobbyist Tier”, which runs about $7/month and provides database storage up to around 10,000 records. For more robust testing and larger database storage we upgrades to one of their many enterprise tiers for a cost of around $25-$50/month. By way of comparison, AWS has similar tiers and pricing structures.

<div class="navFlow navBottom">
  <div class="next"><a href="005-installation.html">Installation &raquo;</a></div>
  <div class="previous"><a href="003-features.html">&laquo; Features</a></div>
</div>
