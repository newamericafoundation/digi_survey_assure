import React from 'react';
import Api from '../helpers/api';
import Header from '../components/Header';
import TableOfContents from '../components/TableOfContents';
import { translate } from '../helpers/localize';
import DisplayBox from '../components/DisplayBox';

/**
 * Gets all survey groups and adds links to each survey in the group
 */
export default class App extends React.Component {
  state = {
    surveyGroups: []
  }

  componentDidMount() {
    this.getPublicData();
  }

  async getPublicData() {
    new Api(`surveyGroup`, 'get')
      .call()
      .then((response) => {
        this.setState({
          surveyGroups: response
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    const surveyGroups = []
    this.state.surveyGroups.forEach(surveyGroup => {
      const link = `/group/${surveyGroup.id}`;
      const bgImage = (surveyGroup.metadata && 'image' in surveyGroup.metadata) ? surveyGroup.metadata.image : null;
      const icon = (surveyGroup.metadata && 'icon' in surveyGroup.metadata) ? surveyGroup.metadata.icon : null;

      surveyGroups.push(
        <DisplayBox
          key={surveyGroup.id}
          title={surveyGroup.name}
          icon={icon}
          maxLength={35}
          linkText={translate('view_survey_group')}
          bgImage={bgImage}
          link={link}></DisplayBox>);
    });

    return (
      <div>
        <Header surveyId={null} page="listSurveyGroups"></Header>

        <TableOfContents level="app"></TableOfContents>

        <div className="container">
          <h1>{translate('available_survey_data')}</h1>

          <div className="grid3Wrapper">
            {surveyGroups}
          </div>
        </div>
      </div>
    );
  }
}
