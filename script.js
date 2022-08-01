const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
console.log(canvas);
canvas.height = window.innerHeight
canvas.width = window.innerWidth

var non = document.getElementById("number_of_nodes");
var non_output = document.getElementById("number_of_nodes1");
non_output.innerHTML = non.value;
create_nodes(non.value,canvas.height*0.48)
non.oninput = function() {
    non_output.innerHTML = this.value;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    create_nodes(non.value,canvas.height*0.48)
}

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



