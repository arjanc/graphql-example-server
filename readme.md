# Setup

to setup this project run the
following command in your terminal when
you are IN your project folder.
```bash
npm install
```

## development
to run the server in watch mode
run:
```bash
npm run dev
```
and in another terminal window
```bash
npm run json:server
```

## use
now the nodejs server is running
AND the json db is up. Browse to:
[http://localhost:4000/graphql](http://localhost:4000/graphql)

The json db can be access by:
[http://localhost:3000/instances](http://localhost:3000/instances) or
[http://localhost:3000/instances/23](http://localhost:3000/instances/23) or
[http://localhost:3000/metrics](http://localhost:3000/metrics)

## GraphQL
inside the [GraphiQL](http://localhost:4000/graphql) you can type:
```javascript
{
  instances(offset:0, limit:0){
    id
    name
  }
}
```

and you'll get
```xml
{
  "data": {
    "instances": [
      {
        "id": "23",
        "name": "Application ABC"
      },
      {
        "id": "47",
        "name": "Application DEF"
      },
      {
        "id": "41",
        "name": "Application GHI"
      }
    ]
  }
}
```