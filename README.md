# BasicGeometry

Allows you to calculate the volume, area or perimeter of all common geometric shapes in the desired unit. You can see a practical example on my website (in french) : [ScienceSky](https://sciencesky.fr/Mathematiques/Formules/Volume/index.php).

## Get started

First of all, add `BasicGeometry` to your HTML page:

```
<script src="BasicGeometry.js"></script>
```

Then, you need to create a new instance of `BasicGeometry`:

```
var geometry = new BasicGeometry(defaultShape); // you can give a default shape (the name of the shape, see below) 
```

## Calculate a volume

You can calculate the volume of a specific shape with the method: `volume()` from `geometry`:

```
var geometry = new BasicGeometry();

var data = new Map();
data.set('R', { value: 3, unit: 'cm' });

var volume = geometry.volume(data, "cm3", "Globe");
// volume = 113.09733552923255
```

In this exemple, the volume of a globe with a radius of 5 cm is 113.09733552923255 cm3. Before going any further in unit conversions, I present you a table recapitulating all the shapes and their associated formula as it is written in javascript:

|Name|Formula|Data|
|----|-------|----|
|cube|c * c * c|c|
|paver|L * _l_ * h|L, _l_, h|
|prism|(b * h * p) / 2|b, h, p|
|cylinder|Math.PI * R**2 * h|R, h|
|cone|(Math.PI * R**2 * h) / 3|R, h|
|pyramid|(L * _l_ * h) / 3|L, _l_, h|
|globe|(4 * Math.PI * R**3) / 3|R|
|torus|(2 * Math.PI** 2) * r**2 * R|r, R|
|regular_octahedron or regular octahedron or octahedron|(Math.sqrt(2) / 3) * a**3|a|
|truncated_cylinder or truncated cylinder|(Math.PI * R**2 * (H + h)) / 2|R, H, h|
|truncated_cone or truncated cone|h * (Math.PI / 3) * (r**2 + R **2 + r * R)|h, r, R|
|truncated_pyramid or truncated pyramid|(h * (B + b + Math.sqrt(B * b))) / 3|h, B, b|

In the code, the **name has to correspond** (except for the capital letters), and **the letters too**. For example, in the calculation of the volume of a globe, it has to be '**R**'. **Look at the formulas to identify the necessary name of all variables**.

## The units

By default, the data are in centimeters (the 'classic unit'), and the default unit for the volume is `cm3` but you can modify these informations in order have more calculation flexibility. For exemple:

```
var geometry = new BasicGeometry();

var data = new Map();
data.set('L', { value: 50, unit: 'mm' });
data.set('l', { value: 50, unit: 'mm' });
data.set('h', { value: 5,  unit: 'cm' });

var volume = geometry.volume(data, "cm3", "Paver");
// volume = 125 (cm3)
// Despite the difference in data units, the result is correct.
```

## Calculate an area

You can calculate the area of a specific shape with the method: `area()` from `geometry`:

```
var geometry = new BasicGeometry();

var data = new Map();
data.set('r', { value: 50, unit: 'mm' });
data.set('h', { value: 5,  unit: 'cm' });

var area = geometry.area(data, "cm2", "cylinder");
// area = 314.1592653589793 (cm2)
```

The list of all the available shapes:

|Name|Formula|Data|
|----|-------|----|
|square|c * c|c|
|rectangle or oblong|L * _l_|L, _l_|
|parallelogram|b * h|b, h|
|lozenge, lozenge1, rhombus, rhombus1, rhomb, rhomb1, diamond, diamond1|(d * D) / 2|d, D|
|lozenge2, rhombus2, rhomb2, diamond2|c * h|c, h|
|triangle|(b * h) / 2|b, h|
|trapeze or trapezium|((B + b) * h) / 2|B, b, h|
|circle or disk|Math.PI * r**2|r|
|right prism or right_prism|2 * A + P * h (Area of a base and Perimeter of a base)|h, A, P|
|cylinder|2 * Math.PI * r * (h + r)|r, h|
|cone|Math.PI * r * (r + Math.sqrt(h**2 + r **2))|r, h|
|sphere|4 * Math.PI * r**2|r|

In the code, the **name has to correspond** (except for the capital letters), and **the letters too**. For example, in the calculation of the volume of a globe, it has to be '**R**'. **Look at the formulas to identify the necessary name of all variables**.

## Calculate a perimeter

You can calculate the perimeter of a specific shape with the method: `perimeter()` from `geometry`:

```
var geometry = new BasicGeometry();

var data = new Map();
data.set('L', { value: 50, unit: 'mm' });
data.set('l', { value: 5,  unit: 'cm' });

var perimeter = geometry.perimeter(data, "cm", "rectangle");
// perimeter = 20 (cm)
```

|Name|Formula|Data|
|----|-------|----|
|square|4 * c|c|
|rectangle|2 * (L + _l_)|L, _l_|
|lozenge, rhombus, rhomb, diamond|4 * c|c|
|circle or disk|2 * Math.PI * r|r|
|triangle|a + b + c|a, b, c|

In the code, the **name has to correspond** (except for the capital letters), and **the letters too**. For example, in the calculation of the volume of a globe, it has to be '**R**'. **Look at the formulas to identify the necessary name of all variables**.

## Last details

These three lines do exactly the same thing :

```
data.set('r', { value: 5, unit: 'cm' });
data.set('r', { value: 5, unit: geometry.getdefaultClassicUnit() });
data.set('r', { value: 5 });
```

Therefore, you have: `getdefaultClassicUnit()` (cm), `getDefaultSquareUnit()` (cm2), `getDefaultVolumeUnit()` (cm3). You can also use: `setDefaultShape()` and `setDefaultShape()`.

## License

MIT License.