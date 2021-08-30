import React from 'react';
import './DragAndDrop.css';

interface DragAndDropProps {
    onFile: (file:File) => void;
}

interface DragAndDropState {
    isDragging: boolean;
}

class DragAndDrop extends React.Component<DragAndDropProps, DragAndDropState> {
    private inputRef: React.RefObject<HTMLInputElement>;

    constructor(props: any){
      super(props);
      this.state = {
        isDragging: false
      }
      this.inputRef = React.createRef();
    }
  
    render(){
        return (
            <div className="DragAndDrop_container">
                <div
                    className={["DragAndDrop_div", this.state.isDragging ? "DragAndDrop_div_drag" : ""].join(" ")}
                    onClick={() => this.inputRef.current?.click()}
                    onDragOver={(e) => {
                        e.preventDefault();
                        this.setState({isDragging: true});
                    }}
                    onDragLeave={(e) => {
                        e.preventDefault();
                        this.setState({isDragging: false});
                    }}
                    onDrop={(e) => {
                        e.preventDefault();
                        this.setState({isDragging: false});
                        this.props.onFile(e.dataTransfer.files[0]);
                    }}

                >
                    <input
                    hidden
                    ref={this.inputRef} 
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={() => {
                        const input = this.inputRef.current;
                        if (input && input.files) {
                            this.props.onFile(input.files[0]);
                        }
                    }}
                    />
                    <p>Drag image here or click to select image file</p>
                </div>
            </div>
        );
    }
}

export default DragAndDrop;