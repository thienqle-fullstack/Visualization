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
    parseContentXML(xmlDoc);
}

function parseContentXML(xmlDoc) {
    var i;
    var content="";
    var x = xmlDoc.getElementsByTagName("item");
    for (i = 0; i <x.length; i++) { 
      switch(x[i].getElementsByTagName("shape")[0].childNodes[0].nodeValue)
      {
        case "box":
          content += renderDiv(x[i]);
          break;
        case "arrow-right":
          content += renderArrow(x[i],'right');
          break;
        case "arrow-left":
          content += renderArrow(x[i],'left');
          break;
        case "arrow-up":
          content += renderArrow(x[i],'up');
          break;
        case "arrow-down":
          content += renderArrow(x[i],'down');
          break;   
          case "line":
            content += renderLine(x[i]);
            break;
            case "lineconnect":
              content += renderLineConnect(x[i]);
              break;
      }
    }

    document.getElementById("content").innerHTML = content;
  }

  function renderDiv(x) {
    content = `
        <div id="${x.getElementsByTagName("id")[0].childNodes[0].nodeValue}" 
             class="${x.getElementsByTagName("event")[0].childNodes[0].nodeValue} 
                    ${x.getElementsByTagName("shape")[0].childNodes[0].nodeValue}
                    " 
             style="
             width: ${x.getElementsByTagName("width")[0].childNodes[0].nodeValue}px; 
             height: ${x.getElementsByTagName("height")[0].childNodes[0].nodeValue}px; 
             background:${x.getElementsByTagName("background")[0].childNodes[0].nodeValue};
             top: ${x.getElementsByTagName("top")[0].childNodes[0].nodeValue}px;
             left: ${x.getElementsByTagName("left")[0].childNodes[0].nodeValue}px" 
             onmouseover="select('${x.getElementsByTagName("id")[0].childNodes[0].nodeValue}')">
             ${x.getElementsByTagName("innerText")[0].childNodes[0].nodeValue}
        </div>
        `
    return content;
  }

  function renderArrow(x,direction){
    let content = '';
    switch(direction) {
      case 'up':
        content += `
        <div id="${x.getElementsByTagName("id")[0].childNodes[0].nodeValue}" 
             class="${x.getElementsByTagName("event")[0].childNodes[0].nodeValue} noborder"
             style="
             width: 1px; 
             height:${+x.getElementsByTagName("height")[0].childNodes[0].nodeValue}px;  
             background:${x.getElementsByTagName("background")[0].childNodes[0].nodeValue};
             top: ${x.getElementsByTagName("top")[0].childNodes[0].nodeValue}px;
             left: ${x.getElementsByTagName("left")[0].childNodes[0].nodeValue}px" 
             onmouseover="select('${x.getElementsByTagName("id")[0].childNodes[0].nodeValue}')">
             <div class="arrow-up dragable" style = "top: -10px;left:0px;"></div>
             <div
              style="transform: translate(0,50%)";
             >${x.getElementsByTagName("innerText")[0].childNodes[0].nodeValue}</div>
        </div>
        `     
        break;
      case 'down':
        content += `
        <div id="${x.getElementsByTagName("id")[0].childNodes[0].nodeValue}" 
             class="${x.getElementsByTagName("event")[0].childNodes[0].nodeValue} noborder"
             style="
             width: 1px; 
             height:${+x.getElementsByTagName("height")[0].childNodes[0].nodeValue}px;  
             background:${x.getElementsByTagName("background")[0].childNodes[0].nodeValue};
             top: ${x.getElementsByTagName("top")[0].childNodes[0].nodeValue}px;
             left: ${x.getElementsByTagName("left")[0].childNodes[0].nodeValue}px" 
             onmouseover="select('${x.getElementsByTagName("id")[0].childNodes[0].nodeValue}')">
             <div class="arrow-down dragable" style = "
                top: ${+x.getElementsByTagName("height")[0].childNodes[0].nodeValue - 10}px;
                left:0px;"></div>
             <div
                style="transform: translate(0,50%)"; class="noborder"
             >${x.getElementsByTagName("innerText")[0].childNodes[0].nodeValue}</div>
        </div>
        `
        break;
      case 'left':
        `
        <div id="${x.getElementsByTagName("id")[0].childNodes[0].nodeValue}" 
             class="${x.getElementsByTagName("event")[0].childNodes[0].nodeValue} noborder"
             style="
             width: ${x.getElementsByTagName("width")[0].childNodes[0].nodeValue}px; 
             height: 1px; 
             background:${x.getElementsByTagName("background")[0].childNodes[0].nodeValue};
             top: ${x.getElementsByTagName("top")[0].childNodes[0].nodeValue}px;
             left: ${x.getElementsByTagName("left")[0].childNodes[0].nodeValue}px;" 
             onmouseover="select('${x.getElementsByTagName("id")[0].childNodes[0].nodeValue}')">
             <div class="arrow-left" style="float:left;"></div>
             ${x.getElementsByTagName("innerText")[0].childNodes[0].nodeValue}
        </div>
        `
        break;
      case 'right':
        content += `
        <div id="${x.getElementsByTagName("id")[0].childNodes[0].nodeValue}" 
            class="${x.getElementsByTagName("event")[0].childNodes[0].nodeValue} noborder"
            style="
            width: ${x.getElementsByTagName("width")[0].childNodes[0].nodeValue}px; 
            height: 1px; 
            background:${x.getElementsByTagName("background")[0].childNodes[0].nodeValue};
            top: ${x.getElementsByTagName("top")[0].childNodes[0].nodeValue}px;
            left: ${x.getElementsByTagName("left")[0].childNodes[0].nodeValue}px" 
            onmouseover="select('${x.getElementsByTagName("id")[0].childNodes[0].nodeValue}')">
            <div class="arrow-right" style="float:right;"></div>
            ${x.getElementsByTagName("innerText")[0].childNodes[0].nodeValue}
        </div>
        `
        break;
    }

    return content;
  }


  
  function renderLine(e) {
    let line = `<svg id="${e.getElementsByTagName("id")[0].childNodes[0].nodeValue}" 
                width="100%" 
                height="100%">
                <line x1="${e.getElementsByTagName("startX")[0].childNodes[0].nodeValue}" 
                      y1="${e.getElementsByTagName("startY")[0].childNodes[0].nodeValue}"
                      x2="${e.getElementsByTagName("endX")[0].childNodes[0].nodeValue}" 
                      y2="${e.getElementsByTagName("endY")[0].childNodes[0].nodeValue}" 
                stroke="black"
                stroke-width="6px"/></svg>`
    return line;
  }

  function renderLineConnect(e) {
    
    let line = '';
    //Wait for document fully loaded by this loop
    let stateCheck = setInterval(() => {
      if (document.readyState === 'complete') {
        clearInterval(stateCheck);
          //Document is ready here. Render a line start here
          let startX,startY,endX,endY ;
          startX = startY = endX = endY = 0;
          let startId = e.getElementsByTagName("start")[0].childNodes[0].nodeValue;
          let endId = e.getElementsByTagName("end")[0].childNodes[0].nodeValue;
          console.log(startId)
          let start = document.getElementById(startId);
          let end = document.getElementById(endId);

          startX = start.offsetLeft + start.offsetWidth/2;
          startY = start.offsetTop + start.offsetHeight/2;
          endX = end.offsetLeft + end.offsetWidth/2;
          endY = end.offsetTop + end.offsetHeight/2;
          
            line += `<svg id="${e.getElementsByTagName("id")[0].childNodes[0].nodeValue}" 
                        width="100%" 
                        height="100%">
                        <line x1="${startX}" 
                              y1="${startY}"
                              x2="${endX}" 
                              y2="${endY}" 
                        stroke="black"
                        stroke-width="6px"/></svg>`
           
           document.getElementById("content").innerHTML += line;
      }
    }, 100);

    
  }
