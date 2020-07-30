import React, { useMemo, useState } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import MOVIES_LIST from './pages/movies_list'
import MOVIE_DETAILS from './pages/movie_details'

import BROWSER_MOVIES_CONTEXT from './contexts/browser_movies'
import BROWSER_INFOS_CONTEXT from './contexts/browser_infos'

function Routes() {

    const [page, set_page] = useState(1)
    const [sort, set_sort] = useState('popularity.desc')
    const [years, set_years] = useState([])
    const [genre, set_genre] = useState('')
    const [query, set_query] = useState('')

    const browser_movies_context = useMemo(() => ({
        browser: async data => {
            if(data.page !== undefined){
                set_page(data.page)
            }
            if(data.sort !== undefined){
                set_sort(data.sort)
            }
            if(data.years !== undefined){
                set_years(data.years)
            }
            if(data.genre !== undefined){
                set_genre(data.genre)
            }
            if(data.query !== undefined){
                set_query(data.query)
            }
        },

    }),
        []
    )

    return (
        <BrowserRouter>
            <Switch>
                <BROWSER_MOVIES_CONTEXT.Provider value={browser_movies_context}>
                    <BROWSER_INFOS_CONTEXT.Provider value={{page: page, sort: sort, years: years, genre: genre, query: query}}> 
                        <Route path="/" exact component={MOVIES_LIST} />
                        <Route path="/movie_details/:movie_id" component={MOVIE_DETAILS} />
                    </BROWSER_INFOS_CONTEXT.Provider>
                </BROWSER_MOVIES_CONTEXT.Provider>
            </Switch>
        </BrowserRouter >
    )
}

export default Routes