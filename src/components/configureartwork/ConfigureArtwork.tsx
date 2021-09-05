import React from 'react';
import './ConfigureArtwork.css';

interface ConfigureArtworkProps {
    resizeArtwork: (newWidth:number) => void;
    excludeColor: (color:number) => void;
    showConfig?: boolean;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    artworkHeight: number;
    artworkWidth: number;
    canvasHeight: number;
    canvasWidth: number;
    colors: {name: string, hex: string, exclude?: boolean}[];
}

interface ConfigureArtworkState {
}

class ConfigureArtwork extends React.Component<ConfigureArtworkProps, ConfigureArtworkState> {
    render(){
        return (
            <div className="ConfigureArtwork_container">
                <div className="ConfigureArtwork_container_half">
                    {this.props.showConfig && 
                        <>
                            <p>Original dimensions: {this.props.canvasWidth} x {this.props.canvasHeight} pixels</p>
                        </>
                    }
                    <div className="ConfigureArtwork_scroll_area">
                        <canvas 
                            ref={this.props.canvasRef}
                        />
                    </div>
                </div>
                {this.props.showConfig && 
                    <div className="ConfigureArtwork_container_half">
                        <p>Choose your LEGO artwork width in bricks (deafult is 48):</p>
                        <input 
                            type="number" 
                            onChange={(e) => this.props.resizeArtwork(parseInt(e.target.value))}
                        />
                        <h3>Choose LEGO colors:</h3>
                        <div className="ConfigureArtwork_exclude_color_container">
                            {this.props.colors.map((color:{name:string, hex:string, exclude?:boolean}, index: number) => {
                                return (
                                    <div 
                                        className="ConfigureArtwork_exclude_color"
                                        style={{ 
                                            backgroundColor: color.hex, 
                                            opacity: color.exclude ? 0.25 : 1
                                        }}
                                        title={color.name + " (" + color.hex + ")"}
                                        onClick={() => this.props.excludeColor(index)}
                                    />
                                );
                                })
                            }
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default ConfigureArtwork;