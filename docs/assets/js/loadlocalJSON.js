function parseContentJson(data) {
    var i;
    var content="";
    
    for (key in data) { 
      switch(data[key].shape)
      {
        case "box":
          content += renderDiv(key,data[key]);
          break;
        case "arrow-right":
          content += renderArrow(key,data[key],'right');
          break;
        case "arrow-left":
          content += renderArrow(key,data[key],'left');
          break;
        case "arrow-up":
          content += renderArrow(key,data[key],'up');
          break;
        case "arrow-down":
          content += renderArrow(key,data[key],'down');
          break;   
          case "line":
            content += renderLine(key,data[key]);
            break;
            case "lineconnect":
              content += renderLineConnect(key,data[key]);
              break;
      }
    }

    document.getElementById("content").innerHTML = content;
  }

  function renderDiv(key,value) {
    content = `
        <div id="${key}" 
             class="${value["event"]} 
                    ${value["shape"]}
                    " 
             style="
             width: ${value["width"]}px; 
             height: ${value["height"]}px; 
             background:${value["background"]};
             top: ${value["top"]}px;
             left: ${value["left"]}px" 
             onmouseover="select('${key}')">
             ${value["innerText"]}
        </div>
        `
    return content;
  }

  function renderArrow(key,value,direction){
    let content = '';
    switch(direction) {
      case 'up':
        content += `
        <div id="${key}" 
             class="${value["event"]} noborder"
             style="
             width: 1px; 
             height:${+value["height"]}px;  
             background:${value["background"]};
             top: ${value["top"]}px;
             left: ${value["left"]}px" 
             onmouseover="select('${key}')">
             <div class="arrow-up dragable" style = "top: -10px;left:0px;"></div>
             <div
              style="transform: translate(0,50%)";
             >${value["innerText"]}</div>
        </div>
        `     
        break;
      case 'down':
        content += `
        <div id="${key}" 
             class="${value['event']} noborder"
             style="
             width: 1px; 
             height:${+value['height']}px;  
             background:${value['background']};
             top: ${value['top']}px;
             left: ${value['left']}px" 
             onmouseover="select('${key}')">
             <div class="arrow-down dragable" style = "
                top: ${+value['height'] - 10}px;
                left:0px;"></div>
             <div
                style="transform: translate(0,50%)"; class="noborder"
             >${value['innerText']}</div>
        </div>
        `
        break;
      case 'left':
        `
        <div id="${key}" 
             class="${value['event']} noborder"
             style="
             width: ${value['width']}px; 
             height: 1px; 
             background:${value['background']};
             top: ${value['top']}px;
             left: ${value['left']}px;" 
             onmouseover="select('${key}')">
             <div class="arrow-left" style="float:left;"></div>
             ${value['innerText']}
        </div>
        `
        break;
      case 'right':
        content += `
        <div id="${key}" 
            class="${value['event']} noborder"
            style="
            width: ${value['width']}px; 
            height: 1px; 
            background:${value['background']};
            top: ${value['top']}px;
            left: ${value['left']}px" 
            onmouseover="select('${key}')">
            <div class="arrow-right" style="float:right;"></div>
            ${value['innerText']}
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