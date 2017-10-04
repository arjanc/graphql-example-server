const graphql = require('graphql');
// const _ = require('lodash');
const axios = require('axios');
const {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLSchema,
  GraphQLList,
} = graphql;
const GraphQLDate = require('graphql-date');

// mock data
/*
const users = [
  {id: '23', firstName: 'Bill', age: 20},
  {id: '47', firstName: 'Samantha', age: 20}
];
*/
const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: {type: GraphQLString},
    name: {type: GraphQLString},
    description: {type: GraphQLString},
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
          .then(resp => resp.data);
      }
    }
  })
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    firstName: {type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then(resp => resp.data);
      }
    }
  })
});

const Instance = new GraphQLObjectType({
  name: 'instance',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    riskScore: { type: GraphQLInt },
    openInsights: { type: GraphQLInt },
    totalInsights: { type: GraphQLInt },
    criticalOpenInsights: { type: GraphQLInt },
    notifications: {
      type: Notification,
      args: {
        offset: { type: GraphQLInt },
        limit: { type: GraphQLInt },
        statuses: { type: GraphQLString }
      }
    }
  })
});

const Metric = new GraphQLObjectType({
  name: 'Metric',
  fields: () => ({
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    subTitle: { type: GraphQLString },
    value: { type: GraphQLFloat },
    percentage: { type: GraphQLBoolean},
    changeValue: { type: GraphQLInt },
    status: { type: MetricStatus }
  })
});

const MetricStatus = new GraphQLEnumType({
  name: 'metricStatus',
  values: {
    Improved: { value: 'Improved' },
    Neutral: { value: 'Neutral' },
    Declined: { value: 'Declined' }
  }
});

const Roles = new GraphQLObjectType({
  name: 'Role',
  fields: () => ({
    email: { type: GraphQLString },
    roles: { type: GraphQLString }
  })
});

const NotificationCategory = new GraphQLEnumType({
  name: 'notificationcategory',
  values: {
    Info: { value: 'Info' },
    Warning: { value: 'Warning' }
  }
});

const NotificationStatus = new GraphQLEnumType({
  name: 'notificationstatus',
  values: {
    New: { value: 'New' },
    Shown: { value: 'Shown' },
    Closed: { value: 'Closed' }
  }
});

const Notification = new GraphQLObjectType({
  name: 'Notification',
  fields:{
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    message: { type: GraphQLString },
    category: { type: NotificationCategory },
    status: { type: NotificationStatus },
    createdAt: { type: GraphQLDate },
    instance: { type: Instance }
  }
});


// use a rootquery to jump into the users object and fetch a user.
const RootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        // graph the real data, for example from the server.
        // return _.find(users, { id: args.id }); // use this line for getting the mocked data in the top of this document.
        return axios.get(`http://localhost:3000/users/${args.id}`)
          .then(resp => resp.data);
      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${args.id}`)
          .then(res => res.data);
      }
    },
    instance: {
      type: Instance,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return {}
      }
    },
    metric: {
      type: Metric,
      args: { id: {type: GraphQLString }},
      resolve(parentValue, args) {
        return {}
      }
    },
    metrics: {
      type: new GraphQLList(Metric),
      args: {
        offset: { type: GraphQLInt },
        limit: { type: GraphQLInt }
      },
      resolve(parentValue, args) {
        return [
          {
            "id": "34592d93-5c28-4222-984f-2a6ace3d6cc4",
            "title": "First time right",
            "subTitle": "KPI",
            "value": 94.1,
            "percentage": true,
            "changeValue": 13,
            "status": "Declined",
            "__typename": "Metric"
          },
          {
            "id": "eda39b67-ebd2-4227-8346-de28b189227d",
            "title": "Insights",
            "subTitle": "Need attention",
            "value": 21,
            "percentage": false,
            "changeValue": 13,
            "status": "Declined",
            "__typename": "Metric"
          },
          {
            "id": "17ff7809-120e-45cf-b68e-eb64f9c56859",
            "title": "Immediate action required",
            "subTitle": "SLA breaches",
            "value": 0,
            "percentage": true,
            "changeValue": 21,
            "status": "Improved",
            "__typename": "Metric"
          }
        ];
      }
    },
    myProfile: {
      type: Roles,
      resolve() {
        return {
          email: 'aceelen@deloitte.nl',
          roles: 'admin'
        }
      }
    },
    notifications: {
      type: new GraphQLList(Notification),
      args: {
        offset: { type: GraphQLInt },
        limit: { type: GraphQLInt },
        statuses: { type: GraphQLString }
      },
      resolve() {
        return [];
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});

