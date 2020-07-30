import React, { useEffect, useState, useRef } from 'react'

import * as Vibrant from 'node-vibrant'

import api from '../services/api'

import '../styles/pages/movie_details.css'

function Movie_details({ match }) {

    const [movie, set_movie] = useState([])
    const [trailers, set_trailers] = useState([])
    const [date_release, set_date_release] = useState('')
    const [genres, set_genres] = useState([])
    const [movie_time, set_movie_time] = useState('')

    const movie_details_ref = useRef(null)
    const container_movie_details_ref = useRef(null)
    const modal_ref = useRef(null)

    useEffect(() => {

        async function get_movie_details() {
            const movie_details = await api.get(`movie/${match.params.movie_id}?api_key=7282a58a79a769ee0ad6013b68787dab&language=en-US`)
            const movie_trailers = await api.get(`/movie/${match.params.movie_id}/videos?api_key=7282a58a79a769ee0ad6013b68787dab&language=en-US`)

            if(movie_trailers.data.results.length > 0){
                set_trailers(movie_trailers.data.results[0].key)
            }   

            container_movie_details_ref.current.style.backgroundImage = `url("https://image.tmdb.org/t/p/original/${movie_details.data.backdrop_path}")`

            Vibrant.from(`https://image.tmdb.org/t/p/original/${movie_details.data.backdrop_path}`).getPalette((err, palette) => {
                if (err) {
                    return
                }
                const color_1 = palette.DarkVibrant._rgb[0]
                const color_2 = palette.DarkVibrant._rgb[1]
                const color_3 = palette.DarkVibrant._rgb[2]
                movie_details_ref.current.style.background = `linear-gradient(90deg, rgba(${color_1},${color_2},${color_3},0.6) 13%, rgba(${color_1},${color_2},${color_3},0.6) 44%, rgba(${color_1},${color_2},${color_3},0.6) 100%)`
            })

            const date = movie_details.data.release_date
            const year = date.slice(0, 4)
            const month = date.slice(5, 7)
            const day = date.slice(-2)

            set_date_release(day + '/' + month + '/' + year)
            set_genres(movie_details.data.genres)
            set_movie_time(min_convert(movie_details.data.runtime))
            set_movie(movie_details.data)
        }

        get_movie_details()
    }, [match.params.movie_id])

    function open_modal() {
        modal_ref.current.style.display = 'block'
    }

    function close_modal() {
        stop_video(modal_ref.current)
        modal_ref.current.style.display = 'none'
    }

    function stop_video ( element ) {
        var iframe = element.querySelector( 'iframe')
        if ( iframe ) {
            var iframeSrc = iframe.src
            iframe.src = iframeSrc
        }
    }

    function min_convert(n) {
        const num = n
        const hours = (num / 60)
        const rhours = Math.floor(hours)
        const minutes = (hours - rhours) * 60
        const rminutes = Math.round(minutes);
        return rhours + "h " + rminutes + "m"
    }

    return (
        <div className="container_movie_details" ref={container_movie_details_ref}>
            <div className="movie_details" ref={movie_details_ref}>
                <div className="modal" ref={modal_ref}>
                    <div className="modal-content">
                        <span className="close" onClick={close_modal}>&times;</span>
                        <iframe width="100%" height="500px" title="Movie trailer"
                            src={`https://www.youtube.com/embed/${trailers}`}>
                        </iframe>
                    </div>
                </div>
                <div className="movie_poster">
                    <img id="img_poster" src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} />
                </div>
                <div className="movie_infos">
                    <div className="header_info">
                        <p><b>{movie.title}</b> ({movie.release_date ? movie.release_date.slice(0, 4) : null})</p>
                        <p>{date_release} &sdot; {genres.map(genre => ` ${genre.name}`).toString()} &sdot; {movie_time}</p>
                    </div>
                    <div className="score_trailer">
                        <div className="vote_movie">
                            <div className="border_voter_movie">
                                {!movie.vote_average ? null : movie.vote_average.toString().replace('.', '')}%
                                    </div>
                        </div>
                        <button onClick={open_modal}>Play Trailer</button>
                    </div>
                    <span className="tagline"><i>{movie.tagline}</i></span>
                    <div className="movie_description">
                        <h2>Overview</h2>
                        <p>{movie.overview}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Movie_details