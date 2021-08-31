import React from 'react';

interface GeneratedArtworkProps {
    hasGenerated: boolean;
    generatedArtwork: {name:string, hex:string}[][];
}

interface GeneratedArtworkState {
}

class GeneratedArtwork extends React.Component<GeneratedArtworkProps, GeneratedArtworkState> {
    render() {
        return (
            <>
                { this.props.hasGenerated &&
                    <div className="App_artwork_container">
                    {this.props.generatedArtwork.map((colors:{name:string, hex:string}[]) => {
                        return (
                            <div className="App_pixel_row">
                            {
                                colors.map((color:{name:string, hex:string}) => {
                                return (
                                    <div 
                                    className="App_pixel"
                                    style={{ backgroundColor: color.hex }}
                                    ></div>
                                );
                                })
                            }
                            </div>
                        );
                        })
                    }
                    </div>
                }
            </>
        );
    }
}

export default GeneratedArtwork;