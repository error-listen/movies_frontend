import React, { useEffect, useState, useContext, useRef } from 'react'

import { Link } from 'react-router-dom'

import api from '../services/api'

import HEADER from '../components/header'

import BROWSER_MOVIES_CONTEXT from '../contexts/browser_movies'
import BROWSER_INFOS from '../contexts/browser_infos'

import '../styles/pages/movies_list.css'

import loading_gif from '../assets/gifs/loading.gif'

function Movies_list() {

    const [movies, set_movies] = useState([])
    const [query, set_query] = useState('')
    const [max_pages, set_max_pages] = useState(0)
    const [loading, set_loading] = useState(false)
    const [reload, set_reload] = useState(true)

    const browser_infos = useContext(BROWSER_INFOS)
    const { browser } = useContext(BROWSER_MOVIES_CONTEXT)

    const prev_button_ref = useRef(null)
    const next_button_ref = useRef(null)

    useEffect(() => {
        async function get_popular_movies() {

            if (reload) {
                set_loading(true)

                if (browser_infos.query) {
                    const movies_list = await api.get(`search/movie?api_key=7282a58a79a769ee0ad6013b68787dab&language=en-US&query=${browser_infos.query}&include_adult=false&include_video=false&page=${browser_infos.page}`)
                    set_movies(movies_list.data.results)
                    set_max_pages(movies_list.data.total_pages)
                } else {
                    const movies_list = await api.get(`discover/movie?api_key=7282a58a79a769ee0ad6013b68787dab&${browser_infos.years.length > 0 ? `primary_release_date.gte=${browser_infos.years[0]}-01-01&primary_release_date.lte=${browser_infos.years[1]}-12-20` : ''}&language=en-US&sort_by=${browser_infos.sort}&include_adult=false&include_video=false&page=${browser_infos.page}&${!browser_infos.genre ? null : `with_genres=${browser_infos.genre}`}`)
                    set_movies(movies_list.data.results)
                    set_max_pages(movies_list.data.total_pages)
                }

                browser({ page: browser_infos.page })

                set_loading(false)
            }

        }

        get_popular_movies()
    }, [browser, browser_infos.genre, browser_infos.page, browser_infos.query, browser_infos.sort, browser_infos.years, reload])

    useEffect(() => {
        if (browser_infos.page === 1) {
            prev_button_ref.current.style.opacity = 0
            prev_button_ref.current.style.cursor = 'default'
            prev_button_ref.current.disabled = true
        } else {
            prev_button_ref.current.style.opacity = 1
            prev_button_ref.current.style.cursor = 'pointer'
            prev_button_ref.current.disabled = false
        }

        if (browser_infos.page === max_pages) {
            next_button_ref.current.style.opacity = 0
            next_button_ref.current.style.cursor = 'default'
            next_button_ref.current.disabled = true
        } else {
            next_button_ref.current.style.opacity = 1
            next_button_ref.current.style.cursor = 'pointer'
            next_button_ref.current.disabled = false
        }
    })

    async function browser_by_vote(option) {
        set_loading(true)
        const vote_movies_list = await api.get(`discover/movie?api_key=7282a58a79a769ee0ad6013b68787dab&language=en-US&sort_by=${option}&include_adult=false&include_video=false&page=1`)
        set_movies(vote_movies_list.data.results)
        set_max_pages(vote_movies_list.data.total_pages)
        browser({ page: 1 })
        browser({ sort: option })
        browser({ years: [] })
        browser({ genre: '' })
        browser({ query: '' })
        set_reload(false)
        set_loading(false)
    }

    async function browser_by_year(option) {
        set_loading(true)
        const primary_year = option.slice(0, 4)
        const second_year = option.slice(-4)
        const array_year = []
        array_year.push(primary_year, second_year)
        const year_movies_list = await api.get(`discover/movie?api_key=7282a58a79a769ee0ad6013b68787dab&primary_release_date.gte=${primary_year}-01-01&primary_release_date.lte=${second_year}-12-20&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`)
        set_movies(year_movies_list.data.results)
        set_max_pages(year_movies_list.data.total_pages)
        browser({ page: 1 })
        browser({ sort: 'popularity.desc' })
        browser({ years: array_year })
        browser({ genre: '' })
        browser({ query: '' })
        set_reload(false)
        set_loading(false)
    }

    async function browser_by_genre(option) {
        set_loading(true)
        const genre_movies_list = await api.get(`discover/movie?api_key=7282a58a79a769ee0ad6013b68787dab&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=${option}`)
        set_movies(genre_movies_list.data.results)
        set_max_pages(genre_movies_list.data.total_pages)
        browser({ page: 1 })
        browser({ sort: 'popularity.desc' })
        browser({ years: [] })
        browser({ genre: option })
        browser({ query: '' })
        set_reload(false)
        set_loading(false)
    }

    async function browser_by_name() {
        set_loading(true)
        const name_movies_list = await api.get(`search/movie?api_key=7282a58a79a769ee0ad6013b68787dab&language=en-US&query=${query}&include_adult=false&include_video=false&page=1`)
        set_movies(name_movies_list.data.results)
        set_max_pages(name_movies_list.data.total_pages)
        browser({ page: 1 })
        browser({ sort: 'popularity.desc' })
        browser({ years: [] })
        browser({ genre: '' })
        browser({ query: query })
        set_reload(false)
        set_loading(false)
    }

    async function next() {
        set_loading(true)
        if (browser_infos.page < max_pages) {
            if (browser_infos.query) {
                const movies_list_next = await api.get(`search/movie?api_key=7282a58a79a769ee0ad6013b68787dab&language=en-US&query=${browser_infos.query}&include_adult=false&include_video=false&page=${browser_infos.page + 1}`)
                set_movies(movies_list_next.data.results)
                set_max_pages(movies_list_next.data.total_pages)
            } else {
                const movies_list_next = await api.get(`discover/movie?api_key=7282a58a79a769ee0ad6013b68787dab&${browser_infos.years.length > 0 ? `primary_release_date.gte=${browser_infos.years[0]}-01-01&primary_release_date.lte=${browser_infos.years[1]}-12-20` : ''}&language=en-US&sort_by=${browser_infos.sort}&include_adult=false&include_video=false&page=${browser_infos.page + 1}&${!browser_infos.genre ? null : `with_genres=${browser_infos.genre}`}`)
                set_movies(movies_list_next.data.results)
                set_max_pages(movies_list_next.data.total_pages)
            }
            browser({ page: browser_infos.page + 1 })
            set_loading(false)
            set_reload(false)
        }
    }

    async function prev() {
        set_loading(true)
        if (browser_infos.page > 1) {
            if (browser_infos.query) {
                const movies_list_prev = await api.get(`search/movie?api_key=7282a58a79a769ee0ad6013b68787dab&language=en-US&query=${browser_infos.query}&include_adult=false&include_video=false&page=${browser_infos.page - 1}`)
                set_movies(movies_list_prev.data.results)
                set_max_pages(movies_list_prev.data.total_pages)
            } else {
                const movies_list_prev = await api.get(`discover/movie?api_key=7282a58a79a769ee0ad6013b68787dab&${browser_infos.years.length > 0 ? `primary_release_date.gte=${browser_infos.years[0]}-01-01&primary_release_date.lte=${browser_infos.years[1]}-12-20` : ''}&language=en-US&sort_by=${browser_infos.sort}&include_adult=false&include_video=false&page=${browser_infos.page - 1}&${!browser_infos.genre ? null : `with_genres=${browser_infos.genre}`}`)
                set_movies(movies_list_prev.data.results)
                set_max_pages(movies_list_prev.data.total_pages)
            }
            browser({ page: browser_infos.page - 1 })
            set_loading(false)
            set_reload(false)
        }
    }

    return (
        <div>
            <HEADER />
            <div className="container_movies_list">
                <div className="browser">
                    <span className="browser_text"><i>BROWSER BY</i></span>
                    <div className="browser_options">
                        <div className="dropdowns">
                            <div className="dropdown">
                                <button className="dropdown_button">RATING</button>
                                <ul className="dropdown_content">
                                    <li><button onClick={() => browser_by_vote('vote_average.desc')}>Highest First</button></li>
                                    <li><button onClick={() => browser_by_vote('vote_average.asc')}>Lowest First</button></li>
                                </ul>
                            </div>
                            <div className="dropdown">
                                <button className="dropdown_button">YEAR</button>
                                <ul className="dropdown_content">
                                    <li><button onClick={() => browser_by_year('2010-2020')}>2010-2020</button></li>
                                    <li><button onClick={() => browser_by_year('2000-2009')}>2000-2009</button></li>
                                    <li><button onClick={() => browser_by_year('1990-1999')}>1990-1999</button></li>
                                    <li><button onClick={() => browser_by_year('1980-1989')}>1980-1989</button></li>
                                    <li><button onClick={() => browser_by_year('1970-1979')}>1970-1979</button></li>
                                    <li><button onClick={() => browser_by_year('1960-1969')}>1960-1969</button></li>
                                    <li><button onClick={() => browser_by_year('1950-1959')}>1950-1959</button></li>
                                    <li><button onClick={() => browser_by_year('1940-1949')}>1940-1949</button></li>
                                    <li><button onClick={() => browser_by_year('1930-1939')}>1930-1939</button></li>
                                    <li><button onClick={() => browser_by_year('1920-1929')}>1920-1929</button></li>
                                    <li><button onClick={() => browser_by_year('1910-1919')}>1910-1919</button></li>
                                    <li><button onClick={() => browser_by_year('1900-1909')}>1900-1909</button></li>
                                    <li><button onClick={() => browser_by_year('1890-1899')}>1890-1899</button></li>
                                    <li><button onClick={() => browser_by_year('1880-1889')}>1880-1889</button></li>
                                    <li><button onClick={() => browser_by_year('1870-1879')}>1870-1879</button></li>
                                </ul>
                            </div>
                            <div className="dropdown">
                                <button className="dropdown_button">GENRE</button>
                                <ul className="dropdown_content">
                                    <li><button onClick={() => browser_by_genre('28')}>Action</button></li>
                                    <li><button onClick={() => browser_by_genre('12')}>Adventure</button></li>
                                    <li><button onClick={() => browser_by_genre('16')}>Animation</button></li>
                                    <li><button onClick={() => browser_by_genre('35')}>Comedy</button></li>
                                    <li><button onClick={() => browser_by_genre('80')}>Crime</button></li>
                                    <li><button onClick={() => browser_by_genre('99')}>Documentary</button></li>
                                    <li><button onClick={() => browser_by_genre('18')}>Drama</button></li>
                                    <li><button onClick={() => browser_by_genre('10751')}>Family</button></li>
                                    <li><button onClick={() => browser_by_genre('14')}>Fantasy</button></li>
                                    <li><button onClick={() => browser_by_genre('36')}>History</button></li>
                                    <li><button onClick={() => browser_by_genre('27')}>Horror</button></li>
                                    <li><button onClick={() => browser_by_genre('10402')}>Music</button></li>
                                    <li><button onClick={() => browser_by_genre('9648')}>Mystery</button></li>
                                    <li><button onClick={() => browser_by_genre('10749')}>Romance</button></li>
                                    <li><button onClick={() => browser_by_genre('878')}>Science Fiction</button></li>
                                    <li><button onClick={() => browser_by_genre('53')}>Thriller</button></li>
                                    <li><button onClick={() => browser_by_genre('10770')}>TV Movie</button></li>
                                    <li><button onClick={() => browser_by_genre('10752')}>War</button></li>
                                    <li><button onClick={() => browser_by_genre('37')}>Western</button></li>
                                </ul>
                            </div>
                        </div>
                        <div>
                            <input placeholder="Search by name" onChange={e => set_query(e.target.value)} value={query} />
                            <button className="search_button" onClick={browser_by_name}>Search</button>
                        </div>
                    </div>
                </div>
                <hr />
                {loading ? <div className="loading"><img src={loading_gif} alt="Loading..." width="100px" /></div> : <ul className="movies_result">
                    {movies.map(movie => {
                        return (
                            <li className="movie" key={movie.id}>
                                <Link to={`/movie_details/${movie.id}`}>
                                    <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} />
                                    <div className="vote_movie">
                                        <div className="border_voter_movie">
                                            {movie.vote_average.toString().replace(".", "")}%
                                    </div>
                                    </div>
                                </Link>
                            </li>
                        )
                    })}
                </ul>}
                <hr />
                <div className="pagination">
                    <button className="pagination_button" ref={prev_button_ref} onClick={prev}>PREV</button>
                    <button className="pagination_button" ref={next_button_ref} onClick={next}>NEXT</button>
                </div>
            </div>
        </div>
    )
}

export default Movies_list