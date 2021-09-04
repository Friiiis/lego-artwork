import React from 'react';
import './App.css';
import ConfigureArtwork from './components/configureartwork/ConfigureArtwork';
import DragAndDrop from './components/draganddrop/DragAndDrop';
import GeneratedArtwork from './components/generatedartwork/GeneratedArtwork';
import Helper from './res/Helper';
// import html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface AppState {
  hasUploaded: boolean;
  hasGenerated: boolean;
  printing: boolean;
  generatedArtwork: {name:string, hex:string}[][];
  artworkHeight: number;
  artworkWidth: number;
  canvasHeight: number;
  canvasWidth: number;
  errorMsg: string;
  colors: {name: string, hex: string, exclude?: boolean}[];
  fromURL: boolean;
}

class App extends React.Component<{}, AppState> {
  private canvasRef: React.RefObject<HTMLCanvasElement>;
  private tempCanvasRef: React.RefObject<HTMLCanvasElement>;

  constructor(props: any){
    super(props);
    const colors = require('./res/colors.json');
    this.state = {
      hasUploaded: false,
      hasGenerated: false,
      printing: false,
      generatedArtwork: [[]],
      artworkHeight: 0,
      artworkWidth: 50,
      canvasHeight: 0,
      canvasWidth: 0,
      errorMsg: "",
      colors: colors,
      fromURL: false
    }
    this.canvasRef = React.createRef();
    this.tempCanvasRef = React.createRef();
  }

  componentDidMount() {
    if (window.location.hash && window.location.hash !== "#") {
      try {
        const artwork = JSON.parse(decodeURI(window.location.hash.substr(1))) as {name:string, hex:string}[][];
        this.setState({
          fromURL: true,
          hasGenerated: true,
          generatedArtwork: artwork,
          artworkWidth: artwork[0].length,
          artworkHeight: artwork.length
        });
      } catch (error) {
        this.setState({fromURL: false});
      }
    } else {
      this.setState({fromURL: false});
    }
  }

  private onFile(file:File) {
    this.setState({fromURL: false}, () => {
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
          
          var resetColors = this.state.colors.map((c) => {
          return {name: c.name, hex: c.hex, exclude: false};
        });
        
        this.setState({
          hasUploaded: true, 
          hasGenerated: false,
          generatedArtwork: [[]],
          canvasHeight: image.height, 
          canvasWidth: image.width,
          colors: resetColors,
          fromURL: false
        }, () => {
          window.history.replaceState(null, "", " ");
          this.resizeArtwork(this.state.artworkWidth);
        });
        }
        image.src = event.target?.result as string;
      }
      
      reader.readAsDataURL(file);
    });
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
    var errorMsg = ""
    if (
      !this.state.artworkHeight ||
      !this.state.artworkWidth
      ) {
      errorMsg = "Please choose a size larger than 0"
    } else if (
      this.state.artworkHeight <= 0 ||
      this.state.artworkWidth <= 0
      ) {
      errorMsg = "Please choose a size larger than 0"
    } else if (
      this.state.artworkHeight > 500 ||
      this.state.artworkWidth > 500
      ){
      errorMsg = "Size can't be bigger than 500"
    }

    this.setState({
      errorMsg: errorMsg,
      printing: false
    });

    if(errorMsg !== ""){
      return
    }

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
      arr[row].push(Helper.getClosestColor(Helper.rgbToHex(red, green, blue), this.state.colors));

      if (((i + 4) % (width * 4)) === 0) {
        row++;
      }
    }

    this.setState({generatedArtwork: arr, hasGenerated: true});
  }

  private downloadPDF(){
    this.setState({
      printing: true
    }, () => {
      var artwork = document.getElementById('printArtwork') as HTMLElement;
      var bricks = document.getElementById('printBricks') as HTMLElement;
      html2canvas(artwork).then((artworkCanvas) => {
        const margin = 30;
        var pdf = new jsPDF('p','px', 'a4');
        let width = pdf.internal.pageSize.getWidth() - margin;
        let height = pdf.internal.pageSize.getHeight() - margin;

        let widthRatio = width / artworkCanvas.width;
        let heightRatio = height / artworkCanvas.height;

        let ratio = widthRatio > heightRatio ? heightRatio : widthRatio;

        pdf.addImage(
          artworkCanvas, 
          'JPEG', 
          margin/2, 
          margin/2, 
          artworkCanvas.width * ratio, 
          artworkCanvas.height * ratio
        );

        html2canvas(bricks).then((bricksCanvas) => {
          pdf.addPage();

          let bricksWidth = bricksCanvas.width;
          let bricksHeight = bricksCanvas.height;
          
          if (bricksCanvas.height > (height - margin)) {
            let widthRatio = (width - margin) / bricksCanvas.width;
            let heightRatio = (height - margin) / bricksCanvas.height;
    
            let ratio = widthRatio > heightRatio ? heightRatio : widthRatio;
            bricksWidth = bricksWidth * ratio;
            bricksHeight = bricksHeight * ratio;
          }

          pdf.addImage(
            bricksCanvas, 
            'JPEG', 
            margin, 
            margin, 
            bricksWidth, 
            bricksHeight
          );
          
          pdf.output('dataurlnewwindow');

          this.setState({printing: false});
        });
      });
    });
  }

  private getURL(){
    var encoded = encodeURI(JSON.stringify(this.state.generatedArtwork));
    console.log(encoded);
    var decoded = JSON.parse(decodeURI(encoded));
    console.log(decoded);
    window.open("http://localhost:3000/#" + encoded, '_blank');
  }

  render() {
    return (
      <div className="App">
        { this.state.printing && 
          <div className="App_print_overlay">
            <h1>Generating PDF...</h1>
          </div>
        }
        <div className="App_container">
          <header>
            <h1>
              LEGO artwork creator
            </h1>
            <p>
              The LEGO artwork creator lets you upload your own images to easily create LEGO pixel art. 
              If you need inspiration on how to build the frame for your artwork, I recommend looking at 
              the official LEGO Art building instructions (such as the <a
                href="https://www.lego.com/en-us/product/andy-warhols-marilyn-monroe-31197" 
                rel="noreferrer" 
                target="_blank"
              >Marylin Monroe</a> artwork).
            </p>
          </header>
          <DragAndDrop
            onFile={(file) => this.onFile(file)}
          />
          {!this.state.fromURL &&
            <ConfigureArtwork 
              canvasRef={this.canvasRef}
              showConfig={this.state.hasUploaded}
              artworkHeight={this.state.artworkHeight}
              artworkWidth={this.state.artworkWidth}
              canvasHeight={this.state.canvasHeight}
              canvasWidth={this.state.canvasWidth}
              resizeArtwork={this.resizeArtwork.bind(this)}
              colors={this.state.colors}
              
              excludeColor={(i) => {
                var colors = this.state.colors;
                colors[i]["exclude"] = !!!colors[i]["exclude"];
                this.setState({colors: colors});
              }}
            /> 
          }
          {(this.state.hasUploaded || this.state.fromURL) && 
            <>
              <p>Final size in LEGOs: {this.state.artworkWidth} x {this.state.artworkHeight} bricks</p>
              {this.state.hasUploaded && this.state.errorMsg && 
                <p><b>{this.state.errorMsg}</b></p>
              }
              <div className="App_button_container">
                <button 
                  disabled={this.state.fromURL}
                  onClick={() => this.generate()}
                >
                  Generate
                </button>
                <button
                  disabled={!this.state.hasGenerated}
                  onClick={() => this.downloadPDF()}
                >
                  Download PDF
                </button>
                <button
                  disabled={!this.state.hasGenerated}
                  onClick={() => this.getURL()}
                >
                  Get URL
                </button>
              </div>
            </>
          }
      </div>
      <GeneratedArtwork 
        hasGenerated={this.state.hasGenerated}
        generatedArtwork={this.state.generatedArtwork}
        printing={this.state.printing}
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
