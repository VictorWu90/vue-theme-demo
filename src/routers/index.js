import demo from '../pages/demo';

const routes = [
    {
        path: '*',
        name: 'demo',
        component: demo,
        meta: {
            title: 'demo'
        }
    }
];

export default [...routes];
