import React from 'react';
import './GeneratedArtwork.css';

interface GeneratedArtworkProps {
    hasGenerated: boolean;
    generatedArtwork: {name:string, hex:string}[][];
}

interface GeneratedArtworkState {
}

class GeneratedArtwork extends React.Component<GeneratedArtworkProps, GeneratedArtworkState> {
    render() {
        var usedColors:{name:string, hex:string}[] = [];
        var usedColorsCount:number[] = [];
        this.props.generatedArtwork.forEach((rows, i) => {
            rows.forEach((c, j) => {
                if (!usedColors.some(used => used.name === c.name )) {
                    usedColors.push(c);
                    usedColorsCount.push(1);
                } else {
                    usedColorsCount[usedColors.findIndex(e => e.name === c.name)]++;
                }
            });
        });

        return (
            <>
                { this.props.hasGenerated &&
                <>
                    <div className="GeneratedArtwork_container">
                    {this.props.generatedArtwork.map((colors:{name:string, hex:string}[]) => {
                        return (
                            <div className="GeneratedArtwork_pixel_row">
                            {
                                colors.map((color:{name:string, hex:string}) => {
                                return (
                                    <div 
                                        className="GeneratedArtwork_pixel"
                                        style={{ backgroundColor: color.hex }}
                                        title={color.name + " (" + color.hex + ")"}
                                    />
                                );
                                })
                            }
                            </div>
                        );
                        })
                    }
                    </div>
                    <div style={{marginTop: 25}}>
                        <h3>Bricks used:</h3>
                        {
                            usedColors.map((usedColors, i) => {
                                return (
                                    <div className="GeneratedArtwork_colors_used_container">
                                        <div 
                                            className="GeneratedArtwork_colors_used_color"
                                            style={{ backgroundColor: usedColors.hex }}
                                        />
                                        <p><b>{usedColorsCount[i]}</b> {usedColors.name}</p>
                                    </div>
                                );
                            })
                        }
                    </div>
                </>
                }
            </>
        );
    }
}

export default GeneratedArtwork;