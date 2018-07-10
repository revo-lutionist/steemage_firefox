var mCount = 0;
var mHost = window.localStorage.getItem("host");

document.addEventListener("DOMContentLoaded", () => {
    //show loader gif
    document.getElementById("loader").style.display = "block";
});

//listen for message from background.js
chrome.runtime.onMessage.addListener(
    function(request) {
      if (request.message == "ready")
        document.getElementById("loader").style.display = "none";
        outputImages();
});

async function outputImages() {
    var arrImgObjects = JSON.parse(window.localStorage.getItem("images"));

    for (var objImg of arrImgObjects) {
        //correct known parsing issue (there may be more to be discovered)
        objImg.image = objImg.image.replace(/\(/g, "\\(");
        objImg.image = objImg.image.replace(/\)/g, "\\)");

        //exclude gifs, as they are more likely to be fillers
        if(!(objImg.image.includes(".gif") || objImg.image.includes(".GIF"))) {
            await createImage(objImg);
        }
    }
}

//load current image into a temporary image element to determine it's dimensions
//Don't output images below a certain size
function createImage(objImg) {
    var img = new Image;

    img.onload = function(){
        var height = img.height;
        var width = img.width;
        if(height > 319) {
            output(objImg);
        }

        return true;        
    }

    img.src = objImg.image;
}

function output(objImg) {
    mCount++;
    console.log(objImg.postURL)
    
    //create image and container elements and append to existing column divs in steemage.html
    var divOuterContainer = document.createElement("div");
    var anchor = document.createElement("a");
    var anchorPost = document.createElement("a");
    var img = document.createElement("img");
    var imgPost = document.createElement("img");

    img.setAttribute("src", "https://steemitimages.com/600x400/" + objImg.image);

    anchor.appendChild(img);
    anchor.setAttribute("href", objImg.image);
    anchor.setAttribute("target", "_blank");
    //anchor.setAttribute("title", "View image");

    //'show post' icon
    anchorPost.setAttribute("id", "imgPost");
    anchorPost.setAttribute("title", "Go to blog post");
    anchorPost.setAttribute("href", mHost + objImg.postURL);
    anchorPost.setAttribute("target", "_blank");
    anchorPost.appendChild(imgPost);
    imgPost.setAttribute("src", "/images/post.png");

    //append anchors to div, then append to columns
    divOuterContainer.appendChild(anchor);
    divOuterContainer.appendChild(anchorPost);
    document.getElementById(mCount.toString()).appendChild(divOuterContainer);  //this is a column

    divOuterContainer.classList.add("outerContainer");

    //3 columns only
    if (mCount == 3) {
        mCount = 0;
    }
}


