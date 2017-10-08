const graphql = require('graphql');
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
    instance: {
      type: Instance,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
          // graph the real data, for example from the server.
          // return _.find(users, { id: args.id }); // use this line for getting the mocked data in the top of this document.
          return axios.get(`http://localhost:3000/instances/${args.id}`)
              .then(resp => resp.data);
      }
    },
    instances: {
      type: new GraphQLList(Instance),
      args: {
          offset: {type: GraphQLInt},
          limit: {type: GraphQLInt}
      },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/instances`)
            .then(resp => resp.data);
      }
    },
    metric: {
      type: Metric,
      args: { id: {type: GraphQLString }},
      resolve(parentValue, args) {
          return axios.get(`http://localhost:3000/metrics/${args.id}`)
              .then(resp => resp.data);
      }
    },
    metrics: {
      type: new GraphQLList(Metric),
      args: {
        offset: { type: GraphQLInt },
        limit: { type: GraphQLInt }
      },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/metrics`)
            .then(resp => resp.data);
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

