---
title: Project History
---

<div class="navFlow">
  <div class="next"><a href="003-features.html">Features &raquo;</a></div>
  <div class="previous"><a href="index.html">&laquo; Introduction</a></div>
</div>

# Project History

*The genesis of this work started with an extensive discovery phase that examined the current state of workforce surveys and the concerns/issues around them.  We then looked at how blockchain technology could address some of these issues particularly around the ideas of increased security, immutability, transparency and efficiency.  Wanting our solution to be as accessible as possible to the broader community we undertook a pilot to develop an open source application that would leverage the advantages of the blockchain, enable workers and managers alike to have better insight into the results of surveys and be able to continuously evolve.*

## Stakeholders & Participants


**State Department**

Provider of the grant and funds for development.


**New America**

Leadership, requirements determination and project oversight for the open-source application.
ConsenSys
Responsible for discovery, development and delivery of the application along with Blockchain expertise and guidance.


**Harvard SHINE**

Partner in process discovery, providing data and access to survey participants in our prototype and MVP phases.
Apparel International
The users and survey participants for our pilot data; consisting of management and factory workers.


**Levi Strauss Foundation**

The corporate stakeholder, client of Harvard SHINE and audience for the worker’s survey results and reports.


## Problem

  * Workers at factories were not able to adequately participate in surveys or report issues without fear of reprisal or manipulation of their data.

  * The workers were also unable to see the results of surveys they had participated in which ultimately  hindered them from being able to request and track improvements to their environment and wellbeing.

  * For stakeholders and management, there was a lengthy post survey process before seeing the results of these surveys. This reduced opportunities to be timely and take action as issues were arising in factory locations.
  

## Solution

  * Develop a system that protects the worker’s identity, while recording their data and survey responses in a transparent, immutable fashion; with every answer auditable on Blockchain.

  * Develop an application that streamlines the survey results process, so results could be seen in near-real time.

## Current State (2019)
*The current system and steps as they existed during our Discovery period:*

  * Every year, Apparel International factory workers in 4 locations in Mexico participate in a Worker Wellbeing survey. 
The surveys are facilitated on-site by individuals from Harvard SHINE, who bring all the necessary equipment and devices for the process.
  * Each worker is provided a unique ID, on paper, by a facilitator. The record of these IDs and the worker each belongs to is kept offline for security.
  * The worker inputs this ID at a computer station when beginning their survey. The survey responses are captured in Qualtrics, a web-based survey tool.
  * The survey process for each worker to record their answers is roughly 45 minutes
  * It takes a week on average across all 4 locations to survey all available factory workers.
  * It then can take up to 3 months to process the data, aided by other data analytics tools like Stata, and transcribe it into formats for presentation and reporting.
  * The reports are shared with key stakeholders and management at Apparel International and Levi Strauss Foundation.
  * These stakeholders then decide what actions to take based on the data highlighted areas for improvement around topics like health, environment, personal well-being and incidents of harassment.



## With Survey Assure (2020)
*After defining the issues and areas for improvement above, we developed a new system and process:*

  * A facilitator from Harvard SHINE sets up a new instance for an upcoming annual Worker Wellbeing survey in Qualtrics
  * In the Survey Assure application platform they create a new “survey presentation layer” which is associated with the Qualtrics survey for that same upcoming year.
  * In the Survey Assure platform, they input the corresponding survey id as it appears in Qualtrics, ensuring a connection through the API and data source plugin.
  * Survey Assure  then replicates the questions and question groups, as they appear in Qualtrics, and creates a presentation chart for each question which will have null values until recorded survey responses are provided.
  * The facilitator can then verify the survey’s structure in the Survey Assure platform, including all created composite formulas, which can be set up in advance of the next on-site survey.
  * Surveys would be conducted on-site as they have been done in previous years, with Harvard SHINE facilitating on-site.
  * When a factory worker submits their completed survey, the information is saved to Qualtrics, automatically formatted in a process called normalization, then recorded on the Ethereum Blockchain and finally pushed to the Survey Assure platform via the data source connection.
  * Each new submission by a factory worker will continue to populate and update all the relevant charts and composites in the Survey Assure platform in near real-time. These updates include the new blockchain hash records for each chart and set of answers.
  * The Survey Assure platform would be accessible to stakeholders, management and factory workers.


<div class="navFlow navBottom">
  <div class="next"><a href="003-features.html">Features &raquo;</a></div>
  <div class="previous"><a href="index.html">&laquo; Introduction</a></div>
</div>