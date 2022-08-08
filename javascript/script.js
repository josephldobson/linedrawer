canvdim = 2000
const artcanvas = document.getElementById('threadartcanvas1');
const artctx = artcanvas.getContext('2d');

artcanvas.height = canvdim;
artcanvas.width = canvdim;

// Create canvas for nodes
const nodescanvas = document.getElementById('nodecanvas1');
const nodesctx = nodescanvas.getContext('2d');

nodescanvas.height = canvdim;
nodescanvas.width = canvdim;

//Create canvas for image
const preview = document.getElementById('preview1');
const previewctx = preview.getContext('2d');

preview.height =canvdim;
preview.width = canvdim;

// Slide variable - NUMBER OF NODES
var non = document.getElementById("number_of_nodes");
var non_output = document.getElementById("number_of_nodes1");
non_output.innerHTML = non.value;
create_nodes(non.value,nodescanvas.height*0.48)
non.oninput = function() {
    non_output.innerHTML = this.value;
    nodesctx.clearRect(0, 0, nodescanvas.width, nodescanvas.height);
    create_nodes(non.value,nodescanvas.height*0.48);
}



// Preview the image before computation
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
                let ih = myImage.height;
                let iw = myImage.width;

                if(ih>=iw) { //rescale image size to fit circle
                    var iheight = ih*ch*0.96/iw;
                    var iwidth = ch*0.96;
                }
                if(ih<iw) { //rescale image size to fit circle
                    var iwidth = iw*ch*0.96/ih;
                    var iheight = ch*0.96;
                }
                let itop = ch/2 - iheight/2;
                let ileft = cw/2 - iwidth/2;
                previewctx.drawImage(myImage,ileft,itop,iwidth,iheight);
                previewctx.globalCompositeOperation='destination-in';
                previewctx.beginPath();
                previewctx.arc(cw/2,ch/2,ch/2,0,Math.PI*2);
                previewctx.closePath();
                previewctx.fill();
            }
        }
    }
});

//Creates grayscale matrix using luma algorithm
function grayscaleMatrix(mat){
    matlength = preview.width*preview.width
    var newmat = Array.from(Array(matlength).keys());
    var newmat = newmat.map(x => 255 - Math.floor(mat.data[x*4]*0.3+mat.data[x*4+1]*0.59+mat.data[x*4+2]*0.11));
    return newmat;
}

//Generates array of nodes for the algorithm
function generateArrayOfPoints(NoN){
    let cx = nodescanvas.width/2;
    let cy = nodescanvas.height/2;
    var Nodes = Array.from(Array(NoN).keys())
    var Nodes = Nodes.map(x => x/NoN*2*Math.PI)
    var Nodes = Nodes.map(x => [Math.round(cx + preview.height*0.48*Math.cos(x)), Math.round(cy + preview.height*0.48*Math.sin(x))])
    return Nodes
}


//Change pixels when line drawn
function changePixels(curr,next,nodes,immat) {
    var x0 = nodes[curr][0]
    var y0 = nodes[curr][1]
    var x1 = nodes[next][0]
    var y1 = nodes[next][1]
    var dx = Math.abs(x1 - x0);
    var dy = Math.abs(y1 - y0);
    var sx = (x0 < x1) ? 1 : -1;
    var sy = (y0 < y1) ? 1 : -1;
    var err = dx - dy;

    while(true) {
        //Punishing function
        immat[canvdim*y0+x0] = Math.floor(immat[canvdim*y0+x0]/2)

        if ((x0 === x1) && (y0 === y1)) break;
        var e2 = 2*err;
        if (e2 > -dy) { err -= dy; x0  += sx; }
        if (e2 < dx) { err += dx; y0  += sy; }
    }
}

//Find best line and updates image
function findBestNewPoint(Nodes,NON,curr,immat){
    var best = -1;
    var bestval = 0;
    for(var i = 0; i < NON; i++) {
        if(curr !== i) {
            var next = i;
            var val = evaluateSingleLine(curr,next,Nodes,immat);
            if(val>bestval){
                best = i;
                bestval = val
            }
        }
    }
    changePixels(curr,best,Nodes,immat)
    return best
}


//
function evaluateSingleLine(curr, next, nodes, immat) {
    var x0 = nodes[curr][0]
    var y0 = nodes[curr][1]
    var x1 = nodes[next][0]
    var y1 = nodes[next][1]
    var dx = Math.abs(x1 - x0);
    var dy = Math.abs(y1 - y0);
    var sx = (x0 < x1) ? 1 : -1;
    var sy = (y0 < y1) ? 1 : -1;
    var err = dx - dy;
    var Val = 0
    var len = 0
    while(true) {
        //Evaluating Function
        Val += immat[canvdim*y0+x0];
        if ((x0 === x1) && (y0 === y1)) break;
        var e2 = 2*err;
        if (e2 > -dy) { err -= dy; x0  += sx; }
        if (e2 < dx) { err += dx; y0  += sy; }
        len++
    }
    return Val/(len)
}

//Previews Layout of points before algorithm starts
function create_nodes(non, size){
    // Draw segments from theta = 0 to theta = 2PI
    let cx = nodescanvas.width/2;
    let cy = nodescanvas.height/2;
    for (theta = 0; theta <= Math.PI * 2; theta += Math.PI*2/non) {
        let x = cx + Math.cos(theta)*size
        let y = cy + Math.sin(theta)*size
        // Draw nodes
        nodesctx.beginPath();
        nodesctx.arc(x, y, Math.PI*size/non/3, 0, 2 * Math.PI);
        nodesctx.fill();
        nodesctx.stroke();
    }

}

function getInputsAndStart(){
    var NON = parseInt(non.value, 10)
    var matrix = previewctx.getImageData(0,0,preview.width, preview.height);
    var bwmatrix = grayscaleMatrix(matrix)
    previewctx.clearRect(0, 0, preview.width, preview.height);
    nodesctx.clearRect(0, 0, preview.width, preview.height);

    create_nodes(NON,preview.height*0.48);
    Nodes = generateArrayOfPoints(NON);
    before = 0
    for(var start = 1; start < 3*preview.width; start++) {
        setTimeout(function () {
            var after = findBestNewPoint(Nodes, NON,before,bwmatrix);
            ax = Nodes[before][0];
            ay = Nodes[before][1];
            bx = Nodes[after][0];
            by = Nodes[after][1];
            artctx.beginPath();
            artctx.moveTo(ax, ay);
            artctx.lineTo(bx, by);
            artctx.stroke();
            before = after
        }, 0);
    };
}