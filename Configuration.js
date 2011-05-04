(function(context){

var Configuration = context.Configuration = {};

Configuration.name = 'Lovely Scalable Drawings projects';

Configuration.presets = {
  'lsd': {
		sets: ['lsd'],
		source: ['lsd']
	}
};

Configuration.defaultPresets = {
	browser: 'lsd',
	nodejs: 'lsd',
	jstd: 'lsd'
};

Configuration.sets = {

	'lsd': {
		path: 'lsd/',
		files: [
		  'Module/Accessories/Attributes',
		  'Module/Accessories/Dimensions',
		  'Module/Accessories/Element',
		  'Module/Accessories/Events',
		  'Module/Accessories/Options',
		  'Module/Accessories/Shortcuts',
		  'Module/Accessories/States',
		  'Module/Accessories/Styles'
		//	'Layer/InnerShadow'
		]
	}
};


Configuration.source = {

	'lsd': {
		path: '../lsd/',
		files: [
		
    "../Sheet.js/Source/sg-regex-tools",
    "../Sheet.js/Source/SheetParser.CSS",
    "../Sheet.js/Source/Sheet",
    "../Sheet.js/Source/SheetParser.Property",
    "../Sheet.js/Source/SheetParser.Styles",
    "../Sheet.js/Source/SheetParser.Value",
    "../mootools-core/Source/Slick/Slick.Parser",
    "../mootools-core/Source/Core/Core",
    "../mootools-speedups/Source/Core/Core.Speedups",
    "../mootools-core/Source/Types/Number",
    "../mootools-core/Source/Types/Function",
    "../mootools-core/Source/Types/Object",
    "../mootools-speedups/Source/Types/Object",
    "../mootools-core/Source/Types/Array",
    "../mootools-color/Source/Color",
    "../mootools-core/Source/Types/String",
    "../mootools-core/Source/Browser/Browser",
    "../mootools-mobile/Source/Browser/Features.Touch",
    "../mootools-core/Source/Types/Event",
    "../mootools-core/Source/Class/Class",
    "../mootools-speedups/Source/Core/Class.Speedups",
    "../mootools-ext/Source/Types/FastArray",
    "../mootools-core/Source/Class/Class.Extras",
    "../mootools-speedups/Source/Core/Class.Extras.Speedups",
    "../mootools-ext/Source/Core/Class.Includes",
    "../mootools-ext/Source/Core/Class.Shortcuts",
    "../mootools-ext/Source/Utilities/Observer",
    "../mootools-core/Source/Fx/Fx",
    "../mootools-ext/Source/Core/Class.Macros",
    "../mootools-ext/Source/Core/Class.States",
    "../mootools-ext/Source/Core/Class.Mixin",
    "../lsd/Source/LSD",
    "../lsd/Source/Command/Command",
    "../lsd/Source/Command/Radio",
    "../lsd/Source/Command/Checkbox",
    "../lsd/Source/Action",
    "../lsd/Source/Action/Send",
    "../lsd/Source/Action/Display",
    "../lsd/Source/Action/Dialog",
    "../lsd/Source/Action/Append",
    "../lsd/Source/Action/Clone",
    "../lsd/Source/Action/Update",
    "../lsd/Source/Action/Value",
    "../lsd/Source/Action/Delete",
    "../lsd/Source/Action/Create",
    "../lsd/Source/Action/Replace",
    "../lsd/Source/Action/Check",
    "../lsd/Source/Action/State",
    "../art/Source/ART",
    "../lsd/Source/ART/ART.Element",
    "../lsd/Source/ART/ART.Glyphs",
    "../art/Source/ART.Path",
    "../art/Source/ART.VML",
    "../art/Source/ART.SVG",
    "../lsd/Source/ART/ART.SVG",
    "../art/Source/ART.Base",
    "../lsd/Source/ART/ART.Shape.Ellipse",
    "../lsd/Source/ART/ART",
    "../lsd/Source/ART/ART.Shape.Flower",
    "../lsd/Source/ART/ART.Shape.Arrow",
    "../lsd/Source/ART/ART.Shape.Star",
    "../lsd/Source/ART/ART.Shape.Rectangle",
    "../mootools-core/Source/Utilities/JSON",
    "../mootools-string-inflections/Source/String.Inflections",
    "../lsd/Source/Interpolation",
    "../mootools-more/Source/More/More",
    "../mootools-more/Source/Class/Class.Binds",
    "../mootools-ext/Source/Core/Class.Binds.Remover",
    "../mootools-more/Source/Class/Events.Pseudos",
    "../mootools-more/Source/Types/Object.Extras",
    "../lsd/Source/Type",
    "../lsd/Source/Module/Behavior/Actions",
    "../lsd/Source/Module/Behavior/Chain",
    "../lsd/Source/Module/Accessories/Element",
    "../lsd/Source/Mixin/Value",
    "../lsd/Source/Mixin/Dialog",
    "../lsd/Source/Module/Accessories/Dimensions",
    "../lsd/Source/Module/Accessories/Options",
    "../lsd/Source/Trait/Observer",
    "../lsd/Source/Mixin/Placeholder",
    "../lsd/Source/Module/Accessories/Shortcuts",
    "../lsd/Source/Module/Graphics/Shape",
    "../lsd/Source/Trait/Fieldset",
    "../lsd/Source/Mixin/Position",
    "../lsd/Source/Module/Ambient/Relations",
    "../lsd/Source/Module/Behavior/Target",
    "../lsd/Source/Module/Accessories/Attributes",
    "../lsd/Source/Mixin/Validity",
    "../lsd/Source/Module/Accessories/States",
    "../lsd/Source/Layout",
    "../lsd/Source/Module/Ambient/Layout",
    "../mootools-more/Source/Locale/Locale",
    "../mootools-more/Source/Locale/Locale.en-US.Date",
    "../mootools-more/Source/Types/Date",
    "../lsd/Source/Trait/Date",
    "../mootools-more/Source/Types/String.QueryString",
    "../slick/Source/Slick.Parser",
    "../slick/Source/Slick.Finder",
    "../mootools-core/Source/Element/Element",
    "../mootools-ext/Source/Element/Element.onDispose",
    "../mootools-core/Source/Element/Element.Style",
    "../mootools-core/Source/Element/Element.Dimensions",
    "../mootools-more/Source/Element/Element.Measure",
    "../mootools-core/Source/Fx/Fx.CSS",
    "../lsd/Source/Fx",
    "../mootools-core/Source/Fx/Fx.Tween",
    "../lsd/Source/Trait/Animation",
    "../lsd/Source/Module/Accessories/Styles",
    "../lsd/Source/Layer",
    "../lsd/Source/Layer/Position",
    "../lsd/Source/Layer/Size",
    "../lsd/Source/Layer/Scale",
    "../lsd/Source/Layer/Offset",
    "../lsd/Source/Module/Graphics/Layers",
    "../lsd/Source/Layer/Color",
    "../lsd/Source/Layer/Stroke",
    "../lsd/Source/Layer/Shape",
    "../lsd/Source/Layer/Radius",
    "../mootools-ext/Source/Element/Properties/Widget",
    "../mootools-more/Source/Types/URI",
    "../mootools-core/Source/Element/Element.Event",
    "../mootools-custom-event/Source/Element.defineCustomEvent",
    "../mootools-mobile/Source/Touch/Touch",
    "../mootools-mobile/Source/Touch/Click",
    "../mootools-mobile/Source/Desktop/Mouse",
    "../lsd/Source/Mixin/Touchable",
    "../mootools-more/Source/Element/Element.Event.Pseudos",
    "../mootools-more/Source/Element/Element.Delegation",
    "../lsd/Source/Module/Accessories/Events",
    "../lsd/Source/Module/Accessories",
    "../lsd/Source/Module/Ambient/Expectations",
    "../lsd/Source/Module/Behavior/Command",
    "../lsd/Source/Module/Behavior",
    "../mootools-core/Source/Utilities/DOMReady",
    "../lsd/Source/Application",
    "../mootools-more/Source/Drag/Drag",
    "../mootools-ext/Source/Drag/Drag.Limits",
    "../lsd/Source/Mixin/Resizable",
    "../mootools-more/Source/Drag/Slider",
    "../mootools-ext/Source/Drag/Slider",
    "../lsd/Source/Trait/Slider",
    "../lsd/Source/Mixin/Draggable",
    "../lsd/Source/Module/Ambient/DOM",
    "../lsd/Source/Module/Graphics/Render",
    "../lsd/Source/Module/Graphics",
    "../lsd/Source/Module/Ambient/Container",
    "../lsd/Source/Module/Ambient/Proxies",
    "../lsd/Source/Module/Ambient",
    "../lsd/Source/Widget",
    "../lsd-widgets/Source/Button",
    "../lsd-widgets/Source/Scrollbar",
    "../lsd/Source/Mixin/Scrollable",
    "../lsd/Source/Native",
    "../lsd-native/Source/Anchor",
    "../lsd-widgets/Source/Menu",
    "../lsd-widgets/Source/Menu/Context",
    "../lsd/Source/Trait/Menu",
    "../lsd/Source/Document",
    "../lsd/Source/Document/Commands",
    "../lsd/Source/Document/Resizable",
    "../lsd-native/Source/Body",
    "../mootools-ext/Source/Element/Properties/BorderRadius",
    "../mootools-core/Source/Request/Request",
    "../mootools-ext/Source/Request/Request.Statuses",
    "../mootools-ext/Source/Request/Request.Headers",
    "../mootools-core/Source/Request/Request.JSON",
    "../mootools-core/Source/Request/Request.HTML",
    "../mootools-ext/Source/Request/Request.Auto",
    "../mootools-resource/Source/Resource",
    "../mootools-resource/Source/Resource.Model",
    "../mootools-resource/Source/Resource.Collection",
    "../mootools-resource/Source/Resource.Model.Actions",
    "../mootools-resource/Source/Resource.Parser",
    "../mootools-resource/Source/Resource.Parser.HTML",
    "../mootools-resource/Source/Resource.Parser.JSON",
    "../mootools-resource/Source/Resource.Parser.XML",
    "../lsd/Source/Mixin/Resource",
    "../mootools-ext/Source/Request/Request.Form",
    "../lsd/Source/Sheet",
    "../mootools-ext/Source/Element/Element.from",
    "../lsd/Source/Mixin/Request",
    "../lsd/Source/Trait/Form",
    "../lsd-native/Source/Form",
    "../lsd/Source/Action/Edit",
    "../mootools-ext/Source/Element/Properties/Item",
    "../lsd/Source/Trait/List",
    "../lsd/Source/Trait/Choice",
    "../mootools-ext/Source/Element/Properties/BoxShadow",
    "../lsd/Source/Layer/Shadow",
    "../lsd/Source/Layer/Shadow.Inset",
    "../lsd/Source/Layer/Shadow.Native",
    "../lsd/Source/Layer/Shadow.Onion",
    "../lsd/Source/Layer/Shadow.Blur",
    "../qfocuser/Source/QFocuser",
    "../lsd/Source/Mixin/Focus",
    "../lsd/Source/Trait/Input"
		]
	}

};

})(typeof exports != 'undefined' ? exports : this);
