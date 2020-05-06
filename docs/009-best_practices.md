---
title: Best Practices
---

<div class="navFlow">
  <div class="next"><a href="998-contributing.html">Contributing &raquo;</a></div>
  <div class="previous"><a href="008-faq.html">&laquo; FAQ</a></div>
</div>

- [Best Practices](#best-practices)
  - [Separate live and test surveys](#separate-live-and-test-surveys)
  - [Start on a testnet, transition to mainnet (if required)](#start-on-a-testnet-transition-to-mainnet-if-required)
  - [Build composites AFTER a survey has been closed](#build-composites-after-a-survey-has-been-closed)
  - [Avoid importing large data sets in favor of real-time data populating](#avoid-importing-large-data-sets-in-favor-of-real-time-data-populating)
- [Getting Started](#getting-started)
  - [Logging In As An Admin](#logging-in-as-an-admin)
- [Performance Tips](#performance-tips)
- [Estimating Blockchain Costs](#estimating-blockchain-costs)
- [Data Sources](#data-sources)
  - [Important Note About Webhooks](#important-note-about-webhooks)
- [Rate Limiting](#rate-limiting)
- [API Response Internal Response Codes](#api-response-internal-response-codes)
  - [Success Codes](#success-codes)
  - [Error Codes](#error-codes)
- [Caching](#caching)
- [Benchmarks](#benchmarks)
  - [Get Survey Data (Light Work Load)](#get-survey-data-light-work-load)
  - [Calculate Composite (Heavy Work Load)](#calculate-composite-heavy-work-load)
    - [Uncached Composite](#uncached-composite)
    - [Cached Composite (DB strategy)](#cached-composite-db-strategy)

# Best Practices

## Separate live and test surveys

We do not recommend sending "test" responses from a survey that will be used to process actual responses. This will skew the data and cost ETH when writing to the blockchain. If you can't separate test and live surveys, the app does offer the ability to programmatically exclude some responses based on their content. Take a look at `api/plugin/normalizer/qualtrics/data/exclude.ts` for an example.

## Start on a testnet, transition to mainnet (if required)

We highly recommend using a Testnet to start. This will allow you to process responses without using actual ETH. Once you are comfortable with how the application is running, you can re-deploy using testnet configuration.

## Build composites AFTER a survey has been closed

Please see the FAQ question "Composites are taking a while to calculate - why?" for details.

## Avoid importing large data sets in favor of real-time data populating

If possible, users should use this tool as a net-new tool, meaning real-time over importing. Importing is costly and time consuming and should only be done if absolutely required.


# Getting Started

## Logging In As An Admin

- Direct your web browser to the location where you deployed the app and go to `https://yoursite.com/#/auth`.
- Log in using the username/password you established in your configuration.
- You should now see a "Settings" link as well as blue "action buttons" appear throughout the app.

# Performance Tips

- Always use a caching stategy to ensure that complex calculations don't slow down the application.
- When a survey has been completed, "close" the survey to ensure that we can safely cache everything.
- While the application is generally mobile-friendly, we recommend using a desktop for all administrative tasks.

# Estimating Blockchain Costs

If deploying to the Ethereum Mainnet you can expect to incur costs when (1) the contract is deployed and (2) when a survey response is registered. The exact cost in FIAT currency varies depending on the value of ETH relative to FIAT, but when testing was done on April 27th, 2020, with the cost of ETH at roughly $193 (usd), 440 responses were hashed and sent to a contract and averaged ~$0.017 per transaction (one transaction = one survey response). This cost is situational and we recommend using a gas station tool online for a better indicator of your potential costs, but in the above scenario, 440 x $0.017 = ~$7.48. Note that all transactions will contain roughly the same data size in bytes, consisting of a numeric survey response ID and a 65 character merkle root.


# Data Sources

The application ships with integration support for [Qualtrics](https://www.qualtrics.com/), but developers can create their own data source integrations by creating a "normalizer" plugin (please see `api/plugins/normalizer`).

## Important Note About Webhooks

If you provider supports web hooks, the program will attempt to create a "listener" when you create a survey. However, if this fails, you will need to manually create this listener (from your data source directly) to ensure that data is populated in near-realtime.

Please confirm directly from your data source dashboard whether that listerner was created. You can find the correct "Listener URL" under the "Settings" page of your app.

**If this web hook was not created with your data provider you will NOT receive data in realtime.** Your only option in that case is to manually import responses from the "Settings" page.


# Rate Limiting

Rate limiting is commented out by default. If you wish to turn this on, you'll need to uncomment the code within the `index.ts` file and restart/rebuild.


# API Response Internal Response Codes

The system uses standard HTTP status codes for API replies. On top of that, an internal code is sent that can be used to indicate a specific error.

## Success Codes

- **S001**: Success.
- **S002**: Success (data retrieved from cache).

## Error Codes

- Please see the `frontend/src/localize` language files for details. All internal error codes start with the letter "E" followed by three digits (example: "E010").


# Caching

For simplicity, the application defaults to database-level caching, however tools are available for anyone wishing to use a higher level caching tool like Redis. To activate this strategy:

- `CACHE_SERVICE=redis`
- `REDIS_URL=redis://localhost:6379`
- If you are using docker, uncomment Redis-related code within your docker-compose.yml file.

Due to the nature of lookups from memory, Redis will always be faster than using a database, but in most cases it will not be noticeable. We only recommend using Redis if you anticipate very high traffic.



# Benchmarks

Standard load testing was performed on a variety of API endpoints. API server used had a "2.6GHz Intel Core i7" processor with "16GB 2400 MHz DDR4" RAM.

## Get Survey Data (Light Work Load)

| Concurrent Connections | Total Requests | Time Span  | Average Latency | Latency Range |
| ---------------------- | -------------- | ---------- | --------------- | ------------- |
| 10                     | 13,000         | 10 seconds | 7.17ms          | 5-32.66ms     |

## Calculate Composite (Heavy Work Load)

Using an "average" formula composite with 12 numerators on a survey which had 656 responses.

### Uncached Composite

| Concurrent Connections | Total Requests | Time Span  | Average Latency | Latency Range |
| ---------------------- | -------------- | ---------- | --------------- | ------------- |
| 10                     | 2,000          | 10 seconds | 52.35ms         | 37-194.04ms   |

### Cached Composite (DB strategy)

- Demonstrates a 3.5x improvement in throughput with an average latency reduction of 73.4%.

| Concurrent Connections | Total Requests | Time Span  | Average Latency | Latency Range |
| ---------------------- | -------------- | ---------- | --------------- | ------------- |
| 10                     | 7,000          | 10 seconds | 13.95ms         | 9-57.29ms     |


<div class="navFlow navBottom">
  <div class="next"><a href="998-contributing.html">Contributing &raquo;</a></div>
  <div class="previous"><a href="008-faq.html">&laquo; FAQ</a></div>
</div>