---
title: Administration
---

<div class="navFlow">
  <div class="next"><a href="007-presentation_and_viewing.html">Presentation and Viewing &raquo;</a></div>
  <div class="previous"><a href="005-installation.html">&laquo; Installation</a></div>
</div>

# Administration

*The following is an overview of the administrator features that cover how to set up and connect a survey in the platform. This includes necessary steps for the groups and individual surveys that should be in place to have a consistent drill down of information. These steps are modeled against the pilot data provided by Harvard SHINE in Qualtrics for Apparel International’s annual Worker Wellbeing surveys.*

## Interface
  * **Sidebar Overview** - The sidebar is a navigational element used to navigate between survey groups, individual surveys and their question and composite groups. Administrators have an expanded version of the sidebar that allows them to create and nest new groups, surveys and composites in hierarchical order.
  * **Breadcrumb Navigation** - This area, under the main header, shows text links for each unique segment of a survey group as you drill further into the survey data.
  
  
## Hierarchical Drill Down

  * **Survey Group** - A collection of similar surveys or topics
  * **Survey** - An individual survey that has a data source and visualizations for that data
  * **Composite Group** - A group of composites
  * **Composite** - A set of data points with a formula applied, so a high level summary or metric can be calculated
  * **All Questions** - A comprehensive display of every single question and set of responses, each modeled as a bar or pie chart.
  * **Chart** - Expanded view for an individual chart, with its associated Blockchain records and auditing details
  * **Merkle Proof** - A deeper view into the data structure that was recorded, and means to validate the hashes at a glance
  * **Question Groups** - A list of question groups, organized by topic label
  * **Question Group** - A collection of chart visualization for that group or topic
  
## Data Visualization
*When you have your instance of Survey Assure set up and connected to the data source, in this case Qualtrics you will need to follow the steps below to create a survey group and survey to begin visualizing your data.*

### Setting up a Survey Group

1. At the main landing page, click the ‘New Survey Group’ button. This will open up a new modal.
2. First, give your Survey Group a title that reflects the category or topic of surveys it will collect. 
3. Then give your Survey Group a description, that adds some context to the group or notes on metrics for the data within.
4. On the next modal step, confirm the Source Plugin. In this instance Qualtrics. This will tell the system that surveys 5. within this group will be connecting to a data source provided through the Qualtrics API connection.
5. Provide a URL to an image that you want for the landing preview card. This system does not store images, so you will need one hosted from an external source.
6. Next, preview your information to confirm all the details are correct. If so, Save your new Survey Group.
7. Your new Survey Group will appear on the landing page, reflected both in the Table of Contents sidebar, and the main content area with its preview card.


### Setting up a Survey

1. At the main landing page within a Survey Group, click the ‘New Survey’ button. This will open up a new modal.
2. First, give your Survey a title that reflects the category or topic of surveys it will collect. 
3. Then give your Survey a description, that adds some context to the data presented or notes on metrics for the results within.
4. Input the survey ID for the survey you want to connect to in Qualtrics. An example of this format would be this ‘SV_abCDEFgh3ijkIMN’
5. On the next screen, provide a URL to an image that you want for the landing preview card. This system does not store images, so you will need one hosted from an external source.
6. Now choose whether or not this Survey is accepting responses. This will tell the system if there is an active survey to continue checking for new results. If you select ‘No’ you can still set up the Survey and generate its structure visually as it maps the the Qualtrics questions and question groups (Blocks in Qualtrics)
7. Next, preview your information to confirm all the details are correct. If so, Save your new Survey Group.
8. Your new Survey Group will appear on the landing page, reflected both in the Table of Contents sidebar, and the main content area with its preview card.
9. Select the date for when this Survey will commence. Any entries prior to this date will not be included in the survey or its visualizations.
10. Select the date for when this Survey will conclude. Any entries after this date will not be included in the survey or its visualizations.
11. Next, preview your information to confirm all the details are correct. If so, Save your new Survey.
12. Your new Survey will appear on the Survey Group landing page, reflected both in the Table of Contents sidebar, and the main content area under ‘Recent Surveys’ with its preview card.
13. Survey Group details can be edited by clicking on the pencil icon in the top right of a Survey Group landing page.


### Notes for newly created Surveys

  * When a Survey is first generated, it will generate all the necessary charts for each question.
  * If the blocks feature is used to organize questions in Qualtrics, Survey Assure will organize these blocks into Question  Groups and list them in the Table of Contents. This allows an admin or viewer to quickly jump to specific topics.
  * Whether or not blocks are used in Qualtrics, Survey Assure will also generate an ‘All Questions’ page. This displays every question, in order, that is available through the data source.
  * If a Survey is set up in Survey Assure before Qualtrics has available responses, the administrator can still confirm the visual structure and Question Groups with null values.
  * A survey will populate responses based on being set to actively accept responses, the start and end dates, or the administrator choosing to manually pull in pre-existing responses for Qualtrics surveys that have concluded via the option in the Settings screen.
  * Be advised, the process for importing pre-existing responses can be lengthy based on the number of respondents and the answers in the survey.
  * Survey details can be edited by clicking on the pencil icon in the top right of a Survey landing page.


### Editing Charts and Question Groups

  * The administrator can choose to change the size of a chart, in order to give better visibility to larger data sets. Right now two sizes are supported. To toggle between the views, simply click on the ‘Resize’ button for a chart.
  * The administrator can choose to hide an individual chart. This does not delete the chart, it just hides it from view, and can be restored via the Settings screen.
  * Question Groups can also be hidden from view. Hide a Question Group by clicking the ‘eye’ icon to the right of the Question Group’s title. Visibility for Question Groups can be restored via the Settings screen.


### Enabling Filters

1. Filters can be enabled for a Survey, by clicking on the filter icon on that Survey’s landing page.
2. This will bring up a new modal window for options generating filters.
3. Select a question that you want to use as the filter, and then give it a text label for its dropdown selector.
4. When you have the filters in place, Preview and then Save.
5. This filter modal window allows for the creation of new filters and editing of existing ones.

### Setting up Composite Groups

1. At the main Survey landing page, click the ‘New Composite Group’ button in the Table of Contents. This will open up a new modal.
2. First, give your Composite Group a title that reflects the category or topic of composites it will collect. 
3. Then give your Composite Group a description, that adds some context to the group or notes on metrics for the calculations within.
4. Next, use the Composite Group dropdown to choose whether this is nested within another Group or is the parent.
5. Choose an icon to represent the Composite Group.
6. Choose a color to use with the icon to represent the Composite Group. Both the icon and color are also used for display in the Table of Contents.
7. Next, preview your information to confirm all the details are correct. If so, Save your new Composite Group.
8. Your new Composite Group will appear in the Table of Contents sidebar.
9. You can now build and add new composites within this Composite Group.


### Generating Composites

1. At the main Survey landing page, click the ‘New Composite’ button in the Table of Contents. This will open up a new modal.
2. First, give your Composite a title that reflects the calculation or summary it will be providing. 
3. Now, give your Composite a description, that explains the method or purpose of the calculation.
4. Next, use the Composite Group dropdown to choose where this Composite is displayed. If no group is selected, it will only be visible in the All Composites section.
5. Select a formula to apply to the data. There are two options currently supported. ‘Average’ will calculate an average for each data point and then a summary average for all. ‘Mean Cutoff’ will apply averages only for certain data that meets a threshold defined by the administrator.
6. On the next screen, add all the data points necessary for the total calculation to summarize.
7. To add a data point, select its QID and question label from the drop down. Next, flag which responses should be part of the numerator set.
8. Next, preview your information to confirm all the details and data points are correct. If so, Save your new Composite.
9. Your new Composite Group will appear in the Composite Group you selected as well as the All Composites section.


### Survey Assure Cache
  * The cache for the platform can be invalidated via the Settings screen
  * Caching is used to increase performance and decrease load times. 
  * There are situations in which an administrator may want to invalidate and clear the cache. For example if a composite was edited or re-created, invalidating the caching will allow the composite formulas to be re-applied to the new set of data.


<div class="navFlow navBottom">
  <div class="next"><a href="007-presentation_and_viewing.html">Presentation and Viewing &raquo;</a></div>
  <div class="previous"><a href="005-installation.html">&laquo; Installation</a></div>
</div>
