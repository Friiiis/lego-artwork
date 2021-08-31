import React from 'react';
import './App.css';
import ConfigureArtwork from './components/configureartwork/ConfigureArtwork';
import DragAndDrop from './components/draganddrop/DragAndDrop';
import GeneratedArtwork from './components/generatedartwork/GeneratedArtwork';
import Helper from './res/Helper';

interface AppState {
  hasUploaded: boolean;
  hasGenerated: boolean;
  generatedArtwork: {name:string, hex:string}[][];
  artworkHeight: number;
  artworkWidth: number;
  canvasHeight: number;
  canvasWidth: number;
  errorMsg: string;
}

class App extends React.Component<{}, AppState> {
  private canvasRef: React.RefObject<HTMLCanvasElement>;
  private tempCanvasRef: React.RefObject<HTMLCanvasElement>;

  constructor(props: any){
    super(props);
    this.state = {
      hasUploaded: false,
      hasGenerated: false,
      generatedArtwork: [[]],
      artworkHeight: 0,
      artworkWidth: 0,
      canvasHeight: 0,
      canvasWidth: 0,
      errorMsg: ""
    }
    this.canvasRef = React.createRef();
    this.tempCanvasRef = React.createRef();
  }

  private onFile(file:File) {
    const c = this.canvasRef.current as HTMLCanvasElement;
    const ctx = c.getContext("2d") as CanvasRenderingContext2D;
    const reader = new FileReader();

    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');
    reader.onload = (event) => {
      var image = new Image();
      image.onload = () => {
        c.height = image.height;
        c.width = image.width;
        ctx.drawImage(image,0,0);
        this.setState({
          hasUploaded: true, 
          hasGenerated: false,
          generatedArtwork: [[]],
          canvasHeight: image.height, 
          canvasWidth: image.width 
        }, () => this.resizeArtwork(50));
      }
      image.src = event.target?.result as string;
    }
    
    reader.readAsDataURL(file);
  }

  private resizeArtwork(newWidth:number) {
    const scale = this.state.canvasWidth / newWidth;
    const newHeight = Math.round(this.state.canvasHeight / scale);
    this.setState({
      artworkWidth: newWidth,
      artworkHeight: newHeight
    });

    const c = this.canvasRef.current as HTMLCanvasElement;
    const c_temp = this.tempCanvasRef.current as HTMLCanvasElement;
    const ctx = c_temp.getContext("2d") as CanvasRenderingContext2D;
    c_temp.height = newHeight;
    c_temp.width = newWidth;
    ctx.drawImage(c, 0, 0, newWidth, newHeight);
  }

  private generate() {
    if (
      this.state.artworkHeight <= 0 ||
      this.state.artworkWidth <= 0
      ) {
      this.setState({errorMsg: "Please choose a size larger than 0"});
      return
    } else if (
      this.state.artworkHeight > 500 ||
      this.state.artworkWidth > 500
      ){
      this.setState({errorMsg: "Size can't be bigger than 500"});
      return
    } else {
      this.setState({errorMsg: ""});
    }

    // load json with colors
    const colors = require('./res/colors.json');

    const c = this.tempCanvasRef.current as HTMLCanvasElement;
    const ctx = c.getContext("2d") as CanvasRenderingContext2D;
    const height = c.height;
    const width = c.width;

    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    var arr: {name:string, hex:string}[][] = [];
    for (let h = 0; h < height; h++) {
      arr.push([]);
    }

    var row = 0;
    // every pixel has 4 positions in the ImageData array (r, g, b, a)
    for (let i = 0; i < data.length; i += 4) {
      const red = data[i];
      const green = data[i + 1];
      const blue = data[i + 2];
      // const alpha = data[i + 3];
      arr[row].push(Helper.getClosestColor(Helper.rgbToHex(red, green, blue), colors));

      if (((i + 4) % (width * 4)) === 0) {
        row++;
      }
    }

    this.setState({generatedArtwork: arr, hasGenerated: true});
  }

  render() {
    return (
      <div className="App">
        <div className="App_container">
          <header>
            <h1>
              LEGO artwork creator
            </h1>
          </header>
          <DragAndDrop
            onFile={(file) => this.onFile(file)}
          />
          <ConfigureArtwork 
            canvasRef={this.canvasRef}
            showConfig={this.state.hasUploaded}
            artworkHeight={this.state.artworkHeight}
            artworkWidth={this.state.artworkWidth}
            canvasHeight={this.state.canvasHeight}
            canvasWidth={this.state.canvasWidth}
            resizeArtwork={this.resizeArtwork.bind(this)}
          />
          {this.state.hasUploaded && 
            <button 
              onClick={() => this.generate()}
            >
              Generate
            </button>
          }
          {this.state.hasUploaded && this.state.errorMsg && 
            <p>{this.state.errorMsg}</p>
          }
      </div>
      <GeneratedArtwork 
        hasGenerated={this.state.hasGenerated}
        generatedArtwork={this.state.generatedArtwork}
      />
      <canvas 
        ref={this.tempCanvasRef}
        style={{ opacity: 0 }}
      />
    </div>
    );
  }
}

export default App;
