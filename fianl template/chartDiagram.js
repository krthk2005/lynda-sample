
/* /common/init.js*/


/* File: Basic Charts (chartDiag.latest.js)*/
(function () {

	var namespace = function (name) {
		var namespaces = name.split('.'),
			namespace = window,
			index;
		for (index = 0; index < namespaces.length; index += 1) {
			namespace = namespace[namespaces[index]] = namespace[namespaces[index]] || {};
		}
		return namespace;
	};

	namespace("chartDiag.default");
	namespace("chartDiag.default.perimeter");
	namespace("chartDiag.orgChart");
	namespace("chartDiag.famChart");
	namespace("chartDiag.text");
	namespace("chartDiag.callout");
	namespace("chartDiag.connector");
	namespace("chartDiag.shape");
	namespace("chartDiag.pdf");
	namespace("chartDiag.pdf.orgChart");
	namespace("chartDiag.pdf.famChart");
}());


chartDiag.default.isNullOrEmpty = function (value) {
	var result = true,
		string;
	if (value !== undefined && value !== null) {
		string = value.toString();
		if (string.length > 0) {
			result = false;
		}
	}
	return result;
};

/*
	Function: chartDiag.default.splitCamelCaseName
	Split string of merged cameled words into array.
	
	Parameters:
	name - The string to split.
	Returns: 
	array of split words
*/
chartDiag.default.splitCamelCaseName = function (name) {
	var result = [];
	var word = "";
	for (var i = 0; i < name.length; i += 1) {
		var c = name[i];
		if (c >= 'A' && c <= 'Z') {
			if (word !== "") {
				result.push(word);
			}
			word = c;
		} else {
			word += c;
		}
	}
	if (word !== "") {
		result.push(word);
	}
	return result;
};

/*
	Function: chartDiag.default.isEmptyObject
	Indicates whether the specified object is empty.
	
	Parameters:
	item - The object to test.
	Returns: 
	true if the item is object otherwise, false.
*/
chartDiag.default.isObject = function (item) {
	return item !== null && typeof item == 'object';
};

/*
	Function: chartDiag.default.isEmptyObject
	Indicates whether the specified object is empty.
	
	Parameters:
	item - The object to test.
	Returns: 
	true if the item is object otherwise, false.
*/
chartDiag.default.isEmptyObject = function (item) {
	var key;
	for (key in item) {
		if (item.hasOwnProperty(key)) {
			return false;
		}
	}
	return true;
};

/*
	Function: chartDiag.default.deepClone
	Makes deep copy of variable.
	
	Parameters:
	source - Source value.
	keepContext - if true then it makes _context reference property of every copied object
	callback - is function called for every object property function(result, source, property) {}

	Returns: 
	Copy of cloned variable.
*/

chartDiag.default.cloneObject = function (source, isShallow) {
	var result;
	if (source === null) {
		result = null;
	} else if (source instanceof Array) {
		if (isShallow) {
			result = source.slice(0);
		} else {
			result = [];
			for (var index = 0, len = source.length; index < len; index += 1) {
				result.push(chartDiag.default.cloneObject(source[index], isShallow));
			}
		}
	} else {
		switch (typeof source) {
			case 'object':
				result = {};
				for (var property in source) {
					if (source.hasOwnProperty(property)) {
						if (isShallow) {
							result[property] = source[property];
						} else {
							result[property] = chartDiag.default.cloneObject(source[property], isShallow);
						}
					}
				}
				break;
			default:
				result = source;
				break;
		}
	}
	return result;
};

/*
	Function: chartDiag.default.hashCode
	Returns hash code for specified string value.
	
	Parameters:
	value - The string to calculate hash code.
	Returns:
	int hash code.
*/
chartDiag.default.hashCode = function (value) {
	var hash = 0,
		character,
		i;
	/*ignore jslint start*/
	if (value.length > 0) {
		for (i = 0; i < value.length; i += 1) {
			character = value.charCodeAt(i);
			hash = ((hash << 5) - hash) + character;
			hash = hash & hash;
		}
	}
	/*ignore jslint end*/
	return hash;
};

/*
	Function: chartDiag.default.css
	This method assigns HTML element style attributes only if one of them does not match its current value.
	This function helps to reduce number of HTML page layout invalidations.
	
	Parameters:
	element - jQuery selector of element to be updated.
	attr - object containing style attributes.
*/
chartDiag.default.css = function (element, attr) {
	var attribute,
		value;
	if (element.hasOwnProperty("cssHash")) {
		for (attribute in attr) {
			if (attr.hasOwnProperty(attribute)) {
				value = attr[attribute];
				if (element.cssHash[attribute] != value) {
					element.cssHash[attribute] = value;
					element.css(attribute, value);
				}
			}
		}
	} else {
		element.css(attr);
		element.cssHash = attr;
	}
};

/*
	Function: chartDiag.default.stopPropogation
	This method uses various approaches used in different browsers to stop event propagation.
	Parameters:
	event - Event to be stopped.
*/
chartDiag.default.stopPropagation = function (event) {
	if (event.stopPropagation !== undefined) {
		event.stopPropagation();
	} else if (event.cancelBubble !== undefined) {
		event.cancelBubble = true;
	} else if (event.preventDefault !== undefined) {
		event.preventDefault();
	}
};

/*
	Function: chartDiag.default.indexOf
	Searches array for specified item and returns index (or -1 if not found)
	Parameters:
	vector - An array through which to search.
	item - The value to search for.
	Returns:
	Index of search item or -1 if not found.
*/
chartDiag.default.indexOf = function (vector, item, compFunc) {
	var index,
		treeItem;
	for (index = 0; index < vector.length; index += 1) {
		treeItem = vector[index];
		if (compFunc != null ? compFunc(treeItem, item) : treeItem === item) {
			return index;
		}
	}
	return -1;
};

chartDiag.default._supportsSVG = null;

/*
	Function: chartDiag.default.supportsSVG
	Indicates whether the browser supports SVG graphics.
	
	Returns: 
	true if browser supports SVG graphics.
*/
chartDiag.default.supportsSVG = function () {
	if (chartDiag.default._supportsSVG === null) {
		chartDiag.default._supportsSVG = document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") ||
			document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Shape", "1.0");
	}
	return chartDiag.default._supportsSVG;
};

chartDiag.default._supportsVML = null;

/*
	Function: chartDiag.default.supportsVML
	Indicates whether the browser supports VML graphics. It is applicable to Internet Explorer only. This graphics mode is depricated in favour of SVG.
	
	Returns: 
	true if browser supports VML graphics.
*/
chartDiag.default.supportsVML = function () {
	var div,
		shape;
	if (chartDiag.default._supportsVML === null) {
		chartDiag.default._supportsVML = false;
		if (!jQuery.support.opacity) {
			div = document.createElement('div');
			div = document.body.appendChild(div);
			div.innerHTML = '<v:shape adj="1" />';
			shape = div.firstChild;
			shape.style.behavior = "url(#default#VML)";
			chartDiag.default._supportsVML = shape ? typeof shape.adj === "object" : false;
			div.parentNode.removeChild(div);
		}
	}
	return chartDiag.default._supportsVML;
};

chartDiag.default._supportsCanvas = null;

/*
	Function: chartDiag.default.supportsCanvas
	Indicates whether the browser supports HTML Canvas graphics.
	
	Returns: 
	true if browser supports HTML Canvas graphics.
*/
chartDiag.default.supportsCanvas = function () {
	if (chartDiag.default._supportsCanvas === null) {
		chartDiag.default._supportsCanvas = !!window.HTMLCanvasElement;
	}
	return chartDiag.default._supportsCanvas;
};

chartDiag.default.createGraphics = function (preferred, widget) {
	var result = null,
		modes,
		key,
		index;

	modes = [preferred];
	for (key in chartDiag.default.GraphicsType) {
		if (chartDiag.default.GraphicsType.hasOwnProperty(key)) {
			modes.push(chartDiag.default.GraphicsType[key]);
		}
	}
	for (index = 0; result === null && index < modes.length; index += 1) {
		switch (modes[index]) {
			case 2/*chartDiag.default.GraphicsType.VML*/:
				if (chartDiag.default.supportsVML()) {
					result = new chartDiag.default.VmlGraphics(widget);
				}
				break;
			case 0/*chartDiag.default.GraphicsType.SVG*/:
				if (chartDiag.default.supportsSVG()) {
					result = new chartDiag.default.SvgGraphics(widget);
				}
				break;
			case 1/*chartDiag.default.GraphicsType.Canvas*/:
				if (chartDiag.default.supportsCanvas()) {
					result = new chartDiag.default.CanvasGraphics(widget);
				}
				break;
		}
	}
	return result;
};

/*
	Function: chartDiag.default.getColorHexValue
	Converts color string into HEX color string.
	
	Parameters:
	color - regular HTML color string.

	Returns: 
		Color value in form of HEX string.
*/
chartDiag.default.getColorHexValue = function (color) {
	var digits,
		red,
		green,
		blue,
		rgb,
		colorIndex,
		colorKey;
	if (color.substr(0, 1) === '#') {
		return color;
	}

	/*ignore jslint start*/
	digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);
	/*ignore jslint end*/
	if (digits !== null && digits.length > 0) {
		red = parseInt(digits[2], 10);
		green = parseInt(digits[3], 10);
		blue = parseInt(digits[4], 10);

		/*ignore jslint start*/
		rgb = ((red << 16) | (green << 8) | blue).toString(16);
		/*ignore jslint end*/
		return digits[1] + "000000".substr(0, 6 - rgb.length) + rgb;
	}
	if (chartDiag.default.ColorHexs === undefined) {
		chartDiag.default.ColorHexs = {};
		colorIndex = 0;
		for (colorKey in chartDiag.default.Colors) {
			if (chartDiag.default.Colors.hasOwnProperty(colorKey)) {
				chartDiag.default.ColorHexs[colorKey.toUpperCase()] = chartDiag.default.Colors[colorKey];
				colorIndex += 1;
			}
		}
	}

	return chartDiag.default.ColorHexs[color.toUpperCase()];
};

/*
	Function: chartDiag.default.getColorName
		Converts color string into HTML color name string or return hex color string.
	
	Parameters:
	color - regular HTML color string.

	Returns: 
		HTML Color name or HEX string.
*/
chartDiag.default.getColorName = function (color) {
	var colorIndex,
		colorKey;
	color = chartDiag.default.getColorHexValue(color);

	if (chartDiag.default.ColorNames === undefined) {
		chartDiag.default.ColorNames = {};
		colorIndex = 0;
		for (colorKey in chartDiag.default.Colors) {
			if (chartDiag.default.Colors.hasOwnProperty(colorKey)) {
				chartDiag.default.ColorNames[chartDiag.default.Colors[colorKey]] = colorKey;
				colorIndex += 1;
			}
		}
	}

	return chartDiag.default.ColorNames[color];
};

/*
	Function: chartDiag.default.getRed
		Gets red value of HEX color string.
	
	Parameters:
	color - HEX string color value.

	Returns: 
		Int value.
*/
chartDiag.default.getRed = function (color) {
	if (color.substr(0, 1) === '#' && color.length === 7) {
		return parseInt(color.substr(1, 2), 16);
	}
	return null;
};

/*
	Function: chartDiag.default.getGreen
		Gets green value of HEX color string.

	Parameters:
	color - HEX string color value.
	
	Returns: 
		Int value.
*/
chartDiag.default.getGreen = function (color) {
	if (color.substr(0, 1) === '#' && color.length === 7) {
		return parseInt(color.substr(3, 2), 16);
	}
	return null;
};

/*
	Function: chartDiag.default.getBlue
		Gets blue value of HEX color string.
	
	Parameters:
	color - HEX string color value.

	Returns: 
		Int value.
*/
chartDiag.default.getBlue = function (color) {
	if (color.substr(0, 1) === '#' && color.length === 7) {
		return parseInt(color.substr(5, 2), 16);
	}
	return null;
};

/*
	Function: chartDiag.default.beforeOpacity
		Calculates before opacity color value producing color you need after applying opacity.
	
	Parameters:
	color - Color you need after applying opacity.
	opacity - Value of opacity.

	Returns: 
		HEX color value.
*/
chartDiag.default.beforeOpacity = function (color, opacity) {
	var common = chartDiag.default,
		red,
		green,
		blue,
		rgb;
	color = common.getColorHexValue(color);

	red = Math.ceil((common.getRed(color) - (1.0 - opacity) * 255.0) / opacity);
	green = Math.ceil((common.getGreen(color) - (1.0 - opacity) * 255.0) / opacity);
	blue = Math.ceil((common.getBlue(color) - (1.0 - opacity) * 255.0) / opacity);

	/*ignore jslint start*/
	rgb = ((red << 16) | (green << 8) | blue).toString(16);
	/*ignore jslint end*/
	return '#' + "000000".substr(0, 6 - rgb.length) + rgb;
};

/*
	Function: chartDiag.default.highestContrast
		Calculates contrast between base color and two optional first and second colors
		and returns the one which has highest contrast.
	
	Parameters:
	baseColor - Base color to compare with.
	firstColor - First color.
	secondColor - Second color.

	Returns: 
		Color value.
*/
chartDiag.default.highestContrast = function (baseColor, firstColor, secondColor) {
	var result = firstColor,
		common = chartDiag.default,
		key = baseColor + "," + firstColor  + "," + secondColor;

	if (common.highestContrasts === undefined) {
		common.highestContrasts = {};
	}
	if (common.highestContrasts.hasOwnProperty(key)) {
		result = common.highestContrasts[key];
	} else {
		if (common.luminosity(firstColor, baseColor) < common.luminosity(secondColor, baseColor)) {
			result = secondColor;
		}
		common.highestContrasts[key] = result;
	}
	return result;
};

/*
	Function: chartDiag.default.luminosity
		Calculates luminosity between two HEX string colors.
	
	Parameters:
	firstColor - First color.
	secondColor - Second color.

	Returns: 
		Luminosity value
*/
chartDiag.default.luminosity = function (firstColor, secondColor) {
	var result,
		common = chartDiag.default,
		first = common.getColorHexValue(firstColor),
		second = common.getColorHexValue(secondColor),
		firstLuminosity =
			0.2126 * Math.pow(common.getRed(first) / 255.0, 2.2) +
			0.7152 * Math.pow(common.getRed(first) / 255.0, 2.2) +
			0.0722 * Math.pow(common.getRed(first) / 255.0, 2.2),
		secondLuminosity =
			0.2126 * Math.pow(common.getRed(second) / 255.0, 2.2) +
			0.7152 * Math.pow(common.getRed(second) / 255.0, 2.2) +
			0.0722 * Math.pow(common.getRed(second) / 255.0, 2.2);

	if (firstLuminosity > secondLuminosity) {
		result = (firstLuminosity + 0.05) / (secondLuminosity + 0.05);
	}
	else {
		result = (secondLuminosity + 0.05) / (firstLuminosity + 0.05);
	}

	return result;
};

/*
	Function: chartDiag.default.compareArrays
		Compares non-object non-sorted arrays.
	
	Parameters:
	array1 - First array.
	array2 - Second array.

	Returns: 
		True if arrays are identical.
*/
chartDiag.default.compareArrays = function (array1, array2, getKeyFunc) {
	var result = true,
		index, len, value,
		hashArray1;
	if (array1.length != array2.length) {
		result = false;
	} else {
		hashArray1 = {};
		for (index = 0, len = array1.length; index < len; index += 1) {
			value = getKeyFunc != null ? getKeyFunc(array1[index]) : array1[index];
			if (hashArray1.hasOwnProperty(value)) {
				hashArray1[value] += 1;
			} else {
				hashArray1[value] = 1;
			}
		}
		for (index = 0, len = array2.length; index < len; index += 1) {
			value = getKeyFunc != null ? getKeyFunc(array2[index]) : array2[index];
			if (!hashArray1.hasOwnProperty(value)) {
				result = false;
				break;
			} else {
				hashArray1[value] -= 1;
				if (hashArray1[value] < 0) {
					result = false;
					break;
				}
			}
		}
	}
	return result;
};

/* /common/mouse.js*/
/*global mouseDelayMet*/
chartDiag.default.Mouse = function () {
	var data = {
		distance: 3,
		delay: 0,
		element: null,
		name: null,
		onMouseStart: null,
		onMouseDrag: null,
		onMouseStop: null,
		onMouseCapture: null
	},
	cancel = "input,textarea,button,select,option",
	mouseDownEvent,
	mouseStarted,
	started;

	function _mouseInit(element, options) {
		data.element = element;

		for (var option in options) {
			if (options.hasOwnProperty(option)) {
				data[option] = options[option];
			}
		}

		data.element
			.bind("mousedown." + data.name, function (event) {
				return _mouseDown(event);
			})
			.bind("click." + data.name, function (event) {
				if (true === jQuery.data(event.target, data.name + ".preventClickEvent")) {
					jQuery.removeData(event.target, data.name + ".preventClickEvent");
					event.stopImmediatePropagation();
					return false;
				}
			});

		started = false;
	}

	// make sure destroying one instance of mouse doesn't mess with
	// other instances of mouse
	function _mouseDestroy() {
		data.element.unbind("." + data.name);
		if (_mouseMoveDelegate) {
			jQuery(document)
				.unbind("mousemove." + data.name, _mouseMoveDelegate)
				.unbind("mouseup." + data.name, _mouseUpDelegate);
		}
	}

	function _mouseDown(event) {
		// don't let more than one widget handle mouseStart
		if (chartDiag.default.Mouse.MouseHandled) {
			return;
		}

		// we may have missed mouseup (out of window)
		(mouseStarted && _mouseUp(event)); //ignore jslint

		mouseDownEvent = event;

		var btnIsLeft = (event.which === 1),
			// event.target.nodeName works around a bug in IE 8 with
			// disabled inputs (#7620)
			elIsCancel = (typeof cancel === "string" && event.target.nodeName ? jQuery(event.target).closest(cancel).length : false);
		if (!btnIsLeft || elIsCancel || !_mouseCapture(event)) {
			return true;
		}

		mouseDelayMet = !data.delay; //ignore jslint
		if (!mouseDelayMet) {
			_mouseDelayTimer = setTimeout(function () { //ignore jslint
				mouseDelayMet = true; //ignore jslint
			}, data.delay);
		}

		if (_mouseDistanceMet(event) && _mouseDelayMet(event)) {
			mouseStarted = (_mouseStart(event) !== false);
			if (!mouseStarted) {
				event.preventDefault();
				return true;
			}
		}

		// Click event may never have fired (Gecko & Opera)
		if (true === jQuery.data(event.target, data.name + ".preventClickEvent")) {
			jQuery.removeData(event.target, data.name + ".preventClickEvent");
		}

		jQuery(document)
			.bind("mousemove." + data.name, _mouseMoveDelegate)
			.bind("mouseup." + data.name, _mouseUpDelegate);

		event.preventDefault();

		chartDiag.default.Mouse.MouseHandled = true;
		return true;
	}

	// these delegates are required to keep context
	function _mouseMoveDelegate(event) {
		return _mouseMove(event);
	}

	function _mouseUpDelegate(event) {
		return _mouseUp(event);
	}

	function _mouseMove(event) {
		// IE mouseup check - mouseup happened when mouse was out of window
		if (jQuery.ui.ie && (!document.documentMode || document.documentMode < 9) && !event.button) {
			return _mouseUp(event);
		}

		if (mouseStarted) {
			_mouseDrag(event);
			return event.preventDefault();
		}

		if (_mouseDistanceMet(event) && _mouseDelayMet(event)) {
			mouseStarted =
				(_mouseStart(mouseDownEvent, event) !== false);
			(mouseStarted ? _mouseDrag(event) : _mouseUp(event));//ignore jslint
		}

		return !mouseStarted;
	}

	function _mouseUp(event) {
		jQuery(document)
			.unbind("mousemove." + data.name, _mouseMoveDelegate)
			.unbind("mouseup." + data.name, _mouseUpDelegate);

		if (mouseStarted) {
			mouseStarted = false;

			if (event.target === mouseDownEvent.target) {
				jQuery.data(event.target, data.name + ".preventClickEvent", true);
			}

			_mouseStop(event);
		}

		return false;
	}

	function _mouseDistanceMet(event) {
		return (Math.max(
				Math.abs(mouseDownEvent.pageX - event.pageX),
				Math.abs(mouseDownEvent.pageY - event.pageY)
			) >= data.distance
		);
	}

	function _mouseDelayMet(/* event */) {
		return mouseDelayMet;
	}

	function _mouseStart(event) {
		if (data.onMouseStart != null) {
			data.onMouseStart(event);
		}
	}

	function _mouseDrag(event) {
		if (data.onMouseDrag != null) {
			data.onMouseDrag(event);
		}
	}

	function _mouseStop(event) {
		if (data.onMouseStop != null) {
			data.onMouseStop(event);
		}
	}

	function _mouseCapture(event) {
		if (data.onMouseCapture != null) {
			return data.onMouseCapture(event);
		}
		return true;
	}

	function isStarted() {
		return mouseStarted;
	}

	return {
		init: _mouseInit,
		destroy: _mouseDestroy,
		isStarted: isStarted
	};
};

chartDiag.default.Mouse.MouseHandled = false;

if (typeof jQuery != "undefined") {
	jQuery(document).mouseup(function () {
		chartDiag.default.Mouse.MouseHandled = false;
	});
};

/* /enums/AdviserPlacementType.js*/
/*
	Enum: chartDiag.default.AdviserPlacementType
		Defines item placement in tree relative to parent.
	
	Auto - Layout manager defined.
	Left - Item placed on the left side of parent.
	Right - Item placed on the right side of parent.
*/
chartDiag.default.AdviserPlacementType =
{
	Auto: 0,
	Left: 2,
	Right: 3
};

chartDiag.orgChart.AdviserPlacementType = chartDiag.default.AdviserPlacementType;

/* /enums/VerticalAlignmentType.js*/
/*
	Enum: chartDiag.default.VerticalAlignmentType
	Defines text label alignment inside text box boundaries.
	
	Top - Positined at the top of text box
	Middle - Aligned to the middle
	Bottom - Aligned to the bottom of text box
*/
chartDiag.default.VerticalAlignmentType =
{
	Top: 0,
	Middle: 1,
	Bottom: 2
};

/* /enums/VectorRelationType.js*/
chartDiag.default.VectorRelationType =
{
	None: 0,
	Null: 1,
	Collinear: 2,
	Opposite: 3
};

/* /enums/UpdateMode.js*/
/*
	Enum: chartDiag.default.UpdateMode
		Defines redraw mode of diagram.
	
	Recreate - Forces widget to make a full chart redraw. It is equivalent to initial chart creation. 
	It removes everything from chart layout and recreares all elements again. For example when you 
	open chart in jQuery UI dDialog you have to use this mode, since jQuery UI invalidates VML graphics elements in the DOM, so
	the only way to update chart is to recreate its contents.
	Refresh - This update mode is optimized for widget fast redraw caused by resize or changes of 
	next options: <chartDiag.orgChart.Config.items>, <chartDiag.orgChart.Config.cursorItem> 
	or <chartDiag.orgChart.Config.selectedItems>.
	PositonHighlight - This update mode redraws only <chartDiag.orgChart.Config.highlightItem>.

	See Also:
		<chartDiag.orgChart.Config.update>
*/
chartDiag.default.UpdateMode =
{
	Recreate: 0,
	Refresh: 1,
	PositonHighlight: 2
};

chartDiag.orgChart.UpdateMode = chartDiag.default.UpdateMode;

/* /enums/TextOrientationType.js*/
/*
	Enum: chartDiag.text.TextOrientationType
		Defines label orientation type.
	
	Horizontal - Regular horizontal text.
	RotateLeft - Rotate all text 90 degree.
	RotateRight - Rotate all text 270 degree.
*/
chartDiag.text.TextOrientationType =
{
	Horizontal: 0,
	RotateLeft: 1,
	RotateRight: 2,
	Auto: 3
};

/* /enums/SideFlag.js*/
chartDiag.default.SideFlag =
{
	Top: 1,
	Right: 2,
	Bottom: 4,
	Left: 8
};

/* /enums/ShapeType.js*/
/*
	Enum: chartDiag.default.ShapeType
		Defines shape type.
	
	Rectangle - rectangle
	Oval - oval
	Triangle - triangle
	CrossOut - cross out
	Circle - circle
	Rhombus - rhombus
	Wedge - wedge
	FramedOval - Framed Oval
	FramedTriangle - Framed Triangle
	FramedWedge - Framed Wedge
	FramedRhombus - Framed Rhombus
*/
chartDiag.default.ShapeType =
{
	Rectangle: 0,
	Oval: 1,
	Triangle: 2,
	CrossOut: 3,
	Circle: 4,
	Rhombus: 5,
	Wedge: 7,
	FramedOval: 8,
	FramedTriangle: 9,
	FramedWedge: 10,
	FramedRhombus: 11,
	None: 6
};

/* /enums/SelectionPathMode.js*/
/*
	Enum: chartDiag.default.SelectionPathMode
		Defines the display mode for items between root item of diagram and selected items.
	
	None - Selection path items placed and sized as regular diagram items.
	FullStack - Selection path items are shown in normal template mode.
*/
chartDiag.default.SelectionPathMode =
{
	None: 0,
	FullStack: 1
};

chartDiag.orgChart.SelectionPathMode = chartDiag.default.SelectionPathMode;

/* /enums/SegmentType.js*/
chartDiag.default.SegmentType =
{
	Line: 0,
	Move: 1,
	QuadraticArc: 2,
	CubicArc: 3,
	Dot: 4
};

/* /enums/RenderingMode.js*/
/*
	Enum: chartDiag.default.RenderingMode
	This enumeration is used as option in arguments of rendering events.
	It helps to tell template initialization stage, 
	for example user can widgitize some parts of template on create
	and update and refresh them in template update stage.
	
	Create - Template is just created.
	Update - Template is reused and update needed.
*/
chartDiag.default.RenderingMode =
{
	Create: 0,
	Update: 1
};

/* /enums/PlacementType.js*/
/*
	Enum: chartDiag.default.PlacementType
		Defines element placement relative to rectangular area.
	
	Auto - Depends on implementation
	Left - Left side
	Top - Top side
	Right - Right side
	Bottom - Bottom side
	TopLeft - Top left side
	TopRight - Top right side
	BottomLeft - Bottom left side
	BottomRight - Bottom right side
	LeftTop - Left Top side
	LeftBottom - Left Bottom side
	RightTop - Right Top side
	RightBottom - Right Bottom side
*/
chartDiag.default.PlacementType =
{
	Auto: 0,
	TopLeft: 8,
	Top: 1,
	TopRight: 2,
	RightTop: 11,
	Right: 3,
	RightBottom: 12,
	BottomRight: 4,
	Bottom: 5,
	BottomLeft: 6,
	LeftBottom: 10,
	Left: 7,
	LeftTop: 9
};

/* /enums/PageFitMode.js*/
/*
	Enum: chartDiag.default.PageFitMode
		Defines diagram auto fit mode.
	
	None - All diagram items are shown in normal template mode.
	PageWidth - Diagram tries to layout and auto size items in order to fit diagram into available page width.
	PageHeight - Diagram tries to layout and auto size items in order to fit diagram into available page height.
	FitToPage - Diagram tries to layout and auto size items in order to fit diagram into available page size.
	PrintPreview - Enable chart print preview mode. In this mode chart draws grid of pages in the background and aligns items, so they are not cut by page boundaries. 
	AutoSize - Chart sets its placeholder div size to fit its contents without minimizing items.
*/
chartDiag.default.PageFitMode =
{
	None: 0,
	PageWidth: 1,
	PageHeight: 2,
	FitToPage: 3,
	PrintPreview: 4,
	AutoSize: 5,
	SelectionOnly: 6
};

chartDiag.orgChart.PageFitMode = chartDiag.default.PageFitMode;

/* /enums/OrientationType.js*/
/*
	Enum: chartDiag.default.OrientationType
		Defines diagram orientation type.
	
	Top - Vertical orientation having root item at the top.
	Bottom - Vertical orientation having root item at the bottom.
	Left - Horizontal orientation having root item on the left.
	Right - Horizontal orientation having root item on the right.
*/
chartDiag.default.OrientationType =
{
	Top: 0,
	Bottom: 1,
	Left: 2,
	Right: 3,
	None: 4
};

chartDiag.orgChart.OrientationType = chartDiag.default.OrientationType;

/* /enums/NeighboursSelectionMode.js*/
/*
	Enum: chartDiag.default.NeighboursSelectionMode
		Defines the display mode for items related to current cursor item in diagram.
	
	ParentsAndChildren - Parents and children of cursor item placed and sized as regular diagram items.
	ParentsChildrenSiblingsAndSpouses - Parents, children, siblings and spouses of cursor item placed and sized as regular diagram items.
*/
chartDiag.default.NeighboursSelectionMode =
{
	ParentsAndChildren: 0,
	ParentsChildrenSiblingsAndSpouses: 1
};


/* /enums/NavigationMode.js*/
/*
	Enum: chartDiag.default.NavigationMode
		Defines control navigation mode. By default control replicates interactivity of regular Tree control. 
		It has highlight for mouse over feedback over nodes and it has cursor for showing currently selected single node in diagram.
		In order to avoid children nodes folding and unfolding, this functionality is done automatically for current cursor item.
		So cursor plays vital role for unfolding of nodes and zooming into area of user interest in diagram.

	Default - Highlight & Cursor 
	CursorOnly - Cursor only.
	HighlightOnly - Highlight only. This mode is usefull for touch devices. Since it requires minimal layout changes and renderings.
	Inactive - No user interactivity.

	See Also:
		<chartDiag.orgChart.Config.navigationMode>
		<chartDiag.famChart.Config.navigationMode>
*/
chartDiag.default.NavigationMode =
{
	Default: 0,
	CursorOnly: 1,
	HighlightOnly: 3,
	Inactive: 2
};

/* /enums/LineType.js*/
/*
	Enum: chartDiag.default.LineType
		Defines type of line pattern. Dash and dot intervals depend on line width. 
	
	Solid - Regular solid line.
	Dotted - Dots.
	Dashed - Dashes.
*/
chartDiag.default.LineType =
{
	Solid: 0,
	Dotted: 1,
	Dashed: 2
};

/* /enums/Layers.js*/
chartDiag.default.Layers = 
{
	PrintPreview: 1,
	BackgroundAnnotation: 2,
	BackgroundAnnotations: 3,
	BackgroundConnectorAnnotation: 4,
	Connector: 5,
	Highlight: 6,
	Marker: 7,
	Label : 8,
	Cursor: 9,
	Item: 10,
	ForegroundAnnotations: 11,
	ForegroundConnectorAnnotation: 12,
	Annotation: 13,
	Controls: 14
};

/* /enums/LabelType.js*/
chartDiag.default.LabelType =
{
	Regular: 0,
	Dummy: 1,
	Fixed: 2
};

/* /enums/AnnotationType.js*/
/*
	Enum: chartDiag.default.AnnotationType
		Defines type of annotation object.
	
	Connector - Connector lines between two rectangular areas.
	Shape - Shape around rectanglur area.
	HighlightPath - Use highlight properties for connector lines between items.
*/
chartDiag.default.AnnotationType =
{
	Connector: 0,
	Shape: 1,
	HighlightPath: 2,
	Label: 3,
	Background: 4
};

/* /enums/ChildrenPlacementType.js*/
/*
	Enum: chartDiag.default.ChildrenPlacementType
		Defines children placement shape.
	
	Auto - Children placement auto defined.
	Vertical - Children form vertical column.
	Horizontal - Children placed horizontally.
	Matrix - Children placed in form of matrix.
*/
chartDiag.default.ChildrenPlacementType =
{
	Auto: 0,
	Vertical: 1,
	Horizontal: 2,
	Matrix: 3
};

chartDiag.orgChart.ChildrenPlacementType = chartDiag.default.ChildrenPlacementType;

/* /enums/Colors.js*/
/*
	Enum: chartDiag.default.Colors
		Named colors.

*/
chartDiag.default.Colors =
{
	AliceBlue: "#f0f8ff",
	AntiqueWhite: "#faebd7",
	Aqua: "#00ffff",
	Aquamarine: "#7fffd4",
	Azure: "#f0ffff",

	Beige: "#f5f5dc",
	Bisque: "#ffe4c4",
	Black: "#000000",
	BlanchedAlmond: "#ffebcd",
	Blue: "#0000ff",
	BlueViolet: "#8a2be2",
	Brown: "#a52a2a",
	BurlyWood: "#deb887",
	Bronze: "#cd7f32",

	CadetBlue: "#5f9ea0",
	ChartReuse: "#7fff00",
	Chocolate: "#d2691e",
	Coral: "#ff7f50",
	CornflowerBlue: "#6495ed",
	Cornsilk: "#fff8dc",
	Crimson: "#dc143c",
	Cyan: "#00ffff",
	DarkBlue: "#00008b",
	DarkCyan: "#008b8b",
	DarkGoldenrod: "#b8860b",
	DarkGray: "#a9a9a9",
	DarkGreen: "#006400",
	DarkKhaki: "#bdb76b",
	DarkMagenta: "#8b008b",
	DarkOliveGreen: "#556b2f",
	Darkorange: "#ff8c00",
	DarkOrchid: "#9932cc",
	DarkRed: "#8b0000",
	DarkSalmon: "#e9967a",
	DarkSeaGreen: "#8fbc8f",
	DarkSlateBlue: "#483d8b",
	DarkSlateGray: "#2f4f4f",
	DarkTurquoise: "#00ced1",
	DarkViolet: "#9400d3",
	DeepPink: "#ff1493",
	DeepSkyBlue: "#00bfff",
	DimGray: "#696969",
	DodgerBlue: "#1e90ff",

	FireBrick: "#b22222",
	FloralWhite: "#fffaf0",
	ForestGreen: "#228b22",
	Fuchsia: "#ff00ff",

	Gainsboro: "#dcdcdc",
	GhostWhite: "#f8f8ff",
	Gold: "#ffd700",
	Goldenrod: "#daa520",
	Gray: "#808080",
	Green: "#008000",
	GreenYellow: "#adff2f",

	Honeydew: "#f0fff0",
	Hotpink: "#ff69b4",

	IndianRed: "#cd5c5c",
	Indigo: "#4b0082",
	Ivory: "#fffff0",
	Khaki: "#f0e68c",

	Lavender: "#e6e6fa",
	LavenderBlush: "#fff0f5",
	Lawngreen: "#7cfc00",
	Lemonchiffon: "#fffacd",
	LightBlue: "#add8e6",
	LightCoral: "#f08080",
	LightCyan: "#e0ffff",
	LightGoldenrodYellow: "#fafad2",

	LightGray: "#d3d3d3",
	LightGreen: "#90ee90",
	LightPink: "#ffb6c1",
	LightSalmon: "#ffa07a",
	LightSeaGreen: "#20b2aa",
	LightSkyBlue: "#87cefa",
	LightSlateGray: "#778899",
	LightSteelBlue: "#b0c4de",

	LightYellow: "#ffffe0",
	Lime: "#00ff00",
	Limegreen: "#32cd32",
	Linen: "#faf0e6",

	Magenta: "#ff00ff",
	Maroon: "#800000",
	MediumAquamarine: "#66cdaa",
	MediumBlue: "#0000cd",
	MediumOrchid: "#ba55d3",
	MediumPurple: "#9370d8",
	MediumSeaGreen: "#3cb371",
	MediumSlateBlue: "#7b68ee",

	MediumSpringGreen: "#00fa9a",
	MediumTurquoise: "#48d1cc",
	MediumVioletRed: "#c71585",
	MidnightBlue: "#191970",
	MintCream: "#f5fffa",
	MistyRose: "#ffe4e1",
	Moccasin: "#ffe4b5",

	NavajoWhite: "#ffdead",
	Navy: "#000080",

	Oldlace: "#fdf5e6",
	Olive: "#808000",
	Olivedrab: "#6b8e23",
	Orange: "#ffa500",
	OrangeRed: "#ff4500",
	Orchid: "#da70d6",

	PaleGoldenRod: "#eee8aa",
	PaleGreen: "#98fb98",
	PaleTurquoise: "#afeeee",
	PaleVioletRed: "#d87093",
	Papayawhip: "#ffefd5",
	Peachpuff: "#ffdab9",
	Peru: "#cd853f",
	Pink: "#ffc0cb",
	Plum: "#dda0dd",
	PowderBlue: "#b0e0e6",
	Purple: "#800080",

	Red: "#ff0000",
	RosyBrown: "#bc8f8f",
	RoyalBlue: "#4169e1",

	SaddleBrown: "#8b4513",
	Salmon: "#fa8072",
	SandyBrown: "#f4a460",
	SeaGreen: "#2e8b57",
	Seashell: "#fff5ee",
	Sienna: "#a0522d",
	Silver: "#c0c0c0",
	SkyBlue: "#87ceeb",
	SlateBlue: "#6a5acd",
	SlateGray: "#708090",
	Snow: "#fffafa",
	SpringGreen: "#00ff7f",
	SteelBlue: "#4682b4",

	Tan: "#d2b48c",
	Teal: "#008080",
	Thistle: "#d8bfd8",
	Tomato: "#ff6347",
	Turquoise: "#40e0d0",

	Violet: "#ee82ee",

	Wheat: "#f5deb3",
	White: "#ffffff",
	WhiteSmoke: "#f5f5f5",

	Yellow: "#ffff00",
	YellowGreen: "#9acd32"
};

/* /enums/ConnectorLabelPlacementType.js*/
/*
	Enum: chartDiag.default.ConnectorLabelPlacementType
	Defines connector label placement.
	
	
	From - Place at the "from" rectangle
	Between - Place along connector line, between rectangles
	To - Place at "to" rectangle
*/
chartDiag.default.ConnectorLabelPlacementType =
{
	From: 0,
	Between: 1,
	To: 2
};

/* /enums/ConnectorPlacementType.js*/
/*
	Enum: chartDiag.default.ConnectorPlacementType
		Defines connector annotation shape placement mode between two rectangles.
	
	Offbeat - place connector annotation in the way that it does not overlap base hierarchy connector lines.
	Straight - direct connection between centers of rectangles.
*/
chartDiag.default.ConnectorPlacementType =
{
	Offbeat: 0,
	Straight: 1
};

/* /enums/ConnectorShapeType.js*/
/*
	Enum: chartDiag.default.ConnectorShapeType
		Defines connector shape style between two rectangles.
	
	SingleLine - Single line.
	DoubleLine - Double line.
*/
chartDiag.default.ConnectorShapeType =
{
	OneWay: 0,
	TwoWay: 1,
	BothWay: 2
};

/* /enums/Visibility.js*/
/*
	Enum: chartDiag.default.Visibility
		Defines nodes visibility mode.
	
	Auto - Auto select best visibility mode.
	Normal - Show node in normal template mode.
	Dot - Show node as dot.
	Line - Show node as line.
	Invisible - Make node invisible.

	See Also:

		<chartDiag.orgChart.Config.minimalVisibility>
*/
chartDiag.default.Visibility =
{
	Auto: 0,
	Normal: 1,
	Dot: 2,
	Line: 3,
	Invisible: 4
};

/* /enums/ConnectorStyleType.js*/
chartDiag.default.ConnectorStyleType =
{
	Extra: 0,
	Regular: 1,
	Highlight: 2
};

/* /enums/ElbowType.js*/
/*
	Enum: chartDiag.default.ElbowType
		Defines type of connector line elbow style.
	
	Dot - Two lines intersection marked with dot.
	Angular - Squared connection has angular .
	Dashed - Dashes.
*/
chartDiag.default.ElbowType =
{
	None: 0,
	Dot: 1,
	Bevel: 2,
	Round: 3
};

/* /enums/Enabled.js*/
/*
	Enum: chartDiag.default.Enabled
		Defines option state.
	
	Auto - Option state is auto defined.
	True - Enabled.
	False - Disabled.
*/
chartDiag.default.Enabled =
{
	Auto: 0,
	True: 1,
	False: 2
};

/* /enums/GraphicsType.js*/
/*
	Enum: chartDiag.ocommon.GraphicsType
		Graphics type. 
	
	VML - Vector Markup Language. It is only graphics mode available in IE6, IE7 and IE8.
	SVG - Scalable Vector Graphics. Proportionally scales on majority of device. It is not available on Android 2.3 devices and earlier.
	Canvas - HTML canvas graphics. It is available everywhere except IE6, IE7 and IE8. It requires widget redraw after zooming page.
*/
chartDiag.default.GraphicsType =
{
	SVG: 0,
	Canvas: 1,
	VML: 2
};

/* /enums/GroupByType.js*/
/*
	Enum: chartDiag.default.GroupByType
		Defines objects gravity in chart.
	
	Parents - To parents.
	Children - To children.
*/
chartDiag.default.GroupByType =
{
	None: 0,
	Parents: 1,
	Children: 2
};

/* /enums/HorizontalAlignmentType.js*/
/*
	Enum: chartDiag.default.HorizontalAlignmentType
	Defines text label alignment inside text box boundaries.
	
	Center - Positooned in the middle of the text box
	Left - Aligned to the begging of the text box
	Right - Aligned to the end of text box
*/
chartDiag.default.HorizontalAlignmentType =
{
	Center: 0,
	Left: 1,
	Right: 2
};

/* /enums/ItemType.js*/
/*
	Enum: chartDiag.orgChart.ItemType
		Defines diagram item type.
	
	Regular - Regular item.
	Assistant - Child item which is placed at separate level above all other children, but below parent item. It has connection on its side.
	Adviser - Child item which is placed at the same level as parent item. It has connection on its side.
	SubAssistant - Child item which is placed at separate level above all other children, but below parent item.  It has connection on its top.
	SubAdviser - Child item placed at the same level as parent item. It has connection on its top.
	GeneralPartner - Child item placed at the same level as parent item and visually grouped with it together via sharing common parent and children.
	LimitedPartner - Child item placed at the same level as parent item and visually grouped with it via sharing common children.
	AdviserPartner - Child item placed at the same level as parent item. It has connection on its side. It is visually grouped with it via sharing common children.
*/
chartDiag.orgChart.ItemType =
{
	Regular: 0,

	Assistant: 1,
	SubAssistant: 4,
	SuperAssistant: 10,

	SuperAdviser: 9,
	SubAdviser: 5,
	Adviser: 2,

	Director: 11,

	GeneralPartner: 6,
	LimitedPartner: 7,
	AdviserPartner: 8
};

/* /enums/ConnectorType.js*/
/*
	Enum: chartDiag.default.ConnectorType
		Defines diagram connectors style for dot and line elements.
	
	Squared - Connector lines use only right angles.
	Angular - Connector lines use angular lines comming from common vertex.
	Curved - Connector lines are splines comming from common vertex.
*/
chartDiag.default.ConnectorType =
{
	Squared: 0,
	Angular: 1,
	Curved: 2
};

chartDiag.orgChart.ConnectorType = chartDiag.default.ConnectorType;

/* /enums/ZOrderType.js*/
/*
	Enum: chartDiag.default.ZOrderType
		Defines elements Z order. This option is used to place annotations relative to chart.
	
	Auto - Auto selects best order depending on type of element.
	Background - Place element in chart background.
	Foreground - Place element into foreground.
*/
chartDiag.default.ZOrderType =
{
	Auto: 0,
	Background: 1,
	Foreground: 2
};

/* /events/RenderEventArgs.js*/
/*
	Class: chartDiag.default.RenderEventArgs
		Rendering event details class.
*/
chartDiag.default.RenderEventArgs = function () {
	/*
	Property: element
		jQuery selector referencing template's root element.
	*/
	this.element = null;

	/*
	Property: context
		Reference to item.
	*/
	this.context = null;

	/*
	Property: templateName
		This is template name used to render this item.

		See Also:
		<chartDiag.orgChart.TemplateConfig>
		<chartDiag.orgChart.Config.templates> collection property.
	*/
	this.templateName = null;

	/*
	Property: renderingMode
		This option indicates current template state.

	Default:
		<chartDiag.default.RenderingMode.Update>

	See also:
		<chartDiag.default.RenderingMode>
	*/
	this.renderingMode = null;

	/*
	Property: isCursor
		Rendered item is cursor.
	*/
	this.isCursor = false;

	/*
	Property: isSelected
		Rendered item is selected.
	*/
	this.isSelected = false;
};

/* /graphics/shapes/BaseShape.js*/
chartDiag.default.BaseShape = function () {

};


chartDiag.default.BaseShape.prototype._getLabelPosition = function (x, y, width, height, labelWidth, labelHeight, labelOffset, labelPlacement) {
	var result = null;
	switch (labelPlacement) {
		case 1/*chartDiag.default.PlacementType.Top*/:
			result = new chartDiag.default.Rect(x + width / 2.0 - labelWidth / 2.0, y - labelOffset - labelHeight, labelWidth, labelHeight);
			break;
		case 2/*chartDiag.default.PlacementType.TopRight*/:
			result = new chartDiag.default.Rect(x + width - labelWidth, y - labelOffset - labelHeight, labelWidth, labelHeight);
			break;
		case 8/*chartDiag.default.PlacementType.TopLeft*/:
			result = new chartDiag.default.Rect(x, y - labelOffset - labelHeight, labelWidth, labelHeight);
			break;
		case 3/*chartDiag.default.PlacementType.Right*/:
			result = new chartDiag.default.Rect(x + width + labelOffset, y + height / 2.0 - labelHeight / 2.0, labelWidth, labelHeight);
			break;
		case 11/*chartDiag.default.PlacementType.RightTop*/:
			result = new chartDiag.default.Rect(x + width + labelOffset, y, labelWidth, labelHeight);
			break;
		case 12/*chartDiag.default.PlacementType.RightBottom*/:
			result = new chartDiag.default.Rect(x + width + labelOffset, y + height - labelHeight, labelWidth, labelHeight);
			break;
		case 4/*chartDiag.default.PlacementType.BottomRight*/:
			result = new chartDiag.default.Rect(x + width - labelWidth, y + height + labelOffset, labelWidth, labelHeight);
			break;
		case 6/*chartDiag.default.PlacementType.BottomLeft*/:
			result = new chartDiag.default.Rect(x, y + height + labelOffset, labelWidth, labelHeight);
			break;
		case 7/*chartDiag.default.PlacementType.Left*/:
			result = new chartDiag.default.Rect(x - labelWidth - labelOffset, y + height / 2.0 - labelHeight / 2.0, labelWidth, labelHeight);
			break;
		case 9/*chartDiag.default.PlacementType.LeftTop*/:
			result = new chartDiag.default.Rect(x - labelWidth - labelOffset, y, labelWidth, labelHeight);
			break;
		case 10/*chartDiag.default.PlacementType.LeftBottom*/:
			result = new chartDiag.default.Rect(x - labelWidth - labelOffset, y + height - labelHeight, labelWidth, labelHeight);
			break;
		case 0/*chartDiag.default.PlacementType.Auto*/: //ignore jslint
		case 5/*chartDiag.default.PlacementType.Bottom*/: //ignore jslint
		default: //ignore jslint
			result = new chartDiag.default.Rect(x + width / 2.0 - labelWidth / 2.0, y + height + labelOffset, labelWidth, labelHeight);
			break;
	}
	return result;
};

chartDiag.default.BaseShape.prototype._betweenPoint = function (first, second) {
	return new chartDiag.default.Point((first.x + second.x) / 2, (first.y + second.y) / 2);
};

chartDiag.default.BaseShape.prototype._offsetPoint = function (first, second, offset) {
	var result = null,
		distance = first.distanceTo(second);

	if (distance === 0 || offset === 0) {
		result = new chartDiag.default.Point(first);
	} else {
		result = new chartDiag.default.Point(first.x + (second.x - first.x) / distance * offset, first.y + (second.y - first.y) / distance * offset);
	}
	return result;
};

/* /graphics/shapes/Callout.js*/
chartDiag.default.Callout = function (graphics) {
	this.m_graphics = graphics;

	this.pointerPlacement = 0/*chartDiag.default.PlacementType.Auto*/;
	this.cornerRadius = "10%";
	this.offset = 0;
	this.opacity = 1;
	this.lineWidth = 1;
	this.pointerWidth = "10%";
	this.borderColor = "#000000"/*chartDiag.default.Colors.Black*/;
	this.lineType = 0/*chartDiag.default.LineType.Solid*/;
	this.fillColor = "#d3d3d3"/*chartDiag.default.Colors.LightGray*/;

	this.m_map = [[8/*chartDiag.default.PlacementType.TopLeft*/, 7/*chartDiag.default.PlacementType.Left*/, 6/*chartDiag.default.PlacementType.BottomLeft*/],
				[1/*chartDiag.default.PlacementType.Top*/, null, 5/*chartDiag.default.PlacementType.Bottom*/],
				[2/*chartDiag.default.PlacementType.TopRight*/, 3/*chartDiag.default.PlacementType.Right*/, 4/*chartDiag.default.PlacementType.BottomRight*/]
	];
};

chartDiag.default.Callout.prototype = new chartDiag.default.BaseShape();

chartDiag.default.Callout.prototype.draw = function (snapPoint, position) {
	position = new chartDiag.default.Rect(position).offset(this.offset);

	var pointA = new chartDiag.default.Point(position.x, position.y),
	pointB = new chartDiag.default.Point(position.right(), position.y),
	pointC = new chartDiag.default.Point(position.right(), position.bottom()),
	pointD = new chartDiag.default.Point(position.left(), position.bottom()),
	snapPoints = [null, null, null, null, null, null, null, null],
	points = [pointA, pointB, pointC, pointD],
	radius = this.m_graphics.getPxSize(this.cornerRadius, Math.min(pointA.distanceTo(pointB), pointB.distanceTo(pointC))),
	placementType,
	point,
	index,
	attr,
	linePaletteItem,
	buffer,
	polyline;

	attr = {};
	if (this.fillColor !== null) {
		attr.fillColor = this.fillColor;
		attr.opacity = this.opacity;
	}
	if (this.lineColor !== null) {
		attr.lineColor = this.borderColor;
	}
	attr.lineWidth = this.lineWidth;
	attr.lineType = this.lineType;

	linePaletteItem = new chartDiag.default.PaletteItem(attr);
	buffer = new chartDiag.default.PolylinesBuffer();
	polyline = buffer.getPolyline(linePaletteItem);

	if (snapPoint !== null) {
		placementType = (this.pointerPlacement === 0/*chartDiag.default.PlacementType.Auto*/) ? this._getPlacement(snapPoint, pointA, pointC) : this.pointerPlacement;
		if (placementType !== null) {
			snapPoints[placementType] = snapPoint;
		}
	}

	for (index = 0; index < points.length; index += 1) {
		this._drawSegment(polyline, points[0], points[1], points[2], this.pointerWidth, radius, snapPoints[1], snapPoints[2]);
		point = points.shift();
		points.push(point);
		point = snapPoints.shift();
		snapPoints.push(point);
		point = snapPoints.shift();
		snapPoints.push(point);
	}

	this.m_graphics.polylinesBuffer(buffer);
};

chartDiag.default.Callout.prototype._getPlacement = function (point, point1, point2) {
	var row = null,
		column = null;
	if (point.x < point1.x) {
		row = 0;
	}
	else if (point.x > point2.x) {
		row = 2;
	}
	else {
		row = 1;
	}
	if (point.y < point1.y) {
		column = 0;
	}
	else if (point.y > point2.y) {
		column = 2;
	}
	else {
		column = 1;
	}
	return this.m_map[row][column];
};

chartDiag.default.Callout.prototype._drawSegment = function (polyline, pointA, pointB, pointC, base, radius, sideSnapPoint, cornerSnapPoint) {
	var pointA1 = this._offsetPoint(pointA, pointB, radius),
		pointB1 = this._offsetPoint(pointB, pointA, radius),
		pointB2 = this._offsetPoint(pointB, pointC, radius),
		pointS,
		pointS1,
		pointS2;

	base = this.m_graphics.getPxSize(base, pointA.distanceTo(pointB) / 2.0);

	if (polyline.length() === 0) {
		polyline.addSegment(new chartDiag.default.MoveSegment(pointA1));
	}
	if (sideSnapPoint !== null) {
		pointS = this._betweenPoint(pointA, pointB);
		pointS1 = this._offsetPoint(pointS, pointA, base);
		pointS2 = this._offsetPoint(pointS, pointB, base);
		polyline.addSegment(new chartDiag.default.LineSegment(pointS1));
		polyline.addSegment(new chartDiag.default.LineSegment(sideSnapPoint));
		polyline.addSegment(new chartDiag.default.LineSegment(pointS2));
	}

	polyline.addSegment(new chartDiag.default.LineSegment(pointB1));
	if (cornerSnapPoint !== null) {
		polyline.addSegment(new chartDiag.default.LineSegment(cornerSnapPoint));
		polyline.addSegment(new chartDiag.default.LineSegment(pointB2));
	}
	else {
		polyline.addSegment(new chartDiag.default.QuadraticArcSegment(pointB, pointB2));
	}
};

/* /graphics/shapes/ConnectorOffbeat.js*/
chartDiag.default.ConnectorOffbeat = function () {

};

chartDiag.default.ConnectorOffbeat.prototype = new chartDiag.default.BaseShape();

chartDiag.default.ConnectorOffbeat.prototype.draw = function (buffer, linePaletteItem, fromRect, toRect, linesOffset, bundleOffset, labelSize, panelSize, connectorShapeType, labelOffset, labelPlacementType, hasLabel,
	connectorAnnotationOffsetResolver, onLabelPlacement) {
	var minimalGap,
		connectorRect,
		fromPoint, toPoint,
		snapPoint,
		index, len,
		offsets, tempOffset,
		invertX, invertY,
		fromLabelPlacement = 0/*chartDiag.default.PlacementType.Auto*/,
		toLabelPlacement = 0/*chartDiag.default.PlacementType.Auto*/,
		labelPlacement = null,
		polyline,
		bothWay;
	
	polyline = buffer.getPolyline(linePaletteItem);

	offsets = [];
	switch (connectorShapeType) {
		case 1/*chartDiag.default.ConnectorShapeType.TwoWay*/:
			offsets = [-linesOffset / 2, linesOffset / 2];
			bothWay = false;
			break;
		case 0/*chartDiag.default.ConnectorShapeType.OneWay*/:
			offsets = [0];
			bothWay = false;
			break;
		case 2/*chartDiag.default.ConnectorShapeType.BothWay*/:
			offsets = [0];
			bothWay = true;
			break;
	}

	minimalGap = Math.max(hasLabel ? labelSize.width : 0, linesOffset * 5);
	if (fromRect.right() + minimalGap < toRect.left() || fromRect.left() > toRect.right() + minimalGap) {
		if (fromRect.left() > toRect.right()) {
			fromPoint = new chartDiag.default.Point(fromRect.left(), fromRect.verticalCenter());
			toPoint = new chartDiag.default.Point(toRect.right(), toRect.verticalCenter());
		} else {
			fromPoint = new chartDiag.default.Point(fromRect.right(), fromRect.verticalCenter());
			toPoint = new chartDiag.default.Point(toRect.left(), toRect.verticalCenter());
		}
		if (hasLabel) {
			if (fromRect.left() > toRect.right()) {
				fromLabelPlacement = 7/*chartDiag.default.PlacementType.Left*/;
				toLabelPlacement = 3/*chartDiag.default.PlacementType.Right*/;
			} else {
				fromLabelPlacement = 3/*chartDiag.default.PlacementType.Right*/;
				toLabelPlacement = 7/*chartDiag.default.PlacementType.Left*/;
			}
		}
		connectorRect = new chartDiag.default.Rect(fromPoint, toPoint);
		invertY = (fromPoint.y <= toPoint.y);
		invertX = (fromPoint.x < toPoint.x);
		if (connectorRect.height < connectorRect.width) {
			/* horizontal single bended connector between boxes from right side to left side */
			if (connectorRect.height < linesOffset * 2) {
				connectorRect.offset(0, invertY ? linesOffset * 2 : 0, 0, invertY ? 0 : linesOffset * 2);
			}

			for (index = 0, len = offsets.length; index < len; index += 1) {
				tempOffset = offsets[index];
				buffer.addInverted(function (invertedBuffer) {
					var polyline = invertedBuffer.getPolyline(linePaletteItem);
					polyline.addSegment(new chartDiag.default.MoveSegment(fromPoint.x, fromPoint.y + tempOffset));
					polyline.addSegment(new chartDiag.default.QuadraticArcSegment(connectorRect.horizontalCenter(), (invertY ? connectorRect.top() : connectorRect.bottom()) + tempOffset,
						toPoint.x, toPoint.y + tempOffset));

					if (bothWay) {
						polyline.addArrow(linePaletteItem.lineWidth, function (polyline) {
							polyline.mergeTo(buffer.getPolyline(polyline.paletteItem));
						});//ignore jslint
					}
				}, index || (connectorShapeType == 0/*chartDiag.default.ConnectorShapeType.OneWay*/));//ignore jslint

				polyline.addArrow(linePaletteItem.lineWidth, function (polyline) {
					polyline.mergeTo(buffer.getPolyline(polyline.paletteItem));
				}); //ignore jslint
			}

			if (hasLabel) {
				if (labelSize.width < connectorRect.width / 5 * 2) {
					snapPoint = chartDiag.default.QuadraticArcSegment.prototype.offsetPoint(fromPoint.x, fromPoint.y, connectorRect.horizontalCenter(), (invertY ? connectorRect.top() : connectorRect.bottom()), toPoint.x, toPoint.y, 0.5);
				} else {
					snapPoint = new chartDiag.default.Point(fromPoint.x, invertY ? connectorRect.top() : connectorRect.bottom());
				}
				labelPlacement = new chartDiag.default.Rect(snapPoint.x + (invertX ? linesOffset : -labelSize.width - linesOffset), (invertY ? snapPoint.y - labelSize.height - linesOffset : snapPoint.y + linesOffset), labelSize.width, labelSize.height);
			}
		} else {
			/* horizontal double bended connector between boxes from right side to left side */
			for (index = 0, len = offsets.length; index < len; index += 1) {
				tempOffset = offsets[index];
				buffer.addInverted(function (invertedBuffer) {
					var polyline = invertedBuffer.getPolyline(linePaletteItem);
					polyline.addSegment(new chartDiag.default.MoveSegment(fromPoint.x, fromPoint.y + tempOffset));
					polyline.addSegment(new chartDiag.default.QuadraticArcSegment(connectorRect.horizontalCenter() + tempOffset * (invertY != invertX ? 1 : -1), (invertY ? connectorRect.top() : connectorRect.bottom()) + tempOffset,
						connectorRect.horizontalCenter() + tempOffset * (invertY != invertX ? 1 : -1), connectorRect.verticalCenter() + tempOffset));
					polyline.addSegment(new chartDiag.default.QuadraticArcSegment(connectorRect.horizontalCenter() + tempOffset * (invertY != invertX ? 1 : -1), (invertY ? connectorRect.bottom() : connectorRect.top()) + tempOffset,
						toPoint.x, toPoint.y + tempOffset));

					if (bothWay) {
						polyline.addArrow(linePaletteItem.lineWidth, function (polyline) {
							polyline.mergeTo(buffer.getPolyline(polyline.paletteItem));
						});//ignore jslint
					}
				}, index || (connectorShapeType == 0/*chartDiag.default.ConnectorShapeType.OneWay*/));//ignore jslint

				polyline.addArrow(linePaletteItem.lineWidth, function (polyline) {
					polyline.mergeTo(buffer.getPolyline(polyline.paletteItem));
				}); //ignore jslint
			}

			if (hasLabel) {
				labelPlacement = new chartDiag.default.Rect(connectorRect.horizontalCenter() + (invertY != invertX ? linesOffset : -(linesOffset + labelSize.width)),
					connectorRect.verticalCenter() - labelSize.height / 2, labelSize.width, labelSize.height);
			}
		}
	} else {
		if (fromRect.verticalCenter() < toRect.top() || fromRect.verticalCenter() > toRect.bottom()) {
			/* vertical single bended connector between boxes from right side to right side */
			invertX = fromRect.x < panelSize.width / 2;
			fromPoint = new chartDiag.default.Point(invertX ? fromRect.right() : fromRect.left(), fromRect.verticalCenter());
			toPoint = new chartDiag.default.Point(invertX ? toRect.right() : toRect.left(), toRect.verticalCenter());
			connectorRect = new chartDiag.default.Rect(fromPoint, toPoint);
			connectorRect.offset(linesOffset * 10, 0, linesOffset * 10, 0);
			invertY = (fromPoint.y <= toPoint.y);
			for (index = 0, len = offsets.length; index < len; index += 1) {
				tempOffset = offsets[index];
				buffer.addInverted(function (invertedBuffer) {
					var polyline = invertedBuffer.getPolyline(linePaletteItem);
					polyline.addSegment(new chartDiag.default.MoveSegment(fromPoint.x, fromPoint.y + tempOffset));
					polyline.addSegment(new chartDiag.default.QuadraticArcSegment(invertX ? connectorRect.right() + tempOffset * (invertY ? -1 : 1) : connectorRect.left() - tempOffset * (invertY ? -1 : 1), connectorRect.verticalCenter(),
						invertX ? toRect.right() : toRect.left(), toRect.verticalCenter() - tempOffset));

					if (bothWay) {
						polyline.addArrow(linePaletteItem.lineWidth, function (polyline) {
							polyline.mergeTo(buffer.getPolyline(polyline.paletteItem));
						});//ignore jslint
					}
				}, index || (connectorShapeType == 0/*chartDiag.default.ConnectorShapeType.OneWay*/));//ignore jslint

				polyline.addArrow(linePaletteItem.lineWidth, function (polyline) {
					polyline.mergeTo(buffer.getPolyline(polyline.paletteItem));
				});//ignore jslint
			}

			if (hasLabel) {
				fromLabelPlacement = invertX ? 3/*chartDiag.default.PlacementType.Right*/ : 7/*chartDiag.default.PlacementType.Left*/;
				toLabelPlacement = fromLabelPlacement;

				snapPoint = chartDiag.default.QuadraticArcSegment.prototype.offsetPoint(fromPoint.x, fromPoint.y, (invertX ? connectorRect.right() : connectorRect.left()), connectorRect.verticalCenter(), toPoint.x, toPoint.y, 0.5);
				labelPlacement = new chartDiag.default.Rect(snapPoint.x + (invertX ? linesOffset / 2 : -linesOffset / 2 - labelSize.width), snapPoint.y - labelSize.height / 2, labelSize.width, labelSize.height);
			}
		} else {
			fromPoint = new chartDiag.default.Point(fromRect.horizontalCenter(), fromRect.top());
			toPoint = new chartDiag.default.Point(toRect.horizontalCenter(), toRect.top());
			connectorRect = new chartDiag.default.Rect(fromPoint, toPoint);
			connectorRect.offset(0, linesOffset * 7, 0, 0);
			invertX = (fromPoint.x < toPoint.x);
			for (index = 0, len = offsets.length; index < len; index += 1) {
				tempOffset = offsets[index];
				buffer.addInverted(function (invertedBuffer) {
					var polyline = invertedBuffer.getPolyline(linePaletteItem);
					polyline.addSegment(new chartDiag.default.MoveSegment(fromPoint.x + tempOffset, fromPoint.y));
					polyline.addSegment(new chartDiag.default.QuadraticArcSegment(connectorRect.horizontalCenter(), connectorRect.top() - tempOffset * (invertX ? -1 : 1),
						toRect.horizontalCenter() - tempOffset, toRect.top()));

					if (bothWay) {
						polyline.addArrow(linePaletteItem.lineWidth, function (polyline) {
							polyline.mergeTo(buffer.getPolyline(polyline.paletteItem));
						});//ignore jslint
					}
				}, index || (connectorShapeType == 0/*chartDiag.default.ConnectorShapeType.OneWay*/));//ignore jslint

				polyline.addArrow(linePaletteItem.lineWidth, function (polyline) {
					polyline.mergeTo(buffer.getPolyline(polyline.paletteItem));
				}); //ignore jslint
			}

			if (hasLabel) {
				fromLabelPlacement = 1/*chartDiag.default.PlacementType.Top*/;
				toLabelPlacement = 1/*chartDiag.default.PlacementType.Top*/;

				snapPoint = chartDiag.default.QuadraticArcSegment.prototype.offsetPoint(fromPoint.x, fromPoint.y, connectorRect.horizontalCenter(), connectorRect.top(), toPoint.x, toPoint.y, 0.5);
				labelPlacement = new chartDiag.default.Rect(snapPoint.x - labelSize.width / 2, snapPoint.y - (labelOffset + labelSize.height), labelSize.width, labelSize.height);
			}
		}
	}

	if (hasLabel) {
		/* end points labels placement */
		switch (labelPlacementType) {
			case 0/*chartDiag.default.ConnectorLabelPlacementType.From*/:
				labelPlacement = this._getLabelPosition(fromRect.x, fromRect.y, fromRect.width, fromRect.height, labelPlacement.width, labelPlacement.height, labelOffset, fromLabelPlacement);
				break;
			case 2/*chartDiag.default.ConnectorLabelPlacementType.To*/:
				labelPlacement = this._getLabelPosition(toRect.x, toRect.y, toRect.width, toRect.height, labelPlacement.width, labelPlacement.height, labelOffset, toLabelPlacement);
				break;
			default:
				break;
		}
	}

	if (onLabelPlacement != null) {
		onLabelPlacement(labelPlacement);
	}
};

/* /graphics/shapes/ConnectorStraight.js*/
chartDiag.default.ConnectorStraight = function () {

};

chartDiag.default.ConnectorStraight.prototype = new chartDiag.default.BaseShape();

chartDiag.default.ConnectorStraight.prototype.draw = function (buffer, linePaletteItem, fromRect, toRect, linesOffset, bundleOffset, labelSize, panelSize, connectorShapeType, labelOffset, labelPlacementType, hasLabel,
	connectorAnnotationOffsetResolver, onLabelPlacement) {
	var fromPoint, toPoint, betweenPoint,
		vector, newVector,
		offset = linesOffset / 2,
		labelPlacement = null,
		fromLabelPlacement = 0/*chartDiag.default.PlacementType.Auto*/,
		toLabelPlacement = 0/*chartDiag.default.PlacementType.Auto*/,
		self = this;

	vector = new chartDiag.default.Vector(fromRect.centerPoint(), toRect.centerPoint());

	fromRect.loopEdges(function (sideVector, placementType) {
		fromPoint = sideVector.getIntersectionPoint(vector, true);
		fromLabelPlacement = placementType;
		return (fromPoint != null);
	});

	toRect.loopEdges(function (sideVector, placementType) {
		toPoint = sideVector.getIntersectionPoint(vector, true);
		toLabelPlacement = placementType;
		return (toPoint != null);
	});

	if (fromPoint != null && toPoint != null) {
		var baseVector = new chartDiag.default.Vector(fromPoint, toPoint);
		connectorAnnotationOffsetResolver.getOffset(baseVector, function (offsetIndex, bundleSize, direction) {
			var tempOffset = (offsetIndex * bundleOffset - (bundleSize - 1) * bundleOffset / 2.0) * direction;
			baseVector.offset(tempOffset);
			fromPoint = baseVector.from;
			toPoint = baseVector.to;

			switch (connectorShapeType) {
				case 1/*chartDiag.default.ConnectorShapeType.TwoWay*/:
					newVector = new chartDiag.default.Vector(toPoint.clone(), fromPoint.clone());
					newVector.offset(offset);
					self._drawLine(buffer, linePaletteItem, newVector.from, newVector.to, false);

					newVector = new chartDiag.default.Vector(fromPoint.clone(), toPoint.clone());
					newVector.offset(offset);
					self._drawLine(buffer, linePaletteItem, newVector.from, newVector.to, false);
					break;
				case 0/*chartDiag.default.ConnectorShapeType.OneWay*/:
					self._drawLine(buffer, linePaletteItem, fromPoint, toPoint, false);
					break;
				case 2/*chartDiag.default.ConnectorShapeType.BothWay*/:
					self._drawLine(buffer, linePaletteItem, fromPoint, toPoint, true);
					break;
			}

			if (hasLabel) {
				/* end points labels placement */
				switch (labelPlacementType) {
					case 0/*chartDiag.default.ConnectorLabelPlacementType.From*/:
						labelPlacement = self._getLabelPositionBySnapPoint(fromPoint.x, fromPoint.y, labelSize.width, labelSize.height, labelOffset, fromLabelPlacement);
						break;
					case 1/*chartDiag.default.ConnectorLabelPlacementType.Between*/:
						betweenPoint = self._betweenPoint(fromPoint, toPoint);
						labelPlacement = self._getLabelPositionBySnapPoint(betweenPoint.x, betweenPoint.y, labelSize.width, labelSize.height, labelOffset, 3/*chartDiag.default.PlacementType.Right*/);
						break;
					case 2/*chartDiag.default.ConnectorLabelPlacementType.To*/:
						labelPlacement = self._getLabelPositionBySnapPoint(toPoint.x, toPoint.y, labelSize.width, labelSize.height, labelOffset, toLabelPlacement);
						break;
					default:
						break;
				}

				if (onLabelPlacement != null) {
					onLabelPlacement.call(this, labelPlacement);
				}
			}
		});

	}
};

chartDiag.default.ConnectorStraight.prototype._drawLine = function (buffer, linePaletteItem, fromPoint, toPoint, bothWays) {
	var polyline;

	buffer.addInverted(function (invertedBuffer) {
		polyline = invertedBuffer.getPolyline(linePaletteItem);
		polyline.addSegment(new chartDiag.default.MoveSegment(fromPoint));
		polyline.addSegment(new chartDiag.default.LineSegment(toPoint));

		polyline.addArrow(linePaletteItem.lineWidth, function (polyline) {
			polyline.mergeTo(buffer.getPolyline(polyline.paletteItem));
		}); //ignore jslint
	}, false);//ignore jslint

	if (bothWays) {
		polyline = buffer.getPolyline(linePaletteItem);
		polyline.addArrow(linePaletteItem.lineWidth, function (polyline) {
			polyline.mergeTo(buffer.getPolyline(polyline.paletteItem));
		}); //ignore jslint
	}
};

chartDiag.default.ConnectorStraight.prototype._getLabelPositionBySnapPoint = function (x, y, labelWidth, labelHeight, labelOffset, placementType) {
	var result = null;
	switch (placementType) {
		case 0/*chartDiag.default.PlacementType.Auto*/:
		case 1/*chartDiag.default.PlacementType.Top*/:
			result = new chartDiag.default.Rect(x - labelWidth / 2.0, y - labelOffset - labelHeight, labelWidth, labelHeight);
			break;
		case 3/*chartDiag.default.PlacementType.Right*/:
			result = new chartDiag.default.Rect(x + labelOffset, y - labelHeight / 2.0, labelWidth, labelHeight);
			break;
		case 5/*chartDiag.default.PlacementType.Bottom*/:
			result = new chartDiag.default.Rect(x - labelWidth / 2.0, y + labelOffset, labelWidth, labelHeight);
			break;
		case 7/*chartDiag.default.PlacementType.Left*/:
			result = new chartDiag.default.Rect(x - labelWidth - labelOffset, y - labelHeight / 2.0, labelWidth, labelHeight);
			break;
	}
	return result;
};

/* /graphics/shapes/Marker.js*/
chartDiag.default.Marker = function () {

};

chartDiag.default.Marker.Markers = {};

chartDiag.default.Marker.DrawCircle = function (polyline, position) {
	var quarter = Math.min(position.width / 2.0, position.height / 2.0);
	position = new chartDiag.default.Rect(position.horizontalCenter() - quarter, position.verticalCenter() - quarter, quarter * 2.0, quarter * 2.0);
	chartDiag.default.Marker.DrawOval(polyline, position);
};

chartDiag.default.Marker.DrawRectangle = function (polyline, position) {
	polyline.addSegment(new chartDiag.default.MoveSegment(position.x, position.verticalCenter()));
	polyline.addSegment(new chartDiag.default.LineSegment(position.x, position.y));
	polyline.addSegment(new chartDiag.default.LineSegment(position.right(), position.y));
	polyline.addSegment(new chartDiag.default.LineSegment(position.right(), position.bottom()));
	polyline.addSegment(new chartDiag.default.LineSegment(position.x, position.bottom()));
	polyline.addSegment(new chartDiag.default.LineSegment(position.x, position.verticalCenter()));
};

chartDiag.default.Marker.DrawOval = function (polyline, position) {
	var cpX, cpY;
	cpX = (position.width / 2) * 0.5522848;
	cpY = (position.height / 2) * 0.5522848;
	polyline.addSegment(new chartDiag.default.MoveSegment(position.x, position.verticalCenter()));
	polyline.addSegment(new chartDiag.default.CubicArcSegment(position.x, position.verticalCenter() - cpY, position.horizontalCenter() - cpX, position.y, position.horizontalCenter(), position.y));
	polyline.addSegment(new chartDiag.default.CubicArcSegment(position.horizontalCenter() + cpX, position.y, position.right(), position.verticalCenter() - cpY, position.right(), position.verticalCenter()));
	polyline.addSegment(new chartDiag.default.CubicArcSegment(position.right(), position.verticalCenter() + cpY, position.horizontalCenter() + cpX, position.bottom(), position.horizontalCenter(), position.bottom()));
	polyline.addSegment(new chartDiag.default.CubicArcSegment(position.horizontalCenter() - cpX, position.bottom(), position.x, position.verticalCenter() + cpY, position.x, position.verticalCenter()));
};

chartDiag.default.Marker.DrawTriangle = function (polyline, position) {
	polyline.addSegment(new chartDiag.default.MoveSegment(position.left(), position.bottom()));
	polyline.addSegment(new chartDiag.default.LineSegment(position.horizontalCenter(), position.y));
	polyline.addSegment(new chartDiag.default.LineSegment(position.right(), position.bottom()));
	polyline.addSegment(new chartDiag.default.LineSegment(position.left(), position.bottom()));
};

chartDiag.default.Marker.DrawCrossOut = function (polyline, position) {
	polyline.addSegment(new chartDiag.default.MoveSegment(position.horizontalCenter(), position.verticalCenter()));
	polyline.addSegment(new chartDiag.default.LineSegment(position.x, position.y));
	polyline.addSegment(new chartDiag.default.MoveSegment(position.horizontalCenter(), position.verticalCenter()));
	polyline.addSegment(new chartDiag.default.LineSegment(position.right(), position.bottom()));
	polyline.addSegment(new chartDiag.default.MoveSegment(position.horizontalCenter(), position.verticalCenter()));
	polyline.addSegment(new chartDiag.default.LineSegment(position.right(), position.y));
	polyline.addSegment(new chartDiag.default.MoveSegment(position.horizontalCenter(), position.verticalCenter()));
	polyline.addSegment(new chartDiag.default.LineSegment(position.left(), position.bottom()));
};

chartDiag.default.Marker.DrawRhombus = function (polyline, position) {
	polyline.addSegment(new chartDiag.default.MoveSegment(position.horizontalCenter(), position.bottom()));
	polyline.addSegment(new chartDiag.default.LineSegment(position.left(), position.verticalCenter()));
	polyline.addSegment(new chartDiag.default.LineSegment(position.horizontalCenter(), position.y));
	polyline.addSegment(new chartDiag.default.LineSegment(position.right(), position.verticalCenter()));
	polyline.addSegment(new chartDiag.default.LineSegment(position.horizontalCenter(), position.bottom()));
};

chartDiag.default.Marker.DrawWedge = function (polyline, position) {
	polyline.addSegment(new chartDiag.default.MoveSegment(position.horizontalCenter(), position.y));
	polyline.addSegment(new chartDiag.default.LineSegment(position.right(), position.y));
	polyline.addSegment(new chartDiag.default.LineSegment(position.horizontalCenter(), position.bottom()));
	polyline.addSegment(new chartDiag.default.LineSegment(position.left(), position.y));
	polyline.addSegment(new chartDiag.default.LineSegment(position.horizontalCenter(), position.y));
};

chartDiag.default.Marker.DrawFramedOval = function (polyline, position) {
	chartDiag.default.Marker.DrawRectangle(polyline, position);
	chartDiag.default.Marker.DrawOval(polyline, position);
};

chartDiag.default.Marker.DrawFramedTriangle = function (polyline, position) {
	chartDiag.default.Marker.DrawRectangle(polyline, position);
	chartDiag.default.Marker.DrawTriangle(polyline, position);
};

chartDiag.default.Marker.DrawFramedWedge = function (polyline, position) {
	chartDiag.default.Marker.DrawRectangle(polyline, position);
	chartDiag.default.Marker.DrawWedge(polyline, position);
};

chartDiag.default.Marker.DrawFramedRhombus = function (polyline, position) {
	chartDiag.default.Marker.DrawRectangle(polyline, position);
	chartDiag.default.Marker.DrawRhombus(polyline, position);
};

chartDiag.default.Marker.DrawNone = function (polyline, position) {

};

chartDiag.default.Marker.Markers[4/*chartDiag.default.ShapeType.Circle*/] = chartDiag.default.Marker.DrawCircle;
chartDiag.default.Marker.Markers[0/*chartDiag.default.ShapeType.Rectangle*/] = chartDiag.default.Marker.DrawRectangle;
chartDiag.default.Marker.Markers[1/*chartDiag.default.ShapeType.Oval*/] = chartDiag.default.Marker.DrawOval;
chartDiag.default.Marker.Markers[2/*chartDiag.default.ShapeType.Triangle*/] = chartDiag.default.Marker.DrawTriangle;
chartDiag.default.Marker.Markers[3/*chartDiag.default.ShapeType.CrossOut*/] = chartDiag.default.Marker.DrawCrossOut;
chartDiag.default.Marker.Markers[5/*chartDiag.default.ShapeType.Rhombus*/] = chartDiag.default.Marker.DrawRhombus;
chartDiag.default.Marker.Markers[7/*chartDiag.default.ShapeType.Wedge*/] = chartDiag.default.Marker.DrawWedge;
chartDiag.default.Marker.Markers[8/*chartDiag.default.ShapeType.FramedOval*/] = chartDiag.default.Marker.DrawFramedOval;
chartDiag.default.Marker.Markers[9/*chartDiag.default.ShapeType.FramedTriangle*/] = chartDiag.default.Marker.DrawFramedTriangle;
chartDiag.default.Marker.Markers[10/*chartDiag.default.ShapeType.FramedWedge*/] = chartDiag.default.Marker.DrawFramedWedge;
chartDiag.default.Marker.Markers[11/*chartDiag.default.ShapeType.FramedRhombus*/] = chartDiag.default.Marker.DrawFramedRhombus;
chartDiag.default.Marker.Markers[6/*chartDiag.default.ShapeType.None*/] = chartDiag.default.Marker.DrawNone;

chartDiag.default.Marker.prototype.draw = function (polylinesBuffer, shapeType, position, paletteItem) {
	var polyline;

	// If you need to create custom multi-color marker type
	// create color palette object for every fragment 
	// than request polyline of that that palette style 
	// add fragment into received polyline
	polyline = polylinesBuffer.getPolyline(paletteItem);
	chartDiag.default.Marker.Markers[shapeType](polyline, position);
};


/* /graphics/shapes/Perimeter.js*/
chartDiag.default.Perimeter = function (graphics) {
	this.m_graphics = graphics;
	this.transform = null;

	this.lineWidth = 1;
	this.opacity = 1;
	this.fillColor = null;
	this.lineType = 0/*chartDiag.default.LineType.Solid*/;
	this.borderColor = null;
};

chartDiag.default.Perimeter.prototype = new chartDiag.default.BaseShape();

chartDiag.default.Perimeter.prototype.draw = function (perimeter) {
	var paletteItem = new chartDiag.default.PaletteItem({
		lineColor: this.borderColor,
		lineWidth: this.lineWidth,
		fillColor: this.fillColor,
		lineType: this.lineType,
		opacity: this.opacity
	}),
	polyline = new chartDiag.default.Polyline(paletteItem),
	offset = this.lineWidth / 2,
	prevSegment = null,
	prevPoint = null,
	prevPointIsVertical = null,
	connectionHash = {}, connection,
	element;

	perimeter.segments.iterate(function (item) {
		var offsetX = 0,
			offsetY = 0,
			isVertical = false,
			newPoint,
			connection;

		if (offset > 0) {
			switch(item.orientationType) {
				case 3/*chartDiag.default.OrientationType.Right*/:
					offsetX = -offset;
					isVertical = false;
					break;
				case 2/*chartDiag.default.OrientationType.Left*/:
					offsetX = offset;
					isVertical = false;
					break;
				case 0/*chartDiag.default.OrientationType.Top*/:
					offsetY = offset;
					isVertical = true;
					break;
				case 1/*chartDiag.default.OrientationType.Bottom*/:
					offsetY = -offset;
					isVertical = true;
					break;
				default:
					throw "Orientation is not defined!";
			}
		}
		if (polyline.length() === 0) {
			prevPoint = new chartDiag.default.MoveSegment(item.fromPoint);
			polyline.addSegment(prevPoint);

			connectionHash[perimeter.segments.endKey()] = {
				point: prevPoint,
				isVertical: isVertical
			};
		}
		newPoint = null;
		if (perimeter.segments.item(item.oppositeKey) != null) {
			newPoint = new chartDiag.default.MoveSegment(item.toPoint.x + offsetX, item.toPoint.y + offsetY);
		} else {
			newPoint = new chartDiag.default.LineSegment(item.toPoint.x + offsetX, item.toPoint.y + offsetY);
		}
		polyline.addSegment(newPoint);

		if (offset > 0) {
			/* align previous point and new point offset */
			if (isVertical) {
				prevPoint.y = newPoint.y;
			} else {
				prevPoint.x = newPoint.x;
			}

			if (prevSegment != null) {
				/* search for two sequential segments having and not having opposite segments */
				if (!perimeter.segments.item(prevSegment.oppositeKey) &&
					perimeter.segments.item(item.oppositeKey) != null) {
					if (connectionHash.hasOwnProperty(item.oppositeKey)) {
						connection = connectionHash[item.oppositeKey];
						if (connection.isVertical) {
							prevPoint.y = connection.point.y;
						} else {
							prevPoint.x = connection.point.x;
						}
						if (prevPointIsVertical) {
							connection.point.y = prevPoint.y;
						} else {
							connection.point.x = prevPoint.x;
						}
					} else {
						connectionHash[item.oppositeKey] = {
							point: prevPoint,
							isVertical: prevPointIsVertical
						};
					}
				} else if (perimeter.segments.item(prevSegment.oppositeKey) != null &&
					!perimeter.segments.item(item.oppositeKey)) {
					if (connectionHash.hasOwnProperty(prevSegment.key)) {
						connection = connectionHash[prevSegment.key];
						if (connection.isVertical) {
							prevPoint.y = connection.point.y;
						} else {
							prevPoint.x = connection.point.x;
						}
						if (prevPointIsVertical) {
							connection.point.y = prevPoint.y;
						} else {
							connection.point.x = prevPoint.x;
						}
					} else {
						connectionHash[prevSegment.key] = {
							point: prevPoint,
							isVertical: isVertical
						};
					}
				}
			}
			prevPointIsVertical = isVertical;
			prevSegment = item;
		}
		prevPoint = newPoint;
	});

	if (offset > 0) {
		if (!perimeter.segments.item(prevSegment.oppositeKey)) {
			connection = connectionHash[prevSegment.key];
			if (connection.isVertical) {
				prevPoint.y = connection.point.y;
			} else {
				prevPoint.x = connection.point.x;
			}
			if (prevPointIsVertical) {
				connection.point.y = prevPoint.y;
			} else {
				connection.point.x = prevPoint.x;
			}
		}
	}
	polyline.transform(this.transform, true);

	element = this.m_graphics.polyline(polyline);
};


/* /graphics/shapes/Shape.js*/
chartDiag.default.Shape = function (graphics) {
	this.m_graphics = graphics;
	this.transform = null;

	this.orientationType = 0/*chartDiag.default.OrientationType.Top*/;
	this.panelSize = null;
	this.shapeType = 0/*chartDiag.default.ShapeType.Rectangle*/;
	this.offset = new chartDiag.default.Thickness(0, 0, 0, 0);
	this.lineWidth = 1;
	this.labelOffset = 4;
	this.cornerRadius = "10%";
	this.opacity = 1;
	this.fillColor = null;
	this.labelSize = new chartDiag.default.Size(60, 30);
	this.lineType = 0/*chartDiag.default.LineType.Solid*/;
	this.borderColor = null;
	this.hasLabel = false;
	this.labelTemplate = null;
	this.labelPlacement = 0/*chartDiag.default.PlacementType.Auto*/;
};

chartDiag.default.Shape.prototype = new chartDiag.default.BaseShape();

chartDiag.default.Shape.prototype.draw = function (position, uiHash) {
	var labelPlacement,
		calloutShape,
		linePaletteItem,
		buffer,
		marker;

	position = new chartDiag.default.Rect(position).offset(this.offset);

	this.transform = new chartDiag.default.Transform();
	this.transform.size = this.panelSize;
	this.transform.setOrientation(this.orientationType);

	/* label size */
	if (this.hasLabel) {
		labelPlacement = this._getLabelPosition(position.x, position.y, position.width, position.height, this.labelSize.width, this.labelSize.height, this.labelOffset, this.labelPlacement);
	}


	switch (this.shapeType) {
		case 0/*chartDiag.default.ShapeType.Rectangle*/:
			calloutShape = new chartDiag.default.Callout(this.m_graphics);
			calloutShape.cornerRadius = this.cornerRadius;
			calloutShape.opacity = this.opacity;
			calloutShape.lineWidth = this.lineWidth;
			calloutShape.lineType = this.lineType;
			calloutShape.borderColor = this.borderColor;
			calloutShape.fillColor = this.fillColor;
			calloutShape.draw(null, position);
			break;
		default:
			linePaletteItem = new chartDiag.default.PaletteItem({
				lineColor: this.borderColor,
				lineWidth: this.lineWidth,
				lineType: this.lineType,
				fillColor: this.fillColor,
				opacity: this.opacity
			});

			/* from rectangle */
			this.transform.transformRect(position.x, position.y, position.width, position.height, false,
				this, function (x, y, width, height) {
					position = new chartDiag.default.Rect(x, y, width, height);
				});

			
			marker = new chartDiag.default.Marker();
			buffer = new chartDiag.default.PolylinesBuffer();
			marker.draw(buffer, this.shapeType, position, linePaletteItem);
			buffer.transform(this.transform, true);

			this.m_graphics.polylinesBuffer(buffer);
			break;
	}

	if (this.hasLabel) {
		this.m_graphics.template(
			labelPlacement.x,
			labelPlacement.y,
			0,
			0,
			0,
			0,
			labelPlacement.width,
			labelPlacement.height,
			this.labelTemplate.template(),
			this.labelTemplate.getHashCode(),
			this.labelTemplate.render,
			uiHash,
			null
		);
	}
};

/* /graphics/structs/Point.js*/
/*
	Class: chartDiag.default.Point
	Class represents pair of x and y coordinates that defines a point in 2D plane.

	Parameters:
		point - <chartDiag.default.Point> object.

	Parameters:
		x - X coordinate of 2D point.
		y - Y coordinate of 2D point.
*/
chartDiag.default.Point = function (arg0, arg1) {
	/*
	Property: x
		The x coordinate.
	*/

	this.x = null;
	/*
	Property: y
		The y coordinate.
	*/

	this.y = null;

	/*
	Property: context
		This property holds reference to context object associated with this datapoint.
	*/
	this.context = null;

	switch (arguments.length) {
		case 1:
			this.x = arg0.x;
			this.y = arg0.y;
			this.context = arg0.context;
			break;
		case 2:
			this.x = arg0;
			this.y = arg1;
			break;
		default:
			break;
	}
};

/*
	Method: scale
		Scales width and height.
*/
chartDiag.default.Point.prototype.scale = function (scale) {
	this.x = this.x * scale;
	this.x = this.x * scale;
	return this;
};

/*
	Method: distanceTo
		Returns distance to point.

	Parameters:
		point - <chartDiag.default.Point> object.

	Parameters:
		x - X coordinate of 2D point.
		y - Y coordinate of 2D point.
*/
chartDiag.default.Point.prototype.distanceTo = function (arg0, arg1) {
	var x2 = 0,
		y2 = 0,
		a,
		b;
	switch (arguments.length) {
		case 1:
			x2 = arg0.x;
			y2 = arg0.y;
			break;
		case 2:
			x2 = arg0;
			y2 = arg1;
			break;
		default:
			break;
	}
	a = this.x - x2;
	b = this.y - y2;
	return Math.sqrt(a * a + b * b);
};

chartDiag.default.Point.prototype.equalTo = function (point) {
	return this.x == point.x && this.y == point.y;
};

/*
	Method: swap
		Swaps values of two points.

	Parameters:
		point - <chartDiag.default.Point> object.
*/
chartDiag.default.Point.prototype.swap = function (point) {
	var x = point.x,
		y = point.y;

	point.x = this.x;
	point.y = this.y;

	this.x = x;
	this.y = y;
};

/*
	Method: clone
		Clones current point.
*/
chartDiag.default.Point.prototype.clone = function () {
	return new chartDiag.default.Point(this);
};

/*
	Method: toString
		Returns rectangle location in form of CSS style string.

	Parameters:
		units - The string name of units. Uses "px" if not defined.

	Returns:
		CSS style string.
*/
chartDiag.default.Point.prototype.toString = function (units) {
	var result = "";

	units = (units !== undefined) ? units : "px";

	result += "left:" + this.x + units + ";";
	result += "top:" + this.y + units + ";";

	return result;
};

/* /graphics/structs/MoveSegment.js*/
chartDiag.default.MoveSegment = function () {
	this.parent = chartDiag.default.Point.prototype;
	this.parent.constructor.apply(this, arguments);
	this.segmentType = 1/*chartDiag.default.SegmentType.Move*/;
};

chartDiag.default.MoveSegment.prototype = new chartDiag.default.Point();

chartDiag.default.MoveSegment.prototype.clone = function () {
	return new chartDiag.default.MoveSegment(this);
};

chartDiag.default.MoveSegment.prototype.loop = function (thisArg, onItem) {
	if (onItem != null) {
		onItem.call(thisArg, this.x, this.y, 0);
	}
};

chartDiag.default.MoveSegment.prototype.setPoint = function (point, index) {
	this.x = point.x;
	this.y = point.y;
};

chartDiag.default.MoveSegment.prototype.getEndPoint = function () {
	return this;
};

chartDiag.default.MoveSegment.prototype.invert = function (endPoint) {
	this.x = endPoint.x;
	this.y = endPoint.y;
};

chartDiag.default.MoveSegment.prototype.transform = function (transform, forward) {
	var self = this;
	transform.transformPoint(self.x, self.y, forward, self, function (x, y) {
		self.x = x;
		self.y = y;
	});//ignore jslint
};

/* /graphics/structs/CubicArcSegment.js*/
chartDiag.default.CubicArcSegment = function (arg0, arg1, arg2, arg3, arg4, arg5) {
	this.parent = chartDiag.default.Point.prototype;

	this.x = null;
	this.y = null;

	this.cpX1 = null;
	this.cpY1 = null;

	this.cpX2 = null;
	this.cpY2 = null;

	switch (arguments.length) {
		case 3:
			this.parent.constructor.apply(this, [arg2.x, arg2.y]);
			this.cpX1 = arg0.x;
			this.cpY1 = arg0.y;
			this.cpX2 = arg1.x;
			this.cpY2 = arg1.y;
			break;
		case 6:
			this.parent.constructor.apply(this, [arg4, arg5]);
			this.cpX1 = arg0;
			this.cpY1 = arg1;
			this.cpX2 = arg2;
			this.cpY2 = arg3;
			break;
		default:
			break;
	}

	this.segmentType = 3/*chartDiag.default.SegmentType.CubicArc*/;
};

chartDiag.default.CubicArcSegment.prototype = new chartDiag.default.Point();

chartDiag.default.CubicArcSegment.prototype.clone = function () {
	return new chartDiag.default.CubicArcSegment(this.cpX1, this.cpY1, this.cpX2, this.cpY2, this.x, this.y);
};

chartDiag.default.CubicArcSegment.prototype.loop = function (thisArg, onItem) {
	if (onItem != null) {
		onItem.call(thisArg, this.cpX1, this.cpY1, 0);
		onItem.call(thisArg, this.cpX2, this.cpY2, 1);
		onItem.call(thisArg, this.x, this.y, 2);
	}
};

chartDiag.default.CubicArcSegment.prototype.setPoint = function (point, index) {
	switch (index) {
		case 0:
			this.cpX1 = point.x;
			this.cpY1 = point.y;
			break;
		case 1:
			this.cpX2 = point.x;
			this.cpY2 = point.y;
			break;
		case 2:
			this.x = point.x;
			this.y = point.y;
			break;
	}
};

chartDiag.default.CubicArcSegment.prototype.getEndPoint = function () {
	return this;
};

chartDiag.default.CubicArcSegment.prototype.invert = function (endPoint) {
	var tempX = this.cpX1, 
		tempY = this.cpY1;
	this.x = endPoint.x;
	this.y = endPoint.y;
	this.cpX1 = this.cpX2;
	this.cpY1 = this.cpY2;
	this.cpX2 = tempX;
	this.cpY2 = tempY;
};

chartDiag.default.CubicArcSegment.prototype.transform = function (transform, forward) {
	var self = this;
	transform.transform3Points(self.x, self.y, self.cpX1, self.cpY1, self.cpX2, self.cpY2, forward, self, function (x, y, cpX1, cpY1, cpX2, cpY2) {
		self.x = x;
		self.y = y;
		self.cpX1 = cpX1;
		self.cpY1 = cpY1;
		self.cpX2 = cpX2;
		self.cpY2 = cpY2;
	});//ignore jslint
};

chartDiag.default.CubicArcSegment.prototype.trim = function (prevEndPoint, offset) {
	var time = 0.5,
		endPoint = this.offsetPoint(this.x, this.y, this.cpX2, this.cpY2, this.cpX1, this.cpY1, prevEndPoint.x, prevEndPoint.y, time),
		time2 = 0.1,
		endPoint2 = this.offsetPoint(this.x, this.y, this.cpX2, this.cpY2, this.cpX1, this.cpY1, prevEndPoint.x, prevEndPoint.y, time2);

	time = offset * (time / endPoint.distanceTo(this.x, this.y) + time2 / endPoint2.distanceTo(this.x, this.y)) / 2.0;
	endPoint = this.offsetPoint(this.x, this.y, this.cpX2, this.cpY2, this.cpX1, this.cpY1, prevEndPoint.x, prevEndPoint.y, time);

	this.x = endPoint.x;
	this.y = endPoint.y;

	return this;
};

chartDiag.default.CubicArcSegment.prototype.offsetPoint = function (x, y, cpX1, cpY1, cpX2, cpY2, x2, y2, time) {
	return new chartDiag.default.Point(
		(1 - time) * (1 - time) * (1 - time) * x + 3 * (1 - time) * (1 - time) * time * cpX1 + 3 * (1 - time) * time * time * cpX2 + time * time * time * x2,
		(1 - time) * (1 - time) * (1 - time) * y + 3 * (1 - time) * (1 - time) * time * cpY1 + 3 * (1 - time) * time * time * cpY2 + time * time * time * y2
		);
};

/* /graphics/structs/DotSegment.js*/
chartDiag.default.DotSegment = function (x, y, width, height, cornerRadius) {
	this.segmentType = 4/*chartDiag.default.SegmentType.Dot*/;

	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.cornerRadius = cornerRadius;
};

/* /graphics/structs/Label.js*/
chartDiag.default.Label = function () {
	this.text = null;
	this.position = null; // chartDiag.default.Rect
	this.weight = 0;

	this.isActive = true; 
	this.labelType = 0/*chartDiag.default.LabelType.Regular*/;

	this.labelOrientation = 0/*chartDiag.text.TextOrientationType.Horizontal*/;
	this.horizontalAlignmentType = 0/*chartDiag.default.HorizontalAlignmentType.Center*/;
	this.verticalAlignmentType = 2/*chartDiag.default.VerticalAlignmentType.Bottom*/;
};

/* /graphics/structs/LineSegment.js*/
chartDiag.default.LineSegment = function () {
	this.parent = chartDiag.default.MoveSegment.prototype;
	this.parent.constructor.apply(this, arguments);

	this.segmentType = 0/*chartDiag.default.SegmentType.Line*/;
};

chartDiag.default.LineSegment.prototype = new chartDiag.default.MoveSegment();

chartDiag.default.LineSegment.prototype.clone = function () {
	return new chartDiag.default.LineSegment(this);
};

chartDiag.default.LineSegment.prototype.trim = function (prevEndPoint, offset) {
	var endPoint = this._offsetPoint(this, prevEndPoint, offset);
	this.x = endPoint.x;
	this.y = endPoint.y;

	return this;
};

chartDiag.default.LineSegment.prototype._offsetPoint = function (first, second, offset) {
	var result = null,
		distance = first.distanceTo(second);

	if (distance === 0 || offset === 0) {
		result = new chartDiag.default.Point(first);
	} else {
		result = new chartDiag.default.Point(first.x + (second.x - first.x) / distance * offset, first.y + (second.y - first.y) / distance * offset);
	}
	return result;
};

/* /graphics/structs/Matrix.js*/
/*
	Class: chartDiag.default.Matrix
	Class represents square matrix having 2 rows and 2 columns.

	Parameters:
		matrix - <chartDiag.default.Matrix> object.

	Parameters:
		a1 - top left.
		b1 - top right.
		a2 - bottom left
		b2 - bottom right
*/
chartDiag.default.Matrix = function (arg0, arg1, arg2, arg3) {

	this.a1 = null;
	this.b1 = null;
	this.a2 = null;
	this.b2 = null;

	switch (arguments.length) {
		case 1:
			this.a1 = arg0.a1;
			this.b1 = arg0.b1;
			this.a2 = arg0.a2;
			this.b2 = arg0.b2;
			break;
		case 4:
			this.a1 = arg0;
			this.b1 = arg1;
			this.a2 = arg2;
			this.b2 = arg3;
			break;
		default:
			break;
	}
};


chartDiag.default.Matrix.prototype.determinant = function () {
	return this.a1 * this.b2 - this.b1 * this.a2;
};

/* /graphics/structs/PaletteItem.js*/
chartDiag.default.PaletteItem = function (options) {
	this.lineColor = "#c0c0c0"/*chartDiag.default.Colors.Silver*/;
	this.lineWidth = 1;
	this.lineType = 0/*chartDiag.default.LineType.Solid*/;
	this.fillColor = null;
	this.opacity = null;

	this._key = "";

	var property, properties,
		index, len;

	properties = ['lineColor', 'lineWidth', 'lineType', 'fillColor', 'opacity'];

	for (index = 0, len = properties.length; index < len; index += 1) {
		property = properties[index];

		if(options != null && options.hasOwnProperty(property)) {
			this[property] = options[property];
		}
		this._key += (!chartDiag.default.isNullOrEmpty(this._key) ? ", " : "") + property + ":" + this[property];
	}
};

chartDiag.default.PaletteItem.prototype.toAttr = function () {
	var attr = {
		"lineWidth": this.lineWidth,
		"lineType": this.lineType
	};
	if (this.fillColor !== null) {
		attr.fillColor = this.fillColor;
	}
	if (this.opacity !== null) {
		attr.opacity = this.opacity;
	}
	if (this.lineColor !== null) {
		attr.borderColor = this.lineColor;
	}
	return attr;
};

chartDiag.default.PaletteItem.prototype.toString = function () {
	return this._key;
};

/* /graphics/structs/PaletteManager.js*/
chartDiag.default.PaletteManager = function (options, linesPalette) {
	this.palette = [];
	this.cursor = 0;

	var index, len;

	/* pallete based connectors */
	if(linesPalette.length === 0) {
		/* draw all extra as regular */
		this.palette = [new chartDiag.default.PaletteItem({
			lineColor: options.linesColor,
			lineWidth: options.linesWidth,
			lineType: options.linesType
		})];
		this.paletteLength = this.palette.length;

		this.regularIndex = 0;
	} else {
		for (index = 0, len = linesPalette.length; index < len; index += 1) {
			this.palette.push(new chartDiag.default.PaletteItem(linesPalette[index]));
		}
		this.paletteLength = this.palette.length;

		/* regular */
		this.palette.push(new chartDiag.default.PaletteItem({
			lineColor: options.linesColor,
			lineWidth: options.linesWidth,
			lineType: options.linesType
		}));
		this.regularIndex = this.palette.length - 1;
	}
	
	/* highlight */
	this.palette.push(new chartDiag.default.PaletteItem({
		lineColor: options.highlightLinesColor,
		lineWidth: options.highlightLinesWidth,
		lineType: options.highlightLinesType
	}));
	this.highlightIndex = this.palette.length - 1;
};

chartDiag.default.PaletteManager.prototype.selectPalette = function (index) {
	this.cursor = index % this.paletteLength;
};

chartDiag.default.PaletteManager.prototype.getPalette = function (connectorStyleType) {
	var index = null;
	switch (connectorStyleType) {
		case 1/*chartDiag.default.ConnectorStyleType.Regular*/:
			index = this.regularIndex;
			break;
		case 2/*chartDiag.default.ConnectorStyleType.Highlight*/:
			index = this.highlightIndex;
			break;
		case 0/*chartDiag.default.ConnectorStyleType.Extra*/:
			index = this.cursor;
			break;
	}
	return this.palette[index];
};

/* /graphics/structs/Polyline.js*/
chartDiag.default.Polyline = function (newPaletteItem) {
	var paletteItem = new chartDiag.default.PaletteItem(),
		segments = [],
		self,
		arrowPaletteItem;

	switch (arguments.length) {
		case 1:
			paletteItem = newPaletteItem;
			break;
	}

	arrowPaletteItem = new chartDiag.default.PaletteItem({
		lineColor: paletteItem.lineColor,
		lineWidth: 0,
		fillColor: paletteItem.lineColor,
		opacity: 1
	});

	function addSegment(segment) {
		segments.push(segment);
	}

	function addSegments(newSegments) {
		segments = segments.concat(newSegments);
	}

	function mergeTo(polyline) {
		polyline.addSegments(segments);
	}

	function length() {
		return segments.length;
	}

	function loop(thisArg, onItem) {
		var index, len,
			segment;
		if (onItem != null) {
			for (index = 0, len = segments.length; index < len; index += 1) {
				segment = segments[index];
				if (segment) {
					if (onItem.call(thisArg, segment, index)) {
						break;
					}
				}
			}
		}
	}

	function loopReversed(thisArg, onItem) {
		var index,
			segment;
		if (onItem != null) {
			for (index = segments.length - 1; index >= 0; index -= 1) {
				segment = segments[index];
				if (segment) {
					if (onItem.call(thisArg, segment, index)) {
						break;
					}
				}
			}
		}
	}

	function transform(transformArg, forward) {
		loop(this, function(segment){
			if (segment.transform != null) {
				segment.transform(transformArg, forward);
			}
		});
	}

	function isInvertable() {
		return chartDiag.default.isNullOrEmpty(paletteItem.fillColor);
	}

	function addInverted(polyline) {
		var hasMoved = false,
			stack = [];

		if (isInvertable()) {
			polyline.loopReversed(this, function(segment, index){
				if(segment.segmentType != 4/*chartDiag.default.SegmentType.Dot*/) {
					if (!hasMoved) {
						segments.push(new chartDiag.default.MoveSegment(segment.getEndPoint()));
						hasMoved = true;
					}
					stack.unshift(segment);

					if(stack.length > 1) {
						stack[1].invert(stack[0].getEndPoint());
						segments.push(stack[1]);
						stack.length = 1;
					}
						
				}
			});
		} else {
			polyline.mergeTo(self);
		}
	}
	
	function _getArrow(fromX, fromY, toX, toY, length, width) {
		var result = new chartDiag.default.Polyline(arrowPaletteItem),
			index, len,
			point, x, y,
			perimiter = [new chartDiag.default.Point(length, -width / 2),
				new chartDiag.default.Point(0, 0),
				new chartDiag.default.Point(length, width / 2),
				new chartDiag.default.Point(length / 4 * 3, 0)
			],
			angle = Math.atan2((fromY - toY), (fromX - toX));

		/* rotate and translate points */
		for (index = 0, len = perimiter.length; index < len; index += 1) {
			point = perimiter[index];
			x = point.x * Math.cos(angle) - point.y * Math.sin(angle);
			y = point.x * Math.sin(angle) + point.y * Math.cos(angle);
			point.x = x + toX;
			point.y = y + toY;
		}

		/* create arrow shape*/
		result.addSegment(new chartDiag.default.MoveSegment(perimiter[0].x, perimiter[0].y));
		result.addSegment(new chartDiag.default.LineSegment(perimiter[1].x, perimiter[1].y));
		result.addSegment(new chartDiag.default.LineSegment(perimiter[2].x, perimiter[2].y));
		result.addSegment(new chartDiag.default.QuadraticArcSegment(perimiter[3].x, perimiter[3].y, perimiter[0].x, perimiter[0].y));

		return result;
	}

	function addArrow(lineWidth, onAddArrowSegments) {
		var prevEndPoint,
			currentEndPoint,
			currentSegment,
			newEndPoint,
			polyline,
			len = segments.length,
			arrowTipLength = lineWidth * 3,
			arrowTipWidth = lineWidth * 2;

		switch (lineWidth) {
			case 1:
				arrowTipLength = 8;
				arrowTipWidth = 6;
				break;
			case 2:
				arrowTipLength = 12;
				arrowTipWidth = 8;
				break;
			case 3:
				arrowTipLength = 16;
				arrowTipWidth = 10;
				break;
		}

		if (onAddArrowSegments != null && len > 1) {
			prevEndPoint = segments[len - 2].getEndPoint();
			currentSegment = segments[len - 1];
			if (currentSegment.trim != null) {
				currentEndPoint = new chartDiag.default.Point(currentSegment.getEndPoint());
				newEndPoint = currentSegment.trim(prevEndPoint, arrowTipWidth);

				polyline = _getArrow(newEndPoint.x, newEndPoint.y, currentEndPoint.x, currentEndPoint.y, arrowTipLength, arrowTipWidth);
				onAddArrowSegments(polyline, newEndPoint);
			}
		}
	}

	function optimizeMoveSegments() {
		var index, len,
			cursorIndex,
			key,
			optimizedSegments,
			segment, nextSegment,
			links = {},
			jumps = [],
			processed = [];
		for (index = 0, len = segments.length; index < len - 1; index += 1) {
			segment = segments[index];
			nextSegment = segments[index + 1];
			switch (segment.segmentType) {
				case 0/*chartDiag.default.SegmentType.Line*/:
				case 2/*chartDiag.default.SegmentType.QuadraticArc*/:
				case 3/*chartDiag.default.SegmentType.CubicArc*/:
					switch (nextSegment.segmentType) {
						case 1/*chartDiag.default.SegmentType.Move*/:
						case 4/*chartDiag.default.SegmentType.Dot*/:
							key = segment.x + "&" + segment.y;
							if (!links.hasOwnProperty(key)) {
								links[key] = index;
							}
							break;
						default:
							break;
					}
					break;
				case 1/*chartDiag.default.SegmentType.Move*/:
					key = segment.x + "&" + segment.y;
					if (links.hasOwnProperty(key) && !jumps[links[key]]) {
						jumps[links[key]] = index + 1;
						processed[index] = true;
					}
					break;
				default:
					break;
			}
		}
		optimizedSegments = [];
		for (index = 0; index < len; index += 1) {
			if (!processed[index]) {
				segment = segments[index];
				optimizedSegments.push(segment);
				processed[index] = true;

				if (jumps[index] > 0) {
					cursorIndex = jumps[index];
					while (cursorIndex < len && !processed[cursorIndex]) {
						segment = segments[cursorIndex];
						optimizedSegments.push(segment);
						processed[cursorIndex] = true;

						if (jumps[cursorIndex] > 0) {
							cursorIndex = jumps[cursorIndex];
						} else {
							cursorIndex += 1;
						}
					}
				}
			}
		}
		segments = optimizedSegments;
	}

	function toString() {
		return paletteItem.toString();
	}

	/* private classes */
	function Vertex(segment, pointIndex) {
		this.segment = segment;
		this.pointIndex = pointIndex;
	}

	Vertex.prototype.pushToSegment = function (point) {
		this.segment.setPoint(point, this.pointIndex);
	};

	function _joinVectors(prev, current, offset, polyline, isLoop) {
		var relationType = prev.relateTo(current),
			offset2 = isLoop ? 0 : offset,
			joinSegment,
			joinVector,
			newToPoint;
		if (relationType == 2/*chartDiag.default.VectorRelationType.Collinear*/) {
			/* Vectors are collinear vectors so we don't search for intersection */
			current.offset(offset2);
		} else {
			if (relationType == 3/*chartDiag.default.VectorRelationType.Opposite*/ && current.from.context.pointIndex === 0) {
				/* Vectors are opposite vectors which belong to 2 different segments
					so we add an extra line segment in between of them
				*/
				joinSegment = new chartDiag.default.LineSegment(current.from);
				polyline.addSegment(joinSegment);

				current.offset(offset2);

				newToPoint = current.from.clone();
				newToPoint.context = new Vertex(joinSegment, 0);

				joinVector = new chartDiag.default.Vector(prev.to.clone(), newToPoint);
				if (!isLoop) {
					current.from = newToPoint.clone();
				}

				joinVector.offset(offset);
				joinVector.intersect(prev);
				joinVector.from.context.pushToSegment(joinVector.from);
				current.intersect(joinVector);

				if (isLoop) {
					joinVector.to.context.pushToSegment(joinVector.to);
				}
			} else {
				current.offset(offset2);
				current.intersect(prev);
			}
		}
		current.from.context.pushToSegment(current.from);
	}

	function _closeVector(vectorStack, startVectors, offset, polyline) {
		var startVector,
			prevVector = vectorStack[0],
			closurePoint = prevVector.to.context.segment.getEndPoint().toString();
		if (startVectors.hasOwnProperty(closurePoint)) {
			startVector = startVectors[closurePoint];

			_joinVectors(prevVector, startVector, offset, polyline, true);

			delete startVectors[closurePoint];
		}
		prevVector.to.context.pushToSegment(prevVector.to);
		vectorStack.length = 0;
	}

	function getOffsetPolyine(offset) {
		var result = new chartDiag.default.Polyline(paletteItem),
			startVectors = {},
			pointStack = [],
			vectorStack = [];

		loop(this, function (segment) {
			var newSegment = segment.clone(),
				newPoint;

			switch (newSegment.segmentType) {
				case 4/*chartDiag.default.SegmentType.Dot*/:
				case 1/*chartDiag.default.SegmentType.Move*/:
					if (vectorStack.length > 0) {
						_closeVector(vectorStack, startVectors, offset, result);
					}
					pointStack.length = 0;
					if (newSegment.segmentType == 1/*chartDiag.default.SegmentType.Move*/) {
						newPoint = new chartDiag.default.Point(newSegment);
						newPoint.context = new Vertex(newSegment, 0);
						pointStack.push(newPoint);
					}
					break;
				default:
					newSegment.loop(this, function (x, y, index) {
						var newPoint = new chartDiag.default.Point(x, y),
							current,
							prev,
							closurePoint;

						newPoint.context = new Vertex(newSegment, index);
						pointStack.unshift(newPoint);
						if (pointStack.length > 1) {
							vectorStack.unshift(new chartDiag.default.Vector(pointStack[1].clone(), pointStack[0].clone()));
							pointStack.length = 1;
						}

						switch (vectorStack.length) {
							case 1:
								/* first Vector in stack we add to start Vectors collection for possible join into perimiter*/
								current = vectorStack[0];
								closurePoint = current.from.toString();
								startVectors[closurePoint] = current;
								current.offset(offset);
								current.from.context.pushToSegment(current.from);
								break;
							case 2:
								prev = vectorStack[1];
								current = vectorStack[0];

								_joinVectors(prev, current, offset, result, false);

								vectorStack.length = 1;
								break;
							default:
								break;
						}
					});
					break;
			}
			result.addSegment(newSegment);
		});
		if (vectorStack.length > 0) {
			_closeVector(vectorStack, startVectors, offset, result);
		}
		return result;
	}

	self = {
		paletteItem: paletteItem,
		arrowPaletteItem: arrowPaletteItem,
		addSegment: addSegment,
		addSegments: addSegments,
		mergeTo: mergeTo,
		length: length,
		loop: loop,
		loopReversed: loopReversed,
		transform: transform,
		isInvertable: isInvertable,
		addInverted: addInverted,
		addArrow: addArrow,
		optimizeMoveSegments: optimizeMoveSegments,
		getOffsetPolyine: getOffsetPolyine,
		toString: toString
	};

	return self;
};

/* /graphics/structs/PolylinesBuffer.js*/
chartDiag.default.PolylinesBuffer = function () {
	var polylines = {};

	function _getPolyline(polylines, paletteItem) {
		if (!polylines[paletteItem.toString()]) {
			polylines[paletteItem.toString()] = new chartDiag.default.Polyline(paletteItem);
		}
		return polylines[paletteItem.toString()];
	}

	function getPolyline(paletteItem) {
		return _getPolyline(polylines, paletteItem);
	}

	function loop(thisArg, onItem) {
		var key,
			polyline;
		if (onItem != null) {
			for (key in polylines) {
				if (polylines.hasOwnProperty(key)) {
					polyline = polylines[key];
					if (polyline) {
						polyline.optimizeMoveSegments();

						if (onItem.call(thisArg, polyline)) {
							break;
						}
					}
				}
			}
		}
	}

	function addInverted(callbackFun, copyOnly) {
		var backupPolylines, backupPolyline;

		/* backup polylines */
		backupPolylines = polylines;
		polylines = {};

		if (callbackFun != null) {
			callbackFun(this);
		}

		/* add inverted polylines to backup collection */
		loop(this, function (polyline) {
			backupPolyline = _getPolyline(backupPolylines, polyline.paletteItem);

			if (!copyOnly) {
				backupPolyline.addInverted(polyline);
			} else {
				polyline.mergeTo(backupPolyline);
			}
		});

		/* restore polylines */
		polylines = backupPolylines;
	}

	function transform(transformArg, forward) {
		loop(this, function (polyline) {
			polyline.transform(transformArg, forward);
		});
	}

	return {
		getPolyline: getPolyline,
		loop: loop,
		addInverted: addInverted,
		transform: transform
	};
};

/* /graphics/structs/QuadraticArcSegment.js*/
chartDiag.default.QuadraticArcSegment = function (arg0, arg1, arg2, arg3) {
	this.x = null;
	this.y = null;

	this.cpX = null;
	this.cpY = null;

	switch (arguments.length) {
		case 2:
			this.x = arg1.x;
			this.y = arg1.y;
			this.cpX = arg0.x;
			this.cpY = arg0.y;
			break;
		case 4:
			this.cpX = arg0;
			this.cpY = arg1;
			this.x = arg2;
			this.y = arg3;
			break;
		default:
			break;
	}

	this.segmentType = 2/*chartDiag.default.SegmentType.QuadraticArc*/;
};

chartDiag.default.QuadraticArcSegment.prototype.clone = function () {
	return new chartDiag.default.QuadraticArcSegment(this.cpX, this.cpY, this.x, this.y);
};

chartDiag.default.QuadraticArcSegment.prototype.loop = function (thisArg, onItem) {
	if (onItem != null) {
		onItem.call(thisArg, this.cpX, this.cpY, 0);
		onItem.call(thisArg, this.x, this.y, 1);
	}
};

chartDiag.default.QuadraticArcSegment.prototype.setPoint = function (point, index) {
	switch (index) {
		case 0:
			this.cpX = point.x;
			this.cpY = point.y;
			break;
		case 1:
			this.x = point.x;
			this.y = point.y;
			break;
	}
};

chartDiag.default.QuadraticArcSegment.prototype.getEndPoint = function () {
	return this;
};

chartDiag.default.QuadraticArcSegment.prototype.invert = function (endPoint) {
	this.x = endPoint.x;
	this.y = endPoint.y;
};

chartDiag.default.QuadraticArcSegment.prototype.transform = function (transform, forward) {
	var self = this;
	transform.transformPoints(self.x, self.y, self.cpX, self.cpY, forward, self, function (x, y, cpX, cpY) {
		self.x = x;
		self.y = y;
		self.cpX = cpX;
		self.cpY = cpY;
	});//ignore jslint
};

chartDiag.default.QuadraticArcSegment.prototype.trim = function (prevEndPoint, offset) {
	var time = 0.5,
	endPoint = this.offsetPoint(this.x, this.y, this.cpX, this.cpY, prevEndPoint.x, prevEndPoint.y, time),
	time2 = 0.1,
	endPoint2 = this.offsetPoint(this.x, this.y, this.cpX, this.cpY, prevEndPoint.x, prevEndPoint.y, time2);

	time = offset * (time / endPoint.distanceTo(this.x, this.y) + time2 / endPoint2.distanceTo(this.x, this.y)) / 2.0;
	endPoint = this.offsetPoint(this.x, this.y, this.cpX, this.cpY, prevEndPoint.x, prevEndPoint.y, time);

	this.x = endPoint.x;
	this.y = endPoint.y;

	return this;
};

chartDiag.default.QuadraticArcSegment.prototype.offsetPoint = function (firstX, firstY, controlX, controlY, secondX, secondY, time) {
	return new chartDiag.default.Point((1 - time) * (1 - time) * firstX + 2 * (1 - time) * time * controlX + time * time * secondX,
		(1 - time) * (1 - time) * firstY + 2 * (1 - time) * time * controlY + time * time * secondY);
};

/* /graphics/structs/Rect.js*/
/*
	Class: chartDiag.default.Rect
	Class describes the width, height and location of rectangle.

	Parameters:
		rect - Copy constructor. It takes as a parameter copy of <chartDiag.default.Rect> object.

	Parameters:
		pointTopLeft - Top left point <chartDiag.default.Point> object.
		pointBottomRight - Bottom right point <chartDiag.default.Point> object.

	Parameters:
		x - The x coordinate of top left corner.
		y - The y coordinate of top left corner.
		width - Rect width.
		height - Rect height.
*/
chartDiag.default.Rect = function (arg0, arg1, arg2, arg3) {
	/*
	Property: x
		The location x coordinate.
	*/
	this.x = null;
	/*
	Property: y
		The location y coordinate.
	*/
	this.y = null;
	/*
	Property: width
		The width of rectangle.
	*/
	this.width = null;
	/*
	Property: height
		The height of rectangle.
	*/
	this.height = null;

	switch (arguments.length) {
		case 1:
			this.x = arg0.x;
			this.y = arg0.y;
			this.width = arg0.width;
			this.height = arg0.height;
			break;
		case 2:
			this.x = Math.min(arg0.x, arg1.x);
			this.y = Math.min(arg0.y, arg1.y);
			this.width = Math.abs(arg1.x - arg0.x);
			this.height = Math.abs(arg1.y - arg0.y);
			break;
		case 4:
			this.x = arg0;
			this.y = arg1;
			this.width = arg2;
			this.height = arg3;
			break;
		default:
			break;
	}
};

/*
	Method: left
		Gets the x-axis value of the left side of the rectangle.
*/
chartDiag.default.Rect.prototype.left = function () {
	return this.x;
};

/*
	Method: top
		Gets the y-axis value of the top side of the rectangle.
*/
chartDiag.default.Rect.prototype.top = function () {
	return this.y;
};

/*
	Method: right
		Gets the x-axis value of the right side of the rectangle.
*/
chartDiag.default.Rect.prototype.right = function () {
	return this.x + this.width;
};

/*
	Method: bottom
		Gets the y-axis value of the bottom of the rectangle.
*/
chartDiag.default.Rect.prototype.bottom = function () {
	return this.y + this.height;
};

/*
	Method: verticalCenter
		Gets the y-axis value of the center point of the rectangle.
*/
chartDiag.default.Rect.prototype.verticalCenter = function () {
	return this.y + this.height / 2.0;
};

/*
	Method: horizontalCenter
		Gets the x-axis value of the center point of the rectangle.
*/
chartDiag.default.Rect.prototype.horizontalCenter = function () {
	return this.x + this.width / 2.0;
};

/*
	Method: centerPoint
		Gets the point of the geometrical center of the rectangle.
*/
chartDiag.default.Rect.prototype.centerPoint = function () {
	return new chartDiag.default.Point(this.horizontalCenter(), this.verticalCenter());
};

/*
	Method: isEmpty
		Gets the value that indicates whether  the rectangle is the Empty rectangle.
*/
chartDiag.default.Rect.prototype.isEmpty = function () {
	return this.x === null || this.y === null || this.width === null || this.height === null || this.width < 0 || this.height < 0;
};

/*
	Method: offset
		Expands the rectangle by using specified value in all directions.

	Parameters:
		value - The amount by which to expand or shrink the sides of the rectangle.

	Parameters:
		left - The amount by which to expand or shrink the left side of the rectangle.	
		top - The amount by which to expand or shrink the top side of the rectangle.		
		right - The amount by which to expand or shrink the right side of the rectangle.		
		bottom - The amount by which to expand or shrink the bottom side of the rectangle.		
*/
chartDiag.default.Rect.prototype.offset = function (arg0, arg1, arg2, arg3) {
	switch (arguments.length) {
		case 1:
			if (arg0 !== null && typeof arg0 == "object") {
				this.x = this.x - arg0.left;
				this.y = this.y - arg0.top;

				this.width = this.width + arg0.left + arg0.right;
				this.height = this.height + arg0.top + arg0.bottom;
			} else {
				this.x = this.x - arg0;
				this.y = this.y - arg0;

				this.width = this.width + arg0 * 2.0;
				this.height = this.height + arg0 * 2.0;
			}
			break;
		case 4:
			this.x = this.x - arg0;
			this.y = this.y - arg1;

			this.width = this.width + arg0 + arg2;
			this.height = this.height + arg1 + arg3;
			break;
	}
	return this;
};

/*
	Method: scale
		Scales rectangle position.
*/
chartDiag.default.Rect.prototype.scale = function (scale) {
	this.x = this.x * scale;
	this.y = this.y * scale;
	this.width = this.width * scale;
	this.height = this.height * scale;
	return this;
};

/*
	Method: translate
		Moves the rectangle to by the specified horizontal and vertical amounts.

	Parameters:
		x - The amount to move the rectangle horizontally.
		y - The amount to move the rectangle vertically.
*/
chartDiag.default.Rect.prototype.translate = function (x, y) {
	this.x = this.x + x;
	this.y = this.y + y;

	return this;
};

/*
	Method: invert
		Inverts rectangle.
*/
chartDiag.default.Rect.prototype.invert = function () {
	var width = this.width,
		x = this.x;
	this.width = this.height;
	this.height = width;
	this.x = this.y;
	this.y = x;
	return this;
};

/*
	Method: loopEdges
		Loops edges of rectangle in the following order: Top, Right, Bottom, Left
*/
chartDiag.default.Rect.prototype.loopEdges = function (callback) { // function(vector, placementType) {}
	var vertexes = [
		new chartDiag.default.Point(this.left(), this.top()),
		new chartDiag.default.Point(this.right(), this.top()),
		new chartDiag.default.Point(this.right(), this.bottom()),
		new chartDiag.default.Point(this.left(), this.bottom())
	],
	placements = [
		1/*chartDiag.default.PlacementType.Top*/,
		3/*chartDiag.default.PlacementType.Right*/,
		5/*chartDiag.default.PlacementType.Bottom*/,
		7/*chartDiag.default.PlacementType.Left*/
	];

	vertexes.push(vertexes[0]);



	if (callback != null) {
		for (var index = 1, len = vertexes.length; index < len; index += 1) {
			if (callback(new chartDiag.default.Vector(vertexes[index - 1], vertexes[index]), placements[index - 1])) {
				break;
			}
		}
	}
	return this;
};

/*
	Method: contains
		Indicates whether the rectangle contains the specified point.

	Parameters:
		point - The point to check.

	Parameters:	
		x - The x coordinate of the point to check.
		y - The y coordinate of the point to check.
	
	Returns:
		true if the rectangle contains the specified point; otherwise, false.	
*/
chartDiag.default.Rect.prototype.contains = function (arg0, arg1) {
	switch (arguments.length) {
		case 1:
			return this.x <= arg0.x && arg0.x <= this.x + this.width && this.y <= arg0.y && arg0.y <= this.y + this.height;
		case 2:
			return this.x <= arg0 && arg0 <= this.x + this.width && this.y <= arg1 && arg1 <= this.y + this.height;
		default:
			return false;
	}
};

/*
	Method: cropByRect
		Crops the rectangle by the boundaries of specified rectangle.

	Parameters:
		rect - The rectangle to use as the crop boundaries.
*/
chartDiag.default.Rect.prototype.cropByRect = function (rect) {
	if (this.x < rect.x) {
		this.width -= (rect.x - this.x);
		this.x = rect.x;
	}

	if (this.right() > rect.right()) {
		this.width -= (this.right() - rect.right());
	}

	if (this.y < rect.y) {
		this.height -= (rect.y - this.y);
		this.y = rect.y;
	}

	if (this.bottom() > rect.bottom()) {
		this.height -= this.bottom() - rect.bottom();
	}

	if (this.isEmpty()) {
		this.x = null;
		this.y = null;
		this.width = null;
		this.height = null;
	}

	return this;
};

/*
	Method: overlaps
		Returns true if the rectangle overlaps specified rectangle.

	Parameters:
		rect - The rectangle to use as overlaping rectangle.
*/
chartDiag.default.Rect.prototype.overlaps = function (rect) {
	var result = true;
	if (this.x + this.width < rect.x || rect.x + rect.width < this.x || this.y + this.height < rect.y || rect.y + rect.height < this.y) {
		result = false;
	}
	return result;
};

/*
	Method: addRect
		Expands the current rectangle to contain specified rectangle.

	Parameters:
		rect - The rectangle to contain.

	Parameters:	
		x - The x coordinate of the point to contain.
		y - The y coordinate of the point to contain.

	Parameters:
		x - The x coordinate of top left corner.
		y - The y coordinate of top left corner.
		width - Rect width.
		height - Rect height.
*/
chartDiag.default.Rect.prototype.addRect = function (arg0, arg1, arg2, arg3) {
	var right,
		bottom;
	switch (arguments.length) {
		case 1:
			if (!arg0.isEmpty()) {
				if (this.isEmpty()) {
					this.x = arg0.x;
					this.y = arg0.y;
					this.width = arg0.width;
					this.height = arg0.height;
				}
				else {
					right = Math.max(this.right(), arg0.right());
					bottom = Math.max(this.bottom(), arg0.bottom());

					this.x = Math.min(this.x, arg0.x);
					this.y = Math.min(this.y, arg0.y);
					this.width = right - this.x;
					this.height = bottom - this.y;
				}
			}
			break;
		case 2:
			if (this.isEmpty()) {
				this.x = arg0;
				this.y = arg1;
				this.width = 0;
				this.height = 0;
			}
			else {
				right = Math.max(this.right(), arg0);
				bottom = Math.max(this.bottom(), arg1);

				this.x = Math.min(this.x, arg0);
				this.y = Math.min(this.y, arg1);
				this.width = right - this.x;
				this.height = bottom - this.y;
			}
			break;
		case 4:
			if (this.isEmpty()) {
				this.x = arg0;
				this.y = arg1;
				this.width = arg2;
				this.height = arg3;
			}
			else {
				right = Math.max(this.right(), arg0 + arg2);
				bottom = Math.max(this.bottom(), arg1 + arg3);

				this.x = Math.min(this.x, arg0);
				this.y = Math.min(this.y, arg1);
				this.width = right - this.x;
				this.height = bottom - this.y;
			}
			break;
	}

	return this;
};

/*
	Method: getCSS
		Returns rectangle location and size in form of CSS style object.

	Parameters:
		units - The string name of units. Uses "px" if not defined.

	Returns:
		CSS style object.
*/
chartDiag.default.Rect.prototype.getCSS = function (units) {
	units = (units !== undefined) ? units : "px";

	var result = {
		left: this.x + units,
		top: this.y + units,
		width: this.width + units,
		height: this.height + units
	};
	return result;
};

/*
	Method: toString
		Returns rectangle location and size in form of CSS style string.

	Parameters:
		units - The string name of units. Uses "px" if not defined.

	Returns:
		CSS style string.
*/
chartDiag.default.Rect.prototype.toString = function (units) {
	var result = "";

	units = (units !== undefined) ? units : "px";

	result += "left:" + this.x + units + ";";
	result += "top:" + this.y + units + ";";
	result += "width:" + this.width + units + ";";
	result += "height:" + this.height + units + ";";

	return result;
};

chartDiag.default.Rect.prototype.validate = function () {
	if (isNaN(this.x) || isNaN(this.y) || isNaN(this.width) || isNaN(this.height)) {
		throw "Invalid rect position.";
	}
};

/* /graphics/structs/Size.js*/
/*
	Class: chartDiag.default.Size
	Class describes the size of an object.

	Parameters:
		size - Copy constructor. It takes as a parameter copy of <chartDiag.default.Size> object.

	Parameters:
		width - The initial width of the instance.
		height - The initial height of the instance.
*/
chartDiag.default.Size = function (arg0, arg1) {
	/*
	Property: width
		The value that specifies the width of the size class.
	*/

	this.width = 0;

	/*
	Property: height
		The value that specifies the height of the size class.
	*/

	this.height = 0;

	switch (arguments.length) {
		case 1:
			this.width = arg0.width;
			this.height = arg0.height;
			break;
		case 2:
			this.width = arg0;
			this.height = arg1;
			break;
		default:
			break;
	}
};

/*
	Method: invert
		Swaps width and height.
*/
chartDiag.default.Size.prototype.invert = function () {
	var width = this.width;
	this.width = this.height;
	this.height = width;
	return this;
};

/*
	Method: scale
		Scales width and height.
*/
chartDiag.default.Size.prototype.scale = function (scale) {
	this.width = this.width * scale;
	this.height = this.height * scale;
	return this;
};

/*
	Method: getCSS
		Returns rectangle location and size in form of CSS style object.

	Parameters:
		units - The string name of units. Uses "px" if not defined.

	Returns:
		CSS style object.
*/
chartDiag.default.Size.prototype.getCSS = function (units) {
	units = (units !== undefined) ? units : "px";

	var result = {
		left: this.x + units,
		top: this.y + units,
		width: this.width + units,
		height: this.height + units
	};
	return result;
};

/*
	Method: cropBySize
		Crops the size by the other size.

	Parameters:
		size - The size to use as the crop boundaries.
*/
chartDiag.default.Size.prototype.cropBySize = function (size) {
	this.width = Math.min(this.width, size.width);
	this.height = Math.min(this.height, size.height);

	return this;
};

/*
	Method: addSize
		Extend size by the other size.

	Parameters:
		size - The size to use as extension.
*/
chartDiag.default.Size.prototype.addSize = function (size) {
	this.width = Math.max(this.width, size.width);
	this.height = Math.max(this.height, size.height);

	return this;
};

chartDiag.default.Size.prototype.validate = function () {
	if (isNaN(this.width) || isNaN(this.height)) {
		throw "Invalid size.";
	}
};

/* /graphics/structs/Thickness.js*/
/*
	Class: chartDiag.default.Thickness
	Class describes the thickness of a frame around rectangle.

	Parameters:
		left - The thickness for the left side of the rectangle.
		height - The thickness for the upper side of the rectangle.
		right - The thickness for the right side of the rectangle.
		bottom - The thickness for the bottom side of the rectangle.
*/
chartDiag.default.Thickness = function (left, top, right, bottom) {
	/*
	Property: left
		The thickness for the left side of the rectangle.
	*/

	this.left = left;

	/*
	Property: top
		The thickness for the upper side of the rectangle.
	*/

	this.top = top;

	/*
	Property: right
		The thickness for the right side of the rectangle.
	*/
	this.right = right;

	/*
	Property: bottom
		The thickness for the bottom side of the rectangle.
	*/
	this.bottom = bottom;
};

/*
	Method: isEmpty
		Gets the value that indicates whether the thickness is the Empty.
*/

chartDiag.default.Thickness.prototype.isEmpty = function () {
	return this.left === 0 && this.top === 0 && this.right === 0 && this.bottom === 0;
};

/*
	Method: toString
		Returns thickness in form of CSS style string. It is conversion to padding style string.

	Parameters:
		units - The string name of units. Uses "px" if not defined.

	Returns:
		CSS style string.
*/

chartDiag.default.Thickness.prototype.toString = function (units) {
	units = (units !== undefined) ? units : "px";

	return this.left + units + ", " + this.top + units + ", " + this.right + units + ", " + this.bottom + units;
};

/* /graphics/structs/Vector.js*/
/*
	Class: chartDiag.default.Vector
	Class represents pair of points that defines a vector in 2D plane.

	Parameters:
		vector - <chartDiag.default.Vector> object.

	Parameters:
		from - From 2D point.
		to - To 2D point.
*/
chartDiag.default.Vector = function (arg0, arg1) {
	/*
	Property: from
		The from point of vector.
	*/

	this.from = null;

	/*
	Property: to
		The to point of vector.
	*/

	this.to = null;

	switch (arguments.length) {
		case 1:
			this.from = arg0.from;
			this.to = arg0.to;
			break;
		case 2:
			this.from = arg0;
			this.to = arg1;
			break;
		default:
			break;
	}
};

chartDiag.default.Vector.prototype.isNull = function () {
	return this.from.x == this.to && this.from.y == this.to.y;
};

/*
	Method: length
		Returns length of vector.

	Returns:
		Vector length.
*/
chartDiag.default.Vector.prototype.length = function () {
	return this.from.distanceTo(this.to);
};

chartDiag.default.Vector.prototype.equalTo = function (vector) {
	return this.from.equalTo(vector.from) && this.to.equalTo(vector.to);
};

chartDiag.default.Vector.prototype.relateTo = function (vector) {
	var result = 0/*chartDiag.default.VectorRelationType.None*/,
		x1 = this.to.x - this.from.x,
		y1 = this.to.y - this.from.y,
		x2 = vector.to.x - vector.from.x,
		y2 = vector.to.y - vector.from.y,
		key = (x1 ? 8 : 0) + (y1 ? 4 : 0) + (x2 ? 2 : 0) + (y2 ? 1 : 0);

	switch (key) {
		case 0: //0000
		case 1: //0001
		case 2: //0010
		case 3: //0011
		case 4: //0100
		case 8: //1000
		case 12://1100
			result = 1/*chartDiag.default.VectorRelationType.Null*/;
			break;
		case 5: //0101
			if (y1 * y2 > 0) {
				result = 2/*chartDiag.default.VectorRelationType.Collinear*/;
			} else {
				result = 3/*chartDiag.default.VectorRelationType.Opposite*/;
			}
			break;
		case 10://1010
			if (x1 * x2 > 0) {
				result = 2/*chartDiag.default.VectorRelationType.Collinear*/;
			} else {
				result = 3/*chartDiag.default.VectorRelationType.Opposite*/;
			}
			break;
		case 15://1111
			if (x1 / x2 == y1 / y2) {
				if (x1 / x2 > 0) {
					result = 2/*chartDiag.default.VectorRelationType.Collinear*/;
				} else {
					result = 3/*chartDiag.default.VectorRelationType.Opposite*/;
				}
			}
			break;
	}
	return result;
};

chartDiag.default.Vector.prototype.offset = function (offset) {
	var length = this.length(),
		/* in order to rotate right multiply vector on 3D vector (0, 0, -1)*/
		x = (this.to.y - this.from.y) * offset / length,
		y = - (this.to.x - this.from.x) * offset / length;

	this.from.x += x;
	this.from.y += y;
	this.to.x += x;
	this.to.y += y;
};

chartDiag.default.Vector.prototype.getLine = function () {
	var x1 = this.from.x,
		y1 = this.from.y,
		x2 = this.to.x,
		y2 = this.to.y,
		a = y2 - y1,
		b = x1 - x2,
		c = x1 * (y1 - y2) + y1 * (x2 - x1);

	return [a, b, c];
};

chartDiag.default.Vector.prototype.getLineKey = function () {
	var line = this.getLine(),
		a = line[0],
		b = line[1],
		c = line[2],
		r = 10000;
	if (b !== 0) {
		line = [Math.floor(a / b * r), 1, Math.floor(c / b * r)];
	} else {
		line = [1, 0, Math.floor(c / a * r)];
	}
	return line.toString();
};


chartDiag.default.Vector.prototype.intersect = function (vector) {
	var v1 = this.getLine(),
		v2 = vector.getLine(),
		m = new chartDiag.default.Matrix(v1[0], v1[1], v2[0], v2[1]),
		d = m.determinant(),
		mx, my, dx, dy,
		x, y,
		result = false;

	if (d !== 0) {
		mx = new chartDiag.default.Matrix(-v1[2], v1[1], -v2[2], v2[1]);
		dx = mx.determinant();
		my = new chartDiag.default.Matrix(v1[0], -v1[2], v2[0], -v2[2]);
		dy = my.determinant();
		x = dx / d;
		y = dy / d;

		vector.to.x = x;
		vector.to.y = y;

		this.from.x = x;
		this.from.y = y;

		result = true;
	}

	return result;
};

chartDiag.default.Vector.prototype.getIntersectionPoint = function (vector, strict) {
	var v1 = this.getLine(),
		v2 = vector.getLine(),
		m = new chartDiag.default.Matrix(v1[0], v1[1], v2[0], v2[1]),
		d = m.determinant(),
		mx, my, dx, dy,
		x, y,
		result = null;

	if (d !== 0) {
		mx = new chartDiag.default.Matrix(-v1[2], v1[1], -v2[2], v2[1]);
		dx = mx.determinant();
		my = new chartDiag.default.Matrix(v1[0], -v1[2], v2[0], -v2[2]);
		dy = my.determinant();
		x = dx / d;
		y = dy / d;

		if (strict) {
			if (vector._contains(x, y) && this._contains(x, y)) {
				result = new chartDiag.default.Point(x, y);
			}
		} else {
			result = new chartDiag.default.Point(x, y);
		}
	}

	return result;
};

chartDiag.default.Vector.prototype._contains = function (x, y) {
	var x1 = Math.min(this.from.x, this.to.x),
		y1 = Math.min(this.from.y, this.to.y),
		x2 = Math.max(this.from.x, this.to.x),
		y2 = Math.max(this.from.y, this.to.y);

	return x1 <= x && x <= x2 && y1 <= y && y <= y2;
};

/* /graphics/Graphics.js*/
chartDiag.default.Graphics = function (element) {
	this.m_element = element;

	this.m_placeholders = {};
	this.m_activePlaceholder = null;

	this.m_cache = new chartDiag.default.Cache();

	this.graphicsType = null;
	this.hasGraphics = false;
	this.debug = false;
};

chartDiag.default.Graphics.prototype.clean = function () {
	var key,
		placeholder,
		layerKey,
		layer;
	this.m_cache.clear();

	this.m_cache = null;

	this.m_element = null;
	for (key in this.m_placeholders) {
		if (this.m_placeholders.hasOwnProperty(key)) {
			placeholder = this.m_placeholders[key];

			for (layerKey in placeholder.layers) {
				if (placeholder.layers.hasOwnProperty(layerKey)) {
					layer = placeholder.layers[layerKey];
					layer.canvas.remove();
					layer.canvas = null;
				}
			}
			placeholder.layers.length = 0;
			placeholder.activeLayer = null;

			placeholder.size = null;
			placeholder.rect = null;
			placeholder.div = null;
		}
	}
	this.m_placeholders.length = 0;
	this.m_activePlaceholder = null;
};

chartDiag.default.Graphics.prototype.resize = function (name, width, height) {
	var placeholder = this.m_placeholders[name];
	if (placeholder != null) {
		this.resizePlaceholder(placeholder, width, height);
	}
};

chartDiag.default.Graphics.prototype.resizePlaceholder = function (placeholder, width, height) {
	var layerKey,
		layer;

	placeholder.size = new chartDiag.default.Size(width, height);
	placeholder.rect = new chartDiag.default.Rect(0, 0, width, height);

	for (layerKey in placeholder.layers) {
		if (placeholder.layers.hasOwnProperty(layerKey)) {
			layer = placeholder.layers[layerKey];
			if (layer.name !== -1) {
				layer.canvas.css({
					"position": "absolute",
					"width": "0px",
					"height": "0px"
				});
			}
		}
	}
};

chartDiag.default.Graphics.prototype.begin = function () {
	this.m_cache.begin();
};

chartDiag.default.Graphics.prototype.end = function () {
	this.m_cache.end();
};


chartDiag.default.Graphics.prototype.reset = function (arg0, arg1) {
	var placeholderName = "none",
		layerName = -1;
	switch (arguments.length) {
		case 1:
			if (typeof arg0 === "string") {
				placeholderName = arg0;
			}
			else {
				layerName = arg0;
			}
			break;
		case 2:
			placeholderName = arg0;
			layerName = arg1;
			break;
	}
	this.m_cache.reset(placeholderName, layerName);
};

chartDiag.default.Graphics.prototype.activate = function (arg0, arg1) {
	switch (arguments.length) {
		case 1:
			if (typeof arg0 === "string") {
				this._activatePlaceholder(arg0);
				this._activateLayer(-1);
			}
			else {
				this._activatePlaceholder("none");
				this._activateLayer(arg0);
			}
			break;
		case 2:
			this._activatePlaceholder(arg0);
			this._activateLayer(arg1);
			break;
	}
	return this.m_activePlaceholder;
};

chartDiag.default.Graphics.prototype._activatePlaceholder = function (placeholderName) {
	var placeholder = this.m_placeholders[placeholderName],
		div;
	if (placeholder === undefined) {
		div = null;
		if (placeholderName === "none") {
			div = this.m_element;
		}
		else {
			div = this.m_element.find("." + placeholderName);
		}

		placeholder = new chartDiag.default.Placeholder(placeholderName);
		placeholder.div = div;
		placeholder.size = new chartDiag.default.Size(div.innerWidth(), div.innerHeight());
		placeholder.rect = new chartDiag.default.Rect(0, 0, placeholder.size.width, placeholder.size.height);

		this.m_placeholders[placeholderName] = placeholder;
	}
	this.m_activePlaceholder = placeholder;
};

chartDiag.default.Graphics.prototype._activateLayer = function (layerName) {
	var layer = this.m_activePlaceholder.layers[layerName],
		placeholder,
		canvas,
		position,
		maximumLayer,
		layerKey;
	if (layer === undefined) {
		placeholder = this.m_activePlaceholder;
		if (layerName === -1) {
			layer = new chartDiag.default.Layer(layerName);
			layer.canvas = placeholder.div;
		}
		else {
			canvas = jQuery('<div></div>');
			canvas.addClass("Layer" + layerName);
			position = new chartDiag.default.Rect(placeholder.rect);

			canvas.css({
				"position": "absolute",
				"width": "0px",
				"height": "0px"
			});

			maximumLayer = null;
			for (layerKey in placeholder.layers) {
				if (placeholder.layers.hasOwnProperty(layerKey)) {
					layer = placeholder.layers[layerKey];
					if (layer.name < layerName) {
						maximumLayer = (maximumLayer !== null) ? Math.max(maximumLayer, layer.name) : layer.name;
					}
				}
			}

			layer = new chartDiag.default.Layer(layerName);
			layer.canvas = canvas;

			if (maximumLayer === null) {
				placeholder.div.prepend(layer.canvas[0]);
			} else {
				layer.canvas.insertAfter(placeholder.layers[maximumLayer].canvas);
			}
		}
		placeholder.layers[layerName] = layer;
	}
	this.m_activePlaceholder.activeLayer = layer;
};

chartDiag.default.Graphics.prototype.text = function (x, y, width, height, label, orientation, horizontalAlignment, verticalAlignment, attr) {
	var placeholder = this.m_activePlaceholder,
		style = {
			"position": "absolute",
			"padding": 0,
			"margin": 0,
			"text-align": this._getTextAlign(horizontalAlignment),
			"font-size": attr["font-size"],
			"font-family": attr["font-family"],
			"font-weight": attr["font-weight"],
			"font-style": attr["font-style"],
			"color": attr["font-color"],
			"line-height": attr["font-size"]
		},
		rotation = "",
		element,
		tdstyle;

	switch (orientation) {
		case 0/*chartDiag.text.TextOrientationType.Horizontal*/:
		case 3/*chartDiag.text.TextOrientationType.Auto*/:
			style.left = x;
			style.top = y;
			style.width = width;
			style.height = height;
			break;
		case 1/*chartDiag.text.TextOrientationType.RotateLeft*/:
			style.left = x + Math.round(width / 2.0 - height / 2.0);
			style.top = y + Math.round(height / 2.0 - width / 2.0);
			style.width = height;
			style.height = width;
			rotation = "rotate(-90deg)";
			break;
		case 2/*chartDiag.text.TextOrientationType.RotateRight*/:
			style.left = x + Math.round(width / 2.0 - height / 2.0);
			style.top = y + Math.round(height / 2.0 - width / 2.0);
			style.width = height;
			style.height = width;
			rotation = "rotate(90deg)";
			break;
	}

	style["-webkit-transform-origin"] = "center center";
	style["-moz-transform-origin"] = "center center";
	style["-o-transform-origin"] = "center center";
	style["-ms-transform-origin"] = "center center";


	style["-webkit-transform"] = rotation;
	style["-moz-transform"] = rotation;
	style["-o-transform"] = rotation;
	style["-ms-transform"] = rotation;
	style.transform = rotation;


	style["max-width"] = style.width;
	style["max-height"] = style.height;

	label = label.replace(new RegExp("\n", 'g'), "<br/>");
	switch (verticalAlignment) {
		case 0/*chartDiag.default.VerticalAlignmentType.Top*/:
			if (this.debug) {
				style.border = "solid 1px black";
			}
			element = this.m_cache.get(placeholder.name, placeholder.activeLayer.name, "text");
			if (element === null) {
				element = jQuery("<div></div>");
				element.css(style);
				element.html(label);
				placeholder.activeLayer.canvas.append(element);
				this.m_cache.put(placeholder.name, placeholder.activeLayer.name, "text", element);
			}
			else {
				element.css(style);
				element.html(label);
			}
			break;
		default:
			style["border-collapse"] = "collapse";
			tdstyle = {
				"vertical-align": this._getVerticalAlignment(verticalAlignment),
				"padding": 0
			};
			if (this.debug) {
				tdstyle.border = "solid 1px black";
			}
			element = this.m_cache.get(placeholder.name, placeholder.activeLayer.name, "textintable");
			if (element === null) {
				element = jQuery('<table><tbody><tr><td></td></tr></tbody></table>');
				chartDiag.default.css(element, style);
				element.find("td").css(tdstyle).html(label);
				placeholder.activeLayer.canvas.append(element);
				this.m_cache.put(placeholder.name, placeholder.activeLayer.name, "textintable", element);
			}
			else {
				chartDiag.default.css(element, style);
				element.find("td").css(tdstyle).html(label);
			}
			break;
	}
};

chartDiag.default.Graphics.prototype._getTextAlign = function (alignment) {
	var result = null;
	switch (alignment) {
		case 0/*chartDiag.default.HorizontalAlignmentType.Center*/:
			result = "center";
			break;
		case 1/*chartDiag.default.HorizontalAlignmentType.Left*/:
			result = "left";
			break;
		case 2/*chartDiag.default.HorizontalAlignmentType.Right*/:
			result = "right";
			break;
	}
	return result;
};

chartDiag.default.Graphics.prototype._getVerticalAlignment = function (alignment) {
	var result = null;
	switch (alignment) {
		case 1/*chartDiag.default.VerticalAlignmentType.Middle*/:
			result = "middle";
			break;
		case 0/*chartDiag.default.VerticalAlignmentType.Top*/:
			result = "top";
			break;
		case 2/*chartDiag.default.VerticalAlignmentType.Bottom*/:
			result = "bottom";
			break;
	}
	return result;
};

chartDiag.default.Graphics.prototype.polylinesBuffer = function (buffer) {
	buffer.loop(this, function (polyline) {
		if (polyline.length() > 0) {
			this.polyline(polyline);
		}
	});
};

chartDiag.default.Graphics.prototype.polyline = function (polylineData) {
	var fromX = null,
		fromY = null,
		attr = polylineData.paletteItem.toAttr();

	polylineData.loop(this, function (segment) {
		switch (segment.segmentType) {
			case 1/*chartDiag.default.SegmentType.Move*/:
				fromX = Math.round(segment.x) + 0.5;
				fromY = Math.round(segment.y) + 0.5;
				break;
			case 0/*chartDiag.default.SegmentType.Line*/:
				this.rightAngleLine(fromX, fromY, Math.round(segment.x) + 0.5, Math.round(segment.y) + 0.5, attr);
				fromX = Math.round(segment.x) + 0.5;
				fromY = Math.round(segment.y) + 0.5;
				break;
			case 4/*chartDiag.default.SegmentType.Dot*/:
				this.dot(segment.x, segment.y, segment.width, segment.height, segment.cornerRadius, attr);
				break;
		}
	});
};

chartDiag.default.Graphics.prototype.dot = function (cx, cy, width, height, cornerRadius, attr) {
	var placeholder = this.m_activePlaceholder,
		element = this.m_cache.get(placeholder.name, placeholder.activeLayer.name, "dot"),
		hasBorder = (attr.lineWidth !== undefined && attr.borderColor !== undefined),
		style = {
			"position": "absolute",
			"width": (width - (hasBorder ? 1 : 0)),
			"top": Math.round(cy),
			"left": Math.round(cx),
			"padding": 0,
			"margin": 0,
			"line-height": "0px",
			"overflow": "hidden",
			"height": (height - (hasBorder ? 1 : 0)),
			"background": attr.fillColor,
			"-moz-border-radius": cornerRadius,
			"-webkit-border-radius": cornerRadius,
			"-khtml-border-radius": cornerRadius,
			"border-radius": cornerRadius,
			"font-size": "0px",
			"border-style": (hasBorder ? "Solid" : "None"),
			"border-width": (hasBorder ? "1px" : "0px"),
			"border-color": (hasBorder ? attr.borderColor : "")
		};

	if (element === null) {
		element = jQuery('<div></div>');
		chartDiag.default.css(element, style);
		placeholder.activeLayer.canvas.append(element);
		this.m_cache.put(placeholder.name, placeholder.activeLayer.name, "dot", element);
	} else {
		chartDiag.default.css(element, style);
	}
};

chartDiag.default.Graphics.prototype.rightAngleLine = function (fromX, fromY, toX, toY, attr) {
	var placeholder = this.m_activePlaceholder,
		isVertical = Math.abs(toY - fromY) > Math.abs(toX - fromX),
		lineWidth = attr.lineWidth,
		style = {
			"position": "absolute",
			"top": Math.round(Math.min(fromY, toY) - ((isVertical) ? 0 : lineWidth / 2.0)),
			"left": Math.round(Math.min(fromX, toX) - ((isVertical) ? lineWidth / 2.0 : 0)),
			"padding": 0,
			"margin": 0,
			"opacity": 0.5,
			"line-height": "0px",
			"overflow": "hidden",
			"background": attr.borderColor,
			"font-size": "0px"
		},
		element;

		if (isVertical) {
			style.width = lineWidth;
			style.height = Math.abs(Math.round(toY - fromY));
		} else {
			style.width = Math.abs(Math.round(toX - fromX));
			style.height = lineWidth;
		}

		element = this.m_cache.get(placeholder.name, placeholder.activeLayer.name, "rect");
		if (element === null) {
			element = jQuery("<div></div>");
			chartDiag.default.css(element, style);
			placeholder.activeLayer.canvas.append(element);
			this.m_cache.put(placeholder.name, placeholder.activeLayer.name, "rect", element);
		} else {
			chartDiag.default.css(element, style);
		}
};

chartDiag.default.Graphics.prototype.template = function (x, y, width, height, contentx, contenty, contentWidth, contentHeight, template, hashCode, onRenderTemplate, uiHash, attr) { //ignore jslint
	var placeholder = this.m_activePlaceholder,
		element,
		templateKey = "template" + ((hashCode !== null) ? hashCode : chartDiag.default.hashCode(template)),
		gap = 0,
		style;

		element = this.m_cache.get(placeholder.name, placeholder.activeLayer.name, templateKey);

		if (attr !== null) {
			if (attr["border-width"] !== undefined) {
				gap = this.getPxSize(attr["border-width"]);
			}
		}

		style = {
			"width": (contentWidth - gap) + "px",
			"height": (contentHeight - gap) + "px",
			"top": (y + contenty) + "px",
			"left": (x + contentx) + "px"
		};

		jQuery.extend(style, attr);

		if (uiHash == null) {
			uiHash = new chartDiag.default.RenderEventArgs();
		}
		if (element == null) {
			element = jQuery(template);
			jQuery.extend(style, {
				"position": "absolute",
				"padding": "0px",
				"margin": "0px"
			}, attr);
			chartDiag.default.css(element, style);

			uiHash.element = element;
			uiHash.renderingMode = 0/*chartDiag.default.RenderingMode.Create*/;

			if (onRenderTemplate !== null) {
				onRenderTemplate(null, uiHash);
			}
			placeholder.activeLayer.canvas.append(element);
			this.m_cache.put(placeholder.name, placeholder.activeLayer.name, templateKey, element);
		} else {
			uiHash.element = element;
			uiHash.renderingMode = 1/*chartDiag.default.RenderingMode.Update*/;
			chartDiag.default.css(element, style);
			if (onRenderTemplate !== null) {
				onRenderTemplate(null, uiHash);
			}
		}
	return element;
};

chartDiag.default.Graphics.prototype.getPxSize = function (value, base) {
	var result = value;
	if (typeof value === "string") {
		if (value.indexOf("pt") > 0) {
			result = parseInt(value, 10) * 96 / 72;
		}
		else if (value.indexOf("%") > 0) {
			result = parseFloat(value) / 100.0 * base;
		}
		else {
			result = parseInt(value, 10);
		}
	}
	return result;
};

/* /graphics/Cache.js*/
chartDiag.default.Cache = function () {
	this.threshold = 20;

	this.m_visible = {};
	this.m_invisible = {};
};

chartDiag.default.Cache.prototype.begin = function () {
	var placeholder,
		type,
		index,
		control;

	for (placeholder in this.m_visible) {
		if (this.m_visible.hasOwnProperty(placeholder)) {
			for (type in this.m_visible[placeholder]) {
				if (this.m_visible[placeholder].hasOwnProperty(type)) {
					for (index = this.m_visible[placeholder][type].length - 1; index >= 0; index -= 1) {
						control = this.m_visible[placeholder][type][index];
						control.css({ "visibility": "hidden" });
						this.m_invisible[placeholder][type].push(control);
					}
					this.m_visible[placeholder][type].length = 0;
				}
			}
		}
	}
};

chartDiag.default.Cache.prototype.end = function () {
	var placeholder,
		type,
		control;
	for (placeholder in this.m_visible) {
		if (this.m_visible.hasOwnProperty(placeholder)) {
			for (type in this.m_visible[placeholder]) {
				if (this.m_visible[placeholder].hasOwnProperty(type)) {
					control = null;
					if (this.m_invisible[placeholder][type].length > this.threshold) {
						while ((control = this.m_invisible[placeholder][type].pop()) !== undefined) {
							control.remove();
						}
					}
				}
			}
		}
	}
};

chartDiag.default.Cache.prototype.reset = function (placeholder, layer) {
	placeholder = placeholder + "-" + layer;
	var control = null,
		type,
		index;
	for (type in this.m_visible[placeholder]) {
		if (this.m_visible[placeholder].hasOwnProperty(type)) {
			for (index = this.m_visible[placeholder][type].length - 1; index >= 0; index -= 1) {
				control = this.m_visible[placeholder][type][index];
				this.m_invisible[placeholder][type].push(control);
				control.css({ "visibility": "hidden" });
			}
			this.m_visible[placeholder][type].length = 0;
		}
	}
};

chartDiag.default.Cache.prototype.clear = function () {
	var placeholder,
		type,
		control;
	for (placeholder in this.m_visible) {
		if (this.m_visible.hasOwnProperty(placeholder)) {
			for (type in this.m_visible[placeholder]) {
				if (this.m_visible[placeholder].hasOwnProperty(type)) {
					control = null;
					while ((control = this.m_visible[placeholder][type].pop()) !== undefined) {
						control.remove();
					}
					while ((control = this.m_invisible[placeholder][type].pop()) !== undefined) {
						control.remove();
					}
				}
			}
		}
	}
};

chartDiag.default.Cache.prototype.get = function (placeholder, layer, type) {
	placeholder = placeholder + "-" + layer;
	var result = null;
	if (this.m_visible[placeholder] === undefined) {
		this.m_visible[placeholder] = {};
		this.m_invisible[placeholder] = {};
	}
	if (this.m_visible[placeholder][type] === undefined) {
		this.m_visible[placeholder][type] = [];
		this.m_invisible[placeholder][type] = [];
	}
	result = this.m_invisible[placeholder][type].pop() || null;
	if (result !== null) {
		this.m_visible[placeholder][type].push(result);
		result.css({ "visibility": "inherit" });
	}
	return result;
};

chartDiag.default.Cache.prototype.put = function (placeholder, layer, type, control) {
	placeholder = placeholder + "-" + layer;
	this.m_visible[placeholder][type].push(control);
};

/* /graphics/CanvasGraphics.js*/
chartDiag.default.CanvasGraphics = function (element) {
	this.parent = chartDiag.default.Graphics.prototype;

	this.parent.constructor.apply(this, arguments);

	this.graphicsType = 1/*chartDiag.default.GraphicsType.Canvas*/;
	this.m_maximum = 8000; // Search for maximum size of canvas element
};

chartDiag.default.CanvasGraphics.prototype = new chartDiag.default.Graphics();

chartDiag.default.CanvasGraphics.prototype.clean = function () {
	var key,
		placeholder,
		layerKey,
		layer;
	for (key in this.m_placeholders) {
		if (this.m_placeholders.hasOwnProperty(key)) {
			placeholder = this.m_placeholders[key];
			for (layerKey in placeholder.layers) {
				if (placeholder.layers.hasOwnProperty(layerKey)) {
					layer = placeholder.layers[layerKey];
					if (layer.canvascanvas !== null) {
						layer.canvascanvas.remove();
						layer.canvascanvas = null;
					}
				}
			}
		}
	}
	this.parent.clean.apply(this, arguments);
};

chartDiag.default.CanvasGraphics.prototype._activatePlaceholder = function (placeholderName) {
	var placeholder,
		width,
		height;

	this.parent._activatePlaceholder.apply(this, arguments);

	placeholder = this.m_activePlaceholder;
	width = placeholder.size.width;
	height = placeholder.size.height;
	if (width > this.m_maximum || height > this.m_maximum) {
		placeholder.hasGraphics = false;
	}
	else {
		placeholder.hasGraphics = true;
	}
};

chartDiag.default.CanvasGraphics.prototype.resizePlaceholder = function (placeholder, width, height) {
	var layerKey,
		layer;

	this.parent.resizePlaceholder.apply(this, arguments);

	for (layerKey in placeholder.layers) {
		if (placeholder.layers.hasOwnProperty(layerKey)) {
			layer = placeholder.layers[layerKey];
			if (layer.canvascanvas !== null) {
				layer.canvascanvas.css({
					"position": "absolute",
					"width": width + "px",
					"height": height + "px"
				});
				layer.canvascanvas.attr({
					"width": width + "px",
					"height": height + "px"
				});
			}
		}
	}
};

chartDiag.default.CanvasGraphics.prototype.begin = function () {
	var key,
		placeholder,
		layerKey,
		layer,
		width,
		height;
	this.parent.begin.apply(this);

	for (key in this.m_placeholders) {
		if (this.m_placeholders.hasOwnProperty(key)) {
			placeholder = this.m_placeholders[key];
			width = placeholder.size.width;
			height = placeholder.size.height;
			for (layerKey in placeholder.layers) {
				if (placeholder.layers.hasOwnProperty(layerKey)) {
					layer = placeholder.layers[layerKey];

					if (layer.canvascanvas !== null) {
						layer.canvascontext.clearRect(0, 0, width, height);
					}
				}
			}
		}
	}
};

chartDiag.default.Graphics.prototype._getContext = function (placeholder, layer) {
	var width = placeholder.size.width,
		height = placeholder.size.height;

	if (layer.canvascanvas === null) {
		layer.canvascanvas = jQuery('<canvas></canvas>');

		layer.canvascanvas.attr({
			"width": width + "px",
			"height": height + "px"
		});
		placeholder.activeLayer.canvas.prepend(layer.canvascanvas);
		layer.canvascontext = layer.canvascanvas[0].getContext('2d');
	}
	return layer.canvascontext;
};

chartDiag.default.CanvasGraphics.prototype.reset = function (arg0, arg1) {
	var placeholderName = "none",
		layerName = -1,
		placeholder,
		layer,
		width,
		height;
	switch (arguments.length) {
		case 1:
			if (typeof arg0 === "string") {
				placeholderName = arg0;
			}
			else {
				layerName = arg0;
			}
			break;
		case 2:
			placeholderName = arg0;
			layerName = arg1;
			break;
	}

	this.parent.reset.apply(this, arguments);

	placeholder = this.m_placeholders[placeholderName];
	if (placeholder !== undefined) {
		width = placeholder.size.width;
		height = placeholder.size.height;
		layer = placeholder.layers[layerName];
		if (layer !== undefined && layer.canvascanvas !== null) {
			layer.canvascontext.clearRect(0, 0, width, height);
		}
	}
};

chartDiag.default.CanvasGraphics.prototype.polyline = function (polylineData) {
	var placeholder = this.m_activePlaceholder,
		layer,
		context,
		attr = polylineData.paletteItem.toAttr(),
		dashes,
		step,
		cornerRadius;
	if (!placeholder.hasGraphics) {
		this.parent.polyline.apply(this, arguments);
	}
	else {
		layer = placeholder.activeLayer;
		context = this._getContext(placeholder, layer);
		context.save();

		if (attr.lineWidth !== undefined && attr.borderColor !== undefined) {
			context.strokeStyle = attr.borderColor;
			context.lineWidth = attr.lineWidth;
		}
		else {
			context.lineWidth = 0;
			context.strokeStyle = "Transparent";
		}

		if (attr.lineType != null) {
			step = Math.round(attr.lineWidth) || 1;
			switch (attr.lineType) {
				case 0/*chartDiag.default.LineType.Solid*/:
					dashes = [];
					break;
				case 1/*chartDiag.default.LineType.Dotted*/:
					dashes = [step, step];
					break;
				case 2/*chartDiag.default.LineType.Dashed*/:
					dashes = [step * 5, step * 3];
					break;
			}

			if (context.setLineDash !== undefined) {
				context.setLineDash(dashes);
			} else if (context.webkitLineDash !== undefined) {
				context.webkitLineDash = dashes;
			} else if (context.mozDash !== undefined) {
				context.mozDash = dashes;
			}
		}

		context.beginPath();

		polylineData.loop(this, function (segment) {
			switch (segment.segmentType) {
				case 1/*chartDiag.default.SegmentType.Move*/:
					context.moveTo(Math.round(segment.x) + 0.5, Math.round(segment.y) + 0.5);
					break;
				case 0/*chartDiag.default.SegmentType.Line*/:
					context.lineTo(Math.round(segment.x) + 0.5, Math.round(segment.y) + 0.5);
					break;
				case 4/*chartDiag.default.SegmentType.Dot*/:
					if (segment.width == segment.height && segment.width / 2.0 <= segment.cornerRadius) {
						// circle dot
						context.moveTo(Math.round(segment.x) + segment.width + 0.5, Math.round(segment.y) + segment.height / 2.0 + 0.5);
						context.arc(Math.round(segment.x) + segment.width / 2.0 + 0.5, Math.round(segment.y) + segment.height / 2.0 + 0.5, Math.round(segment.width / 2.0), 0, 2 * Math.PI, false);
					} else if (segment.cornerRadius === 0) {
						// square
						context.moveTo(Math.round(segment.x) + 0.5, Math.round(segment.y) + 0.5);
						context.lineTo(Math.round(segment.x + segment.width) + 0.5, Math.round(segment.y) + 0.5);
						context.lineTo(Math.round(segment.x + segment.width) + 0.5, Math.round(segment.y + segment.height) + 0.5);
						context.lineTo(Math.round(segment.x) + 0.5, Math.round(segment.y + segment.height) + 0.5);
						context.lineTo(Math.round(segment.x) + 0.5, Math.round(segment.y) + 0.5);
					} else {
						// rounded corners rectangle
						cornerRadius = Math.min(segment.cornerRadius, Math.min(segment.width / 2.0, segment.height / 2.0));

						context.moveTo(Math.round(segment.x) + 0.5, Math.round(segment.y + cornerRadius) + 0.5);
						context.arc(Math.round(segment.x + cornerRadius) + 0.5, Math.round(segment.y + cornerRadius) + 0.5, Math.round(cornerRadius), Math.PI, -Math.PI / 2.0, false);

						context.lineTo(Math.round(segment.x + segment.width - cornerRadius) + 0.5, Math.round(segment.y) + 0.5);
						context.arc(Math.round(segment.x + segment.width - cornerRadius) + 0.5, Math.round(segment.y + cornerRadius) + 0.5, Math.round(cornerRadius), -Math.PI / 2.0, 0, false);

						context.lineTo(Math.round(segment.x + segment.width) + 0.5, Math.round(segment.y + segment.height - cornerRadius) + 0.5);
						context.arc(Math.round(segment.x + segment.width - cornerRadius) + 0.5, Math.round(segment.y + segment.height - cornerRadius) + 0.5, Math.round(cornerRadius), 0, Math.PI / 2.0, false);

						context.lineTo(Math.round(segment.x + cornerRadius) + 0.5, Math.round(segment.y + segment.height) + 0.5);
						context.arc(Math.round(segment.x + cornerRadius) + 0.5, Math.round(segment.y + segment.height - cornerRadius) + 0.5, Math.round(cornerRadius), Math.PI / 2.0, Math.PI, false);

						context.lineTo(Math.round(segment.x) + 0.5, Math.round(segment.y + cornerRadius) + 0.5);
					}
					break;
				case 2/*chartDiag.default.SegmentType.QuadraticArc*/:
					context.quadraticCurveTo(Math.round(segment.cpX) + 0.5, Math.round(segment.cpY) + 0.5, Math.round(segment.x) + 0.5, Math.round(segment.y) + 0.5);
					break;
				case 3/*chartDiag.default.SegmentType.CubicArc*/:
					context.bezierCurveTo(Math.round(segment.cpX1) + 0.5,
						Math.round(segment.cpY1) + 0.5,
						Math.round(segment.cpX2) + 0.5,
						Math.round(segment.cpY2) + 0.5,
						Math.round(segment.x) + 0.5,
						Math.round(segment.y) + 0.5);
					break;
			}
		});

		if (attr.lineWidth !== undefined) {
			context.stroke();
		}
		if (attr.fillColor !== undefined) {
			context.fillStyle = attr.fillColor;
			context.globalAlpha = attr.opacity;
			context.fill();
		}
		context.restore();
	}
};

/* /graphics/Element.js*/
chartDiag.default.Element = function (arg0, arg1) {
	this.ns = null;
	this.name = null;
	this.attr = {};
	this.style = {};

	this.children = [];

	switch (arguments.length) {
		case 1:
			this.name = arg0;
			break;
		case 2:
			this.ns = arg0;
			this.name = arg1;
			break;
		default:
			break;
	}
};

chartDiag.default.Element.prototype.setAttribute = function (key, value) {
	this.attr[key] = value;
};

chartDiag.default.Element.prototype.appendChild = function (child) {
	this.children[this.children.length] = child;
};

chartDiag.default.Element.prototype.create = function (ie8mode) {
	var result = null,
		name,
		child,
		index;
	if (this.ns !== null) {
		result = document.createElementNS(this.ns, this.name);
	}
	else {
		result = document.createElement(this.name);
	}
	for (name in this.attr) {
		if (this.attr.hasOwnProperty(name)) {
			if (ie8mode !== undefined) {
				result[name] = this.attr[name];
			}
			else {
				result.setAttribute(name, this.attr[name]);
			}
		}
	}
	for (name in this.style) {
		if (this.style.hasOwnProperty(name)) {
			result.style[name] = this.style[name];
		}
	}
	for (index = 0; index < this.children.length; index += 1) {
		child = this.children[index];
		if (typeof child === "string") {
			result.appendChild(document.createTextNode(child));
		}
		else {
			result.appendChild(child.create(ie8mode));
		}
	}
	return result;
};

chartDiag.default.Element.prototype.update = function (target, ie8mode) {
	var name,
		length,
		index,
		child,
		value;
	for (name in this.style) {
		if (this.style.hasOwnProperty(name)) {
			value = this.style[name];
			if (target.style[name] !== value) {
				target.style[name] = value;
			}
		}
	}
	for (name in this.attr) {
		if (this.attr.hasOwnProperty(name)) {
			value = this.attr[name];
			if (ie8mode !== undefined) {
				/* if you see exception here, it may be result of following situations:
					1. You moved chart from one DOM node to another manually, it invalidates VML graphics in IE6, IE7 modes
					so it is impossable to reuse VML items in DOM anymore. You have to update chart with Recreate option instead of refresh.
					2. You made changes in Polyline graphics Charts and added extra sub nodes to it, so number and type of children for shape 
						have been changed, so sub nodes mismatch is a reason for this exception.
				*/
				if (target[name] !== value) {
					target[name] = value;
				}
			}
			else {
				if (target.getAttribute(name) !== value) {
					target.setAttribute(name, value);
				}
			}
		}
	}
	length = this.children.length;
	for (index = 0; index < length; index += 1) {
		child = this.children[index];
		if (typeof child === "string") {
			if (target.innerHtml !== child) {
				target.innerHtml = child;
			}
		}
		else {
			this.children[index].update(target.children[index], ie8mode);
		}
	}
};

/* /graphics/Layer.js*/
chartDiag.default.Layer = function (name) {
	this.name = name;

	this.canvas = null;

	this.canvascanvas = null;
	this.svgcanvas = null;
};

/* /graphics/Placeholder.js*/
chartDiag.default.Placeholder = function (name) {
	this.name = name;

	this.layers = {};
	this.activeLayer = null;

	this.size = null;
	this.rect = null;

	this.div = null;

	this.hasGraphics = true;
};

/* /graphics/SvgGraphics.js*/
chartDiag.default.SvgGraphics = function (element) {
	this.parent = chartDiag.default.Graphics.prototype;

	this.parent.constructor.apply(this, arguments);

	this._svgxmlns = "http://www.w3.org/2000/svg";

	this.graphicsType = 0/*chartDiag.default.GraphicsType.SVG*/;

	this.hasGraphics = true;
};

chartDiag.default.SvgGraphics.prototype = new chartDiag.default.Graphics();

chartDiag.default.SvgGraphics.prototype.clean = function () {
	var key,
		placeholder,
		layerKey,
		layer;
	for (key in this.m_placeholders) {
		if (this.m_placeholders.hasOwnProperty(key)) {
			placeholder = this.m_placeholders[key];
			for (layerKey in placeholder.layers) {
				if (placeholder.layers.hasOwnProperty(layerKey)) {
					layer = placeholder.layers[layerKey];
					if (layer.svgcanvas !== null) {
						layer.svgcanvas.remove();
						layer.svgcanvas = null;
					}
				}
			}
		}
	}
	this.parent.clean.apply(this, arguments);
};

chartDiag.default.SvgGraphics.prototype.resizePlaceholder = function (placeholder, width, height) {
	var layerKey,
		layer,
		position;

	this.parent.resizePlaceholder.apply(this, arguments);

	for (layerKey in placeholder.layers) {
		if (placeholder.layers.hasOwnProperty(layerKey)) {
			layer = placeholder.layers[layerKey];
			if (layer.svgcanvas !== null) {
				position = {
					"position": "absolute",
					"width": width + "px",
					"height": height + "px"
				};
				layer.svgcanvas.css(position);
				layer.svgcanvas.attr({
					"viewBox": "0 0 " + width + " " + height
				});
			}
		}
	}
};

chartDiag.default.SvgGraphics.prototype._getCanvas = function () {
	var placeholder = this.m_activePlaceholder,
		layer = placeholder.activeLayer,
		panelSize = placeholder.rect;
	if (layer.svgcanvas === null) {
		layer.svgcanvas = jQuery('<svg version = "1.1"></svg>');
		layer.svgcanvas.attr({
			"viewBox": panelSize.x + " " + panelSize.y + " " + panelSize.width + " " + panelSize.height
		});
		layer.svgcanvas.css({
			"width": panelSize.width + "px",
			"height": panelSize.height + "px"
		});
		placeholder.activeLayer.canvas.prepend(layer.svgcanvas);
	}

	return layer.svgcanvas;
};

chartDiag.default.SvgGraphics.prototype.polyline = function (polylineData) {
	var placeholder = this.m_activePlaceholder,
		polyline,
		data,
		attr = polylineData.paletteItem.toAttr(),
		element,
		svgcanvas,
		step,
		radius,
		cornerRadius;


	polyline = new chartDiag.default.Element(this._svgxmlns, "path");
	if (attr.fillColor !== undefined) {
		polyline.setAttribute("fill", attr.fillColor);
		polyline.setAttribute("fill-opacity", attr.opacity);
	}
	else {
		polyline.setAttribute("fill-opacity", 0);
	}

	if (attr.lineWidth !== undefined && attr.borderColor !== undefined) {
		polyline.setAttribute("stroke", attr.borderColor);
		polyline.setAttribute("stroke-width", attr.lineWidth);
	} else {
		polyline.setAttribute("stroke", "transparent");
		polyline.setAttribute("stroke-width", 0);
	}

	if (attr.lineType != null) {
		step = Math.round(attr.lineWidth) || 1;
		switch (attr.lineType) {
			case 0/*chartDiag.default.LineType.Solid*/:
				polyline.setAttribute("stroke-dasharray", "");
				break;
			case 1/*chartDiag.default.LineType.Dotted*/:
				polyline.setAttribute("stroke-dasharray", step + "," + step);
				break;
			case 2/*chartDiag.default.LineType.Dashed*/:
				polyline.setAttribute("stroke-dasharray", (step * 5) + "," + (step * 3));
				break;
		}
	}

	data = "";
	polylineData.loop(this, function (segment) {
		switch (segment.segmentType) {
			case 1/*chartDiag.default.SegmentType.Move*/:
				data += "M" + (Math.round(segment.x) + 0.5) + " " + (Math.round(segment.y) + 0.5);
				break;
			case 0/*chartDiag.default.SegmentType.Line*/:
				data += "L" + (Math.round(segment.x) + 0.5) + " " + (Math.round(segment.y) + 0.5);
				break;
			case 2/*chartDiag.default.SegmentType.QuadraticArc*/:
				data += "Q" + (Math.round(segment.cpX) + 0.5) + " " + (Math.round(segment.cpY) + 0.5) + " " + (Math.round(segment.x) + 0.5) + " " + (Math.round(segment.y) + 0.5);
				break;
			case 4/*chartDiag.default.SegmentType.Dot*/:
				// A rx, ry, x-axis-rotation, large-arc-flag, sweep-flag, x, y
				if (segment.width == segment.height && segment.width / 2.0 <= segment.cornerRadius) {
					// dot
					radius = segment.width / 2.0;
					data += "M" + (Math.round(segment.x) + 0.5) + " " + (Math.round(segment.y) + segment.height / 2.0 + 0.5);
					data += "A" + radius + " " + radius + " 0 0 0 " + (Math.round(segment.x + segment.width) + 0.5) + " " + (Math.round(segment.y) + segment.height / 2.0 + 0.5);
					data += "A" + radius + " " + radius + " 0 0 0 " + (Math.round(segment.x) + 0.5) + " " + (Math.round(segment.y) + segment.height / 2.0 + 0.5);
				} else if (segment.cornerRadius === 0) {
					// square
					data += "M" + (Math.round(segment.x) + 0.5) + " " + (Math.round(segment.y) + 0.5);
					data += "L" + (Math.round(segment.x + segment.width) + 0.5) + " " + (Math.round(segment.y) + 0.5);
					data += "L" + (Math.round(segment.x + segment.width) + 0.5) + " " + (Math.round(segment.y + segment.height) + 0.5);
					data += "L" + (Math.round(segment.x) + 0.5) + " " + (Math.round(segment.y + segment.height) + 0.5);
					data += "L" + (Math.round(segment.x) + 0.5) + " " + (Math.round(segment.y) + 0.5);
				} else {
					cornerRadius = Math.min(segment.cornerRadius, Math.min(segment.width / 2.0, segment.height / 2.0));
					data += "M" + (Math.round(segment.x) + 0.5) + " " + (Math.round(segment.y + cornerRadius) + 0.5);
					data += "A" + Math.round(cornerRadius) + " " + Math.round(cornerRadius) + " 0 0 1 " + (Math.round(segment.x + cornerRadius) + 0.5) + " " + (Math.round(segment.y) + 0.5);
					data += "L" + (Math.round(segment.x + segment.width - cornerRadius) + 0.5) + " " + (Math.round(segment.y) + 0.5);
					data += "A" + Math.round(cornerRadius) + " " + Math.round(cornerRadius) + " 0 0 1 " + (Math.round(segment.x + segment.width) + 0.5) + " " + (Math.round(segment.y + cornerRadius) + 0.5);
					data += "L" + (Math.round(segment.x + segment.width) + 0.5) + " " + (Math.round(segment.y + segment.height - cornerRadius) + 0.5);
					data += "A" + Math.round(cornerRadius) + " " + Math.round(cornerRadius) + " 0 0 1 " + (Math.round(segment.x + segment.width - cornerRadius) + 0.5) + " " + (Math.round(segment.y + segment.height) + 0.5);
					data += "L" + (Math.round(segment.x + cornerRadius) + 0.5) + " " + (Math.round(segment.y + segment.height) + 0.5);
					data += "A" + Math.round(cornerRadius) + " " + Math.round(cornerRadius) + " 0 0 1 " + (Math.round(segment.x) + 0.5) + " " + (Math.round(segment.y + segment.height - cornerRadius) + 0.5);
					data += "L" + (Math.round(segment.x) + 0.5) + " " + (Math.round(segment.y + cornerRadius) + 0.5);
				}
				break;
			case 3/*chartDiag.default.SegmentType.CubicArc*/:
				data += "C" + (Math.round(segment.cpX1) + 0.5) + " " + (Math.round(segment.cpY1) + 0.5) +
					" " + (Math.round(segment.cpX2) + 0.5) + " " + (Math.round(segment.cpY2) + 0.5) +
					" " + (Math.round(segment.x) + 0.5) + " " + (Math.round(segment.y) + 0.5);
				break;
		}
	});

	polyline.setAttribute("d", data);
	element = this.m_cache.get(placeholder.name, placeholder.activeLayer.name, "path");
	if (element === null) {
		element = jQuery(polyline.create());
		svgcanvas = this._getCanvas();
		svgcanvas.append(element);
		this.m_cache.put(placeholder.name, placeholder.activeLayer.name, "path", element);
	}
	else {
		polyline.update(element[0]);
	}
};

/* /graphics/Transform.js*/
chartDiag.default.Transform = function () {
	this.invertArea = false;
	this.invertHorizontally = false;
	this.invertVertically = false;

	this.size = null;
};

chartDiag.default.Transform.prototype.setOrientation = function (orientationType) {
	switch (orientationType) {
		case 0/*chartDiag.default.OrientationType.Top*/:
			this.invertArea = false;
			this.invertHorizontally = false;
			this.invertVertically = false;
			break;
		case 1/*chartDiag.default.OrientationType.Bottom*/:
			this.invertArea = false;
			this.invertHorizontally = false;
			this.invertVertically = true;
			break;
		case 2/*chartDiag.default.OrientationType.Left*/:
			this.invertArea = true;
			this.invertHorizontally = false;
			this.invertVertically = false;
			break;
		case 3/*chartDiag.default.OrientationType.Right*/:
			this.invertArea = true;
			this.invertHorizontally = true;
			this.invertVertically = false;
			break;
	}
};

chartDiag.default.Transform.prototype.getOrientation = function (orientationType) {
	var result = orientationType;
	if (this.invertHorizontally) {
		switch (orientationType) {
			case 2/*chartDiag.default.OrientationType.Left*/:
				result = 3/*chartDiag.default.OrientationType.Right*/;
				break;
			case 3/*chartDiag.default.OrientationType.Right*/:
				result = 2/*chartDiag.default.OrientationType.Left*/;
				break;
		}
	}

	if (this.invertVertically) {
		switch (orientationType) {
			case 0/*chartDiag.default.OrientationType.Top*/:
				result = 1/*chartDiag.default.OrientationType.Bottom*/;
				break;
			case 1/*chartDiag.default.OrientationType.Bottom*/:
				result = 0/*chartDiag.default.OrientationType.Top*/;
				break;
		}
	}


	if (this.invertArea) {
		switch (result) {
			case 0/*chartDiag.default.OrientationType.Top*/:
				result = 2/*chartDiag.default.OrientationType.Left*/;
				break;
			case 1/*chartDiag.default.OrientationType.Bottom*/:
				result = 3/*chartDiag.default.OrientationType.Right*/;
				break;
			case 2/*chartDiag.default.OrientationType.Left*/:
				result = 0/*chartDiag.default.OrientationType.Top*/;
				break;
			case 3/*chartDiag.default.OrientationType.Right*/:
				result = 1/*chartDiag.default.OrientationType.Bottom*/;
				break;
		}
	}

	return result;
};

chartDiag.default.Transform.prototype.transformPoint = function (x, y, forward, self, func) {
	var value;

	if (forward) {
		if (this.invertArea) {
			value = x;
			x = y;
			y = value;
		}
	}

	if (this.invertHorizontally) {
		x = this.size.width - x;
	}
	if (this.invertVertically) {
		y = this.size.height - y;
	}

	if (!forward) {
		if (this.invertArea) {
			value = x;
			x = y;
			y = value;
		}
	}

	func.call(self, x, y);
};

chartDiag.default.Transform.prototype.transformPoints = function (x, y, x2, y2, forward, self, func) {
	var value;

	if (forward) {
		if (this.invertArea) {
			value = x;
			x = y;
			y = value;
			value = x2;
			x2 = y2;
			y2 = value;
		}
	}

	if (this.invertHorizontally) {
		x = this.size.width - x;
		x2 = this.size.width - x2;
	}

	if (this.invertVertically) {
		y = this.size.height - y;
		y2 = this.size.height - y2;
	}

	if (!forward) {
		if (this.invertArea) {
			value = x;
			x = y;
			y = value;
			value = x2;
			x2 = y2;
			y2 = value;
		}
	}

	func.call(self, x, y, x2, y2);
};

chartDiag.default.Transform.prototype.transform3Points = function (x, y, x2, y2, x3, y3, forward, self, func) {
	var value;

	if (forward) {
		if (this.invertArea) {
			value = x;
			x = y;
			y = value;
			value = x2;
			x2 = y2;
			y2 = value;
			value = x3;
			x3 = y3;
			y3 = value;
		}
	}

	if (this.invertHorizontally) {
		x = this.size.width - x;
		x2 = this.size.width - x2;
		x3 = this.size.width - x3;
	}
	if (this.invertVertically) {
		y = this.size.height - y;
		y2 = this.size.height - y2;
		y3 = this.size.height - y3;
	}

	if (!forward) {
		if (this.invertArea) {
			value = x;
			x = y;
			y = value;
			value = x2;
			x2 = y2;
			y2 = value;
			value = x3;
			x3 = y3;
			y3 = value;
		}
	}

	func.call(self, x, y, x2, y2, x3, y3);
};

chartDiag.default.Transform.prototype.transformRect = function (x, y, width, height, forward, self, func) {
	var value;

	if (forward) {
		if (this.invertArea) {
			value = x;
			x = y;
			y = value;
			value = width;
			width = height;
			height = value;
		}
	}

	if (this.invertHorizontally) {
		x = this.size.width - x - width;
	}
	if (this.invertVertically) {
		y = this.size.height - y - height;
	}

	if (!forward) {
		if (this.invertArea) {
			value = x;
			x = y;
			y = value;
			value = width;
			width = height;
			height = value;
		}
	}

	func.call(self, x, y, width, height);
};

/* /graphics/VmlGraphics.js*/
chartDiag.default.VmlGraphics = function (element) {
	var vmlStyle,
		names,
		index;
	this.parent = chartDiag.default.Graphics.prototype;
	this.parent.constructor.apply(this, arguments);


	this.prefix = "rvml";
	this.ie8mode = (document.documentMode && document.documentMode >= 8);

	try {
		/*ignore jslint start*/
		eval('document.namespaces');
		/*ignore jslint end*/
	}
	catch (ex) {

	}

	if (!document.namespaces[this.prefix]) {
		document.namespaces.add(this.prefix, 'urn:schemas-microsoft-com:vml');
	}

	if (!chartDiag.default.VmlGraphics.prototype.vmlStyle) {
		vmlStyle = chartDiag.default.VmlGraphics.prototype.vmlStyle = document.createStyleSheet();
		names = [" *", "fill", "shape", "path", "textpath", "stroke"];
		for (index = 0; index < names.length; index += 1) {
			vmlStyle.addRule(this.prefix + "\\:" + names[index], "behavior:url(#default#VML); position:absolute;");
		}
	}

	this.graphicsType = 2/*chartDiag.default.GraphicsType.VML*/;
	this.hasGraphics = true;
};

chartDiag.default.VmlGraphics.prototype = new chartDiag.default.Graphics();

chartDiag.default.VmlGraphics.prototype.text = function (x, y, width, height, label, orientation, horizontalAlignment, verticalAlignment, attr) {
	var placeholder,
		rotateLeft,
		textRect,
		textRectCoordSize,
		line,
		path,
		lineHeight,
		textHeight,
		fromPoint,
		toPoint,
		textpath,
		element;

	switch (orientation) {
		case 0/*chartDiag.text.TextOrientationType.Horizontal*/:
		case 3/*chartDiag.text.TextOrientationType.Auto*/:
			this.parent.text.call(this, x, y, width, height, label, orientation, horizontalAlignment, verticalAlignment, attr);
			break;
		default:
			placeholder = this.m_activePlaceholder;

			rotateLeft = (orientation === 1/*chartDiag.text.TextOrientationType.RotateLeft*/);
			textRect = new chartDiag.default.Rect(x, y, width, height);
			textRectCoordSize = new chartDiag.default.Rect(0, 0, width * 10, height * 10);

			line = new chartDiag.default.Element(this.prefix + ":shape");
			line.setAttribute("CoordSize", textRectCoordSize.width + "," + textRectCoordSize.height);
			line.setAttribute("filled", true);
			line.setAttribute("stroked", false);
			line.setAttribute("fillcolor", attr["font-color"]);
			line.style.top = textRect.y + "px";
			line.style.left = textRect.x + "px";
			line.style.width = textRect.width + "px";
			line.style.height = textRect.height + "px";
			line.style['font-family'] = attr['font-family'];


			path = new chartDiag.default.Element(this.prefix + ":path");
			path.setAttribute("TextPathOk", true);

			lineHeight = 10 * Math.floor(this.getPxSize(attr['font-size'])) * 1.6 /* ~ line height*/;
			textHeight = lineHeight * Math.max(label.split('\n').length - 1, 1);
			fromPoint = null;
			toPoint = null;

			if (rotateLeft) {
				switch (verticalAlignment) {
					case 0/*chartDiag.default.VerticalAlignmentType.Top*/:
						fromPoint = new chartDiag.default.Point(textRectCoordSize.x + textHeight / 2.0, textRectCoordSize.bottom());
						toPoint = new chartDiag.default.Point(textRectCoordSize.x + textHeight / 2.0, textRectCoordSize.y);
						break;
					case 1/*chartDiag.default.VerticalAlignmentType.Middle*/:
						fromPoint = new chartDiag.default.Point(textRectCoordSize.horizontalCenter(), textRectCoordSize.bottom());
						toPoint = new chartDiag.default.Point(textRectCoordSize.horizontalCenter(), textRectCoordSize.y);
						break;
					case 2/*chartDiag.default.VerticalAlignmentType.Bottom*/:
						fromPoint = new chartDiag.default.Point(textRectCoordSize.right() - textHeight / 2.0, textRectCoordSize.bottom());
						toPoint = new chartDiag.default.Point(textRectCoordSize.right() - textHeight / 2.0, textRectCoordSize.y);
						break;
				}
			}
			else {
				switch (verticalAlignment) {
					case 0/*chartDiag.default.VerticalAlignmentType.Top*/:
						fromPoint = new chartDiag.default.Point(textRectCoordSize.right() - textHeight / 2.0, textRectCoordSize.y);
						toPoint = new chartDiag.default.Point(textRectCoordSize.right() - textHeight / 2.0, textRectCoordSize.bottom());
						break;
					case 1/*chartDiag.default.VerticalAlignmentType.Middle*/:
						fromPoint = new chartDiag.default.Point(textRectCoordSize.horizontalCenter(), textRectCoordSize.y);
						toPoint = new chartDiag.default.Point(textRectCoordSize.horizontalCenter(), textRectCoordSize.bottom());
						break;
					case 2/*chartDiag.default.VerticalAlignmentType.Bottom*/:
						fromPoint = new chartDiag.default.Point(textRectCoordSize.x + textHeight / 2.0, textRectCoordSize.y);
						toPoint = new chartDiag.default.Point(textRectCoordSize.x + textHeight / 2.0, textRectCoordSize.bottom());
						break;
				}
			}
			path.setAttribute("v", " m" + fromPoint.x + "," + fromPoint.y + " l" + toPoint.x + "," + toPoint.y + " e");

			textpath = new chartDiag.default.Element(this.prefix + ":textpath");
			textpath.setAttribute("on", true);
			textpath.setAttribute("string", label);
			textpath.style.trim = false;
			textpath.style['v-text-align'] = this._getTextAlign(horizontalAlignment);
			textpath.style['font'] = "normal normal normal " + attr['font-size'] + "pt " + attr['font-family']; //ignore jslint

			line.appendChild(path);
			line.appendChild(textpath);

			element = this.m_cache.get(placeholder.name, placeholder.activeLayer.name, "vmltext");
			if (element === null) {
				element = jQuery(line.create(this.ie8mode));
				placeholder.activeLayer.canvas.append(element);
				this.m_cache.put(placeholder.name, placeholder.activeLayer.name, "vmltext", element);
			}
			else {
				line.update(element[0], this.ie8mode);
			}
			break;
	}
};

chartDiag.default.VmlGraphics.prototype.polyline = function (polylineData) {
	var placeholder = this.m_activePlaceholder,
		rect = new chartDiag.default.Rect(placeholder.rect),
		rectCoordSize = new chartDiag.default.Rect(0, 0, rect.width * 10, rect.height * 10),
		shape = new chartDiag.default.Element(this.prefix + ":shape"),
		data,
		path,
		stroke,
		fill,
		element,
		x, y, x2, y2, value,
		signature,
		attr = polylineData.paletteItem.toAttr();

	if (attr.borderColor !== undefined && attr.lineWidth !== undefined) {
		shape.setAttribute("strokecolor", attr.borderColor);
		shape.setAttribute("strokeweight", attr.lineWidth);
		shape.setAttribute("stroked", true);
	}
	else {
		shape.setAttribute("stroked", false);
	}
	
	shape.setAttribute("CoordSize", rectCoordSize.width + "," + rectCoordSize.height);
	shape.style.top = rect.y + "px";
	shape.style.left = rect.x + "px";
	shape.style.width = rect.width + "px";
	shape.style.height = rect.height + "px";

	data = "";
	polylineData.loop(this, function (segment) {
		switch (segment.segmentType) {
			case 1/*chartDiag.default.SegmentType.Move*/:
				data += " m" + (10 * Math.round(segment.x)) + "," + (10 * Math.round(segment.y));
				break;
			case 0/*chartDiag.default.SegmentType.Line*/:
				data += " l" + (10 * Math.round(segment.x)) + "," + (10 * Math.round(segment.y));
				break;
			case 4/*chartDiag.default.SegmentType.Dot*/:
				x = Math.round(segment.x);
				y = Math.round(segment.y);
				x2 = Math.round(segment.x + segment.width);
				y2 = Math.round(segment.y + segment.height);
				if (x > x2) {
					value = x;
					x = x2;
					x2 = value;
				}
				if (y > y2) {
					value = y;
					y = y2;
					y2 = value;
				}
				x = 10 * x + 5;
				y = 10 * y + 5;
				x2 = 10 * x2 - 5;
				y2 = 10 * y2 - 5;
				data += " m" + x + "," + y;
				data += " l" + x2 + "," + y;
				data += " l" + x2 + "," + y2;
				data += " l" + x + "," + y2;
				data += " l" + x + "," + y;
				break;
			case 2/*chartDiag.default.SegmentType.QuadraticArc*/:
				data += " qb" + (10 * Math.round(segment.cpX)) + "," + (10 * Math.round(segment.cpY)) +
					" l" + (10 * Math.round(segment.x)) + "," + (10 * Math.round(segment.y));
				break;
			case 3/*chartDiag.default.SegmentType.CubicArc*/:
				data += " c" + 10 * Math.round(segment.cpX1) + "," + 10 * Math.round(segment.cpY1) + "," + 10 * Math.round(segment.cpX2) + "," + 10 * Math.round(segment.cpY2) + "," + 10 * Math.round(segment.x) + "," + 10 * Math.round(segment.y); //ignore jslint
				break;
		}
	});
	data += " e";

	signature = "shapepath";
	path = new chartDiag.default.Element(this.prefix + ":path");
	path.setAttribute("v", data);
	shape.appendChild(path);

	if (attr.lineType != null) {
		stroke = new chartDiag.default.Element(this.prefix + ":stroke");
		switch (attr.lineType) {
			case 0/*chartDiag.default.LineType.Solid*/:
				stroke.setAttribute("dashstyle", "Solid");
				break;
			case 1/*chartDiag.default.LineType.Dotted*/:
				stroke.setAttribute("dashstyle", "ShortDot");
				break;
			case 2/*chartDiag.default.LineType.Dashed*/:
				stroke.setAttribute("dashstyle", "Dash");
				break;
		}
		shape.appendChild(stroke);
		signature += "stroke";
	}


	if (attr.fillColor !== null) {
		shape.setAttribute("filled", true);
		fill = new chartDiag.default.Element(this.prefix + ":fill");
		fill.setAttribute("opacity", attr.opacity);
		fill.setAttribute("color", attr.fillColor);
		shape.appendChild(fill);
		signature += "fill";
	}
	else {
		shape.setAttribute("filled", false);
	}

	element = this.m_cache.get(placeholder.name, placeholder.activeLayer.name, signature);
	if (element === null) {
		element = jQuery(shape.create(this.ie8mode));
		placeholder.activeLayer.canvas.append(element);
		this.m_cache.put(placeholder.name, placeholder.activeLayer.name, signature, element);
	}
	else {
		shape.update(element[0], this.ie8mode);
	}
};

/* /OptionsReaders/ArrayReader.js*/
chartDiag.default.ArrayReader = function (itemTemplate, containsUniqueItems, uniquePropertyKey, createSourceHash) {
	this.itemTemplate = itemTemplate;
	this.containsUniqueItems = containsUniqueItems;
	this.uniquePropertyKey = uniquePropertyKey;
	this.containsChartsValues = chartDiag.default.isNullOrEmpty(uniquePropertyKey);
	this.createSourceHash = createSourceHash;
};

chartDiag.default.ArrayReader.prototype.read = function (target, source, path, context) {
	var result = [], resultHash = {}, sourceHash = {},
		processed = {},
		hash,
		item, itemid,
		index, len,
		hashedObject, newHashObject;

	/* validate source array */
	if (!source || !Array.isArray(source)) {
		source = [];
	}

	/* hash values for tracking changes */
	hash = context.hash[path] || {};

	for (index = 0, len = source.length; index < len; index += 1) {
		item = source[index];

		itemid = this.containsUniqueItems ? (this.containsChartsValues ? item : item[this.uniquePropertyKey]) : index;

		if (!processed.hasOwnProperty(itemid)) {
			processed[itemid] = true;

			hashedObject = hash[itemid] || {};
			newHashObject = this.itemTemplate.read(hashedObject, item, path + "-" + index, context);

			result.push(newHashObject);
			resultHash[itemid] = newHashObject;
			if (this.createSourceHash) {
				sourceHash[itemid] = item;
			}
		}
	}

	context.hash[path] = resultHash;
	if (this.createSourceHash) {
		context.sourceHash[path] = sourceHash;
	}

	if (target == null || target.length != result.length) {
		context.isChanged = true;
	}

	return result;
};

/* /OptionsReaders/EnumerationReader.js*/
chartDiag.default.EnumerationReader = function (enumeration, isNullable, defaultValue) {
	this.enumeration = enumeration;
	this.isNullable = isNullable;
	this.defaultValue = defaultValue;

	this.hash = {};

	/* collect valid enumeration values */
	for (var key in enumeration) {
		this.hash[enumeration[key]] = key;
	}
};

chartDiag.default.EnumerationReader.prototype.read = function (target, source, path, context) {
	var result = null;

	if (source === null || typeof source == "undefined" || !this.hash.hasOwnProperty(source)) {
		source = this.isNullable ? null : this.defaultValue;
	}

	result = source;

	if (target !== source) {
		context.isChanged = true;
	}

	return result;
};

/* /OptionsReaders/FunctionReader.js*/
chartDiag.default.FunctionReader = function () {

};

chartDiag.default.FunctionReader.prototype.read = function (target, source, path, context) {
	var result = null;

	result = (typeof source == "function") ? source : null;

	return result;
};

/* /OptionsReaders/ObjectReader.js*/
chartDiag.default.ObjectReader = function (dataTemplate, isNullable, defaultValue) {
	this.dataTemplate = dataTemplate;
	this.isNullable = isNullable;
	this.defaultValue = defaultValue;
};

chartDiag.default.ObjectReader.prototype.read = function (target, source, path, context) {
	var result = null,
		property,
		propertyDataTemplate;

	if(!source) {
		source = this.isNullable ? null : this.defaultValue;
	} 

	if(chartDiag.default.isObject(source)) {
		result = {};

		for (property in this.dataTemplate) {
			if (this.dataTemplate.hasOwnProperty(property)) {
				propertyDataTemplate = this.dataTemplate[property];

				result[property] = propertyDataTemplate.read(chartDiag.default.isObject(target) ? target[property] : null, source[property], path + "-" + property, context);
			}
		}
	} else {
		result = source;

		if (target !== source) {
			context.isChanged = true;
		}
	}
	return result;
};

/* /OptionsReaders/ValueReader.js*/
chartDiag.default.ValueReader = function (acceptedTypes, isNullable, defaultValue) {
	this.acceptedTypes = acceptedTypes;
	this.isNullable = isNullable;
	this.defaultValue = defaultValue;

	this.hash = {};

	/* collect valid enumeration values */
	for (var index = 0; index < acceptedTypes.length; index += 1) {
		var acceptedType = acceptedTypes[index];
		this.hash[acceptedType] = true;
	}
};

chartDiag.default.ValueReader.prototype.read = function (target, source, path, context) {
	var result = null;

	if (source === null || typeof source == "undefined" || !this.hash.hasOwnProperty(typeof source)) {
		source = this.isNullable ? null : this.defaultValue;
	}

	result = source;

	if (target !== source) {
		context.isChanged = true;
	}

	return result;
};

/* /Controls/FamDiagram/events/EventArgs.js*/
/*
	Class: chartDiag.famChart.EventArgs
		Event details class.
*/
chartDiag.famChart.EventArgs = function () {
	/*
	Property: oldContext
		Reference to associated previous item in hierarchy.
	*/
	this.oldContext = null;

	/*
	Property: context
		Reference to associated new item in hierarchy.
	*/
	this.context = null;

	/*
	Property: parentItems
		Collection of immidiate parent items of item in context.
	*/
	this.parentItems = [];

	/*
	Property: position
		Absolute item position on diagram.

	See also:
		<chartDiag.default.Rect>
	*/
	this.position = null;

	/*
	Property: name
		Relative object name.

	*/
	this.name = null;

	/*
	Property: cancel
		Allows cancelation of coupled event processing. This option allows to cancel layout update 
		and subsequent <chartDiag.famChart.Config.onCursorChanged> event 
		in handler of <chartDiag.famChart.Config.onCursorChanging> event.
	*/
	this.cancel = false;
};

/* /Controls/FamDiagram/configs/TemplateConfig.js*/
/*
	Class: chartDiag.famChart.TemplateConfig
		User defines item template class. It may optionaly define template for item, 
		custom cursor and highlight. If template is null then default template is used.

	See Also:
		<chartDiag.famChart.Config.templates>
*/
chartDiag.famChart.TemplateConfig = function () {
	/*
	Property: name
		Every template should have unique name. It is used as reference when 
		custom template is defined in <chartDiag.famChart.ItemConfig.templateName>.
	*/
	this.name = null;

	/*
	Property: isActive
		If it is true then item having this template is selectable in hierarchy and it has mouse over highlight.

	True - Item is clickable.
	False - Item is inactive and user cannot set cursor item or highlight.

	Default:
		true
	*/
	this.isActive = true;

	/*
	Property: itemSize
	This is item size of type <chartDiag.default.Size>, templates should have 
	fixed size, so famDiagram uses this value in order to layout items properly.
	*/
	this.itemSize = new chartDiag.default.Size(120, 100);

	/*
	Property: itemBorderWidth
		Item template border width.
	*/
	this.itemBorderWidth = 1;

	/*
	Property: itemTemplate
	Item template, if it is null then default item template is used. It supposed 
	to be div html element containing named elements inside for setting them 
	in <chartDiag.famChart.Config.onItemRender> event.
	*/
	this.itemTemplate = null;

	/*
		Property: minimizedItemShapeType
			Defines minimized item shape. The border line width is set with <chartDiag.famChart.TemplateConfig.minimizedItemBorderWidth>
			By default minimized item is rounded rectangle filled with item title color.


		See also:
			<chartDiag.famChart.TemplateConfig.minimizedItemCornerRadius>
			<chartDiag.famChart.ItemConfig.itemTitleColor>
			<chartDiag.famChart.ItemConfig.minimizedItemShapeType>

		Default:
			null
	*/
	this.minimizedItemShapeType = null;

	/*
	Property: minimizedItemSize
	This is size dot used to display item in minimized form, type of <chartDiag.default.Size>.
	*/
	this.minimizedItemSize = new chartDiag.default.Size(4, 4);

	/*
	Property: minimizedItemCornerRadius
	Set corner radias for dots in order to display them as squares having rounded corners.
	By default it is null and dots displayed as cycles. If corner radius set to 0 then they are displayed as regular squares.
	*/
	this.minimizedItemCornerRadius = null;

	/*
	Property: minimizedItemLineWidth
		Minimized item shape border width.
	*/
	this.minimizedItemLineWidth = 1;

	/*
	Property: minimizedItemBorderColor
		Minimized item line color. By default it is the same as <chartDiag.famChart.ItemConfig.itemTitleColor>
	*/
	this.minimizedItemBorderColor = null;

	/*
	Property: minimizedItemLineType
		Minimized item shape border line type.
	*/
	this.minimizedItemLineType = 0/*chartDiag.default.LineType.Solid*/;

	/*
	Property: minimizedItemFillColor
		Minimized item fill color. By default it is the same as <chartDiag.famChart.ItemConfig.itemTitleColor>
	*/
	this.minimizedItemFillColor = null;

	/*
	Property: minimizedItemOpacity
		Minimized item fill color opacity.
	*/
	this.minimizedItemOpacity = 1;

	/*
	Property: highlightPadding
	This padding around item defines relative size of highlight object, 
	ts type is <chartDiag.default.Thickness>.
	*/
	this.highlightPadding = new chartDiag.default.Thickness(2, 2, 2, 2);

	/*
	Property: highlightBorderWidth
		Highlight border width.
	*/
	this.highlightBorderWidth = 1;

	/*
	Property: highlightTemplate
	Highlight template, if it is null then default highlight template is used. 
	It supposed to be div html element containing named elements inside for 
	setting them in <chartDiag.famChart.Config.onHighlightRender> event.
	*/
	this.highlightTemplate = null;

	/*
	Property: cursorPadding
	This padding around item defines relative size of cursor object, 
	its type is <chartDiag.default.Thickness>.
	*/
	this.cursorPadding = new chartDiag.default.Thickness(3, 3, 3, 3);

	/*
	Property: cursorBorderWidth
		Cursor border width.
	*/
	this.cursorBorderWidth = 2;

	/*
	Property: cursorTemplate
	Cursor template, if it is null then default cursor template is used. 
	It supposed to be div html element containing named elements inside 
	for setting them in <chartDiag.famChart.Config.onCursorRender> event.
	*/
	this.cursorTemplate = null;

	/*
	Property: buttons
		Custom user buttons displayed on right side of item. This collection provides simple way to define context buttons for every template. 
	
	See also:
		<chartDiag.famChart.ButtonConfig>
	*/
	this.buttons = null;
};

/* /Controls/FamDiagram/configs/BackgroundAnnotationConfig.js*/
/*
	Class: chartDiag.famChart.BackgroundAnnotationConfig
		Options class. Populate annotation collection with instances of this object to draw background area around items.
		Shape is drawn as eclosed area with perimiter line around. If items cannot share one annotation then it draws as many areas as needed to show backgorund for every item.
		It does not overlap neighboring items. If line width is set then it draws perimiter line as well.
	See Also:
		<chartDiag.famChart.Config.annotations>
*/
chartDiag.famChart.BackgroundAnnotationConfig = function (arg0) {
	var property;

	/*
	Property: annotationType
		Annotation type. All various annotations are defined in annotation collection property of <chartDiag.famChart.Config>. 
		So this property is needed to define annotation type when we use JavaScript non-prototype objects.
		See other annotations as well.

	Default:
		<chartDiag.default.AnnotationType.Background>

	See Also:
		<chartDiag.famChart.Config.annotations>
		<chartDiag.famChart.ConnectorAnnotationConfig>
		<chartDiag.famChart.ShapeAnnotationConfig>
		<chartDiag.famChart.LabelAnnotationConfig>
		<chartDiag.famChart.HighlightPathAnnotationConfig>
	*/
	this.annotationType = 4/*chartDiag.default.AnnotationType.Background*/;

	/*
	Property: items 
		Array of items ids in hierarchy.
	See Also:
		<chartDiag.orgChart.ItemConfig.id>
	*/
	this.items = [];

	/*
	Property: zOrderType
		Defines annotation Z order placement relative to chart items. Chart items are drawn in layers on top of each other. We can draw annotations under the items or over them. 
		If you place annotations over items then you block mouse events of UI elements in them. Browsers don't support mouse events transparentcy consistently. 
		So in order to avoid mouse events blocking of UI elements in item templates you have to place annotation items under them.
		Take into account that chart default buttons are drawn on top of everyhting, so they are never blocked by annotations drawn over items.

	Default:
		<chartDiag.default.ZOrderType.Auto>
	*/
	this.zOrderType = 0/*chartDiag.default.ZOrderType.Auto*/;


	/*
	Property: lineWidth
		Border line width. 
	*/
	this.lineWidth = 2;

	/*
	Property: opacity
		Background color opacity. For applicable shapes only.
	*/
	this.opacity = 1;

	/*
	Property: borderColor
		Shape border line color.
	
	Default:
		null
	*/
	this.borderColor = null;

	/*
	Property: fillColor
		Fill Color. 

	Default:
		null
	*/
	this.fillColor = null;

	/*
	Property: lineType
		Connector's line pattern.

	Default:
		<chartDiag.default.LineType.Solid>
	*/
	this.lineType = 0/*chartDiag.default.LineType.Solid*/;

	/*
	Property: selectItems
		Always show annotated items in normal state. Setting this option is equivalent to adding annotated items to collection of selected items.

	Default:
		true

	See Also:
		<chartDiag.famChart.Config.selectedItems>
	*/
	this.selectItems = false;

	switch (arguments.length) {
		case 1:
			if (arg0 !== null) {
				if (arg0 instanceof Array) {
					this.items = arg0;
				} else if (typeof arg0 == "object") {
					for (property in arg0) {
						if (arg0.hasOwnProperty(property)) {
							this[property] = arg0[property];
						}
					}
				}
			}
			break;
	}
};

/* /Controls/FamDiagram/configs/ButtonConfig.js*/
/*
	Class: chartDiag.famChart.ButtonConfig
		Options class. Custom user button options class. 
		Buttons displayed on the right side of items. 
		See jQuery UI Button options description for details.
		In order to receive button click event make binding 
		to <chartDiag.famChart.Config.onButtonClick>.
	
	See Also:
		<chartDiag.famChart.Config.buttons>
*/
chartDiag.famChart.ButtonConfig = function (name, icon, tooltip) {
	/*
	Property: name 
		It should be unique string name of the button. 
		It is needed to distinguish click events from different butons.
	*/
	this.name = name;

	/*
	Property: icon
	Name of icon used in jQuery UI.
	*/
	this.icon = icon;
	/*
	Property: text
	Whether to show any text -when set to false (display no text), 
	icon must be enabled, otherwise it'll be ignored.
	*/
	this.text = false;
	/*
	Property: label
	Text to show on the button.
	*/
	this.label = null;
	/*
	Property: tooltip
	Button tooltip content.
	*/
	this.tooltip = tooltip;
	/*
	Property: size
	Size of the button of type <chartDiag.default.Size>.
	*/
	this.size = new chartDiag.default.Size(16, 16);
};

/* /Controls/FamDiagram/configs/Config.js*/
/*
	Class: chartDiag.famChart.Config
		jQuery famDiagram Widget options class. Multi-parent hierarchical chart configuration.
	
*/
chartDiag.famChart.Config = function (name) {
	this.name = (name !== undefined) ? name : "FamDiagram";
	this.classPrefix = "famChart";

	/*
		Property: navigationMode
			Defines control navigation mode. By default control replicates interactivity of regular Tree control. 
			It has highlight for mouse over feedback and it has cursor for showing currently selected single node in diagram.
			In order to avoid creation of plus/minus buttons for children nodes folding and unfolding, 
			this functionality is done automatically for current cursor item. This is especially true for family diagram, 
			because it has no logical root, so cursor plays vital role for unfolding of nodes 
			and zooming into area of user interest in diagram.
			Use this option to disable highlight which does not make sense on touch devices or make control inactive completly.

		See Also:
			<chartDiag.default.NavigationMode>
		Default:
			<chartDiag.default.NavigationMode.Default>
	*/
	this.navigationMode = 0/*chartDiag.default.NavigationMode.Default*/;

	/*
		Property: graphicsType
			Preferable graphics type. If preferred graphics type 
			is not supported widget switches to first available. 

		Default:
			<chartDiag.default.GraphicsType.SVG>
	*/
	this.graphicsType = 0/*chartDiag.default.GraphicsType.SVG*/;

	/*
		Property: actualGraphicsType
			Actual graphics type.
	*/
	this.actualGraphicsType = null;

	/*
		Property: pageFitMode
			Defines the way diagram is fit into page. By default chart minimize items when it has not enough space to fit all of them into screen. 
			Chart has its maximum size when all items shown in full size and  its minimal size when all items shown as dots. 
			It is equivalent of full zoom out of the chart items, dot size items are not readable, but such presentation of them 
			gives possibility to overview chart layout. So chart tryes to combine both presenation modes and keep chart as small 
			as possible in order to give user possibility to see big picture. Collapsed items provide ideal way for analitical reiew of 
			diagram. If chart shown in its maximum size when all items are unfolded, it becomes impossible 
			to navigate betwen parents close to the root item. In such mode chart is usable only at bottom levels when children are close to their parents.
			If we try to navigate up to the root of hierarchy, gaps between parents sometimes as big as screen size. So in order to solve these 
			issues chart partially collapses hierarchy into dots and lines depending on this option.

		See also:
			<chartDiag.famChart.Config.minimalVisibility>
			<chartDiag.famChart.Config.printPreviewPageSize>

		Default:
			<chartDiag.default.PageFitMode.FitToPage>
	*/
	this.pageFitMode = 3/*chartDiag.default.PageFitMode.FitToPage*/;

	/*
		Property: minimalVisibility
			Defines minimal allowed item form size for page fit mode. See description for pageFitMode.
	
		See also:
			<chartDiag.famChart.Config.pageFitMode>

		Default:
			<chartDiag.default.Visibility.Dot>
	*/
	this.minimalVisibility = 2/*chartDiag.default.Visibility.Dot*/;

	/*
		Property: orientationType
			Chart orientation. Chart can be rotated left, right and bottom.
			Rotation to the right side is equivalent to left side placement 
			in countries writing from right to left, so it is important for localization.

		Default:
			<chartDiag.default.OrientationType.Top>
	*/
	this.orientationType = 0/*chartDiag.default.OrientationType.Top*/;

	/*
	Property: verticalAlignment
		Defines items vertical alignment relative to each other within one level of hierarchy. 
		It does not affect levels having same size items.
	
	Default:
		<chartDiag.default.VerticalAlignmentType.Middle>
	*/
	this.verticalAlignment = 1/*chartDiag.default.VerticalAlignmentType.Middle*/;

	/*
		Property: arrowsDirection
			Sets direction of connector lines arrows.

		Default:
			<chartDiag.default.GroupByType.None>
	*/
	this.arrowsDirection = 0/*chartDiag.default.GroupByType.None*/;

	/*
		Property: groupByType
			Defines the way item gravitates to parent or child layout having big vertical gap between levels.

		Default:
			<chartDiag.default.GroupByType.Children>
	*/
	this.groupByType = 2/*chartDiag.default.GroupByType.Children*/;

	/*
		Property: elbowType
			Style squared connectors with custom elbows.

		Default:
			<chartDiag.default.ElbowType.None>
	*/
	this.elbowType = 3/*chartDiag.default.ElbowType.Round*/;

	/*
		Property: bevelSize
			Size of connector bevel.

		Default:
			4
	*/
	this.bevelSize = 4;

	/*
		Property: elbowDotSize
			Size of elbow dot.
			
		Default:
			4
	*/
	this.elbowDotSize = 4;

	/*
	Property: emptyDiagramMessage
		Empty message in order to avoid blank screen. This option is supposed to say user that chart is empty when no data inside.
	*/
	this.emptyDiagramMessage = "Diagram is empty.";

	/*
	Property: items
		This is chart items collection. It is regular array of items of type ItemConfig. Items reference each other via parents collection property. 
		So every item may have multiple parents in chart. If parents collection is empty or set to null then item supposed to be root parent.
		If items loop each other they are ignored as well. It is applications responsiblity to avoid such issues.

	See Also:
		<chartDiag.famChart.ItemConfig>
		<chartDiag.famChart.ItemConfig.id>
		<chartDiag.famChart.ItemConfig.parents>
	*/
	this.items = [];

	/*
	Property: annotations
		Defines array of annotaions objects. Chart supports several types of annotations. They are drawn on top of chart and they may block view of some of them.
		So chart's layout mechanism does not account available annotations. Don't over use this feature. 
		The design assumes only few of them being displayed simultanuosly. This is especially true for connectors.

	See also:
		<chartDiag.famChart.ConnectorAnnotationConfig>
		<chartDiag.famChart.ShapeAnnotationConfig>
		<chartDiag.famChart.LabelAnnotationConfig>
		<chartDiag.famChart.BackgroundAnnotationConfig>
		<chartDiag.famChart.HighlightPathAnnotationConfig>
	*/
	this.annotations = [];

	/*
	Property: cursorItem
		Cursor item id - it is single item selection mode, user selects new cursor item on mouse click. 
		Cursor defines current local zoom placement or in other words current navigation item in the chart,
		all items relative to cursor always shoun in full size. So user can see all possible items around cursor in full size 
		and can continue navigation around chart. So when user navigates from one item to another clicking on thems and changing cursor item
		in chart, chart minimizes items going out of cursor scope and shows in full size items relative to new cursor position.
		If it is null then no cursor shown on diagram.

	See Also:
		<chartDiag.famChart.ItemConfig.id>
		<chartDiag.famChart.Config.onCursorChanging>
		<chartDiag.famChart.Config.onCursorChanged>
	*/
	this.cursorItem = null;

	/*
	Property: highlightItem
		Highlighted item id. Highlight is mouse over affect, but using this option applicatin can set highlight at any item 
		in the chart programmatically. It can be used for chart syncronization with other controls on UI having mouse over effect. 
		See chartDiag.famChart.Config.update method arguments description for fast chart update.
		If it is null then no highlight shown on diagram.

	See Also:
		<chartDiag.famChart.ItemConfig.id>
		<chartDiag.famChart.Config.onHighlightChanging>
		<chartDiag.famChart.Config.onHighlightChanged>
	*/
	this.highligtItem = null;


	/*
	Property: selectedItems
		Defines array of selected item ids. Chart allows to select items via checking checkboxes under items. Checkboxes are 
		shown only for full size items. So when item is selected it is always shown in full size, so check box always visible for selcted items.
		User can navigate around large diagram and check intrested items in order to keep them opened. So that way chart provides 
		means to show several items on large diagram and fit everything into minimal space ideally into available screen space.
		Application can select items programmatically using this array or receive notifications from chart about user selections with following events.

	See Also:
		<chartDiag.famChart.ItemConfig.id>
		<chartDiag.famChart.Config.onSelectionChanging>
		<chartDiag.famChart.Config.onSelectionChanged>
	*/
	this.selectedItems = [];

	/*
	Property: hasSelectorCheckbox
		This option controls selection check boxes visibility. 

	Auto - Checkbox shown only for current cursor item only.
	True - Every full size item has selection check box.
	False - No check boxes. Application can still programmatically select some items in the chart. 
	Application may provide custom item template having checkbox inside of item. If application defined check box inside of item template has name="checkbox"
	it is auto used as default selection check box.

	Default:
		<chartDiag.default.Enabled.Auto>

	See Also:
		<chartDiag.famChart.ItemConfig.hasSelectorCheckbox>
		<chartDiag.famChart.Config.onSelectionChanging>
		<chartDiag.famChart.Config.onSelectionChanged>
	*/
	this.hasSelectorCheckbox = 0/*chartDiag.default.Enabled.Auto*/;

	/*
		Property: selectCheckBoxLabel
			Select check box label.
	*/
	this.selectCheckBoxLabel = "Selected";

	/*
	Property: selectionPathMode
		Defines the way items between root item and selectedItems displayed in diagram. Chart always shows all items between cursor item and its root in full size.
		But if cursor positioned on root item, then chart shows in full size only selected items in the chart. So this option controls items size between 
		selected items and root item of the chart. By default all items betwen root and selected items shown in full size.
		
	Default:
		<chartDiag.default.SelectionPathMode.FullStack>
	*/
	this.selectionPathMode = 0/*chartDiag.default.SelectionPathMode.None*/;

	/*
	Property: neighboursSelectionMode
		Defines the display mode for items related to current cursor item in diagram. By default only parents and children are shown in regular size without minimization.

	Default:
		<chartDiag.default.NeighboursSelectionMode.ParentsAndChildren>
	*/
	this.neighboursSelectionMode = 0/*chartDiag.default.NeighboursSelectionMode.ParentsAndChildren*/;

	/*
	Property: templates
		Custom user templates collection. TemplateConfig is complex object providing options to customize item's content template, 
		cursor tempate and highlight template. Every template config should have unique name property, which is used by chart and its item configs 
		to reference them. Chart's defaultTemplateName allows to make template default for all items in the chart. On other hand user may define templates
		to individual items in the chart by templateName property of item config.

	See also:
		<chartDiag.famChart.TemplateConfig>
		<chartDiag.famChart.Config.defaultTemplateName>
		<chartDiag.famChart.ItemConfig.templateName>
	*/
	this.templates = [];

	/*
		Property: defaultTemplateName
			This is template name used to render items having no <chartDiag.famChart.ItemConfig.templateName> defined.


		See Also:
			<chartDiag.famChart.TemplateConfig>
			<chartDiag.famChart.TemplateConfig.name>
			<chartDiag.famChart.Config.templates>
	*/
	this.defaultTemplateName = null;

	/*
		Property: defaultLabelAnnotationTemplate
			This is name of template used to render label annotations having no <chartDiag.famChart.LabelAnnotationConfig.templateName> defined.
			Label annotations are labels placed inside diagram layout. They occupy space and digram gurantees no overlapping of them.

		See Also:
			<chartDiag.famChart.LabelAnnotationConfig>
			<chartDiag.famChart.TemplateConfig>
			<chartDiag.famChart.TemplateConfig.name>
			<chartDiag.famChart.Config.templates>
	*/
	this.defaultLabelAnnotationTemplate = null;

	/*
	Property: hasButtons
		This option controls user buttons visibility. 

	Auto - Buttons visible only for cursor item.
	True - Every normal item has buttons visible.
	False - No buttons.

	Default:
		<chartDiag.default.Enabled.Auto>
	*/
	this.hasButtons = 0/*chartDiag.default.Enabled.Auto*/;

	/*
	Property: buttons
		Custom user buttons displayed on right side of item. This collection provides simple way to define context buttons for every item. 
		The only limitation, they are all the same. So if you need to have unique buttons for every item, then you have to 
		customize cursor templates and manually create custom buttons inside of them.
		
	See also:
		<chartDiag.famChart.ButtonConfig>
	*/
	this.buttons = [];

	/*
	Event: onHighlightChanging
		Notifies about changing highlight item <chartDiag.famChart.Config.highlightItem> in diagram.
		This coupled event with <chartDiag.famChart.Config.onHighlightChanged>, it is fired before highlight update.

	See also:
		<chartDiag.famChart.EventArgs>
	*/
	this.onHighlightChanging = null;

	/*
	Event: onHighlightChanged
		Notifies about changed highlight item <chartDiag.famChart.Config.highlightItem> in diagram.

	See also:
		<chartDiag.famChart.EventArgs>
	*/
	this.onHighlightChanged = null;

	/*
	Event: onCursorChanging
		Notifies about changing cursor item <chartDiag.famChart.Config.cursorItem> in diagram.
		This coupled event with <chartDiag.famChart.Config.onCursorChanged>, it is fired before layout update.

	See also:
		<chartDiag.famChart.EventArgs>
	*/
	this.onCursorChanging = null;

	/*
	Event: onCursorChanged
		Notifies about changed cursor item <chartDiag.famChart.Config.cursorItem> in diagram .

	See also:
		<chartDiag.famChart.EventArgs>
	*/
	this.onCursorChanged = null;

	/*
	Event: onSelectionChanging
		Notifies about changing selected items collection of <chartDiag.famChart.Config.selectedItems>.

	See also:
		<chartDiag.famChart.EventArgs>
	*/
	this.onSelectionChanging = null;

	/*
	Event: onSelectionChanged
		Notifies about changes in collection of <chartDiag.famChart.Config.selectedItems>.

	See also:
		<chartDiag.famChart.EventArgs>
	*/
	this.onSelectionChanged = null;

	/*
	Event: onButtonClick
		Notifies about click of custom user button defined in colelction of <chartDiag.famChart.Config.buttons>.

	See also:
		<chartDiag.famChart.EventArgs>
	*/
	this.onButtonClick = null;

	/*
	Event: onMouseClick
		On mouse click event. 

	See also:
		<chartDiag.famChart.EventArgs>
	*/
	this.onMouseClick = null;

	/*
	Event: onMouseDblClick
		On mouse double click event. 

	See also:
		<chartDiag.famChart.EventArgs>
	*/
	this.onMouseDblClick = null;

	/*
	Event: onItemRender
		Item templates don't provide means to bind data of items into templates. So this event handler gives application such possibility.
		If application uses custom templates then this method is called to populate template with items properties.

	See also:
		<chartDiag.default.RenderEventArgs>
		<chartDiag.famChart.TemplateConfig>
		<chartDiag.famChart.Config.templates>
	*/
	this.onItemRender = null;

	/*
	Event: onHighlightRender
		If user defined custom highlight template for item template 
		then this method is called to populate it with context data.

	See also:
		<chartDiag.default.RenderEventArgs>
		<chartDiag.famChart.TemplateConfig>
		<chartDiag.famChart.Config.templates>
	*/
	this.onHighlightRender = null;
	/*
	Event: onCursorRender
		If user defined custom cursor template for item template 
		then this method is called to populate it with context data.

	See also:
		<chartDiag.default.RenderEventArgs>
		<chartDiag.famChart.TemplateConfig>
		<chartDiag.famChart.Config.templates>
	*/
	this.onCursorRender = null;
	/*
	Property: normalLevelShift
		Defines interval after level of items in  diagram having items in normal state.
	*/
	this.normalLevelShift = 20;
	/*
	Property: dotLevelShift
		Defines interval after level of items in  diagram having all items in dot state.
	*/
	this.dotLevelShift = 20;
	/*
	Property: lineLevelShift
		Defines interval after level of items in  diagram having items in line state.
	*/
	this.lineLevelShift = 10;

	/*
	Property: normalItemsInterval
		Defines interval between items at the same level in  diagram having items in normal state.
	*/
	this.normalItemsInterval = 10;
	/*
	Property: dotItemsInterval
		Defines interval between items at the same level in  diagram having items in dot state.
	*/
	this.dotItemsInterval = 1;
	/*
	Property: lineItemsInterval
		Defines interval between items at the same level in  diagram having items in line state.
	*/
	this.lineItemsInterval = 2;

	/*
	Property: cousinsIntervalMultiplier
		Use this interval multiplier between cousins in hiearchy. The idea of this option to make extra space between cousins. 
		So children belonging to different parents have extra gap between them.
		
	*/
	this.cousinsIntervalMultiplier = 5;

	/*
	method: update
		Makes full redraw of diagram contents reevaluating all options. This method has to be called explisitly after all options are set in order to update widget contents.
	
	Parameters:
		updateMode: This parameter defines severaty of update <chartDiag.default.UpdateMode>. 
		For example <chartDiag.default.UpdateMode.Refresh> updates only 
		items and selection reusing existing elements where ever it is possible.

	See also:
		<chartDiag.default.UpdateMode>

	Default:
		<chartDiag.default.UpdateMode.Recreate>
	*/

	/*
	Property: itemTitleFirstFontColor
	This property customizes default template title font color. 
	Item background color sometimes play a role of logical value and 
	can vary over a wide range, so as a result title having 
	default font color may become unreadable. Widgets selects the best font color 
	between this option and <chartDiag.famChart.Config.itemTitleSecondFontColor>.

	See Also:
		<chartDiag.famChart.ItemConfig.itemTitleColor>
		<chartDiag.famChart.Config.itemTitleSecondFontColor>
		<chartDiag.default.highestContrast>

	*/
	this.itemTitleFirstFontColor = "#ffffff"/*chartDiag.default.Colors.White*/;

	/*
	Property: itemTitleSecondFontColor
	Default template title second font color.
	*/
	this.itemTitleSecondFontColor = "#000080"/*chartDiag.default.Colors.Navy*/;

	/*
		Property: minimizedItemShapeType
			Defines minimized item shape. The border line width is set with <chartDiag.famChart.TemplateConfig.minimizedItemBorderWidth>
			By default minimized item is rounded rectangle filled with item title color.


		See also:
			<chartDiag.famChart.TemplateConfig.minimizedItemCornerRadius>
			<chartDiag.famChart.ItemConfig.itemTitleColor>
			<chartDiag.famChart.ItemConfig.minimizedItemShapeType>

		Default:
			<chartDiag.default.ShapeType.None>
	*/
	this.minimizedItemShapeType = 6/*chartDiag.default.ShapeType.None*/;

	/*
	Property: linesColor
		Connectors lines color. Connectors are basic connections betwen chart items 
		defining their logical relationships, don't mix with connector annotations. 
	*/
	this.linesColor = "#c0c0c0"/*chartDiag.default.Colors.Silver*/;

	/*
	Property: linesWidth
		Connectors lines width.
	*/
	this.linesWidth = 1;

	/*
	Property: linesType
		Connectors line pattern.

	Default:
		<chartDiag.default.LineType.Solid>
	*/
	this.linesType = 0/*chartDiag.default.LineType.Solid*/;

	/*
	Property: showNeigboursConnectorsHighlighted
		Show connection lines between current cursor item and its neighbours highlighted. Neighbours selection mode is defined by neighboursSelectionMode option.
	See also:
		<chartDiag.famChart.Config.neighboursSelectionMode>,
		<chartDiag.famChart.Config.highlightLinesColor>,
		<chartDiag.famChart.Config.highlightLinesWidth>,
		<chartDiag.famChart.Config.highlightLinesType>
	Default:
		false
	*/
	this.showNeigboursConnectorsHighlighted = false;

	/*
	Property: highlightLinesColor
		Connectors highlight line color. Connectors are basic connections betwen chart items 
		defining their logical relationships, don't mix with connector annotations. 
	*/
	this.highlightLinesColor = "#ff0000"/*chartDiag.default.Colors.Red*/;

	/*
	Property: highlightLinesWidth
		Connectors highlight line width.
	*/
	this.highlightLinesWidth = 1;

	/*
	Property: highlightLinesType
		Connectors highlight line pattern.

	Default:
		<chartDiag.default.LineType.Solid>
	*/
	this.highlightLinesType = 0/*chartDiag.default.LineType.Solid*/;

	/*
	Property: linesPalette
		This collection contains elements of type PaletteItemConfig. It is used to draw connector lines between families in different styles. 
		It is similar concept to regular line chart having lines intersections. 
		If this collection is empty then default linesColor, linesWidth and linesType are used for all connector lines.
	
	See Also:
		<chartDiag.famChart.PaletteItemConfig>
	*/
	this.linesPalette = [];

	/*
	Property: showCallout
		This option controls callout visibility for dotted items. 

	Default:
		true
	*/
	this.showCallout = true;

	/*
	Property: defaultCalloutTemplateName
		This is template name used to render callouts for dotted items. 
		Actual callout template name is defined by following sequence:
		<chartDiag.famChart.ItemConfig.calloutTemplateName> 
		<chartDiag.famChart.ItemConfig.templateName>
		<chartDiag.famChart.Config.defaultCalloutTemplateName>
		<chartDiag.famChart.Config.defaultTemplateName>


	See Also:
		<chartDiag.famChart.Config.templates> collection property.

	Default:
		null
	*/
	this.defaultCalloutTemplateName = null;

	/*
	Property: calloutfillColor
		Annotation callout fill color.
	*/
	this.calloutfillColor = "#000000";

	/*
	Property: calloutBorderColor
		Annotation callout border color.
	*/
	this.calloutBorderColor = null;

	/*
	Property: calloutOffset
		Annotation callout offset.
	*/
	this.calloutOffset = 4;

	/*
	Property: calloutCornerRadius
		Annotation callout corner radius.
	*/
	this.calloutCornerRadius = 4;

	/*
	Property: calloutPointerWidth
		Annotation callout pointer base width.
	*/
	this.calloutPointerWidth = "10%";

	/*
	Property: calloutLineWidth
		Annotation callout border line width.
	*/
	this.calloutLineWidth = 1;

	/*
	Property: calloutOpacity
		Annotation callout opacity.
	*/
	this.calloutOpacity = 0.2;

	/*
	Property: buttonsPanelSize
		User buttons panel size.
	*/
	this.buttonsPanelSize = 28;

	/*
	Property: groupTitlePanelSize
		Group title panel size.
	*/
	this.groupTitlePanelSize = 24;

	/*
	Property: checkBoxPanelSize
		Selection check box panel size.
	*/
	this.checkBoxPanelSize = 24;

	this.distance = 3;

	/*
	Property: scale
		CSS3 scale transform.
	*/
	this.scale = 1;

	/*
	Property: minimumScale
		Minimum CSS3 scale transform. Available on mobile safary only.
	*/
	this.minimumScale = 0.5;

	/*
	Property: maximumScale
		Maximum CSS3 scale transform. Available on mobile safary only.
	*/
	this.maximumScale = 1;

	/*
	Property: showLabels
		This option controls labels visibility for minimized items. If you need to show labels outside of borders of regular items then use item template for customization.
		Labels placed inside HTML DIV element and long strings are wrapped inside. 
		User can control labels position relative to its item. Chart does not meassure labels and does reserve space for them, 
		so if label overlap each other then horizontal or vertical intervals between rows and items shoud be manually increased.
	
	Auto - depends on available space.
	True - always shown.
	False - hidden.

	See Also:
		<chartDiag.famChart.ItemConfig.label>
		<chartDiag.famChart.Config.labelSize>
		<chartDiag.famChart.Config.normalItemsInterval>
		<chartDiag.famChart.Config.dotItemsInterval>
		<chartDiag.famChart.Config.lineItemsInterval>
		<chartDiag.famChart.Config.normalLevelShift>
		<chartDiag.famChart.Config.dotLevelShift>
		<chartDiag.famChart.Config.lineLevelShift>

	Default:
		<chartDiag.default.Enabled.Auto>
	*/
	this.showLabels = 0/*chartDiag.default.Enabled.Auto*/;

	/*
	Property: labelSize
		Defines label size. It is needed to avoid labels overlapping. If one label overlaps another label or item it will be hidden. 
		Label string is wrapped when its length exceeds available width.

	Default:
		new <chartDiag.default.Size>(80, 24);
	*/
	this.labelSize = new chartDiag.default.Size(80, 24);

	/*
	Property: labelOffset
		Defines label offset from dot in pixels.

	Default:
		1;
	*/
	this.labelOffset = 1;

	/*
	Property: labelOrientation
		Defines label orientation. 

	See Also:
	<chartDiag.text.TextOrientationType>

	Default:
		<chartDiag.text.TextOrientationType.Horizontal>
	*/
	this.labelOrientation = 0/*chartDiag.text.TextOrientationType.Horizontal*/;

	/*
	Property: labelPlacement
		Defines label placement relative to its dot. 
		Label is aligned to opposite side of its box.

	See Also:
	<chartDiag.default.PlacementType>

	Default:
		<chartDiag.default.PlacementType.Top>
	*/
	this.labelPlacement = 1/*chartDiag.default.PlacementType.Top*/;

	/*
	Property: labelFontSize
		Label font size. 

	Default:
		10px
*/
	this.labelFontSize = "10px";

	/*
		Property: labelFontFamily
			Label font family. 

		Default:
			"Arial"
	*/
	this.labelFontFamily = "Arial";

	/*
		Property: labelColor
			Label color. 

		Default:
			chartDiag.default.Colors.Black
	*/
	this.labelColor = "#000000"/*chartDiag.default.Colors.Black*/;

	/*
		Property: labelFontWeight
			Font weight: normal | bold

		Default:
			"normal"
	*/
	this.labelFontWeight = "normal";

	/*
	Property: labelFontStyle
		Font style: normal | italic
		
	Default:
		"normal"
	*/
	this.labelFontStyle = "normal";

	/*
	Property: enablePanning
		Enable chart panning with mouse drag & drop for desktop browsers.
		Disable it if you need to support items Drag & Drop.

	Default:
		true
	*/
	this.enablePanning = true;

	/*
	Property: printPreviewPageSize
		Defines print preview page size in pixels. 

	Default:
		new <chartDiag.default.Size>(612, 792);
	*/
	this.printPreviewPageSize = new chartDiag.default.Size(612, 792);

	/*
	Property: autoSizeMinimum
		Defines minimum diagram size in autosize mode. If diagram has no elements, it is going to be of this size on the page.  
	Default:
		new <chartDiag.default.Size>(800, 600);
	*/
	this.autoSizeMinimum = new chartDiag.default.Size(800, 600);

	/*
	Property: autoSizeMaximum
		Defines maximum diagram size in autosize mode.
	Default:
		new <chartDiag.default.Size>(1024, 768);
	*/
	this.autoSizeMaximum = new chartDiag.default.Size(1024, 768);
};

/* /Controls/FamDiagram/configs/ConnectorAnnotationConfig.js*/
/*
	Class: chartDiag.famChart.ConnectorAnnotationConfig
		Options class. Populate annotation collection with instances of this objects to draw connector between two items.
	
	See Also:
		<chartDiag.famChart.Config.annotations>
*/
chartDiag.famChart.ConnectorAnnotationConfig = function (arg0, arg1) {
	var property;

	/*
	Property: annotationType
		Annotation type. All various annotations are defined in annotation collection property of <chartDiag.famChart.Config>. 
		So this property is needed to define annotation type when we use JavaScript non-prototype objects.
		See other annotations as well.

	Default:
		<chartDiag.default.AnnotationType.Connector>

	See Also:
		<chartDiag.famChart.Config.annotations>
		<chartDiag.famChart.ShapeAnnotationConfig>
		<chartDiag.famChart.LabelAnnotationConfig>
		<chartDiag.famChart.BackgroundAnnotationConfig>
		<chartDiag.famChart.HighlightPathAnnotationConfig>
	*/
	this.annotationType = 0/*chartDiag.default.AnnotationType.Connector*/;

	/*
	Property: zOrderType
		Defines annotation Z order placement relative to chart items. Chart items are drawn in layers on top of each other. We can draw annotations under the items or over them. 
		If you place annotations over items then you block mouse events of UI elements in them. Browsers don't support mouse events transparentcy consistently. 
		So in order to avoid mouse events blocking of UI elements in item templates you have to place annotation items under them.
		Take into account that chart default buttons are drawn on top of everyhting, so they are never blocked by annotations drawn over items.

	Default:
		<chartDiag.default.ZOrderType.Foreground>
	*/
	this.zOrderType = 2/*chartDiag.default.ZOrderType.Foreground*/;

	/*
	Property: fromItem 
		Reference to from item in hierarchy.
	See Also:
		<chartDiag.famChart.ItemConfig.id>
	*/
	this.fromItem = null;

	/*
	Property: toItem 
		Reference to from item in hierarchy.
	See Also:
		<chartDiag.famChart.ItemConfig.id>
	*/
	this.toItem = null;

	/*
	Property: connectorShapeType
		Connector shape type. 

	Default:
		<chartDiag.default.ConnectorShapeType.OneWay>
	*/
	this.connectorShapeType = 0/*chartDiag.default.ConnectorShapeType.OneWay*/;

	/*
	Property: connectorPlacementType
		Defines connector annotation shape placement mode between two items. 
		It uses off beat placement mode as default in order to avoid overlapping
		of base hierarchy connecting lines.

	Default:
		<chartDiag.default.ConnectorPlacementType.Offbeat>
*/
	this.connectorPlacementType = 0/*chartDiag.default.ConnectorPlacementType.Offbeat*/;

	/*
	Property: labelPlacementType
		Label placement type along connection line(s). 

	Default:
		<chartDiag.default.ConnectorLabelPlacementType.Between>
	*/
	this.labelPlacementType = 1/*chartDiag.default.ConnectorLabelPlacementType.Between*/;

	/*
	Property: offset
		Connector's from and to points offset off the rectangles side. Connectors connection points can be outside of rectangles and inside for negative offset value.
	See also:
		<chartDiag.default.Thickness>
	*/
	this.offset = new chartDiag.default.Thickness(0, 0, 0, 0);

	/*
	Property: lineWidth
		Border line width. 
	*/
	this.lineWidth = 2;

	/*
	Property: color
		Connector's color.
	
	Default:
		<chartDiag.default.Colors.Black>
	*/
	this.color = "#000000"/*chartDiag.default.Colors.Black*/;

	/*
	Property: lineType
		Connector's line pattern.

	Default:
		<chartDiag.default.LineType.Solid>
	*/
	this.lineType = 0/*chartDiag.default.LineType.Solid*/;

	/*
	Property: selectItems
		Always show annotated items in normal state. Setting this option is equivalent to adding annotated items to collection of selected items.

	Default:
		true

	See Also:
		<chartDiag.famChart.Config.selectedItems>
	*/
	this.selectItems = true;

	/*
	Property: label
		Annotation label text. Label styled with css class name "bp-connector-label".
	*/
	this.label = null;

	/*
	Property: labelSize
		Annotation label size.

	Default:
		new <chartDiag.default.Size>(60, 30);
	*/
	this.labelSize = new chartDiag.default.Size(60, 30);

	switch (arguments.length) {
		case 1:
			for (property in arg0) {
				if (arg0.hasOwnProperty(property)) {
					this[property] = arg0[property];
				}
			}
			break;
		case 2:
			this.fromItem = arg0;
			this.toItem = arg1;
			break;
	}
};

/* /Controls/FamDiagram/configs/HighlightPathAnnotationConfig.js*/
/*
	Class: chartDiag.famChart.HighlightPathAnnotationConfig
		Options class. Populate annotation collection with instances of this objects to draw path between items.
		Path is drawn along base connection lines displaying relationships between item of the chart.
	See Also:
		<chartDiag.famChart.Config.annotations>
*/
chartDiag.famChart.HighlightPathAnnotationConfig = function (arg0) {
	var property;

	/*
	Property: annotationType
		Annotation type. All various annotations are defined in annotation collection property of <chartDiag.famChart.Config>. 
		So this property is needed to define annotation type when we use JavaScript non-prototype objects.
		See other annotations as well.

	Default:
		<chartDiag.default.AnnotationType.HighlightPath>

	See Also:
		<chartDiag.famChart.Config.annotations>
		<chartDiag.famChart.ConnectorAnnotationConfig>
		<chartDiag.famChart.ShapeAnnotationConfig>
		<chartDiag.famChart.LabelAnnotationConfig>
		<chartDiag.famChart.BackgroundAnnotationConfig>
	*/
	this.annotationType = 2/*chartDiag.default.AnnotationType.HighlightPath*/;

	/*
	Property: items 
		Array of item ids in hierarchy.
	See Also:
		<chartDiag.famChart.ItemConfig.id>
	*/
	this.items = [];


	/*
	Property: selectItems
		Always show annotated items in normal state. Setting this option is equivalent to adding annotated items to collection of selected items.

	Default:
		true

	See Also:
		<chartDiag.famChart.Config.selectedItems>
	*/
	this.selectItems = false;

	switch (arguments.length) {
		case 1:
			if (arg0 !== null) {
				if (arg0 instanceof Array) {
					this.items = arg0;
				} else if (typeof arg0 == "object") {
					for (property in arg0) {
						if (arg0.hasOwnProperty(property)) {
							this[property] = arg0[property];
						}
					}
				}
			}
			break;
	}
};

/* /Controls/FamDiagram/configs/ItemConfig.js*/
/*
	Class: chartDiag.famChart.ItemConfig
		Defines item in family chart hierarchy. 
		User is supposed to create hierarchy of this items and assign it to <chartDiag.famChart.Config.items> collection property.
		Widget contains some generic properties used in default item template, 
		but user can add as many custom properties to this class as needed. 
		Just be careful and avoid widget malfunction.

	See Also:
		<chartDiag.famChart.Config.items>
*/
chartDiag.famChart.ItemConfig = function (arg0, arg1, arg2, arg3, arg4) {
	var property;
	/*
	Property: id
	Unique item id.
	*/
	this.id = null;

	/*
	Property: parents
	Collection of parent id's. If parents collection is empty [] then item placed as a root item.
	*/
	this.parents = [];

	/*
	Property: spouses
	Collection of spouses id's. Items in this collection share common connector line whether they have common children or not.
	*/
	this.spouses = [];

	/*
	Property: title
	Default template title property.
	*/
	this.title = null;

	/*
	Property: description
	Default template description element.
	*/
	this.description = null;

	/*
	Property: image
	Url to image. This property is used in default template.
	*/
	this.image = null;

	/*
	Property: context
	User context object.
	*/
	this.context = null;

	/*
	Property: itemTitleColor
	Default template title background color. The same color is used to draw minimized/dotted item.
	*/
	this.itemTitleColor = "#4169e1"/*chartDiag.default.Colors.RoyalBlue*/;

	/*
	Property: minimizedItemShapeType
		Defines minimized/dotted item shape type. By default it is set by ItemTemplate.minimizedItemShapeType property.
		Use this property to set marker type individually per item.

	See Also:
		<chartDiag.default.ShapeType>
	*/
	this.minimizedItemShapeType = null;

	/*
	Property: groupTitle
	Auxiliary group title property. Displayed vertically on the side of item.
	*/
	this.groupTitle = null;

	/*
	Property: groupTitleColor
	Group title background color.
	*/
	this.groupTitleColor = "#4169e1"/*chartDiag.default.Colors.RoyalBlue*/;

	/*
	Property: isActive
		If it is true then item is selectable in hierarchy and it has mouse over highlight. 

	True - Item is clickable.
	False - Item is inactive and user cannot set cursor item or highlight.

	Default:
		true
	*/
	this.isActive = true;

	/*
	Property: hasSelectorCheckbox
		If it is true then selection check box is shown for the item. 
		Selected items are always shown in normal form, so if item is 
		selected then its selection check box is visible and checked.

	Auto - Depends on <chartDiag.famChart.Config.hasSelectorCheckbox> setting.
	True - Selection check box is visible.
	False - No selection check box.

	Default:
	<chartDiag.default.Enabled.Auto>
	*/
	this.hasSelectorCheckbox = 0/*chartDiag.default.Enabled.Auto*/;

	/*
	Property: hasButtons
		This option controls buttons panel visibility. 

	Auto - Depends on <chartDiag.famChart.Config.hasButtons> setting.
	True - Has buttons panel.
	False - No buttons panel.

	Default:
	<chartDiag.default.Enabled.Auto>
	*/
	this.hasButtons = 0/*chartDiag.default.Enabled.Auto*/;

	/*
	Property: templateName
		This is template name used to render this item.

		See Also:
		<chartDiag.famChart.TemplateConfig>
		<chartDiag.famChart.Config.templates> collection property.
	*/
	this.templateName = null;

	/*
	Property: showCallout
		This option controls items callout visibility.

	Auto - depends on <chartDiag.famChart.Config.showCallout> option
	True - shown
	False - hidden

	Default:
		<chartDiag.default.Enabled.Auto>
	*/
	this.showCallout = 0/*chartDiag.default.Enabled.Auto*/;

	/*
	Property: calloutTemplateName
		This is template name used to render callout for dotted item. 
		Actual callout template name is defined by following sequence:
		<chartDiag.famChart.ItemConfig.calloutTemplateName> 
		<chartDiag.famChart.ItemConfig.templateName>
		<chartDiag.famChart.Config.defaultCalloutTemplateName>
		<chartDiag.famChart.Config.defaultTemplateName>

	See Also:
		<chartDiag.famChart.Config.templates> collection property.
	Default:
		null
	*/
	this.calloutTemplateName = null;

	/*
	Property: label
	Items label text.
	*/
	this.label = null;

	/*
	Property: showLabel
		This option controls items label visibility. Label is displayed in form of div having text inside, long string is wrapped inside of it. 
		User can control labels position relative to its item. Chart does not preserve space for label.

	Auto - depends on <chartDiag.famChart.Config.labelOrientation> setting.
	True - always shown.
	False - hidden.

	See Also:
	<chartDiag.famChart.ItemConfig.label>
	<chartDiag.famChart.Config.labelSize>

	Default:
		<chartDiag.default.Enabled.Auto>
	*/
	this.showLabel = 0/*chartDiag.default.Enabled.Auto*/;

	/*
	Property: labelSize
		Defines label size. It is needed to avoid labels overlapping. If one label overlaps another label or item it will be hidden. 
		Label string is wrapped when its length exceeds available width. 
		By default it is equal to charts <chartDiag.famChart.Config.labelSize>.

	See Also:
		<chartDiag.default.Size>
	Default:
		null;
	*/
	this.labelSize = null;

	/*
	Property: labelOrientation
		Defines label orientation. 
		In default <chartDiag.text.TextOrientationType.Auto> mode it depends on chart <chartDiag.famChart.Config.labelOrientation> setting.

	See Also:
	<chartDiag.famChart.Config.labelOrientation>
	<chartDiag.text.TextOrientationType>

	Default:
		<chartDiag.text.TextOrientationType.Auto>
	*/
	this.labelOrientation = 3/*chartDiag.text.TextOrientationType.Auto*/;

	/*
	Property: labelPlacement
		Defines label placement relative to the item. 
		In default <chartDiag.default.PlacementType.Auto> mode it depends on chart <chartDiag.famChart.Config.labelPlacement> setting.

	See Also:
		<chartDiag.famChart.Config.labelPlacement>
		<chartDiag.default.PlacementType>

	Default:
		<chartDiag.default.PlacementType.Auto>
	*/
	this.labelPlacement = 0/*chartDiag.default.PlacementType.Auto*/;

	switch (arguments.length) {
		case 1:
			for (property in arg0) {
				if (arg0.hasOwnProperty(property)) {
					this[property] = arg0[property];
				}
			}
			break;
		case 5:
			this.id = arg0;
			this.parent = arg1;
			this.title = arg2;
			this.description = arg3;
			this.image = arg4;
			break;
	}
};

/* /Controls/FamDiagram/configs/LabelAnnotationConfig.js*/
/*
	Class: chartDiag.famChart.LabelAnnotationConfig
		Options class. Populate annotation collection with instances of this object to draw labels between items in diagram layout.
		This label annotation is created over connection line going from item to its children or parents.
		It is required that label annotation references subset of item's parents or children.
		If you need to create cross chart reference then use connector annotation.
	
	See Also:
		<chartDiag.famChart.Config.annotations>
*/
chartDiag.famChart.LabelAnnotationConfig = function (arg0, arg1) {
	var property;

	/*
	Property: annotationType
		Annotation type. All various annotations are defined in annotation collection property of <chartDiag.famChart.Config>. 
		So this property is needed to define annotation type when we use JavaScript non-prototype objects.
		See other annotations as well.

	Default:
		<chartDiag.default.AnnotationType.Label>

	See Also:
		<chartDiag.famChart.Config.annotations>
		<chartDiag.famChart.ConnectorAnnotationConfig>
		<chartDiag.famChart.ShapeAnnotationConfig>
		<chartDiag.famChart.BackgroundAnnotationConfig>
		<chartDiag.famChart.HighlightPathAnnotationConfig>
	*/
	this.annotationType = 3/*chartDiag.default.AnnotationType.Label*/;

	/*
	Property: fromItem 
		This is the item you are creating annotation for.
	See Also:
		<chartDiag.famChart.ItemConfig.id>
	*/
	this.fromItem = null;

	/*
	Property: toItems 
		This collection should contain only child or parent items of annotated item.
		You cannot add child and parent items at the same time.
		It may contain sub set of child or parent items. In that case existing annotation labels are drawn as a cascade.
		
	See Also:
		<chartDiag.famChart.ItemConfig.id>
	*/
	this.toItems = [];

	/*
	Property: label
		Annotation label text. Label styled with css class name "bp-connector-label".
	*/
	this.title = null;

	/*
	Property: itemTitleColor
	Default template title background color.
	*/
	this.itemTitleColor = "#4169e1"/*chartDiag.default.Colors.RoyalBlue*/;

	/*
	Property: templateName
		This is template name used to render this label.

		See Also:
		<chartDiag.famChart.TemplateConfig>
		<chartDiag.famChart.Config.templates>
		<chartDiag.famChart.Config.onItemRender>
	*/
	this.templateName = null;

	switch (arguments.length) {
		case 1:
			for (property in arg0) {
				if (arg0.hasOwnProperty(property)) {
					this[property] = arg0[property];
				}
			}
			break;
		case 2:
			this.fromItem = arg0;
			this.toItem = arg1;
			break;
	}
};

/* /Controls/FamDiagram/configs/PaletteItemConfig.js*/
/*
	Class: chartDiag.famChart.PaletteItemConfig
		This class is used to define cross family connectors styles. 
		Multi-parent charts are supposed to have multiple cross hierarchy connectors, so in order to trace them more easely on chart
		every connector may have separate style. It is the same strategy as for visualization of regular line charts.

	See Also:
		<chartDiag.famChart.Config.linesPalette>
*/
chartDiag.famChart.PaletteItemConfig = function (arg0, arg1, arg2) {
	var property;

	/*
	Property: lineColor
		Line color.

	Default:
		<chartDiag.default.Colors.Silver>
	*/
	this.lineColor = "#c0c0c0"/*chartDiag.default.Colors.Silver*/;

	/*
	Property: lineWidth
		Line width.
	Default:
		1
	*/
	this.lineWidth = 1;

	/*
	Property: lineType
		Line pattern.

	Default:
		<chartDiag.default.LineType.Solid>
	*/
	this.lineType = 0/*chartDiag.default.LineType.Solid*/;

	switch (arguments.length) {
		case 1:
			for (property in arg0) {
				if (arg0.hasOwnProperty(property)) {
					this[property] = arg0[property];
				}
			}
			break;
		case 3:
			this.lineColor = arg0;
			this.lineWidth = arg1;
			this.lineType = arg2;
			break;
	}
};

/* /Controls/FamDiagram/configs/ShapeAnnotationConfig.js*/
/*
	Class: chartDiag.famChart.ShapeAnnotationConfig
		Options class. Populate annotation collection with instances of this objects to draw shape benith or on top of several items.
		Shape is drawn as rectangular area.
	See Also:
		<chartDiag.famChart.Config.annotations>
*/
chartDiag.famChart.ShapeAnnotationConfig = function (arg0) {
	var property;
	/*
	Property: annotationType
		Annotation type. All various annotations are defined in annotation collection property of <chartDiag.famChart.Config>. 
		So this property is needed to define annotation type when we use JavaScript non-prototype objects.
		See other annotations as well.

	Default:
		<chartDiag.default.AnnotationType.Shape>

	See Also:
		<chartDiag.famChart.Config.annotations>
		<chartDiag.famChart.ConnectorAnnotationConfig>
		<chartDiag.famChart.LabelAnnotationConfig>
		<chartDiag.famChart.BackgroundAnnotationConfig>
		<chartDiag.famChart.HighlightPathAnnotationConfig>
	*/
	this.annotationType = 1/*chartDiag.default.AnnotationType.Shape*/;

	/*
	Property: zOrderType
		Defines annotation Z order placement relative to chart items. Chart items are drawn in layers on top of each other. We can draw annotations under the items or over them. 
		If you place annotations over items then you block mouse events of UI elements in them. Browsers don't support mouse events transparentcy consistently. 
		So in order to avoid mouse events blocking of UI elements in item templates you have to place annotation items under them.
		Take into account that chart default buttons are drawn on top of everyhting, so they are never blocked by annotations drawn over items.

	Default:
		<chartDiag.default.ZOrderType.Auto>
	*/
	this.zOrderType = 0/*chartDiag.default.ZOrderType.Auto*/;

	/*
	Property: items 
		Array of items ids in hierarchy.
	See Also:
		<chartDiag.famChart.ItemConfig.id>
	*/
	this.items = [];

	/*
	Property: shapeType
		Shape type. 

	Default:
		<chartDiag.default.ShapeType.Rectangle>
	*/
	this.shapeType = 0/*chartDiag.default.ShapeType.Rectangle*/;

	/*
	Property: offset
		Connector's from and to points offset off the rectangles side. Connectors connection points can be outside of rectangles and inside for negative offset value.
	See also:
		<chartDiag.default.Thickness>
	*/
	this.offset = new chartDiag.default.Thickness(0, 0, 0, 0);

	/*
	Property: lineWidth
		Border line width. 
	*/
	this.lineWidth = 2;

	/*
	Property: cornerRadius
		Body corner radius in percents or pixels. For applicable shapes only.
	*/
	this.cornerRadius = "10%";

	/*
	Property: opacity
		Background color opacity. For applicable shapes only.
	*/
	this.opacity = 1;

	/*
	Property: borderColor
		Shape border line color.
	
	Default:
		null
	*/
	this.borderColor = null;

	/*
	Property: fillColor
		Fill Color. 

	Default:
		null
	*/
	this.fillColor = null;

	/*
	Property: lineType
		Connector's line pattern.

	Default:
		<chartDiag.default.LineType.Solid>
	*/
	this.lineType = 0/*chartDiag.default.LineType.Solid*/;

	/*
	Property: selectItems
		Always show annotated items in normal state. Setting this option is equivalent to adding annotated items to collection of selected items.

	Default:
		true

	See Also:
		<chartDiag.famChart.Config.selectedItems>
	*/
	this.selectItems = false;

	/*
	Property: label
		Annotation label text. Label styled with css class name "bp-connector-label".
	*/
	this.label = null;

	/*
	Property: labelSize
		Annotation label size.

	Default:
		new <chartDiag.default.Size>(60, 30);
	*/
	this.labelSize = new chartDiag.default.Size(60, 30);

	/*
	Property: labelPlacement
		Defines label placement relative to the shape. 

	See Also:
		<chartDiag.famChart.Config.labelPlacement>
		<chartDiag.default.PlacementType>

	Default:
		<chartDiag.default.PlacementType.Auto>
	*/
	this.labelPlacement = 0/*chartDiag.default.PlacementType.Auto*/;

	/*
	Property: labelOffset
		Defines label offset from shape in pixels.

	Default:
		4;
	*/
	this.labelOffset = 4;

	switch (arguments.length) {
		case 1:
			if (arg0 !== null) {
				if (arg0 instanceof Array) {
					this.items = arg0;
				} else if (typeof arg0 == "object") {
					for (property in arg0) {
						if (arg0.hasOwnProperty(property)) {
							this[property] = arg0[property];
						}
					}
				}
			}
			break;
	}
};

/* /Controls/FamDiagram/models/EdgeItem.js*/
chartDiag.famChart.EdgeItem = function (key0, val0, key1, val1) {
	this.values = [val0, val1];
	this[key0] = 0;
	this[key1] = 1;
};

chartDiag.famChart.EdgeItem.prototype.getNear = function (key) {
	return this.values[this[key]];
};

chartDiag.famChart.EdgeItem.prototype.getFar = function (key) {
	return this.values[Math.abs(this[key] - 1)];
};

chartDiag.famChart.EdgeItem.prototype.setNear = function (key, value) {
	this.values[this[key]] = value;
};

chartDiag.famChart.EdgeItem.prototype.setFar = function (key, value) {
	this.values[Math.abs(this[key] - 1)] = value;
};

chartDiag.famChart.EdgeItem.prototype.toString = function () {
	return this.parent + ',' + this.child;
};

/* /Controls/FamDiagram/models/ExtraGravity.js*/
chartDiag.famChart.ExtraGravity = function (level) {
	this.commonParent = null; // chartDiag.orgChart.OrgItem.id
	this.fromParent = null; // chartDiag.orgChart.OrgItem.id
	this.toParent = null; // chartDiag.orgChart.OrgItem.id
	this.level = level;
};

/* /Controls/FamDiagram/models/Family.js*/
chartDiag.famChart.Family = function (id) {
	this.id = null;
	this.familyPriority = 1;
	this.childFamilies = [];
	this.items = [];

	this.links = []; /* array of FamLink's */
	this.backLinks = []; /* array of FamLink's */

	if (arguments.length == 1) {
		this.id = id;
	}
};

/* /Controls/FamDiagram/models/FamilyItem.js*/
chartDiag.famChart.FamilyItem = function (arg0) {
	var property;

	this.id = null;
	this.familyId = null;
	this.itemConfig = null;

	this.isVisible = true;
	this.isActive = true; // item is clickable
	this.isLevelNeutral = false; // This option allows to place fake item in between of original item levels

	this.level = null;
	this.levelGravity = 0/*chartDiag.default.GroupByType.None*/; // If item can be moved between its parent and children levels in diagram, this option defines preference
	this.hideParentConnection = false;
	this.hideChildrenConnection = false;

	switch (arguments.length) {
		case 1:
			for (property in arg0) {
				if (arg0.hasOwnProperty(property)) {
					this[property] = arg0[property];
				}
			}
			break;
	}
};

/* /Controls/FamDiagram/models/FamLink.js*/
chartDiag.famChart.FamLink = function (fromItem, toItem) {
	this.fromItem = fromItem; /* FamilyItem.id */
	this.toItem = toItem; /* FamilyItem.id */
};

/* /Controls/FamDiagram/models/Slot.js*/
chartDiag.famChart.Slot = function (itemid) {
	this.id = null;
	this.prev = null; /* prev slot id */
	this.next = null; /* next slot id */

	this.position = null;
	this.balance = 0;

	this.itemId = itemid; /* if itemId is null then this slot is empty */
	
	this.left = {}; /* total number of children at the level on the left side of this slot */
	this.right = {}; /* total number of children at the level on the right side of this slot */

	this.crossings = {}; /* number of connections crossing this slot from side to side at the level */
};

chartDiag.famChart.Slot.prototype.clone = function () {
	var result = new chartDiag.famChart.Slot(),
		level;

	result.itemId = this.itemId;

	for (level in this.left) {
		if (this.left.hasOwnProperty(level)) {
			result.left[level] = this.left[level];
		}
	}
	for (level in this.right) {
		if (this.right.hasOwnProperty(level)) {
			result.right[level] = this.right[level];
		}
	}
	for (level in this.crossings) {
		if (this.crossings.hasOwnProperty(level)) {
			result.crossings[level] = this.crossings[level];
		}
	}

	return result;
};

/* /Controls/FamDiagram/models/Slots.js*/
chartDiag.famChart.Slots = function () {
	this.first = null;
	this.last = null;

	this.slots = {};

	this.items = {};

	this.counter = 0;
};

chartDiag.famChart.Slots.prototype.add = function (slot) {
	slot.id = this.counter;
	this.counter += 1;

	this.slots[slot.id] = slot;
	if (slot.itemId != null) {
		this.items[slot.itemId] = slot;
	}

	if (this.last == null) {
		this.last = slot.id;
		this.first = slot.id;
	} else {
		this.slots[this.last].next = slot.id;
		slot.prev = this.last;

		this.last = slot.id;
	}
};

chartDiag.famChart.Slots.prototype.insertBefore = function (beforeSlot, slot) {
	slot.id = this.counter;
	this.counter+=1;
	this.slots[slot.id] = slot;
	if (slot.itemId != null) {
		this.items[slot.itemId] = slot;
	}

	if (beforeSlot.prev == null) {
		slot.next = beforeSlot.id;
		this.first = slot.id;
	} else {
		var prevSlot = this.slots[beforeSlot.prev];
		prevSlot.next = slot.id;
		slot.next = beforeSlot.id;
		beforeSlot.prev = slot.id;
		slot.prev = prevSlot.id;
	}
};

chartDiag.famChart.Slots.prototype.loop = function (callback, startSlot) {
	var slotid = startSlot != null ? startSlot.id : this.first,
		slot;

	while (slotid != null) {
		slot = this.slots[slotid];

		if (callback(slot)) {
			break;
		}

		slotid = slot.next;
	}
};

chartDiag.famChart.Slots.prototype.backwardLoop = function (callback, startSlot) {
	var slotid = startSlot != null ? startSlot.id : this.last,
		slot;

	while (slotid != null) {
		slot = this.slots[slotid];

		if (callback(slot)) {
			break;
		}

		slotid = slot.prev;
	}
};

chartDiag.famChart.Slots.prototype.getSlot = function (itemId) {
	return this.items[itemId];
};

/* /Controls/FamDiagram/Tasks/Options/Annotations/LabelAnnotationOptionTask.js*/
chartDiag.famChart.LabelAnnotationOptionTask = function (splitAnnotationsOptionTask, logicalFamilyTask, defaultLabelAnnotationConfig) {
	var _data = {
		annotations: [],
		configs: {},
		maximumId: null
	},
	_hash = {};

	var _dataTemplate = new chartDiag.default.ArrayReader(
			new chartDiag.default.ObjectReader({
				zOrderType: new chartDiag.default.EnumerationReader(chartDiag.default.ZOrderType, false, defaultLabelAnnotationConfig.zOrderType),
				fromItem: new chartDiag.default.ValueReader(["string", "number"], true),
				toItems: new chartDiag.default.ArrayReader(
					new chartDiag.default.ValueReader(["string", "number"], true),
					true
				),
				title: new chartDiag.default.ValueReader(["string"], true),
				itemTitleColor: new chartDiag.default.ValueReader(["string"], false, defaultLabelAnnotationConfig.itemTitleColor),
				templateName: new chartDiag.default.ValueReader(["string"], true)
			},
			false
		),
		false,
		null,
		true
		);


	function process() {
		var context = {
			isChanged: false,
			hash: _hash,
			sourceHash: {}
		},
		maximumId = logicalFamilyTask.getMaximumId(),
		index, len, annotation;

		_data.annotations = _dataTemplate.read(_data.annotations, splitAnnotationsOptionTask.getAnnotations(3/*chartDiag.default.AnnotationType.Label*/), "annotations", context);
		_data.configs = {};

		/* here we assign unique id to every annotation used in layout
			and populate configs hash mapping id to source annotation
			these source items used as context objects in rendering cycle
		*/
		var sourceItems = context.sourceHash.annotations;
		for (index = 0, len = _data.annotations.length; index < len; index += 1) {
			annotation = _data.annotations[index];
			maximumId += 1;
			annotation.id = maximumId;

			_data.configs[annotation.id] = sourceItems[index];
		}

		_data.maximumId = maximumId;

		return context.isChanged;
	}

	function getAnnotations() {
		return _data.annotations;
	}

	function getMaximumId() {
		return _data.maximumId;
	}

	function getConfig(itemId) {
		return _data.configs[itemId];
	}

	return {
		process: process,
		getAnnotations: getAnnotations,
		getMaximumId: getMaximumId,
		getConfig: getConfig
	};
};

/* /Controls/FamDiagram/Tasks/Options/Annotations/LabelAnnotationPlacementOptionTask.js*/
chartDiag.famChart.LabelAnnotationPlacementOptionTask = function (labelAnnotationOptionTask, defaultLabelAnnotationConfig) {
	var _data = {
		annotations: []
	},
	_hash = {};

	var _dataTemplate = new chartDiag.default.ArrayReader(
			new chartDiag.default.ObjectReader({
				id: new chartDiag.default.ValueReader(["number"], true),
				fromItem: new chartDiag.default.ValueReader(["string", "number"], true),
				toItems: new chartDiag.default.ArrayReader(
					new chartDiag.default.ValueReader(["string", "number"], true),
					true
				)
			}),
			true,
			"id"
			);

	function process() {
		var context = {
			isChanged: false,
			hash: _hash
		};

		_data.annotations = _dataTemplate.read(_data.annotations, labelAnnotationOptionTask.getAnnotations(), "annotations", context);

		return context.isChanged;
	}

	function getAnnotations() {
		return _data.annotations;
	}

	function getMaximumId() {
		return labelAnnotationOptionTask.getMaximumId();
	}

	return {
		process: process,
		getAnnotations: getAnnotations,
		getMaximumId: getMaximumId
	};
};

/* /Controls/FamDiagram/Tasks/Options/Annotations/LabelAnnotationTemplateOptionTask.js*/
chartDiag.famChart.LabelAnnotationTemplateOptionTask = function (labelAnnotationOptionTask, defaultLabelAnnotationConfig) {
	var _data = {
		annotations: []
	},
	_hash = {};

	var _dataTemplate = new chartDiag.default.ArrayReader(
			new chartDiag.default.ObjectReader({
				id: new chartDiag.default.ValueReader(["number"], true),
				title: new chartDiag.default.ValueReader(["string"], true),
				itemTitleColor: new chartDiag.default.ValueReader(["string"], false, defaultLabelAnnotationConfig.itemTitleColor),
				templateName: new chartDiag.default.ValueReader(["string"], true)
			}),
			true,
			"id"
		);


	function process() {
		var context = {
			isChanged: false,
			hash: _hash
		};

		_data.annotations = _dataTemplate.read(_data.annotations, labelAnnotationOptionTask.getAnnotations(), "annotations", context);

		return context.isChanged;
	}

	function getAnnotations() {
		return _data.annotations;
	}

	return {
		process: process,
		getAnnotations: getAnnotations
	};
};

/* /Controls/FamDiagram/Tasks/Options/Selection/NeighboursSelectionModeOptionTask.js*/
chartDiag.famChart.NeighboursSelectionModeOptionTask = function (optionsTask, defaultConfig) {
	var _data = {};

	var _dataTemplate = new chartDiag.default.ObjectReader({
			neighboursSelectionMode: new chartDiag.default.EnumerationReader(chartDiag.default.NeighboursSelectionMode, false, defaultConfig.neighboursSelectionMode)
		});

	function process() {
		var context = {
			isChanged: false
		};

		_data = _dataTemplate.read(_data, optionsTask.getOptions(), "options", context);

		return context.isChanged;
	}

	function getNeighboursSelectionMode() {
		return _data.neighboursSelectionMode;
	}

	return {
		process: process,
		getNeighboursSelectionMode: getNeighboursSelectionMode
	};
};

/* /Controls/FamDiagram/Tasks/Options/ItemsOptionTask.js*/
chartDiag.famChart.ItemsOptionTask = function (optionsTask, defaultItemConfig) {
	var _data = {},
		_hash = {},
		_sourceHash = {};

	var _dataTemplate = new chartDiag.default.ObjectReader({
			items: new chartDiag.default.ArrayReader(
				new chartDiag.default.ObjectReader({
					id: new chartDiag.default.ValueReader(["string", "number"], true),
					parents: new chartDiag.default.ArrayReader(
						new chartDiag.default.ValueReader(["string", "number"], true),
						true
					),
					isActive: new chartDiag.default.ValueReader(["boolean"], false, defaultItemConfig.isActive)
				}),
				true,
				"id",
				true
				)
		});

	function process() {
		var context = {
			isChanged: false,
			hash: _hash,
			sourceHash: _sourceHash
		};

		_data = _dataTemplate.read(_data, optionsTask.getOptions(), "options", context);

		return context.isChanged;
	}

	function getItems() {
		return _data.items;
	}

	function getConfig(itemId) {
		return _sourceHash["options-items"][itemId];
	}

	return {
		process: process,
		getItems: getItems,
		getConfig: getConfig
	};
};

/* /Controls/FamDiagram/Tasks/Options/LinePaletteOptionTask.js*/
chartDiag.famChart.LinePaletteOptionTask = function (optionsTask, defaultPaletteItemConfig) {
	var _data = {},
		_hash = {};

	var _dataTemplate = new chartDiag.default.ObjectReader({
		linesPalette: new chartDiag.default.ArrayReader(
				new chartDiag.default.ObjectReader({
					lineColor: new chartDiag.default.ValueReader(["string"], false, defaultPaletteItemConfig.lineColor),
					lineWidth: new chartDiag.default.ValueReader(["number"], false, defaultPaletteItemConfig.lineWidth),
					lineType: new chartDiag.default.EnumerationReader(chartDiag.default.LineType, false, defaultPaletteItemConfig.lineType)
				}),
				false
				)
		});

	function process() {
		var context = {
			isChanged: false,
			hash: _hash
		};

		_data = _dataTemplate.read(_data, optionsTask.getOptions(), "options", context);

		return context.isChanged;
	}

	function getOptions() {
		return _data;
	}

	return {
		process: process,
		getOptions: getOptions
	};
};

/* /Controls/FamDiagram/Tasks/Options/NormalizeOptionTask.js*/
chartDiag.famChart.NormalizeOptionTask = function (optionsTask, defaultConfig) {
	var _data = {},
		_hash = {};

	var _dataTemplate = new chartDiag.default.ObjectReader({
		groupByType: new chartDiag.default.EnumerationReader(chartDiag.default.GroupByType, false, defaultConfig.groupByType)
		});

	function process() {
		var context = {
			isChanged: false,
			hash: _hash
		};

		_data = _dataTemplate.read(_data, optionsTask.getOptions(), "options", context);

		return context.isChanged;
	}

	function getOptions() {
		return _data;
	}

	return {
		process: process,
		getOptions: getOptions
	};
};

/* /Controls/FamDiagram/Tasks/Options/OptionsTask.js*/
/* eliminate invisible items */
chartDiag.famChart.OptionsTask = function (getOptions) {

	function process() {
		return true;
	}

	return {
		process: process,
		getOptions: getOptions,
		description: "Raw options."
	};
};

/* /Controls/FamDiagram/Tasks/Options/SpousesOptionTask.js*/
chartDiag.famChart.SpousesOptionTask = function (optionsTask, defaultItemConfig) {
	var _data = {},
		_hash = {};

	var _dataTemplate = new chartDiag.default.ObjectReader({
			items: new chartDiag.default.ArrayReader(
				new chartDiag.default.ObjectReader({
					id: new chartDiag.default.ValueReader(["string", "number"], true),
					spouses: new chartDiag.default.ArrayReader(
						new chartDiag.default.ValueReader(["string", "number"], true),
						true
					)
				}),
				true,
				"id"
				)
		});

	function process() {
		var context = {
			isChanged: false,
			hash: _hash
		};

		_data = _dataTemplate.read(_data, optionsTask.getOptions(), "options", context);

		return context.isChanged;
	}

	function getItems() {
		return _data.items;
	}

	return {
		process: process,
		getItems: getItems
	};
};

/* /Controls/FamDiagram/Tasks/Options/VisualTreeOptionTask.js*/
chartDiag.famChart.VisualTreeOptionTask = function (optionsTask) {
	var _data = {
		leavesPlacementType: 2/*chartDiag.default.ChildrenPlacementType.Horizontal*/,
		childrenPlacementType: 2/*chartDiag.default.ChildrenPlacementType.Horizontal*/,
		maximumColumnsInMatrix: 6,
		horizontalAlignment: 0/*chartDiag.default.HorizontalAlignmentType.Center*/
	};

	function process() {
		return false;
	}

	function getOptions() {
		return _data;
	}

	return {
		process: process,
		getOptions: getOptions
	};
};

/* /Controls/FamDiagram/Tasks/Templates/CombinedTemplateParamsTask.js*/
chartDiag.famChart.CombinedTemplateParamsTask = function (itemTemplateParamsTask, labelAnnotationTemplateParamsTask) {
	function process() {
		return true;
	}

	function getTemplateParams(itemId) {
		return itemTemplateParamsTask.getTemplateParams(itemId) || labelAnnotationTemplateParamsTask.getTemplateParams(itemId);
	}

	return {
		process: process,
		getTemplateParams: getTemplateParams
	};
};

/* /Controls/FamDiagram/Tasks/Templates/LabelAnnotationTemplateParamsTask.js*/
chartDiag.famChart.LabelAnnotationTemplateParamsTask = function (itemsSizesOptionTask, labelAnnotationTemplateOptionTask, readTemplatesTask) {
	var _data = {
		items: {} // TemplateParams
	};

	function process() {
		var itemsSizesOptions = itemsSizesOptionTask.getOptions(),
			items = labelAnnotationTemplateOptionTask.getAnnotations(),
			index, len;

		_data.items = {};

		for (index = 0, len = items.length; index < len; index += 1) {
			var annotation = items[index],
				templateParams = new chartDiag.orgChart.TemplateParams(),
				template = readTemplatesTask.getTemplate(annotation.templateName, itemsSizesOptions.defaultLabelAnnotationTemplate, readTemplatesTask.DefaultWidgetLabelAnnotationTemplateName);

			templateParams.template = template;

			_data.items[annotation.id] = templateParams;
		}

		return true;
	}

	function getTemplateParams(itemId) {
		return _data.items[itemId];
	}

	return {
		process: process,
		getTemplateParams: getTemplateParams
	};
};

/* /Controls/FamDiagram/Tasks/Transformations/Selection/CursorNeighboursTask.js*/
chartDiag.famChart.CursorNeighboursTask = function (cursorItemTask, neighboursSelectionModeOptionTask, navigationFamilyTask, orgTreeTask, visualTreeTask) {
	var _data = {
		items: []
	};

	function process() {
		var cursorTreeItemId = cursorItemTask.getCursorTreeItem(),
			navigationFamily = navigationFamilyTask.getNavigationFamily(),
			orgTree = orgTreeTask.getOrgTree(),
			visualTree = visualTreeTask.getVisualTree(),
			neighboursSelectionMode = neighboursSelectionModeOptionTask.getNeighboursSelectionMode();

		_data.items = getCursorNeighbours(cursorTreeItemId, neighboursSelectionMode, navigationFamily, orgTree, visualTree);

		return true;
	}

	function getCursorNeighbours(cursorTreeItemId, neighboursSelectionMode, navigationFamily, orgTree, visualTree) {
		var result = [],
			treeItem;
		if (cursorTreeItemId !== null) {
			switch (neighboursSelectionMode) {
				case 0/*chartDiag.default.NeighboursSelectionMode.ParentsAndChildren*/:
					navigationFamily.loopParents(this, cursorTreeItemId, function (itemid, item) {
						var orgItem = orgTree.node(itemid);
						treeItem = visualTree.node(itemid);
						if (treeItem != null && treeItem.visibility === 0/*chartDiag.default.Visibility.Auto*/) {
							treeItem.visibility = 1/*chartDiag.default.Visibility.Normal*/;
						}
						if (orgItem.isActive) {
							return navigationFamily.SKIP;
						}
					});
					navigationFamily.loopChildren(this, cursorTreeItemId, function (itemid, item) {
						var orgItem = orgTree.node(itemid);
						treeItem = visualTree.node(itemid);
						if (treeItem != null && treeItem.visibility === 0/*chartDiag.default.Visibility.Auto*/) {
							treeItem.visibility = 1/*chartDiag.default.Visibility.Normal*/;
						}
						if (orgItem.isActive) {
							return navigationFamily.SKIP;
						}
					});
					break;
				case 1/*chartDiag.default.NeighboursSelectionMode.ParentsChildrenSiblingsAndSpouses*/:
					navigationFamily.loopNeighbours(this, cursorTreeItemId, function (itemid, item) {
						var orgItem = orgTree.node(itemid);
						treeItem = visualTree.node(itemid);
						if (treeItem != null && treeItem.visibility === 0/*chartDiag.default.Visibility.Auto*/) {
							treeItem.visibility = 1/*chartDiag.default.Visibility.Normal*/;
						}
						if (orgItem.isActive) {
							return true;
						}
					});
					break;
			}
		}
		return result;
	}

	function getItems() {
		return _data.items;
	}

	return {
		process: process,
		getItems: getItems
	};
};

/* /Controls/FamDiagram/Tasks/Transformations/AddLabelAnnotationsTask.js*/
chartDiag.famChart.AddLabelAnnotationsTask = function (labelAnnotationPlacementOptionTask, logicalFamilyTask) {
	var _data = {
		logicalFamily: null,
		maximumId: null
	},
	_defaultLabelAnnotationTemplateName;

	function process(debug) {
		var index, len,
			itemConfig,
			logicalFamily = logicalFamilyTask.getLogicalFamily(),
			annotations = labelAnnotationPlacementOptionTask.getAnnotations();

		logicalFamily = logicalFamily.clone();

		addLabelAnnotations(logicalFamily, annotations);

		_data.logicalFamily = logicalFamily;

		_data.maximumId = labelAnnotationPlacementOptionTask.getMaximumId();

		if (debug && !logicalFamily.validate()) {
			throw "References are broken in family structure!";
		}

		return true;
	}

	function addLabelAnnotations(logicalFamily, annotations) {
		var edges = chartDiag.default.graph(), /* edge item is new chartDiag.famChart.EdgeItem(fromItem, toItem); */
			configsHash = {},
			configs, config,
			fromItem,
			index, len;

		if (annotations.length > 0) {
			/* group annotations by from item */
			for (index = 0, len = annotations.length; index < len; index += 1) {
				config = annotations[index];
				if (!configsHash.hasOwnProperty(config.fromItem)) {
					configsHash[config.fromItem] = [config];

					/* create edges hash for item */
					logicalFamily.loopChildren(this, config.fromItem, function (childid, child, level) {
						edges.addEdge(config.fromItem, childid, new chartDiag.famChart.EdgeItem(config.fromItem, config.fromItem, childid, childid));
						return logicalFamily.SKIP;
					});//ignore jslint
					logicalFamily.loopParents(this, config.fromItem, function (parentid, parent, level) {
						edges.addEdge(parentid, config.fromItem, new chartDiag.famChart.EdgeItem(parentid, parentid, config.fromItem, config.fromItem));
						return logicalFamily.SKIP;
					});//ignore jslint

				} else {
					configsHash[config.fromItem].push(config);
				}
			}

			for (fromItem in configsHash) {
				if (configsHash.hasOwnProperty(fromItem)) {
					configs = configsHash[fromItem];

					/* process annotations having greater number of references first */
					configs.sort(function (a, b) {
						return b.toItems.length - a.toItems.length;
					}); //ignore jslint


					for (index = 0; index < configs.length; index += 1) {
						config = configs[index];

						addLabelAnnotation(logicalFamily, edges, config.fromItem, config.toItems, function () {
							/* add label annotation as new diagram family item */
							return new chartDiag.famChart.FamilyItem({
								id: config.id,
								isVisible: true,
								isLevelNeutral: true,
								isActive: false,
								itemConfig: config
							});
						}); //ignore jslint
					}
				}
			}
		}
	}

	function addLabelAnnotation(logicalFamily, edges, fromItem, toItems, onCreate) {
		var edge,
			isValid = true,
			commonParentId = null,
			toItem,
			index, len,
			bundleItem,
			bundleItems = [];

		for (index = 0, len = toItems.length; index < len; index += 1) {
			toItem = toItems[index];

			edge = edges.edge(fromItem, toItem);
			if (edge != null) {
				if (commonParentId == null) {
					commonParentId = edge.getFar(toItem);
				} else {
					if (commonParentId != edge.getFar(toItem)) {
						isValid = false;
						break;
					}
				}
				bundleItems.push(edge.getNear(toItem));
			} else {
				isValid = false;
				break;
			}
		}

		if (isValid) {
			bundleItem = onCreate();
			if (logicalFamily.bundleParents(commonParentId, bundleItems, bundleItem.id, bundleItem)) {
				bundleItem.levelGravity = 2/*chartDiag.default.GroupByType.Children*/;
				isValid = true;
			} else if (logicalFamily.bundleChildren(commonParentId, bundleItems, bundleItem.id, bundleItem)) {
				bundleItem.levelGravity = 1/*chartDiag.default.GroupByType.Parents*/;
				isValid = true;
			} else if (logicalFamily.bundleParents(commonParentId, toItems, bundleItem.id, bundleItem)) {
				bundleItem.levelGravity = 2/*chartDiag.default.GroupByType.Children*/;
				isValid = true;
			} else if (logicalFamily.bundleParents(commonParentId, toItems, bundleItem.id, bundleItem)) {
				bundleItem.levelGravity = 1/*chartDiag.default.GroupByType.Parents*/;
				isValid = true;
			}

			if (isValid) {
				for (index = 0, len = toItems.length; index < len; index += 1) {
					toItem = toItems[index];

					edge = edges.edge(fromItem, toItem);
					edge.setFar(toItem, bundleItem.id);
				}
			}
		}
	}

	function getNavigationFamily() {
		return _data.logicalFamily;
	}

	function getMaximumId() {
		return _data.maximumId;
	}

	return {
		process: process,
		getNavigationFamily: getNavigationFamily,
		getMaximumId: getMaximumId
	};
};

/* /Controls/FamDiagram/Tasks/Transformations/AddSpousesTask.js*/
chartDiag.famChart.AddSpousesTask = function (spousesOptionTask, removeLoopsTask) {
	var _data = {
		logicalFamily: null,
		maximumId: null
	};

	function process(debug) {
		var logicalFamily = removeLoopsTask.getLogicalFamily(),
			maximumId = removeLoopsTask.getMaximumId(),
			items = spousesOptionTask.getItems();

		logicalFamily = logicalFamily.clone();

		maximumId = addFakeChildrenForSpouses(logicalFamily, items, maximumId, debug);

		_data.logicalFamily = logicalFamily;
		_data.maximumId = maximumId;

		if (debug && !logicalFamily.validate()) {
			throw "References are broken in family structure!";
		}
		return true;
	}

	function addFakeChildrenForSpouses(logicalFamily, items, maximumId, debug) {
		var couple, fakeChild,
			index, len,
			itemConfig,
			spouseIndex, spouseLen,
			spouses;
		for (index = 0, len = items.length; index < len; index += 1) {
			itemConfig = items[index];
			spouses = itemConfig.spouses.slice(0);
			for (spouseIndex = 0, spouseLen = spouses.length; spouseIndex < spouseLen; spouseIndex += 1) {
				couple = [itemConfig.id, spouses[spouseIndex]];
				if (!logicalFamily.hasCommonChild(couple)) {

					/* create fake child item to keep spouses together */
					maximumId += 1;

					fakeChild = new chartDiag.famChart.FamilyItem({
						id: maximumId,
						isVisible: false,
						isActive: true,
						isLevelNeutral: true,
						hideParentConnection: true,
						hideChildrenConnection: true,
						itemConfig: { title: "fake child #" + maximumId, description: "This is fake child keeps spouses together." }
					});

					logicalFamily.add(couple, fakeChild.id, fakeChild);
				}
			}
		}
		return maximumId;
	}

	function getLogicalFamily() {
		return _data.logicalFamily;
	}

	function getMaximumId() {
		return _data.maximumId;
	}

	return {
		process: process,
		getLogicalFamily: getLogicalFamily,
		getMaximumId: getMaximumId
	};
};

/* /Controls/FamDiagram/Tasks/Transformations/LogicalFamilyTask.js*/
chartDiag.famChart.LogicalFamilyTask = function (itemsOptionTask) {
	var _data = {
		logicalFamily: null,
		maximumId: null
	};

	function process(debug) {
		var index, len,
			itemConfig, famItem,
			items = itemsOptionTask.getItems(),
			logicalFamily = chartDiag.default.family(), /*family contains chartDiag.famChart.ItemConfig */
			maximumId = 0,
			parsedId;

		if (items.length > 0) {
			for (index = 0, len = items.length; index < len; index += 1) {
				itemConfig = items[index];

				if (itemConfig != null) {
					famItem = new chartDiag.famChart.FamilyItem({
						id: itemConfig.id,
						itemConfig: itemConfig,
						isActive: itemConfig.isActive
					});

					logicalFamily.add(itemConfig.parents, famItem.id, famItem);

					parsedId = parseInt(itemConfig.id, 10);
					maximumId = Math.max(isNaN(parsedId) ? 0 : parsedId, maximumId);
				}
			}
		}

		_data.logicalFamily = logicalFamily;
		_data.maximumId = maximumId;

		if (debug && !logicalFamily.validate()) {
			throw "References are broken in family structure!";
		}

		return true;
	}

	function getLogicalFamily() {
		return _data.logicalFamily;
	}

	function getMaximumId() {
		return _data.maximumId;
	}

	return {
		process: process,
		getLogicalFamily: getLogicalFamily,
		getMaximumId: getMaximumId
	};
};

/* /Controls/FamDiagram/Tasks/Transformations/NormalizeLogicalFamilyTask.js*/
/*	1. Topologically sort _logicalFamily items and assign levels.
	2. Optimize references. Transform M:N relations to M:1:N where it is possible.
	3. Eliminate Many to Many relations. Logical family consists of 1:M and M:1 relations only.
	4. Resort items, so original visible items stay at the same level.
	5. Fill in missed items between levels. So that way we have invisible items between parent/child family items if they have gap between levels.
		Such invisible family items have isVisible option set to false.
*/
chartDiag.famChart.NormalizeLogicalFamilyTask = function (normalizeOptionTask, addSpousesTask) {
	var _data = {
		logicalFamily: null,
		maximumId: null
	},
	_normalizeOptions;

	function process(debug) {
		var logicalFamily = addSpousesTask.getLogicalFamily(),
			maximumId = addSpousesTask.getMaximumId();

		_normalizeOptions = normalizeOptionTask.getOptions();

		logicalFamily = logicalFamily.clone();

		maximumId = normalize(logicalFamily, maximumId, debug);

		_data.logicalFamily = logicalFamily;
		_data.maximumId = maximumId;

		if (debug && !logicalFamily.validate()) {
			throw "References are broken in family structure!";
		}

		return true;
	}

	function normalize(logicalFamily, maximumId, debug) {
		var index, len, index2, len2,
			famItem,
			familiesGraph, /* chartDiag.default.graph */
			link, links,
			fromFamily,
			toFamily,
			sortedFamilies = [], sortedFamiliesHash,
			attachedFamilies,
			userItem,
			familyId,
			family,
			familyRootItem,
			fromItem,
			toItem,
			rootItem, rootItems, bestRootItem, bestReference,
			spanningTree,
			extraGravities, grandChildren,
			parsedId,
			itemsHavingSpouses, spouses,
			orgItemRoot,
			famItemsExtracted,
			families2;

		if (logicalFamily.hasNodes() > 0) {
			/* Distribute FamilyItem-s by levels. Item levels aligned to bottom. */
			logicalFamily.loopLevels(this, _normalizeOptions.groupByType == 1/*chartDiag.default.GroupByType.Parents*/, function (itemid, item, levelIndex) {
				item.level = levelIndex;
			});

			/* Optimize family references. Bundle connectors where it is possible */
			logicalFamily.optimizeReferences(function () {
				maximumId += 1;

				return new chartDiag.famChart.FamilyItem({
					id: maximumId,
					isVisible: false,
					isActive: false,
					itemConfig: { title: "bundle #" + maximumId, description: " This item was created by references optimizer." },
					levelGravity: 2/*chartDiag.default.GroupByType.Children*/
				});
			}); //ignore jslint

			if (debug && !logicalFamily.validate()) {
				throw "References are broken in family structure!";
			}

			/* eliminate many to many connections in chart, every connection should be ether child or parent relation. */
			logicalFamily.eliminateManyToMany(function () {
				maximumId += 1;

				return new chartDiag.famChart.FamilyItem({
					id: maximumId,
					isVisible: false,
					isActive: false,
					itemConfig: { title: "dummy #" + maximumId, description: "This is item used to eliminate M:M relations." },
					levelGravity: 2/*chartDiag.default.GroupByType.Children*/
				});
			} //ignore jslint
			);

			if (debug && !logicalFamily.validate()) {
				throw "References are broken in family structure!";
			}

			/* Distribute FamilyItem-s by levels. The original family items visible to user should keep their levels after all transformations */
			resortItemsBylevels(logicalFamily);

			if (debug) {
				validate(logicalFamily, false);
			}

			/* Fill in items between parent/child relations having gaps in levels */
			fillInItems(logicalFamily,
				function () {
					var result;

					maximumId += 1;

					result = new chartDiag.famChart.FamilyItem({
						id: maximumId,
						levelGravity: 2/*chartDiag.default.GroupByType.Children*/,
						isVisible: false,
						isActive: false,
						itemConfig: { title: "extension #" + maximumId, description: "This is item used to fill gaps in levels." }
					});


					return result;
				} //ignore jslint
			);

			if (debug) {
				validate(logicalFamily, true);
			}
		}
		return maximumId;
	}

	function resortItemsBylevels(logicalFamily) {
		var itemsAtLevels = [],
			minimumLevel = null,
			maximumLevel = null,
			currentLevel, index, itemsAtLevel;

		logicalFamily.loop(this, function (famItemId, famItem) {
			famItem.originalLevel = famItem.level;
			famItem.level = null;
			if (famItem.originalLevel != null) {
				if (!itemsAtLevels[famItem.originalLevel]) {
					itemsAtLevels[famItem.originalLevel] = {};
				}
				itemsAtLevels[famItem.originalLevel][famItemId] = famItem;

				minimumLevel = minimumLevel != null ? Math.min(famItem.originalLevel, minimumLevel) : famItem.originalLevel;
				maximumLevel = maximumLevel != null ? Math.max(famItem.originalLevel, maximumLevel) : famItem.originalLevel;
			}
		});

		/* assign levels*/
		currentLevel = 0;
		for (index = minimumLevel; index <= maximumLevel; index += 1) {
			itemsAtLevel = itemsAtLevels[index];

			currentLevel = setLevelsForItems(itemsAtLevel, logicalFamily, currentLevel, index + 1);
		}

		logicalFamily.loopTopoReversed(this, function (famItemId, famItem, position) {
			var level;
			if (famItem.levelGravity == 2/*chartDiag.default.GroupByType.Children*/) {
				level = null;

				logicalFamily.loopChildren(this, famItemId, function (childItemId, childFamItem, levelIndex) {
					if (levelIndex > 0) {
						return logicalFamily.BREAK;
					}
					level = level == null ? childFamItem.level - 1 : Math.min(childFamItem.level - 1, level);
				}); //ignore jslint
				famItem.level = !level ? famItem.level : level;
			}
		});
	}

	function setLevelsForItems(items, logicalFamily, level, nextOriginalLevel) {
		var result = level,
			nextItems, key, famItem;
		while (!chartDiag.default.isEmptyObject(items)) {
			nextItems = {};

			for (key in items) {
				if (items.hasOwnProperty(key)) {
					famItem = items[key];

					if (famItem.level == null) {
						famItem.level = level;
					}

					logicalFamily.loopChildren(this, key, function (childItem, childFamItem, levelIndex) {
						if (levelIndex > 0) {
							return logicalFamily.BREAK;
						}
						if (childFamItem.originalLevel == null || childFamItem.isLevelNeutral) {
							childFamItem.level = childFamItem.level == null ? famItem.level + 1 : Math.max(childFamItem.level, famItem.level + 1);

							nextItems[childItem] = childFamItem;
						} else {
							if (childFamItem.originalLevel == nextOriginalLevel) {
								result = Math.max(result, famItem.level + 1);
							}
						}
					}); //ignore jslint
				}
			}
			items = nextItems;
		}
		return result;
	}

	function fillInItems(logicalFamily, createFamItem) {
		var bundleItem;

		logicalFamily.loop(this, function (famItemId, famItem) {
			var extNeeded = true,
				itemsToBundle;
			while (extNeeded) {
				extNeeded = false;

				/* extend children down */
				itemsToBundle = [];

				logicalFamily.loopParents(this, famItemId, function (parentItemId, parentItem, level) {
					if (famItem.level - 1 > parentItem.level) {
						itemsToBundle.push(parentItemId);
					}
					return logicalFamily.SKIP;
				}); //ignore jslint

				if (itemsToBundle.length > 1) {
					bundleItem = createFamItem(famItem);
					bundleItem.level = famItem.level - 1;

					logicalFamily.bundleParents(famItemId, itemsToBundle, bundleItem.id, bundleItem);

					extNeeded = true;

					famItemId = bundleItem.id;
					famItem = bundleItem;
				}
			}
		});

		logicalFamily.loop(this, function (famItemId, famItem) {
			var extNeeded = true,
				itemsToBundle,
				isSingleExtension = true;
			while (extNeeded) {
				extNeeded = false;

				/* extend children down */
				itemsToBundle = [];

				logicalFamily.loopChildren(this, famItemId, function (childItemId, childItem, level) {
					if (famItem.level + 1 < childItem.level) {
						itemsToBundle.push(childItemId);
					} else {
						isSingleExtension = false;
					}
					return logicalFamily.SKIP;
				}); //ignore jslint

				if (itemsToBundle.length > 0) {
					bundleItem = createFamItem(famItem);
					bundleItem.level = famItem.level + 1;

					if (isSingleExtension) {
						bundleItem.hideParentConnection = famItem.hideChildrenConnection;
						bundleItem.hideChildrenConnection = famItem.hideChildrenConnection;
					}

					logicalFamily.bundleChildren(famItemId, itemsToBundle, bundleItem.id, bundleItem);

					extNeeded = true;

					famItemId = bundleItem.id;
					famItem = bundleItem;
				}
			}
		});
	}

	function validate(logicalFamily, strongValidate) {
		/* test consistency of references in family tree */
		if (!logicalFamily.validate()) {
			throw "Family structure failed to pass validation!";
		}

		logicalFamily.loop(this, function (famItemId, famItem) {

			logicalFamily.loopChildren(this, famItemId, function (childid, child, level) {
				if (level > 0) {
					return logicalFamily.BREAK;
				}
				if (child.level === null || famItem.level === null || (strongValidate ? child.level != famItem.level + 1 : child.level <= famItem.level)) {
					throw "Family tree is broken. Children/Parents or levels mismatch!";
				}
			});
		});
	}

	function getLogicalFamily() {
		return _data.logicalFamily;
	}

	function getMaximumId() {
		return _data.maximumId;
	}

	return {
		process: process,
		getLogicalFamily: getLogicalFamily,
		getMaximumId: getMaximumId
	};
};

/* /Controls/FamDiagram/Tasks/Transformations/OrgTreeTask.js*/
/*  Here is a list of steps this task makes in order to create organizational chart hiararchy:
	1. Extract families into _families array of type FamilyItem. Family is sub tree of items _logicalFamily. 
		In order to extract families out of _logicalFamily we count from bottom to roots total number of descendants for eevry item and then extract 
		sub hierarchy having maximum number of them. This process is repeated till all items are extracted into separate families.
			_orgPartners - When we extract families we store links to parents in other branches having the same children of 
			some already extracted item as partner in _orgPartners hash
		This hash table is used to create links collections between families

		The _orgTree collection is used to define final org hierarchy used to render org chart in base chart controller.
	2. Use links in families to build family graph
	3. Find maximum spanning tree of family graph
	4. Since spanning tree is the tree we calculate number of descendants in every branch. So when we join families into one 
		org chart we sort them taking first child family having maximum number of links to its parent family
		sortedFamilies collection
	5. Using sortedFamilies collection we merge roots of families back to primary org chart. The rule of that backword merging is 
		to find ancestor in target tree having level less then root item of merged family.
		this is done without extra collection creation via making changes in 
			_orgTree
		If family has no links it is added to root of _orgTree
	6. Balance organizational chart in order to place items having extra connections close to each other. 
		Assign every extra link to every pair of parent nodes up to the root.
	7. Scan _orgTree hierarchy from root to bottom and balance children using extra links collected from children
		So at the top most level we know number of links between children, so we sort them, then number of overlappings between branches should be minimal
		Balancing algorithms finds maximum spanning tree in connections between children and groups them from bottom of that tree up to the root
		In the way when groups having maximum mutual links placed close to each other.
*/
chartDiag.famChart.OrgTreeTask = function (normalizeLogicalFamilyTask, defaultItemConfig) {
	var _data = {
		orgTree: null, /*tree chartDiag.orgChart.OrgItem */
		maximumId: null, /* maximum of OrgItem.id */
		orgPartners: null /* Creates extra partners collection of relations between visual tree items
		They are used to draw connectors between items in different branches of organizational chart*/
	},
	_itemByChildrenKey = {},
	_minimumLevel,
	_maximumLevel,
	_properties = [
		'title', 'description', 'image',
		'itemTitleColor', 'groupTitle', 'groupTitleColor',
		'isActive', 'hasSelectorCheckbox', 'hasButtons',
		'templateName', 'showCallout', 'calloutTemplateName',
		'label', 'showLabel', 'labelSize', 'labelOrientation', 'labelPlacement',
		'minimizedItemShapeType'
	];

	function process() {
		var logicalFamily = normalizeLogicalFamilyTask.getLogicalFamily();

		logicalFamily = logicalFamily.clone();

		_data.orgTree = chartDiag.default.tree();
		_data.maximumId = normalizeLogicalFamilyTask.getMaximumId();
		_data.orgPartners = {};

		_itemByChildrenKey = {};
		_minimumLevel = null;
		_maximumLevel = null;

		createOrgTree(logicalFamily);

		return true;
	}

	function createOrgTree(logicalFamily) {
		var index, len, index2, len2,
			famItem,
			familiesGraph, /* chartDiag.default.graph */
			link, links,
			fromFamily,
			toFamily,
			sortedFamilies = [], sortedFamiliesHash,
			attachedFamilies,
			userItem,
			familyId,
			family,
			familyRootItem,
			fromItem,
			toItem,
			rootItem, rootItems, bestRootItem, bestReference,
			spanningTree,
			extraGravities, grandChildren,
			parsedId,
			itemsHavingSpouses, spouses,
			orgItemRoot,
			famItemsExtracted,
			families = [],
			families2;

		if (logicalFamily.hasNodes() > 0) {
			/* create hash of extracted family items */
			famItemsExtracted = {};

			familyId = 0;
			families2 = [];
			logicalFamily.loopRoots(this, function (grandParentId, grandParent) {
				//ignore jslint
				family = new chartDiag.famChart.Family(familyId);
				/* _extractOrgChart method extracts hiearchy of family members starting from grandParent and takes only non extracted family items 
				 * For every extracted item it assigns its familyId, it is used for building families relations graph and finding cross family links
				*/
				extractOrgChart(grandParentId, logicalFamily, famItemsExtracted, family);
				families.push(family);
				families2.push(family);
				familyId += 1;
			});

			families2.sort(function (a, b) {
				/* sort families by root item level ASC and size DESC */
				var aLevel = a.items[0].level,
					bLevel = b.items[0].level;

				return aLevel != bLevel ? (aLevel - bLevel) : (b.items.length - a.items.length);
			});

			sortedFamilies = [];
			sortedFamiliesHash = {};
			if (families.length > 0) {

				/* Build families graph */
				familiesGraph = chartDiag.default.graph();
				for (index = 0, len = families.length; index < len; index += 1) {
					family = families[index];

					for (index2 = 0, len2 = family.links.length; index2 < len2; index2 += 1) {
						link = family.links[index2];

						fromFamily = logicalFamily.node(link.fromItem).familyId;
						toFamily = logicalFamily.node(link.toItem).familyId;

						if (fromFamily != toFamily) {
							familiesGraph.addEdge(fromFamily, toFamily, { weight: 0 });
							familiesGraph.edge(fromFamily, toFamily).weight += 1;
						}

						families[toFamily].backLinks.push(new chartDiag.famChart.FamLink(link.toItem, link.fromItem));
					}
				}

				/* Flatten families graph into array for merging */
				while (sortedFamilies.length < families.length) {
					for (index = 0, len = families2.length; index < len; index += 1) {
						family = families2[index];

						if (!sortedFamiliesHash.hasOwnProperty(family.id)) {

							/* find maximum spanning tree of families graph*/
							spanningTree = familiesGraph.getSpanningTree(family.id, function (a, b) {
								return a.weight - b.weight;
							}); //ignore jslint

							if (spanningTree.node(family.id) != null) {

								/* count number of sub families for every family in spanning tree and sorts child families desc*/
								spanningTree.loopPostOrder(this, function (nodeid, node, parentid, parent) {
									var family = families[nodeid],
										parentFamily = families[parentid],
										children = [];

									if (parentid != null) {
										parentFamily.familyPriority = parentFamily.familyPriority + family.familyPriority;
									}

									children = [];
									spanningTree.loopChildren(this, nodeid, function (childid, child, index) {
										children.push(childid);
									});

									children.sort(function (a, b) { return families[a].familyPriority - families[b].familyPriority; });
									spanningTree.arrangeChildren(nodeid, children);
								}); //ignore jslint

								/* merge tree items in pre order sequence */
								spanningTree.loopPreOrder(this, function (familyid, node) {
									sortedFamilies.push(familyid);
									sortedFamiliesHash[familyid] = true;
								}); //ignore jslint

							} else {
								/* family has no links to any other family so we add it as orphant */
								sortedFamilies.push(family.id);
								sortedFamiliesHash[family.id] = true;
							}
						}
					}
				}
			}

			/* create chart root */
			_data.maximumId += 1;
			orgItemRoot = createOrgItem(_data.maximumId, null /*parent id*/, null, _minimumLevel - 1, null /* userItem */);
			orgItemRoot.hideParentConnection = true;
			orgItemRoot.hideChildrenConnection = true;
			orgItemRoot.title = "internal root";
			orgItemRoot.isVisible = false;
			orgItemRoot.isActive = false;
			orgItemRoot.childIndex = 0;


			/* Place family roots to organizational chart */
			attachedFamilies = {};
			for (index = 0, len = sortedFamilies.length; index < len; index += 1) {
				family = families[sortedFamilies[index]];

				rootItems = {}; // Hash where key = rootItem.id and value is number of references
				bestRootItem = orgItemRoot;
				bestReference = 0;
				links = family.links.concat(family.backLinks);
				for (index2 = 0; index2 < links.length; index2 += 1) {
					link = links[index2];

					toItem = _data.orgTree.node(link.toItem);
					fromItem = _data.orgTree.node(link.fromItem);

					if (attachedFamilies[toItem.familyId] === true) {
						familyRootItem = family.items[0];
						rootItem = toItem;

						if (rootItem.level >= familyRootItem.level) {
							_data.orgTree.loopParents(this, rootItem.id, function (nodeid, node) {
								rootItem = node;
								if (node.level < familyRootItem.level) {
									return true;
								}
							});//ignore jslint
						}

						if (rootItems.hasOwnProperty(rootItem.id)) {
							rootItems[rootItem.id] += 1;
						} else {
							rootItems[rootItem.id] = 1;
						}
						/* family may be nested to multiple places, so we select root item having maximum connections with our new sub family */
						if (bestReference < rootItems[rootItem.id]) {
							bestRootItem = rootItem;
							bestReference = rootItems[rootItem.id];
						}
					}


				}

				attachFamilyToOrgChart(bestRootItem, family);

				attachedFamilies[family.id] = true;
			}

			/* balance organizational chart in order to place items having extra connections close to each other */
			extraGravities = getExtraGravity();

			/* count number of vertical connections for every item */
			grandChildren = getGrandChildren();

			/* scan _orgTree hierarchy from root to bottom and balance its children */
			balanceOrgTree(_data.orgTree, extraGravities, grandChildren);
		}
	}

	function getGrandChildren() {
		var result = {};  /* Key = chartDiag.orgChart.OrgItem.id, Value= Hash {} having Key = level and Value = number of grand children*/

		_data.orgTree.loopPostOrder(this, function (itemId, orgItem, parentId, parent) {
			var level;

			_minimumLevel = _minimumLevel != null ? Math.min(_minimumLevel, orgItem.level) : orgItem.level;
			_maximumLevel = _maximumLevel != null ? Math.max(_maximumLevel, orgItem.level) : orgItem.level;

			if (parentId != null) {
				if (!result[parentId]) {
					result[parentId] = {};
				}

				level = orgItem.level - 1; /* project children qty to parent level, it is needed to match cross hierarchy connectors levels*/
				if (!result[parentId][level]) {
					result[parentId][level] = 1;
				} else {
					result[parentId][level] += 1;
				}

				if (result[itemId] != null) {
					for (level in result[itemId]) {
						if (result[itemId].hasOwnProperty(level)) {
							if (!result[parentId][level]) {
								result[parentId][level] = result[itemId][level];
							} else {
								result[parentId][level] += result[itemId][level];
							}
						}
					}
				}
			}
		});

		return result;
	}

	function balanceOrgTree(orgTree, extraGravities, grandChildren) {
		var index2, len2,
			index3, len3,
			extraGravity,
			childExtraGravities,
			sortedChildren,
			subChildren, subOrgItem,
			leftId = '__left__',
			rightId = '__right__',
			levelExtraGravities,
			sequence;

		orgTree.loopLevels(this, function (parentOrgItemId, parentOrgItem, levelid) {
			var graph = chartDiag.default.graph(),
				graphGravities = {},
				firstOrgItem = null,
				toItemId;
			/* build gravities graph for children */
			sortedChildren = [];
			orgTree.loopChildren(this, parentOrgItem.id, function (childOrgItemId, childOrgItem, index) {
				var levelKey;
				if (firstOrgItem == null) {
					firstOrgItem = childOrgItem;
				}

				graphGravities[childOrgItem.id] = {};
				if (extraGravities.hasOwnProperty(childOrgItem.id)) {
					childExtraGravities = extraGravities[childOrgItem.id];

					for (levelKey in childExtraGravities) {
						if (childExtraGravities.hasOwnProperty(levelKey)) {
							levelExtraGravities = childExtraGravities[levelKey];

							graphGravities[childOrgItem.id][levelKey] = {};
							for (index2 = 0, len2 = levelExtraGravities.length; index2 < len2; index2 += 1) {
								extraGravity = levelExtraGravities[index2];

								if (extraGravity.commonParent == parentOrgItem.id) {
									/* this is link between two children */
									toItemId = extraGravity.toParent;
								} else {
									/* this is external link on left or on right side, we create virtual graph item ids for external links */
									if (orgTree.node(extraGravity.fromParent).childIndex < orgTree.node(extraGravity.toParent).childIndex) {
										toItemId = rightId;
									} else {
										toItemId = leftId;
									}
								}

								/* add connection to graph */
								if (childOrgItem.id != toItemId) {
									graph.addEdge(childOrgItem.id, toItemId, { weight: 0 });
									graph.edge(childOrgItem.id, toItemId).weight += 1.0;

									if (graphGravities[childOrgItem.id][levelKey][toItemId] == null) {
										graphGravities[childOrgItem.id][levelKey][toItemId] = 0;
									}
									graphGravities[childOrgItem.id][levelKey][toItemId] += 1;
								}
							}
						}
					}
				}
				/* add extra zero connection to graph when child org item has no connections
					it is connected to the first item in the graph with zero link
				*/
				if (index > 0) {
					graph.addEdge(childOrgItem.id, firstOrgItem.id, { weight: 0 });
				}
			});

			if (firstOrgItem != null) {
				/* sort items in graph from the most connected to the least */
				sequence = graph.getGrowthSequence(function (a) {
					return a.weight;
				}); //ignore jslint

				if (sequence.length === 0) {
					sequence = [firstOrgItem.id];
				}

				/* sort children from top to down */
				subChildren = balanceItems(sequence, leftId, rightId, graphGravities, grandChildren);

				/* save items indexes for further use */
				for (index3 = 0, len3 = subChildren.length; index3 < len3; index3 += 1) {
					subOrgItem = orgTree.node(subChildren[index3]);

					subOrgItem.childIndex = index3;

					sortedChildren.push(subOrgItem.id);
				}
			}
			orgTree.arrangeChildren(parentOrgItem.id, sortedChildren);
		});
	}

	function balanceItems(sequence, leftId, rightId, graphGravities, grandChildren) {
		var result = [],
		index,
		slots, position,
		itemid,
		bestSlot, bestSlotValue, bestSlotDistance, bestSlotBalance, bestSlotCrossings,
		slotValue, slotDistance, slotBalance, slotCrossings,
		itemGrandChildren,
		cloneSlot, itemSlot,
		level, levelGravities, toItemId, toItemSlot;

		slots = new chartDiag.famChart.Slots();
		slots.add(new chartDiag.famChart.Slot(leftId));
		slots.add(new chartDiag.famChart.Slot(null)); /* first empty slot */
		slots.add(new chartDiag.famChart.Slot(rightId));

		/* set initital positions */
		position = 0;
		slots.loop(function (slot) {
			position += 1;
			slot.position = position;
		});

		for (index = 0; index < sequence.length; index += 1) {
			itemid = sequence[index];

			/* ignore left and right margin */
			if (itemid != leftId && itemid != rightId) {

				bestSlot = null;
				bestSlotValue = null;
				bestSlotDistance = null;
				bestSlotBalance = null;
				bestSlotCrossings = null;
				slots.loop(function (slot) {
					var level, toItemId,
						levelGravities,
						toItemSlot;

					if (slot.itemId == null) {
						itemGrandChildren = grandChildren[itemid];
						slotValue = 0;
						slotDistance = 0;
						slotBalance = 0;
						slotCrossings = 0;

						for (level in slot.crossings) {
							if (slot.crossings.hasOwnProperty(level)) {
								if (itemGrandChildren && itemGrandChildren[level] != null) {
									slotValue += slot.crossings[level] * itemGrandChildren[level];
								}
								slotCrossings += slot.crossings[level];
							}
						}
						for (level in graphGravities[itemid]) {
							if (graphGravities[itemid].hasOwnProperty(level)) {
								levelGravities = graphGravities[itemid][level];
								for (toItemId in levelGravities) {
									if (levelGravities.hasOwnProperty(toItemId)) {
										toItemSlot = slots.getSlot(toItemId);
										if (toItemSlot != null) {
											if (toItemSlot.position < slot.position) {
												/* on the left side */
												slotValue += ((slot.left[level] || 0.0) - (toItemSlot.left[level] || 0.0));
												slotBalance += Math.abs(toItemSlot.balance + 1);
											} else {
												/* on the right side */
												slotValue += ((slot.right[level] || 0.0) - (toItemSlot.right[level] || 0.0));
												slotBalance += Math.abs(toItemSlot.balance - 1);
											}
											slotDistance += Math.abs(toItemSlot.position - slot.position);
										}
									}
								}
							}
						}

						if (bestSlotValue == null ||
							bestSlotValue > slotValue ||
								(bestSlotValue == slotValue &&
									(bestSlotDistance > slotDistance ||
										(bestSlotDistance == slotDistance &&
											(bestSlotBalance > slotBalance ||
													(bestSlotBalance == slotBalance && bestSlotCrossings > slotCrossings)
											)
										)
									)
								)
							) {
							bestSlotValue = slotValue;
							bestSlot = slot;
							bestSlotDistance = slotDistance;
							bestSlotBalance = slotBalance;
							bestSlotCrossings = slotCrossings;
						}
					}
				}); //ignore jslint

				/* insert item into found slot*/
				cloneSlot = bestSlot.clone();
				itemSlot = bestSlot.clone();

				itemSlot.itemId = itemid;

				slots.insertBefore(bestSlot, cloneSlot);
				slots.insertBefore(bestSlot, itemSlot);

				/* add new item grand children qty to all slots to their grand totals for right & left sides */
				itemSlot.position = 0;
				position = 0;
				slots.loop(function (slot) {
					var level, itemGrandChildren;
					if (slot.id != itemSlot.id) {
						itemGrandChildren = grandChildren[itemid];
						for (level in itemGrandChildren) {
							if (itemGrandChildren.hasOwnProperty(level)) {
								if (!slot.left[level]) {
									slot.left[level] = itemGrandChildren[level];
								} else {
									slot.left[level] += itemGrandChildren[level];
								}
							}
						}
						position += 1;
						slot.position = position;
					}
				}, itemSlot); //ignore jslint

				position = 0;
				slots.backwardLoop(function (slot) {
					var level, itemGrandChildren;
					if (slot.id != itemSlot.id) {
						itemGrandChildren = grandChildren[itemid];
						for (level in grandChildren[itemid]) {
							if (grandChildren[itemid].hasOwnProperty(level)) {
								if (!slot.right[level]) {
									slot.right[level] = itemGrandChildren[level];
								} else {
									slot.right[level] += itemGrandChildren[level];
								}
							}
						}
						position -= 1;
						slot.position = position;
					}
				}, itemSlot); //ignore jslint

				/* add crossings */
				for (level in graphGravities[itemid]) {
					if (graphGravities[itemid].hasOwnProperty(level)) {
						levelGravities = graphGravities[itemid][level];
						for (toItemId in levelGravities) {
							if (levelGravities.hasOwnProperty(toItemId)) {
								toItemSlot = slots.getSlot(toItemId);
								if (toItemSlot != null) {
									if (toItemSlot.position < 0) {
										/* on the left side */
										toItemSlot.balance += 1;
										itemSlot.balance -= 1;
										slots.backwardLoop(function (slot) {
											if (slot.id != itemSlot.id) {
												if (slot.id != toItemSlot.id) {
													if (!slot.crossings[level]) {
														slot.crossings[level] = levelGravities[toItemId];
													} else {
														slot.crossings[level] += levelGravities[toItemId];
													}
												} else {
													return true;
												}
											}
										}, itemSlot); //ignore jslint
									} else {
										/* on the right side */
										toItemSlot.balance -= 1;
										itemSlot.balance += 1;
										slots.loop(function (slot) {
											if (slot.id != itemSlot.id) {
												if (slot.id != toItemSlot.id) {
													if (!slot.crossings[level]) {
														slot.crossings[level] = levelGravities[toItemId];
													} else {
														slot.crossings[level] += levelGravities[toItemId];
													}
												} else {
													return true;
												}
											}
										}, itemSlot); //ignore jslint
									}
								}
							}
						}
					}
				}
			}
		}

		slots.loop(function (slot) {
			var itemId = slot.itemId;
			if (itemId != null && itemId != leftId && itemId != rightId) {
				result.push(itemId);
			}
		});

		return result;
	}


	function getExtraGravity() {
		var orgItemId, orgItem,
			result = {}, /* Key = chartDiag.orgChart.OrgItem.id, Value= Hash {} having Key = level and Value = [] array of chartDiag.famChart.ExtraGravity objects*/
			index, len,
			extraPartners, extraPartner;

		/* collect gravities for extra partners */
		for (orgItemId in _data.orgPartners) {
			if (_data.orgPartners.hasOwnProperty(orgItemId)) {
				orgItem = _data.orgTree.node(orgItemId);
				extraPartners = _data.orgPartners[orgItemId];

				for (index = 0, len = extraPartners.length; index < len; index += 1) {
					extraPartner = _data.orgTree.node(extraPartners[index]);

					addExtraGravitiesForConnection(result, extraPartner, orgItem);
				}
			}
		}

		return result;
	}

	function addExtraGravitiesForConnection(extraGravities, fromItem, toItem) {
		var extraGravityFrom = new chartDiag.famChart.ExtraGravity(fromItem.level),
			extraGravityTo = new chartDiag.famChart.ExtraGravity(toItem.level);

		/* find common parent for evry child and orgItem and create connector for evey parent in selection path */
		_data.orgTree.zipUp(this, fromItem.id, toItem.id, function (fromItemId, parentFromItemId, toItemId, parentToItemId) {
			/* all parent items in chain up to the common root share the same gravity object for one connector */
			addExtraGravityForItem(extraGravities, fromItemId, extraGravityFrom);
			addExtraGravityForItem(extraGravities, toItemId, extraGravityTo);

			/* initialize gravity objects */
			if (parentFromItemId == parentToItemId) {
				extraGravityFrom.commonParent = parentFromItemId;
				extraGravityFrom.fromParent = fromItemId;
				extraGravityFrom.toParent = toItemId;

				extraGravityTo.commonParent = parentFromItemId;
				extraGravityTo.fromParent = toItemId;
				extraGravityTo.toParent = fromItemId;

				return true;
			}
		});
	}

	function addExtraGravityForItem(extraGravities, id, extraGravity) {
		if (!extraGravities.hasOwnProperty(id)) {
			extraGravities[id] = {};
		}
		if (extraGravities[id][extraGravity.level] == null) {
			extraGravities[id][extraGravity.level] = [];
		}
		extraGravities[id][extraGravity.level].push(extraGravity);
	}

	function attachFamilyToOrgChart(parent, family) {
		var levelIndex,
			familyRoot = family.items[0],
			newOrgItem = null,
			rootItem = parent;

		// fill in levels between parent and family root with invisible items
		for (levelIndex = parent.level + 1; levelIndex < familyRoot.level; levelIndex += 1) {
			_data.maximumId += 1;
			newOrgItem = createOrgItem(_data.maximumId, rootItem.id, null, levelIndex, null /* userItem */);
			newOrgItem.title = "shift";
			newOrgItem.isVisible = false;
			newOrgItem.isActive = false;
			newOrgItem.hideParentConnection = true;
			newOrgItem.hideChildrenConnection = true;
			family.items.push(newOrgItem);

			rootItem = newOrgItem;
		}

		// attach family root 
		familyRoot.hideParentConnection = true;
		_data.orgTree.adopt(rootItem.id, familyRoot.id, familyRoot);
	}

	function extractOrgChart(grandParentId, logicalFamily, famItemsExtracted, family) {
		var index, len,
			children = [], tempChildren,
			childItem,
			rootItem = null,
			newOrgItem,
			grandParent = logicalFamily.node(grandParentId);

		/* extract root item */
		newOrgItem = createOrgItem(grandParent.id, rootItem, family.id, grandParent.level, grandParent.itemConfig);
		newOrgItem.hideParentConnection = true;
		newOrgItem.isVisible = grandParent.isVisible;
		newOrgItem.isActive = grandParent.isActive;
		newOrgItem.hideParentConnection = grandParent.hideParentConnection;
		newOrgItem.hideChildrenConnection = grandParent.hideChildrenConnection;
		family.items.push(newOrgItem);

		famItemsExtracted[grandParent.id] = true;
		grandParent.familyId = family.id;

		/* extract its children */
		children = extractChildren(grandParent, logicalFamily, famItemsExtracted, family);

		while (children.length > 0) {
			tempChildren = [];
			for (index = 0, len = children.length; index < len; index += 1) {
				childItem = children[index];
				tempChildren = tempChildren.concat(extractChildren(childItem, logicalFamily, famItemsExtracted, family));
			}

			children = tempChildren;
		}
	}

	function extractChildren(parentItem, logicalFamily, famItemsExtracted, family) {
		var result = [],
			itemByChildrenKey = {},
			firstChild = null,
			partnerItem = null,
			newOrgItem;

		if (logicalFamily.countChildren(parentItem.id) == 1) {
			firstChild = logicalFamily.firstChild(parentItem.id);
		}

		if (_itemByChildrenKey[firstChild] != null) {
			/* all children already extracted */
			partnerItem = _itemByChildrenKey[firstChild];

			if (_data.orgPartners[partnerItem.id] == null) {
				_data.orgPartners[partnerItem.id] = [];
			}
			_data.orgPartners[partnerItem.id].push(parentItem.id);

			family.links.push(new chartDiag.famChart.FamLink(parentItem.id, firstChild));
		} else {
			if (firstChild != null) {
				_itemByChildrenKey[firstChild] = parentItem;
			}

			logicalFamily.loopChildren(this, parentItem.id, function (childid, childItem, levelIndex) {
				var firstChild = null;

				if (!famItemsExtracted[childItem.id]) {

					if (logicalFamily.countChildren(childid) == 1) {
						firstChild = logicalFamily.firstChild(childid);
					}

					if (itemByChildrenKey[firstChild] != null) {
						/* child item has the same children as other child in parentItem children collection
							in organizational chart they are displayed as partners sharing children*/
						newOrgItem = createOrgItem(childItem.id, itemByChildrenKey[firstChild].id, family.id, childItem.level, childItem.itemConfig);
						newOrgItem.itemType = 6/*chartDiag.orgChart.ItemType.GeneralPartner*/;
					} else {
						if (firstChild != null) {
							itemByChildrenKey[firstChild] = childItem;
						}
						result.push(childItem);

						newOrgItem = createOrgItem(childItem.id, parentItem.id, family.id, childItem.level, childItem.itemConfig);
					}

					newOrgItem.hideParentConnection = childItem.hideParentConnection;
					newOrgItem.hideChildrenConnection = childItem.hideChildrenConnection;
					newOrgItem.isVisible = childItem.isVisible;
					newOrgItem.isActive = childItem.isActive;
					family.items.push(newOrgItem);

					famItemsExtracted[childItem.id] = true;

					childItem.familyId = family.id;
				}
				return logicalFamily.SKIP;
			});
		}
		return result;
	}

	function createOrgItem(id, parentId, familyId, level, userItem) {
		var orgItem = new chartDiag.orgChart.OrgItem({}),
			index, len,
			property;

		// OrgItem id coinsides with ItemConfig id since we don't add any new org items to user's org chart definition
		orgItem.id = id;
		orgItem.familyId = familyId;
		orgItem.level = level;

		for (index = 0, len = _properties.length; index < len; index += 1) {
			property = _properties[index];

			orgItem[property] = (userItem != null && userItem[property] !== undefined) ? userItem[property] : defaultItemConfig[property];
		}
		_data.orgTree.add(parentId, orgItem.id, orgItem);

		return orgItem;
	}

	function getOrgTree() {
		return _data.orgTree;
	}

	function getMaximumId() {
		return _data.maximumId;
	}

	function getOrgPartners(treeItemId) {
		return _data.orgPartners[treeItemId] || []; /* key: chartDiag.orgChart.OrgItem.id value: array of chartDiag.orgChart.OrgItem.id */
	}

	return {
		process: process,
		getOrgTree: getOrgTree,
		getMaximumId: getMaximumId,
		getOrgPartners: getOrgPartners
	};
};

/* /Controls/FamDiagram/Tasks/Transformations/RemoveLoopsTask.js*/
chartDiag.famChart.RemoveLoopsTask = function (itemsOptionTask, addLabelAnnotationsTask) {
	var _data = {
		logicalFamily: null,
		maximumId: null
	};

	function process(debug) {
		var logicalFamily = addLabelAnnotationsTask.getNavigationFamily(),
			maximumId = addLabelAnnotationsTask.getMaximumId(),
			items = itemsOptionTask.getItems();

		logicalFamily = logicalFamily.clone();

		maximumId = removeLoops(items, logicalFamily, maximumId, debug);

		_data.logicalFamily = logicalFamily;
		_data.maximumId = maximumId;

		if (debug && !logicalFamily.validate()) {
			throw "References are broken in family structure!";
		}

		return true;
	}

	function removeLoops(items, logicalFamily, maximumId, debug) {
		var tempFamily, fakeChild, fakeParent,
			index, len,
			index2, len2,
			nodesToRemove,
			parents,
			userItem;

		tempFamily = logicalFamily.clone();
		logicalFamily.loopTopo(this, function (itemid, item, levelIndex) {
			tempFamily.removeNode(itemid);
		});

		if (tempFamily.hasNodes()) {
			/* remove parents of the first remaining item in user order*/
			for (index = 0, len = items.length; index < len; index += 1) {
				userItem = items[index];

				if (tempFamily.node(userItem.id) != null) {

					parents = [];
					tempFamily.loopParents(this, userItem.id, function (parentid, parent, level) {
						parents.push(parentid);
						return tempFamily.SKIP;
					}); //ignore jslint

					for (index2 = 0, len2 = parents.length; index2 < len2; index2 += 1) {
						/* remove relation in temp structure */
						tempFamily.removeRelation(parents[index2], userItem.id);

						/* reverse relation in actual structure*/
						logicalFamily.removeRelation(parents[index2], userItem.id);
					}

					/* create fake parent and child items to loop item to its parent */
					maximumId += 1;

					/* add fake parent */
					fakeParent = new chartDiag.famChart.FamilyItem({
						id: maximumId,
						isVisible: false,
						isActive: true,
						isLevelNeutral: true,
						hideParentConnection: true,
						hideChildrenConnection: true,
						itemConfig: { title: "fake parent #" + maximumId, description: "This is fake parent item was created by loops reversal." }
					});

					logicalFamily.add([], fakeParent.id, fakeParent);
					logicalFamily.adopt([fakeParent.id], userItem.id);

					for (index2 = 0, len2 = parents.length; index2 < len2; index2 += 1) {
						maximumId += 1;

						/* add fake child */
						fakeChild = new chartDiag.famChart.FamilyItem({
							id: maximumId,
							isVisible: false,
							isActive: true,
							isLevelNeutral: true,
							hideParentConnection: true,
							hideChildrenConnection: true,
							itemConfig: { title: "fake child #" + maximumId, description: "This is fake child item was created by loops reversal." }
						});

						logicalFamily.add([fakeParent.id, parents[index2]], fakeChild.id, fakeChild);
					}


					/* loop is broken, so continue items removable in topological order */
					nodesToRemove = [];
					tempFamily.loopTopo(this, function (itemid, item, levelIndex) {
						nodesToRemove.push(itemid);
					}); //ignore jslint
					for (index2 = 0, len2 = nodesToRemove.length; index2 < len2; index2 += 1) {
						tempFamily.removeNode(nodesToRemove[index2]);
					}
				}
			}
		}
		return maximumId;
	}

	function getLogicalFamily() {
		return _data.logicalFamily;
	}

	function getMaximumId() {
		return _data.maximumId;
	}

	return {
		process: process,
		getLogicalFamily: getLogicalFamily,
		getMaximumId: getMaximumId
	};
};

/* /Controls/FamDiagram/Templates/LabelAnnotationTemplate.js*/
chartDiag.default.LabelAnnotationTemplate = function () {
	var _template = create(),
		_hashCode = chartDiag.default.hashCode(_template);

	function create() {
		var template = jQuery('<div class="bp-label-annotation"></div>');
		template.addClass("bp-item");

		return template.wrap('<div>').parent().html();
	}

	function template() {
		return _template;
	}

	function getHashCode() {
		return _hashCode;
	}

	function render(event, data) {
		var itemConfig = data.context;
		data.element.text(itemConfig.title);
	}

	return {
		template: template,
		getHashCode: getHashCode,
		render: render
	};
};

/* /Controls/FamDiagram/Control.js*/
chartDiag.famChart.Control = function (element, options) {
	
	function createTaskManager(getOptions, getGraphics, getLayout) {
		var tasks = new chartDiag.default.TaskManager();

		// Dependencies
		tasks.addDependency('options', getOptions);
		tasks.addDependency('graphics', getGraphics);
		tasks.addDependency('layout', getLayout);

		tasks.addDependency('defaultConfig', new chartDiag.famChart.Config());
		tasks.addDependency('defaultItemConfig', new chartDiag.famChart.ItemConfig());
		tasks.addDependency('defaultTemplateConfig', new chartDiag.famChart.TemplateConfig());
		tasks.addDependency('defaultButtonConfig', new chartDiag.famChart.ButtonConfig());
		tasks.addDependency('defaultPaletteItemConfig', new chartDiag.famChart.PaletteItemConfig());

		tasks.addDependency('defaultBackgroundAnnotationConfig', new chartDiag.famChart.BackgroundAnnotationConfig());
		tasks.addDependency('defaultConnectorAnnotationConfig', new chartDiag.famChart.ConnectorAnnotationConfig());
		tasks.addDependency('defaultHighlightPathAnnotationConfig', new chartDiag.famChart.HighlightPathAnnotationConfig());
		tasks.addDependency('defaultShapeAnnotationConfig', new chartDiag.famChart.ShapeAnnotationConfig());
		tasks.addDependency('defaultLabelAnnotationConfig', new chartDiag.famChart.LabelAnnotationConfig());

		tasks.addDependency('isFamilyChartMode', true);/* in regular org diagram we hide branch if it contains only invisible nodes, 
		in the family chart we use invisible items to draw connectors across multiple levels */
		tasks.addDependency('showElbowDots', true);/* in regular org chart we don;t have situations when connector lines cross, but we have such situations in 
		family tree so we need extra visual attribute to distinguish intersections betwen connectors */
		tasks.addDependency('null', null);
		tasks.addDependency('foreground', 2/*chartDiag.default.ZOrderType.Foreground*/);
		tasks.addDependency('background', 1/*chartDiag.default.ZOrderType.Background*/);

		// Options
		tasks.addTask('OptionsTask', ['options'], chartDiag.famChart.OptionsTask, "#000000"/*chartDiag.default.Colors.Black*/);

		// Layout
		tasks.addTask('CurrentControlSizeTask', ['layout', 'OptionsTask', 'ItemsSizesOptionTask'], chartDiag.orgChart.CurrentControlSizeTask, "#000000"/*chartDiag.default.Colors.Black*/);
		tasks.addTask('CurrentScrollPositionTask', ['layout', 'OptionsTask'], chartDiag.orgChart.CurrentScrollPositionTask, "#000000"/*chartDiag.default.Colors.Black*/);

		tasks.addTask('CalloutOptionTask', ['OptionsTask', 'defaultConfig', 'defaultItemConfig'], chartDiag.orgChart.CalloutOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('ConnectorsOptionTask', ['OptionsTask', 'defaultConfig'], chartDiag.orgChart.ConnectorsOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('ItemsOptionTask', ['OptionsTask', 'defaultItemConfig'], chartDiag.famChart.ItemsOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('SpousesOptionTask', ['OptionsTask', 'defaultItemConfig'], chartDiag.famChart.SpousesOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('ItemsSizesOptionTask', ['OptionsTask', 'defaultConfig', 'defaultItemConfig', 'defaultButtonConfig'], chartDiag.orgChart.ItemsSizesOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('LabelsOptionTask', ['OptionsTask', 'defaultConfig', 'defaultItemConfig'], chartDiag.orgChart.LabelsOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('PrintPreviewOptionTask', ['OptionsTask', 'defaultConfig'], chartDiag.orgChart.PrintPreviewOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('TemplatesOptionTask', ['OptionsTask', 'defaultConfig', 'defaultButtonConfig', 'defaultTemplateConfig'], chartDiag.orgChart.TemplatesOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('OrientationOptionTask', ['OptionsTask', 'defaultConfig'], chartDiag.orgChart.OrientationOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('VisualTreeOptionTask', ['OptionsTask'], chartDiag.famChart.VisualTreeOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('MinimizedItemsOptionTask', ['OptionsTask'], chartDiag.orgChart.MinimizedItemsOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('NormalizeOptionTask', ['OptionsTask', 'defaultConfig'], chartDiag.famChart.NormalizeOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('LinePaletteOptionTask', ['OptionsTask', 'defaultPaletteItemConfig'], chartDiag.famChart.LinePaletteOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);

		tasks.addTask('CursorItemOptionTask', ['OptionsTask', 'defaultConfig'], chartDiag.orgChart.CursorItemOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('HighlightItemOptionTask', ['OptionsTask', 'defaultConfig'], chartDiag.orgChart.HighlightItemOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('SelectedItemsOptionTask', ['OptionsTask'], chartDiag.orgChart.SelectedItemsOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('CursorSelectionPathModeOptionTask', ['OptionsTask', 'defaultConfig'], chartDiag.orgChart.CursorSelectionPathModeOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('NeighboursSelectionModeOptionTask', ['OptionsTask', 'defaultConfig'], chartDiag.famChart.NeighboursSelectionModeOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);

		tasks.addTask('SplitAnnotationsOptionTask', ['OptionsTask'], chartDiag.orgChart.SplitAnnotationsOptionTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);

		tasks.addTask('ForegroundShapeAnnotationOptionTask', ['SplitAnnotationsOptionTask', 'defaultShapeAnnotationConfig', 'foreground'], chartDiag.orgChart.ShapeAnnotationOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('BackgroundShapeAnnotationOptionTask', ['SplitAnnotationsOptionTask', 'defaultShapeAnnotationConfig', 'background'], chartDiag.orgChart.ShapeAnnotationOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('HighlightPathAnnotationOptionTask', ['SplitAnnotationsOptionTask', 'defaultConfig', 'defaultHighlightPathAnnotationConfig'], chartDiag.orgChart.HighlightPathAnnotationOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('ForegroundConnectorAnnotationOptionTask', ['SplitAnnotationsOptionTask', 'defaultConnectorAnnotationConfig', 'foreground'], chartDiag.orgChart.ConnectorAnnotationOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('BackgroundConnectorAnnotationOptionTask', ['SplitAnnotationsOptionTask', 'defaultConnectorAnnotationConfig', 'background'], chartDiag.orgChart.ConnectorAnnotationOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('BackgroundAnnotationOptionTask', ['SplitAnnotationsOptionTask', 'defaultBackgroundAnnotationConfig'], chartDiag.orgChart.BackgroundAnnotationOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);

		tasks.addTask('ScaleOptionTask', ['OptionsTask', 'defaultConfig'], chartDiag.orgChart.ScaleOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);

		// Transformations
		tasks.addTask('IntervalsTask', ['ItemsSizesOptionTask'], chartDiag.orgChart.IntervalsTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('LogicalFamilyTask', ['ItemsOptionTask'], chartDiag.famChart.LogicalFamilyTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);

		tasks.addTask('LabelAnnotationOptionTask', ['SplitAnnotationsOptionTask', 'LogicalFamilyTask', 'defaultLabelAnnotationConfig'], chartDiag.famChart.LabelAnnotationOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('LabelAnnotationTemplateOptionTask', ['LabelAnnotationOptionTask', 'defaultLabelAnnotationConfig'], chartDiag.famChart.LabelAnnotationTemplateOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('LabelAnnotationPlacementOptionTask', ['LabelAnnotationOptionTask', 'defaultLabelAnnotationConfig'], chartDiag.famChart.LabelAnnotationPlacementOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);

		tasks.addTask('CombinedContextsTask', ['ItemsOptionTask', 'LabelAnnotationOptionTask'], chartDiag.orgChart.CombinedContextsTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);

		tasks.addTask('AddLabelAnnotationsTask', ['LabelAnnotationPlacementOptionTask', 'LogicalFamilyTask'], chartDiag.famChart.AddLabelAnnotationsTask, "#ff0000"/*chartDiag.default.Colors.Red*/);
		tasks.addTask('RemoveLoopsTask', ['ItemsOptionTask', 'AddLabelAnnotationsTask'], chartDiag.famChart.RemoveLoopsTask, "#ff0000"/*chartDiag.default.Colors.Red*/);
		tasks.addTask('AddSpousesTask', ['SpousesOptionTask', 'RemoveLoopsTask'], chartDiag.famChart.AddSpousesTask, "#ff0000"/*chartDiag.default.Colors.Red*/);
		tasks.addTask('NormalizeLogicalFamilyTask', ['NormalizeOptionTask', 'AddSpousesTask'], chartDiag.famChart.NormalizeLogicalFamilyTask, "#ff0000"/*chartDiag.default.Colors.Red*/);
		tasks.addTask('OrgTreeTask', ['NormalizeLogicalFamilyTask', 'defaultItemConfig'], chartDiag.famChart.OrgTreeTask, "#ff0000"/*chartDiag.default.Colors.Red*/);

		// Transformations / Templates
		tasks.addTask('ReadTemplatesTask', ['TemplatesOptionTask'], chartDiag.orgChart.ReadTemplatesTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('ItemTemplateParamsTask', ['ItemsSizesOptionTask', 'CursorItemOptionTask', 'ReadTemplatesTask'], chartDiag.orgChart.ItemTemplateParamsTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('LabelAnnotationTemplateParamsTask', ['ItemsSizesOptionTask', 'LabelAnnotationTemplateOptionTask', 'ReadTemplatesTask'], chartDiag.famChart.LabelAnnotationTemplateParamsTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('CombinedTemplateParamsTask', ['ItemTemplateParamsTask', 'LabelAnnotationTemplateParamsTask'], chartDiag.famChart.CombinedTemplateParamsTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);

		tasks.addTask('GroupTitleTemplateTask', ['TemplatesOptionTask'], chartDiag.orgChart.GroupTitleTemplateTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('CheckBoxTemplateTask', ['ItemsSizesOptionTask'], chartDiag.orgChart.CheckBoxTemplateTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('ButtonsTemplateTask', ['ItemsSizesOptionTask'], chartDiag.orgChart.ButtonsTemplateTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('AnnotationLabelTemplateTask', ['ItemsOptionTask'], chartDiag.orgChart.AnnotationLabelTemplateTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('PrintPreviewTemplateTask', ['ItemsOptionTask'], chartDiag.orgChart.PrintPreviewTemplateTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);

		tasks.addTask('VisualTreeTask', ['OrgTreeTask', 'CombinedTemplateParamsTask', 'VisualTreeOptionTask', 'isFamilyChartMode'], chartDiag.orgChart.VisualTreeTask, "#ff0000"/*chartDiag.default.Colors.Red*/);
		tasks.addTask('VisualTreeLevelsTask', ['VisualTreeTask', 'CombinedTemplateParamsTask'], chartDiag.orgChart.VisualTreeLevelsTask, "#ff0000"/*chartDiag.default.Colors.Red*/);
		tasks.addTask('VisualTreeMarginsTask', ['VisualTreeTask'], chartDiag.orgChart.VisualTreeMarginsTask, "#ff0000"/*chartDiag.default.Colors.Red*/);

		tasks.addTask('ConnectionsGraphTask', ['VisualTreeTask', 'VisualTreeLevelsTask', 'OrgTreeTask' /*ExtraPartnersTask*/], chartDiag.orgChart.ConnectionsGraphTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('TracePathAnnotationsTask', ['HighlightPathAnnotationOptionTask', 'ConnectionsGraphTask', 'OrgTreeTask', 'VisualTreeTask', 'AddLabelAnnotationsTask'], chartDiag.orgChart.TracePathAnnotationsTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);

		// Transformations/Selections
		tasks.addTask('HighlightItemTask', ['HighlightItemOptionTask', 'OrgTreeTask'], chartDiag.orgChart.HighlightItemTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);

		tasks.addTask('CursorItemTask', ['CursorItemOptionTask', 'OrgTreeTask'], chartDiag.orgChart.CursorItemTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('CursorNeighboursTask', ['CursorItemTask', 'NeighboursSelectionModeOptionTask', 'AddLabelAnnotationsTask', 'OrgTreeTask', 'VisualTreeTask'], chartDiag.famChart.CursorNeighboursTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('SelectedItemsTask', ['SelectedItemsOptionTask'], chartDiag.orgChart.SelectedItemsTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('SelectionPathItemsTask', ['AddLabelAnnotationsTask', 'CursorItemTask', 'SelectedItemsTask', 'CursorSelectionPathModeOptionTask'], chartDiag.orgChart.SelectionPathItemsTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);

		tasks.addTask('NormalVisibilityItemsByForegroundShapeAnnotationTask', ['ForegroundShapeAnnotationOptionTask'], chartDiag.orgChart.NormalVisibilityItemsByAnnotationTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('NormalVisibilityItemsByBackgroundShapeAnnotationTask', ['BackgroundShapeAnnotationOptionTask'], chartDiag.orgChart.NormalVisibilityItemsByAnnotationTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('NormalVisibilityItemsByBackgroundAnnotationTask', ['BackgroundAnnotationOptionTask'], chartDiag.orgChart.NormalVisibilityItemsByAnnotationTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('NormalVisibilityItemsByHighlightPathAnnotationTask', ['HighlightPathAnnotationOptionTask'], chartDiag.orgChart.NormalVisibilityItemsByAnnotationTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('NormalVisibilityItemsByForegroundConnectorAnnotationTask', ['ForegroundConnectorAnnotationOptionTask'], chartDiag.orgChart.NormalVisibilityItemsByConnectorAnnotationTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('NormalVisibilityItemsByBackgroundConnectorAnnotationTask', ['BackgroundConnectorAnnotationOptionTask'], chartDiag.orgChart.NormalVisibilityItemsByConnectorAnnotationTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('CombinedNormalVisibilityItemsTask', [
			'ItemsSizesOptionTask',
			'CursorItemTask',
			'CursorNeighboursTask',
			'SelectedItemsTask',
			'SelectionPathItemsTask',
			'NormalVisibilityItemsByForegroundShapeAnnotationTask',
			'NormalVisibilityItemsByBackgroundShapeAnnotationTask',
			'NormalVisibilityItemsByBackgroundAnnotationTask',
			'NormalVisibilityItemsByHighlightPathAnnotationTask',
			'NormalVisibilityItemsByForegroundConnectorAnnotationTask',
			'NormalVisibilityItemsByBackgroundConnectorAnnotationTask'], chartDiag.orgChart.CombinedNormalVisibilityItemsTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);

		tasks.addTask('ItemsPositionsTask', ['CurrentControlSizeTask', 'ScaleOptionTask', 'OrientationOptionTask', 'ItemsSizesOptionTask', 'ConnectorsOptionTask', 'VisualTreeOptionTask',
			'OrgTreeTask' /*ExtraPartnersTask*/,
			'IntervalsTask', 'VisualTreeTask', 'VisualTreeLevelsTask', 'VisualTreeMarginsTask',
			'CombinedTemplateParamsTask',
			'CursorItemTask', 'CombinedNormalVisibilityItemsTask'], chartDiag.orgChart.ItemsPositionsTask, "#ff0000"/*chartDiag.default.Colors.Red*/);


		
		tasks.addTask('AlignDiagramTask', ['OrientationOptionTask', 'ItemsSizesOptionTask', 'VisualTreeOptionTask', 'ScaleOptionTask', 'PrintPreviewOptionTask', 'CurrentControlSizeTask', 'VisualTreeTask', 'VisualTreeLevelsTask', 'ItemsPositionsTask', 'isFamilyChartMode'], chartDiag.orgChart.AlignDiagramTask, "#ff0000"/*chartDiag.default.Colors.Red*/);
		tasks.addTask('CreateTransformTask', ['OrientationOptionTask', 'AlignDiagramTask'], chartDiag.orgChart.CreateTransformTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('CenterOnCursorTask', ['layout', 'CurrentControlSizeTask', 'CurrentScrollPositionTask', 'CursorItemTask', 'AlignDiagramTask', 'CreateTransformTask', 'ScaleOptionTask'], chartDiag.orgChart.CenterOnCursorTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);

		// Managers
		tasks.addTask('BackgroundAnnotationManagerTask', ['ItemsSizesOptionTask', 'OrgTreeTask', 'VisualTreeLevelsTask', 'AlignDiagramTask'], chartDiag.orgChart.BackgroundAnnotationManagerTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('PaletteManagerTask', ['ConnectorsOptionTask', 'LinePaletteOptionTask'], chartDiag.orgChart.PaletteManagerTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);

		// Apply Layout Changes
		tasks.addTask('ApplyLayoutChangesTask', ['graphics', 'layout', 'ItemsSizesOptionTask', 'PrintPreviewOptionTask', 'CurrentControlSizeTask', 'ScaleOptionTask', 'AlignDiagramTask'], chartDiag.orgChart.ApplyLayoutChangesTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);

		// Renders
		tasks.addTask('DrawBackgroundAnnotationTask', ['graphics', 'CreateTransformTask', 'ApplyLayoutChangesTask', 'BackgroundAnnotationOptionTask', 'AddLabelAnnotationsTask', 'AlignDiagramTask', 'BackgroundAnnotationManagerTask'], chartDiag.orgChart.DrawBackgroundAnnotationTask, "#008000"/*chartDiag.default.Colors.Green*/);
		tasks.addTask('DrawForegroundConnectorAnnotationTask', ['graphics', 'CreateTransformTask', 'ApplyLayoutChangesTask', 'OrientationOptionTask', 'ForegroundConnectorAnnotationOptionTask', 'AlignDiagramTask', 'AnnotationLabelTemplateTask', 'foreground'], chartDiag.orgChart.DrawConnectorAnnotationTask, "#008000"/*chartDiag.default.Colors.Green*/);
		tasks.addTask('DrawBackgroundConnectorAnnotationTask', ['graphics', 'CreateTransformTask', 'ApplyLayoutChangesTask', 'OrientationOptionTask', 'BackgroundConnectorAnnotationOptionTask', 'AlignDiagramTask', 'AnnotationLabelTemplateTask', 'background'], chartDiag.orgChart.DrawConnectorAnnotationTask, "#008000"/*chartDiag.default.Colors.Green*/);
		tasks.addTask('DrawForegroundShapeAnnotationTask', ['graphics', 'CreateTransformTask', 'ApplyLayoutChangesTask', 'OrientationOptionTask', 'ForegroundShapeAnnotationOptionTask', 'AlignDiagramTask', 'AnnotationLabelTemplateTask', 'foreground'], chartDiag.orgChart.DrawShapeAnnotationTask, "#008000"/*chartDiag.default.Colors.Green*/);
		tasks.addTask('DrawBackgroundShapeAnnotationTask', ['graphics', 'CreateTransformTask', 'ApplyLayoutChangesTask', 'OrientationOptionTask', 'BackgroundShapeAnnotationOptionTask', 'AlignDiagramTask', 'AnnotationLabelTemplateTask', 'background'], chartDiag.orgChart.DrawShapeAnnotationTask, "#008000"/*chartDiag.default.Colors.Green*/);

		tasks.addTask('DrawCursorTask', ['graphics', 'CreateTransformTask', 'ApplyLayoutChangesTask', 'CombinedContextsTask', 'AlignDiagramTask', 'CombinedTemplateParamsTask', 'CursorItemTask', 'SelectedItemsTask'], chartDiag.orgChart.DrawCursorTask, "#008000"/*chartDiag.default.Colors.Green*/);
		tasks.addTask('DrawHighlightTask', ['graphics', 'CreateTransformTask', 'ApplyLayoutChangesTask', 'CombinedContextsTask', 'AlignDiagramTask', 'CombinedTemplateParamsTask', 'HighlightItemTask', 'CursorItemTask', 'SelectedItemsTask'], chartDiag.orgChart.DrawHighlightTask, "#008000"/*chartDiag.default.Colors.Green*/);
		tasks.addTask('DrawHighlightAnnotationTask', ['layout', 'graphics', 'CreateTransformTask', 'ApplyLayoutChangesTask', 'ScaleOptionTask', 'CombinedContextsTask', 'CalloutOptionTask', 'ReadTemplatesTask', 'AlignDiagramTask', 'CenterOnCursorTask', 'HighlightItemTask', 'CursorItemTask', 'SelectedItemsTask'], chartDiag.orgChart.DrawHighlightAnnotationTask, "#008000"/*chartDiag.default.Colors.Green*/);

		tasks.addTask('DrawTreeItemsTask', ['graphics', 'CreateTransformTask', 'ApplyLayoutChangesTask',
			'ItemsSizesOptionTask',
			'CombinedContextsTask',
			'VisualTreeTask', 'AlignDiagramTask', 'CombinedTemplateParamsTask',
			'CursorItemTask', 'SelectedItemsTask',
			'GroupTitleTemplateTask', 'CheckBoxTemplateTask', 'ButtonsTemplateTask'
		], chartDiag.orgChart.DrawTreeItemsTask, "#008000"/*chartDiag.default.Colors.Green*/);

		tasks.addTask('DrawMinimizedItemsTask', ['graphics', 'CreateTransformTask', 'ApplyLayoutChangesTask', 'MinimizedItemsOptionTask', 'VisualTreeTask', 'CombinedTemplateParamsTask', 'AlignDiagramTask'], chartDiag.orgChart.DrawMinimizedItemsTask, "#008000"/*chartDiag.default.Colors.Green*/);
		tasks.addTask('DrawConnectorsTask', ['graphics', 'CreateTransformTask', 'ApplyLayoutChangesTask', 'ConnectorsOptionTask', 'VisualTreeTask', 'VisualTreeLevelsTask', 'AlignDiagramTask', 'TracePathAnnotationsTask', 'OrgTreeTask'/*ExtraPartnersTask*/, 'showElbowDots', 'PaletteManagerTask'], chartDiag.orgChart.DrawConnectorsTask, "#008000"/*chartDiag.default.Colors.Green*/);
		tasks.addTask('DrawItemLabelsTask', ['graphics', 'CreateTransformTask', 'ApplyLayoutChangesTask', 'LabelsOptionTask', 'VisualTreeLevelsTask', 'AlignDiagramTask'], chartDiag.orgChart.DrawItemLabelsTask, "#008000"/*chartDiag.default.Colors.Green*/);
		tasks.addTask('DrawPrintPreviewTask', ['graphics', 'ApplyLayoutChangesTask', 'PrintPreviewOptionTask', 'AlignDiagramTask', 'PrintPreviewTemplateTask', 'ScaleOptionTask'], chartDiag.orgChart.DrawPrintPreviewTask, "#008000"/*chartDiag.default.Colors.Green*/);

		return tasks;
	}

	function createEventArgs(data, oldTreeItemId, newTreeItemId, name) {
		var result = new chartDiag.famChart.EventArgs(),
			combinedContextsTask = data.tasks.getTask("CombinedContextsTask"),
			alignDiagramTask = data.tasks.getTask("AlignDiagramTask"),
			navigationFamilyTask = data.tasks.getTask("AddLabelAnnotationsTask"),
			oldItemConfig = combinedContextsTask.getConfig(oldTreeItemId),
			newItemConfig = combinedContextsTask.getConfig(newTreeItemId),
			navigationFamily = navigationFamilyTask.getNavigationFamily(),
			itemPosition,
			offset,
			panelOffset;

		if (oldItemConfig && oldItemConfig.id != null) {
			result.oldContext = oldItemConfig;
		}

		if (newItemConfig && newItemConfig.id != null) {
			result.context = newItemConfig;

			navigationFamily.loopParents(this, newItemConfig.id, function (itemid, item, levelIndex) {
				if (levelIndex > 0) {
					return navigationFamily.BREAK;
				}
				result.parentItems.push(combinedContextsTask.getConfig(itemid));
			});

			panelOffset = data.layout.mousePanel.offset();
			offset = data.layout.element.offset();
			itemPosition = alignDiagramTask.getItemPosition(newTreeItemId);
			result.position = new chartDiag.default.Rect(itemPosition.actualPosition)
					.translate(panelOffset.left, panelOffset.top)
					.translate(-offset.left, -offset.top);
		}

		if (name != null) {
			result.name = name;
		}

		return result;
	}

	return chartDiag.orgChart.BaseControl(element, options, createTaskManager, createEventArgs);
};

/* /Controls/OrgDiagram/Configs/TemplateConfig.js*/
/*
	Class: chartDiag.orgChart.TemplateConfig
		User defines item template class. It may optionaly define template for item, 
		custom cursor and highlight. If template is null then default template is used.

	See Also:
		<chartDiag.orgChart.Config.templates>
*/
chartDiag.orgChart.TemplateConfig = function () {
	/*
	Property: name
		Every template should have unique name. It is used as reference when 
		custom template is defined in <chartDiag.orgChart.ItemConfig.templateName>.
	*/
	this.name = null;

	/*
	Property: isActive
		If it is true then item having this template is selectable in hierarchy and it has mouse over highlight.

	True - Item is clickable.
	False - Item is inactive and user cannot set cursor item or highlight.

	Default:
		true
	*/
	this.isActive = true;

	/*
	Property: itemSize
	This is item size of type <chartDiag.default.Size>, templates should have 
	fixed size, so orgDiagram uses this value in order to layout items properly.
	*/
	this.itemSize = new chartDiag.default.Size(120, 100);

	/*
	Property: itemBorderWidth
		Item template border width.
	*/
	this.itemBorderWidth = 1;

	/*
	Property: itemTemplate
	Item template, if it is null then default item template is used. It supposed 
	to be div html element containing named elements inside for setting them 
	in <chartDiag.orgChart.Config.onItemRender> event.
	*/
	this.itemTemplate = null;

	/*
		Property: minimizedItemShapeType
			Defines minimized item shape. The border line width is set with <chartDiag.orgChart.TemplateConfig.minimizedItemBorderWidth>
			By default minimized item is rounded rectangle filled with item title color.


		See also:
			<chartDiag.orgChart.TemplateConfig.minimizedItemCornerRadius>
			<chartDiag.orgChart.ItemConfig.itemTitleColor>
			<chartDiag.orgChart.ItemConfig.minimizedItemShapeType>

		Default:
			null
	*/
	this.minimizedItemShapeType = null;

	/*
	Property: minimizedItemSize
	This is size dot used to display item in minimized form, type of <chartDiag.default.Size>.
	*/
	this.minimizedItemSize = new chartDiag.default.Size(4, 4);

	/*
	Property: minimizedItemCornerRadius
	Set corner radias for dots in order to display them as squares having rounded corners.
	By default it is null and dots displayed as cycles. If corner radius set to 0 then they are displayed as regular squares.
	*/
	this.minimizedItemCornerRadius = null;

	/*
	Property: minimizedItemLineWidth
		Minimized item shape border width.
	*/
	this.minimizedItemLineWidth = 1;

	/*
	Property: minimizedItemBorderColor
		Minimized item line color. By default it is the same as <chartDiag.orgChart.ItemConfig.itemTitleColor>
	*/
	this.minimizedItemBorderColor = null;

	/*
	Property: minimizedItemLineType
		Minimized item shape border line type.
	*/
	this.minimizedItemLineType = 0/*chartDiag.default.LineType.Solid*/;

	/*
	Property: minimizedItemFillColor
		Minimized item fill color. By default it is the same as <chartDiag.orgChart.ItemConfig.itemTitleColor>
	*/
	this.minimizedItemFillColor = null;

	/*
	Property: minimizedItemOpacity
		Minimized item fill color opacity.
	*/
	this.minimizedItemOpacity = 1;

	/*
	Property: highlightPadding
	This padding around item defines relative size of highlight object, 
	its type is <chartDiag.default.Thickness>.
	*/
	this.highlightPadding = new chartDiag.default.Thickness(2, 2, 2, 2);

	/*
	Property: highlightBorderWidth
		Highlight border width.
	*/
	this.highlightBorderWidth = 1;

	/*
	Property: highlightTemplate
	Highlight template, if it is null then default highlight template is used. 
	It supposed to be div html element containing named elements inside for 
	setting them in <chartDiag.orgChart.Config.onHighlightRender> event.
	*/
	this.highlightTemplate = null;

	/*
	Property: cursorPadding
	This padding around item defines relative size of cursor object, 
	its type is <chartDiag.default.Thickness>.
	*/
	this.cursorPadding = new chartDiag.default.Thickness(3, 3, 3, 3);

	/*
	Property: cursorBorderWidth
		Cursor border width.
	*/
	this.cursorBorderWidth = 2;

	/*
	Property: cursorTemplate
	Cursor template, if it is null then default cursor template is used. 
	It supposed to be div html element containing named elements inside 
	for setting them in <chartDiag.orgChart.Config.onCursorRender> event.
	*/
	this.cursorTemplate = null;

	/*
	Property: buttons
		Custom user buttons displayed on right side of item. This collection provides simple way to define context buttons for every template. 
	
	See also:
		<chartDiag.orgChart.ButtonConfig>
	*/
	this.buttons = null;
};

/* /Controls/OrgDiagram/Configs/BackgroundAnnotationConfig.js*/
/*
	Class: chartDiag.orgChart.BackgroundAnnotationConfig
		Options class. Populate annotation collection with instances of this object to draw background area around items.
		Shape is drawn as eclosed area with perimiter line around. If items cannot share one annotation then it draws as many areas as needed to show backgorund for every item.
		It does not overlap neighboring items. If line width is set then it draws perimiter line as well.
	See Also:
		<chartDiag.orgChart.Config.annotations>
*/
chartDiag.orgChart.BackgroundAnnotationConfig = function (arg0) {
	var property;

	/*
	Property: annotationType
		Annotation type. All various annotations are defined in annotations collection property of <chartDiag.orgChart.Config>. 
		So this property is needed to define annotation type when we use JavaScript non-prototype objects.
		See other annotations as well.

	Default:
		<chartDiag.default.AnnotationType.Background>

	See Also:
		<chartDiag.orgChart.Config.annotations>
		<chartDiag.orgChart.ConnectorAnnotationConfig>
		<chartDiag.orgChart.ShapeAnnotationConfig>
		<chartDiag.orgChart.HighlightPathAnnotationConfig>
	*/
	this.annotationType = 4/*chartDiag.default.AnnotationType.Background*/;

	/*
	Property: items 
		Array of items ids in hierarchy.
	See Also:
		<chartDiag.orgChart.ItemConfig.id>
	*/
	this.items = [];

	/*
	Property: includeChildren
		Include all descendants of every item in items collection. If you add root item then all chart items are going to be added to annotation.

	Default:
		false
	*/
	this.includeChildren = false;

	/*
	Property: zOrderType
		Defines annotation Z order placement relative to chart items. Chart items are drawn in layers on top of each other. We can draw annotations under the items or over them. 
		If you place annotations over items then you block mouse events of UI elements in them. Browsers don't support mouse events transparentcy consistently. 
		So in order to avoid mouse events blocking of UI elements in item templates you have to place annotation items under them.
		Take into account that chart default buttons are drawn on top of everyhting, so they are never blocked by annotations drawn over items.

	Default:
		<chartDiag.default.ZOrderType.Auto>
	*/
	this.zOrderType = 0/*chartDiag.default.ZOrderType.Auto*/;


	/*
	Property: lineWidth
		Border line width. 
	*/
	this.lineWidth = 2;

	/*
	Property: opacity
		Background color opacity. For applicable shapes only.
	*/
	this.opacity = 1;

	/*
	Property: borderColor
		Shape border line color.
	
	Default:
		null
	*/
	this.borderColor = null;

	/*
	Property: fillColor
		Fill Color. 

	Default:
		null
	*/
	this.fillColor = null;

	/*
	Property: lineType
		Connector's line pattern.

	Default:
		<chartDiag.default.LineType.Solid>
	*/
	this.lineType = 0/*chartDiag.default.LineType.Solid*/;

	/*
	Property: selectItems
		Always show annotated items in normal state. Setting this option is equivalent to adding annotated items to collection of selected items.

	Default:
		true

	See Also:
		<chartDiag.orgChart.Config.selectedItems>
	*/
	this.selectItems = false;

	switch (arguments.length) {
		case 1:
			if (arg0 !== null) {
				if (arg0 instanceof Array) {
					this.items = arg0;
				} else if (typeof arg0 == "object") {
					for (property in arg0) {
						if (arg0.hasOwnProperty(property)) {
							this[property] = arg0[property];
						}
					}
				}
			}
			break;
	}
};

/* /Controls/OrgDiagram/Configs/ButtonConfig.js*/
/*
	Class: chartDiag.orgChart.ButtonConfig
		Options class. Custom user button options class. 
		Buttons displayed on the right side of item. 
		See jQuery UI Button options description for details.
		In order to receive button click event make binding 
		to <chartDiag.orgChart.Config.onButtonClick>.
	
	See Also:
		<chartDiag.orgChart.Config.buttons>
*/
chartDiag.orgChart.ButtonConfig = function (name, icon, tooltip) {
	/*
	Property: name 
		It should be unique string name of the button. 
		It is needed to distinguish click events from different butons.
	*/
	this.name = name;

	/*
	Property: icon
	Name of icon used in jQuery UI.
	*/
	this.icon = icon;

	/*
	Property: text
	Whether to show any text -when set to false (display no text), 
	icon must be enabled, otherwise it'll be ignored.
	*/
	this.text = false;

	/*
	Property: label
	Text to show on the button.
	*/
	this.label = null;

	/*
	Property: tooltip
	Button tooltip content.
	*/
	this.tooltip = tooltip;

	/*
	Property: size
	Size of the button of type <chartDiag.default.Size>.
	*/
	this.size = new chartDiag.default.Size(16, 16);
};

/* /Controls/OrgDiagram/Configs/Config.js*/
/*
	Class: chartDiag.orgChart.Config
		jQuery orgDiagram Widget options class. Organizational chart configuration object.
	
*/
chartDiag.orgChart.Config = function (name) {
	this.name = (name !== undefined) ? name : "OrgDiagram";
	this.classPrefix = "orgChart";

	/*
		Property: navigationMode
			Defines control navigation mode. By default control replicates interactivity of regular Tree control. 
			It has highlight for mouse over feedback and it has cursor for showing currently selected single node in diagram.
			In order to avoid creation of plus/minus buttons for children nodes folding and unfolding, 
			this functionality is done automatically for current cursor item. This is especially true for family diagram, 
			because it has no logical root, so cursor plays vital role for unfolding of nodes 
			and zooming into area of user interest in diagram.
			Use this option to disable highlight which does not make sense on touch devices or make control inactive completly.

		See Also:
			<chartDiag.default.NavigationMode>
		Default:
			<chartDiag.default.NavigationMode.Default>
	*/
	this.navigationMode = 0/*chartDiag.default.NavigationMode.Default*/;

	/*
		Property: graphicsType
			Preferable graphics type. If preferred graphics type 
			is not supported widget switches to first available. 

		Default:
			<chartDiag.default.GraphicsType.SVG>
	*/
	this.graphicsType = 0/*chartDiag.default.GraphicsType.SVG*/;

	/*
		Property: actualGraphicsType
			Actual graphics type.
	*/
	this.actualGraphicsType = null;

	/*
		Property: pageFitMode
			Defines the way diagram is fit into page. By default chart minimize items when it has not enough space to fit all of them into screen. 
			Chart has its maximum size when all items shown in full size and  its minimal size when all items shown as dots. 
			It is equivalent of full zoom out of the chart items, dot size items are not readable, but such presentation of them 
			gives possibility to overview chart layout. So chart tryes to combine both presenation modes and keep chart as small 
			as possible in order to give user possibility to see big picture. Collapsed items provide ideal way for analitical reiew of 
			organizational diagram. If chart shown in its maximum size when all items are unfolded, it becomes impossible 
			to navigate betwen parents close to the root item. In such mode chart is usable only at bottom levels when children are close to their parents.
			If we try to navigate up to the root of hierarchy, gaps between parents sometimes as big as screen size. So in order to solve these 
			issues chart partially collapses hierarchy into dots and lines depending on this option.

		See also:
			<chartDiag.orgChart.Config.minimalVisibility>
			<chartDiag.famChart.Config.printPreviewPageSize>

		Default:
			<chartDiag.default.PageFitMode.FitToPage>
	*/
	this.pageFitMode = 3/*chartDiag.default.PageFitMode.FitToPage*/;

	/*
		Property: minimalVisibility
			Defines minimal allowed item form size for page fit mode. See description for pageFitMode.
	
		See also:
			<chartDiag.orgChart.Config.pageFitMode>

		Default:
			<chartDiag.default.Visibility.Dot>
	*/
	this.minimalVisibility = 2/*chartDiag.default.Visibility.Dot*/;

	/*
		Property: orientationType
			Chart orientation. Chart can be rotated left, right and bottom.
			Rotation to the right side is equivalent to left side placement 
			in countries writing from right to left, so it is important for localization.

		Default:
			<chartDiag.default.OrientationType.Top>
	*/
	this.orientationType = 0/*chartDiag.default.OrientationType.Top*/;

	/*
		Property: horizontalAlignment
			Defines items horizontal alignment relative to their parent. 
			This is usefull for control localization for right-to-left countries.
		
		Default:
			<chartDiag.default.HorizontalAlignmentType.Center>
	*/
	this.horizontalAlignment = 0/*chartDiag.default.HorizontalAlignmentType.Center*/;

	/*
	Property: verticalAlignment
		Defines items vertical alignment relative to each other within one level of hierarchy. 
		It does not affect levels having same size items.
	
	Default:
		<chartDiag.default.VerticalAlignmentType.Middle>
*/
	this.verticalAlignment = 1/*chartDiag.default.VerticalAlignmentType.Middle*/;

	/*
		Property: arrowsDirection
			Sets direction of connector lines arrows.

		Default:
			<chartDiag.default.GroupByType.None>
	*/
	this.arrowsDirection = 0/*chartDiag.default.GroupByType.None*/;

	/*
		Property: connectorType
			Defines connector lines style for dot and line elements. If elements are in their normal full size 
			form they are connected with squired connection lines. So this option controls connector lines style for dots only.

		Default:
			<chartDiag.default.ConnectorType.Squared>
	*/
	this.connectorType = 0/*chartDiag.default.ConnectorType.Squared*/;

	/*
		Property: bevelSize
			Size of squared connector bevel.

		Default:
			4
	*/
	this.bevelSize = 4;

	/*
		Property: elbowType
			Style squared connectors with custom elbows.

		Default:
			<chartDiag.default.ElbowType.None>
	*/
	this.elbowType = 0/*chartDiag.default.ElbowType.None*/;

	/*
		Property: elbowDotSize
			Size of elbow dot.

		Default:
			4
	*/
	this.elbowDotSize = 4;

	/*
	Property: emptyDiagramMessage
		Empty message in order to avoid blank screen. This option is supposed to say user that chart is empty when no data inside.
	*/
	this.emptyDiagramMessage = "Diagram is empty.";

	/*
	Property: items
		This is chart items collection. It is regular array of items of type ItemConfig. Items reference each other via parent property. 
		So every item may have only one parent in chart. If parent set to null then item displayed at root of chart. 
		Chart can have multiple root items simultaniously. If item references missing item, then it is ignored. 
		If items loop each other they are ignored as well. It is applications responsiblity to avoid such issues.

	See Also:
		<chartDiag.orgChart.ItemConfig>
		<chartDiag.orgChart.ItemConfig.id>
		<chartDiag.orgChart.ItemConfig.parent>
	*/
	this.items = [];

	/*
	Property: annotations
		Array of annotaion objects. Chart supports several types of annotations. By default they are drawn on top of chart items and they block mouse events of UI elements placed in item templates.
		The design assumes only few of them being displayed simultanuosly in other words chart does not resolve mutual overlaps of annotations, so don't over use them. 
		This is especially true for connectors and background annotations.

	See also:
		<chartDiag.orgChart.ConnectorAnnotationConfig>
		<chartDiag.orgChart.ShapeAnnotationConfig>
		<chartDiag.orgChart.BackgroundAnnotationConfig>
		<chartDiag.orgChart.HighlightPathAnnotationConfig>
	*/
	this.annotations = [];

	/*
	Property: cursorItem
		Cursor item id - it is single item selection mode, user selects new cursor item on mouse click. 
		Cursor defines current local zoom placement or in other words current navigation item in the chart,
		all items relative to cursor always shoun in full size. So user can see all possible items around cursor in full size 
		and can continue navigation around chart. So when user navigates from one item to another clicking on thems and changing cursor item
		in chart, chart minimizes items going out of cursor scope and shows in full size items relative to new cursor position.
		If it is null then no cursor shown on diagram.

	See Also:
		<chartDiag.orgChart.ItemConfig.id>
		<chartDiag.orgChart.Config.onCursorChanging>
		<chartDiag.orgChart.Config.onCursorChanged>
	*/
	this.cursorItem = null;

	/*
	Property: highlightItem
		Highlighted item id. Highlight is mouse over affect, but using this option applicatin can set highlight at any item 
		in the chart programmatically. It can be used for chart syncronization with other controls on UI having mouse over effect. 
		See chartDiag.orgChart.Config.update method arguments description for fast chart update.
		If it is null then no highlight shown on diagram.

	See Also:
		<chartDiag.orgChart.ItemConfig.id>
		<chartDiag.orgChart.Config.onHighlightChanging>
		<chartDiag.orgChart.Config.onHighlightChanged>
	*/
	this.highligtItem = null;


	/*
	Property: selectedItems
		Defines array of selected item ids. Chart allows to select items via checking checkboxes under items. Checkboxes are 
		shown only for full size items. So when item is selected it is always shown in full size, so check box always visible for selcted items.
		User can navigate around large diagram and check intrested items in order to keep them opened. So that way chart provides 
		means to show several items on large diagram and fit everything into minimal space ideally into available screen space.
		Application can select items programmatically using this array or receive notifications from chart about user selections with following events.

	See Also:
		<chartDiag.orgChart.ItemConfig.id>
		<chartDiag.orgChart.Config.onSelectionChanging>
		<chartDiag.orgChart.Config.onSelectionChanged>
	*/
	this.selectedItems = [];

	/*
	Property: hasSelectorCheckbox
		This option controls selection check boxes visibility. 

	Auto - Checkbox shown only for current cursor item only.
	True - Every full size item has selection check box.
	False - No check boxes. Application can still programmatically select some items in the chart. 
	Application may provide custom item template having checkbox inside of item. If application defined check box inside of item template has name="checkbox"
	it is auto used as default selection check box.

	Default:
		<chartDiag.default.Enabled.Auto>

	See Also:
		<chartDiag.orgChart.ItemConfig.hasSelectorCheckbox>
		<chartDiag.orgChart.Config.onSelectionChanging>
		<chartDiag.orgChart.Config.onSelectionChanged>
	*/
	this.hasSelectorCheckbox = 0/*chartDiag.default.Enabled.Auto*/;

	/*
		Property: selectCheckBoxLabel
			Selection check box label. 
	*/
	this.selectCheckBoxLabel = "Selected";

	/*
	Property: selectionPathMode
		Defines the way items between root item and selectedItems displayed in diagram. Chart always shows all items between cursor item and its root in full size.
		But if cursor positioned on root item, then chart shows in full size only selected items in the chart. So this option controls items size between 
		selected items and root item of the chart. By default all items betwen root and selected items shown in full size.

	Default:
		<chartDiag.default.SelectionPathMode.FullStack>
	*/
	this.selectionPathMode = 1/*chartDiag.default.SelectionPathMode.FullStack*/;

	/*
	Property: templates
		Custom user templates collection. TemplateConfig is complex object providing options to customize item's content template, 
		cursor tempate and highlight template. Every template config should have unique name property, which is used by chart and its item configs 
		to reference them. Chart's defaultTemplateName allows to make template default for all items in the chart. On other hand user may define templates
		to individual items in the chart by templateName property of item config.

	See also:
		<chartDiag.orgChart.TemplateConfig>
		<chartDiag.orgChart.Config.defaultTemplateName>
		<chartDiag.orgChart.ItemConfig.templateName>
	*/
	this.templates = [];

	/*
		Property: defaultTemplateName
			This is template name used to render items having no <chartDiag.orgChart.ItemConfig.templateName> defined.


		See Also:
			<chartDiag.orgChart.TemplateConfig>
			<chartDiag.orgChart.TemplateConfig.name>
			<chartDiag.orgChart.Config.templates>
	*/
	this.defaultTemplateName = null;

	/*
	Property: hasButtons
		This option controls user buttons visibility. 

	Auto - Buttons visible only for cursor item.
	True - Every normal item has buttons visible.
	False - No buttons.

	Default:
		<chartDiag.default.Enabled.Auto>
	*/
	this.hasButtons = 0/*chartDiag.default.Enabled.Auto*/;

	/*
	Property: buttons
		Custom user buttons displayed on right side of item. This collection provides simple way to define context buttons for every item. 
		The only limitation, they are all the same. So if you need to have unique buttons for every item, then you have to 
		customize cursor templates and manually create custom buttons inside of them.

	See also:
		<chartDiag.orgChart.ButtonConfig>
	*/
	this.buttons = [];

	/*
	Event: onHighlightChanging
		Notifies about changing highlight item <chartDiag.orgChart.Config.highlightItem> in diagram.
		This coupled event with <chartDiag.orgChart.Config.onHighlightChanged>, it is fired before highlight update.

	See also:
		<chartDiag.orgChart.EventArgs>
	*/
	this.onHighlightChanging = null;

	/*
	Event: onHighlightChanged
		Notifies about changed highlight item <chartDiag.orgChart.Config.highlightItem> in diagram.

	See also:
		<chartDiag.orgChart.EventArgs>
	*/
	this.onHighlightChanged = null;

	/*
	Event: onCursorChanging
		Notifies about changing cursor item <chartDiag.orgChart.Config.cursorItem> in diagram.
		This coupled event with <chartDiag.orgChart.Config.onCursorChanged>, it is fired before layout update.

	See also:
		<chartDiag.orgChart.EventArgs>
	*/
	this.onCursorChanging = null;

	/*
	Event: onCursorChanged
		Notifies about changed cursor item <chartDiag.orgChart.Config.cursorItem> in diagram .

	See also:
		<chartDiag.orgChart.EventArgs>
	*/
	this.onCursorChanged = null;

	/*
	Event: onSelectionChanging
		Notifies about changing selected items collection of <chartDiag.orgChart.Config.selectedItems>.

	See also:
		<chartDiag.orgChart.EventArgs>
	*/
	this.onSelectionChanging = null;

	/*
	Event: onSelectionChanged
		Notifies about changes in collection of <chartDiag.orgChart.Config.selectedItems>.

	See also:
		<chartDiag.orgChart.EventArgs>
	*/
	this.onSelectionChanged = null;

	/*
	Event: onButtonClick
		Notifies about click of custom user button defined in colelction of <chartDiag.orgChart.Config.buttons>.

	See also:
		<chartDiag.orgChart.EventArgs>
	*/
	this.onButtonClick = null;

	/*
	Event: onMouseClick
		On mouse click event. 

	See also:
		<chartDiag.orgChart.EventArgs>
	*/
	this.onMouseClick = null;

	/*
	Event: onMouseDblClick
		On mouse double click event. 

	See also:
		<chartDiag.orgChart.EventArgs>
	*/
	this.onMouseDblClick = null;

	/*
	Event: onItemRender
		Item templates don't provide means to bind data of items into templates. So this event handler gives application such possibility.
		If application uses custom templates then this method is called to populate template with items properties.

	See also:
		<chartDiag.default.RenderEventArgs>
		<chartDiag.orgChart.TemplateConfig>
		<chartDiag.orgChart.Config.templates>
	*/
	this.onItemRender = null;

	/*
	Event: onHighlightRender
		If user defined custom highlight template for item template 
		then this method is called to populate it with context data.

	See also:
		<chartDiag.default.RenderEventArgs>
		<chartDiag.orgChart.TemplateConfig>
		<chartDiag.orgChart.Config.templates>
	*/
	this.onHighlightRender = null;
	/*
	Event: onCursorRender
		If user defined custom cursor template for item template 
		then this method is called to populate it with context data.

	See also:
		<chartDiag.default.RenderEventArgs>
		<chartDiag.orgChart.TemplateConfig>
		<chartDiag.orgChart.Config.templates>
	*/
	this.onCursorRender = null;
	/*
	Property: normalLevelShift
		Defines interval after level of items in  diagram having items in normal state.
	*/
	this.normalLevelShift = 20;
	/*
	Property: dotLevelShift
		Defines interval after level of items in  diagram having all items in dot state.
	*/
	this.dotLevelShift = 20;
	/*
	Property: lineLevelShift
		Defines interval after level of items in  diagram having items in line state.
	*/
	this.lineLevelShift = 10;

	/*
	Property: normalItemsInterval
		Defines interval between items at the same level in  diagram having items in normal state.
	*/
	this.normalItemsInterval = 10;
	/*
	Property: dotItemsInterval
		Defines interval between items at the same level in  diagram having items in dot state.
	*/
	this.dotItemsInterval = 1;
	/*
	Property: lineItemsInterval
		Defines interval between items at the same level in  diagram having items in line state.
	*/
	this.lineItemsInterval = 2;

	/*
	Property: cousinsIntervalMultiplier
		Use this interval multiplier between cousins in hiearchy. The idea of this option to make extra space between cousins. 
		So children belonging to different parents have extra gap between them.
		
	*/
	this.cousinsIntervalMultiplier = 5;

	/*
	method: update
		Makes full redraw of diagram contents reevaluating all options. This method has to be called explisitly after all options are set in order to update widget contents.
	
	Parameters:
		updateMode: This parameter defines severaty of update <chartDiag.default.UpdateMode>. 
		For example <chartDiag.default.UpdateMode.Refresh> updates only 
		items and selection reusing existing elements where ever it is possible.

	See also:
		<chartDiag.default.UpdateMode>

	Default:
		<chartDiag.default.UpdateMode.Recreate>
	*/

	/*
	Property: itemTitleFirstFontColor
	This property customizes default template title font color. 
	Item background color sometimes play a role of logical value and 
	can vary over a wide range, so as a result title having 
	default font color may become unreadable. Widgets selects the best font color 
	between this option and <chartDiag.orgChart.Config.itemTitleSecondFontColor>.

	See Also:
		<chartDiag.orgChart.ItemConfig.itemTitleColor>
		<chartDiag.orgChart.Config.itemTitleSecondFontColor>
		<chartDiag.default.highestContrast>

	*/
	this.itemTitleFirstFontColor = "#ffffff"/*chartDiag.default.Colors.White*/;

	/*
	Property: itemTitleSecondFontColor
	Default template title second font color.
	*/
	this.itemTitleSecondFontColor = "#000080"/*chartDiag.default.Colors.Navy*/;

	/*
		Property: minimizedItemShapeType
			Defines minimized item shape. The border line width is set with <chartDiag.orgChart.TemplateConfig.minimizedItemBorderWidth>
			By default minimized item is rounded rectangle filled with item title color.


		See also:
			<chartDiag.orgChart.TemplateConfig.minimizedItemCornerRadius>
			<chartDiag.orgChart.ItemConfig.itemTitleColor>
			<chartDiag.orgChart.ItemConfig.minimizedItemShapeType>

		Default:
			<chartDiag.default.ShapeType.None>
	*/
	this.minimizedItemShapeType = 6/*chartDiag.default.ShapeType.None*/;

	/*
	Property: linesColor
		Connectors lines color. Connectors are basic connections betwen chart items 
		defining their logical relationships, don't mix with connector annotations. 
	*/
	this.linesColor = "#c0c0c0"/*chartDiag.default.Colors.Silver*/;

	/*
	Property: linesWidth
		Connectors lines width.
	*/
	this.linesWidth = 1;

	/*
	Property: linesType
		Connectors line pattern.

	Default:
		<chartDiag.default.LineType.Solid>
	*/
	this.linesType = 0/*chartDiag.default.LineType.Solid*/;

	/*
	Property: highlightLinesColor
		Connectors highlight line color. Connectors are basic connections betwen chart items 
		defining their logical relationships, don't mix with connector annotations. 
	*/
	this.highlightLinesColor = "#ff0000"/*chartDiag.default.Colors.Red*/;

	/*
	Property: highlightLinesWidth
		Connectors highlight line width.
	*/
	this.highlightLinesWidth = 1;

	/*
	Property: highlightLinesType
		Connectors highlight line pattern.

	Default:
		<chartDiag.default.LineType.Solid>
	*/
	this.highlightLinesType = 0/*chartDiag.default.LineType.Solid*/;

	/*
	Property: showCallout
		This option controls callout visibility for dotted items. 

	Default:
		true
	*/
	this.showCallout = true;

	/*
	Property: defaultCalloutTemplateName
		This is template name used to render callouts for dotted items. 
		Actual callout template name is defined by following sequence:
		<chartDiag.orgChart.ItemConfig.calloutTemplateName> 
		<chartDiag.orgChart.ItemConfig.templateName>
		<chartDiag.orgChart.Config.defaultCalloutTemplateName>
		<chartDiag.orgChart.Config.defaultTemplateName>


	See Also:
		<chartDiag.orgChart.Config.templates> collection property.

	Default:
		null
	*/
	this.defaultCalloutTemplateName = null;

	/*
	Property: calloutfillColor
		Annotation callout fill color.
	*/
	this.calloutfillColor = "#000000";

	/*
	Property: calloutBorderColor
		Annotation callout border color.
	*/
	this.calloutBorderColor = null;

	/*
	Property: calloutOffset
		Annotation callout offset.
	*/
	this.calloutOffset = 4;

	/*
	Property: calloutCornerRadius
		Annotation callout corner radius.
	*/
	this.calloutCornerRadius = 4;

	/*
	Property: calloutPointerWidth
		Annotation callout pointer base width.
	*/
	this.calloutPointerWidth = "10%";

	/*
	Property: calloutLineWidth
		Annotation callout border line width.
	*/
	this.calloutLineWidth = 1;

	/*
	Property: calloutOpacity
		Annotation callout opacity.
	*/
	this.calloutOpacity = 0.2;

	/*
	Property: childrenPlacementType
		Defines children placement form.
	*/
	this.childrenPlacementType = 2/*chartDiag.default.ChildrenPlacementType.Horizontal*/;

	/*
	Property: leavesPlacementType
		Defines leaves placement form. Leaves are children having no sub children.
	*/
	this.leavesPlacementType = 2/*chartDiag.default.ChildrenPlacementType.Horizontal*/;

	/*
	Property: maximumColumnsInMatrix
		Maximum number of columns for matrix leaves layout. Leaves are children having no sub children.
	*/
	this.maximumColumnsInMatrix = 6;

	/*
	Property: buttonsPanelSize
		User buttons panel size.
	*/
	this.buttonsPanelSize = 28;

	/*
	Property: groupTitlePanelSize
		Group title panel size.
	*/
	this.groupTitlePanelSize = 24;

	/*
	Property: checkBoxPanelSize
		Selection check box panel size.
	*/
	this.checkBoxPanelSize = 24;

	this.distance = 3;

	/*
	Property: scale
		CSS3 scale transform.
	*/
	this.scale = 1;

	/*
	Property: minimumScale
		Minimum CSS3 scale transform.
	*/
	this.minimumScale = 0.5;

	/*
	Property: maximumScale
		Maximum CSS3 scale transform.
	*/
	this.maximumScale = 2;

	/*
	Property: showLabels
		This option controls labels visibility for minimized items. If you need to show labels outside of borders of regular items then use item template for customization.
		Labels placed inside HTML DIV element and long strings are wrapped inside. 
		User can control labels position relative to its item. Chart does not meassure labels and does reserve space for them, 
		so if label overlap each other then horizontal or vertical intervals between rows and items shoud be manually increased.
	
	Auto - depends on available space.
	True - always shown.
	False - hidden.

	See Also:
		<chartDiag.orgChart.ItemConfig.label>
		<chartDiag.orgChart.Config.labelSize>
		<chartDiag.orgChart.Config.normalItemsInterval>
		<chartDiag.orgChart.Config.dotItemsInterval>
		<chartDiag.orgChart.Config.lineItemsInterval>
		<chartDiag.orgChart.Config.normalLevelShift>
		<chartDiag.orgChart.Config.dotLevelShift>
		<chartDiag.orgChart.Config.lineLevelShift>

	Default:
		<chartDiag.default.Enabled.Auto>
	*/
	this.showLabels = 0/*chartDiag.default.Enabled.Auto*/;

	/*
	Property: labelSize
		Defines label size. It is needed to avoid labels overlapping. If one label overlaps another label or item it will be hidden. 
		Label string is wrapped when its length exceeds available width.

	Default:
		new <chartDiag.default.Size>(80, 24);
	*/
	this.labelSize = new chartDiag.default.Size(80, 24);

	/*
	Property: labelOffset
		Defines label offset from dot in pixels.

	Default:
		1;
	*/
	this.labelOffset = 1;

	/*
	Property: labelOrientation
		Defines label orientation. 

	See Also:
	<chartDiag.text.TextOrientationType>

	Default:
		<chartDiag.text.TextOrientationType.Horizontal>
	*/
	this.labelOrientation = 0/*chartDiag.text.TextOrientationType.Horizontal*/;

	/*
	Property: labelPlacement
		Defines label placement relative to its dot. 
		Label is aligned to opposite side of its box.

	See Also:
	<chartDiag.default.PlacementType>

	Default:
		<chartDiag.default.PlacementType.Top>
	*/
	this.labelPlacement = 1/*chartDiag.default.PlacementType.Top*/;

	/*
	Property: labelFontSize
		Label font size. 

	Default:
		10px
*/
	this.labelFontSize = "10px";

	/*
		Property: labelFontFamily
			Label font family. 

		Default:
			"Arial"
	*/
	this.labelFontFamily = "Arial";

	/*
		Property: labelColor
			Label color. 

		Default:
			chartDiag.default.Colors.Black
	*/
	this.labelColor = "#000000"/*chartDiag.default.Colors.Black*/;

	/*
		Property: labelFontWeight
			Font weight: normal | bold

		Default:
			"normal"
	*/
	this.labelFontWeight = "normal";

	/*
	Property: labelFontStyle
		Font style: normal | italic
		
	Default:
		"normal"
	*/
	this.labelFontStyle = "normal";

	/*
	Property: enablePanning
		Enable chart panning with mouse drag & drop for desktop browsers.
		Disable it if you need to support items Drag & Drop.

	Default:
		true
	*/
	this.enablePanning = true;

	/*
	Property: printPreviewPageSize
		Defines print preview page size in pixels. 

	Default:
		new <chartDiag.default.Size>(612, 792);
	*/
	this.printPreviewPageSize = new chartDiag.default.Size(612, 792);

	/*
	Property: autoSizeMinimum
		Defines minimum diagram size in autosize mode. If diagram has no elements, it is going to be of this size on the page.  
	Default:
		new <chartDiag.default.Size>(800, 600);
	*/
	this.autoSizeMinimum = new chartDiag.default.Size(800, 600);

	/*
	Property: autoSizeMaximum
		Defines maximum diagram size in autosize mode.
	Default:
		new <chartDiag.default.Size>(1024, 768);
	*/
	this.autoSizeMaximum = new chartDiag.default.Size(1024, 768);
};

/* /Controls/OrgDiagram/Configs/ConnectorAnnotationConfig.js*/
/*
	Class: chartDiag.orgChart.ConnectorAnnotationConfig
		Options class. Populate annotation collection with instances of this objects to draw connector between two items.
	
	See Also:
		<chartDiag.orgChart.Config.annotations>
*/
chartDiag.orgChart.ConnectorAnnotationConfig = function (arg0, arg1) {
	var property;

	/*
	Property: annotationType
		Annotation type. All various annotations are defined in annotations collection property of <chartDiag.orgChart.Config>. 
		So this property is needed to define annotation type when we use JavaScript non-prototype objects.
		See other annotations as well.

	Default:
		<chartDiag.default.AnnotationType.Connector>

	See Also:
		<chartDiag.orgChart.Config.annotations>
		<chartDiag.orgChart.ShapeAnnotationConfig>
		<chartDiag.orgChart.BackgroundAnnotationConfig>
		<chartDiag.orgChart.HighlightPathAnnotationConfig>
	*/
	this.annotationType = 0/*chartDiag.default.AnnotationType.Connector*/;

	/*
	Property: zOrderType
		Defines annotation Z order placement relative to chart items. Chart items are drawn in layers on top of each other. We can draw annotations under the items or over them. 
		If you place annotations over items then you block mouse events of UI elements in them. Browsers don't support mouse events transparentcy consistently. 
		So in order to avoid mouse events blocking of UI elements in item templates you have to place annotation items under them.
		Take into account that chart default buttons are drawn on top of everyhting, so they are never blocked by annotations drawn over items.

	Default:
		<chartDiag.default.ZOrderType.Foreground>
	*/
	this.zOrderType = 2/*chartDiag.default.ZOrderType.Foreground*/;

	/*
	Property: fromItem 
		Reference to from item in hierarchy.
	See Also:
		<chartDiag.orgChart.ItemConfig.id>
	*/
	this.fromItem = null;

	/*
	Property: toItem 
		Reference to from item in hierarchy.
	See Also:
		<chartDiag.orgChart.ItemConfig.id>
	*/
	this.toItem = null;

	/*
	Property: connectorShapeType
		Connector shape type. 

	Default:
		<chartDiag.default.ConnectorShapeType.OneWay>
	*/
	this.connectorShapeType = 0/*chartDiag.default.ConnectorShapeType.OneWay*/;

	/*
		Property: connectorPlacementType
			Defines connector annotation shape placement mode between two items. 
			It uses off beat placement mode as default in order to avoid overlapping
			of base hierarchy connecting lines.

		Default:
			<chartDiag.default.ConnectorPlacementType.Offbeat>
	*/
	this.connectorPlacementType = 0/*chartDiag.default.ConnectorPlacementType.Offbeat*/;

	/*
	Property: labelPlacementType
		Label placement type along connection line(s). 

	Default:
		<chartDiag.default.ConnectorLabelPlacementType.Between>
	*/
	this.labelPlacementType = 1/*chartDiag.default.ConnectorLabelPlacementType.Between*/;

	/*
	Property: offset
		Connector's from and to points offset off the rectangles side. Connectors connection points can be outside of rectangles and inside for negative offset value.
	See also:
		<chartDiag.default.Thickness>
	*/
	this.offset = new chartDiag.default.Thickness(0, 0, 0, 0);

	/*
	Property: lineWidth
		Border line width. 
	*/
	this.lineWidth = 2;

	/*
	Property: color
		Connector's color.
	
	Default:
		<chartDiag.default.Colors.Black>
	*/
	this.color = "#000000"/*chartDiag.default.Colors.Black*/;

	/*
	Property: lineType
		Connector's line pattern.

	Default:
		<chartDiag.default.LineType.Solid>
	*/
	this.lineType = 0/*chartDiag.default.LineType.Solid*/;

	/*
	Property: selectItems
		Always show annotated items in normal state. Setting this option is equivalent to adding annotated items to collection of selected items.

	Default:
		true

	See Also:
		<chartDiag.orgChart.Config.selectedItems>
	*/
	this.selectItems = true;

	/*
	Property: label
		Annotation label text. Label styled with css class name "bp-connector-label".
	*/
	this.label = null;

	/*
	Property: labelSize
		Annotation label size.

	Default:
		new <chartDiag.default.Size>(60, 30);
	*/
	this.labelSize = new chartDiag.default.Size(60, 30);

	switch (arguments.length) {
		case 1:
			for (property in arg0) {
				if (arg0.hasOwnProperty(property)) {
					this[property] = arg0[property];
				}
			}
			break;
		case 2:
			this.fromItem = arg0;
			this.toItem = arg1;
			break;
	}
};

/* /Controls/OrgDiagram/Configs/HighlightPathAnnotationConfig.js*/
/*
	Class: chartDiag.orgChart.HighlightPathAnnotationConfig
		Options class. Populate annotation collection with instances of this objects to draw path between items.
		Path is drawn along base connection lines displaying relationships between item of the chart.
	See Also:
		<chartDiag.orgChart.Config.annotations>
*/
chartDiag.orgChart.HighlightPathAnnotationConfig = function (arg0) {
	var property;

	/*
	Property: annotationType
		Annotation type. All various annotations are defined in annotations collection property of <chartDiag.orgChart.Config>. 
		So this property is needed to define annotation type when we use JavaScript non-prototype objects.
		See other annotations as well.

	Default:
		<chartDiag.default.AnnotationType.HighlightPath>

	See Also:
		<chartDiag.orgChart.Config.annotations>
		<chartDiag.orgChart.ConnectorAnnotationConfig>
		<chartDiag.orgChart.ShapeAnnotationConfig>
		<chartDiag.orgChart.BackgroundAnnotationConfig>
	*/
	this.annotationType = 2/*chartDiag.default.AnnotationType.HighlightPath*/;

	/*
	Property: items 
		Array of item ids in hierarchy.
	See Also:
		<chartDiag.orgChart.ItemConfig.id>
	*/
	this.items = [];


	/*
	Property: selectItems
		Always show annotated items in normal state. Setting this option is equivalent to adding annotated items to collection of selected items.

	Default:
		true

	See Also:
		<chartDiag.orgChart.Config.selectedItems>
	*/
	this.selectItems = false;

	switch (arguments.length) {
		case 1:
			if (arg0 !== null) {
				if (arg0 instanceof Array) {
					this.items = arg0;
				} else if (typeof arg0 == "object") {
					for (property in arg0) {
						if (arg0.hasOwnProperty(property)) {
							this[property] = arg0[property];
						}
					}
				}
			}
			break;
	}
};

/* /Controls/OrgDiagram/Configs/ItemConfig.js*/
/*
	Class: chartDiag.orgChart.ItemConfig
		Defines item in diagram hierarchy. 
		User is supposed to create hierarchy of this items and assign it to <chartDiag.orgChart.Config.items> collection property.
		Widget contains some generic properties used in default item template, 
		but user can add as many custom properties to this class as needed. 
		Just be careful and avoid widget malfunction.

	See Also:
		<chartDiag.orgChart.Config.items>
*/
chartDiag.orgChart.ItemConfig = function (arg0, arg1, arg2, arg3, arg4) {
	var property;
	/*
	Property: id
	Unique item id.
	*/
	this.id = null;

	/*
	Property: parent
	Parent id. If parent is null then item placed as a root item.
	*/
	this.parent = null;

	/*
	Property: title
	Default template title property.
	*/
	this.title = null;

	/*
	Property: description
	Default template description element.
	*/
	this.description = null;

	/*
	Property: image
	Url to image. This property is used in default template.
	*/
	this.image = null;

	/*
	Property: context
	User context object.
	*/
	this.context = null;

	/*
	Property: itemTitleColor
	Default template title background color.
	*/
	this.itemTitleColor = "#4169e1"/*chartDiag.default.Colors.RoyalBlue*/;

	/*
	Property: minimizedItemShapeType
		Defines minimized/dotted item shape type. By default it is set by ItemTemplate.minimizedItemShapeType property.
		Use this property to set marker type individually per item.

	See Also:
		<chartDiag.default.ShapeType>
	*/
	this.minimizedItemShapeType = null;

	/*
	Property: groupTitle
	Auxiliary group title property. Displayed vertically on the side of item.
	*/
	this.groupTitle = null;

	/*
	Property: groupTitleColor
	Group title background color.
	*/
	this.groupTitleColor = "#4169e1"/*chartDiag.default.Colors.RoyalBlue*/;

	/*
	Property: isVisible
		If it is true then item is shown and selectable in hierarchy. 
		If item is hidden and it has visible children then only connector line is drawn instead of it.

	True - Item is shown.
	False - Item is hidden.

	Default:
		true
	*/
	this.isVisible = true;

	/*
	Property: isActive
		If it is true then item is selectable in hierarchy and it has mouse over highlight. 

	True - Item is clickable.
	False - Item is inactive and user cannot set cursor item or highlight.

	Default:
		true
	*/
	this.isActive = true;

	/*
	Property: hasSelectorCheckbox
		If it is true then selection check box is shown for the item. 
		Selected items are always shown in normal form, so if item is 
		selected then its selection check box is visible and checked.

	Auto - Depends on <chartDiag.orgChart.Config.hasSelectorCheckbox> setting.
	True - Selection check box is visible.
	False - No selection check box.

	Default:
	<chartDiag.default.Enabled.Auto>
	*/
	this.hasSelectorCheckbox = 0/*chartDiag.default.Enabled.Auto*/;

	/*
	Property: hasButtons
		This option controls buttons panel visibility. 

	Auto - Depends on <chartDiag.orgChart.Config.hasButtons> setting.
	True - Has buttons panel.
	False - No buttons panel.

	Default:
	<chartDiag.default.Enabled.Auto>
	*/
	this.hasButtons = 0/*chartDiag.default.Enabled.Auto*/;

	/*
		Property: itemType
			This property defines how item should be shown. 
			So far it is only possible to make it invisible.
	
		See Also:
			<chartDiag.orgChart.ItemType>
		
		Deafult:
			<chartDiag.orgChart.ItemType.Regular>
	*/
	this.itemType = 0/*chartDiag.orgChart.ItemType.Regular*/;

	/*
		Property: adviserPlacementType
			In case of item types <chartDiag.orgChart.ItemType.Assistant> 
			and <chartDiag.orgChart.ItemType.Adviser> this option defines item 
			placement side relative to parent. By default items placed on 
			the right side of parent item.

		Deafult:
			<chartDiag.default.AdviserPlacementType.Auto>
	*/
	this.adviserPlacementType = 0/*chartDiag.default.AdviserPlacementType.Auto*/;

	/*
	Property: childrenPlacementType
		Defines children placement form.
	*/
	this.childrenPlacementType = 0/*chartDiag.default.ChildrenPlacementType.Auto*/;

	/*
	Property: directorsPlacementType
		Defines directors placement form.
	*/
	this.directorsPlacementType = 0/*chartDiag.default.ChildrenPlacementType.Auto*/;

	/*
	Property: leftAdvisersPlacementType
		Defines left advisers placement form.
	*/
	this.leftAdvisersPlacementType = 0/*chartDiag.default.ChildrenPlacementType.Auto*/;

	/*
	Property: rightAdvisersPlacementType
		Defines right advisers placement form.
	*/
	this.rightAdvisersPlacementType = 0/*chartDiag.default.ChildrenPlacementType.Auto*/;

	/*
	Property: groupName
		Defines group name for applicabale item types, every group of items placed as separate level.
	*/
	this.groupName = null;



	/*
	Property: templateName
		This is template name used to render this item.

		See Also:
		<chartDiag.orgChart.TemplateConfig>
		<chartDiag.orgChart.Config.templates> collection property.
	*/
	this.templateName = null;

	/*
	Property: showCallout
		This option controls items callout visibility.

	Auto - depends on <chartDiag.orgChart.Config.showCallout> option
	True - shown
	False - hidden

	Default:
		<chartDiag.default.Enabled.Auto>
	*/
	this.showCallout = 0/*chartDiag.default.Enabled.Auto*/;

	/*
	Property: calloutTemplateName
		This is template name used to render callout for dotted item. 
		Actual callout template name is defined by following sequence:
		<chartDiag.orgChart.ItemConfig.calloutTemplateName> 
		<chartDiag.orgChart.ItemConfig.templateName>
		<chartDiag.orgChart.Config.defaultCalloutTemplateName>
		<chartDiag.orgChart.Config.defaultTemplateName>

	See Also:
		<chartDiag.orgChart.Config.templates> collection property.
	Default:
		null
	*/
	this.calloutTemplateName = null;

	/*
	Property: label
	Items label text.
	*/
	this.label = null;

	/*
	Property: showLabel
		This option controls items label visibility. Label is displayed in form of div having text inside, long string is wrapped inside of it. 
		User can control labels position relative to its item. Chart does not preserve space for label.

	Auto - depends on <chartDiag.orgChart.Config.labelOrientation> setting.
	True - always shown.
	False - hidden.

	See Also:
	<chartDiag.orgChart.ItemConfig.label>
	<chartDiag.orgChart.Config.labelSize>

	Default:
		<chartDiag.default.Enabled.Auto>
	*/
	this.showLabel = 0/*chartDiag.default.Enabled.Auto*/;

	/*
	Property: labelSize
		Defines label size. It is needed to avoid labels overlapping. If one label overlaps another label or item it will be hidden. 
		Label string is wrapped when its length exceeds available width. 
		By default it is equal to charts <chartDiag.orgChart.Config.labelSize>.

	See Also:
		<chartDiag.default.Size>
	Default:
		null;
	*/
	this.labelSize = null;

	/*
	Property: labelOrientation
		Defines label orientation. 
		In default <chartDiag.text.TextOrientationType.Auto> mode it depends on chart <chartDiag.orgChart.Config.labelOrientation> setting.

	See Also:
	<chartDiag.orgChart.Config.labelOrientation>
	<chartDiag.text.TextOrientationType>

	Default:
		<chartDiag.text.TextOrientationType.Auto>
	*/
	this.labelOrientation = 3/*chartDiag.text.TextOrientationType.Auto*/;

	/*
	Property: labelPlacement
		Defines label placement relative to the item. 
		In default <chartDiag.default.PlacementType.Auto> mode it depends on chart <chartDiag.orgChart.Config.labelPlacement> setting.

	See Also:
		<chartDiag.orgChart.Config.labelPlacement>
		<chartDiag.default.PlacementType>

	Default:
		<chartDiag.default.PlacementType.Auto>
	*/
	this.labelPlacement = 0/*chartDiag.default.PlacementType.Auto*/;

	switch (arguments.length) {
		case 1:
			for (property in arg0) {
				if (arg0.hasOwnProperty(property)) {
					this[property] = arg0[property];
				}
			}
			break;
		case 5:
			this.id = arg0;
			this.parent = arg1;
			this.title = arg2;
			this.description = arg3;
			this.image = arg4;
			break;
	}
};

/* /Controls/OrgDiagram/Configs/ShapeAnnotationConfig.js*/
/*
	Class: chartDiag.orgChart.ShapeAnnotationConfig
		Options class. Populate annotation collection with instances of this objects to draw shape benith or on top of several items.
		Shape is drawn as rectangular area.
	See Also:
		<chartDiag.orgChart.Config.annotations>
*/
chartDiag.orgChart.ShapeAnnotationConfig = function (arg0) {
	var property;

	/*
	Property: annotationType
		Annotation type. All various annotations are defined in annotations collection property of <chartDiag.orgChart.Config>. 
		So this property is needed to define annotation type when we use JavaScript non-prototype objects.
		See other annotations as well.

	Default:
		<chartDiag.default.AnnotationType.Shape>

	See Also:
		<chartDiag.orgChart.Config.annotations>
		<chartDiag.orgChart.ConnectorAnnotationConfig>
		<chartDiag.orgChart.BackgroundAnnotationConfig>
		<chartDiag.orgChart.HighlightPathAnnotationConfig>
	*/
	this.annotationType = 1/*chartDiag.default.AnnotationType.Shape*/;

	/*
	Property: zOrderType
		Defines annotation Z order placement relative to chart items. Chart items are drawn in layers on top of each other. We can draw annotations under the items or over them. 
		If you place annotations over items then you block mouse events of UI elements in them. Browsers don't support mouse events transparentcy consistently. 
		So in order to avoid mouse events blocking of UI elements in item templates you have to place annotation items under them.
		Take into account that chart default buttons are drawn on top of everyhting, so they are never blocked by annotations drawn over items.

	Default:
		<chartDiag.default.ZOrderType.Auto>
	*/
	this.zOrderType = 0/*chartDiag.default.ZOrderType.Auto*/;

	/*
	Property: items 
		Array of items ids in hierarchy.
	See Also:
		<chartDiag.orgChart.ItemConfig.id>
	*/
	this.items = [];

	/*
	Property: shapeType
		Shape type. 

	Default:
		<chartDiag.default.ShapeType.Rectangle>
	*/
	this.shapeType = 0/*chartDiag.default.ShapeType.Rectangle*/;

	/*
	Property: offset
		Connector's from and to points offset off the rectangles side. Connectors connection points can be outside of rectangles and inside for negative offset value.
	See also:
		<chartDiag.default.Thickness>
	*/
	this.offset = new chartDiag.default.Thickness(0, 0, 0, 0);

	/*
	Property: lineWidth
		Border line width. 
	*/
	this.lineWidth = 2;

	/*
	Property: cornerRadius
		Body corner radius in percents or pixels. For applicable shapes only.
	*/
	this.cornerRadius = "10%";

	/*
	Property: opacity
		Background color opacity. For applicable shapes only.
	*/
	this.opacity = 1;

	/*
	Property: borderColor
		Shape border line color.
	
	Default:
		null
	*/
	this.borderColor = null;

	/*
	Property: fillColor
		Fill Color. 

	Default:
		null
	*/
	this.fillColor = null;

	/*
	Property: lineType
		Connector's line pattern.

	Default:
		<chartDiag.default.LineType.Solid>
	*/
	this.lineType = 0/*chartDiag.default.LineType.Solid*/;

	/*
	Property: selectItems
		Always show annotated items in normal state. Setting this option is equivalent to adding annotated items to collection of selected items.

	Default:
		true

	See Also:
		<chartDiag.orgChart.Config.selectedItems>
	*/
	this.selectItems = false;

	/*
	Property: label
		Annotation label text. Label styled with css class name "bp-connector-label".
	*/
	this.label = null;

	/*
	Property: labelSize
		Annotation label size.

	Default:
		new <chartDiag.default.Size>(60, 30);
	*/
	this.labelSize = new chartDiag.default.Size(60, 30);

	/*
	Property: labelPlacement
		Defines label placement relative to the shape. 

	See Also:
		<chartDiag.orgChart.Config.labelPlacement>
		<chartDiag.default.PlacementType>

	Default:
		<chartDiag.default.PlacementType.Auto>
	*/
	this.labelPlacement = 0/*chartDiag.default.PlacementType.Auto*/;

	/*
	Property: labelOffset
		Defines label offset from shape in pixels.

	Default:
		4;
	*/
	this.labelOffset = 4;

	switch (arguments.length) {
		case 1:
			if (arg0 !== null) {
				if (arg0 instanceof Array) {
					this.items = arg0;
				} else if (typeof arg0 == "object") {
					for (property in arg0) {
						if (arg0.hasOwnProperty(property)) {
							this[property] = arg0[property];
						}
					}
				}
			}
			break;
	}
};

/* /Controls/OrgDiagram/Events/EventArgs.js*/
/*
	Class: chartDiag.orgChart.EventArgs
		Event details class.
*/
chartDiag.orgChart.EventArgs = function () {
	/*
	Property: oldContext
		Reference to associated previous item in hierarchy.
	*/
	this.oldContext = null;

	/*
	Property: context
		Reference to associated new item in hierarchy.
	*/
	this.context = null;

	/*
	Property: parentItem
		Reference parent item of item in context.
	*/
	this.parentItem = null;

	/*
	Property: position
		Absolute item position on diagram.

	See also:
		<chartDiag.default.Rect>
	*/
	this.position = null;

	/*
	Property: name
		Relative object name.

	*/
	this.name = null;

	/*
	Property: cancel
		Allows cancelation of coupled event processing. This option allows to cancel layout update 
		and subsequent <chartDiag.orgChart.Config.onCursorChanged> event 
		in handler of <chartDiag.orgChart.Config.onCursorChanging> event.
	*/
	this.cancel = false;
};

/* /Controls/OrgDiagram/Models/ConnectorPoint.js*/
chartDiag.orgChart.ConnectorPoint = function () {
	this.parent = chartDiag.default.Point.prototype;
	this.parent.constructor.apply(this, arguments);

	this.hasElbow = false;
	this.elbowPoint1 = null;
	this.elbowPoint2 = null;

	this.visibility = null;

	this.isSquared = true;
	this.highlightPath = 0;
	
	this.connectorStyleType = 1/*chartDiag.default.ConnectorStyleType.Regular*/;
};

chartDiag.orgChart.ConnectorPoint.prototype = new chartDiag.default.Point();

/* /Controls/OrgDiagram/Models/LevelVisibility.js*/
chartDiag.orgChart.LevelVisibility = function (level, currentvisibility) {
	this.level = level;
	this.currentvisibility = currentvisibility;
};

/* /Controls/OrgDiagram/Models/OrgItem.js*/
/* This is model class is used to define intermediate organizational chart structure */
chartDiag.orgChart.OrgItem = function (options) {
	var index, len,
		property;

	this.id = null; // Unique org item id. 

	this.isVisible = true; // If it is true then item is shown and selectable in hierarchy. 
	this.isActive = true; // If it is true then item is clickable in hierarchy. 
	this.hasVisibleChildren = false; // If it is true then item is Visible or one of its children in hierarchy. 

	this.itemType = 0/*chartDiag.orgChart.ItemType.Regular*/; // This property defines how item should be placed in chart. 
	this.adviserPlacementType = 0/*chartDiag.default.AdviserPlacementType.Auto*/; // Left or Right placement relative to parent
	this.childrenPlacementType = 0/*chartDiag.default.ChildrenPlacementType.Auto*/; // Children shape

	this.level = null;
	this.hideParentConnection = false;
	this.hideChildrenConnection = false;

	/* org tree balancing properties */
	this.childIndex = null; // Item index in array of parent's children

	// Folowing properties we copy from user's item config to new OrgItem instance
	// If user's property is undefined we take default value from ItemConfig
	var properties = [
		'id', 'parent', 'isVisible', 'isActive',
		'itemType', 'adviserPlacementType', 'childrenPlacementType'
	];

	/* copy general org chart items properties */
	for (index = 0, len = properties.length; index < len; index += 1) {
		property = properties[index];

		if (options.hasOwnProperty(property)) {
			this[property] = options[property];
		}
	}
};

/* /Controls/OrgDiagram/Models/Template.js*/
chartDiag.orgChart.Template = function (options, templateConfig) {
	this.templateConfig = null;
	this.itemTemplate = null;
	this.highlightTemplate = null;
	this.dotHighlightTemplate = null;
	this.cursorTemplate = null;

	if (templateConfig != null) {
		this.templateConfig = templateConfig;

		this.itemTemplate = chartDiag.default.isNullOrEmpty(templateConfig.itemTemplate) ?
			new chartDiag.default.ItemTemplate(options, templateConfig) :
			new chartDiag.default.UserTemplate(options, templateConfig.itemTemplate, options.onItemRender);

		this.highlightTemplate = chartDiag.default.isNullOrEmpty(templateConfig.highlightTemplate) ?
			new chartDiag.default.HighlightTemplate(options, templateConfig) :
			new chartDiag.default.UserTemplate(options, templateConfig.highlightTemplate, options.onHighlightRender);

		this.dotHighlightTemplate = new chartDiag.default.DotHighlightTemplate(options, templateConfig);

		this.cursorTemplate = chartDiag.default.isNullOrEmpty(templateConfig.cursorTemplate) ?
			new chartDiag.default.CursorTemplate(options, templateConfig) :
			new chartDiag.default.UserTemplate(options, templateConfig.cursorTemplate, options.onCursorRender);
	}
};

/* /Controls/OrgDiagram/Models/TemplateParams.js*/
chartDiag.orgChart.TemplateParams = function () {
	this.template = null;
	this.isActive = false;
	this.hasSelectorCheckbox = false;
	this.hasButtons = false;
	this.hasGroupTitle = false;
	this.buttons = [];
};

/* /Controls/OrgDiagram/Models/TreeItem.js*/
/* This is model class used to define visual structure of chart */
chartDiag.orgChart.TreeItem = function () {
	/* auto generated internal item id */
	this.id = null;

	/* Visual child id which is supposed to be straight under it */
	this.visualAggregatorId = null;
	this.visualDepth = 1; // private 

	this.partners = []; /* thess are nodes connected with bottom line together into one family, family is group of items having common set of children */

	this.visibility = 1/*chartDiag.default.Visibility.Normal*/;

	this.actualItemType = null; // chartDiag.orgChart.ItemType
	this.connectorPlacement = 0; // chartDiag.default.SideFlag
	this.gravity = 0; // chartDiag.default.HorizontalAlignmentType.Center

	/* This value is used to increase gap between neighboring left item in hiearchy */
	this.relationDegree = 0;
};

/* /Controls/OrgDiagram/Models/TreeItemHighlightPath.js*/
chartDiag.orgChart.TreeItemHighlightPath = function () {
	this.highlightPath = 0;
	this.partnerHighlightPath = 0;
};

/* /Controls/OrgDiagram/Models/TreeItemPosition.js*/
/* This is model class used to define visual structure of chart */
chartDiag.orgChart.TreeItemPosition = function (source) {
	this.partnerConnectorOffset = 0;

	this.level = null;
	this.levelPosition = null;
	this.offset = 0;
	this.leftPadding = 0;
	this.rightPadding = 0;

	this.actualVisibility = 1/*chartDiag.default.Visibility.Normal*/;

	this.actualSize = null;
	this.actualPosition = null;
	this.contentPosition = null;

	if (source != null) {
		for (var property in source) {
			if (source.hasOwnProperty(property)) {
				switch (property) {
					case 'actualPosition':
						this.actualPosition = new chartDiag.default.Rect(source.actualPosition);
						break;
					default:
						this[property] = source[property];
						break;
				}
				
			}
		}
	}
};

chartDiag.orgChart.TreeItemPosition.prototype.setSize = function (isCursor, treeItemTemplate, itemsSizesOptions, orientationOptions) {
	var templateConfig;

	switch (this.actualVisibility) {
		case 1/*chartDiag.default.Visibility.Normal*/:
			templateConfig = treeItemTemplate.template.templateConfig;
			this.actualSize = new chartDiag.default.Size(templateConfig.itemSize);
			this.contentPosition = new chartDiag.default.Rect(0, 0, this.actualSize.width, this.actualSize.height);
			if (isCursor) {
				this.actualSize.height += templateConfig.cursorPadding.top + templateConfig.cursorPadding.bottom;
				this.actualSize.width += templateConfig.cursorPadding.left + templateConfig.cursorPadding.right;
				this.contentPosition.x = templateConfig.cursorPadding.left;
				this.contentPosition.y = templateConfig.cursorPadding.top;
			}
			if (treeItemTemplate.hasSelectorCheckbox) {
				this.actualSize.height += itemsSizesOptions.checkBoxPanelSize;
			}
			if (treeItemTemplate.hasButtons) {
				this.actualSize.width += itemsSizesOptions.buttonsPanelSize;
			}
			if (treeItemTemplate.hasGroupTitle) {
				this.actualSize.width += itemsSizesOptions.groupTitlePanelSize;
				this.contentPosition.x += itemsSizesOptions.groupTitlePanelSize;
			}
			break;
		case 2/*chartDiag.default.Visibility.Dot*/:
			templateConfig = treeItemTemplate.template.templateConfig;
			this.actualSize = new chartDiag.default.Size(templateConfig.minimizedItemSize);
			break;
		case 3/*chartDiag.default.Visibility.Line*/:
		case 4/*chartDiag.default.Visibility.Invisible*/:
			this.actualSize = new chartDiag.default.Size();
			break;
	}

	switch (orientationOptions.orientationType) {
		case 2/*chartDiag.default.OrientationType.Left*/:
		case 3/*chartDiag.default.OrientationType.Right*/:
			this.actualSize.invert();
			break;
	}
};

chartDiag.orgChart.TreeItemPosition.prototype.setPosition = function (treeLevelPosition, itemsSizesOptions, orientationOptions) {
	var itemShift = 0;

	switch (this.actualVisibility) {
		case 1/*chartDiag.default.Visibility.Normal*/:
			switch (itemsSizesOptions.verticalAlignment) {
				case 0/*chartDiag.default.VerticalAlignmentType.Top*/:
					itemShift = 0;
					break;
				case 1/*chartDiag.default.VerticalAlignmentType.Middle*/:
					itemShift = (treeLevelPosition.depth - this.actualSize.height) / 2.0;
					break;
				case 2/*chartDiag.default.VerticalAlignmentType.Bottom*/:
					itemShift = treeLevelPosition.depth - this.actualSize.height;
					break;
			}
			break;
		case 2/*chartDiag.default.Visibility.Dot*/:
		case 3/*chartDiag.default.Visibility.Line*/:
		case 4/*chartDiag.default.Visibility.Invisible*/:
			itemShift = treeLevelPosition.horizontalConnectorsDepth - this.actualSize.height / 2.0;
			break;
	}

	this.actualPosition = new chartDiag.default.Rect(this.offset, treeLevelPosition.shift + itemShift, this.actualSize.width, this.actualSize.height);

	this.actualPosition.validate();
};

/* /Controls/OrgDiagram/Models/TreeLevelPosition.js*/
chartDiag.orgChart.TreeLevelPosition = function (source) {
	this.currentvisibility = 1/*chartDiag.default.Visibility.Normal*/;
	this.actualVisibility = 1/*chartDiag.default.Visibility.Normal*/;

	this.shift = 0.0; /* top abolute position of items in level */
	this.depth = 0.0; /* maximum  height of items in level */
	this.nextLevelShift = 0.0; /* next level relative position */
	this.horizontalConnectorsDepth = 0; /* relative position of horizontal connectors between items */
	this.topConnectorShift = 0.0; /* relative position of top connector horizontal line */
	this.connectorShift = 0.0; /* relative position of bottom horizontal line */
	this.levelSpace = 0.0; /* user interval between prev level and this one based on options set by user, if number of horizontal connections is bigger that one it is proportionally increased */

	this.partnerConnectorOffset = 0; /* number of overlapping horiontal connection lines between partners in level */

	this.currentOffset = 0.0; /* this is x axis coordinate offset, it used to calculate horizontal items position in level */

	this.labels = [];
	this.labelsRect = null;
	this.showLabels = true;
	this.hasFixedLabels = false;

	if (source != null) {
		for (var property in source) {
			if (source.hasOwnProperty(property)) {
				this[property] = source[property];
			}
		}
	}
};

chartDiag.orgChart.TreeLevelPosition.prototype.setShift = function (shift, levelSpace, topConnectorSpace, connectorSpace) {
	this.shift = shift;
	this.levelSpace = levelSpace;

	this.topConnectorShift = -levelSpace / 2.0 - topConnectorSpace;
	this.connectorShift = this.depth + connectorSpace + (this.partnerConnectorOffset + 1) * (levelSpace / 2.0);
	this.nextLevelShift = topConnectorSpace + this.depth + connectorSpace + levelSpace + this.partnerConnectorOffset * levelSpace / 2.0;

	return this.nextLevelShift;
};

chartDiag.orgChart.TreeLevelPosition.prototype.shiftDown = function (shift) {
	this.shift += shift;
};

chartDiag.orgChart.TreeLevelPosition.prototype.toString = function () {
	return this.currentvisibility;
};

/* /Controls/OrgDiagram/Tasks/Layout/AlignDiagramTask.js*/
chartDiag.orgChart.AlignDiagramTask = function (orientationOptionTask, itemsSizesOptionTask, visualTreeOptionTask, scaleOptionTask, printPreviewOptionTask,
	currentControlSizeTask, visualTreeTask, visualTreeLevelsTask, itemsPositionsTask, isFamilyChartMode) {
	var _data = {
		treeItemsPositions: {}, // chartDiag.orgChart.TreeItemPosition();
		treeLevelsPositions: [], // chartDiag.orgChart.TreeLevelPosition()
		panelSize: null // chartDiag.default.Rect();
	},
	_visualTree,
	_treeLevels,
	_activeTreeLevels,
	_treeItemsPositions,
	_treeLevelsPositions,

	_options,
	_orientationOptions,
	_printPreviewOptions,
	_visualTreeOptions,
	_scaleOptions;

	function process() {
		var placeholderSize = new chartDiag.default.Size(itemsPositionsTask.getContentSize()),
			panelSize = new chartDiag.default.Size(currentControlSizeTask.getOptimalPanelSize());
			

		_visualTree = visualTreeTask.getVisualTree();
		_treeLevels = visualTreeLevelsTask.getTreeLevels();
		_activeTreeLevels = visualTreeLevelsTask.getActiveTreeLevels();
		_treeItemsPositions = itemsPositionsTask.getItemsPositions();
		_treeLevelsPositions = itemsPositionsTask.getTreeLevelsPositions();

		_options = itemsSizesOptionTask.getOptions();
		_orientationOptions = orientationOptionTask.getOptions();
		_printPreviewOptions = printPreviewOptionTask.getOptions();
		_visualTreeOptions = visualTreeOptionTask.getOptions();
		_scaleOptions = scaleOptionTask.getOptions();

		switch (_orientationOptions.orientationType) {
			case 2/*chartDiag.default.OrientationType.Left*/:
			case 3/*chartDiag.default.OrientationType.Right*/:
				panelSize.invert();
				break;
		}

		panelSize.scale(1.0 / _scaleOptions.scale);

		// By default we translate everything forward
		_data.panelSize = panelSize;
		_data.treeItemsPositions = _treeItemsPositions;
		_data.treeLevelsPositions = _treeLevelsPositions;

		switch (_options.pageFitMode) {
			case 4/*chartDiag.default.PageFitMode.PrintPreview*/:
				_data.treeItemsPositions = {};
				_data.treeLevelsPositions = [];
				_data.panelSize = stretchToAvoidPageMargins(_data.treeItemsPositions, _data.treeLevelsPositions);
				break;
			case 5/*chartDiag.default.PageFitMode.AutoSize*/:
				_data.panelSize = new chartDiag.default.Size(placeholderSize);
				break;
			default:
				_data.panelSize = new chartDiag.default.Size(placeholderSize);
				if (placeholderSize.width < panelSize.width) {
					_data.treeItemsPositions = {};
					stretchToWidth(_data.treeItemsPositions, placeholderSize.width, panelSize.width);
					_data.panelSize.width = panelSize.width;
				}
				if (placeholderSize.height < panelSize.height) {
					_data.panelSize.height = panelSize.height;
				}
				break;
		}

		switch (_orientationOptions.orientationType) {
			case 2/*chartDiag.default.OrientationType.Left*/:
			case 3/*chartDiag.default.OrientationType.Right*/:
				_data.panelSize.invert();
				break;
		}

		return true;
	}

	function stretchToWidth(treeItemsPositions, treeWidth, panelWidth) {
		var offset;
		if (isFamilyChartMode) {
			offset = (panelWidth - treeWidth) / 2.0;
		} else {
			switch (_visualTreeOptions.horizontalAlignment) {
				case 1/*chartDiag.default.HorizontalAlignmentType.Left*/:
					offset = 0;
					break;
				case 2/*chartDiag.default.HorizontalAlignmentType.Right*/:
					offset = panelWidth - treeWidth;
					break;
				case 0/*chartDiag.default.HorizontalAlignmentType.Center*/:
					offset = (panelWidth - treeWidth) / 2.0;
					break;
			}
		}
		translateItemPositions(treeItemsPositions, offset, 0);
	}

	function translateItemPositions(treeItemsPositions, offsetX, offsetY) {
		var treeItemid, treeItemPosition;
		for (treeItemid in _treeItemsPositions) {
			if (_treeItemsPositions.hasOwnProperty(treeItemid)) {
				treeItemPosition = new chartDiag.orgChart.TreeItemPosition(_treeItemsPositions[treeItemid]);
				treeItemPosition.actualPosition.translate(offsetX, offsetY);
				treeItemsPositions[treeItemid] = treeItemPosition;
			}
		}
	}

	function stretchToAvoidPageMargins(treeItemsPositions, treeLevelsPositions) {
		var pageSize = new chartDiag.default.Size(_printPreviewOptions.printPreviewPageSize),
			treeLevelsItems, sortedItems,
			index, len,
			globalOffset, pageRightMargin, pageBottomMargin,
			item, treeLevel;

		pageSize.scale(1.0 / _scaleOptions.scale);

		switch (_orientationOptions.orientationType) {
			case 2/*chartDiag.default.OrientationType.Left*/:
			case 3/*chartDiag.default.OrientationType.Right*/:
				pageSize.invert();
				break;
		}

		/* streatch horizontally */
		globalOffset = 0;
		pageRightMargin = pageSize.width;
		_treeLevels.loopMerged(this,
			function (treeItemid) {
				var treeItemPosition = _treeItemsPositions[treeItemid],
					actualPosition = treeItemPosition.actualPosition;
				return actualPosition.x;
			},
			function (treeItemid, treeItem) {
				var treeItemPosition = new chartDiag.orgChart.TreeItemPosition(_treeItemsPositions[treeItemid]);
				treeItemsPositions[treeItemid] = treeItemPosition;

				if ((treeItemPosition.actualPosition.left() + globalOffset) < pageRightMargin && (treeItemPosition.actualPosition.right() + globalOffset) > pageRightMargin) {
					globalOffset += (pageRightMargin - treeItemPosition.actualPosition.left() - globalOffset) + _options.normalItemsInterval / 2.0;
				}

				treeItemPosition.actualPosition.translate(globalOffset, 0);

				if (treeItemPosition.actualPosition.left() > pageRightMargin) {
					pageRightMargin += pageSize.width;
				}
			}
		);

		/* streatch vertically */
		globalOffset = 0;
		pageBottomMargin = pageSize.height;
		_treeLevels.loopLevels(this, function (index, levelContext) {
			var treeLevelPosition = new chartDiag.orgChart.TreeLevelPosition(_treeLevelsPositions[index]);

			if ((treeLevelPosition.shift + globalOffset) < pageBottomMargin && (treeLevelPosition.shift + treeLevelPosition.depth + globalOffset) > pageBottomMargin) {
				globalOffset += (pageBottomMargin - treeLevelPosition.shift - globalOffset) + _options.normalLevelShift / 2.0;
			}

			treeLevelPosition.shiftDown(globalOffset);
			_treeLevels.loopLevelItems(this, index, function (treeItemId) {
				var treeItemPosition = treeItemsPositions[treeItemId];
				treeItemPosition.actualPosition.translate(0, globalOffset);
			});

			if (treeLevelPosition.shift > pageBottomMargin) {
				pageBottomMargin += pageSize.height;
			}
			treeLevelsPositions.push(treeLevelPosition);
		});
		return new chartDiag.default.Size(pageRightMargin + 1, pageBottomMargin + 1);
	}

	function getTreeItemForMousePosition(x, y) {
		var result = null,
			index,
			len,
			treeLevel,
			scale = _scaleOptions.scale;

		x = x / scale;
		y = y / scale;

		_activeTreeLevels.loopLevels(this, function (index, level) {
			var treeLevelPosition = _data.treeLevelsPositions[index];
			if (y > (treeLevelPosition.shift + treeLevelPosition.topConnectorShift) && y <= (treeLevelPosition.shift + treeLevelPosition.connectorShift)) {
				result = _visualTree.node( _activeTreeLevels.binarySearch(this, index, function (itemId) {
					var treeItemPosition = _data.treeItemsPositions[itemId];
					switch (treeItemPosition.actualVisibility) {
						case 1/*chartDiag.default.Visibility.Normal*/:
							if (treeItemPosition.actualPosition.contains(x, y)) {
								return 0;
							}//ignore jslint
						case 2/*chartDiag.default.Visibility.Dot*/://ignore jslint
						case 3/*chartDiag.default.Visibility.Line*/:
							return x - treeItemPosition.actualPosition.horizontalCenter();
						case 4/*chartDiag.default.Visibility.Invisible*/:
							throw "Clickable items collection should contain only visible items.";
					}

				}));//ignore jslint
				return true; // break
			}
		});

		return result;
	}

	function getNextLevelTreeItem(fromTreeItem, isBelow) {
		var fromTreeItemPosition = _data.treeItemsPositions[fromTreeItem],
			horizontalCenter = fromTreeItemPosition.actualPosition.horizontalCenter(),
			bestTreeItemId = fromTreeItem,
			bestDistance = null,
			distance;

		_activeTreeLevels.loopLevelsFromItem(this, fromTreeItem, isBelow, function (levelIndex) {
			_activeTreeLevels.loopLevelItems(this, levelIndex, function (itemid, item) {
				var treeItemPosition = _data.treeItemsPositions[itemid];
				if (treeItemPosition.actualVisibility == 1/*chartDiag.default.Visibility.Normal*/) {
					distance = Math.abs(horizontalCenter - treeItemPosition.actualPosition.horizontalCenter());
					if (distance < bestDistance || bestDistance == null) {
						bestDistance = distance;
						bestTreeItemId = itemid;
					} else {
						return true; // break
					}
				}
			});
			if (bestDistance != null) {
				return true; // break
			}
		});
		return bestTreeItemId;
	}

	function getNextTreeItem(fromTreeItem, isLeft) {
		var result = fromTreeItem.id,
			treeItemPosition;
		_activeTreeLevels.loopFromItem(this, fromTreeItem, isLeft, function (treeItemId) {
			treeItemPosition = _treeItemsPositions[treeItemId];
			if (treeItemPosition.actualVisibility == 1/*chartDiag.default.Visibility.Normal*/) {
				result = treeItemId;
				return true;
			}
		});
		return result;
	}

	function getTreeLevelsPositions() {
		return _data.treeLevelsPositions;
	}

	function getItemPosition(itemid) {
		return _data.treeItemsPositions[itemid];
	}

	function getItemsPositions() {
		return _data.treeItemsPositions;
	}

	function getContentSize() {
		return _data.panelSize;
	}

	return {
		process: process,
		getTreeLevelsPositions: getTreeLevelsPositions,
		getItemPosition: getItemPosition,
		getItemsPositions: getItemsPositions,
		getContentSize: getContentSize,

		getTreeItemForMousePosition: getTreeItemForMousePosition,
		getNextLevelTreeItem: getNextLevelTreeItem,
		getNextTreeItem: getNextTreeItem
	};
};

/* /Controls/OrgDiagram/Tasks/Layout/ApplyLayoutChangesTask.js*/
chartDiag.orgChart.ApplyLayoutChangesTask = function (getGraphics, getLayout, itemsSizesOptionTask, printPreviewOptionTask,
	currentControlSizeTask, scaleOptionTask, alignDiagramTask) {
	var _data = {
		scrollPanelSize: null
	},
	_printPreviewOptions,
	_itemsSizesOptions;

	function process() {
		var layout = getLayout(),
			graphics = getGraphics(),
			scaleOptions = scaleOptionTask.getOptions(),
			scale = scaleOptions.scale;

		_printPreviewOptions = printPreviewOptionTask.getOptions();
		_itemsSizesOptions = itemsSizesOptionTask.getOptions();

		/* set size of panel with content */
		var mousePanelSize = new chartDiag.default.Size(alignDiagramTask.getContentSize());
		mousePanelSize.scale(1 * scale);
		layout.mousePanel.css(mousePanelSize.getCSS());

		/* set size of panel with content */
		var panelSize = new chartDiag.default.Size(alignDiagramTask.getContentSize());
		layout.placeholder.css(panelSize.getCSS());
		graphics.resize("placeholder", panelSize.width, panelSize.height);

		/* resize element to fit placeholder if control in autosize or print preview mode */
		switch (_printPreviewOptions.pageFitMode) {
			case 5/*chartDiag.default.PageFitMode.AutoSize*/://ignore jslint
				_data.scrollPanelSize = new chartDiag.default.Size(mousePanelSize.width + 25, mousePanelSize.height + 25);
				_data.scrollPanelSize.cropBySize(_itemsSizesOptions.autoSizeMaximum);
				_data.scrollPanelSize.addSize(_itemsSizesOptions.autoSizeMinimum);//ignore jslint
				layout.element.css({
					"width": _data.scrollPanelSize.width + "px",
					"height": _data.scrollPanelSize.height + "px"
				});
				break;
			case 4/*chartDiag.default.PageFitMode.PrintPreview*/:
				_data.scrollPanelSize = new chartDiag.default.Size(mousePanelSize.width + 25, mousePanelSize.height + 25);
				layout.element.css({
					"width": _data.scrollPanelSize.width + "px",
					"height": _data.scrollPanelSize.height + "px"
				});
				break;
			default:
				_data.scrollPanelSize = new chartDiag.default.Size(currentControlSizeTask.getScrollPanelSize());
				break;
		}

		/* set scroll of content */
		/* pixel alignment of scroll panel */
		var position = layout.element.offset();

		layout.scrollPanel.css({
			"top": "0px",
			"left": "0px",
			"width": _data.scrollPanelSize.width + "px",
			"height": _data.scrollPanelSize.height + "px",
			"margin-bottom": "0px",
			"margin-right": "0px",
			"margin-top": (-position.top + Math.floor(position.top)) + "px",
			"margin-left": (-position.left + Math.floor(position.left)) + "px"
		});

		/* set CSS scale of content */
		var scaletext = "scale(" + scale + "," + scale + ")";

		layout.placeholder.css({
			"transform-origin": "0 0",
			"transform": scaletext,
			"-ms-transform": scaletext, /* IE 9 */
			"-webkit-transform": scaletext, /* Safari and Chrome */
			"-o-transform": scaletext, /* Opera */
			"-moz-transform": scaletext /* Firefox */
		});
		return true;
	}

	function getOptimalPanelSize() {
		return new chartDiag.default.Size(_data.scrollPanelSize.width - 25, _data.scrollPanelSize.height - 25);
	}

	return {
		process: process,
		getOptimalPanelSize: getOptimalPanelSize
	};
};

/* /Controls/OrgDiagram/Tasks/Layout/CenterOnCursorTask.js*/
/*
	This method should try to keep cursor item as close as possible to its previous position
*/
chartDiag.orgChart.CenterOnCursorTask = function (getLayout, currentControlSizeTask, currentScrollPositionTask, cursorItemTask, alignDiagramTask, createTransformTask, scaleOptionTask) {
	var _data = {
		placeholderOffset: null
	},
	_transform;

	function process() {
		var snapRect,
			layout = getLayout(),
			cursorTreeItemId = cursorItemTask.getCursorTreeItem(),
			treeItemPosition = alignDiagramTask.getItemPosition(cursorTreeItemId),
			scrollPanelSize,
			scaleOptions = scaleOptionTask.getOptions(),
			scale = scaleOptions.scale;

		_data.placeholderOffset = currentScrollPositionTask.getPlaceholderOffset();

		if (layout.forceCenterOnCursor) {
			_transform = createTransformTask.getTransform();
			if (treeItemPosition != null) {
				snapRect = getTransformedItemPosition(treeItemPosition.actualPosition);
				snapRect.scale(scale);
				scrollPanelSize = currentControlSizeTask.getScrollPanelSize();
				_data.placeholderOffset = new chartDiag.default.Point(
					Math.max(snapRect.horizontalCenter() - scrollPanelSize.width / 2, 0),
					Math.max(snapRect.verticalCenter() - scrollPanelSize.height / 2, 0)
				);
			}
		}
		return true;
	}

	function isAnnotationNeeded(snapRect, panelPosition) {
		return !panelPosition.overlaps(snapRect);
	}

	function getTransformedItemPosition(position) {
		var result = false;

		_transform.transformRect(position.x, position.y, position.width, position.height, true,
			this, function (x, y, width, height) {
				result = new chartDiag.default.Rect(x, y, width, height);
			}
		);
		return result;
	}

	function getPlaceholderOffset() {
		return _data.placeholderOffset;
	}

	return {
		process: process,
		getPlaceholderOffset: getPlaceholderOffset
	};
};

/* /Controls/OrgDiagram/Tasks/Layout/CreateTransformTask.js*/
chartDiag.orgChart.CreateTransformTask = function (orientationOptionTask, alignDiagramTask) {
	var _data = {
		transform: null
	},
	_activeTreeLevels;

	function process() {
		var orientationOptions = orientationOptionTask.getOptions();

		var panelSize = new chartDiag.default.Size(alignDiagramTask.getContentSize());

		_data.transform = new chartDiag.default.Transform();
		_data.transform.setOrientation(orientationOptions.orientationType);
		_data.transform.size = new chartDiag.default.Size(panelSize);

		return true;
	}

	function getTreeItemForMousePosition(x, y) {
		var result = null;
		_data.transform.transformPoint(x, y, false, this, function (x, y) {
			result = alignDiagramTask.getTreeItemForMousePosition(x, y);
		});
		return result;
	}

	function getTransform() {
		return _data.transform;
	}

	return {
		process: process,
		getTransform: getTransform,
		getTreeItemForMousePosition: getTreeItemForMousePosition,
		description: "Create oordiante system tranfromation object."
	};
};

/* /Controls/OrgDiagram/Tasks/Layout/CurrentControlSizeTask.js*/
chartDiag.orgChart.CurrentControlSizeTask = function (getLayout, optionsTask, itemsSizesOptionTask) {
	var _data = {
		scrollPanelSize: null
	},
	_hash = {},
	_dataTemplate = new chartDiag.default.ObjectReader({
		scrollPanelSize: new chartDiag.default.ObjectReader({
			width: new chartDiag.default.ValueReader(["number"], true),
			height: new chartDiag.default.ValueReader(["number"], true)
		}, true)
	});

	function process() {
		var context = {
			isChanged: false,
			hash: _hash
		},
		layout = getLayout(),
		currentLayout = {
			scrollPanelSize: new chartDiag.default.Size(layout.element.outerWidth(), layout.element.outerHeight())
		},
		result = false,
		options = itemsSizesOptionTask.getOptions();

		_data = _dataTemplate.read(_data, currentLayout, "layout", context);

		switch (options.pageFitMode) {
			case 1/*chartDiag.default.PageFitMode.PageWidth*/:
			case 2/*chartDiag.default.PageFitMode.PageHeight*/:
			case 3/*chartDiag.default.PageFitMode.FitToPage*/:
				result = context.isChanged;
				break;
			default:
				break;

		}

		return result;
	}

	function getScrollPanelSize() {
		return _data.scrollPanelSize;
	}

	function getOptimalPanelSize() {
		return new chartDiag.default.Size(_data.scrollPanelSize.width - 25, _data.scrollPanelSize.height - 25);
	}

	return {
		process: process,
		getScrollPanelSize: getScrollPanelSize,
		getOptimalPanelSize: getOptimalPanelSize
	};
};

/* /Controls/OrgDiagram/Tasks/Layout/CurrentScrollPositionTask.js*/
chartDiag.orgChart.CurrentScrollPositionTask = function (getLayout, optionsTask) {
	var _data = {
		placeholderOffset: null
	},
	_hash = {},
	_dataTemplate = new chartDiag.default.ObjectReader({
		placeholderOffset: new chartDiag.default.ObjectReader({
			x: new chartDiag.default.ValueReader(["number"], true),
			y: new chartDiag.default.ValueReader(["number"], true)
		}, true)
	});

	function process() {
		var context = {
			isChanged: false,
			hash: _hash
		},
		layout = getLayout(),
		currentLayout = {
			placeholderOffset: new chartDiag.default.Point(layout.scrollPanel.scrollLeft(), layout.scrollPanel.scrollTop())
		};
		_data = _dataTemplate.read(_data, currentLayout, "layout", context);

		return context.isChanged;
	}

	function getPlaceholderOffset() {
		return _data.placeholderOffset;
	}

	return {
		process: process,
		getPlaceholderOffset: getPlaceholderOffset
	};
};

/* /Controls/OrgDiagram/Tasks/Options/Annotations/BackgroundAnnotationOptionTask.js*/
chartDiag.orgChart.BackgroundAnnotationOptionTask = function (splitAnnotationsOptionTask, defaultBackgroundAnnotationConfig) {
	var _annotations = [],
		_hash = {};

	var _dataTemplate = new chartDiag.default.ArrayReader(
			new chartDiag.default.ObjectReader({
				items: new chartDiag.default.ArrayReader(
					new chartDiag.default.ValueReader(["string", "number"], true),
					true
				),
				includeChildren: new chartDiag.default.ValueReader(["boolean"], false, defaultBackgroundAnnotationConfig.includeChildren),
				zOrderType: new chartDiag.default.EnumerationReader(chartDiag.default.ZOrderType, false, defaultBackgroundAnnotationConfig.zOrderType),
				lineWidth: new chartDiag.default.ValueReader(["number"], false, defaultBackgroundAnnotationConfig.lineWidth),
				opacity: new chartDiag.default.ValueReader(["number"], false, defaultBackgroundAnnotationConfig.opacity),
				borderColor: new chartDiag.default.ValueReader(["string"], false, defaultBackgroundAnnotationConfig.borderColor),
				fillColor: new chartDiag.default.ValueReader(["string"], false, defaultBackgroundAnnotationConfig.fillColor),
				lineType: new chartDiag.default.EnumerationReader(chartDiag.default.LineType, false, defaultBackgroundAnnotationConfig.lineType),
				selectItems: new chartDiag.default.ValueReader(["boolean"], false, defaultBackgroundAnnotationConfig.selectItems)
			}),
			false
		);


	function process() {
		var context = {
			isChanged: false,
			hash: _hash
		};

		_annotations = _dataTemplate.read(_annotations, splitAnnotationsOptionTask.getAnnotations(4/*chartDiag.default.AnnotationType.Background*/, null), "annotations", context);

		return context.isChanged;
	}

	function getAnnotations() {
		return _annotations;
	}

	return {
		process: process,
		getAnnotations: getAnnotations
	};
};

/* /Controls/OrgDiagram/Tasks/Options/Annotations/ConnectorAnnotationOptionTask.js*/
chartDiag.orgChart.ConnectorAnnotationOptionTask = function (splitAnnotationsOptionTask, defaultConnectorAnnotationConfig, zOrderType) {
	var _annotations = [],
		_hash = {};

	var _dataTemplate = new chartDiag.default.ArrayReader(
			new chartDiag.default.ObjectReader({
				zOrderType: new chartDiag.default.EnumerationReader(chartDiag.default.ZOrderType, false, defaultConnectorAnnotationConfig.zOrderType),
				fromItem: new chartDiag.default.ValueReader(["string", "number"], true),
				toItem: new chartDiag.default.ValueReader(["string", "number"], true),
				connectorShapeType: new chartDiag.default.EnumerationReader(chartDiag.default.ShapeType, false, defaultConnectorAnnotationConfig.connectorShapeType),
				connectorPlacementType: new chartDiag.default.EnumerationReader(chartDiag.default.ConnectorPlacementType, false, defaultConnectorAnnotationConfig.connectorPlacementType),
				labelPlacementType: new chartDiag.default.EnumerationReader(chartDiag.default.ConnectorLabelPlacementType, false, defaultConnectorAnnotationConfig.labelPlacementType),
				offset: new chartDiag.default.ObjectReader({
					left: new chartDiag.default.ValueReader(["number"], false, defaultConnectorAnnotationConfig.offset.left),
					top: new chartDiag.default.ValueReader(["number"], false, defaultConnectorAnnotationConfig.offset.top),
					right: new chartDiag.default.ValueReader(["number"], false, defaultConnectorAnnotationConfig.offset.right),
					bottom: new chartDiag.default.ValueReader(["number"], false, defaultConnectorAnnotationConfig.offset.bottom)
				}, false, defaultConnectorAnnotationConfig.offset),
				lineWidth: new chartDiag.default.ValueReader(["number"], false, defaultConnectorAnnotationConfig.lineWidth),
				color: new chartDiag.default.ValueReader(["string"], false, defaultConnectorAnnotationConfig.color),
				lineType: new chartDiag.default.EnumerationReader(chartDiag.default.LineType, false, defaultConnectorAnnotationConfig.lineType),
				selectItems: new chartDiag.default.ValueReader(["boolean"], false, defaultConnectorAnnotationConfig.selectItems),
				label: new chartDiag.default.ValueReader(["string"], false, defaultConnectorAnnotationConfig.label),
				labelSize: new chartDiag.default.ObjectReader({
					width: new chartDiag.default.ValueReader(["number"], false, defaultConnectorAnnotationConfig.labelSize.width),
					height: new chartDiag.default.ValueReader(["number"], false, defaultConnectorAnnotationConfig.labelSize.height)
				}, false, defaultConnectorAnnotationConfig.labelSize)
			}),
			false
		);

	function process() {
		var context = {
			isChanged: false,
			hash: _hash
		};

		_annotations = _dataTemplate.read(_annotations, splitAnnotationsOptionTask.getAnnotations(0/*chartDiag.default.AnnotationType.Connector*/, zOrderType), "annotations", context);

		return context.isChanged;
	}

	function getAnnotations() {
		return _annotations;
	}

	return {
		process: process,
		getAnnotations: getAnnotations
	};
};

/* /Controls/OrgDiagram/Tasks/Options/Annotations/HighlightPathAnnotationOptionTask.js*/
chartDiag.orgChart.HighlightPathAnnotationOptionTask = function (splitAnnotationsOptionTask, defaultConfig, defaultHighlightPathAnnotationConfig) {
	var _data = {},
		_annotations = [],
		_hash = {};

	var _dataTemplate = new chartDiag.default.ObjectReader({
			highlightLinesColor: new chartDiag.default.ValueReader(["string"], false, defaultConfig.highlightLinesColor),
			highlightLinesWidth: new chartDiag.default.ValueReader(["number"], false, defaultConfig.highlightLinesWidth),
			highlightLinesType: new chartDiag.default.EnumerationReader(chartDiag.default.LineType, false, defaultConfig.highlightLinesType)
		}),
		_dataAnnotationsTemplate = new chartDiag.default.ArrayReader(
			new chartDiag.default.ObjectReader({
				items: new chartDiag.default.ArrayReader(
					new chartDiag.default.ValueReader(["string", "number"], true),
					false
				),
				selectItems: new chartDiag.default.ValueReader(["boolean"], false, defaultHighlightPathAnnotationConfig.selectItems)
			},
			false)
		);


	function process() {
		var context = {
			isChanged: false,
			hash: _hash
		};

		_data = _dataTemplate.read(_data, splitAnnotationsOptionTask.getAnnotations(2/*chartDiag.default.AnnotationType.HighlightPath*/, null), "options", context);
		_annotations = _dataAnnotationsTemplate.read(_annotations, splitAnnotationsOptionTask.getAnnotations(2/*chartDiag.default.AnnotationType.HighlightPath*/, null), "annotations", context);

		return context.isChanged;
	}

	function getAnnotations() {
		return _annotations;
	}

	function getHighlighPathOptions() {
		return _data;
	}

	return {
		process: process,
		getAnnotations: getAnnotations,
		getHighlighPathOptions: getHighlighPathOptions
	};
};

/* /Controls/OrgDiagram/Tasks/Options/Annotations/ShapeAnnotationOptionTask.js*/
chartDiag.orgChart.ShapeAnnotationOptionTask = function (splitAnnotationsOptionTask, defaultShapeAnnotationConfig, zOrderType) {
	var _annotations = [],
		_hash = {};

	var _dataTemplate = new chartDiag.default.ArrayReader(
			new chartDiag.default.ObjectReader({
				zOrderType: new chartDiag.default.EnumerationReader(chartDiag.default.ZOrderType, false, defaultShapeAnnotationConfig.zOrderType),
				items: new chartDiag.default.ArrayReader(
					new chartDiag.default.ValueReader(["string", "number"], true),
					true
				),
				shapeType: new chartDiag.default.EnumerationReader(chartDiag.default.ShapeType, false, defaultShapeAnnotationConfig.shapeType),
				offset: new chartDiag.default.ObjectReader({
					left: new chartDiag.default.ValueReader(["number"], false, defaultShapeAnnotationConfig.offset.left),
					top: new chartDiag.default.ValueReader(["number"], false, defaultShapeAnnotationConfig.offset.top),
					right: new chartDiag.default.ValueReader(["number"], false, defaultShapeAnnotationConfig.offset.right),
					bottom: new chartDiag.default.ValueReader(["number"], false, defaultShapeAnnotationConfig.offset.bottom)
				}, false, defaultShapeAnnotationConfig.offset),
				lineWidth: new chartDiag.default.ValueReader(["number"], false, defaultShapeAnnotationConfig.lineWidth),
				cornerRadius: new chartDiag.default.ValueReader(["string"], false, defaultShapeAnnotationConfig.cornerRadius),
				opacity: new chartDiag.default.ValueReader(["number"], false, defaultShapeAnnotationConfig.opacity),
				borderColor: new chartDiag.default.ValueReader(["string"], false, defaultShapeAnnotationConfig.borderColor),
				fillColor: new chartDiag.default.ValueReader(["string"], false, defaultShapeAnnotationConfig.fillColor),
				lineType: new chartDiag.default.EnumerationReader(chartDiag.default.LineType, false, defaultShapeAnnotationConfig.lineType),
				selectItems: new chartDiag.default.ValueReader(["boolean"], false, defaultShapeAnnotationConfig.selectItems),
				label: new chartDiag.default.ValueReader(["string"], false, defaultShapeAnnotationConfig.label),
				labelSize: new chartDiag.default.ObjectReader({
					width: new chartDiag.default.ValueReader(["number"], false, defaultShapeAnnotationConfig.labelSize.width),
					height: new chartDiag.default.ValueReader(["number"], false, defaultShapeAnnotationConfig.labelSize.height)
				}, false, defaultShapeAnnotationConfig.labelSize),
				labelPlacement: new chartDiag.default.EnumerationReader(chartDiag.default.PlacementType, false, defaultShapeAnnotationConfig.labelPlacement),
				labelOffset: new chartDiag.default.ValueReader(["number"], false, defaultShapeAnnotationConfig.labelOffset)
			},
			false
		)
		);


	function process() {
		var context = {
			isChanged: false,
			hash: _hash
		};

		_annotations = _dataTemplate.read(_annotations, splitAnnotationsOptionTask.getAnnotations(1/*chartDiag.default.AnnotationType.Shape*/, zOrderType), "annotations", context);

		return context.isChanged;
	}

	function getAnnotations() {
		return _annotations;
	}

	return {
		process: process,
		getAnnotations: getAnnotations
	};
};

/* /Controls/OrgDiagram/Tasks/Options/Annotations/SplitAnnotationsOptionTask.js*/
chartDiag.orgChart.SplitAnnotationsOptionTask = function (optionsTask) {
	var _data = {
		annotations: {}
	};

	function process() {
		var options = optionsTask.getOptions(),
			annotations = options.annotations,
			index, len,
			annotationConfig,
			annotationType,
			zOrderType,
			key,
			hash = {};

		if (Array.isArray(annotations)) {
			for (index = 0, len = annotations.length; index < len; index += 1) {
				annotationConfig = annotations[index];
				annotationType = annotationConfig.annotationType;

				switch (annotationType) {
					case 1/*chartDiag.default.AnnotationType.Shape*/:
					case 0/*chartDiag.default.AnnotationType.Connector*/:
						switch (annotationConfig.zOrderType) {
							case 1/*chartDiag.default.ZOrderType.Background*/:
								zOrderType = 1/*chartDiag.default.ZOrderType.Background*/;
								break;
							case 2/*chartDiag.default.ZOrderType.Foreground*/:
							case 0/*chartDiag.default.ZOrderType.Auto*/: //ignore jslint
							default: 
								zOrderType = 2/*chartDiag.default.ZOrderType.Foreground*/;
								break;
						}
						break;
					case 4/*chartDiag.default.AnnotationType.Background*/:
					case 2/*chartDiag.default.AnnotationType.HighlightPath*/:
					case 3/*chartDiag.default.AnnotationType.Label*/: //ignore jslint
					default:
						zOrderType = null;
						break;
				}

				if (annotationType != null) {
					key = annotationType * 1000 + (zOrderType || 0);

					if (!hash.hasOwnProperty(key)) {
						hash[key] = [];
					}
					hash[key].push(annotationConfig);
				}
			}
		}

		_data.annotations = hash;

		return true;
	}

	function getAnnotations(annotationType, zOrderType) {
		var key = annotationType * 1000 + (zOrderType || 0);
		return _data.annotations[key];
	}

	return {
		process: process,
		getAnnotations: getAnnotations
	};
};

/* /Controls/OrgDiagram/Tasks/Options/Selection/CursorItemOptionTask.js*/
chartDiag.orgChart.CursorItemOptionTask = function (optionsTask, defaultConfig) {
	var _data = {};

	var _dataTemplate = new chartDiag.default.ObjectReader({
		cursorItem: new chartDiag.default.ValueReader(["string", "number"], true),
		navigationMode: new chartDiag.default.EnumerationReader(chartDiag.default.NavigationMode, false, defaultConfig.navigationMode)
	});

	function process() {
		var context = {
			isChanged: false
		};

		_data = _dataTemplate.read(_data, optionsTask.getOptions(), "options", context);

		return context.isChanged;
	}

	function getCursorItem() {
		return _data.cursorItem;
	}

	function hasCursorEnabled() {
		switch (_data.navigationMode) {
			case 0/*chartDiag.default.NavigationMode.Default*/:
			case 1/*chartDiag.default.NavigationMode.CursorOnly*/:
				return true;
		}
		return false;
	}

	return {
		process: process,
		getCursorItem: getCursorItem,
		hasCursorEnabled: hasCursorEnabled,
		description: "Checks currenct cursor item option."
	};
};

/* /Controls/OrgDiagram/Tasks/Options/Selection/CursorSelectionPathModeOptionTask.js*/
chartDiag.orgChart.CursorSelectionPathModeOptionTask = function (optionsTask, defaultConfig) {
	var _data = {};

	var _dataTemplate = new chartDiag.default.ObjectReader({
			selectionPathMode: new chartDiag.default.EnumerationReader(chartDiag.default.SelectionPathMode, false, defaultConfig.selectionPathMode)
		});

	function process() {
		var context = {
			isChanged: false
		};

		_data = _dataTemplate.read(_data, optionsTask.getOptions(), "options", context);

		return context.isChanged;
	}

	function getSelectionPathMode() {
		return _data.selectionPathMode;
	}

	return {
		process: process,
		getSelectionPathMode: getSelectionPathMode,
		description: "Checks cursor selection path option."
	};
};

/* /Controls/OrgDiagram/Tasks/Options/Selection/HighlightItemOptionTask.js*/
chartDiag.orgChart.HighlightItemOptionTask = function (optionsTask, defaultConfig) {
	var _data = {};

	var _dataTemplate = new chartDiag.default.ObjectReader({
		highlightItem: new chartDiag.default.ValueReader(["string", "number"], true),
		navigationMode: new chartDiag.default.EnumerationReader(chartDiag.default.NavigationMode, false, defaultConfig.navigationMode)
		});

	function process() {
		var context = {
			isChanged: false
		};

		_data = _dataTemplate.read(_data, optionsTask.getOptions(), "options", context);

		return context.isChanged;
	}

	function getHighlightItem() {
		return _data.highlightItem;
	}


	function hasHighlightEnabled() {
		switch (_data.navigationMode) {
			case 0/*chartDiag.default.NavigationMode.Default*/:
			case 3/*chartDiag.default.NavigationMode.HighlightOnly*/:
				return true;
		}
		return false;
	}

	return {
		process: process,
		getHighlightItem: getHighlightItem,
		hasHighlightEnabled: hasHighlightEnabled,
		description: "Checks highlight item option."
	};
};

/* /Controls/OrgDiagram/Tasks/Options/Selection/SelectedItemsOptionTask.js*/
chartDiag.orgChart.SelectedItemsOptionTask = function (optionsTask) {
	var _data = {},
		_hash = {};

	var _dataTemplate = new chartDiag.default.ObjectReader({
			selectedItems: new chartDiag.default.ArrayReader(
				new chartDiag.default.ValueReader(["string", "number"], true),
				true
				)
		});

	function process() {
		var context = {
			isChanged: false,
			hash: _hash
		},
		options = optionsTask.getOptions();

		_data = _dataTemplate.read(_data, options, "options", context);
		return context.isChanged;
	}

	function getSelectedItems() {
		return _data.selectedItems;
	}

	return {
		process: process,
		getSelectedItems: getSelectedItems,
		description: "Checks user selected items option."
	};
};

/* /Controls/OrgDiagram/Tasks/Options/CalloutOptionTask.js*/
chartDiag.orgChart.CalloutOptionTask = function (optionsTask, defaultConfig, defaultItemConfig) {
	var _data = {},
		_hash = {};

	var _dataTemplate = new chartDiag.default.ObjectReader({
			showCallout: new chartDiag.default.ValueReader(["boolean"], false, defaultConfig.showCallout),

			defaultTemplateName: new chartDiag.default.ValueReader(["string"], true),
			defaultCalloutTemplateName: new chartDiag.default.ValueReader(["string"], true),

			calloutfillColor: new chartDiag.default.ValueReader(["string"], false, defaultConfig.calloutfillColor),
			calloutBorderColor: new chartDiag.default.ValueReader(["string"], true),
			calloutOffset: new chartDiag.default.ValueReader(["number"], false, defaultConfig.calloutOffset),
			calloutCornerRadius: new chartDiag.default.ValueReader(["number"], false, defaultConfig.calloutCornerRadius),
			calloutPointerWidth: new chartDiag.default.ValueReader(["string"], false, defaultConfig.calloutPointerWidth),
			calloutLineWidth: new chartDiag.default.ValueReader(["number"], false, defaultConfig.calloutLineWidth),
			calloutOpacity: new chartDiag.default.ValueReader(["number"], false, defaultConfig.calloutOpacity),

			items: new chartDiag.default.ArrayReader(
				new chartDiag.default.ObjectReader({
					id: new chartDiag.default.ValueReader(["string", "number"], true),
					showCallout: new chartDiag.default.ValueReader(["boolean"], false, defaultItemConfig.showCallout),
					calloutTemplateName: new chartDiag.default.ValueReader(["string"], true),
					templateName: new chartDiag.default.ValueReader(["string"], true)
				}),
				true,
				"id"
				)
		});

	function process() {
		var context = {
			isChanged: false,
			hash: _hash
		};

		_data = _dataTemplate.read(_data, optionsTask.getOptions(), "options", context);

		return context.isChanged;
	}

	function getItemOptions(itemid) {
		return _hash["options-items"][itemid];
	}

	function getOptions() {
		return _data;
	}

	return {
		process: process,
		getOptions: getOptions,
		getItemOptions: getItemOptions,
		description: "Checks item callout options."
	};
};

/* /Controls/OrgDiagram/Tasks/Options/ConnectorsOptionTask.js*/
chartDiag.orgChart.ConnectorsOptionTask = function (optionsTask, defaultConfig) {
	var _data = {},
		_hash = {};

	var _dataTemplate = new chartDiag.default.ObjectReader({
			arrowsDirection: new chartDiag.default.EnumerationReader(chartDiag.default.GroupByType, false, defaultConfig.arrowsDirection),
			connectorType: new chartDiag.default.EnumerationReader(chartDiag.default.ConnectorType, false, defaultConfig.hasOwnProperty("connectorType") ? defaultConfig.connectorType : 0/*chartDiag.default.ConnectorType.Squared*/),
			showNeigboursConnectorsHighlighted: new chartDiag.default.EnumerationReader(chartDiag.default.ConnectorType, false, defaultConfig.hasOwnProperty("showNeigboursConnectorsHighlighted") ? defaultConfig.showNeigboursConnectorsHighlighted : false),
			elbowType: new chartDiag.default.EnumerationReader(chartDiag.default.ElbowType, false, defaultConfig.elbowType),
			bevelSize: new chartDiag.default.ValueReader(["number"], false, defaultConfig.bevelSize),
			elbowDotSize: new chartDiag.default.ValueReader(["number"], false, defaultConfig.elbowDotSize),
			linesColor: new chartDiag.default.ValueReader(["string"], false, defaultConfig.linesColor),
			linesWidth: new chartDiag.default.ValueReader(["number"], false, defaultConfig.linesWidth),
			linesType: new chartDiag.default.EnumerationReader(chartDiag.default.LineType, false, defaultConfig.linesType),
			highlightLinesColor: new chartDiag.default.ValueReader(["string"], false, defaultConfig.highlightLinesColor),
			highlightLinesWidth: new chartDiag.default.ValueReader(["number"], false, defaultConfig.highlightLinesWidth),
			highlightLinesType: new chartDiag.default.EnumerationReader(chartDiag.default.LineType, false, defaultConfig.highlightLinesType)
		});

	function process() {
		var context = {
			isChanged: false,
			hash: _hash
		};

		_data = _dataTemplate.read(_data, optionsTask.getOptions(), "options", context);

		return context.isChanged;
	}

	function getOptions() {
		return _data;
	}

	return {
		process: process,
		getOptions: getOptions,
		description: "Checks connector lines drawing options."
	};
};

/* /Controls/OrgDiagram/Tasks/Options/ItemsOptionTask.js*/
chartDiag.orgChart.ItemsOptionTask = function (optionsTask, defaultItemConfig) {
	var _data = {},
		_hash = {},
		_sourceHash = {};

	var _dataTemplate = new chartDiag.default.ObjectReader({
			items: new chartDiag.default.ArrayReader(
				new chartDiag.default.ObjectReader({
					id: new chartDiag.default.ValueReader(["string", "number"], true),
					parent: new chartDiag.default.ValueReader(["string", "number"], true),
					itemType: new chartDiag.default.EnumerationReader(chartDiag.orgChart.ItemType, false, defaultItemConfig.itemType),
					adviserPlacementType: new chartDiag.default.EnumerationReader(chartDiag.default.AdviserPlacementType, false, defaultItemConfig.adviserPlacementType),
					childrenPlacementType: new chartDiag.default.EnumerationReader(chartDiag.default.ChildrenPlacementType, false, defaultItemConfig.childrenPlacementType),
					isVisible: new chartDiag.default.ValueReader(["boolean"], false, defaultItemConfig.isVisible),
					isActive: new chartDiag.default.ValueReader(["boolean"], false, defaultItemConfig.isActive)
				}),
				true,
				"id",
				true
				)
		});

	function process() {
		var context = {
			isChanged: false,
			hash: _hash,
			sourceHash: _sourceHash
		};

		_data = _dataTemplate.read(_data, optionsTask.getOptions(), "options", context);

		return context.isChanged;
	}

	function getItems() {
		return _data.items;
	}

	function getConfig(itemId) {
		return _sourceHash["options-items"][itemId];
	}

	return {
		process: process,
		getItems: getItems,
		getConfig: getConfig,
		description: "Checks items configuration options effecting their placement in layout."
	};
};

/* /Controls/OrgDiagram/Tasks/Options/ItemsSizesOptionTask.js*/
chartDiag.orgChart.ItemsSizesOptionTask = function (optionsTask, defaultConfig, defaultItemConfig, defaultButtonConfig) {
	var _data = {},
		_hash = {};

	var _dataTemplate = new chartDiag.default.ObjectReader({
			/*item template options*/
			defaultTemplateName: new chartDiag.default.ValueReader(["string"], true),
			defaultLabelAnnotationTemplate: new chartDiag.default.ValueReader(["string"], true),
			hasSelectorCheckbox: new chartDiag.default.EnumerationReader(chartDiag.default.Enabled, false, defaultConfig.hasSelectorCheckbox),
			hasButtons: new chartDiag.default.EnumerationReader(chartDiag.default.Enabled, false, defaultConfig.hasButtons),
			buttonsPanelSize: new chartDiag.default.ValueReader(["number"], false, defaultConfig.buttonsPanelSize),
			groupTitlePanelSize: new chartDiag.default.ValueReader(["number"], false, defaultConfig.groupTitlePanelSize),
			checkBoxPanelSize: new chartDiag.default.ValueReader(["number"], false, defaultConfig.checkBoxPanelSize),
			selectCheckBoxLabel: new chartDiag.default.ValueReader(["string"], false, defaultConfig.selectCheckBoxLabel),
			buttons: new chartDiag.default.ArrayReader(new chartDiag.default.ObjectReader({
						name: new chartDiag.default.ValueReader(["string"], true),
						icon: new chartDiag.default.ValueReader(["string"], true),
						text: new chartDiag.default.ValueReader(["boolean"], false, false),
						tooltip: new chartDiag.default.ValueReader(["string"], true),
						size: new chartDiag.default.ObjectReader({
							width: new chartDiag.default.ValueReader(["number"], false, defaultButtonConfig.size.width),
							height: new chartDiag.default.ValueReader(["number"], false, defaultButtonConfig.size.height)
						}, false, defaultButtonConfig.size)
				}),
				true,
				"name"
			),
			/* items visibility */
			pageFitMode: new chartDiag.default.EnumerationReader(chartDiag.default.PageFitMode, false, defaultConfig.pageFitMode),
			minimalVisibility: new chartDiag.default.EnumerationReader(chartDiag.default.Visibility, false, defaultConfig.minimalVisibility),
			selectionPathMode: new chartDiag.default.EnumerationReader(chartDiag.default.SelectionPathMode, false, defaultConfig.selectionPathMode),
			autoSizeMinimum: new chartDiag.default.ObjectReader({
				width: new chartDiag.default.ValueReader(["number"], false, defaultConfig.autoSizeMinimum.width),
				height: new chartDiag.default.ValueReader(["number"], false, defaultConfig.autoSizeMinimum.height)
			}, false, defaultConfig.autoSizeMinimum),
			autoSizeMaximum: new chartDiag.default.ObjectReader({
				width: new chartDiag.default.ValueReader(["number"], false, defaultConfig.autoSizeMaximum.width),
				height: new chartDiag.default.ValueReader(["number"], false, defaultConfig.autoSizeMaximum.height)
			}, false, defaultConfig.autoSizeMaximum),
			/* scale */
			scale: new chartDiag.default.ValueReader(["number"], false, defaultConfig.scale),
			maximumScale: new chartDiag.default.ValueReader(["number"], false, defaultConfig.maximumScale),
			minimumScale: new chartDiag.default.ValueReader(["number"], false, defaultConfig.minimumScale),
			/*intervals*/
			normalLevelShift: new chartDiag.default.ValueReader(["number"], false, defaultConfig.normalLevelShift),
			dotLevelShift: new chartDiag.default.ValueReader(["number"], false, defaultConfig.dotLevelShift),
			lineLevelShift: new chartDiag.default.ValueReader(["number"], false, defaultConfig.lineLevelShift),
			normalItemsInterval: new chartDiag.default.ValueReader(["number"], false, defaultConfig.normalItemsInterval),
			dotItemsInterval: new chartDiag.default.ValueReader(["number"], false, defaultConfig.dotItemsInterval),
			lineItemsInterval: new chartDiag.default.ValueReader(["number"], false, defaultConfig.lineItemsInterval),
			/*cousiins branches interval multiplier*/
			cousinsIntervalMultiplier: new chartDiag.default.ValueReader(["number"], false, defaultConfig.cousinsIntervalMultiplier),

			verticalAlignment: new chartDiag.default.EnumerationReader(chartDiag.default.VerticalAlignmentType, false, defaultConfig.verticalAlignment),

			items: new chartDiag.default.ArrayReader(
				new chartDiag.default.ObjectReader({
					id: new chartDiag.default.ValueReader(["string", "number"], true),
					groupTitle: new chartDiag.default.ValueReader(["string", "number"], true),
					isVisible: new chartDiag.default.ValueReader(["boolean", "number"], false, defaultItemConfig.isVisible),
					isActive: new chartDiag.default.ValueReader(["boolean", "number"], false, defaultItemConfig.isActive),
					hasSelectorCheckbox: new chartDiag.default.EnumerationReader(chartDiag.default.Enabled, false, defaultItemConfig.hasSelectorCheckbox),
					hasButtons: new chartDiag.default.EnumerationReader(chartDiag.default.Enabled, false, defaultItemConfig.hasButtons),
					templateName: new chartDiag.default.ValueReader(["string"], true)
				}),
				true,
				"id"
				)
		});

	function process() {
		var context = {
			isChanged: false,
			hash: _hash
		};

		_data = _dataTemplate.read(_data, optionsTask.getOptions(), "options", context);

		return context.isChanged;
	}

	function getItemOptions(itemid) {
		return _hash["options-items"][itemid];
	}

	function getOptions() {
		return _data;
	}

	return {
		process: process,
		getItemOptions: getItemOptions,
		getOptions: getOptions,
		description: "Checks items size options."
	};
};

/* /Controls/OrgDiagram/Tasks/Options/LabelsOptionTask.js*/
chartDiag.orgChart.LabelsOptionTask = function (optionsTask, defaultConfig, defaultItemConfig) {
	var _data = {},
		_hash = {};

	var _dataTemplate = new chartDiag.default.ObjectReader({
			showLabels: new chartDiag.default.EnumerationReader(chartDiag.default.Enabled, false, defaultConfig.showLabels),
			labelOffset: new chartDiag.default.ValueReader(["number"], false, defaultConfig.labelOffset),
			labelFontSize: new chartDiag.default.ValueReader(["string"], false, defaultConfig.labelFontSize),
			labelFontFamily: new chartDiag.default.ValueReader(["string"], false, defaultConfig.labelFontFamily),
			labelFontStyle: new chartDiag.default.ValueReader(["string"], false, defaultConfig.labelFontStyle),
			labelFontWeight: new chartDiag.default.ValueReader(["string"], false, defaultConfig.labelFontWeight),
			labelColor: new chartDiag.default.ValueReader(["string"], false, defaultConfig.labelColor),
			labelSize: new chartDiag.default.ObjectReader({
				width: new chartDiag.default.ValueReader(["number"], false, defaultConfig.labelSize.width),
				height: new chartDiag.default.ValueReader(["number"], false, defaultConfig.labelSize.height)
			}, false, defaultConfig.labelSize),
			labelOrientation: new chartDiag.default.EnumerationReader(chartDiag.text.TextOrientationType, false, defaultConfig.labelOrientation),
			labelPlacement: new chartDiag.default.EnumerationReader(chartDiag.default.PlacementType, false, defaultConfig.labelPlacement),
			arrowsDirection: new chartDiag.default.EnumerationReader(chartDiag.default.GroupByType, false, defaultConfig.arrowsDirection),
			items: new chartDiag.default.ArrayReader(
				new chartDiag.default.ObjectReader({
					id: new chartDiag.default.ValueReader(["string", "number"], true),
					label: new chartDiag.default.ValueReader(["string", "number"], true),
					showLabel: new chartDiag.default.EnumerationReader(chartDiag.default.Enabled, false, defaultItemConfig.showLabel),
					labelSize: new chartDiag.default.ObjectReader({
						width: new chartDiag.default.ValueReader(["number"], false, 0),
						height: new chartDiag.default.ValueReader(["number"], false, 0)
					}, true),
					labelOrientation: new chartDiag.default.EnumerationReader(chartDiag.text.TextOrientationType, false, defaultItemConfig.labelOrientation),
					labelPlacement: new chartDiag.default.EnumerationReader(chartDiag.default.PlacementType, false, defaultItemConfig.labelPlacement)
				}),
				true,
				"id"
				)
		});

	function process() {
		var context = {
			isChanged: false,
			hash: _hash
		};

		_data = _dataTemplate.read(_data, optionsTask.getOptions(), "options", context);

		return context.isChanged;
	}

	function getItemOptions(itemid) {
		return _hash["options-items"][itemid];
	}

	function getOptions() {
		return _data;
	}

	return {
		process: process,
		getItemOptions: getItemOptions,
		getOptions: getOptions,
		description: "Checks items labels options."
	};
};

/* /Controls/OrgDiagram/Tasks/Options/MinimizedItemsOptionTask.js*/
chartDiag.orgChart.MinimizedItemsOptionTask = function (optionsTask) {
	var _data = {},
		_hash = {};

	var _dataTemplate = new chartDiag.default.ObjectReader({
			minimizedItemShapeType: new chartDiag.default.EnumerationReader(chartDiag.default.ShapeType, true),
			items: new chartDiag.default.ArrayReader(
				new chartDiag.default.ObjectReader({
					id: new chartDiag.default.ValueReader(["string", "number"], true),
					minimizedItemShapeType: new chartDiag.default.EnumerationReader(chartDiag.default.ShapeType, true),
					itemTitleColor: new chartDiag.default.ValueReader(["string"], true)
				}),
				true,
				"id"
				)
		});

	function process() {
		var context = {
			isChanged: false,
			hash: _hash
		};

		_data = _dataTemplate.read(_data, optionsTask.getOptions(), "options", context);

		return context.isChanged;
	}

	function getItemOptions(itemid) {
		return _hash["options-items"][itemid];
	}

	function getOptions() {
		return _data;
	}

	return {
		process: process,
		getItemOptions: getItemOptions,
		getOptions: getOptions,
		description: "Checks minimized items drawing options."
	};
};

/* /Controls/OrgDiagram/Tasks/Options/OptionsTask.js*/
chartDiag.orgChart.OptionsTask = function (getOptions) {

	function process() {
		return true;
	}

	return {
		process: process,
		getOptions: getOptions,
		description: "Raw options."
	};
};

/* /Controls/OrgDiagram/Tasks/Options/OrientationOptionTask.js*/
chartDiag.orgChart.OrientationOptionTask = function (optionsTask, defaultConfig) {
	var _data = {},
		_hash = {};

	var _dataTemplate = new chartDiag.default.ObjectReader({
			orientationType: new chartDiag.default.EnumerationReader(chartDiag.default.OrientationType, false, defaultConfig.orientationType)
		});

	function process() {
		var context = {
			isChanged: false,
			hash: _hash
		};

		_data = _dataTemplate.read(_data, optionsTask.getOptions(), "options", context);

		return context.isChanged;
	}

	function getOptions() {
		return _data;
	}

	return {
		process: process,
		getOptions: getOptions,
		description: "Checks diagram orientation options."
	};
};

/* /Controls/OrgDiagram/Tasks/Options/PrintPreviewOptionTask.js*/
chartDiag.orgChart.PrintPreviewOptionTask = function (optionsTask, defaultConfig) {
	var _data = {},
		_hash = {};

	var _dataTemplate = new chartDiag.default.ObjectReader({
			pageFitMode: new chartDiag.default.EnumerationReader(chartDiag.default.PageFitMode, false, defaultConfig.pageFitMode),
			printPreviewPageSize: new chartDiag.default.ObjectReader({
				width: new chartDiag.default.ValueReader(["number"], false, defaultConfig.printPreviewPageSize.width),
				height: new chartDiag.default.ValueReader(["number"], false, defaultConfig.printPreviewPageSize.height)
			}, false, defaultConfig.printPreviewPageSize)
		});

	function process() {
		var context = {
			isChanged: false,
			hash: _hash
		};

		_data = _dataTemplate.read(_data, optionsTask.getOptions(), "options", context);

		return context.isChanged;
	}

	function getOptions() {
		return _data;
	}

	return {
		process: process,
		getOptions: getOptions,
		description: "Checks options of print preview mode."
	};
};

/* /Controls/OrgDiagram/Tasks/Options/ScaleOptionTask.js*/
chartDiag.orgChart.ScaleOptionTask = function (optionsTask, defaultConfig) {
	var _data = {},
		_hash = {};

	var _dataTemplate = new chartDiag.default.ObjectReader({
			scale: new chartDiag.default.ValueReader(["number"], false, defaultConfig.scale),
			minimumScale: new chartDiag.default.ValueReader(["number"], false, defaultConfig.minimumScale),
			maximumScale: new chartDiag.default.ValueReader(["number"], false, defaultConfig.maximumScale)
		});
	function process() {
		var context = {
			isChanged: false,
			hash: _hash
		};

		_data = _dataTemplate.read(_data, optionsTask.getOptions(), "options", context);

		return context.isChanged;
	}

	function getOptions() {
		return _data;
	}

	return {
		process: process,
		getOptions: getOptions,
		description: "Checks control scale options."
	};
};

/* /Controls/OrgDiagram/Tasks/Options/TemplatesOptionTask.js*/
chartDiag.orgChart.TemplatesOptionTask = function (optionsTask, defaultConfig, defaultButtonConfig, defaultTemplateConfig) {
	var _data = {},
		_hash = {};

	var _dataTemplate = new chartDiag.default.ObjectReader({
			itemTitleFirstFontColor: new chartDiag.default.ValueReader(["string"], false, defaultConfig.itemTitleFirstFontColor),
			itemTitleSecondFontColor: new chartDiag.default.ValueReader(["string"], false, defaultConfig.itemTitleSecondFontColor),
			selectCheckBoxLabel: new chartDiag.default.ValueReader(["string"], false, defaultConfig.selectCheckBoxLabel),
			onItemRender: new chartDiag.default.FunctionReader(),
			onCursorRender: new chartDiag.default.FunctionReader(),
			onHighlightRender: new chartDiag.default.FunctionReader(),
			templates: new chartDiag.default.ArrayReader(
				new chartDiag.default.ObjectReader({
					name: new chartDiag.default.ValueReader(["string"], true),
					isActive: new chartDiag.default.ValueReader(["boolean"], false, defaultTemplateConfig.isActive),
					itemSize: new chartDiag.default.ObjectReader({
						width: new chartDiag.default.ValueReader(["number"], false, defaultTemplateConfig.itemSize.width),
						height: new chartDiag.default.ValueReader(["number"], false, defaultTemplateConfig.itemSize.height)
					}, false, defaultTemplateConfig.itemSize),
					itemBorderWidth: new chartDiag.default.ValueReader(["number"], false, defaultTemplateConfig.itemBorderWidth),
					itemTemplate: new chartDiag.default.ValueReader(["string"], true),
					minimizedItemShapeType: new chartDiag.default.EnumerationReader(chartDiag.default.ShapeType, true),
					minimizedItemSize: new chartDiag.default.ObjectReader({
						width: new chartDiag.default.ValueReader(["number"], false, defaultTemplateConfig.minimizedItemSize.width),
						height: new chartDiag.default.ValueReader(["number"], false, defaultTemplateConfig.minimizedItemSize.height)
					}, false, defaultTemplateConfig.minimizedItemSize),
					minimizedItemCornerRadius: new chartDiag.default.ValueReader(["number"], true),
					minimizedItemLineWidth: new chartDiag.default.ValueReader(["number"], false, defaultTemplateConfig.minimizedItemLineWidth),
					minimizedItemBorderColor: new chartDiag.default.ValueReader(["string"], true),
					minimizedItemLineType: new chartDiag.default.EnumerationReader(chartDiag.default.LineType, false, defaultTemplateConfig.minimizedItemLineType),
					minimizedItemFillColor: new chartDiag.default.ValueReader(["string"], true),
					minimizedItemOpacity: new chartDiag.default.ValueReader(["number"], false, defaultTemplateConfig.minimizedItemOpacity),
					highlightPadding: new chartDiag.default.ObjectReader({
						left: new chartDiag.default.ValueReader(["number"], false, defaultTemplateConfig.highlightPadding.left),
						top: new chartDiag.default.ValueReader(["number"], false, defaultTemplateConfig.highlightPadding.top),
						right: new chartDiag.default.ValueReader(["number"], false, defaultTemplateConfig.highlightPadding.right),
						bottom: new chartDiag.default.ValueReader(["number"], false, defaultTemplateConfig.highlightPadding.bottom)
					}, false, defaultTemplateConfig.highlightPadding),
					highlightBorderWidth: new chartDiag.default.ValueReader(["number"], false, defaultTemplateConfig.highlightBorderWidth),
					highlightTemplate: new chartDiag.default.ValueReader(["string"], true),
					cursorPadding: new chartDiag.default.ObjectReader({
						left: new chartDiag.default.ValueReader(["number"], false, defaultTemplateConfig.cursorPadding.left),
						top: new chartDiag.default.ValueReader(["number"], false, defaultTemplateConfig.cursorPadding.top),
						right: new chartDiag.default.ValueReader(["number"], false, defaultTemplateConfig.cursorPadding.right),
						bottom: new chartDiag.default.ValueReader(["number"], false, defaultTemplateConfig.cursorPadding.bottom)
					}, false, defaultTemplateConfig.cursorPadding),
					cursorBorderWidth: new chartDiag.default.ValueReader(["number"], false, defaultTemplateConfig.cursorBorderWidth),
					cursorTemplate: new chartDiag.default.ValueReader(["string"], true),
					buttons: new chartDiag.default.ArrayReader(new chartDiag.default.ObjectReader({
						name: new chartDiag.default.ValueReader(["string"], true),
						icon: new chartDiag.default.ValueReader(["string"], true),
						text: new chartDiag.default.ValueReader(["boolean"], false, false),
						tooltip: new chartDiag.default.ValueReader(["string"], true),
						size: new chartDiag.default.ObjectReader({
							width: new chartDiag.default.ValueReader(["number"], false, defaultButtonConfig.size.width),
							height: new chartDiag.default.ValueReader(["number"], false, defaultButtonConfig.size.height)
						}, false, defaultButtonConfig.size)
					}),
					true,
					"name"
					)
				}),
				true,
				"name"
				)
		});


	function process() {
		var context = {
			isChanged: false,
			hash: _hash
		};

		_data = _dataTemplate.read(_data, optionsTask.getOptions(), "options", context);

		return context.isChanged;
	}

	function getOptions() {
		return _data;
	}

	return {
		process: process,
		getOptions: getOptions,
		description: "Checks items template options."
	};
};

/* /Controls/OrgDiagram/Tasks/Options/VisualTreeOptionTask.js*/
chartDiag.orgChart.VisualTreeOptionTask = function (optionsTask, defaultConfig) {
	var _data = {},
		_hash = {};

	var _dataTemplate = new chartDiag.default.ObjectReader({
			leavesPlacementType: new chartDiag.default.EnumerationReader(chartDiag.default.ChildrenPlacementType, false, defaultConfig.leavesPlacementType),
			childrenPlacementType: new chartDiag.default.EnumerationReader(chartDiag.default.ChildrenPlacementType, false, defaultConfig.childrenPlacementType),
			maximumColumnsInMatrix: new chartDiag.default.ValueReader(["number"], false, defaultConfig.maximumColumnsInMatrix),
			horizontalAlignment: new chartDiag.default.EnumerationReader(chartDiag.default.HorizontalAlignmentType, false, defaultConfig.horizontalAlignment)
		});

	function process() {
		var context = {
			isChanged: false,
			hash: _hash
		};

		_data = _dataTemplate.read(_data, optionsTask.getOptions(), "options", context);

		return context.isChanged;
	}

	function getOptions() {
		return _data;
	}

	return {
		process: process,
		getOptions: getOptions,
		description: "Checks items layout options."
	};
};

/* /Controls/OrgDiagram/Tasks/Renders/OffsetResolver/CollinearVectorBundle.js*/
chartDiag.orgChart.CollinearVectorBundle = function () {
	var _boundingRect = new chartDiag.default.Rect(),
		_vectors = [],
		_continuations = [];

	function addVector(vector, continuation) {
		_vectors.push(vector);
		_continuations.push(continuation);

		_boundingRect.addRect(vector.from.x, vector.from.y);
		_boundingRect.addRect(vector.to.x, vector.to.y);
	}

	function loopProjections(callback) { // calback(from, to)
		var index, len,
			vector;
		if (_boundingRect.width > _boundingRect.height) {
			for (index = 0, len = _vectors.length; index < len; index += 1) {
				vector = _vectors[index];
				callback(vector.from.x, vector.to.x, _continuations[index]);
			}
		} else {
			for (index = 0, len = _vectors.length; index < len; index += 1) {
				vector = _vectors[index];
				callback(vector.from.y, vector.to.y, _continuations[index]);
			}
		}
	}

	function resolve() {
		if (_vectors.length == 1) {
			_continuations[0](0, 1, 1);
		} else {
			var stackSegments = chartDiag.default.pile();
			loopProjections(function (from, to, continuation) {
				stackSegments.add(from, to, continuation);
			});

			var totalOffset = stackSegments.resolve(this, function (from, to, context, offset, bundleSize, direction) {
				context(offset, bundleSize, direction);
			});
		}
	}

	return {
		addVector: addVector,
		resolve: resolve
	};
};

/* /Controls/OrgDiagram/Tasks/Renders/OffsetResolver/ConnectorAnnotationOffsetResolver.js*/
chartDiag.orgChart.ConnectorAnnotationOffsetResolver = function () {
	var _bundles = {};

	function getOffset(vector, callback) {
		var key = vector.getLineKey();

		if (!_bundles.hasOwnProperty(key)) {
			_bundles[key] = new chartDiag.orgChart.CollinearVectorBundle();
		}

		_bundles[key].addVector(vector, callback);
	}

	function resolve() {
		for (var key in _bundles) {
			if (_bundles.hasOwnProperty(key)) {
				var bundle = _bundles[key];
				bundle.resolve();
			}
		}
	}

	return {
		getOffset: getOffset,
		resolve: resolve
	};
};

/* /Controls/OrgDiagram/Tasks/Renders/DrawBackgroundAnnotationTask.js*/
chartDiag.orgChart.DrawBackgroundAnnotationTask = function (getGraphics, createTranfromTask, applyLayoutChangesTask,
	backgroundAnnotationOptionTask, navigationFamilyTask, alignDiagramTask, backgroundAnnotationManagerTask) {
	var _graphics,
		_transform;

	function process() {
		var annotations = backgroundAnnotationOptionTask.getAnnotations(),
			backgroundManager,
			navigationFamily;

		_graphics = getGraphics();
		_graphics.reset("placeholder", 2/*chartDiag.default.Layers.BackgroundAnnotation*/);

		if (annotations.length > 0) {
			_transform = createTranfromTask.getTransform();

			backgroundManager = backgroundAnnotationManagerTask.getBackgroundManager();
			navigationFamily = navigationFamilyTask.getNavigationFamily();

			drawAnnotations(annotations, backgroundManager, navigationFamily);
		}

		return false;
	}

	function drawAnnotations(annotations, backgroundManager, navigationFamily) {
		var panel,
			index, len,
			index2, len2,
			index3, len3,
			fromItem,
			toItem,
			shape,
			defaultConfig,
			items, itemsHash, item, position,
			properties, property,
			annotationConfig,
			uiHash,
			perimeters, treeItem, treeItemPosition;

		for (index = 0, len = annotations.length; index < len; index += 1) {
			annotationConfig = annotations[index];

			if (annotationConfig.items != null && annotationConfig.items.length > 0) {
				shape = new chartDiag.default.Perimeter(_graphics);
				shape.transform = _transform;
				defaultConfig = new chartDiag.orgChart.BackgroundAnnotationConfig();
				properties = ["opacity", "lineWidth", "borderColor", "fillColor", "lineType"];
				for (index3 = 0, len3 = properties.length; index3 < len3; index3 += 1) {
					property = properties[index3];
					shape[property] = annotationConfig.hasOwnProperty(property) ? annotationConfig[property] : defaultConfig[property];
				}
				panel = _graphics.activate("placeholder", 2/*chartDiag.default.Layers.BackgroundAnnotation*/);

				items = [];
				itemsHash = {};
				if (annotationConfig.includeChildren) {
					for (index2 = 0, len2 = annotationConfig.items.length; index2 < len2; index2 += 1) {
						item = annotationConfig.items[index2];
						treeItemPosition = alignDiagramTask.getItemPosition(item);
						if (treeItemPosition != null) {
							itemsHash[item] = true;
							items.push(item);

							navigationFamily.loopChildren(this, item, function (childItemId, childItem) {
								if (!itemsHash[childItemId]) {
									itemsHash[childItemId] = true;
									items.push(childItemId);
								}
							}); //ignore jslint
						}
					}
				} else {
					items = annotationConfig.items;
				}

				perimeters = backgroundManager.getMergedPerimeters(items);
				for (index2 = 0; index2 < perimeters.length; index2 += 1) {
					shape.draw(perimeters[index2]);
				}
			}
		}
	}

	return {
		process: process
	};
};

/* /Controls/OrgDiagram/Tasks/Renders/DrawConnectorAnnotationTask.js*/
chartDiag.orgChart.DrawConnectorAnnotationTask = function (getGraphics, createTranfromTask, applyLayoutChangesTask,
	orientationOptionTask, connectorAnnotationOptionTask, alignDiagramTask, annotationLabelTemplateTask, zOrderType) {
	var _graphics,
		_transform,
		_orientationOptions,
		_annotationLabelTemplate,
		_panelSize;

	function process() {

		_graphics = getGraphics();

		_transform = createTranfromTask.getTransform();
		_orientationOptions = orientationOptionTask.getOptions();

		_annotationLabelTemplate = annotationLabelTemplateTask.getTemplate();

		_panelSize = new chartDiag.default.Size(alignDiagramTask.getContentSize());

		switch (zOrderType) {
			case 1/*chartDiag.default.ZOrderType.Background*/://ignore jslint
				_graphics.reset("placeholder", 4/*chartDiag.default.Layers.BackgroundConnectorAnnotation*/);
				break;
			case 2/*chartDiag.default.ZOrderType.Foreground*/://ignore jslint
				_graphics.reset("placeholder",  12/*chartDiag.default.Layers.ForegroundConnectorAnnotation*/);
				break;
		}

		drawAnnotations(connectorAnnotationOptionTask.getAnnotations(), alignDiagramTask.getItemPosition);

		return false;
	}

	function drawAnnotations(annotations, getItemPosition) {
		var panel,
			index, len,
			layer = 12/*chartDiag.default.Layers.ForegroundConnectorAnnotation*/,
			fromItemPosition, fromActualPosition,
			toItemPosition, toActualPosition,
			shape,
			annotationConfig,
			uiHash,
			buffer = new chartDiag.default.PolylinesBuffer(),
			labelPlacement,
			connectorAnnotationOffsetResolver = chartDiag.orgChart.ConnectorAnnotationOffsetResolver(),
			maximumLineWidth = 0;

		switch (zOrderType) {
			case 1/*chartDiag.default.ZOrderType.Background*/://ignore jslint
				panel = _graphics.activate("placeholder", 4/*chartDiag.default.Layers.BackgroundConnectorAnnotation*/);
				break;
			case 2/*chartDiag.default.ZOrderType.Foreground*/://ignore jslint
				panel = _graphics.activate("placeholder", 12/*chartDiag.default.Layers.ForegroundConnectorAnnotation*/);
				break;
		}

		for (index = 0, len = annotations.length; index < len; index += 1) {
			annotationConfig = annotations[index];
			maximumLineWidth = Math.max(maximumLineWidth, annotationConfig.lineWidth);
		}

		for (index = 0, len = annotations.length; index < len; index += 1) {
			annotationConfig = annotations[index];

			if (annotationConfig.fromItem != null && annotationConfig.toItem != null) {
				fromItemPosition = getItemPosition(annotationConfig.fromItem);
				toItemPosition = getItemPosition(annotationConfig.toItem);
				if (fromItemPosition != null && toItemPosition != null) {
					fromActualPosition = fromItemPosition.actualPosition;
					toActualPosition = toItemPosition.actualPosition;

					switch (annotationConfig.connectorPlacementType) {
						case 0/*chartDiag.default.ConnectorPlacementType.Offbeat*/:
							shape = new chartDiag.default.ConnectorOffbeat();
							break;
						case 1/*chartDiag.default.ConnectorPlacementType.Straight*/:
							shape = new chartDiag.default.ConnectorStraight();
							break;
					}

					/* rotate label size to user orientation */
					var labelSize;
					_transform.transformRect(0, 0, annotationConfig.labelSize.width, annotationConfig.labelSize.height, false,
					this, function (x, y, width, height) {
						labelSize = new chartDiag.default.Size(width, height);
					});

					/* rotate panel size to user orientation */
					var panelSize = null;
					_transform.transformRect(0, 0, _panelSize.width, _panelSize.height, false,
					this, function (x, y, width, height) {
						panelSize = new chartDiag.default.Size(width, height);
					});

					var linePaletteItem = new chartDiag.default.PaletteItem({
						lineColor: annotationConfig.color,
						lineWidth: annotationConfig.lineWidth,
						lineType: annotationConfig.lineType
					});

					var hasLabel = !chartDiag.default.isNullOrEmpty(annotationConfig.label);

					/* offset rectangles */
					var fromRect = new chartDiag.default.Rect(fromActualPosition).offset(annotationConfig.offset);
					var toRect = new chartDiag.default.Rect(toActualPosition).offset(annotationConfig.offset);

					var linesOffset = annotationConfig.lineWidth * 3;
					var bundleOffset = maximumLineWidth * 6;

					/* create connection lines */
					shape.draw(buffer, linePaletteItem, fromRect, toRect, linesOffset, bundleOffset, labelSize, panelSize,
						annotationConfig.connectorShapeType, 4 /*labelOffset*/, annotationConfig.labelPlacementType, hasLabel,
						connectorAnnotationOffsetResolver, function (labelPlacement) {
							if (hasLabel && labelPlacement != null) {
								/* translate result label placement back to users orientation */
								_transform.transformRect(labelPlacement.x, labelPlacement.y, labelPlacement.width, labelPlacement.height, true,
									this, function (x, y, width, height) {
										labelPlacement = new chartDiag.default.Rect(x, y, width, height);
									});

								uiHash = new chartDiag.default.RenderEventArgs();
								uiHash.context = annotationConfig;

								/* draw label */
								_graphics.template(
									labelPlacement.x
									, labelPlacement.y
									, 0
									, 0
									, 0
									, 0
									, labelPlacement.width
									, labelPlacement.height
									, _annotationLabelTemplate.template()
									, _annotationLabelTemplate.getHashCode()
									, _annotationLabelTemplate.render
									, uiHash
									, null
								);
							}
						});
				}
			}
		}

		connectorAnnotationOffsetResolver.resolve();


		/* translate result polylines back to users orientation */
		buffer.transform(_transform, true);
		/* draw background polylines */
		_graphics.polylinesBuffer(buffer);
	}

	return {
		process: process
	};
};

/* /Controls/OrgDiagram/Tasks/Renders/DrawConnectorsTask.js*/
chartDiag.orgChart.DrawConnectorsTask = function (getGraphics, createTranfromTask, applyLayoutChangesTask,
	connectorsOptionTask, visualTreeTask, visualTreeLevelsTask, alignDiagramTask, tracePathAnnotationsTask, extraPartnersTask, showElbowDots, paletteManagerTask) {
	var _graphics,
		_transform,
		_connectorsOptionTask,
		_visualTree,
		_treeLevels,
		_treeLevelsPositions,
		_treeItemsPositions,
		_paletteManager,
		_debug = false;

	function process() {

		_graphics = getGraphics();

		_transform = createTranfromTask.getTransform();
		_connectorsOptionTask = connectorsOptionTask.getOptions();
		_visualTree = visualTreeTask.getVisualTree();
		_treeLevels = visualTreeLevelsTask.getTreeLevels();
		_treeLevelsPositions = alignDiagramTask.getTreeLevelsPositions();
		_treeItemsPositions = alignDiagramTask.getItemsPositions();
		_paletteManager = paletteManagerTask.getPaletteManager();

		_graphics.reset("placeholder", 5/*chartDiag.default.Layers.Connector*/);

		redrawConnectors(showElbowDots);

		return false;
	}

	function redrawConnectors(showElbowDots) {
		var panel = _graphics.activate("placeholder", 5/*chartDiag.default.Layers.Connector*/),
			treeItem, treeItems,
			treeLevel,
			buffer,
			index, len,
			levelIndex;

		if (_visualTree.hasNodes()) {
			buffer = new chartDiag.default.PolylinesBuffer();
			_treeLevels.loopLevels(this, function (levelIndex, levelContext) {
				var treeLevelPosition = _treeLevelsPositions[levelIndex];
				_treeLevels.loopLevelItems(this, levelIndex, function (itemid) {
					var treeItem = _visualTree.node(itemid),
						treeItemPosition = _treeItemsPositions[itemid];
					redrawConnector(panel.hasGraphics, buffer, _paletteManager, treeItem, treeItemPosition, treeLevelPosition, showElbowDots);
				});
			});
			_graphics.polylinesBuffer(buffer);
		}
	}

	function redrawConnector(hasGraphics, buffer, paletteManager, parentTreeItem, parentTreeItemPosition, parentTreeLevelPosition, showElbowDots) {
		var hideConnectors,
			points, partnerPoints,
			children,
			treeItem, treeItemId, treeItemPosition, treeItemHighlightPath,
			treeLevelPosition,
			index,
			itemToLeftPosition,
			itemToRightPosition,
			isSquared,
			hasSquared,
			parentHorizontalCenter,
			partnersConnectorOffset,
			connectorStyleType = 0/*chartDiag.default.ConnectorStyleType.Extra*/,
			connectorPoint,
			connectorStep,
			chartHasSquaredConnectors = (_connectorsOptionTask.connectorType === 0/*chartDiag.default.ConnectorType.Squared*/),
			paletteItem, polyline;


		/* Find offset of horizontal connector line between partners */
		if (parentTreeItemPosition.partnerConnectorOffset > 0) {
			partnersConnectorOffset = parentTreeLevelPosition.shift + parentTreeLevelPosition.connectorShift - parentTreeLevelPosition.levelSpace / 2 * (parentTreeLevelPosition.partnerConnectorOffset - parentTreeItemPosition.partnerConnectorOffset + 1);
		} else {
			if (parentTreeItem.connectorPlacement & 4/*chartDiag.default.SideFlag.Bottom*/) {
				partnersConnectorOffset = parentTreeItemPosition.actualPosition.bottom();
			} else {
				partnersConnectorOffset = parentTreeLevelPosition.shift + parentTreeLevelPosition.connectorShift;
			}
		}

		/*draw every connector line with style from linesPalette, if linesPalette collection is empty then default style is used for all connectors
			seelcted style depends on children connector offset index
		*/

		/* partners offsets starts from 1
			children offsets start from 0 */

		if (parentTreeItemPosition.partnerConnectorOffset <= 1) {
			paletteManager.selectPalette(0);
		} else {
			if (parentTreeItemPosition.partnerConnectorOffset > 1) {
				paletteManager.selectPalette(parentTreeItemPosition.partnerConnectorOffset - 1);
			} else {
				paletteManager.selectPalette(parentTreeLevelPosition.partnerConnectorOffset);
			}
		}

		if (_visualTree.hasChildren(parentTreeItem.id)) {
			hideConnectors = (parentTreeItemPosition.actualVisibility === 4/*chartDiag.default.Visibility.Invisible*/) && (_visualTree.parentid(parentTreeItem.id) == null);
			parentHorizontalCenter = parentTreeItemPosition.actualPosition.horizontalCenter();
		}

		/* Draw connector line between parent and its partners, grouping of parents */
		partnerPoints = [];
		var parentExtraPartners = extraPartnersTask.getOrgPartners(parentTreeItem.id);
		if (parentTreeItem.partners.length > 1 || parentExtraPartners.length > 0) {
			children = parentTreeItem.partners;
			if (parentTreeItem.partners.length === 0) {
				children.push(parentTreeItem.id);
			}
			for (index = 0; index < children.length; index += 1) {
				treeItemId = children[index];
				treeItem = _visualTree.node(treeItemId);
				treeItemHighlightPath = tracePathAnnotationsTask.getHighlightPath(treeItemId);
				treeItemPosition = _treeItemsPositions[treeItemId];

				connectorPoint = new chartDiag.orgChart.ConnectorPoint(treeItemPosition.actualPosition.horizontalCenter(), treeItemPosition.actualPosition.bottom());
				connectorPoint.isSquared = true;
				connectorPoint.highlightPath = treeItemHighlightPath.partnerHighlightPath;
				connectorPoint.connectorStyleType = treeItemHighlightPath.partnerHighlightPath ? 2/*chartDiag.default.ConnectorStyleType.Highlight*/ : 1/*chartDiag.default.ConnectorStyleType.Regular*/;
				connectorPoint.visibility = treeItemPosition.actualVisibility;
				partnerPoints.push(connectorPoint);
			}

			children = parentExtraPartners;
			for (index = 0; index < children.length; index += 1) {
				treeItemId = children[index];
				treeItem = _visualTree.node(treeItemId);
				treeItemHighlightPath = tracePathAnnotationsTask.getHighlightPath(treeItemId);
				treeItemPosition = _treeItemsPositions[treeItemId];

				connectorPoint = new chartDiag.orgChart.ConnectorPoint(treeItemPosition.actualPosition.horizontalCenter(), treeItemPosition.actualPosition.bottom());
				connectorPoint.isSquared = true;
				connectorPoint.highlightPath = treeItemHighlightPath.partnerHighlightPath;
				connectorPoint.connectorStyleType = treeItemHighlightPath.partnerHighlightPath ? 2/*chartDiag.default.ConnectorStyleType.Highlight*/ : 0/*chartDiag.default.ConnectorStyleType.Extra*/;
				connectorPoint.visibility = treeItemPosition.actualVisibility;
				partnerPoints.push(connectorPoint);
			}

			if (partnerPoints.length > 0) {
				partnerPoints.sort(function (a, b) { return a.x - b.x; });

				if (!_visualTree.hasChildren(parentTreeItem.id)) {
					parentHorizontalCenter = (partnerPoints[0].x + partnerPoints[partnerPoints.length - 1].x) / 2.0;
				}
				buffer.addInverted(function (invertedBuffer) {
					drawTopConnectors(invertedBuffer, paletteManager, parentHorizontalCenter, partnersConnectorOffset, partnerPoints, true, hasGraphics, _connectorsOptionTask.arrowsDirection == 1/*chartDiag.default.GroupByType.Parents*/);
				});
			}
		}

		/* Draw connector lines between parent and its children */
		points = [];
		if (_visualTree.hasChildren(parentTreeItem.id)) {
			hasSquared = false;

			_visualTree.loopChildren(this, parentTreeItem.id, function (treeItemId, treeItem, level) {
				treeLevelPosition = _treeLevelsPositions[_treeLevels.getLevelIndex(treeItemId)];
				treeItemPosition = _treeItemsPositions[treeItemId];
				treeItemHighlightPath = tracePathAnnotationsTask.getHighlightPath(treeItemId);
				paletteItem = paletteManager.getPalette(treeItemHighlightPath.highlightPath ? 2/*chartDiag.default.ConnectorStyleType.Highlight*/ : 1/*chartDiag.default.ConnectorStyleType.Regular*/);
				polyline = buffer.getPolyline(paletteItem);

				if (treeItem.connectorPlacement & 8/*chartDiag.default.SideFlag.Left*/) {
					itemToLeftPosition = _treeItemsPositions[_treeLevels.getPrevItem(treeItemId)];
					_transform.transformPoints(treeItemPosition.actualPosition.x, treeLevelPosition.shift + treeLevelPosition.horizontalConnectorsDepth,
						itemToLeftPosition.actualPosition.right(), treeLevelPosition.shift + treeLevelPosition.horizontalConnectorsDepth, true, this, function (fromX, fromY, toX, toY) {
							drawLineWithArrow(fromX, fromY, toX, toY, buffer, polyline, treeItemPosition.actualVisibility, itemToLeftPosition.actualVisibility);
						});//ignore jslint
				} else if (treeItem.connectorPlacement & 2/*chartDiag.default.SideFlag.Right*/) {
					itemToRightPosition = _treeItemsPositions[_treeLevels.getNextItem(treeItemId)];
					_transform.transformPoints(treeItemPosition.actualPosition.right(), treeLevelPosition.shift + treeLevelPosition.horizontalConnectorsDepth,
						itemToRightPosition.actualPosition.x, treeLevelPosition.shift + treeLevelPosition.horizontalConnectorsDepth, true, this, function (fromX, fromY, toX, toY) {
							drawLineWithArrow(fromX, fromY, toX, toY, buffer, polyline, treeItemPosition.actualVisibility, itemToRightPosition.actualVisibility);
						});//ignore jslint
				} else if (treeItem.connectorPlacement & 1/*chartDiag.default.SideFlag.Top*/) {
					if (!hideConnectors) {
						isSquared = true;
						if (hasGraphics) {
							switch (treeItemPosition.actualVisibility) {
								case 2/*chartDiag.default.Visibility.Dot*/:
								case 3/*chartDiag.default.Visibility.Line*/:
									isSquared = chartHasSquaredConnectors;
									break;
							}
						}
						connectorStep = 0;
						connectorPoint = new chartDiag.orgChart.ConnectorPoint(treeItemPosition.actualPosition.horizontalCenter() + connectorStep, treeItemPosition.actualPosition.top());
						connectorPoint.isSquared = isSquared;
						connectorPoint.connectorStyleType = treeItemHighlightPath.highlightPath ? 2/*chartDiag.default.ConnectorStyleType.Highlight*/ : 1/*chartDiag.default.ConnectorStyleType.Regular*/;
						connectorPoint.visibility = treeItemPosition.actualVisibility;
						points.push(connectorPoint);

						connectorStyleType = Math.max(connectorStyleType, connectorPoint.connectorStyleType);

						/* is true if any child point has squared connector */
						hasSquared = hasSquared || connectorPoint.isSquared;
					}
				}
			});


			/* draw connector lines between regular children, grouping of children */
			/* connectors are drawn from children up to the parent */
			if (!hideConnectors && points.length > 0) {
				/* Draw vertical line segment between parent and horizontal line connecting its children  */
				_transform.transformPoints(parentHorizontalCenter, partnersConnectorOffset,
					parentHorizontalCenter, parentTreeLevelPosition.shift + parentTreeLevelPosition.connectorShift,
					true, this, function (fromX, fromY, toX, toY) {
						var elbowDotRadius = Math.round(_connectorsOptionTask.elbowDotSize / 2),
							paletteItem = paletteManager.getPalette(connectorStyleType),
							polyline = buffer.getPolyline(paletteItem),
							dotPolyline = buffer.getPolyline(polyline.arrowPaletteItem);

						if (showElbowDots && _connectorsOptionTask.elbowType != 0/*chartDiag.default.ElbowType.None*/ && parentTreeItem.partners.length > 0) {
							dotPolyline.addSegment(new chartDiag.default.DotSegment(fromX - elbowDotRadius, fromY - elbowDotRadius, elbowDotRadius * 2, elbowDotRadius * 2, elbowDotRadius));
						}
						buffer.addInverted(function (invertedBuffer) {
							var polyline = invertedBuffer.getPolyline(paletteItem);
							polyline.addSegment(new chartDiag.default.MoveSegment(toX, toY));
							polyline.addSegment(new chartDiag.default.LineSegment(fromX, fromY));

							if (_connectorsOptionTask.arrowsDirection == 1/*chartDiag.default.GroupByType.Parents*/ && parentTreeItem.visibility !== 4/*chartDiag.default.Visibility.Invisible*/ && partnerPoints.length <= 1) {
								polyline.addArrow(_connectorsOptionTask.linesWidth, function (polyline) {
									polyline.mergeTo(buffer.getPolyline(polyline.paletteItem));
								}); //ignore jslint
							}
						});
						if (showElbowDots && _connectorsOptionTask.elbowType !== 0/*chartDiag.default.ElbowType.None*/ && points.length > 1) {
							dotPolyline.addSegment(new chartDiag.default.DotSegment(toX - elbowDotRadius, toY - elbowDotRadius, elbowDotRadius * 2, elbowDotRadius * 2, elbowDotRadius));
						}
					});
				drawTopConnectors(buffer, paletteManager, parentHorizontalCenter, parentTreeLevelPosition.shift + parentTreeLevelPosition.connectorShift, points, hasSquared, hasGraphics, _connectorsOptionTask.arrowsDirection == 2/*chartDiag.default.GroupByType.Children*/);
			}
		}

	}

	function drawLineWithArrow(fromX, fromY, toX, toY, buffer, polyline, fromVisibility, toVisibility) {
		var first = new chartDiag.default.Point(fromX, fromY),
			second = new chartDiag.default.Point(toX, toY),
			hasArrow = false;

		switch (_connectorsOptionTask.arrowsDirection) {
			case 0/*chartDiag.default.GroupByType.None*/:
				break;
			case 1/*chartDiag.default.GroupByType.Parents*/:
				if (toVisibility != 4/*chartDiag.default.Visibility.Invisible*/) {
					hasArrow = true;
				}
				break;
			case 2/*chartDiag.default.GroupByType.Children*/:
				if (fromVisibility != 4/*chartDiag.default.Visibility.Invisible*/) {
					first.swap(second);
					hasArrow = true;
				}
				break;
		}
		polyline.addSegment(new chartDiag.default.MoveSegment(first));
		polyline.addSegment(new chartDiag.default.LineSegment(second));
		if (hasArrow) {
			polyline.addArrow(_connectorsOptionTask.linesWidth, function (polyline) {
				polyline.mergeTo(buffer.getPolyline(polyline.paletteItem));
			}); //ignore jslint
		}
	}

	function drawTopConnectors(buffer, paletteManager, parentX, parentY, points, hasSquared, hasGraphics, hasArrows) {
		var startIndex, endIndex, len,
			connectorPoint, curvedPoints = [],
			firstLast,
			startX, endX,
			index,
			paletteItem, polyline,
			left, right, styleType,
			leftPosition, rightPosition,
			bevelSize;

		if (hasSquared) {
			/* draw curved or angular lines on left side of pack */
			curvedPoints = [];
			for (startIndex = 0, len = points.length; startIndex < len; startIndex += 1) {
				connectorPoint = points[startIndex];
				if (connectorPoint.x < parentX && !connectorPoint.isSquared) {
					curvedPoints.push(connectorPoint);
				} else {
					break;
				}
			}
			len = curvedPoints.length;
			if (len > 0) {
				drawAngularConnectors(buffer, paletteManager, parentX, parentY, curvedPoints, false, hasArrows);
			}

			/* draw curved or angular lines on right side of pack */
			curvedPoints = [];
			for (endIndex = points.length - 1; endIndex >= startIndex; endIndex -= 1) {
				connectorPoint = points[endIndex];

				if (connectorPoint.x > parentX && !connectorPoint.isSquared) {
					curvedPoints.push(connectorPoint);
				} else {
					break;
				}
			}

			len = curvedPoints.length;
			if (len > 0) {
				drawAngularConnectors(buffer, paletteManager, parentX, parentY, curvedPoints, false, hasArrows);
			}

			left = {};
			right = {};
			for (styleType in chartDiag.default.ConnectorStyleType) {
				if (chartDiag.default.ConnectorStyleType.hasOwnProperty(styleType)) {
					left[chartDiag.default.ConnectorStyleType[styleType]] = parentX;
					right[chartDiag.default.ConnectorStyleType[styleType]] = parentX;
				}
			}

			/* calculate elbows of vertical connectors and draw dots */
			for (index = startIndex; index <= endIndex; index += 1) {
				connectorPoint = points[index];

				paletteItem = paletteManager.getPalette(connectorPoint.connectorStyleType);
				polyline = buffer.getPolyline(paletteItem);

				bevelSize = _connectorsOptionTask.bevelSize;
				if (bevelSize < 2) {
					bevelSize = 0;
				}
				if (hasGraphics) {
					switch (_connectorsOptionTask.elbowType) {
						case 2/*chartDiag.default.ElbowType.Bevel*/:
						case 3/*chartDiag.default.ElbowType.Round*/:
							if (bevelSize > 0 && Math.abs(parentX - connectorPoint.x) > bevelSize && Math.abs(parentY - connectorPoint.y) > bevelSize) {
								connectorPoint.hasElbow = true;
								connectorPoint.elbowPoint1 = new chartDiag.default.Point(connectorPoint.x, parentY + (parentY > connectorPoint.y ? -bevelSize : bevelSize));
								connectorPoint.elbowPoint2 = new chartDiag.default.Point(connectorPoint.x + (parentX > connectorPoint.x ? bevelSize : -bevelSize), parentY);
							}
							break;
						case 1/*chartDiag.default.ElbowType.Dot*/:
							if (endIndex - startIndex > 0) {
								_transform.transformPoints(connectorPoint.x, parentY, connectorPoint.x, connectorPoint.y, true, this, function (fromX, fromY, toX, toY) {
									var elbowDotRadius = Math.round(_connectorsOptionTask.elbowDotSize / 2),
										dotPolyline = buffer.getPolyline(polyline.arrowPaletteItem);

									dotPolyline.addSegment(new chartDiag.default.DotSegment(fromX - elbowDotRadius, fromY - elbowDotRadius, elbowDotRadius * 2, elbowDotRadius * 2, elbowDotRadius));
								});//ignore jslint
							}
							break;
						default:
							break;
					}
				}
				left[connectorPoint.connectorStyleType] = Math.min(left[connectorPoint.connectorStyleType], connectorPoint.hasElbow ? connectorPoint.elbowPoint2.x : connectorPoint.x);
				right[connectorPoint.connectorStyleType] = Math.max(right[connectorPoint.connectorStyleType], connectorPoint.hasElbow ? connectorPoint.elbowPoint2.x : connectorPoint.x);
			}

			/* calculate left/right margins of segments drawn from parent point to sides */
			firstLast = [Math.max(0, startIndex - 1), Math.min(endIndex + 1, points.length - 1)];
			for (index = 0; index < firstLast.length; index += 1) {
				connectorPoint = points[firstLast[index]];

				left[connectorPoint.connectorStyleType] = Math.min(left[connectorPoint.connectorStyleType], connectorPoint.hasElbow ? connectorPoint.elbowPoint2.x : connectorPoint.x);
				right[connectorPoint.connectorStyleType] = Math.max(right[connectorPoint.connectorStyleType], connectorPoint.hasElbow ? connectorPoint.elbowPoint2.x : connectorPoint.x);
			}

			/* draw horizontal segments from parent connector to sides */
			leftPosition = parentX;
			rightPosition = parentX;
			for (index = 2/*chartDiag.default.ConnectorStyleType.Highlight*/; index >= 0/*chartDiag.default.ConnectorStyleType.Extra*/; index -= 1) {
				paletteItem = paletteManager.getPalette(index);
				polyline = buffer.getPolyline(paletteItem);

				startX = left[index];
				if (startX != null && startX < leftPosition) {
					_transform.transformPoints(leftPosition, parentY, startX, parentY, true, this, function (startX, startY, endX, endY) {
						polyline.addSegment(new chartDiag.default.MoveSegment(startX, startY));
						polyline.addSegment(new chartDiag.default.LineSegment(endX, endY));
					}); //ignore jslint

					leftPosition = startX;
				}

				endX = right[index];
				if (endX != null && endX > rightPosition) {
					_transform.transformPoints(rightPosition, parentY, endX, parentY, true, this, function (startX, startY, endX, endY) {
						polyline.addSegment(new chartDiag.default.MoveSegment(startX, startY));
						polyline.addSegment(new chartDiag.default.LineSegment(endX, endY));
					}); //ignore jslint

					rightPosition = endX;
				}
			}

			/* draw vertical segments with/without elbows */
			for (index = startIndex; index <= endIndex; index += 1) {
				connectorPoint = points[index];

				paletteItem = paletteManager.getPalette(connectorPoint.connectorStyleType);
				polyline = buffer.getPolyline(paletteItem);

				if (connectorPoint.hasElbow) {
					_transform.transform3Points(connectorPoint.elbowPoint2.x, connectorPoint.elbowPoint2.y,
													connectorPoint.elbowPoint1.x, connectorPoint.elbowPoint2.y,
													connectorPoint.elbowPoint1.x, connectorPoint.elbowPoint1.y, true, this,
						function (fromX, fromY, toX, toY, toX2, toY2) {
							switch (_connectorsOptionTask.elbowType) {
								case 2/*chartDiag.default.ElbowType.Bevel*/:
									polyline.addSegment(new chartDiag.default.MoveSegment(fromX, fromY));
									polyline.addSegment(new chartDiag.default.LineSegment(toX2, toY2));
									break;
								case 3/*chartDiag.default.ElbowType.Round*/:
									polyline.addSegment(new chartDiag.default.MoveSegment(fromX, fromY));
									polyline.addSegment(new chartDiag.default.CubicArcSegment(fromX, fromY, toX, toY, toX2, toY2));
									break;
							}
						});//ignore jslint

					_transform.transformPoints(connectorPoint.elbowPoint1.x, connectorPoint.elbowPoint1.y, connectorPoint.x, connectorPoint.y, true, this, function (fromX, fromY, toX, toY) {
						polyline.addSegment(new chartDiag.default.LineSegment(toX, toY));
					}); //ignore jslint
				} else {
					_transform.transformPoints(connectorPoint.x, parentY, connectorPoint.x, connectorPoint.y, true, this, function (fromX, fromY, toX, toY) {
						polyline.addSegment(new chartDiag.default.MoveSegment(fromX, fromY));
						polyline.addSegment(new chartDiag.default.LineSegment(toX, toY));
					}); //ignore jslint
				}
				if (hasGraphics && hasArrows && connectorPoint.visibility != 4/*chartDiag.default.Visibility.Invisible*/) {
					polyline.addArrow(_connectorsOptionTask.linesWidth, function (polyline) {
						polyline.mergeTo(buffer.getPolyline(polyline.paletteItem));
					}); //ignore jslint
				}
			}
		} else {
			/* all lines are angular or curved */
			drawAngularConnectors(buffer, paletteManager, parentX, parentY, points, true, hasArrows);
		}
	}

	function drawAngularConnectors(buffer, paletteManager, parentX, parentY, points, drawToParent, hasArrows) {
		var joinPointX = null,
			index,
			len = points.length,
			rect,
			parentPoint, point,
			paletteItem, polyline;

		if (drawToParent) {
			joinPointX = parentX;
		} else {
			joinPointX = points[len - 1].x;
		}

		parentPoint = new chartDiag.default.Point(joinPointX, parentY);

		for (index = 0; index < len; index += 1) {
			point = points[index];

			paletteItem = paletteManager.getPalette(point.connectorStyleType);
			polyline = buffer.getPolyline(paletteItem);

			_transform.transformPoint(joinPointX, parentY, true, this, function (x, y) {
				polyline.addSegment(new chartDiag.default.MoveSegment(x, y));
			});//ignore jslint
			switch (_connectorsOptionTask.connectorType) {
				case 1/*chartDiag.default.ConnectorType.Angular*/:
					_transform.transformPoint(point.x, point.y, true, this, function (x, y) {
						polyline.addSegment(new chartDiag.default.LineSegment(x, y));

					});//ignore jslint
					break;
				case 2/*chartDiag.default.ConnectorType.Curved*/:
					rect = new chartDiag.default.Rect(parentPoint, point);

					if (drawToParent) {
						if (joinPointX > rect.x) {
							_transform.transform3Points(rect.right(), rect.verticalCenter(), rect.x, rect.verticalCenter(), rect.x, rect.bottom(), true,
								this, function (cpX1, cpY1, cpX2, cpY2, x, y) {
									polyline.addSegment(new chartDiag.default.CubicArcSegment(cpX1, cpY1, cpX2, cpY2, x, y));
								});//ignore jslint
						}
						else {
							_transform.transform3Points(rect.x, rect.verticalCenter(), rect.right(), rect.verticalCenter(), rect.right(), rect.bottom(), true,
								this, function (cpX1, cpY1, cpX2, cpY2, x, y) {
									polyline.addSegment(new chartDiag.default.CubicArcSegment(cpX1, cpY1, cpX2, cpY2, x, y));
								});//ignore jslint
						}
					} else {
						if (joinPointX > rect.x) {
							_transform.transformPoints(rect.x, rect.y, rect.x, rect.bottom(), true,
								this, function (cpX, cpY, x, y) {
									polyline.addSegment(new chartDiag.default.QuadraticArcSegment(cpX, cpY, x, y));
								});//ignore jslint
						} else {
							_transform.transformPoints(rect.right(), rect.y, rect.right(), rect.bottom(), true,
								this, function (cpX, cpY, x, y) {
									polyline.addSegment(new chartDiag.default.QuadraticArcSegment(cpX, cpY, x, y));
								});//ignore jslint
						}
					}
					break;
			}
			if (hasArrows && point.visibility != 4/*chartDiag.default.Visibility.Invisible*/) {
				polyline.addArrow(_connectorsOptionTask.linesWidth, function (polyline, endPoint) {
					var dotPolyline;

					polyline.mergeTo(buffer.getPolyline(polyline.paletteItem));

					if (_debug) {
						dotPolyline = buffer.getPolyline({
							fillColor: "#ff0000"/*chartDiag.default.Colors.Red*/
						});
						dotPolyline.addSegment(new chartDiag.default.DotSegment(endPoint.x - 1, endPoint.y - 1, 2, 2, 1));
					}
				}); //ignore jslint
			}
		}
	}

	return {
		process: process
	};
};

/* /Controls/OrgDiagram/Tasks/Renders/DrawCursorTask.js*/
chartDiag.orgChart.DrawCursorTask = function (getGraphics, createTranfromTask, applyLayoutChangesTask,
	combinedContextsTask,
	alignDiagramTask, itemTemplateParamsTask,
	cursorItemTask, selectedItemsTask) {
	var _graphics,
		_transform;

	function process() {
		var treeItemId = cursorItemTask.getCursorTreeItem();

		_graphics = getGraphics();
		_graphics.reset("placeholder", 9/*chartDiag.default.Layers.Cursor*/);

		if (treeItemId != null) {
			_transform = createTranfromTask.getTransform();

			drawCursor(treeItemId);
		}
		return false;
	}

	function drawCursor(treeItemId) {
		var treeItem,
			uiHash,
			panel = _graphics.activate("placeholder", 9/*chartDiag.default.Layers.Cursor*/),
			treeItemPosition = alignDiagramTask.getItemPosition(treeItemId),
			actualPosition = treeItemPosition.actualPosition,
			position = new chartDiag.default.Rect(treeItemPosition.contentPosition),
			templateParams = itemTemplateParamsTask.getTemplateParams(treeItemId),
			template = templateParams.template,
			templateConfig = template.templateConfig,
			cursorPadding = templateConfig.cursorPadding;

		position.offset(cursorPadding.left, cursorPadding.top, cursorPadding.right, cursorPadding.bottom);

		uiHash = new chartDiag.default.RenderEventArgs();
		uiHash.context = combinedContextsTask.getConfig(treeItemId);
		uiHash.isCursor = true;
		uiHash.isSelected = selectedItemsTask.isSelected(treeItemId);
		uiHash.templateName = templateConfig.name;

		_transform.transformRect(actualPosition.x, actualPosition.y, actualPosition.width, actualPosition.height, true,
			this, function (x, y, width, height) {
				var element = _graphics.template(
					x
					, y
					, width
					, height
					, position.x
					, position.y
					, position.width
					, position.height
					, template.cursorTemplate.template()
					, template.cursorTemplate.getHashCode()
					, template.cursorTemplate.render
					, uiHash
					, { "border-width": templateConfig.cursorBorderWidth }
					);
			});
	}

	return {
		process: process
	};
};

/* /Controls/OrgDiagram/Tasks/Renders/DrawHighlightAnnotationTask.js*/
chartDiag.orgChart.DrawHighlightAnnotationTask = function (getLayout, getGraphics, createTranfromTask, applyLayoutChangesTask, scaleOptionTask,
	combinedContextsTask,
	calloutOptionTask,
	readTemplatesTask,
	alignDiagramTask, centerOnCursorTask,
	highlightItemTask, cursorItemTask, selectedItemsTask) {
	var _graphics,
		_transform,
		_calloutShape = new chartDiag.default.Callout(getGraphics()),
		_options,
		_layout;

	function process() {
		var treeItemId = highlightItemTask.getHighlightTreeItem();

		_graphics = getGraphics();
		_graphics.reset("calloutplaceholder", 13/*chartDiag.default.Layers.Annotation*/);

		if (treeItemId !== null) {
			_transform = createTranfromTask.getTransform();
			_options = calloutOptionTask.getOptions();
			_layout = getLayout();

			drawHighlightAnnotation(treeItemId);
		}
		return false;
	}

	function drawHighlightAnnotation(treeItemId) {
		var panel,
			itemConfig,
			calloutPanelPosition,
			position,
			uiHash,
			element,
			calloutTemplateName,
			calloutTemplate,
			showCallout = true,
			style,
			treeItemPosition = alignDiagramTask.getItemPosition(treeItemId),
			actualPosition = treeItemPosition.actualPosition;


		switch (treeItemPosition.actualVisibility) {
			case 2/*chartDiag.default.Visibility.Dot*/:
			case 3/*chartDiag.default.Visibility.Line*/:
			case 1/*chartDiag.default.Visibility.Normal*/:
				itemConfig = calloutOptionTask.getItemOptions(treeItemId);

				switch (itemConfig.showCallout) {
					case 2/*chartDiag.default.Enabled.False*/:
						showCallout = false;
						break;
					case 1/*chartDiag.default.Enabled.True*/:
						showCallout = false;
						break;
					default:
						showCallout = _options.showCallout;
						break;
				}

				if (showCallout) {
					panel = _graphics.activate("placeholder", 10/*chartDiag.default.Layers.Item*/);

					_transform.transformRect(actualPosition.x, actualPosition.y, actualPosition.width, actualPosition.height, true,
						this, function (x, y, width, height) {
							var snapRect = new chartDiag.default.Rect(x, y, width, height),
								snapPoint = new chartDiag.default.Point(snapRect.horizontalCenter(), snapRect.verticalCenter()),
								panelPosition = getPanelPosition();

							if (treeItemPosition.actualVisibility != 1/*chartDiag.default.Visibility.Normal*/ || !panelPosition.overlaps(snapRect)) {

								calloutTemplateName = !chartDiag.default.isNullOrEmpty(itemConfig.calloutTemplateName) ? itemConfig.calloutTemplateName :
									!chartDiag.default.isNullOrEmpty(itemConfig.templateName) ? itemConfig.templateName :
									!chartDiag.default.isNullOrEmpty(_options.defaultCalloutTemplateName) ? _options.defaultCalloutTemplateName :
									_options.defaultTemplateName;

								calloutTemplate = readTemplatesTask.getTemplate(calloutTemplateName, readTemplatesTask.DefaultWidgetTemplateName);

								position = getAnnotationPosition(snapPoint, panelPosition, calloutTemplate.templateConfig.itemSize);

								/* position callout div placeholder */
								calloutPanelPosition = new chartDiag.default.Rect(position);
								calloutPanelPosition.addRect(snapPoint.x, snapPoint.y);
								calloutPanelPosition.offset(50);
								style = calloutPanelPosition.getCSS();
								style.display = "inherit";
								style.visibility = "inherit";
								_layout.calloutPlaceholder.css(style);

								/* recalculate geometries */
								snapPoint.x -= calloutPanelPosition.x;
								snapPoint.y -= calloutPanelPosition.y;
								position.x -= calloutPanelPosition.x;
								position.y -= calloutPanelPosition.y;

								uiHash = new chartDiag.default.RenderEventArgs();
								uiHash.context = combinedContextsTask.getConfig(treeItemId);
								uiHash.isCursor = (cursorItemTask.getCursorTreeItem() == treeItemId);
								uiHash.isSelected = selectedItemsTask.isSelected(treeItemId);
								uiHash.templateName = calloutTemplate.templateConfig.name;

								_graphics.resize("calloutplaceholder", calloutPanelPosition.width, calloutPanelPosition.height);
								panel = _graphics.activate("calloutplaceholder", 13/*chartDiag.default.Layers.Annotation*/);
								element = _graphics.template(
											position.x
										, position.y
										, position.width
										, position.height
										, 0
										, 0
										, position.width
										, position.height
										, calloutTemplate.itemTemplate.template()
										, calloutTemplate.itemTemplate.getHashCode()
										, calloutTemplate.itemTemplate.render
										, uiHash
										, null
										);

								_calloutShape.pointerPlacement = 0/*chartDiag.default.PlacementType.Auto*/;
								_calloutShape.cornerRadius = _options.calloutCornerRadius;
								_calloutShape.offset = _options.calloutOffset;
								_calloutShape.opacity = _options.calloutOpacity;
								_calloutShape.lineWidth = _options.calloutLineWidth;
								_calloutShape.pointerWidth = _options.calloutPointerWidth;
								_calloutShape.borderColor = _options.calloutBorderColor;
								_calloutShape.fillColor = _options.calloutfillColor;
								_calloutShape.draw(snapPoint, position);
							} else {
								_layout.calloutPlaceholder.css({ "display": "none", "visibility": "hidden" });
							}
						}
					);
				} else {
					_layout.calloutPlaceholder.css({ "display": "none", "visibility": "hidden" });
				}
				break;
			case 4/*chartDiag.default.Visibility.Invisible*/:
				_layout.calloutPlaceholder.css({ "display": "none", "visibility": "hidden" });
				break;
		}
	}

	function hideHighlightAnnotation() {
		_layout.calloutPlaceholder.css({ "display": "none", "visibility": "hidden" });
	}

	function getPanelPosition() {
		var scaleOptions = scaleOptionTask.getOptions(),
			scale = scaleOptions.scale,
			placeholderOffset = new chartDiag.default.Point(centerOnCursorTask.getPlaceholderOffset()),
			panelSize = alignDiagramTask.getContentSize(),
			optimalPanelSize = applyLayoutChangesTask.getOptimalPanelSize();

		placeholderOffset.scale(1.0 / scale);
		optimalPanelSize.scale(1.0 / scale);

		return new chartDiag.default.Rect(
							placeholderOffset.x,
							placeholderOffset.y,
							Math.min(optimalPanelSize.width, panelSize.width),
							Math.min(optimalPanelSize.height, panelSize.height)
						);
	}

	function getAnnotationPosition(snapPoint, panelRect, itemSize) {
		var result = new chartDiag.default.Rect(snapPoint.x, snapPoint.y, itemSize.width, itemSize.height);

		if (snapPoint.y > panelRect.bottom() - panelRect.height / 4.0) {
			result.y -= (itemSize.height / 2.0);
			if (snapPoint.x < panelRect.horizontalCenter()) {
				result.x += itemSize.width / 4.0;
			}
			else {
				result.x -= (itemSize.width / 4.0 + itemSize.width);
			}
		}
		else {
			result.y += (itemSize.height / 4.0);
			result.x -= (itemSize.width / 2.0);
		}

		// If annotation clipped then move it back into view port
		if (result.x < panelRect.x) {
			result.x = panelRect.x + 5;
		}
		else if (result.right() > panelRect.right()) {
			result.x -= (result.right() - panelRect.right() + 5);
		}

		if (result.y < panelRect.y) {
			result.y = panelRect.y + 5;
		}
		else if (result.bottom() > panelRect.bottom()) {
			result.y -= (result.bottom() - panelRect.bottom() + 5);
		}

		return result;
	}

	return {
		process: process
	};
};

/* /Controls/OrgDiagram/Tasks/Renders/DrawHighlightTask.js*/
chartDiag.orgChart.DrawHighlightTask = function (getGraphics, createTranfromTask, applyLayoutChangesTask,
	combinedContextsTask,
	alignDiagramTask, itemTemplateParamsTask,
	highlightItemTask, cursorItemTask, selectedItemsTask) {
	var _graphics,
		_transform,
		_levelsOfLabels = [];

	function process() {
		var treeItemId = highlightItemTask.getHighlightTreeItem();

		_graphics = getGraphics();
		_graphics.reset("placeholder", 6/*chartDiag.default.Layers.Highlight*/);

		if (treeItemId != null) {
			_transform = createTranfromTask.getTransform();
			drawHighlight(treeItemId);
		}

		return false;
	}

	function drawHighlight(treeItemId) {
		var uiHash,
			panel = _graphics.activate("placeholder", 6/*chartDiag.default.Layers.Highlight*/),
			treeItemPosition = alignDiagramTask.getItemPosition(treeItemId),
			actualPosition = treeItemPosition.actualPosition,
			templateParams = itemTemplateParamsTask.getTemplateParams(treeItemId),
			template = templateParams.template,
			templateConfig = template.templateConfig,
			highlightPadding = templateConfig.highlightPadding;

		uiHash = new chartDiag.default.RenderEventArgs();
		uiHash.context = combinedContextsTask.getConfig(treeItemId);
		uiHash.isCursor = (cursorItemTask.getCursorTreeItem() == treeItemId);
		uiHash.isSelected = selectedItemsTask.isSelected(treeItemId);
		uiHash.templateName = templateConfig.name;

		_transform.transformRect(actualPosition.x, actualPosition.y, actualPosition.width, actualPosition.height, true,
			this, function (x, y, width, height) {
				var position = new chartDiag.default.Rect(0, 0, Math.round(width), Math.round(height));
				position.offset(highlightPadding.left, highlightPadding.top, highlightPadding.right, highlightPadding.bottom);

				var element;
				if (treeItemPosition.actualVisibility == 1/*chartDiag.default.Visibility.Normal*/) {
					element = _graphics.template(
						x
						, y
						, width
						, height
						, position.x
						, position.y
						, position.width
						, position.height
						, template.highlightTemplate.template()
						, template.highlightTemplate.getHashCode()
						, template.highlightTemplate.render
						, uiHash
						, null
						);
				} else {
					element = _graphics.template(
						x
						, y
						, width
						, height
						, position.x
						, position.y
						, position.width - 1
						, position.height - 1
						, template.dotHighlightTemplate.template()
						, template.dotHighlightTemplate.getHashCode()
						, template.dotHighlightTemplate.render
						, uiHash
						, null
						);
				}
			});
	}

	return {
		process: process
	};
};

/* /Controls/OrgDiagram/Tasks/Renders/DrawItemLabelsTask.js*/
chartDiag.orgChart.DrawItemLabelsTask = function (getGraphics, createTranfromTask, applyLayoutChangesTask,
	labelsOptionTask,
	visualTreeLevelsTask, alignDiagramTask) {
	var _graphics,
		_transform,
		_treeLevels,
		_labelsOption;

	function process() {
		_graphics = getGraphics();

		_transform = createTranfromTask.getTransform();
		_labelsOption = labelsOptionTask.getOptions();
		_treeLevels = visualTreeLevelsTask.getTreeLevels();

		_graphics.reset("placeholder", 8/*chartDiag.default.Layers.Label*/);

		redrawLabels();

		return false;
	}

	function redrawLabels() {
		var labels, label, label2,
			index, index2, len,
			levelIndex, levelsLen,
			attr,
			treeLevel, treeLevelFirst, treeLevelSecond;

		var levelsOfLabels = [];
		_treeLevels.loopLevels(this, function (levelIndex) {
			var labels = [];
			_treeLevels.loopLevelItems(this, levelIndex, function (treeItemId) {
				var labelOptions = labelsOptionTask.getItemOptions(treeItemId),
					treeItemPosition = alignDiagramTask.getItemPosition(treeItemId),
					actualPosition = treeItemPosition.actualPosition;

					if (labelOptions != null) {
						_transform.transformRect(actualPosition.x, actualPosition.y, actualPosition.width, actualPosition.height, true,
							this, function (x, y, width, height) {

								switch (treeItemPosition.actualVisibility) {
									case 1/*chartDiag.default.Visibility.Normal*/:
										if (_labelsOption.showLabels == 0/*chartDiag.default.Enabled.Auto*/) {
											// Don't allow dot's labels overlap normal items
											label = new chartDiag.default.Label();
											label.text = "dummy";
											label.position = new chartDiag.default.Rect(x, y, width, height);
											label.weight = 10000;
											label.labelType = 1/*chartDiag.default.LabelType.Dummy*/;
											labels.push(label);
										}
										break;
									case 2/*chartDiag.default.Visibility.Dot*/:
										label = createLabel(x, y, width, height, labelOptions, treeItemPosition);
										if (label != null) {
											labels.push(label);
										}

										break;
									default:
										break;
								}
							});//ignore jslint
					}
			});
			levelsOfLabels[levelIndex] = labels;
		});

		var levelsRect = [],
			levelsHasFixedLabels = [],
			levelsShowLabels = [];
		if (_labelsOption.showLabels == 0/*chartDiag.default.Enabled.Auto*/) {
			// Calculate total labels space
			_treeLevels.loopLevels(this, function (levelIndex) {
				var labels = levelsOfLabels[levelIndex],
					label,
					levelRect,
					hasFixedLabels = false;
				for (index = 0, len = labels.length; index < len; index += 1) {
					label = labels[index];
					if (levelRect == null) {
						levelRect = new chartDiag.default.Rect(label.position);
					} else {
						levelRect.addRect(label.position);
					}
					hasFixedLabels = hasFixedLabels || (label.labelType == 2/*chartDiag.default.LabelType.Fixed*/);
				}
				levelsRect[levelIndex] = levelRect;
				levelsHasFixedLabels[levelIndex] = hasFixedLabels;
			});

			// Hide overlapping rows
			_treeLevels.loopLevelsReversed(this, function (levelIndex) {
				var treeLevelFirstRect = levelsRect[levelIndex - 1],
					treeLevelSecondRect = levelsRect[levelIndex];
				levelsShowLabels[levelIndex] = true;
				if (treeLevelFirstRect != null && treeLevelSecondRect != null) {
					if (treeLevelFirstRect.overlaps(treeLevelSecondRect)) {
						levelsShowLabels[levelIndex] = false;
					}
				}
			});

			// Hide overlapping labels in non-hidden rows
			_treeLevels.loopLevels(this, function (levelIndex) {
				labels = levelsOfLabels[levelIndex];

				if (levelsShowLabels[levelIndex]) {
					for (index = 0, len = labels.length; index < len; index += 1) {
						label = labels[index];
						if (label.isActive) {
							for (index2 = index + 1; index2 < len; index2 += 1) {
								label2 = labels[index2];
								if (label2.isActive) {
									if (label.position.overlaps(label2.position)) {
										if (label.weight >= label2.weight) {
											if (label2.labelType == 0/*chartDiag.default.LabelType.Regular*/) {
												label2.isActive = false;
											}
										} else {
											if (label.labelType == 0/*chartDiag.default.LabelType.Regular*/) {
												label.isActive = false;
											}
											break;
										}
									} else {
										break;
									}
								}
							}
						}
					}
				}
			});

		}

		_graphics.activate("placeholder", 8/*chartDiag.default.Layers.Label*/);
		attr = {
			"font-size": _labelsOption.labelFontSize,
			"font-family": _labelsOption.labelFontFamily,
			"font-style": _labelsOption.labelFontStyle,
			"font-weight": _labelsOption.labelFontWeight,
			"font-color": _labelsOption.labelColor
		};
		_treeLevels.loopLevels(this, function (levelIndex) {
			var labels;
			if (_labelsOption.showLabels == 1/*chartDiag.default.Enabled.True*/ || levelsShowLabels[levelIndex] || levelsHasFixedLabels[levelIndex]) {
				labels = levelsOfLabels[levelIndex];
				for (index = 0, len = labels.length; index < len; index += 1) {
					label = labels[index];
					if (label.isActive) {
						switch (label.labelType) {
							case 0/*chartDiag.default.LabelType.Regular*/:
							case 2/*chartDiag.default.LabelType.Fixed*/:
								_graphics.text(label.position.x, label.position.y, label.position.width, label.position.height, label.text,
									label.labelOrientation,
									label.horizontalAlignmentType,
									label.verticalAlignmentType,
									attr);
								break;
						}
					}
				}
			}
		});
	}

	function createLabel(x, y, width, height, labelOptions, treeItemPosition) {
		var labelWidth,
			labelHeight,
			result = null,
			labelOffset = _labelsOption.labelOffset,
			labelSize,
			labelPlacement;

		if (!chartDiag.default.isNullOrEmpty(labelOptions.label)) {
			switch (labelOptions.showLabel) {
				case 0/*chartDiag.default.Enabled.Auto*/:
					switch (_labelsOption.showLabels) {
						case 0/*chartDiag.default.Enabled.Auto*/:
							switch (treeItemPosition.actualVisibility) {
								case 3/*chartDiag.default.Visibility.Line*/:
								case 2/*chartDiag.default.Visibility.Dot*/:
									result = new chartDiag.default.Label();
									result.labelType = 0/*chartDiag.default.LabelType.Regular*/;
									result.weight = treeItemPosition.leftPadding + treeItemPosition.rightPadding;
									break;
								default:
									break;
							}
							break;
						case 2/*chartDiag.default.Enabled.False*/:
							break;
						case 1/*chartDiag.default.Enabled.True*/:
							result = new chartDiag.default.Label();
							result.labelType = 2/*chartDiag.default.LabelType.Fixed*/;
							result.weight = 10000;
							break;
					}
					break;
				case 2/*chartDiag.default.Enabled.False*/:
					break;
				case 1/*chartDiag.default.Enabled.True*/:
					result = new chartDiag.default.Label();
					result.weight = 10000;
					result.labelType = 2/*chartDiag.default.LabelType.Fixed*/;
					break;
			}

			if (result != null) {
				result.text = labelOptions.label;

				labelSize = (labelOptions.labelSize != null) ? labelOptions.labelSize : _labelsOption.labelSize;
				result.labelOrientation = (labelOptions.labelOrientation != 3/*chartDiag.text.TextOrientationType.Auto*/) ? labelOptions.labelOrientation :
					(_labelsOption.labelOrientation != 3/*chartDiag.text.TextOrientationType.Auto*/) ? _labelsOption.labelOrientation :
						0/*chartDiag.text.TextOrientationType.Horizontal*/;
				labelPlacement = (labelOptions.labelPlacement != 0/*chartDiag.default.PlacementType.Auto*/) ? labelOptions.labelPlacement :
					(_labelsOption.labelPlacement != 0/*chartDiag.default.PlacementType.Auto*/) ? _labelsOption.labelPlacement :
					1/*chartDiag.default.PlacementType.Top*/;

				switch (result.labelOrientation) {
					case 0/*chartDiag.text.TextOrientationType.Horizontal*/:
						labelWidth = labelSize.width;
						labelHeight = labelSize.height;
						break;
					case 1/*chartDiag.text.TextOrientationType.RotateLeft*/:
					case 2/*chartDiag.text.TextOrientationType.RotateRight*/:
						labelHeight = labelSize.width;
						labelWidth = labelSize.height;
						break;
				}

				switch (labelPlacement) {
					case 0/*chartDiag.default.PlacementType.Auto*/:
					case 1/*chartDiag.default.PlacementType.Top*/:
						result.position = new chartDiag.default.Rect(x + width / 2.0 - labelWidth / 2.0, y - labelOffset - labelHeight, labelWidth, labelHeight);
						switch (result.labelOrientation) {
							case 0/*chartDiag.text.TextOrientationType.Horizontal*/:
								result.horizontalAlignmentType = 0/*chartDiag.default.HorizontalAlignmentType.Center*/;
								result.verticalAlignmentType = 2/*chartDiag.default.VerticalAlignmentType.Bottom*/;
								break;
							case 1/*chartDiag.text.TextOrientationType.RotateLeft*/:
								result.horizontalAlignmentType = 1/*chartDiag.default.HorizontalAlignmentType.Left*/;
								result.verticalAlignmentType = 1/*chartDiag.default.VerticalAlignmentType.Middle*/;
								break;
							case 2/*chartDiag.text.TextOrientationType.RotateRight*/:
								result.horizontalAlignmentType = 2/*chartDiag.default.HorizontalAlignmentType.Right*/;
								result.verticalAlignmentType = 1/*chartDiag.default.VerticalAlignmentType.Middle*/;
								break;
						}
						break;
					case 2/*chartDiag.default.PlacementType.TopRight*/:
					case 11/*chartDiag.default.PlacementType.RightTop*/:
						result.position = new chartDiag.default.Rect(x + width + labelOffset, y - labelOffset - labelHeight, labelWidth, labelHeight);
						switch (result.labelOrientation) {
							case 0/*chartDiag.text.TextOrientationType.Horizontal*/:
								result.horizontalAlignmentType = 1/*chartDiag.default.HorizontalAlignmentType.Left*/;
								result.verticalAlignmentType = 2/*chartDiag.default.VerticalAlignmentType.Bottom*/;
								break;
							case 1/*chartDiag.text.TextOrientationType.RotateLeft*/:
								result.horizontalAlignmentType = 1/*chartDiag.default.HorizontalAlignmentType.Left*/;
								result.verticalAlignmentType = 0/*chartDiag.default.VerticalAlignmentType.Top*/;
								break;
							case 2/*chartDiag.text.TextOrientationType.RotateRight*/:
								result.horizontalAlignmentType = 2/*chartDiag.default.HorizontalAlignmentType.Right*/;
								result.verticalAlignmentType = 2/*chartDiag.default.VerticalAlignmentType.Bottom*/;
								break;
						}
						break;
					case 3/*chartDiag.default.PlacementType.Right*/:
						result.position = new chartDiag.default.Rect(x + width + labelOffset, y + height / 2.0 - labelHeight / 2.0, labelWidth, labelHeight);
						switch (result.labelOrientation) {
							case 0/*chartDiag.text.TextOrientationType.Horizontal*/:
								result.horizontalAlignmentType = 1/*chartDiag.default.HorizontalAlignmentType.Left*/;
								result.verticalAlignmentType = 1/*chartDiag.default.VerticalAlignmentType.Middle*/;
								break;
							case 1/*chartDiag.text.TextOrientationType.RotateLeft*/:
								result.horizontalAlignmentType = 0/*chartDiag.default.HorizontalAlignmentType.Center*/;
								result.verticalAlignmentType = 0/*chartDiag.default.VerticalAlignmentType.Top*/;
								break;
							case 2/*chartDiag.text.TextOrientationType.RotateRight*/:
								result.horizontalAlignmentType = 0/*chartDiag.default.HorizontalAlignmentType.Center*/;
								result.verticalAlignmentType = 2/*chartDiag.default.VerticalAlignmentType.Bottom*/;
								break;
						}
						break;
					case 4/*chartDiag.default.PlacementType.BottomRight*/:
					case 12/*chartDiag.default.PlacementType.RightBottom*/:
						result.position = new chartDiag.default.Rect(x + width + labelOffset, y + height + labelOffset, labelWidth, labelHeight);
						switch (result.labelOrientation) {
							case 0/*chartDiag.text.TextOrientationType.Horizontal*/:
								result.horizontalAlignmentType = 1/*chartDiag.default.HorizontalAlignmentType.Left*/;
								result.verticalAlignmentType = 0/*chartDiag.default.VerticalAlignmentType.Top*/;
								break;
							case 1/*chartDiag.text.TextOrientationType.RotateLeft*/:
								result.horizontalAlignmentType = 2/*chartDiag.default.HorizontalAlignmentType.Right*/;
								result.verticalAlignmentType = 0/*chartDiag.default.VerticalAlignmentType.Top*/;
								break;
							case 2/*chartDiag.text.TextOrientationType.RotateRight*/:
								result.horizontalAlignmentType = 1/*chartDiag.default.HorizontalAlignmentType.Left*/;
								result.verticalAlignmentType = 2/*chartDiag.default.VerticalAlignmentType.Bottom*/;
								break;
						}
						break;
					case 5/*chartDiag.default.PlacementType.Bottom*/:
						result.position = new chartDiag.default.Rect(x + width / 2.0 - labelWidth / 2.0, y + height + labelOffset, labelWidth, labelHeight);
						switch (result.labelOrientation) {
							case 0/*chartDiag.text.TextOrientationType.Horizontal*/:
								result.horizontalAlignmentType = 0/*chartDiag.default.HorizontalAlignmentType.Center*/;
								result.verticalAlignmentType = 0/*chartDiag.default.VerticalAlignmentType.Top*/;
								break;
							case 1/*chartDiag.text.TextOrientationType.RotateLeft*/:
								result.horizontalAlignmentType = 2/*chartDiag.default.HorizontalAlignmentType.Right*/;
								result.verticalAlignmentType = 1/*chartDiag.default.VerticalAlignmentType.Middle*/;
								break;
							case 2/*chartDiag.text.TextOrientationType.RotateRight*/:
								result.horizontalAlignmentType = 1/*chartDiag.default.HorizontalAlignmentType.Left*/;
								result.verticalAlignmentType = 1/*chartDiag.default.VerticalAlignmentType.Middle*/;
								break;
						}
						break;
					case 6/*chartDiag.default.PlacementType.BottomLeft*/:
					case 10/*chartDiag.default.PlacementType.LeftBottom*/:
						result.position = new chartDiag.default.Rect(x - labelWidth - labelOffset, y + height + labelOffset, labelWidth, labelHeight);
						switch (result.labelOrientation) {
							case 0/*chartDiag.text.TextOrientationType.Horizontal*/:
								result.horizontalAlignmentType = 2/*chartDiag.default.HorizontalAlignmentType.Right*/;
								result.verticalAlignmentType = 0/*chartDiag.default.VerticalAlignmentType.Top*/;
								break;
							case 1/*chartDiag.text.TextOrientationType.RotateLeft*/:
								result.horizontalAlignmentType = 2/*chartDiag.default.HorizontalAlignmentType.Right*/;
								result.verticalAlignmentType = 2/*chartDiag.default.VerticalAlignmentType.Bottom*/;
								break;
							case 2/*chartDiag.text.TextOrientationType.RotateRight*/:
								result.horizontalAlignmentType = 1/*chartDiag.default.HorizontalAlignmentType.Left*/;
								result.verticalAlignmentType = 0/*chartDiag.default.VerticalAlignmentType.Top*/;
								break;
						}
						break;
					case 7/*chartDiag.default.PlacementType.Left*/:
						result.position = new chartDiag.default.Rect(x - labelWidth - labelOffset, y + height / 2.0 - labelHeight / 2.0, labelWidth, labelHeight);
						switch (result.labelOrientation) {
							case 0/*chartDiag.text.TextOrientationType.Horizontal*/:
								result.horizontalAlignmentType = 2/*chartDiag.default.HorizontalAlignmentType.Right*/;
								result.verticalAlignmentType = 1/*chartDiag.default.VerticalAlignmentType.Middle*/;
								break;
							case 1/*chartDiag.text.TextOrientationType.RotateLeft*/:
								result.horizontalAlignmentType = 0/*chartDiag.default.HorizontalAlignmentType.Center*/;
								result.verticalAlignmentType = 2/*chartDiag.default.VerticalAlignmentType.Bottom*/;
								break;
							case 2/*chartDiag.text.TextOrientationType.RotateRight*/:
								result.horizontalAlignmentType = 0/*chartDiag.default.HorizontalAlignmentType.Center*/;
								result.verticalAlignmentType = 0/*chartDiag.default.VerticalAlignmentType.Top*/;
								break;
						}
						break;
					case 8/*chartDiag.default.PlacementType.TopLeft*/:
					case 9/*chartDiag.default.PlacementType.LeftTop*/:
						result.position = new chartDiag.default.Rect(x - labelWidth - labelOffset, y - labelOffset - labelHeight, labelWidth, labelHeight);
						switch (result.labelOrientation) {
							case 0/*chartDiag.text.TextOrientationType.Horizontal*/:
								result.horizontalAlignmentType = 2/*chartDiag.default.HorizontalAlignmentType.Right*/;
								result.verticalAlignmentType = 2/*chartDiag.default.VerticalAlignmentType.Bottom*/;
								break;
							case 1/*chartDiag.text.TextOrientationType.RotateLeft*/:
								result.horizontalAlignmentType = 1/*chartDiag.default.HorizontalAlignmentType.Left*/;
								result.verticalAlignmentType = 2/*chartDiag.default.VerticalAlignmentType.Bottom*/;
								break;
							case 2/*chartDiag.text.TextOrientationType.RotateRight*/:
								result.horizontalAlignmentType = 2/*chartDiag.default.HorizontalAlignmentType.Right*/;
								result.verticalAlignmentType = 0/*chartDiag.default.VerticalAlignmentType.Top*/;
								break;
						}
						break;
				}
			}
		}
		return result;
	}

	return {
		process: process
	};
};

/* /Controls/OrgDiagram/Tasks/Renders/DrawMinimizedItemsTask.js*/
chartDiag.orgChart.DrawMinimizedItemsTask = function (getGraphics, createTranfromTask, applyLayoutChangesTask,
	minimizedItemsOptionTask, visualTreeTask, itemTemplateParamsTask, alignDiagramTask) {
	var _graphics,
		_transform,
		_debug,
		_options,
		_visualTree;

	function process() {

		_graphics = getGraphics();

		_transform = createTranfromTask.getTransform();
		_visualTree = visualTreeTask.getVisualTree();
		_options = minimizedItemsOptionTask.getOptions();

		_graphics.reset("placeholder", 7/*chartDiag.default.Layers.Marker*/);

		drawMinimizedItems();

		return false;
	}

	function drawMinimizedItems() {
		var treeLevel,
			uiHash,
			element,
			markers = new chartDiag.default.PolylinesBuffer(),
			paletteItems = {},
			polyline,
			index,
			len,
			label,
			marker = new chartDiag.default.Marker(),
			itemTitleColor,
			itemFillColor,
			minimizedItemShapeType,
			minimizedItemCornerRadius;

		_visualTree.loop(this, function (treeItemId, treeItem) {
			var minimizedItemsOptions = minimizedItemsOptionTask.getItemOptions(treeItemId),
				treeItemPosition = alignDiagramTask.getItemPosition(treeItemId),
				actualPosition = treeItemPosition.actualPosition,
				templateParams,
				templateConfig;

			_transform.transformRect(actualPosition.x, actualPosition.y, actualPosition.width, actualPosition.height, true,
				this, function (x, y, width, height) {
					switch (treeItemPosition.actualVisibility) {
						case 2/*chartDiag.default.Visibility.Dot*/:
							templateParams = itemTemplateParamsTask.getTemplateParams(treeItemId);
							templateConfig = templateParams.template.templateConfig;

							itemTitleColor = null;
							itemFillColor = null;
							minimizedItemShapeType = null;
							minimizedItemCornerRadius = 0;

							/* use individual item options first */
							if (minimizedItemsOptions != null) {
								itemTitleColor = minimizedItemsOptions.itemTitleColor;
								itemFillColor = minimizedItemsOptions.itemTitleColor;
								minimizedItemShapeType = minimizedItemsOptions.minimizedItemShapeType;
							}

							/* use template config & control options next */
							itemTitleColor = itemTitleColor || templateConfig.minimizedItemBorderColor || "#000080"/*chartDiag.default.Colors.Navy*/;
							itemFillColor = itemFillColor || templateConfig.minimizedItemFillColor || "#000080"/*chartDiag.default.Colors.Navy*/;
							if (minimizedItemShapeType == null) {
								minimizedItemShapeType = (templateConfig.minimizedItemShapeType !== null ? templateConfig.minimizedItemShapeType : _options.minimizedItemShapeType);
							}
							minimizedItemCornerRadius = templateConfig.minimizedItemCornerRadius === null ? templateConfig.minimizedItemSize.width / 2.0 : templateConfig.minimizedItemCornerRadius;

							if (minimizedItemShapeType == null || minimizedItemShapeType == 6/*chartDiag.default.ShapeType.None*/) {
								polyline = markers.getPolyline(new chartDiag.default.PaletteItem({
									'lineColor': itemTitleColor,
									'lineWidth': templateConfig.minimizedItemLineWidth,
									'lineType': templateConfig.minimizedItemLineType,
									'fillColor': itemFillColor,
									'opacity': templateConfig.minimizedItemOpacity
								}));
								polyline.addSegment(new chartDiag.default.DotSegment(x, y, width, height, minimizedItemCornerRadius));
							} else {
								marker.draw(markers, minimizedItemShapeType, new chartDiag.default.Rect(x, y, width, height),
									new chartDiag.default.PaletteItem({
										'lineColor': itemTitleColor,
										'lineWidth': templateConfig.minimizedItemLineWidth,
										'lineType': templateConfig.minimizedItemLineType,
										'fillColor': itemFillColor,
										'opacity': templateConfig.minimizedItemOpacity
									})
								);
							}
							break;
						default:
							if (_debug) {
								itemTitleColor = "#ff0000"/*chartDiag.default.Colors.Red*/;
								if (!paletteItems.hasOwnProperty(itemTitleColor)) {
									paletteItems[itemTitleColor] = new chartDiag.default.PaletteItem({
										'lineColor': itemTitleColor,
										'lineWidth': 1,
										'lineType': 0/*chartDiag.default.LineType.Solid*/,
										'fillColor': itemTitleColor,
										'opacity': 1
									});
								}
								polyline = markers.getPolyline(paletteItems[itemTitleColor]);
								polyline.addSegment(new chartDiag.default.DotSegment(x - 1, y - 1, 2, 2, 1));
							}
							break;
					}
				});//ignore jslint
		});


		_graphics.activate("placeholder", 7/*chartDiag.default.Layers.Marker*/);
		_graphics.polylinesBuffer(markers);
	}

	return {
		process: process
	};
};

/* /Controls/OrgDiagram/Tasks/Renders/DrawPrintPreviewTask.js*/
chartDiag.orgChart.DrawPrintPreviewTask = function (getGraphics, applyLayoutChangesTask,
	printPreviewOptionTask, alignDiagramTask, printPreviewTemplateTask, scaleOptionTask) {
	var _graphics;

	function process() {
		var options = printPreviewOptionTask.getOptions(),
			scaleOptions = scaleOptionTask.getOptions();

		_graphics = getGraphics();
		_graphics.reset("placeholder", 1/*chartDiag.default.Layers.PrintPreview*/);

		if (options.pageFitMode == 4/*chartDiag.default.PageFitMode.PrintPreview*/) {
			drawPrintPreview(options, scaleOptions);
		}

		return false;
	}

	function drawPrintPreview(options, scaleOptions) {
		var panel,
			layer = 3/*chartDiag.default.Layers.BackgroundAnnotations*/,
			size = new chartDiag.default.Size(options.printPreviewPageSize),
			x, y,
			element,
			panelSize = alignDiagramTask.getContentSize(),
			printPreviewTemplate = printPreviewTemplateTask.getTemplate();

		size.scale(1.0 / scaleOptions.scale);
		panel = _graphics.activate("placeholder", 1/*chartDiag.default.Layers.PrintPreview*/);
		x = 0;
		while ((x + 1) * size.width < panelSize.width) {
			y = 0;
			while ((y + 1) * size.height < panelSize.height) {
				element = _graphics.template(
					x * size.width
					, y * size.height
					, size.width
					, size.height
					, 0
					, 0
					, size.width
					, size.height
					, printPreviewTemplate.template()
					, printPreviewTemplate.getHashCode()
					, printPreviewTemplate.render
					, null
					, null
				);
				element.data({ "column": x, "row": y });
				y += 1;
			}
			x += 1;
		}
	}

	return {
		process: process
	};
};

/* /Controls/OrgDiagram/Tasks/Renders/DrawShapeAnnotationTask.js*/
chartDiag.orgChart.DrawShapeAnnotationTask = function (getGraphics, createTransformTask, applyLayoutChangesTask,
	orientationOptionTask, shapeAnnotationOptionTask, alignDiagramTask, annotationLabelTemplateTask, zOrderType) {
	var _graphics,
		_transform,
		_orientationOptions,
		_annotationLabelTemplate;

	function process() {

		_graphics = getGraphics();

		_transform = createTransformTask.getTransform();
		_orientationOptions = orientationOptionTask.getOptions();

		_annotationLabelTemplate = annotationLabelTemplateTask.getTemplate();

		switch (zOrderType) {
			case 1/*chartDiag.default.ZOrderType.Background*/://ignore jslint
				_graphics.reset("placeholder", 3/*chartDiag.default.Layers.BackgroundAnnotations*/);
				break;
			case 2/*chartDiag.default.ZOrderType.Foreground*/://ignore jslint
				_graphics.reset("placeholder", 11/*chartDiag.default.Layers.ForegroundAnnotations*/);
				break;
		}

		_drawAnnotations(shapeAnnotationOptionTask.getAnnotations(), alignDiagramTask.getItemPosition);

		return false;
	}

	function _drawAnnotations(annotations, getItemPosition) {
		var panel,
			layer = 11/*chartDiag.default.Layers.ForegroundAnnotations*/,
			index, len,
			index2, len2,
			index3, len3,
			fromItem,
			toItem,
			shape,
			defaultConfig,
			items, itemsHash, itemPosition, position,
			properties, property,
			annotationConfig,
			uiHash,
			backgroundManager,
			perimeters, treeItem;


		switch (zOrderType) {
			case 1/*chartDiag.default.ZOrderType.Background*/://ignore jslint
				panel = _graphics.activate("placeholder", 3/*chartDiag.default.Layers.BackgroundAnnotations*/);
				break;
			case 2/*chartDiag.default.ZOrderType.Foreground*/://ignore jslint
				panel = _graphics.activate("placeholder", 11/*chartDiag.default.Layers.ForegroundAnnotations*/);
				break;
		}

		for (index = 0, len = annotations.length; index < len; index += 1) {
			annotationConfig = annotations[index];

			if (annotationConfig.items != null && annotationConfig.items.length > 0) {
				position = new chartDiag.default.Rect();
				for (index2 = 0, len2 = annotationConfig.items.length; index2 < len2; index2 += 1) {
					itemPosition = getItemPosition(annotationConfig.items[index2]);
					if (itemPosition != null) {
						position.addRect(itemPosition.actualPosition);
					}
				}

				if (!position.isEmpty()) {
					shape = new chartDiag.default.Shape(_graphics);
					defaultConfig = new chartDiag.orgChart.ShapeAnnotationConfig();
					properties = ["opacity", "cornerRadius", "shapeType", "offset", "lineWidth", "borderColor", "fillColor", "lineType", "labelSize", "labelOffset", "labelPlacement", "zOrderType"];
					for (index3 = 0, len3 = properties.length; index3 < len3; index3 += 1) {
						property = properties[index3];
						shape[property] = annotationConfig.hasOwnProperty(property) ? annotationConfig[property] : defaultConfig[property];
					}

					shape.position = position;
					shape.orientationType = _orientationOptions.orientationType;
					shape.panelSize = panel.size;
					shape.labelTemplate = _annotationLabelTemplate;
					shape.hasLabel = annotationConfig.templateName != null || annotationConfig.label != null;

					uiHash = new chartDiag.default.RenderEventArgs();
					uiHash.context = annotationConfig;
					uiHash.templateName = shape.labelTemplate;

					_transform.transformRect(position.x, position.y, position.width, position.height, true,
						this, function (x, y, width, height) {
							var position = new chartDiag.default.Rect(x, y, width, height);
							shape.draw(position, uiHash);
						});//ignore jslint
				}
			}
		}
	}

	return {
		process: process
	};
};

/* /Controls/OrgDiagram/Tasks/Renders/DrawTreeItemsTask.js*/
chartDiag.orgChart.DrawTreeItemsTask = function (getGraphics, createTranfromTask, applyLayoutChangesTask,
		itemsSizesOptionTask,
		combinedContextsTask,
		visualTreeTask, alignDiagramTask, itemTemplateParamsTask,
		cursorItemTask, selectedItemsTask,
		groupTitleTemplateTask, checkBoxTemplateTask, buttonsTemplateTask) {

	var	_visualTree,
		_positions,
		_graphics,
		_transform,
		_itemsSizesOptions,

		_buttonsTemplate,
		_checkBoxTemplate,
		_groupTitleTemplate;

	function process() {
		_graphics = getGraphics();

		_itemsSizesOptions = itemsSizesOptionTask.getOptions();
		_visualTree = visualTreeTask.getVisualTree();
		_positions = alignDiagramTask.getItemsPositions();
		_transform = createTranfromTask.getTransform();

		_buttonsTemplate = buttonsTemplateTask.getTemplate();
		_checkBoxTemplate = checkBoxTemplateTask.getTemplate();
		_groupTitleTemplate = groupTitleTemplateTask.getTemplate();

		_graphics.reset("placeholder", 10/*chartDiag.default.Layers.Item*/);
		_graphics.reset("placeholder", 14/*chartDiag.default.Layers.Controls*/);

		redrawTreeItems();

		return false;
	}

	function redrawTreeItems() {
		var uiHash,
			element,
			polyline,
			index,
			len,
			label,
			itemTitleColor,
			itemFillColor,
			cursorItemId = cursorItemTask.getCursorTreeItem();

		_visualTree.loop(this, function (treeItemId, treeItem) {
			var treeItemPosition = _positions[treeItemId],
				actualPosition = treeItemPosition.actualPosition;
			if (treeItemPosition.actualVisibility == 1/*chartDiag.default.Visibility.Normal*/) {
				_transform.transformRect(actualPosition.x, actualPosition.y, actualPosition.width, actualPosition.height, true,
					this, function (x, y, width, height) {
						var templateParams = itemTemplateParamsTask.getTemplateParams(treeItemId),
							template = templateParams.template;

						uiHash = new chartDiag.default.RenderEventArgs();
						uiHash.context = combinedContextsTask.getConfig(treeItemId);
						uiHash.isCursor = (treeItemId == cursorItemId);
						uiHash.isSelected = selectedItemsTask.isSelected(treeItemId);
						uiHash.templateName = template.templateConfig.name;

						_graphics.activate("placeholder", 10/*chartDiag.default.Layers.Item*/);
						element = _graphics.template(
								x
								, y
								, width
								, height
								, treeItemPosition.contentPosition.x
								, treeItemPosition.contentPosition.y
								, treeItemPosition.contentPosition.width
								, treeItemPosition.contentPosition.height
								, template.itemTemplate.template()
								, template.itemTemplate.getHashCode()
								, template.itemTemplate.render
								, uiHash
								, { "border-width": template.templateConfig.itemBorderWidth }
								);

						if (templateParams.hasGroupTitle) {
							element = _graphics.template(
									x,
									y,
									width,
									height,
									2,
									treeItemPosition.contentPosition.y,
									_itemsSizesOptions.groupTitlePanelSize - 4,
									treeItemPosition.contentPosition.height + 2,
									_groupTitleTemplate.template(),
									_groupTitleTemplate.getHashCode(),
									_groupTitleTemplate.render,
									uiHash,
									null
									);
						}
						if (templateParams.hasSelectorCheckbox) {
							_graphics.activate("placeholder", 14/*chartDiag.default.Layers.Controls*/);
							element = _graphics.template(
									x,
									y,
									width,
									height,
									treeItemPosition.contentPosition.x,
									height - (_itemsSizesOptions.checkBoxPanelSize - 4),
									treeItemPosition.contentPosition.width,
									_itemsSizesOptions.checkBoxPanelSize - 4,
									_checkBoxTemplate.template(),
									_checkBoxTemplate.getHashCode(),
									_checkBoxTemplate.render,
									uiHash,
									null
									);
						}
						if (templateParams.hasButtons) {
							_graphics.activate("placeholder", 14/*chartDiag.default.Layers.Controls*/);
							element = _graphics.template(
									x,
									y,
									width,
									height,
									width - (_itemsSizesOptions.buttonsPanelSize - 4),
									treeItemPosition.contentPosition.y,
									_itemsSizesOptions.buttonsPanelSize - 4,
									Math.max(treeItemPosition.contentPosition.height, height - treeItemPosition.contentPosition.y),
									_buttonsTemplate.template(),
									template.templateConfig.name + _buttonsTemplate.getHashCode(),
									_buttonsTemplate.render,
									templateParams,
									null
									);
						}
					});//ignore jslint
			}
		});
	}

	return {
		process: process
	};
};

/* /Controls/OrgDiagram/Tasks/Templates/AnnotationLabelTemplateTask.js*/
chartDiag.orgChart.AnnotationLabelTemplateTask = function (itemsSizesOptionTask) {
	var _data = {
		template: null
	};

	function process() {
		return false;
	}

	function getTemplate() {
		if (_data.template == null) {
			_data.template = new chartDiag.default.AnnotationLabelTemplate();
		}
		return _data.template;
	}

	return {
		process: process,
		getTemplate: getTemplate
	};
};

/* /Controls/OrgDiagram/Tasks/Templates/ButtonsTemplateTask.js*/
chartDiag.orgChart.ButtonsTemplateTask = function (itemsSizesOptionTask) {
	var _data = {
		template: null
	};

	function process() {
		return false;
	}

	function getTemplate() {
		if (_data.template == null) {
			_data.template = new chartDiag.default.ButtonsTemplate();
		}
		return _data.template;
	}

	return {
		process: process,
		getTemplate: getTemplate
	};
};

/* /Controls/OrgDiagram/Tasks/Templates/CheckboxTemplateTask.js*/
chartDiag.orgChart.CheckBoxTemplateTask = function (itemsSizesOptionTask) {
	var _data = {
		template: null
	};

	function process() {
		_data.template = null;
		return true;
	}

	function getTemplate() {
		var options;
		if (_data.template == null) {
			options = itemsSizesOptionTask.getOptions();
			_data.template = new chartDiag.default.CheckBoxTemplate(options.selectCheckBoxLabel);
		}
		return _data.template;
	}

	return {
		process: process,
		getTemplate: getTemplate
	};
};

/* /Controls/OrgDiagram/Tasks/Templates/GroupTitleTemplateTask.js*/
chartDiag.orgChart.GroupTitleTemplateTask = function (templatesOptionTask) {
	var _data = {
		template: null
	};

	function process() {
		_data.template = null;
		return true;
	}

	function getTemplate() {
		var options;
		if (_data.template == null) {
			options = templatesOptionTask.getOptions();
			_data.template = new chartDiag.default.GroupTitleTemplate(options.itemTitleFirstFontColor, options.itemTitleSecondFontColor);
		}
		return _data.template;
	}

	return {
		process: process,
		getTemplate: getTemplate
	};
};

/* /Controls/OrgDiagram/Tasks/Templates/ItemTemplateParamsTask.js*/
chartDiag.orgChart.ItemTemplateParamsTask = function (itemsSizesOptionTask, cursorItemOptionTask, readTemplatesTask) {
	var _data = {
		items: {} // TemplateParams
	};

	function process() {
		var itemsSizesOptions = itemsSizesOptionTask.getOptions(),
			widgetHasButtons = (itemsSizesOptions.buttons.length > 0),
			cursorItem = cursorItemOptionTask.getCursorItem(),
			items = itemsSizesOptions.items,
			index, len;

		_data.items = {};

		for (index = 0, len = items.length; index < len; index += 1) {
			var itemConfig = items[index],
				templateParams = new chartDiag.orgChart.TemplateParams(),
				isCursor = (cursorItem == itemConfig.id),
				template = readTemplatesTask.getTemplate(itemConfig.templateName, itemsSizesOptions.defaultTemplateName, readTemplatesTask.DefaultWidgetTemplateName),
				templateConfig = template.templateConfig,
				templateHasButtons = (templateConfig.buttons != null && templateConfig.buttons.length > 0);

			templateParams.template = template;

			templateParams.hasSelectorCheckbox = getSelectionVisibility(isCursor, itemConfig.hasSelectorCheckbox, itemsSizesOptions.hasSelectorCheckbox);
			templateParams.hasButtons = (widgetHasButtons || templateHasButtons) && getSelectionVisibility(isCursor, itemConfig.hasButtons, itemsSizesOptions.hasButtons);
			templateParams.hasGroupTitle = !chartDiag.default.isNullOrEmpty(itemConfig.groupTitle);
			templateParams.isActive = itemConfig.isActive && templateConfig.isActive;
			if (templateParams.hasButtons) {
				templateParams.buttons = templateHasButtons ? templateConfig.buttons : itemsSizesOptions.buttons;
			}
			_data.items[itemConfig.id] = templateParams;
		}
		return true;
	}

	function getSelectionVisibility(isCursor, itemState, widgetState) {
		var result = false;
		switch (itemState) {
			case 0/*chartDiag.default.Enabled.Auto*/:
				switch (widgetState) {
					case 0/*chartDiag.default.Enabled.Auto*/:
						result = isCursor;
						break;
					case 1/*chartDiag.default.Enabled.True*/:
						result = true;
						break;
					case 2/*chartDiag.default.Enabled.False*/:
						result = false;
						break;
				}
				break;
			case 1/*chartDiag.default.Enabled.True*/:
				result = true;
				break;
			case 2/*chartDiag.default.Enabled.False*/:
				result = false;
				break;
		}
		return result;
	}

	function getTemplateParams(orgItemId) {
		return _data.items[orgItemId];
	}

	return {
		process: process,
		getTemplateParams: getTemplateParams
	};
};

/* /Controls/OrgDiagram/Tasks/Templates/PrintPreviewTemplateTask.js*/
chartDiag.orgChart.PrintPreviewTemplateTask = function (itemsSizesOptionTask) {
	var _data = {
		template: null
	};

	function process() {
		return false;
	}

	function getTemplate() {
		if (_data.template == null) {
			_data.template = new chartDiag.default.PrintPreviewTemplate();
		}
		return _data.template;
	}

	return {
		process: process,
		getTemplate: getTemplate
	};
};

/* /Controls/OrgDiagram/Tasks/Templates/ReadTemplatesTask.js*/
chartDiag.orgChart.ReadTemplatesTask = function (templatesOptionTask) {
	var _data = {
		templates: {}
	},
	_defaultWidgetTemplateName = "DefaultWidgetTemplate",
	_defaultWidgetLabelAnnotationTemplateName = "DefaultWidgetLabelAnnotationTemplate";

	function process() {
		var index, len,
			templateConfig,
			templatesOptions = templatesOptionTask.getOptions(),
			templates = templatesOptions.templates;


		_data.templates = {};
		_data.templates[_defaultWidgetTemplateName] = new chartDiag.orgChart.Template(templatesOptions, new chartDiag.orgChart.TemplateConfig());

		var labelAnnotationTemplateConfig = new chartDiag.orgChart.TemplateConfig();
		labelAnnotationTemplateConfig.name = _defaultWidgetLabelAnnotationTemplateName;
		labelAnnotationTemplateConfig.isActive = false;
		labelAnnotationTemplateConfig.itemSize = new chartDiag.default.Size(100, 20);
		labelAnnotationTemplateConfig.minimizedItemSize = new chartDiag.default.Size(0, 0);

		var labelAnnotationTemplate = new chartDiag.orgChart.Template();
		labelAnnotationTemplate.templateConfig = labelAnnotationTemplateConfig;
		labelAnnotationTemplate.minimizedItemCornerRadius = labelAnnotationTemplateConfig.minimizedItemSize.width / 2;
		labelAnnotationTemplate.itemTemplate = new chartDiag.default.LabelAnnotationTemplate();
		labelAnnotationTemplate.dotHighlightTemplate = new chartDiag.default.DotHighlightTemplate(templatesOptions, labelAnnotationTemplateConfig);

		_data.templates[_defaultWidgetLabelAnnotationTemplateName] = labelAnnotationTemplate;


		for (index = 0, len = templates.length; index < len; index += 1) {
			templateConfig = templates[index];
			_data.templates[templateConfig.name] = new chartDiag.orgChart.Template(templatesOptions, templateConfig);
		}

		return true;
	}

	function getTemplate(templateName1, templateName2, templateName3) {
		var result = _data.templates[templateName1] || _data.templates[templateName2] || _data.templates[templateName3];
		return result;
	}

	return {
		process: process,
		getTemplate: getTemplate,
		DefaultWidgetTemplateName: _defaultWidgetTemplateName,
		DefaultWidgetLabelAnnotationTemplateName: _defaultWidgetLabelAnnotationTemplateName
	};
};

/* /Controls/OrgDiagram/Tasks/Transformations/Selection/CombinedNormalVisibilityItemsTask.js*/
chartDiag.orgChart.CombinedNormalVisibilityItemsTask = function (itemsSizesOptionTask, cursorItemTask, cursorNeighboursTask, selectedItemsTask, selectionPathItemsTask,
	normalVisibilityItemsByForegroundShapeAnnotationTask, normalVisibilityItemsByBackgroundShapeAnnotationTask,
	normalVisibilityItemsByBackgroundAnnotationTask,
	normalVisibilityItemsByHighlightPathAnnotationTask,
	normalVisibilityItemsByForegroundConnectorAnnotationTask, normalVisibilityItemsByBackgroundConnectorAnnotationTask
	) {
	var _data = {
			items: []
		},
		_hash = {},
		_sourceTasks = [
			cursorItemTask,
			cursorNeighboursTask,
			selectedItemsTask,
			selectionPathItemsTask,
			normalVisibilityItemsByForegroundShapeAnnotationTask, normalVisibilityItemsByBackgroundShapeAnnotationTask,
			normalVisibilityItemsByBackgroundAnnotationTask,
			normalVisibilityItemsByHighlightPathAnnotationTask,
			normalVisibilityItemsByForegroundConnectorAnnotationTask, normalVisibilityItemsByBackgroundConnectorAnnotationTask
		],
		_dataTemplate = new chartDiag.default.ArrayReader(
				new chartDiag.default.ValueReader(["string", "number"], true),
				true
				);


	function process() {
		var context = {
			isChanged: false,
			hash: _hash
		},
		itemsSizesOption = itemsSizesOptionTask.getOptions();

		_data.items = _dataTemplate.read(_data.items, getSelectedItems(_sourceTasks), "items", context);

		if (itemsSizesOption.pageFitMode == 0/*chartDiag.default.PageFitMode.None*/ || itemsSizesOption.minimalVisibility == 1/*chartDiag.default.Visibility.Normal*/) {
			context.isChanged = false;
		}

		return context.isChanged;
	}

	function getSelectedItems(sourceTasks) {
		var result = [],
			sourceIndex, sourceLen,
			sourceTask,
			index, len,
			items, item,
			processed = {};

		for (sourceIndex = 0, sourceLen = sourceTasks.length; sourceIndex < sourceLen; sourceIndex += 1) {
			sourceTask = sourceTasks[sourceIndex];
			items = sourceTask.getItems();

			for (index = 0, len = items.length; index < len; index += 1) {
				item = items[index];

				if (!processed.hasOwnProperty(item)) {
					result.push(item);
					processed[item] = true;
				}
			}
		}
		return result;
	}

	function isItemSelected(treeItem) {
		return _hash.items.hasOwnProperty(treeItem);
	}

	return {
		process: process,
		isItemSelected: isItemSelected
	};
};

/* /Controls/OrgDiagram/Tasks/Transformations/Selection/CursorItemTask.js*/
chartDiag.orgChart.CursorItemTask = function (cursorItemOptionTask, orgTreeTask) {
	var _data = {
		cursorTreeItemId: null
	};

	function process() {
		var treeItemId = cursorItemOptionTask.getCursorItem(),
			orgTree = orgTreeTask.getOrgTree(),
			orgItem = orgTree.node(treeItemId);

		_data.cursorTreeItemId = (treeItemId != null && orgItem != null && orgItem.isActive && orgItem.isVisible) ? treeItemId : null;

		return true;
	}

	function getCursorTreeItem() {
		return _data.cursorTreeItemId;
	}

	function getItems() {
		return (_data.cursorTreeItemId != null) ? [_data.cursorTreeItemId] : [];
	}

	return {
		process: process,
		getCursorTreeItem: getCursorTreeItem,
		getItems: getItems
	};
};

/* /Controls/OrgDiagram/Tasks/Transformations/Selection/CursorNeighboursTask.js*/
chartDiag.orgChart.CursorNeighboursTask = function (cursorItemTask, navigationFamilyTask) {
	var _data = {
		items: []
	};

	function process() {
		var navigationFamily = navigationFamilyTask.getNavigationFamily(),
			cursorTreeItemId = cursorItemTask.getCursorTreeItem();

		_data.items = getCursorNeighbours(cursorTreeItemId, navigationFamily);

		return true;
	}

	function getCursorNeighbours(cursorTreeItemId, navigationFamily) {
		var result = [];
		if (cursorTreeItemId !== null) {
			navigationFamily.loopNeighbours(this, cursorTreeItemId, function (treeItemId, treeItem, distance) {
				if (treeItem.visibility === 0/*chartDiag.default.Visibility.Auto*/) {
					result.push(treeItemId);
				}
				return true;
			});
		}
		return result;
	}

	function getItems() {
		return _data.items;
	}

	return {
		process: process,
		getItems: getItems
	};
};

/* /Controls/OrgDiagram/Tasks/Transformations/Selection/HighlightItemTask.js*/
chartDiag.orgChart.HighlightItemTask = function (highlightItemOptionTask, orgTreeTask) {
	var _data = {
		highlightTreeItemId: null
	};

	function process() {
		var treeItemId = highlightItemOptionTask.getHighlightItem(),
			orgTree = orgTreeTask.getOrgTree(),
			orgItem = orgTree.node(treeItemId);

		_data.highlightTreeItemId = (treeItemId != null && orgItem != null && orgItem.isActive && orgItem.isVisible) ? treeItemId : null;

		return true;
	}

	function getHighlightTreeItem() {
		return _data.highlightTreeItemId;
	}

	return {
		process: process,
		getHighlightTreeItem: getHighlightTreeItem
	};
};

/* /Controls/OrgDiagram/Tasks/Transformations/Selection/NormalVisibilityItemsByAnnotationTask.js*/
chartDiag.orgChart.NormalVisibilityItemsByAnnotationTask = function (annotationOptionTask) {
	var _data = {
		items: []
	},
		_hash = {};

	var _dataTemplate = new chartDiag.default.ArrayReader(
			new chartDiag.default.ValueReader(["string", "number"], true),
			true
		);

	function process() {
		var context = {
			isChanged: false,
			hash: _hash
		},
		annotations = annotationOptionTask.getAnnotations();

		_data.items = _dataTemplate.read(_data.items, getSelectedItems(annotations), "items", context);

		return context.isChanged;
	}

	function getSelectedItems(annotations) {
		var result = [],
			processed = {},
			index, len, index2, len2,
			items, item,
			annotation,
			treeItemId;

		for (index = 0, len = annotations.length; index < len; index += 1) {
			annotation = annotations[index];
			if (annotation.selectItems) {
				items = annotation.items;
				for (index2 = 0, len2 = items.length; index2 < len2; index2 += 1) {
					treeItemId = items[index2];
					if (treeItemId != null && !processed.hasOwnProperty(treeItemId)) {
						result.push(treeItemId);
						processed[treeItemId] = true;
					}
				}
			}
		}

		return result;
	}

	function getItems() {
		return _data.items;
	}

	return {
		process: process,
		getItems: getItems
	};
};

/* /Controls/OrgDiagram/Tasks/Transformations/Selection/NormalVisibilityItemsByConnectorAnnotationTask.js*/
chartDiag.orgChart.NormalVisibilityItemsByConnectorAnnotationTask = function (connectorAnnotationOptionTask) {
	var _data = {
			items: []
		},
		_hash = {},
		_dataTemplate = new chartDiag.default.ArrayReader(
			new chartDiag.default.ValueReader(["string", "number"], true),
			true
		);

	function process() {
		var context = {
			isChanged: false,
			hash: _hash
		},
		annotations = connectorAnnotationOptionTask.getAnnotations();

		_data.items = _dataTemplate.read(_data.items, getSelectedItems(annotations), "items", context);

		return context.isChanged;
	}

	function getSelectedItems(annotations) {
		var result = [],
			processed = {},
			index, len,
			annotation,
			treeItem;

		for (index = 0, len = annotations.length; index < len; index += 1) {
			annotation = annotations[index];
			if (annotation.selectItems) {
				if (annotation.fromItem != null && !processed.hasOwnProperty(annotation.fromItem)) {
					result.push(annotation.fromItem);
					processed[annotation.fromItem] = true;
				}
				if (annotation.toItem != null && !processed.hasOwnProperty(annotation.toItem)) {
					result.push(annotation.toItem);
					processed[annotation.toItem] = true;
				}
			}
		}

		return result;
	}

	function getItems() {
		return _data.items;
	}

	return {
		process: process,
		getItems: getItems
	};
};

/* /Controls/OrgDiagram/Tasks/Transformations/Selection/SelectedItemsTask.js*/
chartDiag.orgChart.SelectedItemsTask = function (selectedItemsOptionTask) {
	var _data = {
			items: []
		},
		_hash = {},
		_dataTemplate = new chartDiag.default.ArrayReader(
			new chartDiag.default.ValueReader(["string", "number"], true),
			true
		);

	function process() {
		var context = {
			isChanged: false,
			hash: _hash
		},
		selectedItems = selectedItemsOptionTask.getSelectedItems();

		_data.items = _dataTemplate.read(_data.items, getSelectedItems(selectedItems), "items", context);

		return context.isChanged;
	}

	function getSelectedItems(selectedItems) {
		var result = [],
			processed = {},
			index, len,
			treeItemId;

		for (index = 0, len = selectedItems.length; index < len; index += 1) {
			treeItemId = selectedItems[index];
			if (treeItemId != null && !processed.hasOwnProperty(treeItemId)) {
				result.push(treeItemId);
				processed[treeItemId] = true;
			}
		}

		return result;
	}

	function isSelected(itemid) {
		return _hash.items.hasOwnProperty(itemid);
	}

	function getItems() {
		return _data.items;
	}

	return {
		process: process,
		getItems: getItems,
		isSelected: isSelected
	};
};

/* /Controls/OrgDiagram/Tasks/Transformations/Selection/SelectionPathItemsTask.js*/
chartDiag.orgChart.SelectionPathItemsTask = function (navigationFamilyTask, cursorItemTask, selectedItemsTask, cursorSelectionPathModeOptionTask) {
	var _data = {
		items: []
	};

	function process() {
		var selectionPathMode = cursorSelectionPathModeOptionTask.getSelectionPathMode(),
			navigationFamily = navigationFamilyTask.getNavigationFamily(),
			cursorTreeItemId = cursorItemTask.getCursorTreeItem(),
			selectedItems = selectedItemsTask.getItems().slice(0);

		selectedItems.push(cursorTreeItemId);

		_data.items = getSelectionPathItems(selectedItems, navigationFamily, selectionPathMode);

		return true;
	}

	function getSelectionPathItems(selectedItems, navigationFamily, selectionPathMode) {
		var result = [],
			processed = {},
			selectedItem,
			index, len;

		for (index = 0, len = selectedItems.length; index < len; index += 1) {
			selectedItem = selectedItems[index];
			/* show cursor full stack */
			switch (selectionPathMode) {
				case 0/*chartDiag.default.SelectionPathMode.None*/:
					break;
				case 1/*chartDiag.default.SelectionPathMode.FullStack*/:
					/* select all parents up to the root */
					navigationFamily.loopParents(this, selectedItem, function (parentItemId, parentItem) {
						if (processed[parentItemId] != null) {
							return navigationFamily.SKIP;
						}
						result.push(parentItemId);
						processed[parentItemId] = true;
					});
					break;
			}
		}
		return result;
	}

	function getItems() {
		return _data.items;
	}

	return {
		process: process,
		getItems: getItems
	};
};

/* /Controls/OrgDiagram/Tasks/Transformations/BackgroundAnnotationManagerTask.js*/
chartDiag.orgChart.BackgroundAnnotationManagerTask = function (itemsSizesOptionTask, orgTreeTask, visualTreeLevelsTask, alignDiagramTask) {
	var _data = {
		backgroundManager: null
	},
	_orgTree,
	_treeLevels,
	_treeLevelsPositions,
	_treeItemsPositions,
	_options;

	function process() {

		_data.backgroundManager = null;

		_orgTree = orgTreeTask.getOrgTree();
		_treeLevels = visualTreeLevelsTask.getTreeLevels();
		_treeLevelsPositions = alignDiagramTask.getTreeLevelsPositions();
		_treeItemsPositions = alignDiagramTask.getItemsPositions();

		_options = itemsSizesOptionTask.getOptions();

		return true;
	}

	function createBackgroundManager() {
		var result = new chartDiag.default.perimeter.Manager(),
			index, len,
			index2, len2,
			mergedTreeLevelOffsetsHashs,
			prevLevelOffsets, offsetsHash,
			visibleLayers, treeLevelOffsets, mergedTreeLevelOffsets, merged,
			prevTreeItemPosition, treeItemPosition, nextTreeItemPosition,
			offsets, offset,
			prevTreeLevelPosition, treeLevelPosition, nextTreeLevelPosition,
			perimeters,
			nextTreeLevel, treeLevel, prevTreeLevel;
		if (!_treeLevels.isEmpty()) {
			// collect tree item offsets for visible levels only
			visibleLayers = [];
			treeLevelOffsets = [];
			_treeLevels.loopLevels(this, function (levelIndex) {
				prevTreeItemPosition = null;
				treeItemPosition = null;
				treeLevelPosition = _treeLevelsPositions[levelIndex];
				if (treeLevelPosition.actualVisibility != 4/*chartDiag.default.Visibility.Invisible*/) {
					visibleLayers.push(levelIndex);
					offsets = [];
					_treeLevels.loopLevelItems(this, levelIndex, function (treeItemId) {
						var nextOrgItem = _orgTree.node(treeItemId);
						nextTreeItemPosition = _treeItemsPositions[treeItemId];
						if (nextTreeItemPosition.actualVisibility != 4/*chartDiag.default.Visibility.Invisible*/) {
							if (nextOrgItem != null) {
								if (treeItemPosition != null) {
									addOffset(offsets, prevTreeItemPosition, treeItemPosition, nextTreeItemPosition);
								}
								prevTreeItemPosition = treeItemPosition;
								treeItemPosition = nextTreeItemPosition;
							}
						}
					});
					if (treeItemPosition != null) {
						addOffset(offsets, prevTreeItemPosition, treeItemPosition, null);
					}
					treeLevelOffsets.push(offsets);
				}
			});

			if (treeLevelOffsets.length > 0) {

				// merge adjustent tree level offsets
				mergedTreeLevelOffsets = [];
				prevLevelOffsets = [];
				for (index = 0, len = treeLevelOffsets.length; index < len; index += 1) {
					merged = chartDiag.default.mergeSort([prevLevelOffsets, treeLevelOffsets[index]], null, true);
					mergedTreeLevelOffsets.push(merged);
					prevLevelOffsets = treeLevelOffsets[index];
				}
				mergedTreeLevelOffsets.push(chartDiag.default.mergeSort([treeLevelOffsets[index - 1]], null, true)); // we need extra level for last one

				// create offset hashs
				mergedTreeLevelOffsetsHashs = []; // array of hashes. Hash key = offset and hash value = offset index
				for (index = 0, len = mergedTreeLevelOffsets.length; index < len; index += 1) {
					offsetsHash = {};
					offsets = mergedTreeLevelOffsets[index];
					for (index2 = 0, len2 = offsets.length; index2 < len2; index2 += 1) {
						offset = offsets[index2];
						offsetsHash[offset] = index2;
					}
					mergedTreeLevelOffsetsHashs.push(offsetsHash);
				}

				// create perimeters for tree levels having visible items
				perimeters = [];
				prevTreeLevel = null;
				treeLevel = null;
				for (index = 0, len = visibleLayers.length; index < len; index += 1) {
					nextTreeLevel = visibleLayers[index];

					if (treeLevel != null) {
						addTreeLevelPerimeters(perimeters, index - 1, mergedTreeLevelOffsetsHashs, mergedTreeLevelOffsets, _treeLevelsPositions[prevTreeLevel], treeLevel, _treeLevelsPositions[treeLevel], _treeLevelsPositions[nextTreeLevel]);
					}
					prevTreeLevel = treeLevel;
					treeLevel = nextTreeLevel;
				}
				if (treeLevel != null) {
					addTreeLevelPerimeters(perimeters, index - 1, mergedTreeLevelOffsetsHashs, mergedTreeLevelOffsets, _treeLevelsPositions[prevTreeLevel], treeLevel, _treeLevelsPositions[treeLevel], null);
				}

				// Load perimeters into manager
				result.add(perimeters);
			}
		}
		return result;
	}

	function addTreeLevelPerimeters(perimeters, index, hashes, offsets, prevTreeLevelPosition, levelIndex, treeLevelPosition, nextTreeLevelPosition) {
		var interval = Math.floor(_options.normalItemsInterval / 2),
			y = (prevTreeLevelPosition != null) ? Math.floor((prevTreeLevelPosition.shift + prevTreeLevelPosition.depth) * 3 / 7 + treeLevelPosition.shift * 4 / 7) : treeLevelPosition.shift - interval,
			y2 = (nextTreeLevelPosition != null) ? Math.floor((treeLevelPosition.shift + treeLevelPosition.depth) * 3 / 7 + nextTreeLevelPosition.shift * 4 / 7) : treeLevelPosition.shift + treeLevelPosition.depth + interval,
			prevItemPosition = null,
			itemPosition = null,
			nextItemPosition,
			orgItem, nextOrgItem;


		_treeLevels.loopLevelItems(this, levelIndex, function (treeItemId) {
			nextOrgItem = _orgTree.node(treeItemId);
			nextItemPosition = _treeItemsPositions[treeItemId];
			if (nextItemPosition.actualVisibility != 4/*chartDiag.default.Visibility.Invisible*/) {
				
				if (nextOrgItem != null) {
					if (itemPosition != null) {
						addPerimeter(perimeters, hashes[index], hashes[index + 1], offsets[index], offsets[index + 1], y, y2, prevItemPosition, itemPosition, nextItemPosition, orgItem.id);
					}
					prevItemPosition = itemPosition;
					itemPosition = nextItemPosition;

					orgItem = nextOrgItem;
				}
			}
		});
		if (itemPosition != null) {
			addPerimeter(perimeters, hashes[index], hashes[index + 1], offsets[index], offsets[index + 1], y, y2, prevItemPosition, itemPosition, null, orgItem.id);
		}
	}

	function addOffset(offsets, prevItemPosition, itemPosition, nextItemPosition) {
		var interval = Math.floor(_options.normalItemsInterval / 2),
			x = (prevItemPosition != null) ? Math.floor((prevItemPosition.actualPosition.right()) * 3 / 7 + itemPosition.actualPosition.x * 4 / 7) : itemPosition.actualPosition.x - interval,
			x2 = (nextItemPosition != null) ? Math.floor((itemPosition.actualPosition.right()) * 3 / 7 + nextItemPosition.actualPosition.x * 4 / 7) : itemPosition.actualPosition.right() + interval;

		offsets.push(x);
		offsets.push(x2);
	}

	function addPerimeter(perimeters, topHash, bottomHash, topOffsets, bottomOffsets, y, y2, prevItemPosition, itemPosition, nextItemPosition, itemid) {
		var segments = [],
			SegmentItem = chartDiag.default.perimeter.SegmentItem,
			interval = Math.floor(_options.normalItemsInterval / 2),
			x = (prevItemPosition != null) ? Math.floor((prevItemPosition.actualPosition.right()) * 3 / 7 + itemPosition.actualPosition.x * 4 / 7) : itemPosition.actualPosition.x - interval,
			x2 = (nextItemPosition != null) ? Math.floor((itemPosition.actualPosition.right()) * 3 / 7 + nextItemPosition.actualPosition.x * 4 / 7) : itemPosition.actualPosition.right() + interval,
			index;

		// left side
		segments.push(new SegmentItem(x, y, x, y2));

		// bottom side
		for (index = bottomHash[x] + 1; index <= bottomHash[x2]; index += 1) {
			segments.push(new SegmentItem(bottomOffsets[index - 1], y2, bottomOffsets[index], y2));
		}

		// right side
		segments.push(new SegmentItem(x2, y2, x2, y));

		// top side
		for (index = topHash[x2] - 1; index >= topHash[x]; index -= 1) {
			segments.push(new SegmentItem(topOffsets[index + 1], y, topOffsets[index], y));
		}

		perimeters.push(new chartDiag.default.perimeter.Item(itemid, segments));
	}

	function getBackgroundManager() {
		if (_data.backgroundManager == null) {
			_data.backgroundManager = createBackgroundManager();
		}
		return _data.backgroundManager;
	}

	return {
		process: process,
		getBackgroundManager: getBackgroundManager
	};
};

/* /Controls/OrgDiagram/Tasks/Transformations/CombinedContextsTask.js*/
chartDiag.orgChart.CombinedContextsTask = function (task1, task2) {
	function process() {
		return true;
	}

	function getConfig(itemId) {
		return task1.getConfig(itemId) || (task2 != null && task2.getConfig(itemId));
	}

	return {
		process: process,
		getConfig: getConfig
	};
};

/* /Controls/OrgDiagram/Tasks/Transformations/ConnectionsGraphTask.js*/
chartDiag.orgChart.ConnectionsGraphTask = function (visualTreeTask, visualTreeLevelsTask, extraPartnersTask) {
	var _data = {
		graph: null
	},
	_visualTree,
	_treeLevels,
	_activeTreeLevels;

	function process() {
		_data.graph = null; /* the graph is created on demand by getGraph function */

		_visualTree = visualTreeTask.getVisualTree();
		_treeLevels = visualTreeLevelsTask.getTreeLevels();
		_activeTreeLevels = visualTreeLevelsTask.getActiveTreeLevels();

		return true;
	}

	function createConnectionsGraph() {
		var treeLevel, index, len,
			id, treeItem, treeItemTo,
			treeItemWeight, treeItemToWeight,
			toItems, itemTo,
			result = chartDiag.default.graph(),
			parentTreeItem, extraPartners,
			edge;

		_treeLevels.loopLevels(this, function (levelIndex) {
			_treeLevels.loopLevelItems(this, levelIndex, function (treeItemId) {
				treeItem = _visualTree.node(treeItemId);
				treeItemWeight = _activeTreeLevels.hasItem(treeItemId) != null ? 100 : 1;

				if (treeItem.connectorPlacement & 8/*chartDiag.default.SideFlag.Left*/) {
					toItems = [_treeLevels.getPrevItem(treeItemId)];
				} else if (treeItem.connectorPlacement & 2/*chartDiag.default.SideFlag.Right*/) {
					toItems = [_treeLevels.getNextItem(treeItemId)];
				} else if (treeItem.connectorPlacement & 1/*chartDiag.default.SideFlag.Top*/) {
					parentTreeItem = _visualTree.parent(treeItemId);
					if (parentTreeItem.partners.length > 1) {
						toItems = parentTreeItem.partners.slice(0);
					} else {
						toItems = [parentTreeItem.id];
					}
					var extraPartners = extraPartnersTask.getOrgPartners(parentTreeItem.id);
					if (extraPartners.length > 0) {
						toItems = toItems.concat(extraPartners);
					}
				} else {
					toItems = [];
				}

				for (index = 0, len = toItems.length; index < len; index += 1) {
					itemTo = toItems[index];
					treeItemToWeight = _activeTreeLevels.hasItem(itemTo) != null ? 100 : 1;

					edge = new chartDiag.famChart.EdgeItem(treeItemId, treeItemWeight, itemTo, treeItemToWeight);
					edge.highlightItemId = treeItemId;
					if (len != 1) {
						edge.partnerid = itemTo;
					}

					result.addEdge(treeItemId, itemTo, edge);
				}
			});
		});
		return result;
	}

	function getGraph() {
		if (_data.graph == null) {
			_data.graph = createConnectionsGraph();
		}
		return _data.graph;
	}

	return {
		process: process,
		getGraph: getGraph
	};
};

/* /Controls/OrgDiagram/Tasks/Transformations/DummyExtraPartnersTask.js*/
/*	Creates extra partners collection of relations between visual tree items
	They are used to draw connectors between items in different branches of organizational chart
*/
chartDiag.orgChart.DummyExtraPartnersTask = function (visualTreeTask) {
	var _data = {
		extraPartners: {}
	};

	function process() {
		return false;
	}

	function getOrgPartners(treeItemId) {
		return _data.extraPartners[treeItemId] || [];
	}

	return {
		process: process,
		getOrgPartners: getOrgPartners
	};
};

/* /Controls/OrgDiagram/Tasks/Transformations/IntervalsTask.js*/
chartDiag.orgChart.IntervalsTask = function (itemsSizesOptionTask) {
	var intervals = {};

	function process() {
		var options = itemsSizesOptionTask.getOptions();

		intervals[1/*chartDiag.default.Visibility.Normal*/] = options.normalItemsInterval;
		intervals[2/*chartDiag.default.Visibility.Dot*/] = options.dotItemsInterval;
		intervals[3/*chartDiag.default.Visibility.Line*/] = options.lineItemsInterval;
		intervals[4/*chartDiag.default.Visibility.Invisible*/] = options.lineItemsInterval;

		return true;
	}

	function getInterval(visibility) {
		return intervals[visibility];
	}

	return {
		process: process,
		getInterval: getInterval
	};
};

/* /Controls/OrgDiagram/Tasks/Transformations/ItemsPositionsTask.js*/
chartDiag.orgChart.ItemsPositionsTask = function (currentControlSizeTask, scaleOptionTask, orientationOptionTask, itemsSizesOptionTask, connectorsOptionTask, visualTreeOptionTask,
	extraPartnersTask,
	intervalsTask, visualTreeTask, visualTreeLevelsTask, visualTreeMarginsTask,
	itemTemplateParamsTask,
	cursorItemTask, combinedNormalVisibilityItemsTask) {
	var _data = {
		treeItemsPositions: {}, // chartDiag.orgChart.TreeItemPosition();
		treeLevelsPositions: [], // chartDiag.orgChart.TreeLevelPosition()
		panelSize: null // chartDiag.default.Rect();
	},
	_treeLevels,
	_visualTree,
	_leftMargins,
	_rightMargins,
	_orientationOptions,
	_connectorsOptions,
	_visualTreeOptions,
	_itemsSizesOptions,
	_scaleOptions;

	function process() {
		var panelSize,
			panelRect,
			scale;

		_itemsSizesOptions = itemsSizesOptionTask.getOptions();
		_orientationOptions = orientationOptionTask.getOptions();
		_connectorsOptions = connectorsOptionTask.getOptions();
		_visualTreeOptions = visualTreeOptionTask.getOptions();

		_treeLevels = visualTreeLevelsTask.getTreeLevels();
		_visualTree = visualTreeTask.getVisualTree();
		_leftMargins = visualTreeMarginsTask.getLeftMargins();
		_rightMargins = visualTreeMarginsTask.getRightMargins();

		_data.treeLevelsPositions = [];
		_data.treeItemsPositions = {};

		panelSize = currentControlSizeTask.getOptimalPanelSize();
		_scaleOptions = scaleOptionTask.getOptions();
		scale = _scaleOptions.scale;
		panelSize.scale(1.0 / scale);
		panelRect = new chartDiag.default.Rect(0, 0, panelSize.width, panelSize.height);
		_data.panelSize = positionTreeItems(panelRect);

		recalcItemsPositions();

		return true;
	}

	/*  Position */
	function positionTreeItems(panelSize) {
		var placeholderSize = new chartDiag.default.Rect(0, 0, 0, 0),
			levelVisibilities,
			visibilities,
			level,
			index,
			minimalPlaceholderSize,
			leftMargin,
			rightMargin,
			cursorIndex,
			pageSize;

		switch (_orientationOptions.orientationType) {
			case 2/*chartDiag.default.OrientationType.Left*/:
			case 3/*chartDiag.default.OrientationType.Right*/:
				panelSize.invert();
				break;
		}

		if (!_treeLevels.isEmpty()) {
			switch (_itemsSizesOptions.pageFitMode) {
				case 0/*chartDiag.default.PageFitMode.None*/:
				case 4/*chartDiag.default.PageFitMode.PrintPreview*/:
				case 5/*chartDiag.default.PageFitMode.AutoSize*/:
					levelVisibilities = [new chartDiag.orgChart.LevelVisibility(0, 1/*chartDiag.default.Visibility.Normal*/)];
					placeholderSize = setTreeLevelsVisibilityAndPositionTreeItems(levelVisibilities, 0);
					break;
				default:
					levelVisibilities = [new chartDiag.orgChart.LevelVisibility(0, 1/*chartDiag.default.Visibility.Normal*/)];
					visibilities = [];
					switch (_itemsSizesOptions.minimalVisibility) {
						case 1/*chartDiag.default.Visibility.Normal*/:
							break;
						case 2/*chartDiag.default.Visibility.Dot*/:
							visibilities.push(2/*chartDiag.default.Visibility.Dot*/);
							break;
						case 0/*chartDiag.default.Visibility.Auto*/:
						case 3/*chartDiag.default.Visibility.Line*/:
						case 4/*chartDiag.default.Visibility.Invisible*/:
							visibilities.push(2/*chartDiag.default.Visibility.Dot*/);
							visibilities.push(3/*chartDiag.default.Visibility.Line*/);
							break;
					}

					_treeLevels.loopLevelsReversed(this, function (level, levelContext) {
						var index;
						for (index = 0; index < visibilities.length; index += 1) {
							levelVisibilities.push(new chartDiag.orgChart.LevelVisibility(level, visibilities[index]));
						}
					});

					// Find minimal placeholder size to hold completly folded diagram
					minimalPlaceholderSize = setTreeLevelsVisibilityAndPositionTreeItems(levelVisibilities, levelVisibilities.length - 1);
					minimalPlaceholderSize.addRect(panelSize);
					minimalPlaceholderSize.offset(0, 0, 5, 5);

					leftMargin = null;
					rightMargin = null;
					cursorIndex = null;
					// Maximized
					placeholderSize = setTreeLevelsVisibilityAndPositionTreeItems(levelVisibilities, 0);
					if (!checkDiagramSize(placeholderSize, minimalPlaceholderSize)) {
						leftMargin = 0;

						// Minimized
						placeholderSize = setTreeLevelsVisibilityAndPositionTreeItems(levelVisibilities, levelVisibilities.length - 1);
						if (checkDiagramSize(placeholderSize, minimalPlaceholderSize)) {
							rightMargin = levelVisibilities.length - 1;

							cursorIndex = rightMargin;
							while (rightMargin - leftMargin > 1) {
								cursorIndex = Math.floor((rightMargin + leftMargin) / 2.0);

								placeholderSize = setTreeLevelsVisibilityAndPositionTreeItems(levelVisibilities, cursorIndex);
								if (checkDiagramSize(placeholderSize, minimalPlaceholderSize)) {
									rightMargin = cursorIndex;
								}
								else {
									leftMargin = cursorIndex;
								}
							}
							if (rightMargin !== cursorIndex) {
								placeholderSize = setTreeLevelsVisibilityAndPositionTreeItems(levelVisibilities, rightMargin);
							}
						}
					}
					break;
			}
		}
		return placeholderSize;
	}

	function setTreeLevelsVisibilityAndPositionTreeItems(levelVisibilities, cursorIndex) {
		var index,
			levelVisibility;

		_data.treeLevelsPositions = [];
		_treeLevels.loopLevels(this, function (index, levelContext) {
			var treeLevelPosition = new chartDiag.orgChart.TreeLevelPosition();
			treeLevelPosition.currentvisibility = 1/*chartDiag.default.Visibility.Normal*/;

			_data.treeLevelsPositions.push(treeLevelPosition);
		});


		for (index = 0; index <= cursorIndex; index += 1) {
			levelVisibility = levelVisibilities[index];

			_data.treeLevelsPositions[levelVisibility.level].currentvisibility = levelVisibility.currentvisibility;
		}
		recalcItemsSize();
		setOffsets();
		recalcLevelsDepth();
		shiftLevels();

		return new chartDiag.default.Rect(0, 0, Math.round(getDiagramWidth()), Math.round(getDiagramHeight()));
	}

	function checkDiagramSize(diagramSize, panelSize) {
		var result = false;
		switch (_itemsSizesOptions.pageFitMode) {
			case 1/*chartDiag.default.PageFitMode.PageWidth*/:
				if (panelSize.width >= diagramSize.width) {
					result = true;
				}
				break;
			case 2/*chartDiag.default.PageFitMode.PageHeight*/:
				if (panelSize.height >= diagramSize.height) {
					result = true;
				}
				break;
			case 3/*chartDiag.default.PageFitMode.FitToPage*/:
				if (panelSize.height >= diagramSize.height && panelSize.width >= diagramSize.width) {
					result = true;
				}
				break;
		}
		return result;
	}

	function getDiagramHeight() {
		var len = _data.treeLevelsPositions.length,
			treeLevel = _data.treeLevelsPositions[len - 1];
		return treeLevel.shift + treeLevel.nextLevelShift;
	}

	function getDiagramWidth() {
		var result = 0,
			index,
			len;
		for (index = 0, len = _data.treeLevelsPositions.length; index < len; index += 1) {
			result = Math.max(result, _data.treeLevelsPositions[index].currentOffset);
		}
		result += _itemsSizesOptions.normalItemsInterval;
		return result;
	}

	function recalcItemsSize() {
		var cursorItemId = cursorItemTask.getCursorTreeItem();

		_data.treeItemsPositions = {};
		_treeLevels.loopLevels(this, function (levelIndex, treeLevel) {
			var treeLevelPosition = _data.treeLevelsPositions[levelIndex];

			_treeLevels.loopLevelItems(this, levelIndex, function (treeItemId, treeItem, position) {
				var treeItemPosition = new chartDiag.orgChart.TreeItemPosition(),
					treeItemVisibility = combinedNormalVisibilityItemsTask.isItemSelected(treeItemId) ? 1/*chartDiag.default.Visibility.Normal*/ : treeItem.visibility,
					treeItemtemplate = itemTemplateParamsTask.getTemplateParams(treeItemId);

				treeItemPosition.actualVisibility = (treeItemVisibility === 0/*chartDiag.default.Visibility.Auto*/) ? treeLevelPosition.currentvisibility : treeItemVisibility;
				treeItemPosition.setSize(cursorItemId == treeItemId, treeItemtemplate, _itemsSizesOptions, _orientationOptions);

				_data.treeItemsPositions[treeItemId] = treeItemPosition;
			});
		});
	}

	function recalcLevelsDepth() {
		var index, len,
			index2, len2,
			index3, len3,
			treeItem,
			treeLevel,
			treeItems,
			itemPosition,
			treeItemsHavingPartners,
			treeItemsGroup,
			partners, partner,
			levelOffset,
			minimalDepth,
			dotsDepth,
			startIndex, endIndex,
			stackSegments;


		_treeLevels.loopLevels(this, function (levelIndex, treeLevel) {
			var treeLevelPosition = _data.treeLevelsPositions[levelIndex];
			treeLevelPosition.shift = 0.0;
			treeLevelPosition.depth = 0.0;
			treeLevelPosition.partnerConnectorOffset = 0;
			treeLevelPosition.actualVisibility = 4/*chartDiag.default.Visibility.Invisible*/;

			treeItemsHavingPartners = [];

			minimalDepth = null; /* minimum  height of non-dot items in level */
			dotsDepth = null; /* maximum dots height */

			_treeLevels.loopLevelItems(this, levelIndex, function (itemid, treeItem, position) {
				var treeItemPosition = _data.treeItemsPositions[itemid];
				treeLevelPosition.depth = Math.max(treeLevelPosition.depth, treeItemPosition.actualSize.height);
				switch (treeItemPosition.actualVisibility) {
					case 2/*chartDiag.default.Visibility.Dot*/:
					case 3/*chartDiag.default.Visibility.Line*/:
					case 4/*chartDiag.default.Visibility.Invisible*/:
						dotsDepth = !dotsDepth ? treeItemPosition.actualSize.height : Math.min(dotsDepth, treeItemPosition.actualSize.height);
						break;
					default:
						minimalDepth = !minimalDepth ? treeItemPosition.actualSize.height : Math.min(minimalDepth, treeItemPosition.actualSize.height);
						break;
				}

				treeLevelPosition.actualVisibility = Math.min(treeLevelPosition.actualVisibility, treeItemPosition.actualVisibility);

				var treeItemExtraPartners = extraPartnersTask.getOrgPartners(treeItem.id);
				if (treeItem.partners.length > 0 || treeItemExtraPartners.length > 0) {
					treeItemsHavingPartners.push(treeItem);
				}
			});

			if (minimalDepth == null) {
				minimalDepth = treeLevelPosition.depth;
			}
			if (dotsDepth != null && dotsDepth > minimalDepth) {
				minimalDepth = dotsDepth;
			}

			switch (_itemsSizesOptions.verticalAlignment) {
				case 0/*chartDiag.default.VerticalAlignmentType.Top*/:
					treeLevelPosition.horizontalConnectorsDepth = minimalDepth / 2.0;
					break;
				case 1/*chartDiag.default.VerticalAlignmentType.Middle*/:
					treeLevelPosition.horizontalConnectorsDepth = treeLevelPosition.depth / 2.0;
					break;
				case 2/*chartDiag.default.VerticalAlignmentType.Bottom*/:
					treeLevelPosition.horizontalConnectorsDepth = treeLevelPosition.depth - minimalDepth / 2.0;
					break;
			}

			if (treeItemsHavingPartners.length > 0) {
				levelOffset = 0;
				/* find minimum and maximum partner index at level */
				stackSegments = chartDiag.default.pile();
				for (index2 = 0, len2 = treeItemsHavingPartners.length; index2 < len2; index2 += 1) {
					treeItem = treeItemsHavingPartners[index2];

					var treeItemExtraPartners = extraPartnersTask.getOrgPartners(treeItem.id);
					partners = treeItem.partners.slice(0);
					if (partners.length === 0) {
						partners.push(treeItem.id);
					}
					partners = partners.concat(treeItemExtraPartners);

					startIndex = null;
					endIndex = null;
					for (index3 = 0, len3 = partners.length; index3 < len3; index3 += 1) {
						partner = _data.treeItemsPositions[partners[index3]];
						itemPosition = partner.offset + partner.actualSize.width / 2;
						startIndex = (startIndex != null) ? Math.min(startIndex, itemPosition) : itemPosition;
						endIndex = (endIndex != null) ? Math.max(endIndex, itemPosition) : itemPosition;
					}
					stackSegments.add(startIndex, endIndex, treeItem);
				}

				treeLevelPosition.partnerConnectorOffset = stackSegments.resolve(this, function (from, to, treeItem, offset) {
					_data.treeItemsPositions[treeItem.id].partnerConnectorOffset = offset + 1;
				});//ignore jslint
			}
		});
	}

	function shiftLevels() {
		var shift = _itemsSizesOptions.lineLevelShift,
			index,
			len,
			treeLevelPosition,
			childrenSpace = 0,
			parentsSpace = 0,
			arrowTipLength = _connectorsOptions.linesWidth * 8;

		switch (_connectorsOptions.arrowsDirection) {
			case 1/*chartDiag.default.GroupByType.Parents*/:
				childrenSpace = arrowTipLength;
				parentsSpace = 0;
				break;
			case 2/*chartDiag.default.GroupByType.Children*/:
				childrenSpace = 0;
				parentsSpace = arrowTipLength;
				break;
		}

		for (index = 0, len = _data.treeLevelsPositions.length; index < len; index += 1) {
			treeLevelPosition = _data.treeLevelsPositions[index];

			shift += treeLevelPosition.setShift(shift, getLevelSpace(treeLevelPosition.actualVisibility), parentsSpace, childrenSpace);
		}
	}

	function getLevelSpace(visibility) {
		var result = 0.0;

		switch (visibility) {
			case 1/*chartDiag.default.Visibility.Normal*/:
				result = _itemsSizesOptions.normalLevelShift;
				break;
			case 2/*chartDiag.default.Visibility.Dot*/:
				result = _itemsSizesOptions.dotLevelShift;
				break;
			case 3/*chartDiag.default.Visibility.Line*/:
			case 4/*chartDiag.default.Visibility.Invisible*/:
				result = _itemsSizesOptions.lineLevelShift;
				break;
		}
		return result;
	}

	function setOffsets() {
		var index,
			len;
		for (index = 0, len = _data.treeLevelsPositions.length; index < len; index += 1) {
			_data.treeLevelsPositions[index].currentOffset = 0.0;
		}
		_visualTree.loopPostOrder(this, function (treeItemId, treeItem, parentid, parent) {
			var treeItemPosition = _data.treeItemsPositions[treeItemId],
				treeItemVisibility = treeItemPosition.actualVisibility,
				treeItemLevelIndex = _treeLevels.getLevelIndex(treeItemId),
				treeLevelPosition = _data.treeLevelsPositions[treeItemLevelIndex],
				treeItemPadding = intervalsTask.getInterval(treeItemVisibility === 0/*chartDiag.default.Visibility.Auto*/ ? treeLevelPosition.currentvisibility : treeItemVisibility) / 2.0,
				index,
				len,
				offset,
				siblings,
				gaps,
				gap,
				leftMargin,
				parentItem,
				groups,
				items,
				item1,
				item2,
				groupIndex,
				groupOffset,
				group,
				sibling,
				cousinsInterval = treeLevelPosition.currentOffset > 0 ? treeItemPadding * (treeItem.relationDegree) * _itemsSizesOptions.cousinsIntervalMultiplier : 0,
				arrowTipLength = _connectorsOptions.linesWidth * 8;
			treeItemPosition.leftPadding = treeItemPadding + cousinsInterval;
			treeItemPosition.rightPadding = treeItemPadding;
			if (_connectorsOptions.arrowsDirection != 0/*chartDiag.default.GroupByType.None*/) {
				if (treeItem.connectorPlacement & 8/*chartDiag.default.SideFlag.Left*/) {
					treeItemPosition.leftPadding += arrowTipLength;
				}
				if (treeItem.connectorPlacement & 2/*chartDiag.default.SideFlag.Right*/) {
					treeItemPosition.rightPadding += arrowTipLength;
				}
			}
			treeItemPosition.offset = treeLevelPosition.currentOffset + treeItemPosition.leftPadding;
			treeLevelPosition.currentOffset = treeItemPosition.offset + treeItemPosition.actualSize.width + treeItemPosition.rightPadding;

			if (_visualTree.hasChildren(treeItemId)) {
				offset = getChildrenOffset(treeItem);
				if (offset > 0) {
					offsetItemChildren(treeItem, offset);
				}
				else if (offset < 0) {
					offset = -offset;
					offsetItem(treeItem, offset);

					siblings = null;
					gaps = {};
					leftMargin = null;
					parentItem = _visualTree.parent(treeItem.id);
					if (parentItem !== null) {
						_visualTree.loopChildrenReversed(this, parentItem.id, function (childItemId, childItem, index) {
							if (childItem === treeItem) {
								siblings = [];
							}
							else if (siblings !== null) {
								gap = getGapBetweenSiblings(childItem, treeItem);
								gaps[childItem.id] = gap;
								if (gap > 0) {
									siblings.splice(0, 0, childItem);
								}
								else {
									leftMargin = childItem;
									return true;
								}
							}
						});

						if (siblings.length > 0) {
							groups = null;
							if (leftMargin !== null) {
								items = [leftMargin];
								items = items.concat(siblings);
								items.push(treeItem);

								groups = [[leftMargin]];
								for (index = 1, len = items.length; index < len; index += 1) {
									item1 = items[index - 1];
									item2 = items[index];
									if (item1.gravity == 2/*chartDiag.default.HorizontalAlignmentType.Right*/ || item2.gravity == 1/*chartDiag.default.HorizontalAlignmentType.Left*/) {
										groups[groups.length - 1].push(item2);
									}
									else {
										groups.push([item2]);
									}
								}
							}
							else {
								groups = [siblings.slice(0)];
								groups[groups.length - 1].push(treeItem);
							}

							// align items to the right
							if (groups.length > 0) {
								siblings = groups[groups.length - 1];
								for (index = siblings.length - 2; index >= 0; index -= 1) {
									sibling = siblings[index];
									gap = gaps[sibling.id];
									offset = Math.min(gap, offset);

									offsetItem(sibling, offset);
									offsetItemChildren(sibling, offset);
								}
							}

							// spread items proportionally
							groupOffset = offset / (groups.length - 1);
							for (groupIndex = groups.length - 2; groupIndex > 0; groupIndex -= 1) {
								group = groups[groupIndex];
								for (index = group.length - 1; index >= 0; index -= 1) {
									sibling = group[index];
									gap = gaps[sibling.id];
									offset = Math.min(groupIndex * groupOffset, Math.min(gap, offset));

									offsetItem(sibling, offset);
									offsetItemChildren(sibling, offset);
								}
							}
						}
					}
				}
			}
		});
	}

	function getGapBetweenSiblings(leftItem, rightItem) {
		var result = null,
			rightMargins = getRightMargins(leftItem),
			leftMargins = getLeftMargins(rightItem),
			depth = Math.min(rightMargins.length, leftMargins.length),
			index,
			gap;

		for (index = 0; index < depth; index += 1) {
			gap = leftMargins[index] - rightMargins[index];
			result = (result !== null) ? Math.min(result, gap) : gap;

			if (gap <= 0) {
				break;
			}
		}

		return Math.floor(result);
	}

	function getRightMargins(treeItem) {
		var result = [],
			rightMargins,
			index,
			len,
			marginItemPosition;

		rightMargins = _rightMargins[treeItem.id];
		if (rightMargins === undefined) {
			rightMargins = [];
		}
		rightMargins = rightMargins.slice();
		rightMargins.splice(0, 0, treeItem.id);
		for (index = 0, len = rightMargins.length; index < len; index += 1) {
			marginItemPosition = _data.treeItemsPositions[rightMargins[index]];
			result[index] = marginItemPosition.offset + marginItemPosition.actualSize.width + marginItemPosition.rightPadding;
		}

		return result;
	}

	function getLeftMargins(treeItem) {
		var result = [],
			leftMargins,
			index, len,
			marginItemPosition;

		leftMargins = _leftMargins[treeItem.id];
		if (leftMargins === undefined) {
			leftMargins = [];
		}
		leftMargins = leftMargins.slice();
		leftMargins.splice(0, 0, treeItem.id);
		for (index = 0, len = leftMargins.length; index < len; index += 1) {
			marginItemPosition = _data.treeItemsPositions[leftMargins[index]];
			result[index] = marginItemPosition.offset - marginItemPosition.leftPadding;
		}

		return result;
	}

	function getChildrenOffset(treeItem) {
		var treeItemPosition = _data.treeItemsPositions[treeItem.id],
			treeItemCenterOffset = treeItemPosition.offset + treeItemPosition.actualSize.width / 2.0,
			childrenCenterOffset = null,
			firstItem, firstItemPosition,
			lastItem, lastItemPosition,
			visualAggregatorPosition;
		if (treeItem.visualAggregatorId === null) {
			firstItem = null;
			_visualTree.loopChildren(this, treeItem.id, function (childItemId, childItem, index) {
				firstItem = childItem;
				if (firstItem.connectorPlacement & 1/*chartDiag.default.SideFlag.Top*/) {
					return true;
				}
			});
			firstItemPosition = _data.treeItemsPositions[firstItem.id];

			lastItem = null;
			_visualTree.loopChildrenReversed(this, treeItem.id, function (childItemId, childItem, index) {
				lastItem = childItem;
				if (lastItem.connectorPlacement & 1/*chartDiag.default.SideFlag.Top*/) {
					return true;
				}
			});
			lastItemPosition = _data.treeItemsPositions[lastItem.id];

			switch (_visualTreeOptions.horizontalAlignment) {
				case 1/*chartDiag.default.HorizontalAlignmentType.Left*/:
					childrenCenterOffset = firstItemPosition.offset + firstItemPosition.actualSize.width / 2.0;
					break;
				case 2/*chartDiag.default.HorizontalAlignmentType.Right*/:
					childrenCenterOffset = lastItemPosition.offset + lastItemPosition.actualSize.width / 2.0;
					break;
				case 0/*chartDiag.default.HorizontalAlignmentType.Center*/:
					childrenCenterOffset = (firstItemPosition.offset + lastItemPosition.offset + lastItemPosition.actualSize.width) / 2.0;
					break;
			}
		}
		else {
			visualAggregatorPosition = _data.treeItemsPositions[treeItem.visualAggregatorId];
			childrenCenterOffset = visualAggregatorPosition.offset + visualAggregatorPosition.actualSize.width / 2.0;
		}

		var i = treeItemCenterOffset - childrenCenterOffset;
		return treeItemCenterOffset - childrenCenterOffset;
	}

	function offsetItem(treeItem, offset) {
		var treeItemPosition = _data.treeItemsPositions[treeItem.id];
		treeItemPosition.offset += offset;

		var treeLevelPosition = _data.treeLevelsPositions[_treeLevels.getLevelIndex(treeItem.id)];
		treeLevelPosition.currentOffset = Math.max(treeLevelPosition.currentOffset, treeItemPosition.offset + treeItemPosition.actualSize.width);
	}

	function offsetItemChildren(treeItem, offset) {
		var childTreeItemPosition,
			treeLevelPosition;

		_visualTree.loopLevels(this, treeItem.id, function (childItemId, childItem, levelid) {
			childTreeItemPosition = _data.treeItemsPositions[childItemId];
			childTreeItemPosition.offset += offset;

			treeLevelPosition = _data.treeLevelsPositions[_treeLevels.getLevelIndex(childItemId)];
			treeLevelPosition.currentOffset = Math.max(treeLevelPosition.currentOffset, childTreeItemPosition.offset + childTreeItemPosition.actualSize.width);

			return true;
		});
	}

	function recalcItemsPositions() {
		_treeLevels.loopLevels(this, function (levelIndex, treeLevel) {
			var treeLevelPosition = _data.treeLevelsPositions[levelIndex];

			_treeLevels.loopLevelItems(this, levelIndex, function (itemid, treeItem, position) {
				var treeItemPosition = _data.treeItemsPositions[itemid];
				treeItemPosition.setPosition(treeLevelPosition, _itemsSizesOptions, _orientationOptions);
			});
		});
	}

	function getTreeLevelsPositions() {
		return _data.treeLevelsPositions;
	}

	function getItemPosition(itemid) {
		return _data.treeItemsPositions[itemid];
	}

	function getItemsPositions() {
		return _data.treeItemsPositions;
	}

	function getContentSize() {
		return _data.panelSize;
	}

	return {
		process: process,
		getTreeLevelsPositions: getTreeLevelsPositions,
		getItemsPositions: getItemsPositions,
		getItemPosition: getItemPosition,
		getContentSize: getContentSize
	};
};

/* /Controls/OrgDiagram/Tasks/Transformations/OrgTreeTask.js*/
chartDiag.orgChart.OrgTreeTask = function (itemsOptionTask) {
	var _data = {
		orgTree: null, /*tree chartDiag.orgChart.OrgItem */
		maximumId: null /* maximum of OrgItem.id */
	};

	function process() {
		createOrgTree(itemsOptionTask.getItems());

		return true;
	}

	function createOrgTree(items) {
		var orgItem,
			orgItemRoot,
			userItem,
			index, len,
			index2, len2,
			property,
			maximumId = 0,
			parsedId,
			// Organizational chart definition 
			orgTree = chartDiag.default.tree(),
			rootItemConfig;

		/* convert items to hash table */
		for (index = 0, len = items.length; index < len; index += 1) {
			userItem = items[index];
			/* user should define unique id for every ItemConfig otherwise we ignore it
				if parent does not exists in the tree then item is considered as root item
			*/
			if (userItem.id != null) {
				/* Organizational chart ItemConfig is almost the same as OrgItem 
					except options used to draw connectors in multi parent chart
				*/
				orgItem = new chartDiag.orgChart.OrgItem(userItem);

				// OrgItem id coinsides with ItemConfig id since we don't add any new org items to user's org chart definition
				parsedId = parseInt(userItem.id, 10);
				maximumId = Math.max(isNaN(parsedId) ? 0 : parsedId, maximumId);

				// Collect org items
				orgTree.add(userItem.parent, orgItem.id, orgItem);

				/* We ignore looped items, it is applications responsibility to control data consistency */
			}
		}
		/* create chart root item config */
		maximumId += 1;

		rootItemConfig = new chartDiag.orgChart.ItemConfig();
		rootItemConfig.id = maximumId;
		rootItemConfig.title = "internal root";
		rootItemConfig.isVisible = false;
		rootItemConfig.isActive = false;
		
		/* create chart org root item */
		orgItemRoot = new chartDiag.orgChart.OrgItem(rootItemConfig);
		orgItemRoot.hideParentConnection = true;
		orgItemRoot.hideChildrenConnection = true;

		orgTree.add(null, orgItemRoot.id, orgItemRoot);

		orgTree.loopLevels(this, function (nodeid, node, levelid) {
			if (levelid > 0) {
				return orgTree.BREAK;
			}
			if (orgItemRoot.id != nodeid) {
				orgTree.adopt(orgItemRoot.id, nodeid);

				/* root item must be regular */
				node.itemType = 0/*chartDiag.orgChart.ItemType.Regular*/;
			}
		});

		hideRootConnectors(orgTree);

		_data.orgTree = orgTree;
		_data.maximumId = maximumId;

		return true;
	}

	function hideRootConnectors(orgTree) {
		orgTree.loopLevels(this, function (nodeid, node, levelid) {
			var allRegular = true;
			if (!node.isVisible) {
				orgTree.loopChildren(this, nodeid, function (childid, child, index) {
					if (child.itemType != 0/*chartDiag.orgChart.ItemType.Regular*/) {
						allRegular = false;
						return true; // break
					}
				}); //ignore jslint

				if (allRegular) {
					node.hideChildrenConnection = true;

					orgTree.loopChildren(this, nodeid, function (childid, child, index) {
						child.hideParentConnection = true;
					});
				} else {
					return orgTree.SKIP; // skip children
				}
			} else {
				return orgTree.SKIP;
			}
		});
	}

	function getOrgTree() {
		return _data.orgTree;
	}

	function getMaximumId() {
		return _data.maximumId;
	}

	return {
		process: process,
		getOrgTree: getOrgTree,
		getMaximumId: getMaximumId
	};
};

/* /Controls/OrgDiagram/Tasks/Transformations/PalleteManagerTask.js*/
chartDiag.orgChart.PaletteManagerTask = function (connectorsOptionTask, linePaletteOptionTask) {
	var _paletteManager;

	function process() {
		var linesPalette = [];
		if (linePaletteOptionTask != null) {
			linesPalette = linePaletteOptionTask.getOptions().linesPalette;
		}
		_paletteManager = new chartDiag.default.PaletteManager(connectorsOptionTask.getOptions(), linesPalette);

		return true;
	}

	function getPaletteManager() {
		return _paletteManager;
	}

	return {
		process: process,
		getPaletteManager: getPaletteManager
	};
};

/* /Controls/OrgDiagram/Tasks/Transformations/TracePathAnnotationsTask.js*/
chartDiag.orgChart.TracePathAnnotationsTask = function (highlightPathAnnotationOptionTask, connectionsGraphTask, orgTreeTask, visualTreeTask, navigationFamilyTask) {
	var _data = {
		connections: {} // chartDiag.orgChart.TreeItemHighlightPath
	},
	defaultTreeItemHighlightPath = new chartDiag.orgChart.TreeItemHighlightPath();

	function process() {
		var navigationFamily = navigationFamilyTask.getNavigationFamily(),
			orgTree = orgTreeTask.getOrgTree(),
			visualTree = visualTreeTask.getVisualTree(),
			connectionsGraph = connectionsGraphTask.getGraph(),
			annotations = highlightPathAnnotationOptionTask.getAnnotations();

		_data.connections = tracePathAnnotations(annotations, connectionsGraph, orgTree, visualTree, navigationFamily);

		return true;
	}

	function tracePathAnnotations(annotations, graph, orgTree, visualTree, navigationFamily) {
		var index, len,
			index2, len2,
			index3, len3,
			firstItem, nextItem,
			treeItem,
			path,
			items,
			connection,
			annotationConfig,
			result = {};

		for (index = 0, len = annotations.length; index < len; index += 1) {
			annotationConfig = annotations[index];
			if (annotationConfig.items != null && annotationConfig.items.length > 0) {
				items = annotationConfig.items.slice(0);
				firstItem = visualTree.node(items[0]);

				if (firstItem != null) {
					/* if annotation contains one single item we connect it to its logical parents*/
					if (items.length == 1) {
						navigationFamily.loopParents(this, firstItem.id, function (nextItemId, nextItem, level) {
							var orgItem = orgTree.node(nextItemId);
							if (orgItem.isActive) {
								items.push(nextItemId);
							}
							return navigationFamily.SKIP;
						});//ignore jslint
					}

					if (items.length > 1) {
						for (index2 = 1, len2 = items.length; index2 < len2; index2 += 1) {
							nextItem = visualTree.node(items[index2]);

							if (nextItem != null) {
								path = graph.getShortestPath(firstItem.id, nextItem.id, function (edge, fromItem, toItem) {
									return edge.getNear(toItem);
								});//ignore jslint

								for (index3 = 1, len3 = path.length; index3 < len3; index3 += 1) {
									connection = graph.edge([path[index3 - 1]], [path[index3]]);

									treeItem = createTreeItemHighlightPath(result, connection.highlightItemId);
									treeItem.highlightPath = 1;

									if (connection.hasOwnProperty("partnerid")) {
										treeItem = createTreeItemHighlightPath(result, connection.partnerid);
										treeItem.partnerHighlightPath = 1;
									}
								}

								firstItem = nextItem;
							}
						}
					}
				}
			}
		}
		return result;
	}

	function createTreeItemHighlightPath(connections, itemid) {
		var result = connections[itemid];
		if (result == null) {
			result = new chartDiag.orgChart.TreeItemHighlightPath();
			connections[itemid] = result;
		}
		return result;
	}

	function getHighlightPath(itemid) {
		return _data.connections[itemid] || defaultTreeItemHighlightPath;
	}

	return {
		process: process,
		getHighlightPath: getHighlightPath
	};
};

/* /Controls/OrgDiagram/Tasks/Transformations/VisualTreeLevelsTask.js*/
/* Read visual tree
		populate treeLevels array of type TreeLevel
			TreeLevel object contains ordered list of all its items 
			plus when items added to that collection we store level & levelPosition in item
*/
chartDiag.orgChart.VisualTreeLevelsTask = function (visualTreeTask, itemTemplateParamsTask) {
	var _data = {
		treeLevels: null, /* chartDiag.default.TreeLevels */
		activeTreeLevels: null /* chartDiag.default.TreeLevels */
	};

	function process() {
		var visualTree = visualTreeTask.getVisualTree();

		_data.treeLevels = chartDiag.default.TreeLevels();
		_data.activeTreeLevels = chartDiag.default.TreeLevels();

		visualTree.loopLevels(this, function (treeItemId, treeItem, levelIndex) {
			var templateParams = itemTemplateParamsTask.getTemplateParams(treeItemId);

			_data.treeLevels.addItem(levelIndex, treeItemId, treeItem);
			if (templateParams != null && templateParams.isActive && treeItem.visibility != 4/*chartDiag.default.Visibility.Invisible*/) {
				_data.activeTreeLevels.addItem(levelIndex, treeItemId, treeItem);
			}
		});

		return true;
	}

	function getTreeLevels() {
		return _data.treeLevels;
	}

	function getActiveTreeLevels() {
		return _data.activeTreeLevels;
	}

	return {
		process: process,
		getTreeLevels: getTreeLevels,
		getActiveTreeLevels: getActiveTreeLevels
	};
};

/* /Controls/OrgDiagram/Tasks/Transformations/VisualTreeMarginsTask.js*/
/* Read visual tree and create leftMargins & rightMargins collections 
   for every tree item in visual hierarchy they are used to for horizontal alignment of visual tree items
*/
chartDiag.orgChart.VisualTreeMarginsTask = function (visualTreeTask) {
	var _data = {
		leftMargins: {},
		rightMargins: {}
	};

	function process() {
		_data.leftMargins = {},
		_data.rightMargins = {};

		updateVisualTreeMargins(visualTreeTask.getVisualTree(), _data.leftMargins, _data.rightMargins);

		return true;
	}

	function updateVisualTreeMargins(visualTree, leftMargins, rightMargins) {
		visualTree.loop(this, function (nodeid, node) {
			leftMargins[nodeid] = [];
			rightMargins[nodeid] = [];
		});

		visualTree.loopPostOrder(this, function (nodeid, node, parentid, parent) {
			var parentLeftMargins = leftMargins[parentid],
				parentRightMargins = rightMargins[parentid],
				nodeLeftMargins = leftMargins[nodeid],
				nodeRightMargins = rightMargins[nodeid],
				index, len;

			if (parentid != null) {
				/* update parent left margins */
				if (!parentLeftMargins[0]) {
					parentLeftMargins[0] = nodeid;
				}

				for (index = 0, len = nodeLeftMargins.length; index < len; index += 1) {
					if (!parentLeftMargins[index + 1]) {
						parentLeftMargins[index + 1] = nodeLeftMargins[index];
					}
				}

				/* update parent rights margins */
				parentRightMargins[0] = nodeid;

				for (index = 0, len = nodeRightMargins.length; index < len; index += 1) {
					parentRightMargins[index + 1] = nodeRightMargins[index];
				}
			}
		});
	}

	function getLeftMargins() {
		return _data.leftMargins;
	}

	function getRightMargins() {
		return _data.rightMargins;
	}

	return {
		process: process,
		getLeftMargins: getLeftMargins,
		getRightMargins: getRightMargins
	};
};

/* /Controls/OrgDiagram/Tasks/Transformations/VisualTreeTask.js*/
/* method uses structures created in orgTreeTask to create visual tree used to render chart
	It populates visualTree structure with TreeItem objects.
	
	1. Create invisble visual root item, so all orphants added to it, but since it is invisible, no connections are going to be drawn betwen them
	2. Loop orgTree nodes and populate visual tree hierarchy: visualTree
*/
chartDiag.orgChart.VisualTreeTask = function (orgTreeTask, itemTemplateParamsTask, visualTreeOptionTask, isFamilyChartMode) {
	var _data = {
		visualTree: null, /* chartDiag.default.tree(); key: chartDiag.orgChart.TreeItem.id value:chartDiag.orgChart.TreeItem */
		navigationFamily: null /* family structure where key: TreeItem.id and value: TreeItem */
	},
	_treeItemCounter;

	function process() {
		var orgTree = orgTreeTask.getOrgTree(),
			options = visualTreeOptionTask.getOptions();

		_data.visualTree = chartDiag.default.tree();
		_data.navigationFamily =  chartDiag.default.family();

		_treeItemCounter = orgTreeTask.getMaximumId();

		if (orgTree.hasNodes()) {
			createVisualTreeItems(orgTree, options, _data.visualTree);
		}

		return true;
	}

	function createVisualTreeItems(orgTree, options, visualTree) {
		var treeItem,
			visualParent,
			visualAggregator,
			leftSiblingIndex,
			rightSiblingIndex,
			index, len,
			childIndex,
			childrenLen,
			depth,
			rowDepths,
			rowDepth,
			rowAggregators = {},
			rowAggregator,
			rowChildren = {},
			children,
			leftSiblingOffset,
			rightSiblingOffset,
			partners = {}, tempPartners;


		/* org tree item has visible children */
		orgTree.loopPostOrder(this, function (nodeid, node, parentid, parent) {
			node.hasVisibleChildren = node.isVisible || node.hasVisibleChildren;
			if (parent != null) {
				parent.hasVisibleChildren = parent.hasVisibleChildren || node.hasVisibleChildren;
			}
		});

		orgTree.loopLevels(this, function (parentOrgItemId, parentOrgItem, levelid) {
			var logicalParentItem,
				regularChildren,
				shiftParent;
			if (!isFamilyChartMode && !parentOrgItem.hasVisibleChildren) {
				return orgTree.SKIP;
			}

			logicalParentItem = visualTree.node(parentOrgItemId);
			if (!logicalParentItem) {
				logicalParentItem = getNewTreeItem({
					visibility: 4/*chartDiag.default.Visibility.Invisible*/,
					connectorPlacement: 0,
					parentId: null,
					actualItemType: 0/*chartDiag.orgChart.ItemType.Regular*/
				}, parentOrgItem);
				visualTree.add(null, parentOrgItemId, logicalParentItem);
			}

			/* find left and right siblings margins of logical parent item
				they are needed to properly place GeneralPartner & LimitedPartner nodes. */
			leftSiblingOffset = 0;
			rightSiblingOffset = 0;
			if ((index = visualTree.indexOf(parentOrgItemId)) != null) {
				leftSiblingOffset = index;
				rightSiblingOffset = visualTree.countSiblings(parentOrgItemId) - index - 1;
			}

			/* populate children */
			regularChildren = []; /* children added after all other custom item types */
			orgTree.loopChildren(this, parentOrgItemId, function (orgItemId, orgItem, index) {
				if (isFamilyChartMode || orgItem.hasVisibleChildren) {
					treeItem = getNewTreeItem({
						parentId: parentOrgItemId,
						actualItemType: orgItem.itemType
					}, orgItem);

					switch (logicalParentItem.actualItemType) {
						case 7/*chartDiag.orgChart.ItemType.LimitedPartner*/:
						case 8/*chartDiag.orgChart.ItemType.AdviserPartner*/:
						case 6/*chartDiag.orgChart.ItemType.GeneralPartner*/:
							switch (treeItem.actualItemType) {
								case 7/*chartDiag.orgChart.ItemType.LimitedPartner*/:
								case 8/*chartDiag.orgChart.ItemType.AdviserPartner*/:
								case 6/*chartDiag.orgChart.ItemType.GeneralPartner*/:
									/* Don't support partner of partner */
									treeItem.actualItemType = 2/*chartDiag.orgChart.ItemType.Adviser*/;
									break;
								case 0/*chartDiag.orgChart.ItemType.Regular*/:
									/* Don't support regular children of partner */
									treeItem.actualItemType = 1/*chartDiag.orgChart.ItemType.Assistant*/;
									break;
							}
							break;
					}

					switch (treeItem.actualItemType) {
						case 5/*chartDiag.orgChart.ItemType.SubAdviser*/:
							defineNavigationParent(logicalParentItem, treeItem);
							treeItem.connectorPlacement = 1/*chartDiag.default.SideFlag.Top*/ | 4/*chartDiag.default.SideFlag.Bottom*/;
							shiftParent = getNewTreeItem({ visibility: 4/*chartDiag.default.Visibility.Invisible*/ });
							visualTree.add(shiftParent.id, treeItem.id, treeItem);
							treeItem = shiftParent;//ignore jslint
						case 8/*chartDiag.orgChart.ItemType.AdviserPartner*/://ignore jslint
						case 2/*chartDiag.orgChart.ItemType.Adviser*/://ignore jslint
							visualParent = visualTree.parent(parentOrgItemId);
							if (logicalParentItem.connectorPlacement & 2/*chartDiag.default.SideFlag.Right*/) {
								leftSiblingIndex = findLeftSiblingIndex(visualTree, _data.navigationFamily, logicalParentItem);
								visualTree.add(visualParent.id, treeItem.id, treeItem, leftSiblingIndex + 1);
								treeItem.connectorPlacement = 2/*chartDiag.default.SideFlag.Right*/ | 4/*chartDiag.default.SideFlag.Bottom*/;
								treeItem.gravity = 2/*chartDiag.default.HorizontalAlignmentType.Right*/;
							} else if (logicalParentItem.connectorPlacement & 8/*chartDiag.default.SideFlag.Left*/) {
								rightSiblingIndex = findRightSiblingIndex(visualTree, _data.navigationFamily, logicalParentItem);
								visualTree.add(visualParent.id, treeItem.id, treeItem, rightSiblingIndex);
								treeItem.connectorPlacement = 8/*chartDiag.default.SideFlag.Left*/ | 4/*chartDiag.default.SideFlag.Bottom*/;
								treeItem.gravity = 1/*chartDiag.default.HorizontalAlignmentType.Left*/;
							} else {
								switch (orgItem.adviserPlacementType) {
									case 2/*chartDiag.default.AdviserPlacementType.Left*/:
										leftSiblingIndex = findLeftSiblingIndex(visualTree, _data.navigationFamily, logicalParentItem);
										visualTree.add(visualParent.id, treeItem.id, treeItem, leftSiblingIndex + 1);
										treeItem.connectorPlacement = 2/*chartDiag.default.SideFlag.Right*/ | 4/*chartDiag.default.SideFlag.Bottom*/;
										treeItem.gravity = 2/*chartDiag.default.HorizontalAlignmentType.Right*/;
										break;
									default:
										rightSiblingIndex = findRightSiblingIndex(visualTree, _data.navigationFamily, logicalParentItem);
										visualTree.add(visualParent.id, treeItem.id, treeItem, rightSiblingIndex);
										treeItem.connectorPlacement = 8/*chartDiag.default.SideFlag.Left*/ | 4/*chartDiag.default.SideFlag.Bottom*/;
										treeItem.gravity = 1/*chartDiag.default.HorizontalAlignmentType.Left*/;
										break;
								}
							}

							switch (treeItem.actualItemType) {
								case 5/*chartDiag.orgChart.ItemType.SubAdviser*/:
									break;
								case 8/*chartDiag.orgChart.ItemType.AdviserPartner*/:
									if (logicalParentItem.parentId != null) {
										defineNavigationParent(visualTree.node(logicalParentItem.parentId), treeItem);
									} else {
										defineNavigationParent(logicalParentItem, treeItem, true);
									}
									break;
								case 2/*chartDiag.orgChart.ItemType.Adviser*/:
									defineNavigationParent(logicalParentItem, treeItem);
									break;
							}
							break;
						case 4/*chartDiag.orgChart.ItemType.SubAssistant*/:
							defineNavigationParent(logicalParentItem, treeItem);
							treeItem.connectorPlacement = 1/*chartDiag.default.SideFlag.Top*/ | 4/*chartDiag.default.SideFlag.Bottom*/;
							shiftParent = getNewTreeItem({ visibility: 4/*chartDiag.default.Visibility.Invisible*/ });
							visualTree.add(shiftParent.id, treeItem.id, treeItem);
							treeItem = shiftParent;//ignore jslint
						case 1/*chartDiag.orgChart.ItemType.Assistant*/://ignore jslint
							if (logicalParentItem.visualAggregatorId === null) {
								createNewVisualAggregator(visualTree, logicalParentItem, false);
							}
							switch (orgItem.adviserPlacementType) {
								case 2/*chartDiag.default.AdviserPlacementType.Left*/:
									visualTree.add(parentOrgItemId, treeItem.id, treeItem, 0);
									treeItem.connectorPlacement = 2/*chartDiag.default.SideFlag.Right*/ | 4/*chartDiag.default.SideFlag.Bottom*/;
									treeItem.gravity = 2/*chartDiag.default.HorizontalAlignmentType.Right*/;
									break;
								default:
									visualTree.add(parentOrgItemId, treeItem.id, treeItem);
									treeItem.connectorPlacement = 8/*chartDiag.default.SideFlag.Left*/ | 4/*chartDiag.default.SideFlag.Bottom*/;
									treeItem.gravity = 1/*chartDiag.default.HorizontalAlignmentType.Left*/;
									break;
							}
							if (treeItem.actualItemType == 1/*chartDiag.orgChart.ItemType.Assistant*/) {
								defineNavigationParent(logicalParentItem, treeItem);
							}
							break;
						case 0/*chartDiag.orgChart.ItemType.Regular*/:
							regularChildren.push(treeItem);
							defineNavigationParent(logicalParentItem, treeItem);
							break;
						case 7/*chartDiag.orgChart.ItemType.LimitedPartner*/:
						case 6/*chartDiag.orgChart.ItemType.GeneralPartner*/:
							visualParent = visualTree.parent(parentOrgItemId);
							if (logicalParentItem.connectorPlacement & 2/*chartDiag.default.SideFlag.Right*/) {
								visualTree.add(visualParent.id, treeItem.id, treeItem, leftSiblingOffset);
								treeItem.connectorPlacement = 2/*chartDiag.default.SideFlag.Right*/ | 4/*chartDiag.default.SideFlag.Bottom*/;
								treeItem.gravity = 2/*chartDiag.default.HorizontalAlignmentType.Right*/;
							} else if (logicalParentItem.connectorPlacement & 8/*chartDiag.default.SideFlag.Left*/) {
								visualTree.add(visualParent.id, treeItem.id, treeItem, visualTree.countChildren(visualParent.id) - rightSiblingOffset);
								treeItem.connectorPlacement = 8/*chartDiag.default.SideFlag.Left*/ | 4/*chartDiag.default.SideFlag.Bottom*/;
								treeItem.gravity = 1/*chartDiag.default.HorizontalAlignmentType.Left*/;
							} else {
								switch (orgItem.adviserPlacementType) {
									case 2/*chartDiag.default.AdviserPlacementType.Left*/:
										visualTree.add(visualParent.id, treeItem.id, treeItem, leftSiblingOffset);
										treeItem.gravity = 2/*chartDiag.default.HorizontalAlignmentType.Right*/;
										break;
									default:
										visualTree.add(visualParent.id, treeItem.id, treeItem, visualTree.countChildren(visualParent.id) - rightSiblingOffset);
										treeItem.gravity = 1/*chartDiag.default.HorizontalAlignmentType.Left*/;
										break;
								}
								switch (treeItem.actualItemType) {
									case 6/*chartDiag.orgChart.ItemType.GeneralPartner*/:
										treeItem.connectorPlacement = 1/*chartDiag.default.SideFlag.Top*/ | 4/*chartDiag.default.SideFlag.Bottom*/;
										break;
									case 7/*chartDiag.orgChart.ItemType.LimitedPartner*/:
										treeItem.connectorPlacement = 4/*chartDiag.default.SideFlag.Bottom*/;
										break;
								}
							}
							if (logicalParentItem.parentId != null) {
								defineNavigationParent(visualTree.node(logicalParentItem.parentId), treeItem);
							} else {
								defineNavigationParent(logicalParentItem, treeItem, true);
							}
							break;
					}
				}
			});

			/* collect partners, add logicalParentItem into partners collection */
			switch (logicalParentItem.actualItemType) {
				case 7/*chartDiag.orgChart.ItemType.LimitedPartner*/:
				case 8/*chartDiag.orgChart.ItemType.AdviserPartner*/:
				case 6/*chartDiag.orgChart.ItemType.GeneralPartner*/:
					break;
				default:
					tempPartners = [];
					if ((visualParent = visualTree.parent(parentOrgItemId)) != null) {
						visualTree.loopChildrenRange(this, visualParent.id, leftSiblingOffset, visualTree.countChildren(visualParent.id) - rightSiblingOffset, function (childItemId, childItem, index) {
							if (childItem.id == parentOrgItemId) {
								tempPartners.push(childItem);
							} else {
								switch (childItem.actualItemType) {
									case 7/*chartDiag.orgChart.ItemType.LimitedPartner*/:
									case 8/*chartDiag.orgChart.ItemType.AdviserPartner*/:
									case 6/*chartDiag.orgChart.ItemType.GeneralPartner*/:
										if (orgTree.parentid(childItem.id) == parentOrgItemId) {
											tempPartners.push(childItem);
										}
										break;
								}
							}
						});
					}
					if (tempPartners.length > 1) {
						partners[parentOrgItemId] = tempPartners;
					}
					break;
			}

			/* add children */
			rowAggregators[parentOrgItemId] = [];
			rowChildren[parentOrgItemId] = [];
			layoutChildren(orgTree, visualTree, options, logicalParentItem, regularChildren, parentOrgItem.childrenPlacementType, rowAggregators[parentOrgItemId], rowChildren[parentOrgItemId]);
		});

		/* transform tree to place children sub branches inside of hierarchy */
		orgTree.loopPostOrder(this, function (nodeid, node, parentid, parent) {
			var logicalParentItem = visualTree.node(nodeid),
				itemRowChildren,
				itemRowAggregators,
				hasChildren;
			if (logicalParentItem != null) {
				itemRowChildren = rowChildren[nodeid];
				itemRowAggregators = rowAggregators[nodeid];

				/* Move assistants children inside */
				depth = getAssitantsDepth(visualTree, logicalParentItem);
				if (depth > 0) {
					logicalParentItem.visualDepth = depth + 1;
					if (logicalParentItem.visualAggregatorId !== null) {
						visualAggregator = visualTree.node(logicalParentItem.visualAggregatorId);
						hasChildren = visualTree.hasChildren(visualAggregator.id);
						for (index = 0; index < depth - 1; index += 1) {
							visualAggregator = createNewVisualAggregator(visualTree, visualAggregator, !hasChildren);
						}
					}
				}

				/* Move advisers children inside */
				depth = getAdvisersDepth(visualTree, logicalParentItem);
				if (depth > 1) {
					logicalParentItem.visualDepth += (depth - 1);
					hasChildren = visualTree.hasChildren(nodeid);
					visualAggregator = logicalParentItem;
					for (index = 0; index < depth - 1; index += 1) {
						visualAggregator = createNewVisualAggregator(visualTree, visualAggregator, !hasChildren);
					}
				}

				/* Move children of children inside */
				rowDepths = [];
				for (index = 0, len = itemRowChildren.length; index < len; index += 1) {
					children = itemRowChildren[index];
					rowDepths[index] = 0;
					for (childIndex = 0, childrenLen = children.length; childIndex < childrenLen; childIndex += 1) {
						rowDepths[index] = Math.max(rowDepths[index], getItemDepth(visualTree, children[childIndex]));
					}
				}

				for (index = 0, len = rowDepths.length; index < len; index += 1) {
					rowDepth = rowDepths[index];
					if (rowDepth > 1) {
						for (childIndex = 0, childrenLen = itemRowAggregators[index].length; childIndex < childrenLen; childIndex += 1) {
							rowAggregator = itemRowAggregators[index][childIndex];
							if (visualTree.hasChildren(rowAggregator.id)) {
								depth = rowDepth;
								while (depth > 1) {
									rowAggregator = createNewVisualAggregator(visualTree, rowAggregator, false);
									depth -= 1;
								}
							}
						}
					}
				}

				/* Align heights of partner branches in order to draw connector lines between them and logical parent children */
				if (partners[nodeid] != null) {
					/* partners collection includes treeItem so we should have at least 2 items */
					layoutPartners(visualTree, logicalParentItem, partners[nodeid]);
				}
			}
		});
	}

	function layoutPartners(visualTree, treeItem, partners) {
		var partner,
			index, len,
			depth,
			maxDepth = 0,
			visualPartners = [],
			visualPartner,
			visualParent,
			visualAggregator,
			leftSiblingIndex,
			gravity;

		/* Find maximum depth required to enclose partners branches */
		for (index = 0, len = partners.length; index < len; index += 1) {
			partner = partners[index];
			maxDepth = Math.max(maxDepth, partner.visualDepth);
		}

		/* Extend visual aggregators lines and ensure that connector lines are visible */
		for (index = 0, len = partners.length; index < len; index += 1) {
			partner = partners[index];
			visualPartner = getLastVisualAggregator(visualTree, partner);
			depth = 1;
			visualAggregator = partner;
			while (visualAggregator.visualAggregatorId != null) {
				visualAggregator = visualTree.node(visualAggregator.visualAggregatorId);
				visualAggregator.connectorPlacement = 1/*chartDiag.default.SideFlag.Top*/ | 4/*chartDiag.default.SideFlag.Bottom*/;
				depth += 1;
			}
			while (depth < maxDepth) {
				visualPartner = createNewVisualAggregator(visualTree, visualPartner, false);
				depth += 1;
			}
			visualPartners.push(getLastVisualAggregator(visualTree, visualPartner).id);
		}


		visualAggregator = getLastVisualAggregator(visualTree, treeItem);
		if (visualTree.hasChildren(visualAggregator.id)) {
			/* Select middle partner */
			visualPartner = partners[Math.floor(partners.length / 2)];
			if (partners.length > 1 && partners.length % 2 === 0) {
				/* insert invisble partner for alignemnt */
				visualParent = visualTree.parent(visualPartner.id);
				leftSiblingIndex = findLeftSiblingIndex(visualTree, _data.navigationFamily, visualPartner);

				gravity = visualTree.getChild(visualParent.id, leftSiblingIndex).gravity ||
					visualTree.getChild(visualParent.id, leftSiblingIndex + 1).gravity;

				// visualParent.id,
				visualPartner = getNewTreeItem({
					visibility: 4/*chartDiag.default.Visibility.Invisible*/,
					connectorPlacement: visualPartner.connectorPlacement & (8/*chartDiag.default.SideFlag.Left*/ | 2/*chartDiag.default.SideFlag.Right*/),
					gravity: gravity
				});

				visualTree.add(visualParent.id, visualPartner.id, visualPartner, leftSiblingIndex + 1);

				depth = 1;
				while (depth < maxDepth) {
					visualPartner = createNewVisualAggregator(visualTree, visualPartner, false);
					visualPartner.connectorPlacement = 0;
					depth += 1;
				}
			}

			/* every child logically belongs to every partner */
			for (index = 0, len = partners.length; index < len; index += 1) {
				partner = partners[index];
				/* select all parents up to the root */
				_data.navigationFamily.loopChildren(this, treeItem.id, function (childItemId, childItem, level) {
					switch (childItem.actualItemType) {
						case 5/*chartDiag.orgChart.ItemType.SubAdviser*/:
						case 2/*chartDiag.orgChart.ItemType.Adviser*/:
						case 4/*chartDiag.orgChart.ItemType.SubAssistant*/:
						case 1/*chartDiag.orgChart.ItemType.Assistant*/:
							break;
						default:
							/* partners share only regular items */
							if (treeItem.id != partner.id) {
								defineNavigationParent(partner, childItem);
							}
							break;
					}
					return _data.navigationFamily.SKIP;
				}); //ignore jslint
			}

			/* Move children to new visual partner node */
			visualPartner = getLastVisualAggregator(visualTree, visualPartner);
			visualTree.moveChildren(visualAggregator.id, visualPartner.id);
		}

		/* Store collection of visual partners to draw connector lines*/
		visualPartner.partners = visualPartners;
	}

	function getLastVisualAggregator(visualTree, treeItem) {
		var result = treeItem;

		while (result.visualAggregatorId != null) {
			result = visualTree.node(result.visualAggregatorId);
		}
		return result;
	}

	function getAdvisersDepth(visualTree, treeItem) {
		var result = 0,
			parentItem = visualTree.parent(treeItem.id),
			treeItemIndex,
			position,
			childItem;
		if (parentItem !== null) {
			treeItemIndex = visualTree.indexOf(treeItem.id);

			position = 1;
			while ((childItem = visualTree.getChild(parentItem.id, treeItemIndex + position)) != null) {
				if (childItem.connectorPlacement & 8/*chartDiag.default.SideFlag.Left*/) {
					result = Math.max(result, getItemDepth(visualTree, childItem));
					position += 1;
				}
				else {
					break;
				}
			}
			position = 1;
			while ((childItem = visualTree.getChild(parentItem.id, treeItemIndex - position)) != null) {
				if (childItem.connectorPlacement & 2/*chartDiag.default.SideFlag.Right*/) {
					result = Math.max(result, getItemDepth(visualTree, childItem));
					position += 1;
				}
				else {
					break;
				}
			}
		}
		return result;
	}

	function getAssitantsDepth(visualTree, treeItem) {
		var result = 0;
		if (treeItem.visualAggregatorId != null) {
			visualTree.loopLevels(this, treeItem.id, function (childItemId, childItem, level) {
				if (treeItem.visualAggregatorId == childItemId) {
					return visualTree.SKIP;
				}
				result = level + 1;
			});
		}
		return result;
	}

	function getItemDepth(visualTree, treeItem) {
		var result = 0;
		visualTree.loopLevels(this, treeItem.id, function (childid, child, level) {
			result = level + 1;
		});
		return result + 1;
	}

	function layoutChildren(orgTree, visualTree, options, treeItem, regularChildren, childrenPlacementType, rowAggregators, rowChildren) {
		var visualParent,
			currentVisualParent,
			leftChildItem,
			rightChildItem,
			newAggregatorItem,
			childItem, orgChildItem,
			width,
			height,
			twinColumns,
			column,
			row,
			index, len,
			singleItemPlacement,
			hideParentConnector = (treeItem.visibility == 4/*chartDiag.default.Visibility.Invisible*/) && (treeItem.connectorPlacement === 0);

		switch (options.horizontalAlignment) {
			case 0/*chartDiag.default.HorizontalAlignmentType.Center*/:
			case 1/*chartDiag.default.HorizontalAlignmentType.Left*/:
				singleItemPlacement = 3/*chartDiag.default.AdviserPlacementType.Right*/;
				break;
			case 2/*chartDiag.default.HorizontalAlignmentType.Right*/:
				singleItemPlacement = 2/*chartDiag.default.AdviserPlacementType.Left*/;
				break;
		}

		if (childrenPlacementType === 0/*chartDiag.default.ChildrenPlacementType.Auto*/) {
			if (hasRegularLeavesOnly(orgTree, treeItem)) {
				childrenPlacementType = (options.leavesPlacementType === 0/*chartDiag.default.ChildrenPlacementType.Auto*/) ?
					3/*chartDiag.default.ChildrenPlacementType.Matrix*/ : options.leavesPlacementType;
			}
			else {
				childrenPlacementType = (options.childrenPlacementType === 0/*chartDiag.default.ChildrenPlacementType.Auto*/) ?
					2/*chartDiag.default.ChildrenPlacementType.Horizontal*/ : options.childrenPlacementType;
			}
		}

		visualParent = treeItem;
		/* if node has assitants then it has visual aggregator child node */
		if (treeItem.visualAggregatorId !== null) {
			visualParent = visualTree.node(treeItem.visualAggregatorId);
		}

		if (childrenPlacementType == 3/*chartDiag.default.ChildrenPlacementType.Matrix*/ && regularChildren.length < 3) {
			childrenPlacementType = 2/*chartDiag.default.ChildrenPlacementType.Horizontal*/;
		}

		switch (childrenPlacementType) {
			case 2/*chartDiag.default.ChildrenPlacementType.Horizontal*/:
				for (index = 0, len = regularChildren.length; index < len; index += 1) {
					childItem = regularChildren[index];
					orgChildItem = orgTree.node(childItem.id);
					visualTree.add(visualParent.id, childItem.id, childItem);
					childItem.connectorPlacement = (orgChildItem.hideParentConnection ? 0 : 1/*chartDiag.default.SideFlag.Top*/) | (orgChildItem.hideChildrenConnection ? 0 : 4/*chartDiag.default.SideFlag.Bottom*/);

					if (index === 0) {
						childItem.relationDegree = 1;
					}
				}
				break;
			case 3/*chartDiag.default.ChildrenPlacementType.Matrix*/:
				width = Math.min(options.maximumColumnsInMatrix, Math.ceil(Math.sqrt(regularChildren.length)));
				height = Math.ceil(regularChildren.length / width);
				twinColumns = Math.ceil(width / 2.0);
				for (column = 0; column < twinColumns; column += 1) {
					currentVisualParent = visualParent;
					for (row = 0; row < height; row += 1) {
						leftChildItem = getMatrixItem(regularChildren, column * 2, row, width);
						rightChildItem = getMatrixItem(regularChildren, column * 2 + 1, row, width);
						if (rowAggregators[row] === undefined) {
							rowAggregators[row] = [];
							rowChildren[row] = [];
						}
						if (leftChildItem !== null) {
							if (column === 0) {
								leftChildItem.relationDegree = 1;
							}
							visualTree.add(currentVisualParent.id, leftChildItem.id, leftChildItem);
							leftChildItem.connectorPlacement = (hideParentConnector ? 0 : 2/*chartDiag.default.SideFlag.Right*/) | 4/*chartDiag.default.SideFlag.Bottom*/;
							leftChildItem.gravity = 2/*chartDiag.default.HorizontalAlignmentType.Right*/;

							rowChildren[row].push(leftChildItem);
						}
						if (leftChildItem !== null || rightChildItem !== null) {
							// currentVisualParent.id,
							newAggregatorItem = getNewTreeItem({
								visibility: 4/*chartDiag.default.Visibility.Invisible*/,
								connectorPlacement: hideParentConnector ? 0 : 1/*chartDiag.default.SideFlag.Top*/ | 4/*chartDiag.default.SideFlag.Bottom*/
							});
							visualTree.add(currentVisualParent.id, newAggregatorItem.id, newAggregatorItem);
							rowAggregators[row].push(newAggregatorItem);
						}
						if (rightChildItem !== null) {
							visualTree.add(currentVisualParent.id, rightChildItem.id, rightChildItem);
							rightChildItem.connectorPlacement = (hideParentConnector ? 0 : 8/*chartDiag.default.SideFlag.Left*/) | 4/*chartDiag.default.SideFlag.Bottom*/;
							rightChildItem.gravity = 1/*chartDiag.default.HorizontalAlignmentType.Left*/;

							rowChildren[row].push(rightChildItem);
						}

						currentVisualParent = newAggregatorItem;
					}
				}
				if (width > 2) {
					// No center alignment to aggregator required
					visualParent.visualAggregatorId = null;
				}
				break;
			case 1/*chartDiag.default.ChildrenPlacementType.Vertical*/:
				for (index = 0, len = regularChildren.length; index < len; index += 1) {
					childItem = regularChildren[index];

					// visualParent.id,
					newAggregatorItem = getNewTreeItem({
						visibility: 4/*chartDiag.default.Visibility.Invisible*/,
						connectorPlacement: hideParentConnector ? 0 : 1/*chartDiag.default.SideFlag.Top*/ | 4/*chartDiag.default.SideFlag.Bottom*/
					});


					switch (singleItemPlacement) {
						case 2/*chartDiag.default.AdviserPlacementType.Left*/:
							visualTree.add(visualParent.id, childItem.id, childItem);
							visualTree.add(visualParent.id, newAggregatorItem.id, newAggregatorItem);
							childItem.connectorPlacement = (hideParentConnector ? 0 : 2/*chartDiag.default.SideFlag.Right*/) | 4/*chartDiag.default.SideFlag.Bottom*/;
							childItem.gravity = 2/*chartDiag.default.HorizontalAlignmentType.Right*/;
							break;
						case 3/*chartDiag.default.AdviserPlacementType.Right*/:
							visualTree.add(visualParent.id, newAggregatorItem.id, newAggregatorItem);
							visualTree.add(visualParent.id, childItem.id, childItem);
							childItem.connectorPlacement = (hideParentConnector ? 0 : 8/*chartDiag.default.SideFlag.Left*/) | 4/*chartDiag.default.SideFlag.Bottom*/;
							childItem.gravity = 1/*chartDiag.default.HorizontalAlignmentType.Left*/;
							break;
					}

					rowAggregators[index] = [newAggregatorItem];
					rowChildren[index] = [childItem];

					visualParent = newAggregatorItem;
				}
				break;
			default:
				throw "Children placement is undefined!";
		}
	}

	function getMatrixItem(items, x, y, width) {
		var result,
			isOdd = (width % 2 > 0),
			index;

		if (isOdd) {
			if (x === width - 1) {
				x = items.length;
			}
			else if (x === width) {
				x = width - 1;
			}
		}
		index = y * width + x;

		result = (index > items.length - 1) ? null : items[index];

		return result;
	}

	function hasRegularLeavesOnly(orgTree, treeItem) {
		var hasChildren = false,
			hasLeavesOnly = true;

		orgTree.loopChildren(this, treeItem.id, function (nodeid, node, index) {
			hasChildren = true;
			if (node.itemType === 0/*chartDiag.orgChart.ItemType.Regular*/ &&
				orgTree.hasChildren(nodeid)) {
				hasLeavesOnly = false;
				return true; // break
			}
		});
		return hasChildren && hasLeavesOnly;
	}

	/* Sibling is the first item which does not belongs to items logical hierarchy */
	function findLeftSiblingIndex(visualTree, navigationFamily, treeItem) {
		var result = null,
			ignore = {},
			visualParent = visualTree.parent(treeItem.id);

		visualTree.loopChildrenReversed(this, visualParent.id, function (childItemId, childItem, index) {
			if (result === null) {
				if (childItemId == treeItem.id) {
					result = -1;
					ignore[treeItem.id] = true;
					navigationFamily.loopChildren(this, treeItem.id, function (childid, child, level) {
						if (level > 0) {
							return navigationFamily.BREAK;
						}
						ignore[childid] = true;
					});
				}
			}
			else {
				if (!ignore.hasOwnProperty(childItemId)) {
					result = index;
					return true; //ignore jslint
				} else {
					navigationFamily.loopChildren(this, childItem.id, function (childid, child, level) {
						if (level > 0) {
							return navigationFamily.BREAK;
						}
						ignore[childid] = true;
					});
				}
			}
		});

		return result;
	}

	/* Sibling is the first item which does not belongs to items logical hierarchy */
	function findRightSiblingIndex(visualTree, navigationFamily, treeItem) {
		var result = null,
			ignore = {},
			visualParent = visualTree.parent(treeItem.id);

		visualTree.loopChildren(this, visualParent.id, function (childItemId, childItem, index, lastIndex) {
			if (result === null) {
				if (childItemId == treeItem.id) {
					result = lastIndex + 1;
					ignore[treeItem.id] = true;
					navigationFamily.loopChildren(this, treeItem.id, function (childid, child, level) {
						if (level > 0) {
							return navigationFamily.BREAK;
						}
						ignore[childid] = true;
					});
				}
			}
			else {
				if (!ignore.hasOwnProperty(childItemId)) {
					result = index;
					return true; //ignore jslint
				} else {
					navigationFamily.loopChildren(this, childItemId, function (childid, child, level) {
						if (level > 0) {
							return navigationFamily.BREAK;
						}
						ignore[childid] = true;
					});
				}
			}
		});
		return result;
	}

	function createNewVisualAggregator(visualTree, treeItem, hideChildrenConnector) {
		var newAggregatorItem,
			hideParentConnector = ((treeItem.visibility == 4/*chartDiag.default.Visibility.Invisible*/) && (treeItem.connectorPlacement === 0)) || hideChildrenConnector;

		newAggregatorItem = getNewTreeItem({
			visibility: 4/*chartDiag.default.Visibility.Invisible*/,
			visualAggregatorId: treeItem.visualAggregatorId,
			connectorPlacement: hideParentConnector ? 0 : (1/*chartDiag.default.SideFlag.Top*/ | 4/*chartDiag.default.SideFlag.Bottom*/)
		});

		visualTree.insert(treeItem.id, newAggregatorItem.id, newAggregatorItem);

		treeItem.visualAggregatorId = newAggregatorItem.id;
		return newAggregatorItem;
	}

	function getNewTreeItem(properties, orgItem) {
		var result = new chartDiag.orgChart.TreeItem(),
			optionKey;

		for (optionKey in properties) {
			if (properties.hasOwnProperty(optionKey)) {
				result[optionKey] = properties[optionKey];
			}
		}

		if (orgItem != null) {
			result.id = orgItem.id;
			result.visibility = orgItem.isVisible ? 0/*chartDiag.default.Visibility.Auto*/ : 4/*chartDiag.default.Visibility.Invisible*/;
		} else {
			_treeItemCounter += 1;
			result.id = _treeItemCounter;
		}

		return result;
	}

	function defineNavigationParent(parentItem, treeItem, skipFirstParent) {
		var parents = [];

		/* take logicalParentItem when it is visible or collect all visible immidiate parents of logicalParentItem */
		if (skipFirstParent || parentItem.visibility == 4/*chartDiag.default.Visibility.Invisible*/ || !itemTemplateParamsTask.getTemplateParams(parentItem.id).isActive) {
			_data.navigationFamily.loopParents(this, parentItem.id, function (parentid, parent, level) {
				if (parent.visibility != 4/*chartDiag.default.Visibility.Invisible*/ && itemTemplateParamsTask.getTemplateParams(parentid).isActive) {
					parents.push(parentid);
					return _data.navigationFamily.SKIP;
				}
			});
		} else {
			parents.push(parentItem.id);
		}
		if (_data.navigationFamily.node(treeItem.id) != null) {
			_data.navigationFamily.adopt(parents, treeItem.id);
		} else {
			_data.navigationFamily.add(parents, treeItem.id, treeItem);
		}
	}

	function getVisualTree() {
		return _data.visualTree;
	}

	function getNavigationFamily() {
		return _data.navigationFamily;
	}

	return {
		process: process,
		getVisualTree: getVisualTree,
		getNavigationFamily: getNavigationFamily
	};
};

/* /Controls/OrgDiagram/Templates/AnnotationLabelTemplate.js*/
/* jshint latedef: true, unused: false */
chartDiag.default.AnnotationLabelTemplate = function () {
	var _template = create(),
		_hashCode = chartDiag.default.hashCode(_template);

	function create() {
		var template = jQuery('<div></div>');
		template.addClass("bp-item bp-corner-all bp-connector-label");

		return template.wrap('<div>').parent().html();
	}

	function template() {
		return _template;
	}

	function getHashCode() {
		return _hashCode;
	}

	function render(event, data) {
		var annotationConfig = data.context;
		data.element.html(annotationConfig.label);
	}

	return {
		template: template,
		getHashCode: getHashCode,
		render: render
	};
};

/* /Controls/OrgDiagram/Templates/ButtonsTemplate.js*/
chartDiag.default.ButtonsTemplate = function (options) {
	var _template = create(),
		_hashCode = chartDiag.default.hashCode(_template);

	function create() {
		var template = jQuery("<ul></ul>");

		template.css({
			position: "absolute"
		}).addClass("ui-widget ui-helper-clearfix");

		return template.wrap('<div>').parent().html();
	}

	function template() {
		return _template;
	}

	function getHashCode() {
		return _hashCode;
	}

	function render(event, data) {
		var name = "orgChart",
			topOffset = 0,
			buttonsInterval = 10,
			buttonConfig,
			buttons = data.buttons,
			button,
			index;

		switch (data.renderingMode) {
			case 0/*chartDiag.default.RenderingMode.Create*/:
				for (index = 0; index < buttons.length; index += 1) {
					buttonConfig = buttons[index];
					button = jQuery('<li data-buttonname="' + buttonConfig.name + '"></li>')
						.css({
							position: "absolute",
							top: topOffset + "px",
							left: "0px",
							width: buttonConfig.size.width + "px",
							height: buttonConfig.size.height + "px",
							padding: "3px"
						})
						.addClass(name + "button");
					data.element.append(button);
					button.button({
						icons: { primary: buttonConfig.icon },
						text: buttonConfig.text,
						label: buttonConfig.label
					});

					if (!chartDiag.default.isNullOrEmpty(buttonConfig.tooltip)) {
						if (button.tooltip != null) {
							button.tooltip({ content: buttonConfig.tooltip });
						}
					}
					topOffset += buttonsInterval + buttonConfig.size.height;
				}
				break;
			case 1/*chartDiag.default.RenderingMode.Update*/:
				break;
		}
	}

	return {
		template: template,
		getHashCode: getHashCode,
		render: render
	};
};


/* /Controls/OrgDiagram/Templates/CheckBoxTemplate.js*/
chartDiag.default.CheckBoxTemplate = function (selectCheckBoxLabel) {
	var _template = create(),
		_hashCode = chartDiag.default.hashCode(_template);

	function create() {
		var template = jQuery('<div></div>');
		template.addClass("bp-item bp-selectioncheckbox-frame");
		template.append(jQuery('<label><nobr><input type="checkbox" name="checkbox" class="bp-selectioncheckbox" />&nbsp;<span name="selectiontext" class="bp-selectiontext">' +
			selectCheckBoxLabel + '</span></nobr></label>'));

		return template.wrap('<div>').parent().html();
	}

	function template() {
		return _template;
	}

	function getHashCode() {
		return _hashCode;
	}

	function render(event, data) {
		var checkBox = data.element.find("[name=checkbox]");
		checkBox.prop("checked", data.isSelected);
	}

	return {
		template: template,
		getHashCode: getHashCode,
		render: render
	};
};

/* /Controls/OrgDiagram/Templates/CursorTemplate.js*/
chartDiag.default.CursorTemplate = function (options, itemTemplateConfig) {
	var _template = create(itemTemplateConfig),
		_hashCode = chartDiag.default.hashCode(_template);

	function create(config) {
		var cursorTemplate = jQuery("<div></div>")
		.css({
			width: (config.itemSize.width + config.cursorPadding.left + config.cursorPadding.right) + "px",
			height: (config.itemSize.height + config.cursorPadding.top + config.cursorPadding.bottom) + "px",
			"border-width": config.cursorBorderWidth + "px"
		}).addClass("bp-item bp-corner-all bp-cursor-frame");

		return cursorTemplate.wrap('<div>').parent().html();
	}

	function template() {
		return _template;
	}

	function getHashCode() {
		return _hashCode;
	}

	function render(event, data) {

	}

	return {
		template: template,
		getHashCode: getHashCode,
		render: render
	};
};

/* /Controls/OrgDiagram/Templates/DotHighlightTemplate.js*/
chartDiag.default.DotHighlightTemplate = function (options, itemTemplateConfig) {
	var _template = create(itemTemplateConfig),
		_hashCode = chartDiag.default.hashCode(_template);

	function create(config) {
		var radius = config.minimizedItemCornerRadius + config.highlightPadding.left,
		highlightTemplate = jQuery("<div></div>")
		.css({
			"border-width": config.highlightBorderWidth + "px",
			"-moz-border-radius": radius,
			"-webkit-border-radius": radius,
			"-khtml-border-radius": radius,
			"border-radius": radius
		}).addClass("bp-item bp-highlight-dot-frame");

		return highlightTemplate.wrap('<div>').parent().html();
	}

	function template() {
		return _template;
	}

	function getHashCode() {
		return _hashCode;
	}

	function render(event, data) {

	}

	return {
		template: template,
		getHashCode: getHashCode,
		render: render
	};
};

/* /Controls/OrgDiagram/Templates/GroupTitleTemplate.js*/
chartDiag.default.GroupTitleTemplate = function (itemTitleFirstFontColor, itemTitleSecondFontColor ) {
	var _template = create(),
		_hashCode = chartDiag.default.hashCode(_template);

	function create() {
		var template = jQuery('<div></div>');
		template.addClass("bp-item bp-corner-all bp-grouptitle-frame");

		return template.wrap('<div>').parent().html();
	}

	function template() {
		return _template;
	}

	function getHashCode() {
		return _hashCode;
	}

	function render(event, data) {
		var config = new chartDiag.text.Config(),
			itemConfig = data.context,
			groupTitleColor = itemConfig.groupTitleColor || "#4169e1"/*chartDiag.default.Colors.RoyalBlue*/;

		config.orientation = 2/*chartDiag.text.TextOrientationType.RotateRight*/;
		config.horizontalAlignment = 0/*chartDiag.default.HorizontalAlignmentType.Center*/;
		config.verticalAlignment = 1/*chartDiag.default.VerticalAlignmentType.Middle*/;
		config.text = itemConfig.groupTitle;
		config.fontSize = "12px";
		config.color = chartDiag.default.highestContrast(groupTitleColor, itemTitleSecondFontColor, itemTitleFirstFontColor);
		config.fontFamily = "Arial";
		switch (data.renderingMode) {
			case 0/*chartDiag.default.RenderingMode.Create*/:
				data.element.bpText(config);
				break;
			case 1/*chartDiag.default.RenderingMode.Update*/:
				data.element.bpText("option", config);
				data.element.bpText("update");
				break;
		}
		chartDiag.default.css(data.element, { "background": groupTitleColor });
	}

	return {
		template: template,
		getHashCode: getHashCode,
		render: render
	};
};


/* /Controls/OrgDiagram/Templates/HighlightTemplate.js*/
chartDiag.default.HighlightTemplate = function (options, itemTemplateConfig) {
	var _template = create(itemTemplateConfig),
		_hashCode = chartDiag.default.hashCode(template);

	function create(config) {
		var highlightTemplate = jQuery("<div></div>")
		.css({
			"border-width": config.highlightBorderWidth + "px"
		}).addClass("bp-item bp-corner-all bp-highlight-frame");

		return highlightTemplate.wrap('<div>').parent().html();
	}

	function template() {
		return _template;
	}

	function getHashCode() {
		return _hashCode;
	}

	function render(event, data) {

	}

	return {
		template: template,
		getHashCode: getHashCode,
		render: render
	};
};

/* /Controls/OrgDiagram/Templates/ItemTemplate.js*/
chartDiag.default.ItemTemplate = function (options, itemTemplateConfig) {
	var _template = create(itemTemplateConfig),
		_hashCode = chartDiag.default.hashCode(template);

	function create(config) {
		var contentSize = new chartDiag.default.Size(config.itemSize),
			itemTemplate,
			titleBackground,
			title,
			photoborder,
			photo,
			description;

		contentSize.width -= config.itemBorderWidth * 2;
		contentSize.height -= config.itemBorderWidth * 2;

		itemTemplate = jQuery('<div></div>')
			.css({
				"border-width": config.itemBorderWidth + "px"
			}).addClass("bp-item bp-corner-all bt-item-frame");

		titleBackground = jQuery('<div name="titleBackground"></div>')
			.css({
				top: "2px",
				left: "2px",
				width: (contentSize.width - 4) + "px",
				height: "18px"
			}).addClass("bp-item bp-corner-all bp-title-frame");

		itemTemplate.append(titleBackground);

		title = jQuery('<div name="title"></div>')
			.css({
				top: "1px",
				left: "4px",
				width: (contentSize.width - 4 - 4 * 2) + "px",
				height: "16px"
			}).addClass("bp-item bp-title");

		titleBackground.append(title);

		photoborder = jQuery("<div></div>")
			.css({
				top: "24px",
				left: "2px",
				width: "50px",
				height: "60px"
			}).addClass("bp-item bp-photo-frame");

		itemTemplate.append(photoborder);

		photo = jQuery('<img name="photo" alt=""></img>')
			.css({
				width: "50px",
				height: "60px"
			});
		photoborder.append(photo);

		description = jQuery('<div name="description"></div>')
		.css({
			top: "24px",
			left: "0px",
			width: (contentSize.width - 4 - 56) + "px",
			height: "74px"
		}).addClass("bp-item bp-description");

		itemTemplate.append(description);

		return itemTemplate.wrap('<div>').parent().html();
	}

	function template() {
		return _template;
	}

	function getHashCode() {
		return _hashCode;
	}

	function render(event, data) {
		var itemConfig = data.context,
			itemTitleColor = itemConfig.itemTitleColor != null ? itemConfig.itemTitleColor : "#4169e1"/*chartDiag.default.Colors.RoyalBlue*/,
			color = chartDiag.default.highestContrast(itemTitleColor, options.itemTitleSecondFontColor, options.itemTitleFirstFontColor);
		data.element.find("[name=titleBackground]").css({ "background": itemTitleColor });
		data.element.find("[name=photo]").attr({ "src": itemConfig.image, "alt": itemConfig.title });
		data.element.find("[name=title]").css({ "color": color }).text(itemConfig.title);
		data.element.find("[name=description]").text(itemConfig.description);
	}

	return {
		template: template,
		getHashCode: getHashCode,
		render: render
	};
};

/* /Controls/OrgDiagram/Templates/PrintPreviewTemplate.js*/
chartDiag.default.PrintPreviewTemplate = function (options) {
	var _template = create(),
		_hashCode = chartDiag.default.hashCode(template);

	function create() {
		var template = jQuery('<div></div>');
		template.addClass("bp-item bp-printpreview");

		return template.wrap('<div>').parent().html();
	}

	function template() {
		return _template;
	}

	function getHashCode() {
		return _hashCode;
	}

	function render(event, data) {

	}

	return {
		template: template,
		getHashCode: getHashCode,
		render: render
	};
};

/* /Controls/OrgDiagram/Templates/UserTemplate.js*/
chartDiag.default.UserTemplate = function (options, content, onRender) {
	var _hashCode = chartDiag.default.hashCode(content);

	function template() {
		return content;
	}

	function getHashCode() {
		return _hashCode;
	}

	function render(event, data) {
		if (onRender != null) {
			onRender(event, data);
		} else {
			var itemConfig = data.context,
				itemTitleColor = itemConfig.itemTitleColor != null ? itemConfig.itemTitleColor : "#4169e1"/*chartDiag.default.Colors.RoyalBlue*/,
				color = chartDiag.default.highestContrast(itemTitleColor, options.itemTitleSecondFontColor, options.itemTitleFirstFontColor);
			data.element.find("[name=titleBackground]").css({ "background": itemTitleColor });
			data.element.find("[name=photo]").attr({ "src": itemConfig.image, "alt": itemConfig.title });
			data.element.find("[name=title]").css({ "color": color }).text(itemConfig.title);
			data.element.find("[name=description]").text(itemConfig.description);
		}
	}

	return {
		template: template,
		getHashCode: getHashCode,
		render: render
	};
};

/* /Controls/OrgDiagram/BaseControl.js*/
chartDiag.orgChart.BaseControl = function (element, options, taskManagerFactory, eventArgsFactory) {
	var _data = {
			name: "orgChart",
			options: options,
			tasks: null,
			graphics: null,
			mouse: null,
			layout: {
					element: element,
					scrollPanel: null,
					mousePanel: null,
					placeholder: null,
					calloutPlaceholder: null,
					forceCenterOnCursor: true
				}
		},
		_dragStartPosition,
		_cancelMouseClick,
		_scale,
		_debug = false;

	function update(updateMode) {
		switch (updateMode) {
			case 1/*chartDiag.default.UpdateMode.Refresh*/:
				refresh(true, _debug);
				break;
			case 2/*chartDiag.default.UpdateMode.PositonHighlight*/:
				positionHighlight(_debug);
				break;
			default:
				redraw();
				break;
		}
	}

	function destroy() {
		unbind(_data.layout);
		cleanLayout(_data.layout, _data.name);

		_data.tasks = null;
		_data.graphics = null;
	}

	function redraw() {
		destroyMouse();
		unbind(_data.layout);
		cleanLayout(_data.layout, _data.name);

		createLayout(_data.layout, _data.name);
		createMouse();
		bind(_data.layout);
		_data.tasks = taskManagerFactory(getOptions, getGraphics, getLayout);
		_data.graphics = chartDiag.default.createGraphics(_data.options.graphicsType, _data.layout.element);
		_data.graphics.debug = _debug;

		_data.options.actualGraphicsType = _data.graphics.graphicsType;

		refresh(true, _debug);
	}

	function refresh(forceCenterOnCursor, debug) {
		var centerOnCursorTask,
			placeholderOffset;

		//_data.layout.scrollPanel.css({
		//	"display": "none",
		//	"-webkit-overflow-scrolling": "auto"
		//});

		//this.graphics.begin();

		_data.layout.forceCenterOnCursor = forceCenterOnCursor;
		_data.tasks.process('OptionsTask', null, debug);

		_data.graphics.end();

		//_data.layout.scrollPanel.css({
		//	"display": "block"
		//});

		if (forceCenterOnCursor) {
			/* scroll to offset */
			centerOnCursorTask = _data.tasks.getTask("CenterOnCursorTask");
			placeholderOffset = centerOnCursorTask.getPlaceholderOffset();
			_data.layout.scrollPanel.scrollLeft(placeholderOffset.x);
			_data.layout.scrollPanel.scrollTop(placeholderOffset.y);
		}
		//_data.layout.scrollPanel.css({
		//	"-webkit-overflow-scrolling": "touch"
		//});
	}

	function positionHighlight(debug) {
		_data.layout.forceCenterOnCursor = false;
		_data.tasks.process('HighlightItemOptionTask', null, debug);

		_data.graphics.end();
	}

	function setOptions(options) {
		for (var option in options) {
			if (options.hasOwnProperty(option)) {
				_data.options[option] = options[option];
			}
		}
	}

	function getOptions() {
		return _data.options;
	}

	function getOption(option) {
		return _data.options[option];
	}

	function setOption(option, value) {
		return _data.options[option] = value;
	}

	function getGraphics() {
		return _data.graphics;
	}

	function getLayout() {
		return _data.layout;
	}

	function createLayout(layout, name) {
		var scrollPanelRect = new chartDiag.default.Rect(0, 0, layout.element.outerWidth(), layout.element.outerHeight()),
			placeholderRect = new chartDiag.default.Rect(scrollPanelRect),
			position = layout.element.offset(),
			scrollPanel,
			mousePanel,
			placeholder,
			calloutPlaceholder;

		/* root scroll panel */
		scrollPanel = jQuery('<div tabindex="0"></div>');
		scrollPanel.css({
			"position": "relative",
			"overflow": "auto",
			"-webkit-overflow-scrolling": "touch",
			"top": "0px",
			"left": "0px",
			"width": scrollPanelRect.width + "px",
			"height": scrollPanelRect.height + "px",
			"padding": "0px",
			"margin-bottom": "0px",
			"margin-right": "0px",
			"margin-top": (-position.top + Math.floor(position.top)) + "px", /* fixes div pixel alignment */
			"margin-left": (-position.left + Math.floor(position.left)) + "px"
		});
		scrollPanel.addClass(name);

		/* mouse tracking events panel */
		mousePanel = jQuery('<div></div>');
		mousePanel.css({
			position: "absolute",
			overflow: "hidden",
			top: "0px",
			left: "0px"
		});
		mousePanel.addClass(name);
		mousePanel.css(placeholderRect.getCSS());

		/* contents scalable panel */
		placeholder = jQuery('<div></div>');
		placeholder.css({
			position: "absolute",
			overflow: "hidden",
			top: "0px",
			left: "0px"
		});
		placeholder.addClass("placeholder");
		placeholder.addClass(name);
		placeholder.css(placeholderRect.getCSS());
		

		/* callout panel */
		calloutPlaceholder = jQuery('<div></div>');
		calloutPlaceholder.css({
			position: "absolute",
			overflow: "visible"
		});
		calloutPlaceholder.addClass("calloutplaceholder");
		calloutPlaceholder.addClass(name);
		calloutPlaceholder.css({
			top: "0px",
			left: "0px",
			width: "0px",
			height: "0px"
		});
		
		/* append panels */
		scrollPanel.append(mousePanel);
		mousePanel.append(placeholder);
		placeholder.append(calloutPlaceholder);
		layout.element.append(scrollPanel);

		/* save references */
		layout.scrollPanel = scrollPanel;
		layout.mousePanel = mousePanel;
		layout.placeholder = placeholder;
		layout.calloutPlaceholder = calloutPlaceholder;
	}

	function cleanLayout(layout, name) {
		layout.element.find("." + name).remove();
	}

	function createMouse() {
		if (_data.options.enablePanning) {
			_data.mouse = new chartDiag.default.Mouse();
			_data.mouse.init(_data.layout.element, {
				name: _data.name,
				onMouseDrag: mouseDrag,
				onMouseStop: mouseStop,
				onMouseCapture: mouseCapture
			});
		}
	}

	function destroyMouse() {
		if (_data.mouse != null) {
			_data.mouse.destroy();
		}
	}

	function bind(layout) {
		layout.mousePanel
			.mousemove(function (e) { onMouseMove(e); })
			.click(function (e) { onMouseClick(e); })
			.dblclick(function (e) { onMouseDblClick(e); });
		layout.scrollPanel
			.keydown(function (e) { onKeyDown(e); });

		//if ('ontouchstart' in document.documentElement) {//ignore jslint
		//	layout.scrollPanel[0].addEventListener("gesturestart", onGestureStart, false);
		//	layout.scrollPanel[0].addEventListener("gesturechange", onGestureChange, false);
		//}
	}

	function unbind(layout) {
		if (layout.mousePanel != null) {
			layout.mousePanel.unbind("mousemove");
			layout.mousePanel.unbind("click");
			layout.mousePanel.unbind("dblclick");
		}
		if (layout.scrollPanel != null) {
			layout.scrollPanel.unbind("keydown");
		}

		//if ('ontouchstart' in document.documentElement) {//ignore jslint
		//	layout.scrollPanel[0].removeEventListener("gesturestart", onGestureStart, false);
		//	layout.scrollPanel[0].removeEventListener("gesturechange", onGestureChange, false);
		//}
	}

	function onMouseMove(event) {
		var placeholderOffset = _data.layout.mousePanel.offset(),
			x = event.pageX - placeholderOffset.left,
			y = event.pageY - placeholderOffset.top,
			createTransformTask = _data.tasks.getTask("CreateTransformTask"),
			highlightItemOptionTask = _data.tasks.getTask("HighlightItemOptionTask"),
			item;

		if (!_data.mouse || !_data.mouse.isStarted()) {
			_cancelMouseClick = false;

			if (highlightItemOptionTask.hasHighlightEnabled()) {
				item = createTransformTask.getTreeItemForMousePosition(x, y);
				if (item !== null) {
					setHighlightItem(event, item.id);
				}
			}
		}
	}

	function onMouseClick(event) {
		if (!_data.mouse || !_data.mouse.isStarted()) {
			var placeholderOffset = _data.layout.mousePanel.offset(),
				x = event.pageX - placeholderOffset.left,
				y = event.pageY - placeholderOffset.top,
				createTransformTask = _data.tasks.getTask("CreateTransformTask"),
				cursorItemOptionTask = _data.tasks.getTask("CursorItemOptionTask"),
				item,
				newCursorItem = createTransformTask.getTreeItemForMousePosition(x, y),
				target,
				button,
				buttonname,
				eventArgs,
				position,
				selectedItems;

			if (newCursorItem !== null) {
				var newCursorItemId = newCursorItem.id;
				if (!_cancelMouseClick) {
					target = jQuery(event.target);
					if (target.hasClass(_data.name + "button") || target.parent("." + _data.name + "button").length > 0) {
						button = target.hasClass(_data.name + "button") ? target : target.parent("." + _data.name + "button");
						buttonname = button.data("buttonname");

						eventArgs = getEventArgs(null, newCursorItemId, buttonname);
						trigger("onButtonClick", event, eventArgs);
					}
					else if (target.attr("name") === "selectiontext") {
					}
					else if (target.attr("name") === "checkbox") {//ignore jslint
						selectedItems = (_data.options.selectedItems || []).slice(0);
						eventArgs = getEventArgs(null, newCursorItemId, buttonname);
						trigger("onSelectionChanging", event, eventArgs);

						position = chartDiag.default.indexOf(selectedItems, newCursorItemId);
						if (position >= 0) {
							selectedItems.splice(position, 1);
						}
						else {
							selectedItems.push(newCursorItemId);
						}
						_data.options.selectedItems = selectedItems;
						trigger("onSelectionChanged", event, eventArgs);
					}
					else {
						eventArgs = getEventArgs(null, newCursorItemId);

						trigger("onMouseClick", event, eventArgs);
						if (!eventArgs.cancel) {
							if (cursorItemOptionTask.hasCursorEnabled()) {
								setCursorItem(event, newCursorItemId);
								_data.layout.scrollPanel.focus();
							}
						}
					}
				}
			}
		}
		_cancelMouseClick = false;
	}

	function onMouseDblClick(event) {
		var eventArgs,
			highlightItemTask = _data.tasks.getTask("HighlightItemTask"),
			highlightTreeItem = highlightItemTask.getHighlightTreeItem();

		if (highlightTreeItem !== null) {
			if (!_cancelMouseClick) {
				eventArgs = getEventArgs(null, highlightTreeItem);

				trigger("onMouseDblClick", event, eventArgs);
			}
		}
		_cancelMouseClick = false;
	}

	function onKeyDown(event) {
		var highlightItemTask = _data.tasks.getTask("HighlightItemTask"),
			highlightItemOptionTask = _data.tasks.getTask("HighlightItemOptionTask"),
			cursorItemTask = _data.tasks.getTask("CursorItemTask"),
			cursorItemOptionTask = _data.tasks.getTask("CursorItemOptionTask"),
			alignDiagramTask = _data.tasks.getTask('AlignDiagramTask'),
			createTransformTask = _data.tasks.getTask('CreateTransformTask'),
			transform = createTransformTask.getTransform(),
			navigationItem = null,
			newNavigationItem,
			direction = null,
			accepted,
			layout = _data.layout;

		if (highlightItemOptionTask.hasHighlightEnabled() && cursorItemOptionTask.hasCursorEnabled()) {
			navigationItem = highlightItemTask.getHighlightTreeItem();
			if (navigationItem === null) {
				navigationItem = cursorItemTask.getCursorTreeItem();
			}
		} else if (highlightItemOptionTask.hasHighlightEnabled()) {
			navigationItem = highlightItemTask.getHighlightTreeItem();
		} else if (cursorItemOptionTask.hasCursorEnabled()) {
			navigationItem = cursorItemTask.getCursorTreeItem();
		}


		if (navigationItem != null) {
			switch (event.which) {
				case 13: /*Enter*/
					if (cursorItemOptionTask.hasCursorEnabled()) {
						setCursorItem(event, navigationItem);
						event.preventDefault();
						layout.scrollPanel.focus();
					}
					break;
				case 40: /*Down*/
					direction = 1/*chartDiag.default.OrientationType.Bottom*/;
					break;
				case 38: /*Up*/
					direction = 0/*chartDiag.default.OrientationType.Top*/;
					break;
				case 37: /*Left*/
					direction = 2/*chartDiag.default.OrientationType.Left*/;
					break;
				case 39: /*Right*/
					direction = 3/*chartDiag.default.OrientationType.Right*/;
					break;
			}

			if (direction != null) {

				accepted = false;

				while (!accepted) {
					accepted = true;

					direction = transform.getOrientation(direction);

					switch (direction) {
						case 0/*chartDiag.default.OrientationType.Top*/:
							newNavigationItem = alignDiagramTask.getNextLevelTreeItem(navigationItem, false);
							break;
						case 1/*chartDiag.default.OrientationType.Bottom*/:
							newNavigationItem = alignDiagramTask.getNextLevelTreeItem(navigationItem, true);
							break;
						case 2/*chartDiag.default.OrientationType.Left*/:
							newNavigationItem = alignDiagramTask.getNextTreeItem(navigationItem, true);
							break;
						case 3/*chartDiag.default.OrientationType.Right*/:
							newNavigationItem = alignDiagramTask.getNextTreeItem(navigationItem, false);
							break;
					}


					if (newNavigationItem != null) {
						event.preventDefault();
						if (highlightItemOptionTask.hasHighlightEnabled()) {
							setHighlightItem(event, newNavigationItem);
						} else if (cursorItemOptionTask.hasCursorEnabled()) {
							setCursorItem(event, newNavigationItem);
						}

					}
				}
				layout.scrollPanel.focus();
			}
		}
	}

	function onGestureStart(e) {
		var scaleOptionTask = _data.taks.getTask("ScaleOptionTask"),
			options = scaleOptionTask.getOptions();

		_scale = options.scale;
		e.preventDefault();
	}

	function onGestureChange(e) {
		var scale = Math.round(_scale * e.scale * 10.0) / 10.0,
			scaleOptionTask = _data.taks.getTask("ScaleOptionTask"),
			options = scaleOptionTask.getOptions();

		if (scale > options.maximumScale) {
			scale = options.maximumScale;
		} else if (scale < options.minimumScale) {
			scale = options.minimumScale;
		}

		_data.options.scale = scale;

		refresh(false, false);

		e.preventDefault();
	}

	function mouseDrag(event) {
		var position = new chartDiag.default.Point(event.pageX, event.pageY),
			left = -position.x + _dragStartPosition.x,
			top = -position.y + _dragStartPosition.y,
			scrollPanel = _data.layout.scrollPanel;
		scrollPanel.css('visibility', 'hidden');
		scrollPanel
			.scrollLeft(left)
			.scrollTop(top);
		scrollPanel.css('visibility', 'inherit');
		return false;
	}

	function mouseStop(event) {//ignore jslint
		_cancelMouseClick = true;
	}

	function mouseCapture(event) {
		var scrollPanel = _data.layout.scrollPanel;
		_dragStartPosition = new chartDiag.default.Point(scrollPanel.scrollLeft() + event.pageX, scrollPanel.scrollTop() + event.pageY);
		return true;
	}

	function setHighlightItem(event, newHighlightItemId) {
		var result = true,
			eventArgs;
		if (newHighlightItemId !== null) {
			if (newHighlightItemId !== _data.options.highlightItem) {
				eventArgs = getEventArgs(_data.options.highlightItem, newHighlightItemId);

				_data.options.highlightItem = newHighlightItemId;

				trigger("onHighlightChanging", event, eventArgs);

				if (!eventArgs.cancel) {
					refresh(false, false);

					trigger("onHighlightChanged", event, eventArgs);
				} else {
					result = false;
				}
			}
		} else {
			if (_data.options.highlightItem !== null) {
				eventArgs = getEventArgs(_data.options.highlightItem, null);

				_data.options.highlightItem = null;

				trigger("onHighlightChanging", event, eventArgs);

				if (!eventArgs.cancel) {
					refresh(false, false);

					trigger("onHighlightChanged", event, eventArgs);
				} else {
					result = false;
				}
			}
		}
		return result;
	}

	function setCursorItem(event, newCursorItemId) {
		var eventArgs;
		if (newCursorItemId !== _data.options.cursorItem) {
			eventArgs = getEventArgs(_data.options.cursorItem, newCursorItemId);

			_data.options.cursorItem = newCursorItemId;

			trigger("onCursorChanging", event, eventArgs);

			if (!eventArgs.cancel) {
				refresh(true, _debug);

				trigger("onCursorChanged", event, eventArgs);
			}
		}
	}

	function getEventArgs(oldTreeItemId, newTreeItemId, name) {
		return eventArgsFactory(_data, oldTreeItemId, newTreeItemId, name);
	}

	function trigger(eventHandlerName, event, eventArgs) {
		var eventHandler = _data.options[eventHandlerName];
		if (eventHandler != null) {
			eventHandler(event, eventArgs);
		}
	}

	function getProcessDiagramConfig() {
		var tasks = taskManagerFactory(getOptions, getGraphics, getLayout);

		return tasks.getProcessDiagramConfig();
	}

	update(); /* init control on create */

	return {
		destroy: destroy,
		setOptions: setOptions,
		getOptions: getOptions,
		setOption: setOption,
		getOption: getOption,
		update: update,
		getProcessDiagramConfig: getProcessDiagramConfig
	};
};

/* /Controls/OrgDiagram/Control.js*/
chartDiag.orgChart.Control = function (element, options) {
	
	function createTaskManager(getOptions, getGraphics, getLayout) {
		var tasks = new chartDiag.default.TaskManager();

		// Dependencies
		tasks.addDependency('options', getOptions);
		tasks.addDependency('graphics', getGraphics);
		tasks.addDependency('layout', getLayout);

		tasks.addDependency('defaultConfig', new chartDiag.orgChart.Config());
		tasks.addDependency('defaultItemConfig', new chartDiag.orgChart.ItemConfig());
		tasks.addDependency('defaultTemplateConfig', new chartDiag.orgChart.TemplateConfig());
		tasks.addDependency('defaultButtonConfig', new chartDiag.orgChart.ButtonConfig());

		tasks.addDependency('defaultBackgroundAnnotationConfig', new chartDiag.orgChart.BackgroundAnnotationConfig());
		tasks.addDependency('defaultConnectorAnnotationConfig', new chartDiag.orgChart.ConnectorAnnotationConfig());
		tasks.addDependency('defaultHighlightPathAnnotationConfig', new chartDiag.orgChart.HighlightPathAnnotationConfig());
		tasks.addDependency('defaultShapeAnnotationConfig', new chartDiag.orgChart.ShapeAnnotationConfig());

		tasks.addDependency('isFamilyChartMode', false);
		tasks.addDependency('showElbowDots', false);
		tasks.addDependency('null', null);
		tasks.addDependency('foreground', 2/*chartDiag.default.ZOrderType.Foreground*/);
		tasks.addDependency('background', 1/*chartDiag.default.ZOrderType.Background*/);

		// Options
		tasks.addTask('OptionsTask', ['options'], chartDiag.orgChart.OptionsTask, "#000000"/*chartDiag.default.Colors.Black*/);

		// Layout
		tasks.addTask('CurrentControlSizeTask', ['layout', 'OptionsTask', 'ItemsSizesOptionTask'], chartDiag.orgChart.CurrentControlSizeTask, "#000000"/*chartDiag.default.Colors.Black*/);
		tasks.addTask('CurrentScrollPositionTask', ['layout', 'OptionsTask'], chartDiag.orgChart.CurrentScrollPositionTask, "#000000"/*chartDiag.default.Colors.Black*/);

		tasks.addTask('CalloutOptionTask', ['OptionsTask', 'defaultConfig', 'defaultItemConfig'], chartDiag.orgChart.CalloutOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('ConnectorsOptionTask', ['OptionsTask', 'defaultConfig'], chartDiag.orgChart.ConnectorsOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('ItemsOptionTask', ['OptionsTask', 'defaultItemConfig'], chartDiag.orgChart.ItemsOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('ItemsSizesOptionTask', ['OptionsTask', 'defaultConfig', 'defaultItemConfig', 'defaultButtonConfig'], chartDiag.orgChart.ItemsSizesOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('LabelsOptionTask', ['OptionsTask', 'defaultConfig', 'defaultItemConfig'], chartDiag.orgChart.LabelsOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('PrintPreviewOptionTask', ['OptionsTask', 'defaultConfig'], chartDiag.orgChart.PrintPreviewOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('TemplatesOptionTask', ['OptionsTask', 'defaultConfig', 'defaultButtonConfig', 'defaultTemplateConfig'], chartDiag.orgChart.TemplatesOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('OrientationOptionTask', ['OptionsTask', 'defaultConfig'], chartDiag.orgChart.OrientationOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('VisualTreeOptionTask', ['OptionsTask', 'defaultConfig'], chartDiag.orgChart.VisualTreeOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('MinimizedItemsOptionTask', ['OptionsTask'], chartDiag.orgChart.MinimizedItemsOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);

		tasks.addTask('CursorItemOptionTask', ['OptionsTask', 'defaultConfig'], chartDiag.orgChart.CursorItemOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('HighlightItemOptionTask', ['OptionsTask', 'defaultConfig'], chartDiag.orgChart.HighlightItemOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('SelectedItemsOptionTask', ['OptionsTask'], chartDiag.orgChart.SelectedItemsOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('CursorSelectionPathModeOptionTask', ['OptionsTask', 'defaultConfig'], chartDiag.orgChart.CursorSelectionPathModeOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);

		tasks.addTask('SplitAnnotationsOptionTask', ['OptionsTask'], chartDiag.orgChart.SplitAnnotationsOptionTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);

		tasks.addTask('ForegroundShapeAnnotationOptionTask', ['SplitAnnotationsOptionTask', 'defaultShapeAnnotationConfig', 'foreground'], chartDiag.orgChart.ShapeAnnotationOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('BackgroundShapeAnnotationOptionTask', ['SplitAnnotationsOptionTask', 'defaultShapeAnnotationConfig', 'background'], chartDiag.orgChart.ShapeAnnotationOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('HighlightPathAnnotationOptionTask', ['SplitAnnotationsOptionTask', 'defaultConfig', 'defaultHighlightPathAnnotationConfig'], chartDiag.orgChart.HighlightPathAnnotationOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('ForegroundConnectorAnnotationOptionTask', ['SplitAnnotationsOptionTask', 'defaultConnectorAnnotationConfig', 'foreground'], chartDiag.orgChart.ConnectorAnnotationOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('BackgroundConnectorAnnotationOptionTask', ['SplitAnnotationsOptionTask', 'defaultConnectorAnnotationConfig', 'background'], chartDiag.orgChart.ConnectorAnnotationOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('BackgroundAnnotationOptionTask', ['SplitAnnotationsOptionTask', 'defaultBackgroundAnnotationConfig'], chartDiag.orgChart.BackgroundAnnotationOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);

		tasks.addTask('ScaleOptionTask', ['OptionsTask', 'defaultConfig'], chartDiag.orgChart.ScaleOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);

		// Transformations
		tasks.addTask('CombinedContextsTask', ['ItemsOptionTask'], chartDiag.orgChart.CombinedContextsTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('IntervalsTask', ['ItemsSizesOptionTask'], chartDiag.orgChart.IntervalsTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('OrgTreeTask', ['ItemsOptionTask'], chartDiag.orgChart.OrgTreeTask, "#ff0000"/*chartDiag.default.Colors.Red*/);

		// Transformations / Templates
		tasks.addTask('ReadTemplatesTask', ['TemplatesOptionTask'], chartDiag.orgChart.ReadTemplatesTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('ItemTemplateParamsTask', ['ItemsSizesOptionTask', 'CursorItemOptionTask', 'ReadTemplatesTask'], chartDiag.orgChart.ItemTemplateParamsTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('GroupTitleTemplateTask', ['TemplatesOptionTask'], chartDiag.orgChart.GroupTitleTemplateTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('CheckBoxTemplateTask', ['ItemsSizesOptionTask'], chartDiag.orgChart.CheckBoxTemplateTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('ButtonsTemplateTask', ['ItemsSizesOptionTask'], chartDiag.orgChart.ButtonsTemplateTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('AnnotationLabelTemplateTask', ['ItemsOptionTask'], chartDiag.orgChart.AnnotationLabelTemplateTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('PrintPreviewTemplateTask', ['ItemsOptionTask'], chartDiag.orgChart.PrintPreviewTemplateTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);

		tasks.addTask('VisualTreeTask', ['OrgTreeTask', 'ItemTemplateParamsTask', 'VisualTreeOptionTask', 'isFamilyChartMode'], chartDiag.orgChart.VisualTreeTask, "#ff0000"/*chartDiag.default.Colors.Red*/);
		tasks.addTask('VisualTreeLevelsTask', ['VisualTreeTask', 'ItemTemplateParamsTask'], chartDiag.orgChart.VisualTreeLevelsTask, "#ff0000"/*chartDiag.default.Colors.Red*/);
		tasks.addTask('VisualTreeMarginsTask', ['VisualTreeTask'], chartDiag.orgChart.VisualTreeMarginsTask, "#ff0000"/*chartDiag.default.Colors.Red*/);

		tasks.addTask('ExtraPartnersTask', ['VisualTreeTask'], chartDiag.orgChart.DummyExtraPartnersTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);

		tasks.addTask('ConnectionsGraphTask', ['VisualTreeTask', 'VisualTreeLevelsTask', 'ExtraPartnersTask'], chartDiag.orgChart.ConnectionsGraphTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('TracePathAnnotationsTask', ['HighlightPathAnnotationOptionTask', 'ConnectionsGraphTask', 'OrgTreeTask', 'VisualTreeTask', 'VisualTreeTask'], chartDiag.orgChart.TracePathAnnotationsTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);

		

		// Transformations/Selections
		tasks.addTask('HighlightItemTask', ['HighlightItemOptionTask', 'OrgTreeTask'], chartDiag.orgChart.HighlightItemTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);

		tasks.addTask('CursorItemTask', ['CursorItemOptionTask', 'OrgTreeTask'], chartDiag.orgChart.CursorItemTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('CursorNeighboursTask', ['CursorItemTask', 'VisualTreeTask'], chartDiag.orgChart.CursorNeighboursTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('SelectedItemsTask', ['SelectedItemsOptionTask'], chartDiag.orgChart.SelectedItemsTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('SelectionPathItemsTask', ['VisualTreeTask', 'CursorItemTask', 'SelectedItemsTask', 'CursorSelectionPathModeOptionTask'], chartDiag.orgChart.SelectionPathItemsTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);

		tasks.addTask('NormalVisibilityItemsByForegroundShapeAnnotationTask', ['ForegroundShapeAnnotationOptionTask'], chartDiag.orgChart.NormalVisibilityItemsByAnnotationTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('NormalVisibilityItemsByBackgroundShapeAnnotationTask', ['BackgroundShapeAnnotationOptionTask'], chartDiag.orgChart.NormalVisibilityItemsByAnnotationTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('NormalVisibilityItemsByBackgroundAnnotationTask', ['BackgroundAnnotationOptionTask'], chartDiag.orgChart.NormalVisibilityItemsByAnnotationTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('NormalVisibilityItemsByHighlightPathAnnotationTask', ['HighlightPathAnnotationOptionTask'], chartDiag.orgChart.NormalVisibilityItemsByAnnotationTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('NormalVisibilityItemsByForegroundConnectorAnnotationTask', ['ForegroundConnectorAnnotationOptionTask'], chartDiag.orgChart.NormalVisibilityItemsByConnectorAnnotationTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('NormalVisibilityItemsByBackgroundConnectorAnnotationTask', ['BackgroundConnectorAnnotationOptionTask'], chartDiag.orgChart.NormalVisibilityItemsByConnectorAnnotationTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('CombinedNormalVisibilityItemsTask', [
			'ItemsSizesOptionTask',
			'CursorItemTask',
			'CursorNeighboursTask',
			'SelectedItemsTask',
			'SelectionPathItemsTask',
			'NormalVisibilityItemsByForegroundShapeAnnotationTask',
			'NormalVisibilityItemsByBackgroundShapeAnnotationTask',
			'NormalVisibilityItemsByBackgroundAnnotationTask',
			'NormalVisibilityItemsByHighlightPathAnnotationTask',
			'NormalVisibilityItemsByForegroundConnectorAnnotationTask',
			'NormalVisibilityItemsByBackgroundConnectorAnnotationTask'], chartDiag.orgChart.CombinedNormalVisibilityItemsTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);

		tasks.addTask('ItemsPositionsTask', ['CurrentControlSizeTask', 'ScaleOptionTask', 'OrientationOptionTask', 'ItemsSizesOptionTask', 'ConnectorsOptionTask', 'VisualTreeOptionTask',
			'ExtraPartnersTask',
			'IntervalsTask', 'VisualTreeTask', 'VisualTreeLevelsTask', 'VisualTreeMarginsTask', 
			'ItemTemplateParamsTask',
			'CursorItemTask', 'CombinedNormalVisibilityItemsTask'], chartDiag.orgChart.ItemsPositionsTask, "#ff0000"/*chartDiag.default.Colors.Red*/);

		tasks.addTask('AlignDiagramTask', ['OrientationOptionTask', 'ItemsSizesOptionTask', 'VisualTreeOptionTask', 'ScaleOptionTask', 'PrintPreviewOptionTask', 'CurrentControlSizeTask', 'VisualTreeTask', 'VisualTreeLevelsTask', 'ItemsPositionsTask', 'isFamilyChartMode'], chartDiag.orgChart.AlignDiagramTask, "#ff0000"/*chartDiag.default.Colors.Red*/);
		tasks.addTask('CreateTransformTask', ['OrientationOptionTask', 'AlignDiagramTask'], chartDiag.orgChart.CreateTransformTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('CenterOnCursorTask', ['layout', 'CurrentControlSizeTask', 'CurrentScrollPositionTask', 'CursorItemTask', 'AlignDiagramTask', 'CreateTransformTask', 'ScaleOptionTask'], chartDiag.orgChart.CenterOnCursorTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);

		// Managers
		tasks.addTask('BackgroundAnnotationManagerTask', ['ItemsSizesOptionTask', 'OrgTreeTask', 'VisualTreeLevelsTask', 'AlignDiagramTask'], chartDiag.orgChart.BackgroundAnnotationManagerTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('PaletteManagerTask', ['ConnectorsOptionTask', 'null'], chartDiag.orgChart.PaletteManagerTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);

		// Apply Layout Changes
		tasks.addTask('ApplyLayoutChangesTask', ['graphics', 'layout', 'ItemsSizesOptionTask', 'PrintPreviewOptionTask', 'CurrentControlSizeTask', 'ScaleOptionTask', 'AlignDiagramTask'], chartDiag.orgChart.ApplyLayoutChangesTask, "#008000"/*chartDiag.default.Colors.Green*/);

		// Renders
		tasks.addTask('DrawBackgroundAnnotationTask', ['graphics', 'CreateTransformTask', 'ApplyLayoutChangesTask', 'BackgroundAnnotationOptionTask', 'VisualTreeTask', 'AlignDiagramTask', 'BackgroundAnnotationManagerTask'], chartDiag.orgChart.DrawBackgroundAnnotationTask, "#008000"/*chartDiag.default.Colors.Green*/);
		tasks.addTask('DrawForegroundConnectorAnnotationTask', ['graphics', 'CreateTransformTask', 'ApplyLayoutChangesTask', 'OrientationOptionTask', 'ForegroundConnectorAnnotationOptionTask', 'AlignDiagramTask', 'AnnotationLabelTemplateTask', 'foreground'], chartDiag.orgChart.DrawConnectorAnnotationTask, "#008000"/*chartDiag.default.Colors.Green*/);
		tasks.addTask('DrawBackgroundConnectorAnnotationTask', ['graphics', 'CreateTransformTask', 'ApplyLayoutChangesTask', 'OrientationOptionTask', 'BackgroundConnectorAnnotationOptionTask', 'AlignDiagramTask', 'AnnotationLabelTemplateTask', 'background'], chartDiag.orgChart.DrawConnectorAnnotationTask, "#008000"/*chartDiag.default.Colors.Green*/);
		tasks.addTask('DrawForegroundShapeAnnotationTask', ['graphics', 'CreateTransformTask', 'ApplyLayoutChangesTask', 'OrientationOptionTask', 'ForegroundShapeAnnotationOptionTask', 'AlignDiagramTask', 'AnnotationLabelTemplateTask', 'foreground'], chartDiag.orgChart.DrawShapeAnnotationTask, "#008000"/*chartDiag.default.Colors.Green*/);
		tasks.addTask('DrawBackgroundShapeAnnotationTask', ['graphics', 'CreateTransformTask', 'ApplyLayoutChangesTask', 'OrientationOptionTask', 'BackgroundShapeAnnotationOptionTask', 'AlignDiagramTask', 'AnnotationLabelTemplateTask', 'background'], chartDiag.orgChart.DrawShapeAnnotationTask, "#008000"/*chartDiag.default.Colors.Green*/);

		tasks.addTask('DrawCursorTask', ['graphics', 'CreateTransformTask', 'ApplyLayoutChangesTask', 'CombinedContextsTask', 'AlignDiagramTask', 'ItemTemplateParamsTask', 'CursorItemTask', 'SelectedItemsTask'], chartDiag.orgChart.DrawCursorTask, "#008000"/*chartDiag.default.Colors.Green*/);
		tasks.addTask('DrawHighlightTask', ['graphics', 'CreateTransformTask', 'ApplyLayoutChangesTask', 'CombinedContextsTask', 'AlignDiagramTask', 'ItemTemplateParamsTask', 'HighlightItemTask', 'CursorItemTask', 'SelectedItemsTask'], chartDiag.orgChart.DrawHighlightTask, "#008000"/*chartDiag.default.Colors.Green*/);
		tasks.addTask('DrawHighlightAnnotationTask', ['layout', 'graphics', 'CreateTransformTask', 'ApplyLayoutChangesTask', 'ScaleOptionTask', 'CombinedContextsTask', 'CalloutOptionTask', 'ReadTemplatesTask', 'AlignDiagramTask', 'CenterOnCursorTask', 'HighlightItemTask', 'CursorItemTask', 'SelectedItemsTask'], chartDiag.orgChart.DrawHighlightAnnotationTask, "#008000"/*chartDiag.default.Colors.Green*/);

		tasks.addTask('DrawTreeItemsTask', ['graphics', 'CreateTransformTask', 'ApplyLayoutChangesTask',
			'ItemsSizesOptionTask',
			'CombinedContextsTask',
			'VisualTreeTask', 'AlignDiagramTask', 'ItemTemplateParamsTask',
			'CursorItemTask', 'SelectedItemsTask',
			'GroupTitleTemplateTask', 'CheckBoxTemplateTask', 'ButtonsTemplateTask'
		], chartDiag.orgChart.DrawTreeItemsTask, "#008000"/*chartDiag.default.Colors.Green*/);

		tasks.addTask('DrawMinimizedItemsTask', ['graphics', 'CreateTransformTask', 'ApplyLayoutChangesTask', 'MinimizedItemsOptionTask', 'VisualTreeTask', 'ItemTemplateParamsTask', 'AlignDiagramTask'], chartDiag.orgChart.DrawMinimizedItemsTask, "#008000"/*chartDiag.default.Colors.Green*/);
		tasks.addTask('DrawConnectorsTask', ['graphics', 'CreateTransformTask', 'ApplyLayoutChangesTask', 'ConnectorsOptionTask', 'VisualTreeTask', 'VisualTreeLevelsTask', 'AlignDiagramTask', 'TracePathAnnotationsTask', 'ExtraPartnersTask', 'showElbowDots', 'PaletteManagerTask'], chartDiag.orgChart.DrawConnectorsTask, "#008000"/*chartDiag.default.Colors.Green*/);
		tasks.addTask('DrawItemLabelsTask', ['graphics', 'CreateTransformTask', 'ApplyLayoutChangesTask', 'LabelsOptionTask', 'VisualTreeLevelsTask', 'AlignDiagramTask'], chartDiag.orgChart.DrawItemLabelsTask, "#008000"/*chartDiag.default.Colors.Green*/);
		tasks.addTask('DrawPrintPreviewTask', ['graphics', 'ApplyLayoutChangesTask', 'PrintPreviewOptionTask', 'AlignDiagramTask', 'PrintPreviewTemplateTask', 'ScaleOptionTask'], chartDiag.orgChart.DrawPrintPreviewTask, "#008000"/*chartDiag.default.Colors.Green*/);

		return tasks;
	}

	function createEventArgs(data, oldTreeItemId, newTreeItemId, name) {
		var result = new chartDiag.orgChart.EventArgs(),
			combinedContextsTask = data.tasks.getTask("CombinedContextsTask"),
			alignDiagramTask = data.tasks.getTask("AlignDiagramTask"),
			oldItemConfig = combinedContextsTask.getConfig(oldTreeItemId),
			newItemConfig = combinedContextsTask.getConfig(newTreeItemId),
			itemPosition,
			actualPosition,
			offset,
			panelOffset;

		if (oldItemConfig && oldItemConfig.id != null) {
			result.oldContext = oldItemConfig;
		}

		if (newItemConfig && newItemConfig.id != null) {
			result.context = newItemConfig;

			if (newItemConfig.parent !== null) {
				result.parentItem = combinedContextsTask.getConfig(newItemConfig.parent);
			}

			panelOffset = data.layout.mousePanel.offset();
			offset = data.layout.element.offset();
			itemPosition = alignDiagramTask.getItemPosition(newTreeItemId),
			result.position = new chartDiag.default.Rect(itemPosition.actualPosition)
					.translate(panelOffset.left, panelOffset.top)
					.translate(-offset.left, -offset.top);
		}

		if (name != null) {
			result.name = name;
		}

		return result;
	}

	return chartDiag.orgChart.BaseControl(element, options, createTaskManager, createEventArgs);
};

/* /algorithms/Perimeter/PerimeterItem.js*/
chartDiag.default.perimeter.Item = function (id, segments) {
	var index, len,
		segment;

	this.id = id;

	this.segments = new chartDiag.default.LinkedHashItems();

	if (segments != null) {
		for (index = 0, len = segments.length; index < len; index += 1) {
			segment = segments[index];
			this.segments.add(segment.key, segment);
		}
	}
};


/* /algorithms/Perimeter/PerimeterManager.js*/
chartDiag.default.perimeter.Manager = function (perimeterItems) {
	var perimetersHash = {}, // hash of permiter items by id
		perimetersBySegmentKey = {}; // hash of permiter items by segment id

	function add(perimeterItems) {
		var index, len,
			perimeterItem;

		for (index = 0, len = perimeterItems.length; index < len; index += 1) {
			perimeterItem = perimeterItems[index];

			perimetersHash[perimeterItem.id] = perimeterItem;

			perimeterItem.segments.iterate(function (item) {
				perimetersBySegmentKey[item.key] = perimeterItem;
			}); //ignore jslint
		}
	}

	function _moveCursor(segments, cursorSegment) {
		var result = segments.nextKey(cursorSegment.key),
			nextKey;

		while (cursorSegment != null && cursorSegment.oppositeKey == (nextKey = (result || segments.startKey()))) {

			if (result != null) {
				result = segments.nextKey(result);
			}

			segments.remove(cursorSegment.key);
			segments.remove(nextKey);

			cursorSegment = segments.item(result != null ? segments.prevKey(result) : segments.endKey());
		}

		return result;
	}

	function getMergedPerimeters(items) {
		var result = [], // array of merged Perimeter Items
			itemsToMerge = {}, // hash contains PerimeterItem.id merged into output array of Perimeter Items
			index, len,
			item,
			targetPerimeter, perimeter, cursor,
			cursorSegment, adjadjacentPerimeter;

		for (index = 0, len = items.length; index < len; index += 1) {
			item = items[index];
			itemsToMerge[item] = !perimetersHash.hasOwnProperty(item);
		}

		for (index = 0, len = items.length; index < len; index += 1) {
			item = items[index];

			if (!itemsToMerge[item]) {
				itemsToMerge[item] = true;

				targetPerimeter = new chartDiag.default.perimeter.Item(item);

				// Copy first perimeter to target
				perimeter = perimetersHash[item];
				perimeter.segments.iterate(function (segment) {
					targetPerimeter.segments.add(segment.key, segment);
				}); //ignore jslint

				result.push(targetPerimeter);


				// Create cursor and scan target perimeter segments
				cursor = targetPerimeter.segments.startKey();
				while (cursor != null) {
					cursorSegment = targetPerimeter.segments.item(cursor);

					if (perimetersBySegmentKey.hasOwnProperty(cursorSegment.oppositeKey)) {
						adjadjacentPerimeter = perimetersBySegmentKey[cursorSegment.oppositeKey];

						if (itemsToMerge.hasOwnProperty(adjadjacentPerimeter.id) && !itemsToMerge[adjadjacentPerimeter.id]) {
							itemsToMerge[adjadjacentPerimeter.id] = true;

							adjadjacentPerimeter.segments.iterateBack(function (segment) {
								if (segment.key != cursorSegment.oppositeKey) {
									targetPerimeter.segments.insertAfter(cursor, segment.key, segment);
								}
							}, cursorSegment.oppositeKey, null); //ignore jslint

							adjadjacentPerimeter.segments.iterateBack(function (segment) {
								targetPerimeter.segments.insertAfter(cursor, segment.key, segment);
							}, null, cursorSegment.oppositeKey); //ignore jslint
						}
					}
					cursor = _moveCursor(targetPerimeter.segments, cursorSegment);
				}
			}
		}
		return result;
	}

	if (perimeterItems != null) {
		add(perimeterItems);
	}

	return {
		add: add,
		getMergedPerimeters: getMergedPerimeters
	};
};


/* /algorithms/Perimeter/PerimeterSegmentItem.js*/
chartDiag.default.perimeter.SegmentItem = function (arg0, arg1, arg2, arg3) {
	this.fromPoint = null;
	this.toPoint = null;

	switch (arguments.length) {
		case 2:
			this.fromPoint = arg0;
			this.toPoint = arg1;
			break;
		case 4:
			this.fromPoint = new chartDiag.default.Point(arg0, arg1);
			this.toPoint = new chartDiag.default.Point(arg2, arg3);
			break;
		default:
			break;
	}

	var fromKey = this.fromPoint.toString(),
		toKey = this.toPoint.toString();

	if (fromKey == toKey) {
		throw "Null length segment!";
	}

	this.key = fromKey + ' - ' + toKey;
	this.oppositeKey = toKey + ' - ' + fromKey;

	this.orientationType = null;
	if (this.fromPoint.y > this.toPoint.y) {
		this.orientationType = 3/*chartDiag.default.OrientationType.Right*/;
	} else if (this.fromPoint.y < this.toPoint.y) {
		this.orientationType = 2/*chartDiag.default.OrientationType.Left*/;
	} else if (this.fromPoint.x > this.toPoint.x) {
		this.orientationType = 0/*chartDiag.default.OrientationType.Top*/;
	} else {
		this.orientationType = 1/*chartDiag.default.OrientationType.Bottom*/;
	}
};


/* /algorithms/algorithms.js*/
/*
	Function: chartDiag.default.mergeSort
		Merges array of sorted arrays into one using call back function for comparison.
	
	Parameters:
		arrays - Array of sorted arrays of objects.
		getItemWeight - Call back function used to get items weight. 
		ignoreDuplicates - return distinct items only.

	Returns: 
		Array of merged sorted items. 
*/
chartDiag.default.mergeSort = function (arrays, getItemWeight, ignoreDuplicates) {
	var result = null,
		firstArray, secondArray, mergedArray, arrayIndex,
		firstIndex, secondIndex, firstLen, secondLen, firstItem, secondItem,
		firstItemWeight, secondItemWeight,
		currentValue;

	switch (arrays.length) {
		case 0:
			result = [];
			break;
		default:
			firstArray = [];
			for (arrayIndex = 0; arrayIndex < arrays.length; arrayIndex += 1) {
				secondArray = arrays[arrayIndex];
				mergedArray = [];

				firstLen = firstArray.length;
				secondLen = secondArray.length;

				firstIndex = 0;
				secondIndex = 0;

				firstItem = null;
				firstItemWeight = null;
				secondItem = null;
				secondItemWeight = null;

				if (firstLen > 0) {
					firstItem = firstArray[firstIndex];
					firstItemWeight = !getItemWeight ? firstItem : getItemWeight(firstItem);
				}

				if (secondLen > 0) {
					secondItem = secondArray[secondIndex];
					secondItemWeight = !getItemWeight ? secondItem : getItemWeight(secondItem);
				}
				currentValue = null;
				while (firstIndex < firstLen || secondIndex < secondLen) {

					if (firstIndex >= firstLen) {
						if (!ignoreDuplicates || currentValue != secondItem) {
							mergedArray.push(secondItem);
							currentValue = secondItem;
						}
						secondIndex += 1;

						
						if (secondIndex < secondLen) {
							secondItem = secondArray[secondIndex];
							secondItemWeight = !getItemWeight ? secondItem : getItemWeight(secondItem);
						}
					} else {
						if (secondIndex >= secondLen) {
							if (!ignoreDuplicates || currentValue != firstItem) {
								mergedArray.push(firstItem);
								currentValue = firstItem;
							}
							firstIndex += 1;

							
							if (firstIndex < firstLen) {
								firstItem = firstArray[firstIndex];
								firstItemWeight = !getItemWeight ? firstItem : getItemWeight(firstItem);
							}
						} else {
							if (firstItemWeight < secondItemWeight) {
								if (!ignoreDuplicates || currentValue != firstItem) {
									mergedArray.push(firstItem);
									currentValue = firstItem;
								}
								firstIndex += 1;

								if (firstIndex < firstLen) {
									firstItem = firstArray[firstIndex];
									firstItemWeight = !getItemWeight ? firstItem : getItemWeight(firstItem);
								}
							} else {
								if (!ignoreDuplicates || currentValue != secondItem) {
									mergedArray.push(secondItem);
									currentValue = secondItem;
								}
								secondIndex += 1;
								
								if (secondIndex < secondLen) {
									secondItem = secondArray[secondIndex];
									secondItemWeight = !getItemWeight ? secondItem : getItemWeight(secondItem);
								}
							}
						}
					}
				}
				firstArray = mergedArray;
			}
			result = firstArray;
			break;
	}
	return result;
};

/*
	Function: chartDiag.default.binarySearch
		Search sorted list of elements for nearest item.
	
	Parameters:
		items - Array of elements.
		funcDistance - Call back function used to get ditance for current item. 

	Returns: 
		Nearest item.
*/
chartDiag.default.binarySearch = function (items, funcDistance) {
	var result = null,
		distance,
		bestDistance,
		minimum = 0,
		maximum = items.length - 1,
		middle,
		item;

	if (items.length > 0) {
		result = items[minimum];
		distance = funcDistance(result);
		if (distance > 0) {
			bestDistance = Math.abs(distance);

			item = items[maximum];
			distance = funcDistance(item);
			if (distance >= 0) {
				result = item;
			} else {
				distance = Math.abs(distance);
				if (bestDistance > distance) {
					bestDistance = distance;
					result = item;
				}
				while (minimum + 1 < maximum) {
					middle = Math.round((minimum + maximum) / 2.0);
					item = items[middle];
					distance = funcDistance(item);
					if (distance === 0) {
						result = item;
						break;
					} else {
						if (distance > 0) {
							minimum = middle;
						} else {
							maximum = middle;
						}
						distance = Math.abs(distance);
						if (bestDistance > distance) {
							bestDistance = distance;
							result = item;
						}
					}
				}
			}
		}
	}
	return result;
};

/* /algorithms/family.js*/
chartDiag.default.family = function (source) {
	var _roots = {},     // children hash of orphant parent id
		_rootsCount = {},
		_children = {},  // children hash by node id
		_childrenCount = {},
		_parents = {},   // parents hash by node id
		_parentsCount = {},
		_nodes = {},     // nodes by node id
		BREAK = 1,
		SKIP = 2;
	
	_init(source);

	function _init(source) {
		if (chartDiag.default.isObject(source)) {
			_roots = chartDiag.default.cloneObject(source.roots, false);
			_rootsCount = chartDiag.default.cloneObject(source.rootsCount, true);
			_children = chartDiag.default.cloneObject(source.children, false);
			_childrenCount = chartDiag.default.cloneObject(source.childrenCount, true);
			_parents = chartDiag.default.cloneObject(source.parents, false);
			_parentsCount = chartDiag.default.cloneObject(source.parentsCount, true);
			_nodes = chartDiag.default.cloneObject(source.nodes, true);
		}
	}

	function _loop(thisArg, collection, itemid, onItem) {
		var item, items;
		if (onItem != null) {
			items = collection[itemid];
			if (items != null) {
				for (item in items) {
					if (items.hasOwnProperty(item)) {
						if (onItem.call(thisArg, item)) {
							break;
						}
					}
				}
			}
		}
	}

	function add(parents, nodeid, node) {
		var index, len,
			parentid,
			processed = {};

		if (!parents || parents.length === 0) {
			parents = [null];
		}

		if (_nodes[nodeid] == null && node != null) {
			_nodes[nodeid] = node;
			for (index = 0, len = parents.length; index < len; index += 1) {
				parentid = parents[index];


				if (processed[parentid] == null && parentid != nodeid) {
					processed[parentid] = true;
					if (_nodes[parentid] != null) {
						if (_parents[nodeid] == null) {
							_parents[nodeid] = {};
							_parentsCount[nodeid] = 0;
						}
						if (!_parents[nodeid][parentid]) {
							_parents[nodeid][parentid] = true;
							_parentsCount[nodeid] += 1;
						}

						if (_children[parentid] == null) {
							_children[parentid] = {};
							_childrenCount[parentid] = 0;
						}
						if (!_children[parentid][nodeid]) {
							_children[parentid][nodeid] = true;
							_childrenCount[parentid] += 1;
						}
					} else {
						if (_roots[parentid] == null) {
							_roots[parentid] = {};
							_rootsCount[parentid] = 0;
						}
						if (!_roots[parentid][nodeid]) {
							_roots[parentid][nodeid] = true;
							_rootsCount[parentid] += 1;
						}
					}
				}
			}
			if (_roots[nodeid] != null) {
				_children[nodeid] = _roots[nodeid];
				_childrenCount[nodeid] = _rootsCount[nodeid];
				delete _roots[nodeid];
				delete _rootsCount[nodeid];
				_loop(this, _children, nodeid, function (itemid) {
					if (_parents[itemid] == null) {
						_parents[itemid] = {};
						_parentsCount[itemid] = 0;
					}
					if (!_parents[itemid][nodeid]) {
						_parents[itemid][nodeid] = true;
						_parentsCount[itemid] += 1;
					}
				});
			}
		}
	}

	function node(nodeid) {
		return _nodes[nodeid];
	}

	function adopt(parents, nodeid) {
		var index, len,
			parentid;
		if (_nodes[nodeid] != null) {
			for (index = 0, len = parents.length; index < len; index += 1) {
				parentid = parents[index];

				if (_parents[nodeid] == null) {
					_parents[nodeid] = {};
					_parentsCount[nodeid] = 0;
				}

				if (parentid != nodeid && _nodes[parentid] != null) {
					if (!_parents[nodeid][parentid]) {
						_parents[nodeid][parentid] = true;
						_parentsCount[nodeid] += 1;
					}

					if (_children[parentid] == null) {
						_children[parentid] = {};
						_childrenCount[parentid] = 0;
					}
					if (!_children[parentid][nodeid]) {
						_children[parentid][nodeid] = true;
						_childrenCount[parentid] += 1;
					}
				} else {
					throw "Item cannot be parent of itself and parent should exist in the structure!";
				}
			}
		} else {
			throw "Child should be in hierarchy!";
		}
	}

	function removeNode(nodeid) {
		if (_nodes[nodeid] != null) {
			_loop(this, _children, nodeid, function (itemid) {
				delete _parents[itemid][nodeid];
				_parentsCount[itemid] -= 1;

				if (!_parentsCount[itemid]) {
					delete _parents[itemid];
					delete _parentsCount[itemid];

					if (_roots[null] == null) {
						_roots[null] = {};
						_rootsCount[null] = 0;
					}
					if (!_roots[null][itemid]) {
						_roots[null][itemid] = true;
						_rootsCount[null] += 1;
					}
				}
			});
			_loop(this, _parents, nodeid, function (itemid) {
				delete _children[itemid][nodeid];
				_childrenCount[itemid] -= 1;
				if (!_childrenCount[itemid]) {
					delete _children[itemid];
					delete _childrenCount[itemid];
				}
			});
			if (_roots[null] != null && _roots[null][nodeid] != null) {
				delete _roots[null][nodeid];
				_rootsCount[null] -= 1;

				if (!_rootsCount[null]) {
					delete _roots[null];
					delete _rootsCount[null];
				}
			}
			delete _children[nodeid];
			delete _childrenCount[nodeid];
			delete _parents[nodeid];
			delete _parentsCount[nodeid];
			delete _nodes[nodeid];
		}
	}

	function _removeChildReference(parentid, childid) {
		var result = false;
		if (_children[parentid] != null && _children[parentid][childid] != null) {
			delete _children[parentid][childid];
			_childrenCount[parentid] -= 1;

			delete _parents[childid][parentid];
			_parentsCount[childid] -= 1;

			if (!_childrenCount[parentid]) {
				delete _children[parentid];
				delete _childrenCount[parentid];
			}

			if (!_parents[childid]) {
				delete _parents[childid];
				delete _parentsCount[childid];

				if (_roots[null] == null) {
					_roots[null] = {};
					_rootsCount[null] = 0;
				}
				_roots[null][childid] = true;
				_rootsCount[null] += 1;
			}
			result = true;
		}
		return result;
	}

	function removeRelation(fromid, toid) {
		var result = false;
		if (_nodes[fromid] != null && _nodes[toid] != null) {
			result = _removeChildReference(fromid, toid) || _removeChildReference(toid, fromid);
		}
		return result;
	}

	function hasNodes() {
		return !chartDiag.default.isEmptyObject(_nodes);
	}

	function loop(thisArg, onItem) {
		var item;
		if (onItem != null) {
			for (item in _nodes) {
				if (_nodes.hasOwnProperty(item)) {
					if (onItem.call(thisArg, item, _nodes[item])) {
						break;
					}
				}
			}
		}
	}

	function _loopItems(thisArg, collection, items, onItem) { // onItem(itemid, item, levelIndex)
		var newItems, itemid,
			processed = {},
			levelIndex = 0,
			hasItems = true;


		while (hasItems) {
			newItems = {};
			hasItems = false;

			for (itemid in items) {
				if (items.hasOwnProperty(itemid)) {
					if (!processed[itemid]) {
						processed[itemid] = true;

						switch (onItem.call(thisArg, itemid, _nodes[itemid], levelIndex)) {
							case BREAK:
								newItems = {};
								hasItems = false;
								break;
							case SKIP:
								break;
							default:
								_loop(this, collection, itemid, function (newItemId) {
									if (!processed[newItemId]) {
										newItems[newItemId] = true;
										hasItems = true;
									}
								}); //ignore jslint
								break;
						}
					}
				}
			}
			items = newItems;
			levelIndex += 1;
		}
	}

	function loopChildren(thisArg, nodeid, onItem) { // onItem(itemid, item, levelIndex)
		if (onItem != null) {
			if (nodeid != null && _nodes[nodeid] != null && _children[nodeid] != null) {
				_loopItems(thisArg, _children, _children[nodeid], onItem);
			}
		}
	}

	function loopParents(thisArg, nodeid, onItem) { // onItem(itemid, item, levelIndex)
		if (onItem != null) {
			if (nodeid != null && _nodes[nodeid] != null && _parents[nodeid] != null) {
				_loopItems(thisArg, _parents, _parents[nodeid], onItem);
			}
		}
	}

	function _loopTopo(thisArg, backwardCol, backwardCount, forwardCol, forwardCount, onItem) { // onItem(itemid, item, position)
		var index, len, nodeid, references,
			queue, newQueue, position;

		if (onItem != null) {
			/* count parents for every node */
			queue = [];
			references = {};
			for (nodeid in _nodes) {
				if (_nodes.hasOwnProperty(nodeid)) {
					references[nodeid] = (backwardCount[nodeid] || 0);

					if (!references[nodeid]) {
						queue.push(nodeid);
					}
				}
			}

			/* itterate queue and reduce reference counts via children */
			position = 0;
			while (queue.length > 0) {
				newQueue = [];

				for (index = 0, len = queue.length; index < len; index += 1) {
					nodeid = queue[index];

					if (onItem.call(thisArg, nodeid, _nodes[nodeid], position)) {
						newQueue = [];
						break;
					}

					position += 1;

					_loop(this, forwardCol, nodeid, function (itemid) {
						references[itemid] -= 1;
						if (references[itemid] === 0) {
							newQueue.push(itemid);
						}
					}); //ignore jslint
				}
				queue = newQueue;
			}
		}
	}

	function loopTopo(thisArg, onItem) { // onItem(itemid, item, position)
		_loopTopo(thisArg, _parents, _parentsCount, _children, _childrenCount, onItem);
	}

	function loopTopoReversed(thisArg, onItem) { // onItem(itemid, item, position)
		_loopTopo(thisArg, _children, _childrenCount, _parents, _parentsCount, onItem);
	}


	/* argument parentAligned set to true alignes nodes to top otherwise to bottom */
	function loopLevels(thisArg, parentAligned, onItem) { // onItem(itemid, item, levelIndex)
		var topoSorted = [],
			topoSortedPositions = {},
			processed = {},
			margin = [],
			/* result items distribution by levels */
			levels = {}, levelIndex,
			groups = {}, hasGroups, newGroups, groupIndex, group,
			itemsAtLevel, itemid,
			minimumLevel = null,
			loopFunc = parentAligned ? loopTopo : loopTopoReversed,
			index, len,
			mIndex, mLen, mItem, mLevel,
			topoSortedItem,
			bestPosition, bestItem, bestLevel, bestIsParent,
			newMargin, hasNeighbours;

		function Group() {
			this.items = {};
			this.minimumLevel = null;
		}

		Group.prototype.addItemToLevel = function (itemid, level) {
			var items = this.items[level];
			if (!items) {
				items = [itemid];
				this.items[level] = items;
			} else {
				items.push(itemid);
			}
			this.minimumLevel = this.minimumLevel == null ? level : Math.min(this.minimumLevel, level);
		};

		function addItemToLevel(itemid, index, level) {
			var group = groups[index];
			if (!group) {
				group = new Group();
				groups[index] = group;
			}

			group.addItemToLevel(itemid, level);

			minimumLevel = minimumLevel == null ? level : Math.min(minimumLevel, level);

			levels[itemid] = level;
			processed[itemid] = true;
		}


		if (onItem != null) {
			/* sort items topologically */
			loopFunc(this, function (itemid, item, position) {
				topoSorted.push(itemid);
				topoSortedPositions[itemid] = position;
			});

			/* search for the first available non processed item in topological order */
			for (index = 0, len = topoSorted.length; index < len; index += 1) {
				topoSortedItem = topoSorted[index];
				if (processed[topoSortedItem] == null) {
					margin.push(topoSortedItem);

					addItemToLevel(topoSortedItem, index, 0);

					/* use regular graph breadth first search */
					while (margin.length > 0) {
						bestPosition = null;
						bestItem = null;
						bestLevel = null;
						bestIsParent = !parentAligned;
						newMargin = [];
						for (mIndex = 0, mLen = margin.length; mIndex < mLen; mIndex += 1) {
							mItem = margin[mIndex];
							mLevel = levels[mItem];
							hasNeighbours = false;

							if (parentAligned) {
								_loop(this, _parents, mItem, function (parentid) {
									var topoSortedPosition;
									if (!processed[parentid]) {
										hasNeighbours = true;
										topoSortedPosition = topoSortedPositions[parentid];
										if (bestPosition == null || !bestIsParent || bestPosition < topoSortedPosition || (bestPosition == topoSortedPosition && bestLevel > mLevel - 1)) {
											bestPosition = topoSortedPosition;
											bestItem = parentid;
											bestLevel = mLevel - 1;
											bestIsParent = true;
										}
									}
								}); //ignore jslint
								_loop(this, _children, mItem, function (childid) {
									var topoSortedPosition;
									if (!processed[childid]) {
										hasNeighbours = true;
										topoSortedPosition = topoSortedPositions[childid];
										if (bestPosition == null || (!bestIsParent && (bestPosition > topoSortedPosition || (bestPosition == topoSortedPosition && bestLevel < mLevel + 1)))) {
											bestPosition = topoSortedPosition;
											bestItem = childid;
											bestLevel = mLevel + 1;
											bestIsParent = false;
										}
									}
								}); //ignore jslint
							} else {
								_loop(this, _children, mItem, function (childid) {
									var topoSortedPosition;
									if (!processed[childid]) {
										hasNeighbours = true;
										topoSortedPosition = topoSortedPositions[childid];
										if (bestPosition == null || bestIsParent || bestPosition < topoSortedPosition || (bestPosition == topoSortedPosition && bestLevel < mLevel + 1)) {
											bestPosition = topoSortedPosition;
											bestItem = childid;
											bestLevel = mLevel + 1;
											bestIsParent = false;
										}
									}
								}); //ignore jslint
								_loop(this, _parents, mItem, function (parentid) {
									var topoSortedPosition;
									if (!processed[parentid]) {
										hasNeighbours = true;
										topoSortedPosition = topoSortedPositions[parentid];
										if (bestPosition == null || (bestIsParent && (bestPosition > topoSortedPosition || (bestPosition == topoSortedPosition && bestLevel > mLevel - 1)))) {
											bestPosition = topoSortedPosition;
											bestItem = parentid;
											bestLevel = mLevel - 1;
											bestIsParent = true;
										}
									}
								}); //ignore jslint
							}
							if (hasNeighbours) {
								newMargin.push(mItem);
							}
						}
						if (bestItem != null) {
							newMargin.push(bestItem);

							addItemToLevel(bestItem, index, bestLevel);
						}
						margin = newMargin;
					}
				}
			}

			hasGroups = true;
			levelIndex = minimumLevel;
			while (hasGroups) {
				newGroups = {};
				hasGroups = false;
				for (groupIndex in groups) {
					if (groups.hasOwnProperty(groupIndex)) {
						group = groups[groupIndex];
						itemsAtLevel = group.items[(group.minimumLevel - minimumLevel) + levelIndex];
						if (itemsAtLevel != null) {
							newGroups[groupIndex] = group;
							hasGroups = true;

							for (index = 0, len = itemsAtLevel.length; index < len; index += 1) {
								itemid = itemsAtLevel[index];
								if (onItem.call(thisArg, itemid, _nodes[itemid], levelIndex - minimumLevel)) {
									hasGroups = false;
									return true;
								}
							}
						}
					}
				}
				groups = newGroups;
				levelIndex += 1;
			}
		}
	}

	function loopRoots(thisArg, onItem) { // onItem(itemid, item)
		var result = null,
			minimum, counter = 0,
			famMembers = {},
			famCount = {},
			isRoot,
			roots = {},
			processed = {},
			famItemId, member, members, rootid,
			membersRoots, memberRoots, memberRoot,
			index, len;

		loopTopoReversed(this, function (famItemId, famItem, position) {
			/* every node has at least itself in members */
			if (!famMembers.hasOwnProperty(famItemId)) {
				famMembers[famItemId] = {};
				famCount[famItemId] = 0;
			}
			famMembers[famItemId][famItemId] = true;
			famCount[famItemId] += 1;

			isRoot = true;
			loopParents(this, famItem.id, function (parentid, parent, levelIndex) {
				var items, itemid;
				isRoot = false;
				if (!famMembers.hasOwnProperty(parentid)) {
					famMembers[parentid] = {};
					famCount[parentid] = 0;
				}
				/* push famItem members to parent members collection */
				if (!famCount[parentid] && _parentsCount[famItemId] == 1) {
					famMembers[parentid] = famMembers[famItemId];
					famCount[parentid] = famCount[famItemId];
				} else {
					items = famMembers[famItemId];
					for (itemid in items) {
						if (items.hasOwnProperty(itemid)) {
							if (!famMembers[parentid][itemid]) {
								famMembers[parentid][itemid] = true;
								famCount[parentid] += 1;
							}
						}
					}
				}
				return SKIP;
			});
			if (isRoot) {
				roots[famItemId] = true;
				counter += 1;


			}
		});

		/* create collection of roots per member */
		membersRoots = {};
		for (rootid in roots) {
			if (roots.hasOwnProperty(rootid)) {
				members = famMembers[rootid];

				for (member in members) {
					if (members.hasOwnProperty(member)) {

						if (!membersRoots[member]) {
							membersRoots[member] = [];
						}
						membersRoots[member].push(rootid.toString());
					}
				}
			}
		}

		/* loop minimal sub tree roots */
		while (counter > 0) {
			minimum = null;
			for (famItemId in roots) {
				if (roots.hasOwnProperty(famItemId)) {
					if (!minimum || famCount[famItemId] < minimum) {
						minimum = famCount[famItemId];
						result = famItemId;
					}
				}
			}
			if (result != null) {
				if (onItem != null) {
					onItem.call(thisArg, result, _nodes[result]);
				}
				members = famMembers[result];

				for (member in members) {
					if (members.hasOwnProperty(member)) {
						if (!processed[member]) {
							memberRoots = membersRoots[member];
							for (index = 0, len = memberRoots.length; index < len; index += 1) {
								memberRoot = memberRoots[index];
								famCount[memberRoot] -= 1;
							}
							processed[member] = true;
						}
					}
				}

				delete roots[result];
				counter -= 1;
			}
		}
	}

	function findLargestRoot() {
		var result = null,
			maximum,
			famMembers = {},
			famCount = {},
			isRoot;

		maximum = null;

		loopTopoReversed(this, function (famItemId, famItem, position) {
			/* every node has at least itself in members */
			if (!famMembers.hasOwnProperty(famItemId)) {
				famMembers[famItemId] = {};
				famCount[famItemId] = 0;
			}
			famMembers[famItemId][famItemId] = true;
			famCount[famItemId] += 1;

			isRoot = true;
			loopParents(this, famItem.id, function (parentid, parent, levelIndex) {
				var items, itemid;
				isRoot = false;
				if (!famMembers.hasOwnProperty(parentid)) {
					famMembers[parentid] = {};
					famCount[parentid] = 0;
				}
				/* push famItem members to parent members collection */
				if (!famCount[parentid] && _parentsCount[famItemId] == 1) {
					famMembers[parentid] = famMembers[famItemId];
					famCount[parentid] = famCount[famItemId];
				} else {
					items = famMembers[famItemId];
					for (itemid in items) {
						if (items.hasOwnProperty(itemid)) {
							famMembers[parentid][itemid] = true;
							famCount[parentid] += 1;
						}
					}
				}
				return SKIP;
			});
			if (isRoot && (!maximum || famCount[famItemId] > maximum)) {
				maximum = famCount[famItemId];
				result = famItemId;
			}

		});

		return result;
	}

	/* common child should belong only to the given collection of parents, */
	/* if child's parents don't match given parents, it is not considered as common child */
	function hasCommonChild(parents) {
		var result = false,
			parentsHash, childrenHash,
			parentsCount,
			pIndex, pLen,
			parent, child;

		/* convert parents collection to hash, remove duplicates and ignore non-existing items */
		parentsHash = {};
		parentsCount = 0;
		for (pIndex = 0, pLen = parents.length; pIndex < pLen; pIndex += 1) {
			parent = parents[pIndex];
			if (_nodes[parent] != null && !parentsHash[parent]) {
				parentsHash[parent] = true;
				parentsCount += 1;
			}
		}

		/* collect number of parents referencing each child */
		childrenHash = {};
		for (parent in parentsHash) {
			if (parentsHash.hasOwnProperty(parent)) {
				_loop(this, _children, parent, function (child) {
					if (!childrenHash[child]) {
						childrenHash[child] = 1;
					} else {
						childrenHash[child] += 1;
					}
				}); //ignore jslint
			}
		}

		/* find common child having number of references equal to number of existing parents */
		for (child in childrenHash) {
			if (childrenHash.hasOwnProperty(child)) {
				if (_parents[child] != null && (_parentsCount[child] || 0) == childrenHash[child] && childrenHash[child] == parentsCount) {
					result = true;
					break;
				}
			}
		}

		return result;
	}

	function _bundleNodes(fromItem, items, bundleItemId, bundleItem, backwardCol, backwardCount, forwardCol, forwardCount, checkChildren) {
		var isValid = false,
			index, len,
			child;

		if (_nodes[fromItem] != null && forwardCol[fromItem] != null) {
			/* validate target items */
			isValid = true;
			if (checkChildren) {
				/* if we add new bundle all items should present */
				for (index = 0, len = items.length; index < len; index += 1) {
					child = items[index];
					if (_nodes[child] == null || forwardCol[fromItem][child] == null) {
						isValid = false;
					}
				}
			}
			if (isValid) {
				if (bundleItem != null) {
					/* add bundle node */
					_nodes[bundleItemId] = bundleItem;
				}

				if (_nodes[bundleItemId] != null) {
					/* update references */
					if (!backwardCol[bundleItemId]) {
						backwardCol[bundleItemId] = {};
						backwardCount[bundleItemId] = 0;
					}
					if (!forwardCol[bundleItemId]) {
						forwardCol[bundleItemId] = {};
						forwardCount[bundleItemId] = 0;
					}

					if (!backwardCol[bundleItemId][fromItem]) {
						backwardCol[bundleItemId][fromItem] = true;
						backwardCount[bundleItemId] += 1;
					}

					if (!forwardCol[fromItem][bundleItemId]) {
						forwardCol[fromItem][bundleItemId] = true;
						forwardCount[fromItem] += 1;
					}

					for (index = 0, len = items.length; index < len; index += 1) {
						child = items[index];

						if (bundleItemId != child) {
							if (forwardCol[fromItem][child] != null) {
								delete forwardCol[fromItem][child];
								forwardCount[fromItem] -= 1;
							}

							if (backwardCol[child][fromItem] != null) {
								delete backwardCol[child][fromItem];
								backwardCount[child] -= 1;
							}

							if (!backwardCol[child][bundleItemId]) {
								backwardCol[child][bundleItemId] = true;
								backwardCount[child] += 1;
							}

							if (!forwardCol[bundleItemId][child]) {
								forwardCol[bundleItemId][child] = true;
								forwardCount[bundleItemId] += 1;
							}
						}
					}
				}
			}
		}
		return isValid;
	}

	function bundleChildren(parent, children, bundleItemId, bundleItem) {
		return _bundleNodes(parent, children, bundleItemId, bundleItem, _parents, _parentsCount, _children, _childrenCount, true);
	}

	function bundleParents(child, parents, bundleItemId, bundleItem) {
		return _bundleNodes(child, parents, bundleItemId, bundleItem, _children, _childrenCount, _parents, _parentsCount, true);
	}

	function ReferenceItem() {
		this.id = "";
		this.key = "";
		this.children = [];
		this.childrenHash = {};
		this.processed = false;
	}

	function ReferencesEdge(arg0) {
		this.items = [];
		this.weight = 0;
		this.difference = 0;

		if (arguments.length > 0) {
			this.difference = arg0;
		}
	}

	function _getReferencesGraph(currentItems) {
		var result = chartDiag.default.graph(),
			item, parents,
			index1, index2, len,
			from, to, difference,
			processed = {};

		for (item in currentItems) {
			if (currentItems.hasOwnProperty(item)) {

				_loop(this, _children, item, function (child) {
					if (!processed.hasOwnProperty(child)) {
						processed[child] = true;
						/* create array of parents from hash references */
						parents = [];
						_loop(this, _parents, child, function (parent) {
							parents.push(parent);
						});

						/* create all possible combinations between items */
						for (index1 = 0, len = parents.length; index1 < len - 1; index1 += 1) {
							from = parents[index1];
							if (currentItems.hasOwnProperty(from)) {

								for (index2 = index1 + 1; index2 < len; index2 += 1) {
									to = parents[index2];
									if (currentItems.hasOwnProperty(to)) {
										difference = Math.abs(currentItems[from].children.length - currentItems[to].children.length);

										var edge = result.edge(from, to);
										if (edge == null) {
											edge = new ReferencesEdge(difference);
											result.addEdge(from, to, edge);
										}
										edge.items.push(child);
										edge.weight += 1;
									}
								}
							}
						}
					}
				}); //ignore jslint
			}
		}
		return result;
	}

	function optimizeReferences(onNewBundleItem) {
		var sharedItemsByKey = {},
			sharedItemsById = {},
			currentItems = {},
			nodeid, newReferenceItem,
			nextItems, graph, node,
			maximumTree;

		if (onNewBundleItem != null) {
			for (nodeid in _nodes) {
				if (_nodes.hasOwnProperty(nodeid)) {
					newReferenceItem = new ReferenceItem();

					_loop(this, _children, nodeid, function (child) {
						newReferenceItem.children.push(child);
						newReferenceItem.childrenHash[child] = true;
					}); //ignore jslint

					newReferenceItem.children.sort();
					newReferenceItem.id = nodeid;
					newReferenceItem.key = newReferenceItem.children.join(",");

					currentItems[newReferenceItem.id] = newReferenceItem;
				}
			}

			while (!chartDiag.default.isEmptyObject(currentItems)) {
				nextItems = {};

				graph = _getReferencesGraph(currentItems);

				for (nodeid in currentItems) {
					if (currentItems.hasOwnProperty(nodeid)) {
						node = currentItems[nodeid];

						if (!node.processed) {

							maximumTree = graph.getSpanningTree(nodeid, function (a, b) {
								if (a.weight > b.weight) {
									return 1;
								} if (a.weight == b.weight) {
									return b.difference - a.difference; //ignore jslint
								} else {
									return -1; //ignore jslint
								}
							}); //ignore jslint

							maximumTree.loopLevels(this, function (treeKey, treeKeyNode, levelid) {
								currentItems[treeKey].processed = true;

								maximumTree.loopChildren(this, treeKey, function (child, childNode) {
									var relation = graph.edge(treeKey, child),
										nextBundleItem = null, newItem,
										key, index, len,
										childrenToBind, isSharedItem;

									currentItems[child].processed = true;

									if (relation.weight > 1) {
										key = relation.items.join(',');
										if (!sharedItemsByKey.hasOwnProperty(key)) {
											newItem = onNewBundleItem();
											_nodes[newItem.id] = newItem; /* add new bundle node to the family */

											nextBundleItem = new ReferenceItem();
											nextBundleItem.id = newItem.id;
											nextBundleItem.key = key;
											for (index = 0, len = relation.items.length; index < len; index+=1) {
												nextBundleItem.children.push(relation.items[index]);
												nextBundleItem.childrenHash[relation.items[index]] = true;
											}
											nextBundleItem.children.sort();

											sharedItemsByKey[nextBundleItem.key] = nextBundleItem;
											sharedItemsById[nextBundleItem.id] = nextBundleItem;
											nextItems[nextBundleItem.id] = nextBundleItem;

											childrenToBind = nextBundleItem.children.slice(0);
											loopChildren(this, treeKeyNode.replacementItem || treeKey, function (childid, child, level) {
												if (sharedItemsById[childid] != null && !nextBundleItem.childrenHash[childid]) {

													isSharedItem = true;
													loopChildren(this, childid, function (childid, child, level) {
														if (!nextBundleItem.childrenHash[childid]) {
															isSharedItem = false;
															return BREAK;
														}
														return SKIP;
													});
													if (isSharedItem) {
														childrenToBind.push(childid);
													}
												}
												return SKIP;
											});

											_bundleNodes(treeKeyNode.replacementItem || treeKey, childrenToBind, nextBundleItem.id, newItem, _parents, _parentsCount, _children, _childrenCount, false);

											if ((_childrenCount[treeKey] || 0) <= 1) {
												treeKeyNode.replacementItem = nextBundleItem.id;
											}
										} else {
											nextBundleItem = sharedItemsByKey[key];
										}

										/* don't add shared item to itself on next items loop*/
										if (nextBundleItem.id != child) {

											childrenToBind = nextBundleItem.children.slice(0);
											loopChildren(this, childNode.replacementItem || child, function (childid, child, level) {
												if (sharedItemsById[childid] != null && !nextBundleItem.childrenHash[childid]) {

													isSharedItem = true;
													loopChildren(this, childid, function (childid, child, level) {
														if (!nextBundleItem.childrenHash[childid]) {
															isSharedItem = false;
															return BREAK;
														}
														return SKIP;
													});
													if (isSharedItem) {
														childrenToBind.push(childid);
													}
												}
												return SKIP;
											});


											_bundleNodes(childNode.replacementItem || child, childrenToBind, nextBundleItem.id, null, _parents, _parentsCount, _children, _childrenCount, false);

											/* if all items bundled then use bundle item for following transformations of references instead of original item if references graph*/
											if ((_childrenCount[child] || 0) <= 1) {
												childNode.replacementItem = nextBundleItem.id;
											}
										}
									}
								});
							}); //ignore jslint
						}
					}
				}
				currentItems = nextItems;
			}
		}
	}

	function eliminateManyToMany(onNewBundleItem) {
		var parent, bundleNode;

		for (parent in _children) {
			if (_children.hasOwnProperty(parent)) {

				if ((_childrenCount[parent] || 0) > 1) {
					_loop(this, _children, parent, function (child) {
						if ((_parentsCount[child] || 0) > 1) {
							bundleNode = onNewBundleItem();
							bundleChildren(parent, [child], bundleNode.id, bundleNode);
						}
					}); //ignore jslint
				}
			}
		}
	}

	function countChildren(parent) {
		return _childrenCount[parent] || 0;
	}

	function countParents(child) {
		return _parentsCount[child] || 0;
	}

	function firstChild(parent) {
		var result = null,
			children = _children[parent] || {};
		for (result in children) {
			if (children.hasOwnProperty(result)) {
				return result; //ignore jslint
			}
		}
		return null;
	}

	function firstParent(child) {
		var result = null,
			parents = _parents[child] || {};
		for (result in parents) {
			if (parents.hasOwnProperty(result)) {
				return result; //ignore jslint
			}
		}
		return null;
	}

	function loopNeighbours(thisArg, itemid, onItem) {
		var processed = {};

		if (onItem != null) {
			loopChildren(this, itemid, function (childid, child, childLevel) {
				if (!processed.hasOwnProperty(childid)) {
					processed[childid] = null;

					if (onItem.call(thisArg, childid, child, 1)) {
						processed[childid] = SKIP;

						loopParents(this, childid, function (parentid, parent, parentLevel) {
							if (!processed.hasOwnProperty(parentid)) {
								processed[parentid] = null;

								if (onItem.call(thisArg, parentid, parent, 2)) {
									processed[parentid] = SKIP;
								}
							}
							return processed[parentid];
						});
					}
				}
				return processed[childid];
			});

			loopParents(this, itemid, function (parentid, parent, parentLevel) {
				if (!processed.hasOwnProperty(parentid)) {
					processed[parentid] = null;

					if (onItem.call(thisArg, parentid, parent, 1)) {
						processed[parentid] = SKIP;

						loopChildren(this, parentid, function (childid, child, childLevel) {
							if (!processed.hasOwnProperty(childid)) {
								processed[childid] = true;

								if (onItem.call(thisArg, childid, child, 2)) {
									processed[childid] = SKIP;
								}
							}
							return processed[childid];
						});
					}
				}
				return processed[parentid];
			});
		}
	}

	function validate(info) {
		var parent, child;

		function _count(items) {
			var result = 0, key;
			if (items != null) {
				for (key in items) {
					if (items.hasOwnProperty(key)) {
						result += 1;
					}
				}
			}
			return result;
		}

		loop(this, function (nodeId, node) {
			_loop(this, _children, nodeId, function (child) {
				if (!_parents.hasOwnProperty(child) || !_parents[child].hasOwnProperty(nodeId)) {
					if (info != null) {
						info.message = "Child #" + child + " does not reference parent #" + nodeId;
					}
					return false;
				}
			});
			_loop(this, _parents, nodeId, function (parent) {
				if (!_children.hasOwnProperty(parent) || !_children[parent].hasOwnProperty(nodeId)) {
					if (info != null) {
						info.message = "Parent #" + parent + " does not reference child #" + nodeId;
					}
					return false;
				}
			});
		});

		for (parent in _parents) {
			if (_parents.hasOwnProperty(parent)) {
				if ((_parentsCount[parent] || 0) != _count(_parents[parent])) {
					if (info != null) {
						info.message = "Parents count for item #" + parent + " missmatch.";
					}
					return false;
				}
				if (_parents.hasOwnProperty(parent) && !_nodes.hasOwnProperty(parent)) {
					if (info != null) {
						info.message = "Orphant parents for item #" + parent;
					}
					return false;
				}
			}
		}

		for (child in _children) {
			if (_children.hasOwnProperty(child)) {
				if ((_childrenCount[child] || 0) != _count(_children[child])) {
					if (info != null) {
						info.message = "Children count for item " + child + " missmatch.";
					}
					return false;
				}
				if (_children.hasOwnProperty(child) && !_nodes.hasOwnProperty(child)) {
					if (info != null) {
						info.message = "Orphant children of item " + child;
					}
					return false;
				}
			}
		}

		for (child in _roots) {
			if (_roots.hasOwnProperty(child)) {
				if ((_rootsCount[child] || 0) != _count(_roots[child])) {
					if (info != null) {
						info.message = "Root children count for item @" + child + " missmatch.";
					}
					return false;
				}
				_loop(this, _roots, child, function (nodeid) {
					if (!_nodes.hasOwnProperty(nodeid)) {
						if (info != null) {
							info.message = "Child #" + nodeid + "of root #" + child + " does not exists.";
						}
						return false;
					}
				}); //ignore jslint
			}
		}
		
		return true;
	}

	function clone() {
		return chartDiag.default.family({
			roots: _roots,
			rootsCount: _rootsCount,
			children: _children,
			childrenCount: _childrenCount,
			parents: _parents,
			parentsCount: _parentsCount,
			nodes: _nodes
		});
	}

	/* Private objects */

	return {
		/* family structure modification */
		add: add,
		adopt: adopt,
		bundleChildren: bundleChildren,
		bundleParents: bundleParents,
		optimizeReferences: optimizeReferences,
		eliminateManyToMany: eliminateManyToMany,

		removeNode: removeNode,
		removeRelation: removeRelation,

		/* referencing and looping */
		node: node,
		loop: loop,
		loopLevels: loopLevels,
		loopTopo: loopTopo,
		loopTopoReversed: loopTopoReversed,
		loopChildren: loopChildren,
		loopParents: loopParents,
		findLargestRoot: findLargestRoot,
		loopRoots: loopRoots,
		hasNodes: hasNodes,
		hasCommonChild: hasCommonChild,
		loopNeighbours: loopNeighbours,
		countChildren: countChildren,
		countParents: countParents,
		firstParent: firstParent,
		firstChild: firstChild,

		/* force validation */
		validate: validate,
		clone: clone,

		// callback return codes
		BREAK: BREAK, // break loop immidiatly
		SKIP: SKIP // skip loop of current node children 
	};
};

/* /algorithms/graph.js*/
chartDiag.default.graph = function () {
	var _edges = {};

	function addEdge(from, to, edge) {
		if ((_edges[from] == null || _edges[from][to] == null)  && edge != null) {

			if(_edges[from] == null) {
				_edges[from] = {};
			}
			_edges[from][to] = edge;

			if (_edges[to] == null) {
				_edges[to] = {};
			}
			_edges[to][from] = edge;
		}
	}

	function edge(from, to) {
		var result = null;
		if (_edges[from] != null && _edges[from][to]) {
			result = _edges[from][to];
		}
		return result;
	}

	/*
		Function: chartDiag.default.graph.getSpanningTree
			Get maximum spanning tree. Graph may have disconnected sub graphs, so start node is nessasary.
	
		Parameters:
		startNode - The node to start searching for maximum spanning tree. Graph is not nessasary connected
		compareFunc - Call back function to compare weight of two graph edges. function(edge1, edge2)

		Returns: 
			chartDiag.default.tree structure
	*/
	function getSpanningTree(startNode, compareFunc) {
		/* Graph */
		var result = chartDiag.default.tree(),
			margin = {}, marginKey,
			itemsToRemove = [], /* if margin item has no neighbours to expand we remove it from margin*/
			hasNeighbours,
			parents = {}, /* if parent for item is set then it was laready visited */
			marginLength = 0, /* curent margin length */
			nextMarginKey,
			nextMarginWeight,
			nextMarginParent,
			neighbours, neighbourKey, neighbourWeight,
			index, len;

		/* add start node to margin */
		margin[startNode] = true;
		marginLength += 1;

		/* add startNode to result tree */
		parents[startNode] = null;
		result.add(null, startNode.toString(), {});

		/* search graph */
		while (marginLength > 0) {
			itemsToRemove = [];
			nextMarginKey = null;
			nextMarginWeight = null;
			nextMarginParent = null;
			/* itterate neighbours of every node on margin */
			for (marginKey in margin) {
				if (margin.hasOwnProperty(marginKey)) {
					neighbours = _edges[marginKey];
					hasNeighbours = false;

					for (neighbourKey in neighbours) {
						if (neighbours.hasOwnProperty(neighbourKey) && !parents.hasOwnProperty(neighbourKey)) {
							neighbourWeight = neighbours[neighbourKey];
							hasNeighbours = true;

							if (!nextMarginWeight || compareFunc(neighbourWeight, nextMarginWeight) >= 0) {
								nextMarginKey = neighbourKey;
								nextMarginWeight = neighbourWeight;
								nextMarginParent = marginKey;
							}
						}
					}

					if (!hasNeighbours) {
						itemsToRemove.push(marginKey);
					}
				}
			}

			if (nextMarginKey == null) {
				/* no items to expand to exit*/
				break;
			} else {
				margin[nextMarginKey] = true;
				marginLength += 1;
				parents[nextMarginKey] = nextMarginParent;

				/* add next margin item to resul tree */
				result.add(nextMarginParent, nextMarginKey, {});
			}

			for (index = 0, len = itemsToRemove.length; index < len; index += 1) {
				/* delete visited node from margin */
				delete margin[itemsToRemove[index]];
				marginLength -= 1;
			}
		}

		return result;
	}

	function _findStartNode(onEdgeWeight) {
		var result = null,
			fromItem, toItems, toItem,
			weight = 0,
			maxWeight = null;

		for (fromItem in _edges) {
			if (_edges.hasOwnProperty(fromItem)) {
				toItems = _edges[fromItem];

				weight = 0;
				for (toItem in toItems) {
					if (toItems.hasOwnProperty(toItem)) {
						weight += onEdgeWeight(toItems[toItem]);
					}
				}
				if (weight > maxWeight || maxWeight == null) {
					result = fromItem;
					maxWeight = weight;
				}
			}
		}
		return result;
	}

	/*
		Function: chartDiag.default.graph.getGrowthSequence
			Get graph growth sequence. The sequence of spanning tree growth.
	
		Parameters:
			onEdgeWeight - Call back function to weight edge of graph. function(edge)

		Returns: 
			Array of items. 
	*/
	function getGrowthSequence(onEdgeWeight) {
		var result = [], /* [] array of id-s */
			startNode,
			margin = {}, marginKey,
			itemsToRemove = [], /* if margin item has no neighbours to expand we remove it from margin*/
			hasNeighbours,
			processed = {}, /* if item is set then it was already visited */
			marginLength = 0, /* curent margin length */
			nextMarginKey,
			nextMarginWeight,
			bestWeight,
			neighbours, neighbourKey, neighbourWeight,
			index, len;

		if (onEdgeWeight != null) {
			startNode = _findStartNode(onEdgeWeight);

			if (startNode != null) {
				result.push(startNode);

				/* add start node to margin */
				margin[startNode] = true;
				marginLength += 1;

				/* add startNode to result tree */
				processed[startNode] = null;

				/* search graph */
				while (marginLength > 0) {
					itemsToRemove = [];
					nextMarginKey = null;
					nextMarginWeight = null;
					bestWeight = {};
					/* itterate neighbours of every node on margin */
					for (marginKey in margin) {
						if (margin.hasOwnProperty(marginKey)) {
							neighbours = _edges[marginKey];
							hasNeighbours = false;

							for (neighbourKey in neighbours) {
								if (neighbours.hasOwnProperty(neighbourKey) && !processed.hasOwnProperty(neighbourKey)) {
									neighbourWeight = onEdgeWeight(neighbours[neighbourKey]);
									hasNeighbours = true;

									if (bestWeight[neighbourKey] == null) {
										bestWeight[neighbourKey] = 0;
									}
									bestWeight[neighbourKey] += neighbourWeight;

									if (!nextMarginWeight || bestWeight[neighbourKey] > nextMarginWeight) {
										nextMarginKey = neighbourKey;
										nextMarginWeight = bestWeight[neighbourKey];
									}
								}
							}

							if (!hasNeighbours) {
								itemsToRemove.push(marginKey);
							}
						}
					}

					if (nextMarginKey == null) {
						/* no items to expand to exit*/
						break;
					} else {
						margin[nextMarginKey] = true;
						marginLength += 1;
						processed[nextMarginKey] = true;

						/* add next margin item to result sequence */
						result.push(nextMarginKey);
					}

					for (index = 0, len = itemsToRemove.length; index < len; index += 1) {
						/* delete visited node from margin */
						delete margin[itemsToRemove[index]];
						marginLength -= 1;
					}
				}
			}
		}
		return result;
	}

	/*
		Function: chartDiag.default.graph.getShortestPath
		Get shortest path between two nodes in graph. Start and end nodes supposed to have connection path. All connections have the same weight.
	
		Parameters:
		startNode - The node to start.
		endNode - The end node.
		getWeightFunc - Call back function to weight edge of graph. function(edge, fromItem, toItem)
	
		Returns: 
			Array containing nodes names of connection path.
	*/
	function getShortestPath(startNode, endNode, getWeightFunc) {
		var margin = {},
			distance = {},
			breadcramps = {},
			marginLength = 0,
			bestNodeOnMargin,
			bestDistanceToNode,
			key,
			children,
			newDistance,
			path,
			currentNode;

		/* add start node to margin */
		margin[startNode] = true;
		marginLength += 1;
		distance[startNode] = 0;

		/* search graph */
		while (marginLength > 0) {
			/* search for the best node on margin */
			bestNodeOnMargin = null;
			bestDistanceToNode = null;
			for (key in margin) {
				if (margin.hasOwnProperty(key)) {
					if (bestDistanceToNode == null) {
						bestNodeOnMargin = key;
						bestDistanceToNode = distance[key];
					} else if (bestDistanceToNode > distance[key]) {
						bestNodeOnMargin = key;
						bestDistanceToNode = distance[key];
					}
				}
			}

			/* itterate neighbours of selected node on margin */
			children = _edges[bestNodeOnMargin];
			for (key in children) {
				if (children.hasOwnProperty(key)) {
					newDistance = bestDistanceToNode + (getWeightFunc != null ? getWeightFunc(children[key], bestNodeOnMargin, key) : 1);
					if (distance.hasOwnProperty(key)) {
						if (distance[key] > newDistance) {
							if (margin.hasOwnProperty(key)) {
								/* improve current distance to node on margin */
								distance[key] = newDistance;
								breadcramps[key] = bestNodeOnMargin;
							}
						}
					} else {
						distance[key] = newDistance;
						breadcramps[key] = bestNodeOnMargin;
						/* add new node to margin */
						margin[key] = true;
						marginLength += 1;
					}
				}
			}

			if (bestNodeOnMargin == endNode) {
				/* if destination node found then break */
				break;
			} else {

				/* delete visited node from margin */
				delete margin[bestNodeOnMargin];
				marginLength -= 1;
			}
		}

		/* trace path */
		path = [];
		currentNode = endNode;
		while (currentNode != null) {
			path.push(currentNode);
			currentNode = breadcramps[currentNode];
		}
		return path;
	}

	return {
		addEdge: addEdge,
		edge: edge,
		getSpanningTree: getSpanningTree,
		getGrowthSequence: getGrowthSequence,
		getShortestPath: getShortestPath
	};
};

/* /algorithms/LinkedHashItems.js*/
chartDiag.default.LinkedHashItems = function () {
	var segmentsHash = {},
	nextKeys = {},
	prevKeys = {},
	startSegmentKey = null,
	endSegmentKey = null;

	function add(key, item) {
		if (segmentsHash.hasOwnProperty(key)) {
			throw "Duplicate segments are not supported!";
		}
		segmentsHash[key] = item;
		nextKeys[key] = null;
		if (endSegmentKey == null) {
			startSegmentKey = key;
			prevKeys[key] = null;
		} else {
			nextKeys[endSegmentKey] = key;
			prevKeys[key] = endSegmentKey;
		}
		endSegmentKey = key;
	}

	function item(key) {
		return segmentsHash[key];
	}

	function nextKey(key) {
		return nextKeys[key];
	}

	function prevKey(key) {
		return prevKeys[key];
	}

	function  startKey() {
		return startSegmentKey;
	}

	function endKey() {
		return endSegmentKey;
	}

	function unshift(key, item) {
		if (segmentsHash.hasOwnProperty(key)) {
			throw "Duplicate segments are not supported!";
		}
		segmentsHash[key] = item;
		prevKeys[key] = null;
		if (startSegmentKey == null) {
			endSegmentKey = key;
			nextKeys[key] = null;
		} else {
			prevKeys[startSegmentKey] = key;
			nextKeys[key] = startSegmentKey;
		}
		startSegmentKey = key;
	}

	function insertAfter(afterKey, key, item) {
		if (segmentsHash.hasOwnProperty(key)) {
			throw "Duplicate segments are not supported!";
		}

		if (afterKey == null) {
			unshift(key, item);
		} else {
			var nextKey = nextKeys[afterKey];
			if (nextKey == null) {
				add(key, item);
			} else {
				segmentsHash[key] = item;
				nextKeys[afterKey] = key;
				nextKeys[key] = nextKey;
				prevKeys[nextKey] = key;
				prevKeys[key] = afterKey;
			}
		}
	}

	function remove(key) {
		var prevKey = prevKeys[key],
			nextKey = nextKeys[key];

		if (prevKey != null) {
			nextKeys[prevKey] = nextKey;
		} else {
			startSegmentKey = nextKey;
		}

		if (nextKey != null) {
			prevKeys[nextKey] = prevKey;
		} else {
			endSegmentKey = prevKey;
		}

		delete segmentsHash[key];
		delete nextKeys[key];
		delete prevKeys[key];
	}

	function empty() {
		segmentsHash = {};
		nextKeys = {};
		prevKeys = {};
		startSegmentKey = null;
		endSegmentKey = null;
	}

	function _iterate(forward, onItem, startKey, endKey) {
		var key = startKey,
			segment;

		if (key == null) {
			key = forward ? startSegmentKey : endSegmentKey;
		}

		if (onItem != null) {
			while (key != null) {
				segment = segmentsHash[key];
				if (segment != null) {
					onItem(segment);
				}

				if (key == endKey) {
					key = null;
				} else {
					key = forward ? nextKeys[key] : prevKeys[key];
				}
			}
		}
	}

	function iterate(onItem, startKey, endKey) {
		_iterate(true, onItem, startKey, endKey);
	}

	function iterateBack(onItem, startKey, endKey) {
		_iterate(false, onItem, startKey, endKey);
	}

	function validate(info) {
		var key, prevKey, nextKey;
		for (key in segmentsHash) {
			if (segmentsHash.hasOwnProperty(key)) {
				if (!nextKeys.hasOwnProperty(key) || !prevKeys.hasOwnProperty(key)) {
					if (info != null) {
						info.message = "Orphant key found!";
					}
					return false;
				}
			}
		}
		if (!segmentsHash.hasOwnProperty(startSegmentKey) || !segmentsHash.hasOwnProperty(endSegmentKey)) {
			if (info != null) {
				info.message = "Start or end values are missing!";
			}
			return false;
		}
		for (key in nextKeys) {
			if (nextKeys.hasOwnProperty(key)) {
				if (!segmentsHash.hasOwnProperty(key) || !prevKeys.hasOwnProperty(key)) {
					if (info != null) {
						info.message = "Orphant key found!";
					}
					return false;
				}
				nextKey = nextKeys[key];
				if (nextKey && !nextKeys.hasOwnProperty(nextKey)) {
					if (info != null) {
						info.message = "Next key not found!";
					}
					return false;
				}
			}
		}
		for (key in prevKeys) {
			if (prevKeys.hasOwnProperty(key)) {
				if (!segmentsHash.hasOwnProperty(key) || !nextKeys.hasOwnProperty(key)) {
					if (info != null) {
						info.message = "Orphant key found!";
					}
					return false;
				}
				prevKey = prevKeys[key];
				if (prevKey && !prevKeys.hasOwnProperty(prevKey)) {
					if (info != null) {
						info.message = "Prev key not found!";
					}
					return false;
				}
			}
		}
		return true;
	}

	function toArray() {
		var result = [];

		iterate(function (item) {
			result.push(item);
		});

		return result;
	}

	return {
		add: add,
		item: item,
		nextKey: nextKey,
		prevKey: prevKey,
		startKey: startKey,
		endKey: endKey,
		unshift:unshift,
		insertAfter:insertAfter,
		remove: remove,

		iterate: iterate,
		iterateBack: iterateBack,
		empty: empty,
		toArray: toArray,
		validate: validate
	};
};


/* /algorithms/pile.js*/
/*
	Class: chartDiag.default.pile
		Sorts and stack segments on top of each other so they occupy minimum number of rows.
*/
chartDiag.default.pile = function () {
	var _items = [];

	/*
		Function: add
			Add segment to pile object.
	
		Parameters:
			from - Left margin of segment.
			to - Right margin of segment.
			context - Any reference to user object. It is returned as parameter in callback function of resolve method.

		See Also:
			<chartDiag.default.pile>
	*/
	function add(from, to, context) {
		if (from < to) {
			_items.push(new Segment(from, to, context, 1));
		} else {
			_items.push(new Segment(to, from, context, -1));
		}
	}

	/*
		Function: resolve
			Sorts and stack segments on top of each other so they occupy minimum number of rows.
	
		Parameters:
			thisArg - Context of onItemStacked callback function call.
			onItemStacked - Call back function used to set segment offset. function(from, to, context, offset) {}

		Returns: 
			Number of stacked rows in pile.

		See Also:
			<chartDiag.default.pile>
	*/
	function resolve(thisArg, onItem) { // function(from, to, context, offset) {}
		var hash,
			backtraceNext,
			backtraceTaken,
			items, item,
			rowItems,
			rows,
			rowIndex, index,
			offset = 0;

		if (onItem != null) {
			items = _items.slice(0);
			items.sort(function (a, b) {
				return a.from - b.from;
			});

			rows = [];
			while (items.length > 0) {
				hash = {};
				backtraceNext = {};
				backtraceTaken = {};

				getMax(0, items, hash, backtraceNext, backtraceTaken);

				rowItems = [];
				rows[offset] = [];
				index = 0;
				while (backtraceNext.hasOwnProperty(index)) {
					if (backtraceTaken[index]) {
						rowItems.push(index);

						rows[offset].push(items[index]);
					}
					index = backtraceNext[index];
				}

				for (index = rowItems.length - 1; index >= 0; index -= 1) {
					items.splice(rowItems[index], 1);
				}
				offset += 1;
			}

			for (rowIndex = 0; rowIndex < offset; rowIndex += 1) {
				rowItems = rows[rowIndex];
				for (index = 0; index < rowItems.length; index += 1) {
					item = rowItems[index];
					if (onItem.call(thisArg, item.from, item.to, item.context, rowIndex, offset, item.direction)) {
						return offset;
					}
				}
			}
		}

		return offset;
	}

	function Segment(from, to, context, direction) {
		this.context = context;
		this.from = from;
		this.to = to;
		this.offset = null;
		this.direction = direction;
	}

	function getMax(index, items, hash, backtraceNext, backtraceTaken) {
		var result = 0;

		if (index >= items.length) {
			return 0;
		}

		if (hash.hasOwnProperty(index)) {
			return hash[index];
		}

		var item = items[index];
		var withoutItem = getMax(index + 1, items, hash, backtraceNext, backtraceTaken);

		var nextIndex = index + 1;
		while (nextIndex < items.length) {
			var nextItem = items[nextIndex];
			if (nextItem.from >= item.to) {
				break;
			}
			nextIndex += 1;
		}
		var withItem = 1 + getMax(nextIndex, items, hash, backtraceNext, backtraceTaken);

		if (withItem > withoutItem) {
			hash[index] = withItem;
			backtraceNext[index] = nextIndex;
			backtraceTaken[index] = true;
		} else {
			hash[index] = withoutItem;
			backtraceNext[index] = index + 1;
			backtraceTaken[index] = false;
		}

		return hash[index];
	}

	return {
		add: add,
		resolve: resolve
	};
};

/* /algorithms/tree.js*/
chartDiag.default.tree = function (source) {
	var _nodes = {},        // objects attached to nodes
		_parents = {},      // parent node id for every node id. Both of them should exists in the tree.
		_children = {},     // children node ids for every node id. All children and node itself should be in the tree.
		_roots = {},        // id of non existing parent. If parent does not exists in the tree this hash contains its id.
		_rootChildren = {}, // children of non existing parent. If parent id does not exists in the tree this collection contains it existing children.
		BREAK = 1,
		SKIP = 2;

	_init(source);

	function _init(source) {
		if (chartDiag.default.isObject(source)) {
			_nodes = chartDiag.default.cloneObject(source.nodes, true);
			_parents = chartDiag.default.cloneObject(source.parents, true);
			_children = chartDiag.default.cloneObject(source.children, false);
			_roots = chartDiag.default.cloneObject(source.roots, false);
			_rootChildren = chartDiag.default.cloneObject(source.rootChildren, true);
		}
	}

	function loop(thisArg, onItem) {
		var item;
		if (onItem != null) {
			for (item in _nodes) {
				if (_nodes.hasOwnProperty(item)) {
					if (onItem.call(thisArg, item, _nodes[item])) {
						break;
					}
				}
			}
		}
	}

	function loopLevels(thisArg, arg0, arg1) { // onItem(nodeid, node, levelid) if function returns true loop is continued on item's children 
		var levelIndex = 0,
			items = [],
			itemid,
			onItem,
			newItems,
			key,
			index, len;

		switch (arguments.length) {
			case 2:
				onItem = arg0;
				break;
			case 3:
				itemid = arg0;
				onItem = arg1;
				break;
		}

		if (onItem != null) {

			if (itemid == null) {
				for (key in _rootChildren) {
					if (_rootChildren.hasOwnProperty(key)) {
						items = items.concat(_rootChildren[key]);
					}
				}
			} else {
				if (_children[itemid] != null) {
					items = items.concat(_children[itemid]);
				}
			}

			while (items.length > 0) {
				newItems = [];

				for (index = 0, len = items.length; index < len; index += 1) {
					itemid = items[index];
					switch (onItem.call(thisArg, itemid, _nodes[itemid], levelIndex)) {
						case BREAK:
							newItems = [];
							break;
						case SKIP:
							break;
						default:
							if (_children[itemid] != null) {
								newItems = newItems.concat(_children[itemid]);
							}
							break;
					}
				}

				items = newItems;
				levelIndex += 1;
			}
		}
	}

	/* children first - parent last */
	function loopPostOrder(thisArg, onItem) { // onItem(nodeid, node, parentid, parent) if function returns true loop exits
		var stack = [], nodeid,
			key,
			index,
			prevParent,
			children;

		if (onItem != null) {

			for (key in _rootChildren) {
				if (_rootChildren.hasOwnProperty(key)) {
					stack = stack.concat(_rootChildren[key]);
				}
			}

			while (stack.length > 0) {
				nodeid = stack[stack.length - 1];
				if (nodeid != prevParent && (children = _children[nodeid]) != null) {
					for (index = children.length - 1; index >= 0; index -= 1) {
						stack.push(children[index]);
					}
				} else {
					stack.pop();
					prevParent = _parents[nodeid];

					if (onItem.call(thisArg, nodeid, _nodes[nodeid], prevParent, _nodes[prevParent])) {
						break;
					}
				}
			}
		}
	}

	/* parent first - children next */
	function loopPreOrder(thisArg, onItem) { // onItem(nodeid, node, parentid, parent) if function returns true loop exits
		var stack = [], nodeid,
			key,
			index,
			prevParent,
			children;

		if (onItem != null) {

			for (key in _rootChildren) {
				if (_rootChildren.hasOwnProperty(key)) {
					stack = stack.concat(_rootChildren[key]);
				}
			}

			while (stack.length > 0) {
				nodeid = stack[stack.length - 1];
				if (nodeid != prevParent) {
					if (onItem.call(thisArg, nodeid, _nodes[nodeid], prevParent, _nodes[prevParent])) {
						break;
					}
				}
				if (nodeid != prevParent && (children = _children[nodeid]) != null) {
					for (index = children.length - 1; index >= 0; index -= 1) {
						stack.push(children[index]);
					}
				} else {
					stack.pop();
					prevParent = _parents[nodeid];
				}
			}
		}
	}

	function zipUp(thisArg, firstNodeId, secondNodeid, onZip) { // onZip(firstNodeId, firstParentId, secondNodeid, secondParentId)
		var firstParentId,
			secondParentId;

		if (onZip != null) {
			while (firstNodeId != null && secondNodeid != null && firstNodeId != secondNodeid) {
				firstParentId = _parents[firstNodeId];
				secondParentId = _parents[secondNodeid];
				if (onZip.call(thisArg, firstNodeId, firstParentId, secondNodeid, secondParentId)) {
					break;
				}
				firstNodeId = firstParentId;
				secondNodeid = secondParentId;
			}
		}
	}

	function loopParents(thisArg, nodeid, onItem) { // onItem(nodeid, node)
		var parentid = nodeid;
		if (_nodes[parentid] != null) {
			if (onItem != null) {
				while ((parentid = _parents[parentid]) != null) {
					if (onItem.call(thisArg, parentid, _nodes[parentid])) {
						break;
					}
				}
			}
		}
	}

	function loopChildren(thisArg, nodeid, onItem) { // onItem(nodeid, node, index, lastIndex)
		var items,
			itemid,
			index, len;
		if (_nodes[nodeid] != null) {
			items = _children[nodeid];
			if (items != null) {
				for (index = 0, len = items.length; index < len; index += 1) {
					itemid = items[index];
					if (onItem.call(thisArg, itemid, _nodes[itemid], index, len - 1)) {
						break;
					}
				}
			}
		}
	}

	function loopChildrenRange(thisArg, nodeid, fromIndex, toIndex, onItem) { // onItem(nodeid, node, index)
		var items,
			itemid,
			index, len;
		if (_nodes[nodeid] != null) {
			items = _children[nodeid];
			if (items != null) {
				if (fromIndex < toIndex) {
					fromIndex = Math.max(fromIndex, 0);
					toIndex = Math.min(toIndex, items.length - 1);
					for (index = fromIndex; index <= toIndex; index += 1) {
						itemid = items[index];
						if (onItem.call(thisArg, itemid, _nodes[itemid], index, len - 1)) {
							break;
						}
					}
				} else {
					fromIndex = Math.min(fromIndex, items.length - 1);
					toIndex = Math.max(0, toIndex);
					for (index = fromIndex; index >= toIndex; index -= 1) {
						itemid = items[index];
						if (onItem.call(thisArg, itemid, _nodes[itemid], index, len - 1)) {
							break;
						}
					}
				}
			}
		}
	}

	function loopChildrenReversed(thisArg, nodeid, onItem) { // onItem(nodeid, node, index, lastIndex)
		var items,
			itemid,
			index, lastIndex;
		if (_nodes[nodeid] != null) {
			items = _children[nodeid];
			lastIndex = items.length - 1;
			if (items != null) {
				for (index = lastIndex; index >= 0; index -= 1) {
					itemid = items[index];
					if (onItem.call(thisArg, itemid, _nodes[itemid], index, lastIndex)) {
						break;
					}
				}
			}
		}
	}

	function arrangeChildren(nodeid, children) {
		var childid,
			index, len;

		children = children.slice(0);
		if (_nodes[nodeid] != null) {
			if (_children[nodeid] != null) {
				if (_children[nodeid].length == children.length) {
					for (index = 0, len = children.length; index < len; index += 1) {
						childid = children[index];
						if (_parents[childid] != nodeid) {
							throw "Child " + childid + " does not belong to given node!";
						}
					}
					_children[nodeid] = children;
				} else {
					throw "Collections of children don't match each other!";
				}
			} else {
				if (children.length > 0) {
					throw "Collections of children don't match each other!";
				}
			}
		}
	}

	function add(parentid, nodeid, node, position) {
		var index, len, children, childid;

		if (_nodes[nodeid] != null) {
			throw "Node already exists";
		}

		if (nodeid != null && node != null && _nodes[nodeid] == null) {

			if (_nodes[parentid] != null) {
				_parents[nodeid] = parentid;

				// existing parent
				if (_children[parentid] != null) {
					if (position == null) {
						_children[parentid].push(nodeid);
					} else {
						_children[parentid].splice(position, 0, nodeid);
					}
				} else {
					_children[parentid] = [nodeid];
				}
			} else {
				_roots[nodeid] = parentid;

				// missing parent
				if (_rootChildren[parentid] != null) {
					if (position == null) {
						_rootChildren[parentid].push(nodeid);
					} else {
						_rootChildren[parentid].splice(position, 0, nodeid);
					}
				} else {
					_rootChildren[parentid] = [nodeid];
				}
			}

			_nodes[nodeid] = node;

			if (_rootChildren[nodeid] != null) {
				_children[nodeid] = _rootChildren[nodeid];
				delete _rootChildren[nodeid];

				children = _children[nodeid];
				for (index = 0, len = children.length; index < len; index += 1) {
					childid = children[index];

					delete _roots[childid];

					_parents[childid] = nodeid;
				}
				
			}

		}
	}

	function insert(nodeid, bundleid, bundle) {
		if (_nodes[nodeid] != null && bundleid != null && _nodes[bundleid] == null && bundle != null) {

			_nodes[bundleid] = bundle;

			if (_children[nodeid] != null) {
				_children[bundleid] = _children[nodeid];
			}
			_children[nodeid] = [bundleid];

			loopChildren(this, bundleid, function (childid, node, index) {
				_parents[childid] = bundleid;
			});
			_parents[bundleid] = nodeid;
		}
	}

	function moveChildren(fromNodeid, toNodeId) {
		if (_nodes[fromNodeid] != null && _nodes[toNodeId] != null && fromNodeid != toNodeId) {

			if (_children[fromNodeid] != null) {

				loopChildren(this, fromNodeid, function (childid, node, index) {
					_parents[childid] = toNodeId;
				});

				if (_children[toNodeId] != null) {
					_children[toNodeId] = _children[toNodeId].concat(_children[fromNodeid]);
				} else {
					_children[toNodeId] = _children[fromNodeid];
				}
				delete _children[fromNodeid];
			}
		}
	}

	function hasNodes() {
		return !chartDiag.default.isEmptyObject(_rootChildren);
	}

	function parentid(nodeid) {
		var result = null;

		if (_parents[nodeid] != null) {
			result = _parents[nodeid];
		}

		return result;
	}

	function parent(nodeid) {
		var result = null;

		if (_parents[nodeid] != null) {
			result = _nodes[_parents[nodeid]];
		}

		return result;
	}

	function hasChildren(nodeid) {
		return _children[nodeid] != null;
	}

	function countChildren(nodeid) {
		return _children[nodeid] != null ? _children[nodeid].length : 0;
	}

	function countSiblings(nodeid) {
		var parent = parentid(nodeid);
		return parent != null ? _children[parent].length : 0;
	}

	function indexOf(nodeid) {
		var parent = parentid(nodeid);
		return parent != null ? chartDiag.default.indexOf(_children[parent], nodeid) : null;
	}

	function getChild(parentid, index) {
		var result = null,
			children;
		if ((children = _children[parentid]) != null) {
			result = _nodes[children[index]];
		}
		return result;
	}

	function _splice(collection, nodeid) {
		var index, len = collection.length;
		for (index = 0; index < len; index += 1) {
			if(collection[index] == nodeid) {
				collection.splice(index, 1);
				return len - 1;
			}
		}
		return len;
	}

	function adopt(parentid, nodeid) {
		if (_nodes[parentid] != null && _nodes[nodeid] != null) {
			if (parentid != nodeid) {
				if (_roots.hasOwnProperty(nodeid)) {
					if (!_splice(_rootChildren[_roots[nodeid]], nodeid)) {
						delete _rootChildren[_roots[nodeid]];
					}
					delete _roots[nodeid];
				}

				if (_parents.hasOwnProperty(nodeid)) {
					if (!_splice(_children[_parents[nodeid]], nodeid)) {
						delete _children[_parents[nodeid]];
					}
				}

				_parents[nodeid] = parentid;
				if (_children[parentid] != null) {
					_children[parentid].push(nodeid);
				} else {
					_children[parentid] = [nodeid];
				}
			}
			else {
				throw "Item cannot be parent of itself!";
			}
		} else {
			throw "Both parent and child should be in hierarchy!";
		}
	}

	function node(nodeid) {
		return _nodes[nodeid];
	}

	function validate() {
		var result = true,
			key;

		for (key in _roots) {
			if (_roots.hasOwnProperty(key)) {
				if (_roots[key] != null) {
					result = false;
					break;
				}
			}
		}

		return result;
	}

	function clone() {
		return chartDiag.default.family({
			nodes: _nodes,
			parents: _parents,
			children: _children,
			roots: _roots,
			rootChildren: _rootChildren
		});
	}
	
	function loopNeighbours(thisArg, itemid, distance, onItem) {
		var processed = {},
			margin = [itemid],
			newMargin,
			currentDistance = 0;

		if (onItem != null) {
			if (_nodes.hasOwnProperty(itemid)) {
				processed[itemid] = true;
				while (margin.length > 0) {
					newMargin = [];
					for (var index = 0, len = margin.length; index < len; index += 1) {
						var marginid = margin[index];
						if (currentDistance > 0) {
							if (onItem.call(thisArg, marginid, _nodes[marginid], currentDistance)) {
								return;
							}
						}
						if (currentDistance < distance) {
							_loopNeighbours(this, marginid, function (neighbourid, neighbour) {
								if (!processed.hasOwnProperty(neighbourid)) {
									newMargin.push(neighbourid);
									processed[neighbourid] = true;
								}
							});
						}
					}
					margin = newMargin;
					currentDistance += 1;
				}
			}
		}
	}

	function _loopNeighbours(thisArg, itemid, onItem) {
		if (onItem != null) {
			if (_nodes.hasOwnProperty(itemid)) {
				/* loop parent */
				var parentItemId = parentid(itemid);
				if (parentItemId != null) {
					if (onItem.call(thisArg, parentItemId, _nodes[parentItemId])) {
						return;
					}
				}
				/* loop siblings */
				loopChildren(thisArg, parentItemId, function (childItemId, childItem) {
					if (childItemId != itemid) {
						if (onItem.call(thisArg, childItemId, childItem)) {
							return;
						}
					}
				});
				/* loop actual children */
				loopChildren(thisArg, itemid, function (childItemId, childItem) {
					if (onItem.call(thisArg, childItemId, childItem)) {
						return;
					}
				});
			}
		}
	}

	return {
		loop: loop,
		loopLevels: loopLevels,
		loopParents: loopParents,
		loopChildren: loopChildren,
		loopChildrenRange: loopChildrenRange,
		loopChildrenReversed: loopChildrenReversed,
		loopPostOrder: loopPostOrder, /* children first - parent last */
		loopPreOrder: loopPreOrder, /* parent first - children next */
		loopNeighbours: loopNeighbours, /* loop items by distance. Siblings are as far as parent and children */
		zipUp: zipUp,
		parentid: parentid,
		parent: parent,
		adopt: adopt,
		moveChildren: moveChildren,
		node: node,
		add: add,
		insert: insert,
		hasNodes: hasNodes,
		hasChildren: hasChildren,
		countChildren: countChildren,
		countSiblings: countSiblings,
		indexOf: indexOf,
		getChild: getChild,
		arrangeChildren: arrangeChildren,

		/* force validation */
		validate: validate,
		clone: clone,

		// callback return codes
		BREAK: BREAK, // break loop immidiatly
		SKIP: SKIP // skip loop of current node children 
	};
};

/* /algorithms/TreeLevels.js*/
chartDiag.default.TreeLevels = function (source) {
	var _levels = [],
		_items = {},
		_minimum = null,
		_maximum = null;

	_init(source);

	function _init(source) {
		if (chartDiag.default.isObject(source)) {
			_levels = chartDiag.default.cloneObject(source.levels, true);
			_items = chartDiag.default.cloneObject(source.items, true);
			_minimum = chartDiag.default.cloneObject(source.minimum, true);
			_maximum = chartDiag.default.cloneObject(source.maximum, true);
		}
	}

	function LevelContext(context) {
		this.context = context;
		this.items = [];
	}

	function ItemContext(context, position, level) {
		this.context = context;
		this.position = position;
		this.level = level;
	}

	function isEmpty() {
		return !_levels.length;
	}

	function addLevel(level, context) {
		var treeLevel = createLevel(level);
		treeLevel.context = context;
	}

	function getLevelIndex(itemid) {
		return _items.hasOwnProperty(itemid) ? _items[itemid].level : null;
	}

	function getPrevItem(itemid) {
		var result = null;
		if(_items.hasOwnProperty(itemid)) {
			var item = _items[itemid],
				level = _levels[item.level];
			result = level.items[item.position - 1];
		}
		return result;
	}

	function getNextItem(itemid) {
		var result = null;
		if (_items.hasOwnProperty(itemid)) {
			var item = _items[itemid],
				level = _levels[item.level];
			result = level.items[item.position + 1];
		}
		return result;
	}

	function hasItem(itemid) {
		return _items.hasOwnProperty(itemid);
	}

	function hasLevel(levelIndex) {
		return _levels[levelIndex] != null;
	}

	function createLevel(index) {
		if (_levels[index] == null) {
			_levels[index] = new LevelContext(null);

			_minimum = _minimum === null ? index : Math.min(_minimum, index);
			_maximum = _maximum === null ? index : Math.max(_maximum, index);
		}
		return _levels[index];
	}

	function addItem(levelIndex, itemid, context) {
		var level;
		if (!_items.hasOwnProperty(itemid)) {
			level = createLevel(levelIndex);
			level.items.push(itemid);
			_items[itemid] = new ItemContext(context, level.items.length - 1, levelIndex);
		} else {
			throw "Duplicate item id.";
		}
	}

	function loopLevels(thisArg, onItem) { // function onItem(levelIndex, level)
		var index, 
			level;
		if (onItem != null) {
			for (index = _minimum; index <= _maximum; index+=1) {
				level = _levels[index];
				if(level != null) {
					if (onItem.call(thisArg, index, level.context)) {
						break;
					}
				}
			}
		}
	}

	function loopLevelsReversed(thisArg, onItem) { // function onItem(levelIndex, level)
		var index,
			level;
		if (onItem != null) {
			for (index = _maximum; index >= _minimum; index -= 1) {
				level = _levels[index];
				if (level != null) {
					if (onItem.call(thisArg, index, level.context)) {
						break;
					}
				}
			}
		}
	}

	function loopLevelItems(thisArg, levelIndex, onItem) { // function onItem(itemid, item, position)
		var index, len,
			level,
			itemid;
		if (onItem != null) {
			level = _levels[levelIndex];
			if (level != null) {
				for (index = 0, len = level.items.length; index < len; index += 1) {
					itemid = level.items[index];
					if (onItem.call(thisArg, itemid, _items[itemid].context, index)) {
						break;
					}
				}
			}
		}
	}

	function loopItems(thisArg, onItem) { // function onItem(itemid, item, position, levelIndex, level)
		var index, len,
			level, levelIndex,
			items,
			itemid;
		if (onItem != null) {
			for (levelIndex = _minimum; levelIndex <= _maximum; levelIndex += 1) {
				level = _levels[levelIndex];
				if (level != null) {
					items = level.items;
					for (index = 0, len = items.length; index < len; index += 1) {
						itemid = items[index];
						if (onItem.call(thisArg, itemid, _items[itemid].context, index, levelIndex, level.context)) {
							return;
						}
					}
				}
			}
		}
	}

	function binarySearch(thisArg, levelIndex, onGetDistance) {
		var result = null,
			level;
		if (onGetDistance != null) {
			level = _levels[levelIndex];
			if (level != null) {
				result = chartDiag.default.binarySearch(level.items, onGetDistance);
			}
		}
		return result;
	}

	function loopMerged(thisArg, getItemWeight, onItem) {
		var index, len,
			level,
			itemid,
			levelsItems = [],
			sortedItems;

		for (index = 0, len = _levels.length; index < len; index += 1) {
			level = _levels[index];
			levelsItems.push(level.items);
		}

		sortedItems = chartDiag.default.mergeSort(levelsItems, getItemWeight);

		if (onItem != null) {
			for (index = 0, len = sortedItems.length; index < len; index += 1) {
				itemid = sortedItems[index];
				if (onItem.call(thisArg, itemid, _items[itemid].context)) {
					break;
				}
			}
		}
	}

	function loopFromItem(thisArg, itemid, isLeft, onItem) {
		var context,
			index, len,
			items, nextItemId;
		if (_items.hasOwnProperty(itemid)) {
			context = _items[itemid];
			items = _levels[context.level].items;
			if (onItem != null) {
				if (isLeft) {
					for (index = context.position - 1; index >= 0; index -= 1) {
						nextItemId = items[index];
						if (onItem.call(thisArg, nextItemId, _items[nextItemId].context)) {
							break;
						}
					}
				} else {
					for (index = context.position + 1, len = items.length; index < len; index += 1) {
						nextItemId = items[index];
						if (onItem.call(thisArg, nextItemId, _items[nextItemId].context)) {
							break;
						}
					}
				}
			}
		}
	}

	function loopLevelsFromItem(thisArg, itemid, isBelow, onItem) { // function(levelIndex, level)
		var context,
			index, len,
			items, item, nextItemId,
			nextLevels;
		if (_items.hasOwnProperty(itemid)) {
			context = _items[itemid];
			if (onItem != null) {
				if (isBelow) {
					for (index = context.level + 1; index <= _maximum; index += 1) {
						if (onItem.call(thisArg, index, _levels[index].context)) {
							break;
						}
					}
				} else {
					for (index = context.level - 1; index >= _minimum; index -= 1) {
						if (onItem.call(thisArg, index, _levels[index].context)) {
							break;
						}
					}
				}
			}
		}
	}

	function clone() {
		return chartDiag.default.family({
			levels: _levels,
			items: _items,
			minimum: _minimum,
			maximum: _maximum
		});
	}

	return {
		addlevel: addLevel,
		hasLevel: hasLevel,
		hasItem: hasItem,
		addItem: addItem,
		getLevelIndex: getLevelIndex,
		loopLevels: loopLevels,
		loopLevelsReversed: loopLevelsReversed,
		loopLevelItems: loopLevelItems,
		loopItems: loopItems,
		binarySearch: binarySearch,
		loopMerged: loopMerged,
		loopFromItem: loopFromItem,
		loopLevelsFromItem: loopLevelsFromItem,
		getPrevItem: getPrevItem,
		getNextItem: getNextItem,
		isEmpty: isEmpty,

		clone: clone
	};
};

/* /Managers/DependencyManager.js*/
chartDiag.default.DependencyManager = function () {
	var hash = {};

	function register(key, value) {
		hash[key] = value;

		return value;
	}

	function resolve() {
		var args = [],
			deps = arguments[0],
			func = arguments[1],
			scope = arguments[2] || {};
		return function () {
			var a = Array.prototype.slice.call(arguments, 0);
			for (var i = 0; i < deps.length; i += 1) {
				var d = deps[i];
				args.push(hash[d] && d !== '' ? hash[d] : a.shift());
			}
			args = args.concat(a);
			return func.apply(scope || {}, args);
		};
	}

	return {
		register: register,
		resolve: resolve
	};
};

/* /Managers/TaskInfo.js*/
chartDiag.default.TaskInfo = function (name, dependencies, factory, color) {
	this.name = name;
	this.dependencies = dependencies;
	this.factory = factory;
	this.task = null;
	this.color = color;
};

/* /Managers/TaskManager.js*/
chartDiag.default.TaskManager = function () {
	var _taskFamily = new chartDiag.default.family();
	var _dependencies = new chartDiag.default.DependencyManager();
	var _tasks = [];

	function addTask(taskName, taskDependencies, factory, color) {
		if (_tasks.length > 0) {
			throw "Task Manager is already initialized";
		}
		_taskFamily.add(taskDependencies, taskName, new chartDiag.default.TaskInfo(taskName, taskDependencies, factory, color));
	}

	function getTask(taskName) {
		var taskInfo = _taskFamily.node(taskName);
		return taskInfo && taskInfo.task;
	}

	function addDependency(name, dependency) {
		if (_tasks.length > 0) {
			throw "Task Manager is already initialized";
		}
		_dependencies.register(name, dependency);
	}

	function process(startTask, stopTask, debug) {
		var hasChanges = false,
			logtime = false;
		if (_tasks.length === 0) {
			_taskFamily.loopTopo(this, function (taskName, taskInfo) {
				taskInfo.task = _dependencies.register(taskName, _dependencies.resolve(taskInfo.dependencies, taskInfo.factory)());
				_tasks.push(taskInfo);
			});
		}
		if (debug) {
			console.log("-- process --");
		}
		var isRequired = {};
		for (var index = 0, len = _tasks.length; index < len; index += 1) {
			var taskInfo = _tasks[index],
				dependents = [];

			if (taskInfo.name == startTask || isRequired.hasOwnProperty(taskInfo.name)) {
				if (logtime) {
					console.time(taskInfo.name);
				}
				if (hasChanges = taskInfo.task.process(debug)) {
					_taskFamily.loopChildren(this, taskInfo.name, function (childTaskName, childTaskInfo) {
						isRequired[childTaskName] = true;
						if (debug) {
							dependents.push(childTaskName);
						}
						return _taskFamily.SKIP;
					});
				}
				if (logtime) {
					console.timeEnd(taskInfo.name);
				}
				if(debug) {
					console.log(index + ". " + taskInfo.name + (hasChanges ? " - forces: " + dependents.toString() : ""));
				}
			}
			if (taskInfo.name == stopTask) {
				return;
			}
		}
	}

	function getProcessDiagramConfig() {
		var result = new chartDiag.famChart.Config();
		if (_tasks.length === 0) {
			_taskFamily.loopTopo(this, function (taskName, taskInfo) {
				taskInfo.task = _dependencies.register(taskName, _dependencies.resolve(taskInfo.dependencies, taskInfo.factory)());
				_tasks.push(taskInfo);
			});
		}
		for (var index = 0, len = _tasks.length; index < len; index += 1) {
			var taskInfo = _tasks[index];

			var itemConfig = new chartDiag.famChart.ItemConfig();
			itemConfig.id = taskInfo.name;
			itemConfig.title = chartDiag.default.splitCamelCaseName(taskInfo.name).join(" ");
			itemConfig.description = taskInfo.task.description || "";
			itemConfig.itemTitleColor = taskInfo.color;
			itemConfig.parents = [];

			_taskFamily.loopParents(this, taskInfo.name, function (parentTaskName, parentTaskInfo) {
				itemConfig.parents.push(parentTaskName);
				return _taskFamily.SKIP;
			});
			result.items.push(itemConfig);
		}
		return result;
	}

	return {
		addTask: addTask,
		addDependency: addDependency,
		getTask: getTask,
		process: process,
		getProcessDiagramConfig: getProcessDiagramConfig
	};
};

/* /pdf/graphics/graphics.js*/
chartDiag.pdf.graphics = function (doc) {
	this._doc = doc,
	this._context = this._doc;
	this._dummyPlaceholder = new chartDiag.default.Placeholder();
};

chartDiag.pdf.graphics.prototype.clean = function () {

};

chartDiag.pdf.graphics.prototype.resize = function (name, width, height) {

};

chartDiag.pdf.graphics.prototype.begin = function () {

};

chartDiag.pdf.graphics.prototype.end = function () {

};

chartDiag.pdf.graphics.prototype.reset = function (arg0, arg1) {

};

chartDiag.pdf.graphics.prototype.activate = function (arg0, arg1) {
	return this._dummyPlaceholder;
};

chartDiag.pdf.graphics.prototype.text = function (x, y, width, height, label, orientation, horizontalAlignment, verticalAlignment, attr) {

};

chartDiag.pdf.graphics.prototype.polylinesBuffer = function (buffer) {
	buffer.loop(this, function (polyline) {
		if (polyline.length() > 0) {
			this.polyline(polyline);
		}
	});
};

chartDiag.pdf.graphics.prototype.polyline = function (polylineData) {
	var placeholder = this.m_activePlaceholder,
		attr = polylineData.paletteItem.toAttr(),
		step,
		cornerRadius,
		doc = this._doc;

	doc.save();
	polylineData.loop(this, function (segment) {
		switch (segment.segmentType) {
			case 1/*chartDiag.default.SegmentType.Move*/:
				doc.moveTo(Math.round(segment.x) + 0.5, Math.round(segment.y) + 0.5);
				break;
			case 0/*chartDiag.default.SegmentType.Line*/:
				doc.lineTo(Math.round(segment.x) + 0.5, Math.round(segment.y) + 0.5);
				break;
			case 4/*chartDiag.default.SegmentType.Dot*/:
				if (segment.width == segment.height && segment.width / 2.0 <= segment.cornerRadius) {
					// circle dot
					doc.roundedRect(Math.round(segment.x) + 0.5, Math.round(segment.y) + 0.5, segment.width, segment.height, Math.min(segment.width, segment.height) / 2.0);
				} else if (segment.cornerRadius === 0) {
					// square
					doc.moveTo(Math.round(segment.x) + 0.5, Math.round(segment.y) + 0.5);
					doc.lineTo(Math.round(segment.x + segment.width) + 0.5, Math.round(segment.y) + 0.5);
					doc.lineTo(Math.round(segment.x + segment.width) + 0.5, Math.round(segment.y + segment.height) + 0.5);
					doc.lineTo(Math.round(segment.x) + 0.5, Math.round(segment.y + segment.height) + 0.5);
					doc.lineTo(Math.round(segment.x) + 0.5, Math.round(segment.y) + 0.5);
				} else {
					// rounded corners rectangle
					cornerRadius = Math.min(segment.cornerRadius, Math.min(segment.width / 2.0, segment.height / 2.0));
					doc.roundedRect(Math.round(segment.x) + 0.5, Math.round(segment.y) + 0.5, segment.width, segment.height, cornerRadius);
				}
				break;
			case 2/*chartDiag.default.SegmentType.QuadraticArc*/:
				doc.quadraticCurveTo(Math.round(segment.cpX) + 0.5, Math.round(segment.cpY) + 0.5, Math.round(segment.x) + 0.5, Math.round(segment.y) + 0.5);
				break;
			case 3/*chartDiag.default.SegmentType.CubicArc*/:
				doc.bezierCurveTo(Math.round(segment.cpX1) + 0.5,
					Math.round(segment.cpY1) + 0.5,
					Math.round(segment.cpX2) + 0.5,
					Math.round(segment.cpY2) + 0.5,
					Math.round(segment.x) + 0.5,
					Math.round(segment.y) + 0.5);
				break;
		}
	});

	doc.lineJoin('round');

	if (attr.lineType != null) {
		step = Math.round(attr.lineWidth) || 1;
		switch (attr.lineType) {
			case 0/*chartDiag.default.LineType.Solid*/:
				break;
			case 1/*chartDiag.default.LineType.Dotted*/:
				doc.dash(step, step * 2);
				break;
			case 2/*chartDiag.default.LineType.Dashed*/:
				doc.dash(step * 5, step * 3);
				break;
		}
	}

	if (attr.lineWidth !== undefined && attr.fillColor !== undefined) {
		doc
			.lineWidth(attr.lineWidth)
			.fillOpacity(attr.opacity)
			.fillAndStroke(attr.fillColor, attr.borderColor);
	}
	else if (attr.lineWidth !== undefined) {
		doc
			.lineWidth(attr.lineWidth)
			.stroke(attr.borderColor);
	}
	else if (attr.fillColor !== undefined) {
		doc
			.fillOpacity(attr.opacity)
			.fillColor(attr.fillColor);
	}
	doc.restore();
};


chartDiag.pdf.graphics.prototype.rightAngleLine = function (fromX, fromY, toX, toY, attr) {

};

chartDiag.pdf.graphics.prototype.template = function (x, y, width, height, contentx, contenty, contentWidth, contentHeight, template, hashCode, onRenderTemplate, uiHash, attr) { //ignore jslint
	var gap = 0;

	if (attr !== null) {
		if (attr["border-width"] !== undefined) {
			gap = this.getPxSize(attr["border-width"]);
		}
	}

	var position = new chartDiag.default.Rect(x + contentx, y + contenty, contentWidth - gap, contentHeight - gap);

	if (uiHash == null) {
		uiHash = new chartDiag.default.RenderEventArgs();
	}

	if (onRenderTemplate !== null) {
		onRenderTemplate(this._doc, position, uiHash);
	}
};

chartDiag.pdf.graphics.prototype.getPxSize = function (value, base) {
	var result = value;
	if (typeof value === "string") {
		if (value.indexOf("pt") > 0) {
			result = parseInt(value, 10) * 96 / 72;
		}
		else if (value.indexOf("%") > 0) {
			result = parseFloat(value) / 100.0 * base;
		}
		else {
			result = parseInt(value, 10);
		}
	}
	return result;
};

/* /pdf/FamDiagram/Plugin.js*/
chartDiag.pdf.famChart.Plugin = function (options) {
	var _data = {
		name: "famChart",
		doc: null,
		options: options,
		tasks: null,
		graphics: null
	},
	_scale,
	_debug = false;

	function getOptions() {
		return _data.options;
	}

	function getGraphics() {
		return _data.graphics;
	}

	function createTaskManager() {
		var tasks = new chartDiag.default.TaskManager();

		// Dependencies
		tasks.addDependency('options', getOptions);
		tasks.addDependency('graphics', getGraphics);

		tasks.addDependency('defaultConfig', new chartDiag.famChart.Config());
		tasks.addDependency('defaultItemConfig', new chartDiag.famChart.ItemConfig());
		tasks.addDependency('defaultTemplateConfig', new chartDiag.famChart.TemplateConfig());
		tasks.addDependency('defaultButtonConfig', new chartDiag.famChart.ButtonConfig());
		tasks.addDependency('defaultPaletteItemConfig', new chartDiag.famChart.PaletteItemConfig());

		tasks.addDependency('defaultBackgroundAnnotationConfig', new chartDiag.famChart.BackgroundAnnotationConfig());
		tasks.addDependency('defaultConnectorAnnotationConfig', new chartDiag.famChart.ConnectorAnnotationConfig());
		tasks.addDependency('defaultHighlightPathAnnotationConfig', new chartDiag.famChart.HighlightPathAnnotationConfig());
		tasks.addDependency('defaultShapeAnnotationConfig', new chartDiag.famChart.ShapeAnnotationConfig());
		tasks.addDependency('defaultLabelAnnotationConfig', new chartDiag.famChart.LabelAnnotationConfig());

		tasks.addDependency('isFamilyChartMode', true);/* in regular org diagram we hide branch if it contains only invisible nodes, 
		in the family chart we use invisible items to draw connectors across multiple levels */
		tasks.addDependency('showElbowDots', true);/* in regular org chart we don;t have situations when connector lines cross, but we have such situations in 
		family tree so we need extra visual attribute to distinguish intersections betwen connectors */
		tasks.addDependency('null', null);
		tasks.addDependency('foreground', 2/*chartDiag.default.ZOrderType.Foreground*/);
		tasks.addDependency('background', 1/*chartDiag.default.ZOrderType.Background*/);

		// Options
		tasks.addTask('OptionsTask', ['options'], chartDiag.famChart.OptionsTask, "#000000"/*chartDiag.default.Colors.Black*/);

		tasks.addTask('CalloutOptionTask', ['OptionsTask', 'defaultConfig', 'defaultItemConfig'], chartDiag.orgChart.CalloutOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('ConnectorsOptionTask', ['OptionsTask', 'defaultConfig'], chartDiag.orgChart.ConnectorsOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('ItemsOptionTask', ['OptionsTask', 'defaultItemConfig'], chartDiag.famChart.ItemsOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('SpousesOptionTask', ['OptionsTask', 'defaultItemConfig'], chartDiag.famChart.SpousesOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('ItemsSizesOptionTask', ['OptionsTask', 'defaultConfig', 'defaultItemConfig', 'defaultButtonConfig'], chartDiag.orgChart.ItemsSizesOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('PrintPreviewOptionTask', ['OptionsTask', 'defaultConfig'], chartDiag.orgChart.PrintPreviewOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('TemplatesOptionTask', ['OptionsTask', 'defaultConfig', 'defaultButtonConfig', 'defaultTemplateConfig'], chartDiag.orgChart.TemplatesOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('OrientationOptionTask', ['OptionsTask', 'defaultConfig'], chartDiag.orgChart.OrientationOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('VisualTreeOptionTask', ['OptionsTask'], chartDiag.famChart.VisualTreeOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('NormalizeOptionTask', ['OptionsTask', 'defaultConfig'], chartDiag.famChart.NormalizeOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('LinePaletteOptionTask', ['OptionsTask', 'defaultPaletteItemConfig'], chartDiag.famChart.LinePaletteOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);

		tasks.addTask('CursorItemOptionTask', ['OptionsTask', 'defaultConfig'], chartDiag.orgChart.CursorItemOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('HighlightItemOptionTask', ['OptionsTask', 'defaultConfig'], chartDiag.orgChart.HighlightItemOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('SelectedItemsOptionTask', ['OptionsTask'], chartDiag.orgChart.SelectedItemsOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);

		tasks.addTask('SplitAnnotationsOptionTask', ['OptionsTask'], chartDiag.orgChart.SplitAnnotationsOptionTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);

		tasks.addTask('ForegroundShapeAnnotationOptionTask', ['SplitAnnotationsOptionTask', 'defaultShapeAnnotationConfig', 'foreground'], chartDiag.orgChart.ShapeAnnotationOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('BackgroundShapeAnnotationOptionTask', ['SplitAnnotationsOptionTask', 'defaultShapeAnnotationConfig', 'background'], chartDiag.orgChart.ShapeAnnotationOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('HighlightPathAnnotationOptionTask', ['SplitAnnotationsOptionTask', 'defaultConfig', 'defaultHighlightPathAnnotationConfig'], chartDiag.orgChart.HighlightPathAnnotationOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('ForegroundConnectorAnnotationOptionTask', ['SplitAnnotationsOptionTask', 'defaultConnectorAnnotationConfig', 'foreground'], chartDiag.orgChart.ConnectorAnnotationOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('BackgroundConnectorAnnotationOptionTask', ['SplitAnnotationsOptionTask', 'defaultConnectorAnnotationConfig', 'background'], chartDiag.orgChart.ConnectorAnnotationOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('BackgroundAnnotationOptionTask', ['SplitAnnotationsOptionTask', 'defaultBackgroundAnnotationConfig'], chartDiag.orgChart.BackgroundAnnotationOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);

		tasks.addTask('ScaleOptionTask', ['OptionsTask', 'defaultConfig'], chartDiag.orgChart.ScaleOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);

		// Transformations
		tasks.addTask('IntervalsTask', ['ItemsSizesOptionTask'], chartDiag.orgChart.IntervalsTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('LogicalFamilyTask', ['ItemsOptionTask'], chartDiag.famChart.LogicalFamilyTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);

		tasks.addTask('LabelAnnotationOptionTask', ['SplitAnnotationsOptionTask', 'LogicalFamilyTask', 'defaultLabelAnnotationConfig'], chartDiag.famChart.LabelAnnotationOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('LabelAnnotationTemplateOptionTask', ['LabelAnnotationOptionTask', 'defaultLabelAnnotationConfig'], chartDiag.famChart.LabelAnnotationTemplateOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('LabelAnnotationPlacementOptionTask', ['LabelAnnotationOptionTask', 'defaultLabelAnnotationConfig'], chartDiag.famChart.LabelAnnotationPlacementOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);

		tasks.addTask('CombinedContextsTask', ['ItemsOptionTask', 'LabelAnnotationOptionTask'], chartDiag.orgChart.CombinedContextsTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);

		tasks.addTask('AddLabelAnnotationsTask', ['LabelAnnotationPlacementOptionTask', 'LogicalFamilyTask'], chartDiag.famChart.AddLabelAnnotationsTask, "#ff0000"/*chartDiag.default.Colors.Red*/);
		tasks.addTask('RemoveLoopsTask', ['ItemsOptionTask', 'AddLabelAnnotationsTask'], chartDiag.famChart.RemoveLoopsTask, "#ff0000"/*chartDiag.default.Colors.Red*/);
		tasks.addTask('AddSpousesTask', ['SpousesOptionTask', 'RemoveLoopsTask'], chartDiag.famChart.AddSpousesTask, "#ff0000"/*chartDiag.default.Colors.Red*/);
		tasks.addTask('NormalizeLogicalFamilyTask', ['NormalizeOptionTask', 'AddSpousesTask'], chartDiag.famChart.NormalizeLogicalFamilyTask, "#ff0000"/*chartDiag.default.Colors.Red*/);
		tasks.addTask('OrgTreeTask', ['NormalizeLogicalFamilyTask', 'defaultItemConfig'], chartDiag.famChart.OrgTreeTask, "#ff0000"/*chartDiag.default.Colors.Red*/);

		// Transformations / Templates
		tasks.addTask('ReadTemplatesTask', ['TemplatesOptionTask'], chartDiag.pdf.orgChart.ReadTemplatesTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);

		tasks.addTask('ItemTemplateParamsTask', ['ItemsSizesOptionTask', 'CursorItemOptionTask', 'ReadTemplatesTask'], chartDiag.orgChart.ItemTemplateParamsTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);

		tasks.addTask('LabelAnnotationTemplateParamsTask', ['ItemsSizesOptionTask', 'LabelAnnotationTemplateOptionTask', 'ReadTemplatesTask'], chartDiag.famChart.LabelAnnotationTemplateParamsTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('CombinedTemplateParamsTask', ['ItemTemplateParamsTask', 'LabelAnnotationTemplateParamsTask'], chartDiag.famChart.CombinedTemplateParamsTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);

		tasks.addTask('GroupTitleTemplateTask', ['TemplatesOptionTask'], chartDiag.pdf.orgChart.GroupTitleTemplateTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('CheckBoxTemplateTask', ['ItemsSizesOptionTask'], chartDiag.pdf.orgChart.CheckBoxTemplateTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('ButtonsTemplateTask', ['ItemsSizesOptionTask'], chartDiag.pdf.orgChart.ButtonsTemplateTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('AnnotationLabelTemplateTask', ['ItemsOptionTask'], chartDiag.pdf.orgChart.AnnotationLabelTemplateTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('PrintPreviewTemplateTask', ['ItemsOptionTask'], chartDiag.pdf.orgChart.PrintPreviewTemplateTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);

		tasks.addTask('VisualTreeTask', ['OrgTreeTask', 'CombinedTemplateParamsTask', 'VisualTreeOptionTask', 'isFamilyChartMode'], chartDiag.orgChart.VisualTreeTask, "#ff0000"/*chartDiag.default.Colors.Red*/);
		tasks.addTask('VisualTreeLevelsTask', ['VisualTreeTask', 'CombinedTemplateParamsTask'], chartDiag.orgChart.VisualTreeLevelsTask, "#ff0000"/*chartDiag.default.Colors.Red*/);
		tasks.addTask('VisualTreeMarginsTask', ['VisualTreeTask'], chartDiag.orgChart.VisualTreeMarginsTask, "#ff0000"/*chartDiag.default.Colors.Red*/);

		tasks.addTask('ConnectionsGraphTask', ['VisualTreeTask', 'VisualTreeLevelsTask', 'OrgTreeTask' /*ExtraPartnersTask*/], chartDiag.orgChart.ConnectionsGraphTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('TracePathAnnotationsTask', ['HighlightPathAnnotationOptionTask', 'ConnectionsGraphTask', 'OrgTreeTask', 'VisualTreeTask', 'AddLabelAnnotationsTask'], chartDiag.orgChart.TracePathAnnotationsTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);

		// Transformations/Selections
		tasks.addTask('HighlightItemTask', ['HighlightItemOptionTask', 'OrgTreeTask'], chartDiag.orgChart.HighlightItemTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);

		tasks.addTask('CursorItemTask', ['CursorItemOptionTask', 'OrgTreeTask'], chartDiag.orgChart.CursorItemTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('SelectedItemsTask', ['SelectedItemsOptionTask'], chartDiag.orgChart.SelectedItemsTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);

		tasks.addTask('CombinedNormalVisibilityItemsTask', ['OptionsTask'], chartDiag.pdf.orgChart.DummyCombinedNormalVisibilityItemsTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('CurrentControlSizeTask', ['OptionsTask'], chartDiag.pdf.orgChart.DummyCurrentControlSizeTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);

		tasks.addTask('ItemsPositionsTask', ['CurrentControlSizeTask', 'ScaleOptionTask', 'OrientationOptionTask', 'ItemsSizesOptionTask', 'ConnectorsOptionTask', 'VisualTreeOptionTask',
			'OrgTreeTask' /*ExtraPartnersTask*/,
			'IntervalsTask', 'VisualTreeTask', 'VisualTreeLevelsTask', 'VisualTreeMarginsTask',
			'CombinedTemplateParamsTask',
			'CursorItemTask', 'CombinedNormalVisibilityItemsTask'], chartDiag.orgChart.ItemsPositionsTask, "#ff0000"/*chartDiag.default.Colors.Red*/);

		tasks.addTask('AlignDiagramTask', ['OrientationOptionTask', 'ItemsSizesOptionTask', 'VisualTreeOptionTask', 'ScaleOptionTask', 'PrintPreviewOptionTask', 'CurrentControlSizeTask', 'VisualTreeTask', 'VisualTreeLevelsTask', 'ItemsPositionsTask', 'isFamilyChartMode'], chartDiag.orgChart.AlignDiagramTask, "#ff0000"/*chartDiag.default.Colors.Red*/);
		tasks.addTask('CreateTransformTask', ['OrientationOptionTask', 'AlignDiagramTask'], chartDiag.orgChart.CreateTransformTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);

		// Managers
		tasks.addTask('BackgroundAnnotationManagerTask', ['ItemsSizesOptionTask', 'OrgTreeTask', 'VisualTreeLevelsTask', 'AlignDiagramTask'], chartDiag.orgChart.BackgroundAnnotationManagerTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('PaletteManagerTask', ['ConnectorsOptionTask', 'LinePaletteOptionTask'], chartDiag.orgChart.PaletteManagerTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);

		// Renders
		tasks.addTask('DrawBackgroundAnnotationTask', ['graphics', 'CreateTransformTask', 'ApplyLayoutChangesTask', 'BackgroundAnnotationOptionTask', 'AddLabelAnnotationsTask', 'AlignDiagramTask', 'BackgroundAnnotationManagerTask'], chartDiag.orgChart.DrawBackgroundAnnotationTask, "#008000"/*chartDiag.default.Colors.Green*/);
		tasks.addTask('DrawBackgroundShapeAnnotationTask', ['graphics', 'CreateTransformTask', 'ApplyLayoutChangesTask', 'OrientationOptionTask', 'BackgroundShapeAnnotationOptionTask', 'AlignDiagramTask', 'AnnotationLabelTemplateTask', 'background', 'DrawBackgroundAnnotationTask'], chartDiag.orgChart.DrawShapeAnnotationTask, "#008000"/*chartDiag.default.Colors.Green*/);
		tasks.addTask('DrawBackgroundConnectorAnnotationTask', ['graphics', 'CreateTransformTask', 'ApplyLayoutChangesTask', 'OrientationOptionTask', 'BackgroundConnectorAnnotationOptionTask', 'AlignDiagramTask', 'AnnotationLabelTemplateTask', 'background', 'DrawBackgroundShapeAnnotationTask'], chartDiag.orgChart.DrawConnectorAnnotationTask, "#008000"/*chartDiag.default.Colors.Green*/);

		tasks.addTask('DrawTreeItemsTask', ['graphics', 'CreateTransformTask', 'ApplyLayoutChangesTask',
			'ItemsSizesOptionTask',
			'CombinedContextsTask',
			'VisualTreeTask', 'AlignDiagramTask', 'CombinedTemplateParamsTask',
			'CursorItemTask', 'SelectedItemsTask',
			'GroupTitleTemplateTask', 'CheckBoxTemplateTask', 'ButtonsTemplateTask',
			'DrawBackgroundConnectorAnnotationTask'
		], chartDiag.orgChart.DrawTreeItemsTask, "#008000"/*chartDiag.default.Colors.Green*/);

		tasks.addTask('DrawConnectorsTask', ['graphics', 'CreateTransformTask', 'ApplyLayoutChangesTask', 'ConnectorsOptionTask', 'VisualTreeTask', 'VisualTreeLevelsTask', 'AlignDiagramTask', 'TracePathAnnotationsTask', 'OrgTreeTask'/*ExtraPartnersTask*/, 'showElbowDots', 'PaletteManagerTask', 'DrawTreeItemsTask'], chartDiag.orgChart.DrawConnectorsTask, "#008000"/*chartDiag.default.Colors.Green*/);

		tasks.addTask('DrawCursorTask', ['graphics', 'CreateTransformTask', 'ApplyLayoutChangesTask', 'CombinedContextsTask', 'AlignDiagramTask', 'CombinedTemplateParamsTask', 'CursorItemTask', 'SelectedItemsTask', 'DrawConnectorsTask'], chartDiag.orgChart.DrawCursorTask, "#008000"/*chartDiag.default.Colors.Green*/);
		tasks.addTask('DrawHighlightTask', ['graphics', 'CreateTransformTask', 'ApplyLayoutChangesTask', 'CombinedContextsTask', 'AlignDiagramTask', 'CombinedTemplateParamsTask', 'HighlightItemTask', 'CursorItemTask', 'SelectedItemsTask', 'DrawCursorTask'], chartDiag.orgChart.DrawHighlightTask, "#008000"/*chartDiag.default.Colors.Green*/);

		tasks.addTask('DrawForegroundShapeAnnotationTask', ['graphics', 'CreateTransformTask', 'ApplyLayoutChangesTask', 'OrientationOptionTask', 'ForegroundShapeAnnotationOptionTask', 'AlignDiagramTask', 'AnnotationLabelTemplateTask', 'foreground', 'DrawHighlightTask'], chartDiag.orgChart.DrawShapeAnnotationTask, "#008000"/*chartDiag.default.Colors.Green*/);
		tasks.addTask('DrawForegroundConnectorAnnotationTask', ['graphics', 'CreateTransformTask', 'ApplyLayoutChangesTask', 'OrientationOptionTask', 'ForegroundConnectorAnnotationOptionTask', 'AlignDiagramTask', 'AnnotationLabelTemplateTask', 'foreground', 'DrawForegroundShapeAnnotationTask'], chartDiag.orgChart.DrawConnectorAnnotationTask, "#008000"/*chartDiag.default.Colors.Green*/);

		tasks.addTask('DrawPrintPreviewTask', ['graphics', 'ApplyLayoutChangesTask', 'PrintPreviewOptionTask', 'AlignDiagramTask', 'PrintPreviewTemplateTask', 'ScaleOptionTask', 'DrawForegroundConnectorAnnotationTask'], chartDiag.orgChart.DrawPrintPreviewTask, "#008000"/*chartDiag.default.Colors.Green*/);

		return tasks;
	}

	function createEventArgs(data, oldTreeItemId, newTreeItemId, name) {
		var result = new chartDiag.famChart.EventArgs(),
			combinedContextsTask = data.tasks.getTask("CombinedContextsTask"),
			alignDiagramTask = data.tasks.getTask("AlignDiagramTask"),
			navigationFamilyTask = data.tasks.getTask("AddLabelAnnotationsTask"),
			oldItemConfig = combinedContextsTask.getConfig(oldTreeItemId),
			newItemConfig = combinedContextsTask.getConfig(newTreeItemId),
			navigationFamily = navigationFamilyTask.getNavigationFamily(),
			itemPosition;

		if (oldItemConfig && oldItemConfig.id != null) {
			result.oldContext = oldItemConfig;
		}

		if (newItemConfig && newItemConfig.id != null) {
			result.context = newItemConfig;

			navigationFamily.loopParents(this, newItemConfig.id, function (itemid, item, levelIndex) {
				if (levelIndex > 0) {
					return navigationFamily.BREAK;
				}
				result.parentItems.push(combinedContextsTask.getConfig(itemid));
			});

			itemPosition = alignDiagramTask.getItemPosition(newTreeItemId);
			result.position = new chartDiag.default.Rect(itemPosition.actualPosition);
		}

		if (name != null) {
			result.name = name;
		}

		return result;
	}

	function trigger(eventHandlerName, event, eventArgs) {
		var eventHandler = _data.options[eventHandlerName];
		if (eventHandler != null) {
			eventHandler(event, eventArgs);
		}
	}

	function _disableNotAvailableFunctionality() {
		/* disable functionality not available in PDF */
		_data.options.hasButtons = 2/*chartDiag.default.Enabled.False*/;
		_data.options.pageFitMode = 5/*chartDiag.default.PageFitMode.AutoSize*/;
		_data.options.autoSizeMaximum = new chartDiag.default.Size(100000, 100000);
	}

	function draw(doc, positionX, positionY) {
		_data.doc = doc;

		_data.tasks = createTaskManager(getOptions, getGraphics);
		_data.graphics = new chartDiag.pdf.graphics(_data.doc);
		_data.graphics.debug = _debug;

		_disableNotAvailableFunctionality();

		_data.doc.save();

		_data.doc.translate(positionX, positionY);

		_data.tasks.process('OptionsTask', null, _debug);

		_data.doc.restore();

		var alignDiagramTask = _data.tasks.getTask("AlignDiagramTask");

		return new chartDiag.default.Size(alignDiagramTask.getContentSize());
	}

	function getSize() {
		_data.tasks = createTaskManager(getOptions, getGraphics);

		_disableNotAvailableFunctionality();

		_data.tasks.process('OptionsTask', 'AlignDiagramTask', _debug);

		var alignDiagramTask = _data.tasks.getTask("AlignDiagramTask");

		return new chartDiag.default.Size(alignDiagramTask.getContentSize());
	}

	return {
		draw: draw,
		getSize: getSize
	};
};

/* /pdf/Models/Template.js*/
chartDiag.pdf.Template = function (options, templateConfig) {
	this.templateConfig = null;
	this.itemTemplate = null;
	this.highlightTemplate = null;
	this.dotHighlightTemplate = null;
	this.cursorTemplate = null;

	if (templateConfig != null) {
		this.templateConfig = templateConfig;

		this.itemTemplate = chartDiag.default.isNullOrEmpty(templateConfig.itemTemplate) ?
			new chartDiag.pdf.ItemTemplate(options, templateConfig) :
			new chartDiag.pdf.UserTemplate(options, templateConfig, options.onItemRender);

		this.highlightTemplate = chartDiag.default.isNullOrEmpty(templateConfig.highlightTemplate) ?
			new chartDiag.pdf.HighlightTemplate(options, templateConfig) :
			new chartDiag.pdf.UserTemplate(options, templateConfig, options.onHighlightRender);

		this.dotHighlightTemplate = new chartDiag.pdf.DummyTemplate(options, templateConfig);

		this.cursorTemplate = chartDiag.default.isNullOrEmpty(templateConfig.cursorTemplate) ?
			new chartDiag.pdf.CursorTemplate(options, templateConfig) :
			new chartDiag.pdf.UserTemplate(options, templateConfig, options.onCursorRender);
	}
};

/* /pdf/OrgDiagram/Tasks/Layout/DummyCurrentControlSizeTask.js*/
chartDiag.pdf.orgChart.DummyCurrentControlSizeTask = function (optionsTask) {
	function process() {
		return true;
	}

	function getScrollPanelSize() {
		return new chartDiag.default.Size(800, 600);
	}

	function getOptimalPanelSize() {
		return new chartDiag.default.Size(800 - 25, 600 - 25);
	}

	return {
		process: process,
		getScrollPanelSize: getScrollPanelSize,
		getOptimalPanelSize: getOptimalPanelSize
	};
};

/* /pdf/OrgDiagram/Tasks/Templates/AnnotationLabelTemplateTask.js*/
chartDiag.pdf.orgChart.AnnotationLabelTemplateTask = function (itemsSizesOptionTask) {
	var _data = {
		template: null
	};

	function process() {
		return false;
	}

	function getTemplate() {
		if (_data.template == null) {
			_data.template = new chartDiag.pdf.AnnotationLabelTemplate();
		}
		return _data.template;
	}

	return {
		process: process,
		getTemplate: getTemplate
	};
};

/* /pdf/OrgDiagram/Tasks/Templates/ButtonsTemplateTask.js*/
chartDiag.pdf.orgChart.ButtonsTemplateTask = function (itemsSizesOptionTask) {
	var _data = {
		template: null
	};

	function process() {
		return false;
	}

	function getTemplate() {
		if (_data.template == null) {
			_data.template = new chartDiag.pdf.DummyTemplate();
		}
		return _data.template;
	}

	return {
		process: process,
		getTemplate: getTemplate
	};
};

/* /pdf/OrgDiagram/Tasks/Templates/CheckboxTemplateTask.js*/
chartDiag.pdf.orgChart.CheckBoxTemplateTask = function (itemsSizesOptionTask) {
	var _data = {
		template: null
	};

	function process() {
		_data.template = null;
		return true;
	}

	function getTemplate() {
		var options;
		if (_data.template == null) {
			options = itemsSizesOptionTask.getOptions();
			_data.template = new chartDiag.pdf.CheckBoxTemplate(options.selectCheckBoxLabel);
		}
		return _data.template;
	}

	return {
		process: process,
		getTemplate: getTemplate
	};
};

/* /pdf/OrgDiagram/Tasks/Templates/GroupTitleTemplateTask.js*/
chartDiag.pdf.orgChart.GroupTitleTemplateTask = function (templatesOptionTask) {
	var _data = {
		template: null
	};

	function process() {
		_data.template = null;
		return true;
	}

	function getTemplate() {
		var options;
		if (_data.template == null) {
			options = templatesOptionTask.getOptions();
			_data.template = new chartDiag.pdf.GroupTitleTemplate(options.itemTitleFirstFontColor, options.itemTitleSecondFontColor);
		}
		return _data.template;
	}

	return {
		process: process,
		getTemplate: getTemplate
	};
};

/* /pdf/OrgDiagram/Tasks/Templates/PrintPreviewTemplateTask.js*/
chartDiag.pdf.orgChart.PrintPreviewTemplateTask = function (itemsSizesOptionTask) {
	var _data = {
		template: null
	};

	function process() {
		return false;
	}

	function getTemplate() {
		if (_data.template == null) {
			_data.template = new chartDiag.pdf.PrintPreviewTemplate();
		}
		return _data.template;
	}

	return {
		process: process,
		getTemplate: getTemplate
	};
};

/* /pdf/OrgDiagram/Tasks/Templates/ReadTemplatesTask.js*/
chartDiag.pdf.orgChart.ReadTemplatesTask = function (templatesOptionTask) {
	var _data = {
		templates: {}
	},
	_defaultWidgetTemplateName = "DefaultWidgetTemplate",
	_defaultWidgetLabelAnnotationTemplateName = "DefaultWidgetLabelAnnotationTemplate";

	function process() {
		var index, len,
			templateConfig,
			templatesOptions = templatesOptionTask.getOptions(),
			templates = templatesOptions.templates;


		_data.templates = {};
		_data.templates[_defaultWidgetTemplateName] = new chartDiag.pdf.Template(templatesOptions, new chartDiag.orgChart.TemplateConfig());

		var labelAnnotationTemplateConfig = new chartDiag.orgChart.TemplateConfig();
		labelAnnotationTemplateConfig.name = _defaultWidgetLabelAnnotationTemplateName;
		labelAnnotationTemplateConfig.isActive = false;
		labelAnnotationTemplateConfig.itemSize = new chartDiag.default.Size(100, 20);
		labelAnnotationTemplateConfig.minimizedItemSize = new chartDiag.default.Size(0, 0);

		var labelAnnotationTemplate = new chartDiag.pdf.Template();
		labelAnnotationTemplate.templateConfig = labelAnnotationTemplateConfig;
		labelAnnotationTemplate.minimizedItemCornerRadius = labelAnnotationTemplateConfig.minimizedItemSize.width / 2;
		labelAnnotationTemplate.itemTemplate = new chartDiag.pdf.LabelAnnotationTemplate();
		labelAnnotationTemplate.dotHighlightTemplate = new chartDiag.pdf.DummyTemplate();

		_data.templates[_defaultWidgetLabelAnnotationTemplateName] = labelAnnotationTemplate;


		for (index = 0, len = templates.length; index < len; index += 1) {
			templateConfig = templates[index];
			_data.templates[templateConfig.name] = new chartDiag.pdf.Template(templatesOptions, templateConfig);
		}

		return true;
	}

	function getTemplate(templateName1, templateName2, templateName3) {
		var result = _data.templates[templateName1] || _data.templates[templateName2] || _data.templates[templateName3];
		return result;
	}

	return {
		process: process,
		getTemplate: getTemplate,
		DefaultWidgetTemplateName: _defaultWidgetTemplateName,
		DefaultWidgetLabelAnnotationTemplateName: _defaultWidgetLabelAnnotationTemplateName
	};
};

/* /pdf/OrgDiagram/Tasks/Transformations/Selection/DummyCombinedNormalVisibilityItemsTask.js*/
chartDiag.pdf.orgChart.DummyCombinedNormalVisibilityItemsTask = function (optionsTask) {
	function process() {
		return true;
	}

	function isItemSelected(treeItem) {
		return false;
	}

	return {
		process: process,
		isItemSelected: isItemSelected
	};
};

/* /pdf/OrgDiagram/Plugin.js*/
chartDiag.pdf.orgChart.Plugin = function (options) {
	var _data = {
		name: "orgChart",
		doc: null,
		options: options,
		tasks: null,
		graphics: null
	},
	_scale,
	_debug = false;

	function getOptions() {
		return _data.options;
	}

	function getGraphics() {
		return _data.graphics;
	}

	function createTaskManager() {
		var tasks = new chartDiag.default.TaskManager();

		// Dependencies
		tasks.addDependency('options', getOptions);
		tasks.addDependency('graphics', getGraphics);

		tasks.addDependency('defaultConfig', new chartDiag.orgChart.Config());
		tasks.addDependency('defaultItemConfig', new chartDiag.orgChart.ItemConfig());
		tasks.addDependency('defaultTemplateConfig', new chartDiag.orgChart.TemplateConfig());
		tasks.addDependency('defaultButtonConfig', new chartDiag.orgChart.ButtonConfig());

		tasks.addDependency('defaultBackgroundAnnotationConfig', new chartDiag.orgChart.BackgroundAnnotationConfig());
		tasks.addDependency('defaultConnectorAnnotationConfig', new chartDiag.orgChart.ConnectorAnnotationConfig());
		tasks.addDependency('defaultHighlightPathAnnotationConfig', new chartDiag.orgChart.HighlightPathAnnotationConfig());
		tasks.addDependency('defaultShapeAnnotationConfig', new chartDiag.orgChart.ShapeAnnotationConfig());

		tasks.addDependency('isFamilyChartMode', false);
		tasks.addDependency('showElbowDots', false);
		tasks.addDependency('null', null);
		tasks.addDependency('foreground', 2/*chartDiag.default.ZOrderType.Foreground*/);
		tasks.addDependency('background', 1/*chartDiag.default.ZOrderType.Background*/);

		// Options
		tasks.addTask('OptionsTask', ['options'], chartDiag.orgChart.OptionsTask, "#000000"/*chartDiag.default.Colors.Black*/);

		tasks.addTask('CalloutOptionTask', ['OptionsTask', 'defaultConfig', 'defaultItemConfig'], chartDiag.orgChart.CalloutOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('ConnectorsOptionTask', ['OptionsTask', 'defaultConfig'], chartDiag.orgChart.ConnectorsOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('ItemsOptionTask', ['OptionsTask', 'defaultItemConfig'], chartDiag.orgChart.ItemsOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('ItemsSizesOptionTask', ['OptionsTask', 'defaultConfig', 'defaultItemConfig', 'defaultButtonConfig'], chartDiag.orgChart.ItemsSizesOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('PrintPreviewOptionTask', ['OptionsTask', 'defaultConfig'], chartDiag.orgChart.PrintPreviewOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('TemplatesOptionTask', ['OptionsTask', 'defaultConfig', 'defaultButtonConfig', 'defaultTemplateConfig'], chartDiag.orgChart.TemplatesOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('OrientationOptionTask', ['OptionsTask', 'defaultConfig'], chartDiag.orgChart.OrientationOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('VisualTreeOptionTask', ['OptionsTask', 'defaultConfig'], chartDiag.orgChart.VisualTreeOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);

		tasks.addTask('CursorItemOptionTask', ['OptionsTask', 'defaultConfig'], chartDiag.orgChart.CursorItemOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('HighlightItemOptionTask', ['OptionsTask', 'defaultConfig'], chartDiag.orgChart.HighlightItemOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('SelectedItemsOptionTask', ['OptionsTask'], chartDiag.orgChart.SelectedItemsOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);

		tasks.addTask('SplitAnnotationsOptionTask', ['OptionsTask'], chartDiag.orgChart.SplitAnnotationsOptionTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);

		tasks.addTask('ForegroundShapeAnnotationOptionTask', ['SplitAnnotationsOptionTask', 'defaultShapeAnnotationConfig', 'foreground'], chartDiag.orgChart.ShapeAnnotationOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('BackgroundShapeAnnotationOptionTask', ['SplitAnnotationsOptionTask', 'defaultShapeAnnotationConfig', 'background'], chartDiag.orgChart.ShapeAnnotationOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('HighlightPathAnnotationOptionTask', ['SplitAnnotationsOptionTask', 'defaultConfig', 'defaultHighlightPathAnnotationConfig'], chartDiag.orgChart.HighlightPathAnnotationOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('ForegroundConnectorAnnotationOptionTask', ['SplitAnnotationsOptionTask', 'defaultConnectorAnnotationConfig', 'foreground'], chartDiag.orgChart.ConnectorAnnotationOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('BackgroundConnectorAnnotationOptionTask', ['SplitAnnotationsOptionTask', 'defaultConnectorAnnotationConfig', 'background'], chartDiag.orgChart.ConnectorAnnotationOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);
		tasks.addTask('BackgroundAnnotationOptionTask', ['SplitAnnotationsOptionTask', 'defaultBackgroundAnnotationConfig'], chartDiag.orgChart.BackgroundAnnotationOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);

		tasks.addTask('ScaleOptionTask', ['OptionsTask', 'defaultConfig'], chartDiag.orgChart.ScaleOptionTask, "#000080"/*chartDiag.default.Colors.Navy*/);

		// Transformations
		tasks.addTask('CombinedContextsTask', ['ItemsOptionTask'], chartDiag.orgChart.CombinedContextsTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('IntervalsTask', ['ItemsSizesOptionTask'], chartDiag.orgChart.IntervalsTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('OrgTreeTask', ['ItemsOptionTask'], chartDiag.orgChart.OrgTreeTask, "#ff0000"/*chartDiag.default.Colors.Red*/);

		// Transformations / Templates
		tasks.addTask('ReadTemplatesTask', ['TemplatesOptionTask'], chartDiag.pdf.orgChart.ReadTemplatesTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		// TODO: Add jsPDF templates
		tasks.addTask('ItemTemplateParamsTask', ['ItemsSizesOptionTask', 'CursorItemOptionTask', 'ReadTemplatesTask'], chartDiag.orgChart.ItemTemplateParamsTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('GroupTitleTemplateTask', ['TemplatesOptionTask'], chartDiag.pdf.orgChart.GroupTitleTemplateTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('CheckBoxTemplateTask', ['ItemsSizesOptionTask'], chartDiag.pdf.orgChart.CheckBoxTemplateTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('ButtonsTemplateTask', ['ItemsSizesOptionTask'], chartDiag.pdf.orgChart.ButtonsTemplateTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('AnnotationLabelTemplateTask', ['ItemsOptionTask'], chartDiag.pdf.orgChart.AnnotationLabelTemplateTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('PrintPreviewTemplateTask', ['ItemsOptionTask'], chartDiag.pdf.orgChart.PrintPreviewTemplateTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);

		tasks.addTask('VisualTreeTask', ['OrgTreeTask', 'ItemTemplateParamsTask', 'VisualTreeOptionTask', 'isFamilyChartMode'], chartDiag.orgChart.VisualTreeTask, "#ff0000"/*chartDiag.default.Colors.Red*/);
		tasks.addTask('VisualTreeLevelsTask', ['VisualTreeTask', 'ItemTemplateParamsTask'], chartDiag.orgChart.VisualTreeLevelsTask, "#ff0000"/*chartDiag.default.Colors.Red*/);
		tasks.addTask('VisualTreeMarginsTask', ['VisualTreeTask'], chartDiag.orgChart.VisualTreeMarginsTask, "#ff0000"/*chartDiag.default.Colors.Red*/);

		tasks.addTask('ExtraPartnersTask', ['VisualTreeTask'], chartDiag.orgChart.DummyExtraPartnersTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);

		tasks.addTask('ConnectionsGraphTask', ['VisualTreeTask', 'VisualTreeLevelsTask', 'ExtraPartnersTask'], chartDiag.orgChart.ConnectionsGraphTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('TracePathAnnotationsTask', ['HighlightPathAnnotationOptionTask', 'ConnectionsGraphTask', 'OrgTreeTask', 'VisualTreeTask', 'VisualTreeTask'], chartDiag.orgChart.TracePathAnnotationsTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);

		

		// Transformations/Selections
		tasks.addTask('HighlightItemTask', ['HighlightItemOptionTask', 'OrgTreeTask'], chartDiag.orgChart.HighlightItemTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);

		tasks.addTask('CursorItemTask', ['CursorItemOptionTask', 'OrgTreeTask'], chartDiag.orgChart.CursorItemTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('SelectedItemsTask', ['SelectedItemsOptionTask'], chartDiag.orgChart.SelectedItemsTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('CombinedNormalVisibilityItemsTask', ['OptionsTask'], chartDiag.pdf.orgChart.DummyCombinedNormalVisibilityItemsTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);

		tasks.addTask('CurrentControlSizeTask', ['OptionsTask'], chartDiag.pdf.orgChart.DummyCurrentControlSizeTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('ItemsPositionsTask', ['CurrentControlSizeTask', 'ScaleOptionTask', 'OrientationOptionTask', 'ItemsSizesOptionTask', 'ConnectorsOptionTask', 'VisualTreeOptionTask',
			'ExtraPartnersTask',
			'IntervalsTask', 'VisualTreeTask', 'VisualTreeLevelsTask', 'VisualTreeMarginsTask', 
			'ItemTemplateParamsTask',
			'CursorItemTask', 'CombinedNormalVisibilityItemsTask'], chartDiag.orgChart.ItemsPositionsTask, "#ff0000"/*chartDiag.default.Colors.Red*/);

		tasks.addTask('AlignDiagramTask', ['OrientationOptionTask', 'ItemsSizesOptionTask', 'VisualTreeOptionTask', 'ScaleOptionTask', 'PrintPreviewOptionTask', 'CurrentControlSizeTask', 'VisualTreeTask', 'VisualTreeLevelsTask', 'ItemsPositionsTask', 'isFamilyChartMode'], chartDiag.orgChart.AlignDiagramTask, "#ff0000"/*chartDiag.default.Colors.Red*/);
		tasks.addTask('CreateTransformTask', ['OrientationOptionTask', 'AlignDiagramTask'], chartDiag.orgChart.CreateTransformTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);

		// Managers
		tasks.addTask('BackgroundAnnotationManagerTask', ['ItemsSizesOptionTask', 'OrgTreeTask', 'VisualTreeLevelsTask', 'AlignDiagramTask'], chartDiag.orgChart.BackgroundAnnotationManagerTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);
		tasks.addTask('PaletteManagerTask', ['ConnectorsOptionTask', 'null'], chartDiag.orgChart.PaletteManagerTask, "#00ffff"/*chartDiag.default.Colors.Cyan*/);

		// Renders
		tasks.addTask('DrawBackgroundAnnotationTask', ['graphics', 'CreateTransformTask', 'ApplyLayoutChangesTask', 'BackgroundAnnotationOptionTask', 'VisualTreeTask', 'AlignDiagramTask', 'BackgroundAnnotationManagerTask'], chartDiag.orgChart.DrawBackgroundAnnotationTask, "#008000"/*chartDiag.default.Colors.Green*/);
		tasks.addTask('DrawBackgroundShapeAnnotationTask', ['graphics', 'CreateTransformTask', 'ApplyLayoutChangesTask', 'OrientationOptionTask', 'BackgroundShapeAnnotationOptionTask', 'AlignDiagramTask', 'AnnotationLabelTemplateTask', 'background', 'DrawBackgroundAnnotationTask' /*dummy dependency enforeces drawing order */], chartDiag.orgChart.DrawShapeAnnotationTask, "#008000"/*chartDiag.default.Colors.Green*/);
		tasks.addTask('DrawBackgroundConnectorAnnotationTask', ['graphics', 'CreateTransformTask', 'ApplyLayoutChangesTask', 'OrientationOptionTask', 'BackgroundConnectorAnnotationOptionTask', 'AlignDiagramTask', 'AnnotationLabelTemplateTask', 'background', 'DrawBackgroundShapeAnnotationTask'], chartDiag.orgChart.DrawConnectorAnnotationTask, "#008000"/*chartDiag.default.Colors.Green*/);

		tasks.addTask('DrawTreeItemsTask', ['graphics', 'CreateTransformTask', 'ApplyLayoutChangesTask',
			'ItemsSizesOptionTask',
			'CombinedContextsTask',
			'VisualTreeTask', 'AlignDiagramTask', 'ItemTemplateParamsTask',
			'CursorItemTask', 'SelectedItemsTask',
			'GroupTitleTemplateTask', 'CheckBoxTemplateTask', 'ButtonsTemplateTask',
			'DrawBackgroundConnectorAnnotationTask'
		], chartDiag.orgChart.DrawTreeItemsTask, "#008000"/*chartDiag.default.Colors.Green*/);
		tasks.addTask('DrawConnectorsTask', ['graphics', 'CreateTransformTask', 'ApplyLayoutChangesTask', 'ConnectorsOptionTask', 'VisualTreeTask', 'VisualTreeLevelsTask', 'AlignDiagramTask', 'TracePathAnnotationsTask', 'ExtraPartnersTask', 'showElbowDots', 'PaletteManagerTask', 'DrawTreeItemsTask'], chartDiag.orgChart.DrawConnectorsTask, "#008000"/*chartDiag.default.Colors.Green*/);

		tasks.addTask('DrawForegroundShapeAnnotationTask', ['graphics', 'CreateTransformTask', 'ApplyLayoutChangesTask', 'OrientationOptionTask', 'ForegroundShapeAnnotationOptionTask', 'AlignDiagramTask', 'AnnotationLabelTemplateTask', 'foreground', 'DrawConnectorsTask'], chartDiag.orgChart.DrawShapeAnnotationTask, "#008000"/*chartDiag.default.Colors.Green*/);
		tasks.addTask('DrawForegroundConnectorAnnotationTask', ['graphics', 'CreateTransformTask', 'ApplyLayoutChangesTask', 'OrientationOptionTask', 'ForegroundConnectorAnnotationOptionTask', 'AlignDiagramTask', 'AnnotationLabelTemplateTask', 'foreground', 'DrawForegroundShapeAnnotationTask'], chartDiag.orgChart.DrawConnectorAnnotationTask, "#008000"/*chartDiag.default.Colors.Green*/);


		tasks.addTask('DrawCursorTask', ['graphics', 'CreateTransformTask', 'ApplyLayoutChangesTask', 'CombinedContextsTask', 'AlignDiagramTask', 'ItemTemplateParamsTask', 'CursorItemTask', 'SelectedItemsTask', 'DrawForegroundConnectorAnnotationTask'], chartDiag.orgChart.DrawCursorTask, "#008000"/*chartDiag.default.Colors.Green*/);
		tasks.addTask('DrawHighlightTask', ['graphics', 'CreateTransformTask', 'ApplyLayoutChangesTask', 'CombinedContextsTask', 'AlignDiagramTask', 'ItemTemplateParamsTask', 'HighlightItemTask', 'CursorItemTask', 'SelectedItemsTask', 'DrawCursorTask'], chartDiag.orgChart.DrawHighlightTask, "#008000"/*chartDiag.default.Colors.Green*/);
		tasks.addTask('DrawPrintPreviewTask', ['graphics', 'ApplyLayoutChangesTask', 'PrintPreviewOptionTask', 'AlignDiagramTask', 'PrintPreviewTemplateTask', 'ScaleOptionTask', 'DrawHighlightTask'], chartDiag.orgChart.DrawPrintPreviewTask, "#008000"/*chartDiag.default.Colors.Green*/);

		return tasks;
	}

	function createEventArgs(data, oldTreeItemId, newTreeItemId, name) {
		var result = new chartDiag.orgChart.EventArgs(),
			combinedContextsTask = data.tasks.getTask("CombinedContextsTask"),
			alignDiagramTask = data.tasks.getTask("AlignDiagramTask"),
			oldItemConfig = combinedContextsTask.getConfig(oldTreeItemId),
			newItemConfig = combinedContextsTask.getConfig(newTreeItemId),
			itemPosition,
			actualPosition;

		if (oldItemConfig && oldItemConfig.id != null) {
			result.oldContext = oldItemConfig;
		}

		if (newItemConfig && newItemConfig.id != null) {
			result.context = newItemConfig;

			if (newItemConfig.parent !== null) {
				result.parentItem = combinedContextsTask.getConfig(newItemConfig.parent);
			}

			itemPosition = alignDiagramTask.getItemPosition(newTreeItemId),
			result.position = new chartDiag.default.Rect(itemPosition.actualPosition);
		}

		if (name != null) {
			result.name = name;
		}

		return result;
	}

	function trigger(eventHandlerName, event, eventArgs) {
		var eventHandler = _data.options[eventHandlerName];
		if (eventHandler != null) {
			eventHandler(event, eventArgs);
		}
	}

	function _disableNotAvailableFunctionality() {
		/* disable functionality not available in PDF */
		_data.options.hasButtons = 2/*chartDiag.default.Enabled.False*/;
		_data.options.pageFitMode = 5/*chartDiag.default.PageFitMode.AutoSize*/;
		_data.options.autoSizeMaximum = new chartDiag.default.Size(100000, 100000);
	}

	function draw(doc, positionX, positionY) {
		_data.doc = doc;

		_data.tasks = createTaskManager(getOptions, getGraphics);
		_data.graphics = new chartDiag.pdf.graphics(_data.doc);
		_data.graphics.debug = _debug;

		_disableNotAvailableFunctionality();

		_data.doc.save();

		_data.doc.translate(positionX, positionY);

		_data.tasks.process('OptionsTask', null, _debug);

		_data.doc.restore();

		var alignDiagramTask = _data.tasks.getTask("AlignDiagramTask");

		return new chartDiag.default.Size(alignDiagramTask.getContentSize());
	}

	function getSize() {
		_data.tasks = createTaskManager(getOptions, getGraphics);

		_disableNotAvailableFunctionality();

		_data.tasks.process('OptionsTask', 'AlignDiagramTask', _debug);

		var alignDiagramTask = _data.tasks.getTask("AlignDiagramTask");

		return new chartDiag.default.Size(alignDiagramTask.getContentSize());
	}

	return {
		draw: draw,
		getSize: getSize
	};
};

/* /pdf/Templates/AnnotationLabelTemplate.js*/
/* jshint latedef: true, unused: false */
chartDiag.pdf.AnnotationLabelTemplate = function () {
	function template() {
		return {};
	}

	function getHashCode() {
		return 0;
	}

	function render(doc, position, data) {
		var annotationConfig = data.context;

		doc.save();

		doc.font('Helvetica', 12)
			.text(annotationConfig.label, position.x, position.y, {
				width: position.width,
				height: position.height,
				align: 'center'
			});

		doc.restore();
	}

	return {
		template: template,
		getHashCode: getHashCode,
		render: render
	};
};

/* /pdf/Templates/CheckBoxTemplate.js*/
chartDiag.pdf.CheckBoxTemplate = function (selectCheckBoxLabel) {
	var _checked = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAF/SURBVDhPpZM7rwFREMf/u4hEY5vVkigoSERiKwq1QqOh28R30QnFRqnSKHwFn0C37Sbi0SCE2KzE41wzd/feG48g91ftmdn5zznzkLLZrNhutzidTvgEv98PRVEgxeNx0e12EYvFcDweXfdjZFmGEIKDx+MxdF0HotGomEwmV/tnUAzFyqT8KrNHLpdDJpPBZrPh81UHLPAO7XYb6/Ua8/kcpmnC5/NBkqT3BJbLJRqNBgKBACqVCgqFAg6HA/veEiiVSlBVFZfLBZ1Ox7V+81KAMtPVV6sV+v2+a/2FBeg9RDqdhqZp/E1Mp1O0Wi32V6tVLuAtLEBvGw6HmM1m2O/3yOfz7CyXy4hEItz3ZrPJtr/8dIEKUiwWYRgGX3e32yGZTOJ8PnMBB4MBB9xy14VarcaZFosFQqEQHMdBvV5HIpFw/3gATZNlWTxdHr1eT4TDYZFKpVzLPRRDsU9HeTQaCdu23dM91wKzwNNlCgaDXINHW0pF95bpn+us4AsY2TIOZFyZ9AAAAABJRU5ErkJggg==',
		_unchecked = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAACjSURBVDhPrZNNCsQgDEY/f2q33sCCN+iNPJlXE2/gTtDiVBln1TJo+zZBJS+YELLvewkhIOeMETjnkFKCaK2LtRbbtiGl9H2+hlKKUkpLds7BGAMopYr3/rwfo+bUXFrN/yrfcXrQBDMwxkAImRfEGFucFnTeEdT/zNIEy7K0wyi/KfSGjPJoCp13BDM9EEK0eLtM67riOI7LLa0F+zI9XGeJDyTldfBA9FNyAAAAAElFTkSuQmCC';

	function template() {
		return {};
	}

	function getHashCode() {
		return 0;
	}

	function render(doc, position, data) {
		var image = data.isSelected ? _checked : _unchecked;

		doc.save();

		/* photo */
		doc.image(image, position.x, position.y);

		doc.font('Helvetica', 11)
			.text(selectCheckBoxLabel, position.x + 20, position.y + 4, {
				ellipsis: true,
				width: (position.width - 4),
				height: position.height,
				align: 'left'
			});

		doc.restore();
	}

	return {
		template: template,
		getHashCode: getHashCode,
		render: render
	};
};

/* /pdf/Templates/CursorTemplate.js*/
chartDiag.pdf.CursorTemplate = function (options, itemTemplateConfig) {
	var _config = itemTemplateConfig;

	function template() {
		return {};
	}

	function getHashCode() {
		return 0;
	}

	function render(doc, position, data) {
		doc.save();

		/* item border */
		doc.roundedRect(position.x, position.y, position.width, position.height, 4)
			.lineWidth(_config.cursorBorderWidth)
			.stroke('#fbd850');

		doc.restore();
	}

	return {
		template: template,
		getHashCode: getHashCode,
		render: render
	};
};

/* /pdf/Templates/DummyTemplate.js*/
chartDiag.pdf.DummyTemplate = function () {
	function template() {
		return {};
	}

	function getHashCode() {
		return 0;
	}

	function render() {}

	return {
		template: template,
		getHashCode: getHashCode,
		render: render
	};
};

/* /pdf/Templates/GroupTitleTemplate.js*/
chartDiag.pdf.GroupTitleTemplate = function (itemTitleFirstFontColor, itemTitleSecondFontColor ) {
	function template() {
		return {};
	}

	function getHashCode() {
		return 0;
	}

	function render(doc, position, data) {
		var config = new chartDiag.text.Config(),
			itemConfig = data.context,
			groupTitleColor = itemConfig.groupTitleColor || "#4169e1"/*chartDiag.default.Colors.RoyalBlue*/,
			color = chartDiag.default.highestContrast(groupTitleColor, itemTitleSecondFontColor, itemTitleFirstFontColor);

		/* title background */
		doc.save();
		doc.translate(position.width, 0)
			.rotate(90, {
			origin: [position.x, position.y]
		});
		doc.fillColor(groupTitleColor)
			.roundedRect(position.x, position.y, position.height - 2, position.width, 4)
			.fill();

		/* title */
		doc.fillColor(color)
			.font('Helvetica', 12)
			.text(itemConfig.groupTitle, position.x + 4, position.y + 6, {
				ellipsis: true,
				width: (position.height - 4),
				height: position.width - 4,
				align: 'center'
			});
		doc.restore();
	}

	return {
		template: template,
		getHashCode: getHashCode,
		render: render
	};
};


/* /pdf/Templates/HighlightTemplate.js*/
chartDiag.pdf.HighlightTemplate = function (options, itemTemplateConfig) {
	var _config = itemTemplateConfig;

	function template() {
		return {};
	}

	function getHashCode() {
		return 0;
	}

	function render(doc, position, data) {
		doc.save();

		/* border */
		doc.roundedRect(position.x, position.y, position.width, position.height, 4)
			.lineWidth(_config.highlightBorderWidth)
			.stroke('#fbcb09');

		doc.restore();
	}

	return {
		template: template,
		getHashCode: getHashCode,
		render: render
	};
};

/* /pdf/Templates/ItemTemplate.js*/
chartDiag.pdf.ItemTemplate = function (options, itemTemplateConfig) {
	var _config = itemTemplateConfig;

	function template() {
		return {};
	}

	function getHashCode() {
		return 0;
	}

	function render(doc, position, data) {
		var itemConfig = data.context,
			itemTitleColor = itemConfig.itemTitleColor != null ? itemConfig.itemTitleColor : "#4169e1"/*chartDiag.default.Colors.RoyalBlue*/,
			color = chartDiag.default.highestContrast(itemTitleColor, options.itemTitleSecondFontColor, options.itemTitleFirstFontColor),
			contentSize = new chartDiag.default.Size(_config.itemSize);

		contentSize.width -= _config.itemBorderWidth * 2;
		contentSize.height -= _config.itemBorderWidth * 2;

		doc.save();

		/* item border */
		doc.roundedRect(position.x, position.y, position.width, position.height, 4)
			.lineWidth(_config.itemBorderWidth)
			.stroke('#dddddd');

		/* title background */
		doc.fillColor(itemTitleColor)
			.roundedRect(position.x + 2, position.y + 2, (contentSize.width - 4), 18, 2)
			.fill();
		
		/* title */
		doc.fillColor(color)
			.font('Helvetica', 12)
			.text(itemConfig.title, position.x + 4, position.y + 7, {
				ellipsis: true,
				width: (contentSize.width - 4 - 4 * 2),
				height: 16,
				align: 'left'
			});

		/* photo */
		if (itemConfig.image != null) {
			doc.image(itemConfig.image, position.x + 3, position.y + 24);
		}
		/* photo frame */
		doc.rect(position.x + 3, position.y + 24, 50, 60)
			.stroke('#cccccc');

		/* description */
		doc.fillColor('black')
			.font('Helvetica', 10)
			.text(itemConfig.description, position.x + 56, position.y + 24, {
				ellipsis: true,
				width: (contentSize.width - 4 - 56),
				height: 74,
				align: 'left'
			});
		doc.restore();
	}

	return {
		template: template,
		getHashCode: getHashCode,
		render: render
	};
};

/* /pdf/Templates/LabelAnnotationTemplate.js*/
chartDiag.pdf.LabelAnnotationTemplate = function () {
	function template() {
		return {};
	}

	function getHashCode() {
		return 0;
	}

	function render(doc, position, data) {
		var itemConfig = data.context;

		doc.save();

		doc.font('Helvetica', 12)
			.text(itemConfig.title, position.x, position.y, {
				width: position.width,
				height: position.height,
				align: 'center'
			});

		doc.restore();
	}

	return {
		template: template,
		getHashCode: getHashCode,
		render: render
	};
};

/* /pdf/Templates/PrintPreviewTemplate.js*/
chartDiag.pdf.PrintPreviewTemplate = function (options) {
	function template() {
		return {};
	}

	function getHashCode() {
		return 0;
	}

	function render(doc, position, data) {
		doc.save();

		/* border */
		doc.roundedRect(position.x, position.y, position.width, position.height, 0)
			.doc.dash(2, 4)
			.lineWidth(1)
			.stroke('#cccccc');

		doc.restore();
	}

	return {
		template: template,
		getHashCode: getHashCode,
		render: render
	};
};

/* /pdf/Templates/UserTemplate.js*/
chartDiag.pdf.UserTemplate = function (options, itemTemplateConfig, onRender) {
	function template() {
		return {};
	}

	function getHashCode() {
		return 0;
	}

	function render(doc, position, data) {
		if (onRender != null) {
			onRender(doc, position, data);
		} else {
		    var itemTemplate = chartDiag.pdf.ItemTemplate(options, itemTemplateConfig);
			itemTemplate.render(doc, position, data);
		}
	}

	return {
		template: template,
		getHashCode: getHashCode,
		render: render
	};
};

/* /Widgets/callout/configs/Config.js*/
/*
	Class: chartDiag.callout.Config
		Callout options class.
	
*/
chartDiag.callout.Config = function () {
	this.classPrefix = "bpcallout";

	/*
		Property: graphicsType
			Preferable graphics type. If preferred graphics type is not supported widget switches to first available. 

		Default:
			<chartDiag.default.GraphicsType.SVG>
	*/
	this.graphicsType = 1/*chartDiag.default.GraphicsType.Canvas*/;

	/*
	Property: actualGraphicsType
		Actual graphics type.
	*/
	this.actualGraphicsType = null;

	/*
		Property: pointerPlacement
			Defines pointer connection side or corner.

		Default:
			<chartDiag.default.PlacementType.Auto>
	*/
	this.pointerPlacement = 0/*chartDiag.default.PlacementType.Auto*/;

	/*
	Property: position
		Defines callout body position. 
		
	Type:
		<chartDiag.default.Rect>.
	*/
	this.position = null;

	/*
	Property: snapPoint
		Callout snap point. 
		
	Type:
		<chartDiag.default.Point>.
	*/
	this.snapPoint = null;

	/*
	Property: cornerRadius
		Body corner radius in percents or pixels. 
	*/
	this.cornerRadius = "10%";

	/*
	Property: offset
		Body rectangle offset. 
	*/
	this.offset = 0;

	/*
	Property: opacity
		Background color opacity. 
	*/
	this.opacity = 1;

	/*
	Property: lineWidth
		Border line width. 
	*/
	this.lineWidth = 1;

	/*
	Property: lineType
		Connector's line pattern.

	Default:
		<chartDiag.default.LineType.Solid>
	*/
	this.lineType = 0/*chartDiag.default.LineType.Solid*/;

	/*
	Property: pointerWidth
		Pointer base width in percents or pixels. 
	*/
	this.pointerWidth = "10%";

	/*
	Property: borderColor
		Border Color. 
	
	Default:
		<chartDiag.default.Colors.Black>
	*/
	this.borderColor = "#000000"/*chartDiag.default.Colors.Black*/;

	/*
	Property: fillColor
		Fill Color. 
		
	Default:
		<chartDiag.default.Colors.Gray>
	*/
	this.fillColor = "#d3d3d3"/*chartDiag.default.Colors.LightGray*/;

	/*
	method: update
		Makes full redraw of callout widget contents reevaluating all options.
	*/
};

/* /Widgets/callout/controllers/Controller.js*/
chartDiag.callout.Controller = function () {
	this.widgetEventPrefix = "bpcallout";

	this.options = new chartDiag.callout.Config();

	this.m_placeholder = null;
	this.m_panelSize = null;

	this.m_graphics = null;

	this.m_shape = null;
};

chartDiag.callout.Controller.prototype._create = function () {
	this.element
			.addClass("ui-widget");

	this._createLayout();

	this._redraw();
};

chartDiag.callout.Controller.prototype.destroy = function () {
	this._cleanLayout();
};

chartDiag.callout.Controller.prototype._createLayout = function () {
	this.m_panelSize = new chartDiag.default.Rect(0, 0, this.element.outerWidth(), this.element.outerHeight());

	this.m_placeholder = jQuery('<div></div>');
	this.m_placeholder.css({
		"position": "relative",
		"overflow": "hidden",
		"top": "0px",
		"left": "0px",
		"padding": "0px",
		"margin": "0px"
	});
	this.m_placeholder.css(this.m_panelSize.getCSS());
	this.m_placeholder.addClass("placeholder");
	this.m_placeholder.addClass(this.widgetEventPrefix);

	this.element.append(this.m_placeholder);

	this.m_graphics = chartDiag.default.createGraphics(this.options.graphicsType, this.element);

	this.options.actualGraphicsType = this.m_graphics.graphicsType;

	this.m_shape = new chartDiag.default.Callout(this.m_graphics);
};

chartDiag.callout.Controller.prototype._cleanLayout = function () {
	if (this.m_graphics !== null) {
		this.m_graphics.clean();
	}
	this.m_graphics = null;

	this.element.find("." + this.widgetEventPrefix).remove();
};

chartDiag.callout.Controller.prototype._updateLayout = function () {
	this.m_panelSize = new chartDiag.default.Rect(0, 0, this.element.innerWidth(), this.element.innerHeight());
	this.m_placeholder.css(this.m_panelSize.getCSS());
};

chartDiag.callout.Controller.prototype.update = function (recreate) {
	if (recreate) {
		this._cleanLayout();
		this._createLayout();
		this._redraw();
	}
	else {
		this._updateLayout();
		this.m_graphics.resize("placeholder", this.m_panelSize.width, this.m_panelSize.height);
		this.m_graphics.begin();
		this._redraw();
		this.m_graphics.end();
	}
};

chartDiag.callout.Controller.prototype._redraw = function () {
	var names = ["pointerPlacement", "cornerRadius", "offset", "opacity", "lineWidth", "lineType", "pointerWidth", "borderColor", "fillColor"],
		index,
		name;
	this.m_graphics.activate("placeholder");
	for (index = 0; index < names.length; index += 1) {
		name = names[index];
		this.m_shape[name] = this.options[name];
	}
	this.m_shape.draw(this.options.snapPoint, this.options.position);
};

chartDiag.callout.Controller.prototype._setOption = function (key, value) {
	jQuery.Widget.prototype._setOption.apply(this, arguments);

	switch (key) {
		case "disabled":
			var handles = jQuery([]);
			if (value) {
				handles.filter(".ui-state-focus").blur();
				handles.removeClass("ui-state-hover");
				handles.propAttr("disabled", true);
				this.element.addClass("ui-disabled");
			} else {
				handles.propAttr("disabled", false);
				this.element.removeClass("ui-disabled");
			}
			break;
		default:
			break;
	}
};

/* /Widgets/callout/callout.js*/
/*
 * jQuery UI Callout
 *
 * Basic Charts Callout.
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */
if (typeof jQuery != "undefined") {
	(function ($) {
		$.widget("ui.bpCallout", new chartDiag.callout.Controller());
	}(jQuery));
};

/* /Widgets/connector/configs/Config.js*/
/*
	Class: chartDiag.connector.Config
		Connector options class.
	
*/
chartDiag.connector.Config = function () {
	this.classPrefix = "bpconnector";

	/*
		Property: graphicsType
			Preferable graphics type. If preferred graphics type is not supported widget switches to first available. 

		Default:
			<chartDiag.default.GraphicsType.SVG>
	*/
	this.graphicsType = 1/*chartDiag.default.GraphicsType.Canvas*/;

	/*
	Property: actualGraphicsType
		Actual graphics type.
	*/
	this.actualGraphicsType = null;

	/*
		Property: orientationType
			Diagram orientation. 

		Default:
			<chartDiag.default.OrientationType.Top>
	*/
	this.orientationType = 0/*chartDiag.default.OrientationType.Top*/;

	/*
		Property: connectorPlacementType
			Defines connector annotation shape placement mode between two rectangles. 
			It uses off beat placement mode as default in order to avoid overlapping
			of base hierarchy connector lines.

		Default:
			<chartDiag.default.ConnectorPlacementType.Offbeat>
	*/
	this.connectorPlacementType = 0/*chartDiag.default.ConnectorPlacementType.Offbeat*/;

	/*
		Property: connectorShapeType
			Connector shape type. 

		Default:
			<chartDiag.default.ConnectorShapeType.OneWay>
	*/
	this.connectorShapeType = 0/*chartDiag.default.ConnectorShapeType.OneWay*/;

	/*
	Property: position
		Defines connectors starting rectangle position. 
		
	Type:
		<chartDiag.default.Rect>.
	*/
	this.fromRectangle = null;

	/*
	Property: position
		Defines connectors ending rectangle position. 
		
	Type:
		<chartDiag.default.Rect>.
	*/
	this.toRectangle = null;


	/*
	Property: offset
		Connector's from and to points offset off the rectangles side. Connectors connection points can be outside of rectangles and inside for negative offset value.
	See also:
		<chartDiag.default.Thickness>
	*/
	this.offset = new chartDiag.default.Thickness(0, 0, 0, 0);

	/*
	Property: lineWidth
		Border line width. 
	*/
	this.lineWidth = 3;

	/*
	Property: color
		Connector's color.
	
	Default:
		<chartDiag.default.Colors.Black>
	*/
	this.color = "#000000"/*chartDiag.default.Colors.Black*/;

	/*
	Property: lineType
		Connector's line pattern.

	Default:
		<chartDiag.default.LineType.Solid>
	*/
	this.lineType = 0/*chartDiag.default.LineType.Solid*/;


	/*
	Property: label
		Annotation label text. Label styled with css class name "bp-connector-label".
	*/
	this.label = null;

	/*
	Property: labelSize
		Defines label size. It is needed to preserve space for label without overlapping connected items.

	Default:
		new <chartDiag.default.Size>(60, 30);
	*/
	this.labelSize = new chartDiag.default.Size(60, 30);

	/*
	Property: labelPlacementType
		Defines conector label placement. Label can be placed between rectangles along connector line or close to one of them.

	Default:
		new <chartDiag.default.Size>(60, 30);
	*/
	this.labelPlacementType = 1/*chartDiag.default.ConnectorLabelPlacementType.Between*/;

	/*
	method: update
		Makes full redraw of connector widget contents reevaluating all options.
	*/
};

/* /Widgets/connector/controllers/AnnotationLabelTemplate.js*/
chartDiag.connector.AnnotationLabelTemplate = function (options) {
	var _template = create(),
		_hashCode = chartDiag.default.hashCode(_template);

	function create() {
		var template = jQuery('<div></div>');
		template.addClass("bp-item bp-corner-all bp-connector-label");

		return template.wrap('<div>').parent().html();
	}

	function template() {
		return _template;
	}

	function getHashCode() {
		return _hashCode;
	}

	function render(event, data) {
		data.element.html(options.label);
	}

	return {
		template: template,
		getHashCode: getHashCode,
		render: render
	};
};


/* /Widgets/connector/controllers/Controller.js*/
chartDiag.connector.Controller = function () {
	this.widgetEventPrefix = "bpconnector";

	this.options = new chartDiag.connector.Config();

	this._placeholder = null;
	this._panelSize = null;
	this._graphics = null;
	this._labelTemplate = null;
};

chartDiag.connector.Controller.prototype._create = function () {
	var self = this;

	this.element
			.addClass("ui-widget");

	this._labelTemplate = chartDiag.connector.AnnotationLabelTemplate(this.options);

	this._createLayout();

	this._redraw();
};

chartDiag.connector.Controller.prototype.destroy = function () {
	this._cleanLayout();
};

chartDiag.connector.Controller.prototype._createLayout = function () {
	this._panelSize = new chartDiag.default.Rect(0, 0, this.element.outerWidth(), this.element.outerHeight());

	this._placeholder = jQuery('<div></div>');
	this._placeholder.css({
		"position": "relative",
		"overflow": "hidden",
		"top": "0px",
		"left": "0px",
		"padding": "0px",
		"margin": "0px"
	});
	this._placeholder.css(this._panelSize.getCSS());
	this._placeholder.addClass("placeholder");
	this._placeholder.addClass(this.widgetEventPrefix);

	this.element.append(this._placeholder);

	this._graphics = chartDiag.default.createGraphics(this.options.graphicsType, this.element);

	this.options.actualGraphicsType = this._graphics.graphicsType;
};

chartDiag.connector.Controller.prototype._cleanLayout = function () {
	if (this._graphics !== null) {
		this._graphics.clean();
	}
	this._graphics = null;

	this.element.find("." + this.widgetEventPrefix).remove();
};

chartDiag.connector.Controller.prototype._updateLayout = function () {
	this._panelSize = new chartDiag.default.Rect(0, 0, this.element.innerWidth(), this.element.innerHeight());
	this._placeholder.css(this._panelSize.getCSS());
};

chartDiag.connector.Controller.prototype.update = function (recreate) {
	if (recreate) {
		this._cleanLayout();
		this._createLayout();
		this._redraw();
	}
	else {
		this._updateLayout();
		this._graphics.resize("placeholder", this._panelSize.width, this._panelSize.height);
		this._graphics.begin();
		this._redraw();
		this._graphics.end();
	}
};

chartDiag.connector.Controller.prototype._redraw = function () {
	var annotationConfig = this.options,
		shape,
		uiHash,
		transform = new chartDiag.default.Transform(),
		panel = this._graphics.activate("placeholder"),
		buffer = new chartDiag.default.PolylinesBuffer(),
		self = this,
		connectorAnnotationOffsetResolver = chartDiag.orgChart.ConnectorAnnotationOffsetResolver();

	transform.size = new chartDiag.default.Size(this._panelSize.width, this._panelSize.height);
	transform.setOrientation(annotationConfig.orientationType);

	if (annotationConfig.fromRectangle != null && annotationConfig.toRectangle != null) {
		var fromRect = annotationConfig.fromRectangle,
			toRect = annotationConfig.toRectangle;

		/* translate rectangles to Top orientation */
		/* from rectangle */
		transform.transformRect(fromRect.x, fromRect.y, fromRect.width, fromRect.height, false,
			this, function (x, y, width, height) {
				fromRect = new chartDiag.default.Rect(x, y, width, height);
			});

		/* to rectangle */
		transform.transformRect(toRect.x, toRect.y, toRect.width, toRect.height, false,
			this, function (x, y, width, height) {
				toRect = new chartDiag.default.Rect(x, y, width, height);
			});

		switch (annotationConfig.connectorPlacementType) {
			case 0/*chartDiag.default.ConnectorPlacementType.Offbeat*/:
				shape = new chartDiag.default.ConnectorOffbeat();
				break;
			case 1/*chartDiag.default.ConnectorPlacementType.Straight*/:
				shape = new chartDiag.default.ConnectorStraight();
				break;
		}

		/* rotate label size to user orientation */
		var labelSize;
		transform.transformRect(0, 0, annotationConfig.labelSize.width, annotationConfig.labelSize.height, false,
		this, function (x, y, width, height) {
			labelSize = new chartDiag.default.Size(width, height);
		});

		/* rotate panel size to user orientation */
		var panelSize = null;
		transform.transformRect(0, 0, panel.size.width, panel.size.height, false,
		this, function (x, y, width, height) {
			panelSize = new chartDiag.default.Size(width, height);
		});

		var linePaletteItem = new chartDiag.default.PaletteItem({
			lineColor: annotationConfig.color,
			lineWidth: annotationConfig.lineWidth,
			lineType: annotationConfig.lineType
		});

		var hasLabel = !chartDiag.default.isNullOrEmpty(annotationConfig.label);

		/* offset rectangles */
		fromRect = new chartDiag.default.Rect(fromRect).offset(annotationConfig.offset);
		toRect = new chartDiag.default.Rect(toRect).offset(annotationConfig.offset);

		var linesOffset = annotationConfig.lineWidth * 6;

		/* create connection lines */
		shape.draw(buffer, linePaletteItem, fromRect, toRect, linesOffset, 0, labelSize, panelSize,
			annotationConfig.connectorShapeType, 4 /*labelOffset*/, annotationConfig.labelPlacementType, hasLabel,
			connectorAnnotationOffsetResolver, function (labelPlacement) {
				if (hasLabel && labelPlacement != null) {
					/* translate result label placement back to users orientation */
					transform.transformRect(labelPlacement.x, labelPlacement.y, labelPlacement.width, labelPlacement.height, true,
						self, function (x, y, width, height) {
							labelPlacement = new chartDiag.default.Rect(x, y, width, height);
						});

					uiHash = new chartDiag.default.RenderEventArgs();
					uiHash.context = annotationConfig;

					/* draw label */
					self._graphics.template(
						labelPlacement.x
						, labelPlacement.y
						, 0
						, 0
						, 0
						, 0
						, labelPlacement.width
						, labelPlacement.height
						, self._labelTemplate.template()
						, self._labelTemplate.getHashCode()
						, self._labelTemplate.render
						, uiHash
						, null
					);
				}
			});
		connectorAnnotationOffsetResolver.resolve();
	}

	/* translate result polylines back to users orientation */
	buffer.transform(transform, true);
	/* draw background polylines */
	this._graphics.polylinesBuffer(buffer);

};

chartDiag.connector.Controller.prototype._setOption = function (key, value) {
	jQuery.Widget.prototype._setOption.apply(this, arguments);

	switch (key) {
		case "disabled":
			var handles = jQuery([]);
			if (value) {
				handles.filter(".ui-state-focus").blur();
				handles.removeClass("ui-state-hover");
				handles.propAttr("disabled", true);
				this.element.addClass("ui-disabled");
			} else {
				handles.propAttr("disabled", false);
				this.element.removeClass("ui-disabled");
			}
			break;
		default:
			break;
	}
};

/* /Widgets/connector/connector.js*/
/*
 * jQuery UI Connector
 *
 * Basic Charts Connector.
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */
if (typeof jQuery != "undefined") {
	(function ($) {
		$.widget("ui.bpConnector", new chartDiag.connector.Controller());
	}(jQuery));
};

/* /Widgets/diagrams/Widget.js*/
chartDiag.orgChart.Widget = function (Config, controlFactory) {
	this.widgetEventPrefix = "orgChart";

	this.options = new Config();

	this.control = null;

	this.controlFactory = controlFactory;
};

chartDiag.orgChart.Widget.prototype._create = function () {
	this.element.addClass("ui-widget");

	this.control = new this.controlFactory(this.element, this._readOptions(this.options));
};

chartDiag.orgChart.Widget.prototype.destroy = function () {
	this.control.destroy();
};

chartDiag.orgChart.Widget.prototype.update = function (updateMode) {
	this.control.update(updateMode);
};

chartDiag.orgChart.Widget.prototype._setOption = function (key, value) {
	jQuery.Widget.prototype._setOption.apply(this, arguments);

	switch (key) {
		case "disabled":
			var handles = jQuery([]);
			if (value) {
				handles.filter(".ui-state-focus").blur();
				handles.removeClass("ui-state-hover");
				handles.propAttr("disabled", true);
				this.element.addClass("ui-disabled");
			} else {
				handles.propAttr("disabled", false);
				this.element.removeClass("ui-disabled");
			}
			break;
		default:
			break;
	}

	this.control.setOptions(this._readOptions(this.options));
};

chartDiag.orgChart.Widget.prototype._readOptions = function (options) {
	var result = {},
		self = this;
	/* shallow copy */
	for (var property in options) {
		if (options.hasOwnProperty(property)) {
			switch(property) {
				case 'onHighlightChanged':
				case 'onCursorChanged':
				case 'onSelectionChanging':
				case 'onButtonClick':
				case 'onMouseClick':
				case 'onMouseDblClick':
				case 'onItemRender':
				case 'onHighlightRender':
					result[property] = function(property) { 
						return function (event, eventArgs) {
							self._trigger(property, event, eventArgs);
						};
					}(property);
					break;
				case 'onHighlightChanging':
					result[property] = function (event, eventArgs) {
						var options = self.control.getOptions();
						self.options.highlightItem = options.highlightItem;

						self._trigger("onHighlightChanging", event, eventArgs);
					};
					break;
				case 'onCursorChanging':
					result[property] = function (event, eventArgs) {
						var options = self.control.getOptions();
						self.options.cursorItem = options.cursorItem;

						self._trigger("onCursorChanging", event, eventArgs);
					};
					break;
				case 'onSelectionChanged':
					result[property] = function (event, eventArgs) {
						var options = self.control.getOptions();
						self.options.selectedItems = options.selectedItems;

						self._trigger("onSelectionChanged", event, eventArgs);
					};
					break;
				default:
					result[property] = options[property];
					break;
			}
		}
	}
	return result;
};

/* /Widgets/diagrams/orgDiagram.js*/
/*
 * jQuery UI Diagram
 *
 * Basic Charts organization diagram.
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */
if (typeof jQuery != "undefined") {
	(function ($) {
		$.widget("ui.orgDiagram", new chartDiag.orgChart.Widget(chartDiag.orgChart.Config, chartDiag.orgChart.Control));
	}(jQuery));
};

/* /Widgets/diagrams/famDiagram.js*/
/*
 * jQuery UI Diagram
 *
 * Basic Charts family diagram.
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */
if (typeof jQuery != "undefined") {
	(function ($) {
		$.widget("ui.famDiagram", new chartDiag.orgChart.Widget(chartDiag.famChart.Config, chartDiag.famChart.Control));
	}(jQuery));
};

/* /Widgets/shape/configs/Config.js*/
/*
	Class: chartDiag.connector.Config
		Connector options class.
	
*/
chartDiag.shape.Config = function () {
	this.classPrefix = "bpconnector";

	/*
		Property: graphicsType
			Preferable graphics type. If preferred graphics type is not supported widget switches to first available. 

		Default:
			<chartDiag.default.GraphicsType.SVG>
	*/
	this.graphicsType = 1/*chartDiag.default.GraphicsType.Canvas*/;

	/*
	Property: actualGraphicsType
		Actual graphics type.
	*/
	this.actualGraphicsType = null;

	/*
		Property: orientationType
			Diagram orientation. 

		Default:
			<chartDiag.default.OrientationType.Top>
	*/
	this.orientationType = 0/*chartDiag.default.OrientationType.Top*/;

	/*
		Property: shapeType
			Shape type. 

		Default:
			<chartDiag.default.ShapeType.Rectangle>
	*/
	this.shapeType = 0/*chartDiag.default.ShapeType.Rectangle*/;

	/*
	Property: position
		Defines shapes rectangle position. 
		
	Type:
		<chartDiag.default.Rect>.
	*/
	this.position = null;

	/*
	Property: offset
		Connector's from and to points offset off the rectangles side. Connectors connection points can be outside of rectangles and inside for negative offset value.
	See also:
		<chartDiag.default.Thickness>
	*/
	this.offset = new chartDiag.default.Thickness(0, 0, 0, 0);

	/*
	Property: lineWidth
		Border line width. 
	*/
	this.lineWidth = 2;

	/*
	Property: cornerRadius
		Body corner radius in percents or pixels. 
	*/
	this.cornerRadius = "10%";

	/*
	Property: opacity
		Background color opacity. 
	*/
	this.opacity = 1;

	/*
	Property: borderColor
		Shape border line color.
	
	Default:
		<chartDiag.default.Colors.Black>
	*/
	this.borderColor = null;

	/*
	Property: fillColor
		Fill Color. 
	
	Default:
		<chartDiag.default.Colors.Gray>
	*/
	this.fillColor = null;

	/*
	Property: lineType
		Connector's line pattern.

	Default:
		<chartDiag.default.LineType.Solid>
	*/
	this.lineType = 0/*chartDiag.default.LineType.Solid*/;


	/*
	Property: label
		Annotation label text. Label styled with css class name "bp-connector-label".
	*/
	this.label = null;

	/*
	Property: labelSize
		Defines label size. It is needed to preserve space for label without overlapping connected items.

	Default:
		new <chartDiag.default.Size>(60, 30);
	*/
	this.labelSize = new chartDiag.default.Size(60, 30);

	/*
	Property: labelPlacement
		Defines label placement relative to the shape. 

	See Also:
		<chartDiag.orgChart.Config.labelPlacement>
		<chartDiag.default.PlacementType>

	Default:
		<chartDiag.default.PlacementType.Auto>
	*/
	this.labelPlacement = 0/*chartDiag.default.PlacementType.Auto*/;

	/*
	Property: labelOffset
		Defines label offset from shape in pixels.

	Default:
		4;
	*/
	this.labelOffset = 4;

	/*
	method: update
		Makes full redraw of connector widget contents reevaluating all options.
	*/
};

/* /Widgets/shape/controllers/AnnotationLabelTemplate.js*/
chartDiag.shape.AnnotationLabelTemplate = function (options) {
	var _template = create(),
		_hashCode = chartDiag.default.hashCode(_template);

	function create() {
		var template = jQuery('<div></div>');
		template.addClass("bp-item bp-corner-all bp-connector-label");

		return template.wrap('<div>').parent().html();
	}

	function template() {
		return _template;
	}

	function getHashCode() {
		return _hashCode;
	}

	function render(event, data) {
		data.element.html(options.label);
	}

	return {
		template: template,
		getHashCode: getHashCode,
		render: render
	};
};


/* /Widgets/shape/controllers/Controller.js*/
chartDiag.shape.Controller = function () {
	this.widgetEventPrefix = "bpshape";

	this.options = new chartDiag.shape.Config();

	this.m_placeholder = null;
	this.m_panelSize = null;

	this.m_graphics = null;

	this.m_shape = null;

	this._labelTemplate = null;
};

chartDiag.shape.Controller.prototype._create = function () {
	var self = this;

	this.element
			.addClass("ui-widget");

	this._labelTemplate = chartDiag.shape.AnnotationLabelTemplate(this.options);

	this._createLayout();

	this._redraw();
};

chartDiag.shape.Controller.prototype.destroy = function () {
	this._cleanLayout();
};

chartDiag.shape.Controller.prototype._createLayout = function () {
	this.m_panelSize = new chartDiag.default.Rect(0, 0, this.element.outerWidth(), this.element.outerHeight());

	this.m_placeholder = jQuery('<div></div>');
	this.m_placeholder.css({
		"position": "relative",
		"overflow": "hidden",
		"top": "0px",
		"left": "0px",
		"padding": "0px",
		"margin": "0px"
	});
	this.m_placeholder.css(this.m_panelSize.getCSS());
	this.m_placeholder.addClass("placeholder");
	this.m_placeholder.addClass(this.widgetEventPrefix);

	this.element.append(this.m_placeholder);

	this.m_graphics = chartDiag.default.createGraphics(this.options.graphicsType, this.element);

	this.options.actualGraphicsType = this.m_graphics.graphicsType;
};

chartDiag.shape.Controller.prototype._cleanLayout = function () {
	if (this.m_graphics !== null) {
		this.m_graphics.clean();
	}
	this.m_graphics = null;

	this.element.find("." + this.widgetEventPrefix).remove();
};

chartDiag.shape.Controller.prototype._updateLayout = function () {
	this.m_panelSize = new chartDiag.default.Rect(0, 0, this.element.innerWidth(), this.element.innerHeight());
	this.m_placeholder.css(this.m_panelSize.getCSS());
};

chartDiag.shape.Controller.prototype.update = function (recreate) {
	if (recreate) {
		this._cleanLayout();
		this._createLayout();
		this._redraw();
	}
	else {
		this._updateLayout();
		this.m_graphics.resize("placeholder", this.m_panelSize.width, this.m_panelSize.height);
		this.m_graphics.begin();
		this._redraw();
		this.m_graphics.end();
	}
};

chartDiag.shape.Controller.prototype._redraw = function () {
	var names = ["orientationType", "shapeType", "offset", "lineWidth", "borderColor", "lineType", "labelSize", "labelOffset", "labelPlacement", "cornerRadius", "opacity", "fillColor"],
		index,
		name;
	this.m_graphics.activate("placeholder");

	this.m_shape = new chartDiag.default.Shape(this.m_graphics);
	for (index = 0; index < names.length; index += 1) {
		name = names[index];
		this.m_shape[name] = this.options[name];
	}
	this.m_shape.hasLabel = !chartDiag.default.isNullOrEmpty(this.options.label);
	this.m_shape.labelTemplate = this._labelTemplate;
	this.m_shape.panelSize = new chartDiag.default.Size(this.m_panelSize.width, this.m_panelSize.height);
	this.m_shape.draw(this.options.position);
};

chartDiag.shape.Controller.prototype._setOption = function (key, value) {
	jQuery.Widget.prototype._setOption.apply(this, arguments);

	switch (key) {
		case "disabled":
			var handles = jQuery([]);
			if (value) {
				handles.filter(".ui-state-focus").blur();
				handles.removeClass("ui-state-hover");
				handles.propAttr("disabled", true);
				this.element.addClass("ui-disabled");
			} else {
				handles.propAttr("disabled", false);
				this.element.removeClass("ui-disabled");
			}
			break;
		default:
			break;
	}
};

/* /Widgets/shape/shape.js*/
/*
 * jQuery UI Shape
 *
 * Basic Charts Shape.
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */
if (typeof jQuery != "undefined") {
	(function ($) {
		$.widget("ui.bpShape", new chartDiag.shape.Controller());
	}(jQuery));
};

/* /Widgets/text/configs/Config.js*/
/*
	Class: chartDiag.text.Config
		Text options class.
	
*/
chartDiag.text.Config = function () {
	this.classPrefix = "bptext";

	/*
		Property: graphicsType
			Preferable graphics type. If preferred graphics type is not supported widget switches to first available. 

		Default:
			<chartDiag.default.GraphicsType.SVG>
	*/
	this.graphicsType = 0/*chartDiag.default.GraphicsType.SVG*/;

	/*
	Property: actualGraphicsType
		Actual graphics type.
	*/
	this.actualGraphicsType = null;

	/*
		Property: textDirection
			Direction style. 

		Default:
			<chartDiag.text.TextDirection.Auto>
	*/
	this.orientation = 0/*chartDiag.text.TextOrientationType.Horizontal*/;

	/*
		Property: text
			Text
	*/
	this.text = "";


	/*
		Property: verticalAlignment
			Vertical alignment. 

		Default:
			<chartDiag.default.VerticalAlignmentType.Center>
	*/
	this.verticalAlignment = 1/*chartDiag.default.VerticalAlignmentType.Middle*/;

	/*
		Property: horizontalAlignment
			Horizontal alignment. 

		Default:
			<chartDiag.default.HorizontalAlignmentType.Center>
	*/
	this.horizontalAlignment = 0/*chartDiag.default.HorizontalAlignmentType.Center*/;

	/*
		Property: fontSize
			Font size. 

		Default:
			15
	*/
	this.fontSize = "16px";

	/*
		Property: fontFamily
			Font family. 

		Default:
			"Arial"
	*/
	this.fontFamily = "Arial";

	/*
		Property: color
			Color. 

		Default:
			<chartDiag.default.Colors.Black>
	*/
	this.color = "#000000"/*chartDiag.default.Colors.Black*/;

	/*
		Property: Font weight.
			Font weight: normal | bold

		Default:
			"normal"
	*/
	this.fontWeight = "normal";

	/*
	Property: Font style.
		Font style: normal | italic
		
	Default:
		"normal"
	*/
	this.fontStyle = "normal";

	/*
	method: update
		Makes full redraw of text widget contents reevaluating all options.
	*/
};

/* /Widgets/text/controllers/Controller.js*/
chartDiag.text.Controller = function () {
	this.widgetEventPrefix = "bptext";

	this.options = new chartDiag.text.Config();

	this.m_placeholder = null;
	this.m_panelSize = null;

	this.m_graphics = null;
};

chartDiag.text.Controller.prototype._create = function () {
	this.element
			.addClass("ui-widget");

	this._createLayout();

	this._redraw();
};

chartDiag.text.Controller.prototype.destroy = function () {
	this._cleanLayout();
};

chartDiag.text.Controller.prototype._createLayout = function () {
	this.m_panelSize = new chartDiag.default.Rect(0, 0, this.element.outerWidth(), this.element.outerHeight());
		

	this.m_placeholder = jQuery('<div></div>');
	this.m_placeholder.css({
		"position": "relative",
		"overflow": "hidden",
		"top": "0px",
		"left": "0px",
		"padding": "0px",
		"margin": "0px"
	});
	this.m_placeholder.css(this.m_panelSize.getCSS());
	this.m_placeholder.addClass("placeholder");
	this.m_placeholder.addClass(this.widgetEventPrefix);

	this.element.append(this.m_placeholder);

	this.m_graphics = chartDiag.default.createGraphics(this.options.graphicsType, this.element);

	this.options.actualGraphicsType = this.m_graphics.graphicsType;
};

chartDiag.text.Controller.prototype._cleanLayout = function () {
	if (this.m_graphics !== null) {
		this.m_graphics.clean();
	}
	this.m_graphics = null;

	this.element.find("." + this.widgetEventPrefix).remove();
};

chartDiag.text.Controller.prototype._updateLayout = function () {
	this.m_panelSize = new chartDiag.default.Rect(0, 0, this.element.innerWidth(), this.element.innerHeight());
	this.m_placeholder.css(this.m_panelSize.getCSS());
};

chartDiag.text.Controller.prototype.update = function (recreate) {
	if (recreate) {
		this._cleanLayout();
		this._createLayout();
		this._redraw();
	}
	else {
		this._updateLayout();
		this.m_graphics.resize("placeholder", this.m_panelSize.width, this.m_panelSize.height);
		this.m_graphics.begin();
		this._redraw();
		this.m_graphics.end();
	}
};

chartDiag.text.Controller.prototype._redraw = function () {
	var panel = this.m_graphics.activate("placeholder"),
		attr = {
			"font-size": this.options.fontSize,
			"font-family": this.options.fontFamily,
			"font-style": this.options.fontStyle,
			"font-weight": this.options.fontWeight,
			"font-color": this.options.color
		};
	this.m_graphics.text(
	panel.rect.x,
	panel.rect.y,
	panel.rect.width,
	panel.rect.height,
	this.options.text,
	this.options.orientation,
	this.options.horizontalAlignment,
	this.options.verticalAlignment,
	attr
	);
};

chartDiag.text.Controller.prototype._setOption = function (key, value) {
	jQuery.Widget.prototype._setOption.apply(this, arguments);

	switch (key) {
		case "disabled":
			var handles = jQuery([]);
			if (value) {
				handles.filter(".ui-state-focus").blur();
				handles.removeClass("ui-state-hover");
				handles.propAttr("disabled", true);
				this.element.addClass("ui-disabled");
			} else {
				handles.propAttr("disabled", false);
				this.element.removeClass("ui-disabled");
			}
			break;
		default:
			break;
	}
};

/* /Widgets/text/text.js*/
/*
 * jQuery UI Text
 *
 * Basic Charts Text.
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */
if (typeof jQuery != "undefined") {
	(function ($) {
		$.widget("ui.bpText", new chartDiag.text.Controller());
	}(jQuery));
};

