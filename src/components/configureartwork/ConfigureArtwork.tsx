import React from 'react';
import './ConfigureArtwork.css';

interface ConfigureArtworkProps {
    showConfig?: boolean;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    resizeArtwork: (newWidth:number) => void;
    artworkHeight: number;
    artworkWidth: number;
    canvasHeight: number;
    canvasWidth: number;
}

interface ConfigureArtworkState {
}

class ConfigureArtwork extends React.Component<ConfigureArtworkProps, ConfigureArtworkState> {
    constructor(props: any){
        super(props);
        this.state = {
            canvasHeight: 0,
            canvasWidth: 0
        }
    }
  
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
                        <p>Choose your LEGO artwork width in bricks:</p>
                        <input 
                            type="number" 
                            onChange={(e) => this.props.resizeArtwork(parseInt(e.target.value))}
                        />
                        <p>Final size in LEGOs: {this.props.artworkWidth} x {this.props.artworkHeight} bricks</p>
                    </div>
                }
            </div>
        );
    }
}

export default ConfigureArtwork;