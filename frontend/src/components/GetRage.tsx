import { DATABASE_URL } from '../helpers/helpers'

import { useQuery } from '@tanstack/react-query'

export default function GetRage() {
    const { isLoading, error, data } = useQuery(['testData'], () =>
        fetch(DATABASE_URL + 'key/complaints', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + btoa('root:root'),
                NS: 'test',
                DB: 'test',
            },
        })
    )
    console.log(data)

    return <div>Loaded data</div>
}
