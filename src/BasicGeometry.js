class Units {
    constructor(step, units) {
        this.STEP = step;
        this.UNITS = units;
    }

    getStep() {return this.STEP;}
    setStep(step) {this.STEP=step;}

    getUnits() {return this.UNITS;}
    setUnits(units) {this.UNITS=units;}
}

class CubicMeters extends Units {
    constructor() {
        super(3, ["km3", "hm3", "dam3", "m3", "dm3", "cm3", "mm3"]);
    }
}

class SquareMeters extends Units {
    constructor() {
        super(2, ["km2", "hm2", "dam2", "m2", "dm2", "cm2", "mm2"]);
    }
}

class Meters extends Units {
    constructor() {
        super(1, ["km", "hm", "dam", "m", "dm", "cm", "mm"]);
    }
}

class BasicGeometry {
    constructor(defaultShape) {
        this.defaultShape = defaultShape;
        this.defaultClassicUnit = "cm";
        this.defaultSquareUnit = "cm2";
        this.defaultVolumeUnit = "cm3";
        this.currentClassicUnit = null;
        this.currentData = null;
    }

    setDefaultShape(shape) { this.defaultShape = shape; }
    getDefaultShape() { return this.defaultShape; }
    getdefaultClassicUnit() { return this.defaultClassicUnit; }
    getDefaultSquareUnit() { return this.defaultSquareUnit; }
    getDefaultVolumeUnit() { return this.defaultVolumeUnit; }

    /// Returns the new value of input in the wanted unit.
    /// /!\ : It converts numbers of the same type. It can't convert m3 in L
    convertUnits(input, output, units) {
        var indexOfInput = 0;
        var indexOfOutput = 0;
        var UNITS = units.getUnits();
        var STEP = units.getStep();

        for (var i = 0; i < UNITS.length; i++) {
            if (UNITS[i] === input.unit) {
                indexOfInput = i;
            }
            if (UNITS[i] === output.unit) {
                indexOfOutput = i;
            }
        }

        var diff = indexOfOutput - indexOfInput;

        if (diff === 0) {
            return input.value;
        } else {
            var coef = 10**(diff * STEP);
            var newvalue = input.value * coef;
            return newvalue;
        }
    }

    /// [letter] is the name of the letter in the formula.
    _extrapolate(letter) {
        var data = this.currentData;
        var to = this.currentClassicUnit;

        if (!data.get(letter)) {
            throw new Error("BasicGeometry doesn't find the correct letter in data : '" + letter + "'.");
        }

        return this.convertUnits({
            value: data.get(letter).value,
            unit: data.get(letter).unit || this.defaultClassicUnit
        }, {unit: to}, new Meters());
    }

    _deterResultOfCalculations(classicUnit, value, resultUnit, UNIT) {
        return this.convertUnits({
            unit: classicUnit,
            value: value
        }, {unit: resultUnit}, UNIT);
    }

    _deterClassicUnit() {
        var data = this.currentData;
        return Array.from(data.entries())[0][1].unit;
    }

    perimeter(data, resultUnit, shape) {
        if (!shape) {
            if (!this.defaultShape) {
                throw new Error("BasicGeometry : no shape given !");
            } else {
                shape = this.defaultShape;
            }
        }

        if (!resultUnit) resultUnit = this.defaultClassicUnit;

        this.currentData = data;
        this.currentClassicUnit = this._deterClassicUnit() || this.defaultClassicUnit;
        var formula = null;

        switch (shape.trim().toLowerCase()) {
            case "square":
                var c = this._extrapolate('c');
                formula = 4 * c;
                break;
            
            case "rectangle": case "oblong":
                var L = this._extrapolate('L');
                var l = this._extrapolate('l');
                formula = 2 * (L + l);
                break;
            
            case "lozenge": case "rhombus": case "rhomb": case "diamond":
                var c = this._extrapolate('c');
                formula = 4 * c;
                break;
            
            case "circle": case "disk":
                var r = this._extrapolate('r');
                formula = 2 * Math.PI * r;
                break;

            case "triangle":
                var a = this._extrapolate('a');
                var b = this._extrapolate('b');
                var c = this._extrapolate('c');
                formula = a + b + c;
                break;
            
            default:
                formula = false;
                break;
        }

        var p = this._deterResultOfCalculations(this.currentClassicUnit, formula, resultUnit, new Meters());
        // console.log(`${formula} ${this.currentClassicUnit} = ${p} ${resultUnit}`);
        
        return p;
    }

    area(data, resultUnit, shape) {
        if (!shape) {
            if (!this.defaultShape) {
                throw new Error("BasicGeometry : no shape given !");
            } else {
                shape = this.defaultShape;
            }
        }

        if (!resultUnit) resultUnit = this.defaultSquareUnit;

        this.currentData = data;
        this.currentClassicUnit = this._deterClassicUnit() || this.defaultClassicUnit;
        var formula = null;

        switch (shape.trim().toLowerCase()) {
            case "square":
                var c = this._extrapolate('c');
                formula = c * c;
                break;
            
            case "rectangle": case "oblong":
                var L = this._extrapolate('L');
                var l = this._extrapolate('l');
                formula = L * l;
                break;
            
            case "parallelogram":
                var b = this._extrapolate('b');
                var h = this._extrapolate('h');
                formula = b * h;
                break;
            
            // https://tutors.com/math-tutors/geometry-help/how-to-find-the-area-of-a-rhombus
            case "lozenge": case "lozenge1": case "rhombus": case "rhombus1": case "rhomb": case "rhomb1": case "diamond": case "diamond1":
                var d = this._extrapolate('d');
                var D = this._extrapolate('D');
                formula = (d * D) / 2;
                break;
            
            case "lozenge2": case "rhombus2": case "rhomb2": case "diamond2":
                var c = this._extrapolate('c');
                var h = this._extrapolate('h');
                formula = c * h;
                break;
            
            case "triangle":
                var b = this._extrapolate('b');
                var h = this._extrapolate('h');
                formula = (b * h) / 2;
                break;

            case "trapeze": case "trapezium":
                var b = this._extrapolate('b');
                var B = this._extrapolate('B');
                var h = this._extrapolate('h');
                formula = ((B + b) * h) / 2;
                break;
                
            case "circle": case "disk":
                var r = this._extrapolate('r');
                formula = Math.PI * r**2;
                break;

            case "right prism": case "right_prism":
                var h = this._extrapolate('h'); // Height of the prism
                var A = this._extrapolate('A'); // Area of the base
                var P = this._extrapolate('P'); // Perimeter of the base
                formula = 2 * A + P * h;
                break;
            
            case "cylinder":
                var r = this._extrapolate('r');
                var h = this._extrapolate('h');
                formula = 2 * Math.PI * r * (h + r);
                break;
            
            case "cone":
                var r = this._extrapolate('r');
                var h = this._extrapolate('h');
                var apothem = Math.sqrt(h**2 + r**2);
                formula = Math.PI * r * (r + apothem);
                break;

            case "sphere":
                var r = this._extrapolate('r');
                formula = 4 * Math.PI * r**2;
                break;

            default:
                formula = false;
                break;
        }

        var a = this._deterResultOfCalculations(this.currentClassicUnit+"2", formula, resultUnit, new SquareMeters());
        // console.log(`${formula} ${this.currentClassicUnit}2 = ${a} ${resultUnit}`);
        
        return a;
    }

    volume(data, resultUnit, shape) {
        if (!shape) {
            if (!this.defaultShape) {
                throw new Error("BasicGeometry : no shape given !");
            } else {
                shape = this.defaultShape;
            }
        }

        if (!resultUnit) resultUnit = this.defaultVolumeUnit;

        // Set the current global variables (in order to simplify the calculations)
        this.currentData = data;
        this.currentClassicUnit = this._deterClassicUnit() || this.defaultClassicUnit;

        var formula = null;

        switch (shape.trim().toLowerCase()) {
            case "cube":
                var c = this._extrapolate('c');
                formula = c**3;
                break;

            case "paver":
                var L = this._extrapolate('L');
                var l = this._extrapolate('l');
                var h = this._extrapolate('h');
                formula = L * l * h;
                break;
            
            case "prism":
                var b = this._extrapolate('b');
                var h = this._extrapolate('h');
                var p = this._extrapolate('p');
                formula = (b * h * p) / 2;
                break;
            
            case "cylinder":
                var R = this._extrapolate('R');
                var h = this._extrapolate('h');
                formula = Math.PI * R**2 * h;
                break;
            
            case "cone":
                var R = this._extrapolate('R');
                var h = this._extrapolate('h');
                formula = (Math.PI * R**2 * h) / 3;
                break;

            case "pyramid":
                var L = this._extrapolate('L');
                var l = this._extrapolate('l');
                var h = this._extrapolate('h');
                formula = (L * l * h) / 3;
                break;

            case "globe":
                var R = this._extrapolate('R');
                formula = (4 * Math.PI * R**3) / 3;
                break;
            
            case "torus":
                var r = this._extrapolate('r');
                var R = this._extrapolate('R');
                formula = (2 * Math.PI**2) * r**2 * R;
                break;
            
            case "regular_octahedron": case "octahedron": case "regular octahedron":
                var a = this._extrapolate('a');
                formula = (Math.sqrt(2) / 3) * a**3;
                break;
            
            case "truncated_cylinder": case "truncated cylinder":
                var R = this._extrapolate('R');
                var H = this._extrapolate('H');
                var h = this._extrapolate('h');
                formula = (Math.PI * R**2 * (H + h)) / 2;
                break;
            
            case "truncated_cone": case "truncated cone":
                var h = this._extrapolate('h');
                var r = this._extrapolate('r');
                var R = this._extrapolate('R');
                formula = h * (Math.PI / 3) * (r**2 + R**2 + r * R);
                break;
            
            case "truncated_pyramid": case "truncated pyramid":
                var h = this._extrapolate('h');
                var B = this._extrapolate('B');
                var b = this._extrapolate('b');
                formula = (h * (B + b + Math.sqrt(B * b))) / 3;
                break;

            default:
                formula = false;
                break;
        }

        var v = this._deterResultOfCalculations(this.currentClassicUnit+"3", formula, resultUnit, new CubicMeters());
        // console.log(`${formula} ${this.currentClassicUnit}3 = ${v} ${resultUnit}`);
        
        return v;
    }
}