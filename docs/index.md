---
title: Survey Assure Documentation
layout: page
---

<div class="navFlow">
  <div class="next"><a href="002-project_history.html">Project History &raquo;</a></div>
  <div class="previous"><a href="999-license.html">&laquo; License</a></div>
</div>

# Overview 

<img src="assets/images/survey_assure_01.png" style="margin-bottom:12px;max-width:100%;height:auto;" />

Survey Assure is a real-time tool designed to aggregate survey responses from various data sources (for example, [Qualtrics](https://www.qualtrics.com/)), make the contents of those survey responses immutable via use of the Ethereum Blockchain, and enable you to create a "presentation layer" in order to visualize those responses and analyze the data without altering it. In other words, it is designed to foster trust between companies and workers by allowing workers to know that their survey responses were not altered in any way.

- [Overview](#overview)
- [Github](#github)
- [Lexicon](#lexicon)
  - [Core Concepts](#core-concepts)
  - [Plugin System](#plugin-system)
  - [Additional Concepts](#additional-concepts)
- [Immutability](#immutability)
  - [Merkle Tree Recipe](#merkle-tree-recipe)
- [Credits & Acknowledgements](#credits--acknowledgements)
  - [About the Blockchain Trust Accelerator at New America](#about-the-blockchain-trust-accelerator-at-new-america)
    - [The People](#the-people)
  - [About SHINE at the Harvard T.H. Chan School of Public Health](#about-shine-at-the-harvard-th-chan-school-of-public-health)
    - [The People](#the-people-1)
  - [About The Levi Strauss Foundation](#about-the-levi-strauss-foundation)
  - [About ConsenSys](#about-consensys)
    - [The People](#the-people-2)
  - [Tools](#tools)

# Github

The GitHub repo for the project can be found <a href="https://github.com/newamericafoundation/digi_survey_assure" target="_blank">here</a>.

# Lexicon

The core aspects of the platform are as follows:

## Core Concepts 

- Survey Group: A collection of similar surveys (data can be compared in a 1-to-1 fashion).
- Survey: A collection of question groups and questions, imported from a data source.
- Question Group: a collection of questions.
- Question (chart): an individual question (chart) on a survey.
- Composite Group: A collection of composites.
- Composite: A calculation based on a Formula that produces a custom metric using multiple questions.

## Plugin System

- Formula: A type of calculation used by a composite.
- Normalizer: Integrates a data source, making 3rd party data useable within the context of Survey Assure.
- Visualizer: Integrates a frontend graphing tool (ie ChartJS), allowing Survey Assure data to be compatible with a visualizer tool.

## Additional Concepts

- Aggregates: For survey groups with multiple surveys, allows you to visualize side-by-side comparisons of similar questions.
  - Example: you may have a quarterly workers survey whereby the questions don't change, in which case you could graph them side-by-side to compare and see trends.
- Audit Layer: "Proof" layer with information on how the hash which was sent to the Blockchain was calculated.
- Data Source: A 3rd party survey provider platform.
  - Example: [Qualtrics](https://www.qualtrics.com/)
- Survey Filter: a question on a survey that can be used to limit the applicable data set displayed on any chart.
  - Example: Display responses by "Female" only.
  - Example: Display responses by "Female" who work at "Location X" only.

# Immutability

Merkle trees are used to create an immutable "hash stamp" that can be used as a proof that data was not changed when it was added into Survey Assure. The "pure" representation of the data can always be found within the "Audit Layer" of the platform (click the "Audit" link on any graph); this means that even if a question is "hidden" from the interface, the data itself was still used to build the merkle tree and can be audited at any time.

## Merkle Tree Recipe

The merkle tree in this case is created using a combination of the normalized data in Survey Assure and the raw data received from your data source.

- Create an array with:
  - Response's entry within `survey_response` (with metadata removed).
  - All entries belonging to `survey_response.id` within `survey_response_answer`
- Run this array through [MerkleTreeJs](https://www.npmjs.com/package/merkletreejs)
- Send the output to the Blockchain


# Credits & Acknowledgements

A very special thank you to the [US State Department](https://www.state.gov/), who's grant made the creation of Survey Assure possible, in coordination with [New America](https://www.newamerica.org/), [ConsenSys](https://consensys.net/), and [Harvard University SHINE](https://sites.sph.harvard.edu/shine/).

## About the Blockchain Trust Accelerator at New America

The Blockchain Trust Accelerator (BTA) at New America is a leading platform for harnessing blockchain technology to solve social impact and governance challenges. Established in 2016, BTA brings together governments, technologists, civil society organizations, and philanthropists to build Blockchain pilots that benefit society. BTA projects and research help organizations and institutions increase accountability, ensure transparency, create opportunity, and build trust in core institutions.

### The People

- Allison Price

## About SHINE at the Harvard T.H. Chan School of Public Health

The Sustainability and Health Initiative for NetPositive Enterprise (SHINE) unites academic research with business innovation to advance workforce well-being and promote human flourishing throughout the world. SHINE creates a research agenda and works with corporate leadership to define and develop the evidence for scalable solutions to healthy, sustainable change in business. This pioneering research translates into powerful tools and methods that innovate and unite corporate responsibility, sustainability and well-being practices so that individuals and companies can thrive.

### The People

- Heloisa Jardim

## About The Levi Strauss Foundation

LS & Co, a member of SHINE's coalition, has a long history of ensuring ethical supply chains. It was the first apparel company to release the names and locations of all its active, approved owned-and-operated, contract and licensee factories around the world. Making factory lists public has increased transparency of apparel suppliers and promoted collaboration between LS & Co, Strauss & Co and other brands on improving workplace conditions. The company works with governments, local communities, and other apparel companies to strengthen the protection of worker rights. In addition, LS & Co is also an active supporter of the International Labor Organization (ILO)'s Better Work program to improve respect of labor rights for workers and "create a rigorous cycle of improvement."

## About ConsenSys

ConsenSys is a global formation of technologists and entrepreneurs building the infrastructure, applications, and practices that enable a decentralized world. At the core, ConsenSys is a venture production studio and blockchain software development consultancy creating decentralized applications (dApps), enterprise solutions and developer tools for blockchain ecosystems, focused primarily on Ethereum. Powered by smart contracts and secured through encryption, our solutions provide the benefits of transparency, auditability, and immutability that are unique to blockchain-based solutions.

### The People

- Engineering
  - <a href="https://github.com/jbelelieu" target="_blank">Jonathan Belelieu</a>
- Product Design
  - <a href="http://jakobhaglof.com/" target="_blank">Jakob Haglof</a>
- Product
  - Walter Jansen
  - Silvana Rodriguez
  - Amanda Cajano
  - Robert Greenfield IV

## Tools

- [ChartJS](https://www.chartjs.org/) 
- [Foundation Icon Set](https://zurb.com/playground/foundation-icon-fonts-3)

<div class="navFlow navBottom">
  <div class="next"><a href="002-project_history.html">Project History &raquo;</a></div>
  <div class="previous"><a href="999-license.html">&laquo; License</a></div>
</div>