
const myButton = document.getElementById("myButton");

async function getBook() {
    
    await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: '{ books { title, author } }' }),
    })
        .then(res => res.json())
        .then(res => console.log(res.data));
}

    