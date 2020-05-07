---
title: Contributing
---

<div class="navFlow">
  <div class="next"><a href="999-license.html">License &raquo;</a></div>
  <div class="previous"><a href="009-best_practices.html">&laquo; Best Practices</a></div>
</div>

- [Contributing](#contributing)
  - [General Guidelines](#general-guidelines)
  - [I/O Flow](#io-flow)
  - [Code Structure](#code-structure)
    - [Responsibility](#responsibility)
      - [Routes](#routes)
      - [Controllers](#controllers)
        - [Validators](#validators)
      - [Models](#models)
      - [Helpers](#helpers)
      - [Services](#services)
      - [Plugins](#plugins)
        - [Normalizers](#normalizers)
        - [Visualizers](#visualizers)
        - [Formulas](#formulas)
- [Roadmap](#roadmap)
  - [Survey Group Aggregates](#survey-group-aggregates)
  - [User Management & Permissions](#user-management--permissions)
    - [Addition Requirements](#addition-requirements)
  - [Batch Anonymizer](#batch-anonymizer)
  - [Frontend Themes](#frontend-themes)
  - [Improved Audit Layer Display](#improved-audit-layer-display)
  - [Composite Strategy Plugin System](#composite-strategy-plugin-system)
    - [Addition Requirements](#addition-requirements-1)
  - [Survey Monkey Integration](#survey-monkey-integration)
  - [Google Forms Integration](#google-forms-integration)
  - [Frontend TypeScript Migrations](#frontend-typescript-migrations)
  - [Modular Visualizers for Frontend](#modular-visualizers-for-frontend)
  - [Improved UX around blockchain events/long lived events (mass imports)](#improved-ux-around-blockchain-eventslong-lived-events-mass-imports)
  - [Cache Computed Question Responses for Closed Surveys](#cache-computed-question-responses-for-closed-surveys)
  - [Cache "Tag" System](#cache-%22tag%22-system)
  - [Charting Performance Improvements](#charting-performance-improvements)
  - [Integration of CanvasJS (Visualizer)](#integration-of-canvasjs-visualizer)
  - [Import a Single Response From ID](#import-a-single-response-from-id)
  - [Anonymous User Management](#anonymous-user-management)
  - [Mark Surveys as "Test" Surveys](#mark-surveys-as-%22test%22-surveys)

# Contributing
## General Guidelines
To be approved into the codebase, all code must at a minimum:

1. Follow the "Code Structure/Responsibilities" listed below,
2. Pass linting for code quality as laid out 
3. New packages much not have security warnings at or above "high" from NPM.
4. New packages much use a license of equal of more liberal guidelines than the MIT license.
5. Code must be self-documenting, with comments only existing where code isn't obviously descriptive or complex logic requires it.
6. Variable names much be consistent with the existant schemes (casing, verbiage, etc.).
7. All code must be written in Typescript with strict typings/interfaces whenever possible.

## I/O Flow
-> Route -> Controller -> Model/Service/Helper -> Controller

## Code Structure

### Responsibility

#### Routes
- Accept requests and confirm permission to perform the task.
- If confirmed, transfer responsibility to controllers.
- Important: Koa context should never leave this part of the program (IE: don't pass context to controllers: pass only needed inputs).

#### Controllers
- Accept the request from the routers and coordinate logic required to execute the task WITHOUT directly 
- Think of controllers of a high-level "declarative" functions: they show you how to achieve a task without spelling out the dirty details of what is being done to achieve those tasks. In other words, the "coordinate" models, services, and helpers to execute the required business logic.
- Controllers are solely responsible for form validation via "Validators".
- Must return a success/error object in ALL cases to the routes, which never manipulate that response.

##### Validators
- Input validation, generally against data submitted from on online form, which are abstracted to be re-usable with writes and edits.

#### Models
- Purely designed to work with data in non-judgemental way, meaning it will return data without pre/post processing (ie: "raw" data). All pre/post-processing of data should live at the controller, service, or helper levels.

#### Helpers
- These are "helper" functions that create re-usable code that various parts of the code can all use without influencing their primary area of responsibility. Essentially, when multiple parts of the app may need the same functionality, and it doesn't comfortably live in any other subset of code, it becomes a helper.
- A good example of a use case would be grabbing a list of available plugins: there is no model for this since it is built into the physical directory structure of the app so instead we use a simple helper function to grab this data.

#### Services
- A single-responsiblity module that is more complex than a "helper" function, thereby turning it into a service.

#### Plugins
- Modular tools that are designed to integrate third party applications in a way that the application can use without additional changes to the core application code.
- Built on strong interfaces.

Plugins are split into three types:

##### Normalizers

Normalizers accept data from a third party surveying platfrom (example: Qualtrics) and re-shape the incoming data to work with our application's database structure. Effectively they allow us to "normalize" data from any survey platform and make it compatible with our application.

- Qualtrics (https://www.qualtrics.com/)

##### Visualizers

Visualizers take normalized data and re-shape them to work with various graphing tools, such as ChartJS (default visualizer).

- ChartJS (https://www.chartjs.org/)

##### Formulas

Formulas are a way of calculating a composite's value.

- Average
- Mean Cutoff

# Roadmap

Many features were planned for development but did not make it into the initial release version. Contributors can select from these features, or can propose new features. In the spirit of open source, we kindly ask that all private work done on the platform be contributed back to the primary repository for everyone to use.

Please contact us for more information on any of these features if you are interested in contributing or need clarification.

## Survey Group Aggregates

- Definition: the creation of a frontend interface for mapping survey questions on one survey in a survey group to a question 
- Notes: The backend already supports rendering aggregates, as does the frontend. What is needed here is an interface that will allow users to visually map questions from one survey to another survey. `survey_group_item_mapping` controls the mappings:
  - `survey_group_item_mapping.root_survey_id` being the first survey in the group.
  - `survey_group_item_mapping.question_id` is the question on the root survey we are mapping other questions to.
  - `survey_group_item_mapping.mapped_questions` is a JSON array of question IDs that map to `survey_group_item_mapping.question_id`.
  - Within the frontend code, you can find commented out references to "aggregates" displays. Once the UX is complete, simply uncomment those to have the application do the rest!

Example:

`survey_group_item_mapping`

| id  | root_survey_id | question_id | mapped_questions |
| --- | -------------- | ----------- | ---------------- |
| 1   | 10             | 75          | [ 150, 360 ]     |

In the above example, we are telling the application that question ID `75` on survey ID `10` maps to question IDs `150` and `360` on their respective surveys.

---------

## User Management & Permissions

- Definition: the ability to create multiple users with their own permissions within the system.
- Notes: The permission system is working and in place (see `helper/session.ts` + any protected route), it just needs an interface on the frontend and corresponding business logic on the backend for user-based CRUD functionality.

### Addition Requirements

- The ability to create user groups and assign permissions (`user_group`).
- The ability to create users and assign them to a user group.

---------

## Batch Anonymizer

- Definition: a privacy tool that pools real-time responses and delays their inclusion in the database until a suitable number of responses is in the pool, thereby improving privacy of users submitting survey responses.
- Notes: see the "Best Practices" section under "Maintaining Privacy (Important!)" for information on why this is important.

---------

## Frontend Themes

- Definition: open ended request for different frontend themes for the platform!

---------

## Improved Audit Layer Display

- Definition:
  - The audit layers needs to be laid out better to show what represents each leaf, intermediates, etc.. so that proofs can be calculated without the entire dataset.
  - Pagination on the audit table.

---------

## Composite Strategy Plugin System

- Definition: The ability to use different stategies for displaying composite results. By default a percentage is displayed, but alternatives could include an "Emoji Strategy", fixed scale for color coding composite backgrounds, and more.
  - Emoji example: 0-33 (% range) = &#128577;, 34-66 = &#128528;, 67-100 = &#128512;
  - Fixed color scale example: 0-33 (% range) = red, 34-66 = yellow, 67-100 = green.

### Addition Requirements

- This will require a new category of plugin called "Formula Strategies".

---------

## Survey Monkey Integration

- Definition: the creation of a normalizer plugin to process data from Survey Monkey.

---------

## Google Forms Integration

- Definition: the creation of a normalizer plugin to process data from Google Forms.

---------

## Frontend TypeScript Migrations

- Defintion: the application started off without TypeScript on the frontend, but was later added, leaving some legacy files still written in plain JS. In an effort to clean up the frontend code, all `.js` files need to be converted to properly typed `.tsx` files.

---------

## Modular Visualizers for Frontend

- Defintion: presently, ChartJS is the only supported visualizer on the frontend. Making this modular will allow for cleaner code when additional visualizer plugins are created (see `frontend/src/components/Question.js`).

---------

## Improved UX around blockchain events/long lived events (mass imports)

- Defintion: Blockchain events when performing "mass" actions (mass import, closing a survey, etc.) can take long periods of time. The program needs a better UX for displaying that progress to the user.

---------

## Cache Computed Question Responses for Closed Surveys

- Defintion: Additional caching is needed for questions and question groups once a survey is closed.

---------

## Cache "Tag" System

- Definition: Presently, caching does not get auto-invalidated when a cached item is edited or deleted. Implementing a tagging system, or more predictable key-naming schema, to allow for this will prevent the need to manually invalidate all of the cache if, for example, someone edits a composite after a survey has been closed (those edits will not be reflected if the composite was already cached).

---------

## Charting Performance Improvements

- Definition: After closing a survey, static images should be generated for each chart.

---------

## Integration of CanvasJS (Visualizer)
- Definition: https://canvasjs.com/
- Linked Items: "Modular Visualizers for Frontend"

---------

## Import a Single Response From ID

- Defintion: Ability to import a single response from a survey source.

---------

## Anonymous User Management

- Defintion: Ability to have user profiles which can be anonymized and limit usage of specific surveys (1 token = 1 survey response).

---------

## Mark Surveys as "Test" Surveys

- Defintion: Ability to mark a survey as a test survey, making it bypass the blockchain communications.



<div class="navFlow navBottom">
  <div class="next"><a href="999-license.html">License &raquo;</a></div>
  <div class="previous"><a href="009-best_practices.html">&laquo; Best Practices</a></div>
</div>
