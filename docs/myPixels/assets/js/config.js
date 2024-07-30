const color = {
    0: 'transparent',
    1: 'black',
    2: 'gray',
    3: 'red',
    4: 'green',
    5: 'blue',
    6: 'yellow',
    7: 'orange',
    8: 'magenta',
    9: 'cyan',
    10: 'brown',
    11: 'white'
}

const colorValue = {
    0: [245,245,245,0],
    1: [0,0,0,255],
    2: [128,128,128,255],
    3: [255,0,0,255],
    4: [0,200,0,255],
    5: [0,0,254,255],
    6: [255,255,0,255],
    7: [255,127,0,255],
    8: [255,0,255,255],
    9: [0,255,255,255],
    10: [165, 42, 42,255],
    11: [255,255,255,255],
}

let selectedColor = 2


let style = {
    PEN: 0,
    BRUSH: 1,
    PAINT: 2,
    LINE: 3,
    SQUARE: 4,     
    CIRCLE: 5,
}

let styleName = {
    0: "P",
    1: "L",
    2: "PT",
    3: "BR",
    4: "C",
    5: "SQ"
    
}

let viewPalette = []
const COLORMODE = {
    GRAYSCALE: 0,
    COLOR: 1
} 

let viewStatus = COLORMODE.GRAYSCALE;
let matrixGS = []
let grayScaleValue = []
