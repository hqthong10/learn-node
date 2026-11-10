# get tasks
{
  "query": "{ tasks { id title completed } }"
}

# createTask
{
  "query": "mutation { createTask(title: \"Learn GraphQL\", description: \"Practice mutations\") { id title description completed } }"
}

# fetch
const response = await fetch('http://localhost:4000/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: `
      mutation {
        createTask(title: "Test from frontend") {
          id
          title
          completed
        }
      }
    `,
  }),
});

const result = await response.json();

console.log(result.data);