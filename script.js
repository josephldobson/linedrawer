// Create canvas for nodes and lines
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

canvas.height = window.visualViewport.height
canvas.width = window.visualViewport.width

//Create canvas for image
const preview = document.getElementById('preview1');
const previewctx = preview.getContext('2d');

preview.height = window.visualViewport.height
preview.width = window.visualViewport.width
// Slide variable
var non = document.getElementById("number_of_nodes");
var non_output = document.getElementById("number_of_nodes1");
non_output.innerHTML = non.value;
create_nodes(non.value,canvas.height*0.48)
non.oninput = function() {
    non_output.innerHTML = this.value;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    create_nodes(non.value,canvas.height*0.48)
}

let imgInput = document.getElementById('imageInput');
imgInput.addEventListener('change', function(e) {
    if(e.target.files) {
        previewctx.clearRect(0,0,preview.width,preview.height)
        let imageFile = e.target.files[0]; //here we get the image file
        var reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onloadend = function (e) {
            var myImage = new Image(); // Creates image object
            myImage.src = e.target.result; // Assigns converted image to image object
            myImage.onload = function(ev) {
                let cw = preview.width;
                let ch = preview.height;
                centx = preview.width/2 - myImage.width/2;
                centy = preview.height/2 - myImage.height/2;
                previewctx.drawImage(myImage,centx,centy); // Draws the image on canvas
                previewctx.globalCompositeOperation='destination-in';
                previewctx.beginPath();
                previewctx.arc(cw/2,ch/2,ch/2-50,0,Math.PI*2);
                previewctx.closePath();
                previewctx.fill();
                let imgData = myCanvas.toDataURL("image/jpeg",0.75); // Assigns image base64 string in jpeg format to a variable
            }
        }
    }
});

function create_nodes(non, size){
    // Draw segments from theta = 0 to theta = 2PI
    let cx = canvas.width/2;
    let cy = canvas.height/2;
    for (theta = 0; theta <= Math.PI * 2; theta += Math.PI*2/non) {
        let x = cx + Math.cos(theta)*size
        let y = cy + Math.sin(theta)*size
        // Draw nodes
        ctx.beginPath();
        ctx.arc(x, y, Math.PI*size/non/3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        // Append nodes to array
    }

}

function getInputsAndStart(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    create_nodes(non.value,canvas.height*0.48)
}

// This will log the width of the viewport
console.log(window.innerWidth);

// This will log the width of the frame viewport within a frameset
console.log(self.innerWidth);

// This will log the width of the viewport of the closest frameset
console.log(parent.innerWidth);

// This will log the width of the viewport of the outermost frameset
console.log(top.innerWidth);