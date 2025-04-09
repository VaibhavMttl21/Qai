import DecryptedText from "./decryptText";


export function PreHeading() {
    return (
        <div className="relative w-screen h-screen bg-[url('/topbg.png')] bg-cover bg-center">

        

         
            {/* <div className="absolute left-0 top-1/2 transform -translate-y-1/2"
            style={{ fontSize: '3rem' }}>
           
                
                <DecryptedText text="Hover me!" />

               
                <DecryptedText
                    text="Customize me"
                    speed={100}
                    maxIterations={20}
                    characters="ABCD1234!?"
                    className="revealed"
                    parentClassName="all-letters"
                    encryptedClassName="encrypted"
                    style={{ fontSize: '3rem' }}
                />

              
                <div style={{ marginTop: '4rem' }}>
                    <DecryptedText
                        text="This text animates when in view"
                        animateOn="view"
                        revealDirection="center"
                        style={{ fontSize: '3rem' }}
                    />
                </div>
            </div> */}
     
  


            {/* Right Component (Spline Viewer) */}
            <div className="absolute right-0 top-0 h-full w-1/2 max-w-[1000px] max-h-[800px] md:w-[45%] sm:w-[60%] xs:w-[90%]">
  <spline-viewer
    url="https://prod.spline.design/m-8d-MxC0lhpf3BE/scene.splinecode"
    style={{
      width: '100%',
      height: '100%',
    }}
  />
</div>


        </div>
    );
}
