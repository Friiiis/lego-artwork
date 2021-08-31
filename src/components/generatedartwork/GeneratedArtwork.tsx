import React from 'react';
import './GeneratedArtwork.css';

interface GeneratedArtworkProps {
    hasGenerated: boolean;
    generatedArtwork: {name:string, hex:string}[][];
    printing: boolean;
}

interface GeneratedArtworkState {
}

class GeneratedArtwork extends React.Component<GeneratedArtworkProps, GeneratedArtworkState> {
    render() {
        var number = 1;
        var usedColors:{name:string, hex:string, number?: number}[] = [];
        var usedColorsCount:number[] = [];
        this.props.generatedArtwork.forEach((rows, i) => {
            rows.forEach((c, j) => {
                if (!usedColors.some(used => used.name === c.name )) {
                    var cNumber: {name:string, hex:string, number?: number} = c;
                    cNumber.number = number;
                    usedColors.push(cNumber);
                    usedColorsCount.push(1);
                    number++;
                } else {
                    usedColorsCount[usedColors.findIndex(e => e.name === c.name)]++;
                }
            });
        });

        return (
            <>
                { this.props.hasGenerated &&
                <>
                    <div 
                        id="printArtwork"
                        className="GeneratedArtwork_container"
                    >
                    {this.props.generatedArtwork.map((colors:{name:string, hex:string}[]) => {
                        return (
                            <div className="GeneratedArtwork_pixel_row">
                            {
                                colors.map((color:{name:string, hex:string}) => {
                                return (
                                    <div 
                                        className="GeneratedArtwork_pixel"
                                        style={{ 
                                            backgroundColor: color.hex,
                                            height: this.props.printing ? 30 : 10,
                                            width: this.props.printing ? 30 : 10
                                        }}
                                        title={color.name + " (" + color.hex + ")"}
                                    >
                                        { this.props.printing &&
                                            <div>{ usedColors[usedColors.findIndex(e => e.name === color.name)].number }</div>
                                        }
                                    </div>
                                );
                                })
                            }
                            </div>
                        );
                        })
                    }
                    </div>
                    <div 
                        id="printBricks"
                        style={{marginTop: 25}}
                    >
                        <h3>Bricks used:</h3>
                        {
                            usedColors.map((usedColors, i) => {
                                return (
                                    <div className="GeneratedArtwork_colors_used_container">
                                        <div 
                                            className="GeneratedArtwork_colors_used_color"
                                            style={{ backgroundColor: usedColors.hex }}
                                        >
                                            { this.props.printing &&
                                                <p>{usedColors.number}</p>
                                            }
                                        </div>
                                        <p><b>{usedColorsCount[i]}</b> x {usedColors.name}</p>
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