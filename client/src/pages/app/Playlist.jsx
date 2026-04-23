
function Playlist(){



    return(
        <>  
            <div className="flex flex-col text-center bg-gray-700" style={{fontFamily: 'Rouge Script'}}>
                <h1 className="text-5xl p-10">The Playlist</h1>
                <iframe
                    src="https://open.spotify.com/embed/playlist/0Vt2EFdXPAtQiEv3vqpWzt?utm_source=generator&theme=0"
                    width="100%"
                    height="800px"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    ></iframe>
            </div>
        </>
    )
}
export default Playlist;