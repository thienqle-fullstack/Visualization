function loadString(filename){
    var xmlDoc;
    //Any other browser
    if (window.DOMParser)
    { 
        parser=new DOMParser();
        xmlDoc=parser.parseFromString(filename,"text/xml");
    }
    //IE
    else 
    {
        xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async=false;
        xmlDoc.loadXML(filename); 
    } 
    parseContent(xmlDoc);
}

function parseContent(xmlDoc) {
    var i;
    var content="";
    var x = xmlDoc.getElementsByTagName("item");
    for (i = 0; i <x.length; i++) { 
      if(!x[i].getElementsByTagName("shape")[0].childNodes[0].nodeValue.includes("arrow")) {
      content += `
        <div id="${x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue}" 
             class="${x[i].getElementsByTagName("event")[0].childNodes[0].nodeValue} 
                    ${x[i].getElementsByTagName("shape")[0].childNodes[0].nodeValue}
                    " 
             style="
             width: ${x[i].getElementsByTagName("width")[0].childNodes[0].nodeValue}px; 
             height: ${x[i].getElementsByTagName("height")[0].childNodes[0].nodeValue}px; 
             background:${x[i].getElementsByTagName("background")[0].childNodes[0].nodeValue};
             top: ${x[i].getElementsByTagName("top")[0].childNodes[0].nodeValue}px;
             left: ${x[i].getElementsByTagName("left")[0].childNodes[0].nodeValue}px" 
             onmouseover="select('${x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue}')">
             ${x[i].getElementsByTagName("innerText")[0].childNodes[0].nodeValue}
        </div>
        `}
      else if (x[i].getElementsByTagName("shape")[0].childNodes[0].nodeValue == "arrow-right"){
        content += `
        <div id="${x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue}" 
             class="${x[i].getElementsByTagName("event")[0].childNodes[0].nodeValue}"
             style="
             width: ${x[i].getElementsByTagName("width")[0].childNodes[0].nodeValue}px; 
             height: 1px; 
             background:${x[i].getElementsByTagName("background")[0].childNodes[0].nodeValue};
             top: ${x[i].getElementsByTagName("top")[0].childNodes[0].nodeValue}px;
             left: ${x[i].getElementsByTagName("left")[0].childNodes[0].nodeValue}px" 
             onmouseover="select('${x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue}')">
             <div class="arrow-right" style="float:right;"></div>
             ${x[i].getElementsByTagName("innerText")[0].childNodes[0].nodeValue}
        </div>
        `
      }
      else if (x[i].getElementsByTagName("shape")[0].childNodes[0].nodeValue == "arrow-left"){
        content += `
        <div id="${x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue}" 
             class="${x[i].getElementsByTagName("event")[0].childNodes[0].nodeValue}"
             style="
             width: ${x[i].getElementsByTagName("width")[0].childNodes[0].nodeValue}px; 
             height: 1px; 
             background:${x[i].getElementsByTagName("background")[0].childNodes[0].nodeValue};
             top: ${x[i].getElementsByTagName("top")[0].childNodes[0].nodeValue}px;
             left: ${x[i].getElementsByTagName("left")[0].childNodes[0].nodeValue}px;" 
             onmouseover="select('${x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue}')">
             <div class="arrow-left" style="float:left;"></div>
             ${x[i].getElementsByTagName("innerText")[0].childNodes[0].nodeValue}
        </div>
        `
      } else if (x[i].getElementsByTagName("shape")[0].childNodes[0].nodeValue == "arrow-up"){
        content += `
        <div id="${x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue}" 
             class="${x[i].getElementsByTagName("event")[0].childNodes[0].nodeValue}"
             style="
             width: 1px; 
             height:${+x[i].getElementsByTagName("height")[0].childNodes[0].nodeValue}px;  
             background:${x[i].getElementsByTagName("background")[0].childNodes[0].nodeValue};
             top: ${x[i].getElementsByTagName("top")[0].childNodes[0].nodeValue}px;
             left: ${x[i].getElementsByTagName("left")[0].childNodes[0].nodeValue}px" 
             onmouseover="select('${x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue}')">
             <div class="arrow-up dragable" style = "top: -10px;left:0px;"></div>
             <div
              style="transform: translate(0,50%)";
             >${x[i].getElementsByTagName("innerText")[0].childNodes[0].nodeValue}</div>
        </div>
        `
      } else if (x[i].getElementsByTagName("shape")[0].childNodes[0].nodeValue == "arrow-down"){
        content += `
        <div id="${x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue}" 
             class="${x[i].getElementsByTagName("event")[0].childNodes[0].nodeValue}"
             style="
             width: 1px; 
             height:${+x[i].getElementsByTagName("height")[0].childNodes[0].nodeValue}px;  
             background:${x[i].getElementsByTagName("background")[0].childNodes[0].nodeValue};
             top: ${x[i].getElementsByTagName("top")[0].childNodes[0].nodeValue}px;
             left: ${x[i].getElementsByTagName("left")[0].childNodes[0].nodeValue}px" 
             onmouseover="select('${x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue}')">
             <div class="arrow-down dragable" style = "
                top: ${+x[i].getElementsByTagName("height")[0].childNodes[0].nodeValue - 10}px;
                left:0px;"></div>
             <div
              style="transform: translate(0,50%)";
             >${x[i].getElementsByTagName("innerText")[0].childNodes[0].nodeValue}</div>
        </div>
        `
      }
    }

    document.getElementById("content").innerHTML = content;
  }