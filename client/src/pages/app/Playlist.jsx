
function Playlist(){




    return(
        <>  
            <div className="flex flex-col text-center bg-black h-full overflow-hidden" style={{fontFamily: 'Gabriela'}}>
                <h1 className="text-6xl font-extrabold text-white p-10">The Playlist</h1>
                <div className=" overflow-hidden">
                    <iframe 
                        src="https://open.spotify.com/embed/playlist/2oWTWIPDY5IxtsRh3RPJZz?utm_source=generator&theme=0"
                        className ="w-full h-[600px] md:h-[800px] p-2"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                    ></iframe>
                </div>

            </div>
        </>
    )
 
    
    /* IN CASE OF APPLE MUSIC 
                    <iframe allow="autoplay *; encrypted-media *;" 
                        className="w-[50%] h-[600px] p-2 background:black" 
                        sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" 
                        src="https://embed.music.apple.com/co/playlist/dope/pl.u-pMylgaETWoYv021?l=en">
                    </iframe>
     */
}
export default Playlist;