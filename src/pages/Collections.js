import { useEffect, useState } from 'react';
import {Helmet} from "react-helmet";
import client from '../Client';

import Collection from '../components/loops/Collection';


const getCollections = async () => {

    const { data } = await client.get('/collections');
    return data;
};

const Collections = () => {

    const [collections, setCollections] = useState([]);

    useEffect(() => {
        getCollections().then(setCollections).catch(console.error);
    }, []);

    return (
        <>
            <Helmet>
                <title>Danh mục content</title>
            </Helmet>
            <div className="grid grid-cols-4 gap-4">
                {
                    collections.map((collection, i) => {
                        return (
                            <Collection key={i} {...collection} />
                        );
                    })
                }
            </div>
        </>
    );
};

export default Collections;
