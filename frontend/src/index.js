import React from 'react';
import ReactDOM from 'react-dom';
// If you aren't delivering the frontend via static KOA route,
// you can replace "HashRouter" below with "BrowserRouter" for
// clearner routing.
import { Route, HashRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from './store';
import AdminDashboard from './containers/AdminDashboard';
import App from './containers/App';
import Authentication from './containers/Authentication.js';
import SurveyCompositeGroup from './containers/SurveyCompositeGroup';
import QuestionAudit from './containers/QuestionAudit';
import QuestionAuditDetails from './containers/QuestionAuditDetails';
import QuestionGroupView from './containers/QuestionGroupView';
import Survey from './containers/Survey';
import SurveyComposite from './containers/SurveyComposite';
import SurveyCompositeView from './containers/SurveyCompositeView';
import SurveyGroup from './containers/SurveyGroup';
import SurveySplash from './containers/SurveySplash';
import './styles/index.scss';

ReactDOM.render(
    <Provider store={configureStore()}>
        <Router>
            {/* List of survey groups */}
            <Route exact path="/" component={App} />
            {/* Admin authentication */}
            <Route exact path="/admin" component={AdminDashboard} />
            {/* Admin authentication */}
            <Route exact path="/auth" component={Authentication} />
            {/* List of surveys in a group */}
            <Route exact path="/group/:groupId" component={SurveyGroup} />
            {/* Survey splash page */}
            <Route exact path="/survey/:surveyId" component={SurveySplash} />
            {/* Survey composites */}
            <Route exact path="/survey/:surveyId/composites" component={SurveyComposite} />
            {/* Survey composites: view questions */}
            <Route exact path="/survey/:surveyId/composite/:compositeId" component={SurveyCompositeView} />
            {/* Survey composites */}
            <Route exact path="/survey/:surveyId/compositeGroup/:compositeGroupId" component={SurveyCompositeGroup} />
            {/* Survey aggregates */}
            <Route exact path="/survey/:surveyId/aggregates" render={(props) => <Survey {...props} aggregate={true} />} />
            {/* Survey with all questions */}
            <Route exact path="/survey/:surveyId/questions" render={(props) => <Survey {...props} aggregate={false} />} />
            {/* Detailed Audit Layer */}
            <Route exact path="/survey/:surveyId/questionGroup/:questionGroupId" component={QuestionGroupView} />
            {/* Detailed Audit Layer */}
            <Route exact path="/survey/:surveyId/audit/:responseId" component={QuestionAuditDetails} />
            {/* Audit Layer */}
            <Route exact path="/survey/:surveyId/question/:questionId" component={QuestionAudit} />
        </Router>
    </Provider>,
    document.getElementById('root')
);
