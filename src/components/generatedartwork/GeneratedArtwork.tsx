import React from 'react';
import './GeneratedArtwork.css';

interface GeneratedArtworkProps {
    hasGenerated: boolean;
    generatedArtwork: {n:string, h:string}[][];
    printing: boolean;
}

interface GeneratedArtworkState {
}

class GeneratedArtwork extends React.Component<GeneratedArtworkProps, GeneratedArtworkState> {
    render() {
        var number = 1;
        var usedColors:{n:string, h:string, number?: number}[] = [];
        var usedColorsCount:number[] = [];
        this.props.generatedArtwork.forEach((rows, i) => {
            rows.forEach((c, j) => {
                if (!usedColors.some(used => used.n === c.n )) {
                    var cNumber: {n:string, h:string, number?: number} = c;
                    cNumber.number = number;
                    usedColors.push(cNumber);
                    usedColorsCount.push(1);
                    number++;
                } else {
                    usedColorsCount[usedColors.findIndex(e => e.n === c.n)]++;
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
                    {this.props.generatedArtwork.map((colors:{n:string, h:string}[]) => {
                        return (
                            <div className="GeneratedArtwork_pixel_row">
                            {
                                colors.map((color:{n:string, h:string}) => {
                                return (
                                    <div 
                                        className="GeneratedArtwork_pixel"
                                        style={{ 
                                            backgroundColor: color.h,
                                            height: this.props.printing ? 30 : 10,
                                            width: this.props.printing ? 30 : 10
                                        }}
                                        title={color.n + " (" + color.h + ")"}
                                    >
                                        { this.props.printing &&
                                            <div>{ usedColors[usedColors.findIndex(e => e.n === color.n)].number }</div>
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
                                            style={{ backgroundColor: usedColors.h }}
                                        >
                                            { this.props.printing &&
                                                <p>{usedColors.number}</p>
                                            }
                                        </div>
                                        <p><b>{usedColorsCount[i]}</b> x {usedColors.n}</p>
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