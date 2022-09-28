import {useEffect, useState} from 'react';

/* export async function getServerSideProps(context) {
    console.log(context);

    //context.res.statusCode = 418;
    context.res.write(JSON.stringify({'message': 'hello world'}));
    context.res.end();

    return {
        props: {
            data: 'Loading...'
        }
    }
} */

export async function getStaticProps() {
    const count = Math.floor(Math.random() * 100) + 1;

    return {
        props: {
            data: `Current count is ${count}`
        },
        revalidate: 10
    }
}

function About(props) {
    const [data, setData] = useState(props.data || null);

    /* useEffect(() => {
        setTimeout(() => {
            setData('Data from API..');
        }, 2000);
    }, []) */

    return (
        <div>
            <h1>About</h1>
            <p>{data}</p>
        </div>
    )
}

export default About