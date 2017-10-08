const graphql = require('graphql');
// const _ = require('lodash');
const axios = require('axios');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
} = graphql;a
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
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});

